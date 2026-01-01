/**
 * POST /api/markets/[id]/admin/resolve
 * 
 * Admin-only endpoint to resolve a market and set winner
 * Requires signed message from authorized admin wallet
 * 
 * Route parameters:
 * - id: string - Market ID
 * 
 * Request body:
 * {
 *   winner: "YES" | "NO"
 *   signature: string                  // Signed message from admin
 *   message: string                    // Message that was signed
 *   adminAddress: string               // Admin's wallet address
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   marketId?: string
 *   winner?: "YES" | "NO"
 *   totalBets?: number
 *   yesPool?: string (USDT)
 *   noPool?: string (USDT)
 *   error?: string
 *   code?: string
 * }
 */

import { BET_LIMITS } from "@/lib/config/constants";
import { db } from "@/lib/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Hex, isAddress, recoverMessageAddress } from "viem";

// ============================================================================
// ADMIN CONFIGURATION
// ============================================================================

/**
 * Authorized admin addresses
 * Load from environment variable or hardcode for testing
 */
const ADMIN_ADDRESSES = (
    process.env.ADMIN_ADDRESSES || ""
)
    .split(",")
    .map((addr) => addr.trim().toLowerCase())
    .filter(Boolean);

// Fallback for testing (remove in production)
if (ADMIN_ADDRESSES.length === 0 && process.env.NODE_ENV !== "production") {
    console.warn("⚠️  No ADMIN_ADDRESSES configured. Admin endpoints will be disabled.");
}

// ============================================================================
// RATE LIMITING (PER ADMIN)
// ============================================================================

const adminRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkAdminRateLimit(adminAddress: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = `admin-resolve:${adminAddress.toLowerCase()}`;
    const entry = adminRateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        adminRateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (entry.count < limit) {
        entry.count++;
        return true;
    }

    return false;
}

// Cleanup every 5 minutes
if (typeof window === "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of adminRateLimitMap.entries()) {
            if (now > entry.resetTime) {
                adminRateLimitMap.delete(key);
            }
        }
    }, 300000);
}

// ============================================================================
// LOGGER
// ============================================================================

interface LogContext {
    marketId?: string;
    adminAddress?: string;
    winner?: string;
    totalBets?: number;
    error?: string;
    errorCode?: string;
    duration?: number;
}

function logInfo(message: string, context: Partial<LogContext>) {
    const timestamp = new Date().toISOString();
    console.log(
        `[${timestamp}] [MARKET-RESOLVE] ${message}`,
        JSON.stringify({
            ...context,
            adminAddress: context.adminAddress?.slice(0, 8),
        })
    );
}

function logError(message: string, context: Partial<LogContext>) {
    const timestamp = new Date().toISOString();
    console.error(
        `[${timestamp}] [MARKET-RESOLVE] ❌ ${message}`,
        JSON.stringify({
            ...context,
            adminAddress: context.adminAddress?.slice(0, 8),
        })
    );

    // TODO: Integrate with Sentry
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(new Error(message), { extra: context });
    // }
}

// ============================================================================
// SIGNATURE VERIFICATION
// ============================================================================

/**
 * Verify admin signature
 */
async function verifyAdminSignature(
    message: string,
    signature: string,
    expectedAdmin: string
): Promise<{ isValid: boolean; recoveredAddress?: string; error?: string }> {
    try {
        // Recover signer from message and signature
        const recoveredAddress = await recoverMessageAddress({
            message,
            signature: signature as Hex,
        });

        const recoveredLower = recoveredAddress.toLowerCase();
        const expectedLower = expectedAdmin.toLowerCase();

        if (recoveredLower !== expectedLower) {
            return {
                isValid: false,
                recoveredAddress,
                error: `Signature does not match admin address. Recovered: ${recoveredAddress}`,
            };
        }

        return {
            isValid: true,
            recoveredAddress,
        };
    } catch (error) {
        return {
            isValid: false,
            error: `Failed to verify signature: ${(error as Error).message}`,
        };
    }
}

/**
 * Validate message contains expected data
 */
function validateMessageContent(
    message: string,
    marketId: string,
    winner: string
): boolean {
    // Message should contain market ID and winner
    return (
        message.includes(marketId) &&
        message.includes(winner) &&
        message.includes("resolve")
    );
}

// ============================================================================
// REQUEST VALIDATION
// ============================================================================

function validateRequest(body: any): {
    isValid: boolean;
    winner?: string;
    signature?: string;
    message?: string;
    adminAddress?: string;
    error?: string;
} {
    if (!body.winner || (body.winner !== "YES" && body.winner !== "NO")) {
        return {
            isValid: false,
            error: "winner must be YES or NO",
        };
    }

    if (!body.signature || typeof body.signature !== "string") {
        return {
            isValid: false,
            error: "signature is required and must be a string",
        };
    }

    if (!body.message || typeof body.message !== "string") {
        return {
            isValid: false,
            error: "message is required and must be a string",
        };
    }

    if (!body.adminAddress || !isAddress(body.adminAddress)) {
        return {
            isValid: false,
            error: "adminAddress is required and must be a valid Ethereum address",
        };
    }

    return {
        isValid: true,
        winner: body.winner,
        signature: body.signature,
        message: body.message,
        adminAddress: body.adminAddress,
    };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const startTime = Date.now();
    const { id: marketId } = await params;

    try {
        // ====== STEP 1: Check if admin endpoints are enabled ======
        if (ADMIN_ADDRESSES.length === 0) {
            logError("Admin endpoints disabled", {
                marketId,
                error: "NO_ADMIN_CONFIGURED",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Admin endpoints are not configured",
                    code: "ADMIN_DISABLED",
                },
                { status: 503 }
            );
        }

        // ====== STEP 2: Parse & validate request body ======
        let body: any;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid JSON in request body",
                    code: "INVALID_REQUEST",
                },
                { status: 400 }
            );
        }

        const validation = validateRequest(body);
        if (!validation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: validation.error,
                    code: "VALIDATION_ERROR",
                },
                { status: 400 }
            );
        }

        const { winner, signature, message, adminAddress } = validation;

        logInfo("Market resolution requested", {
            marketId,
            adminAddress,
            winner,
        });

        // ====== STEP 3: Verify admin is authorized ======
        const adminLower = adminAddress!.toLowerCase();
        if (!ADMIN_ADDRESSES.includes(adminLower)) {
            logError("Unauthorized admin attempted resolution", {
                marketId,
                adminAddress,
                error: "UNAUTHORIZED_ADMIN",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "You are not authorized to resolve markets",
                    code: "UNAUTHORIZED",
                },
                { status: 403 }
            );
        }

        // ====== STEP 4: Check admin rate limit ======
        if (!checkAdminRateLimit(adminAddress!, 10, 60000)) {
            logError("Admin rate limit exceeded", {
                marketId,
                adminAddress,
                error: "RATE_LIMIT_EXCEEDED",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Rate limit exceeded. Maximum 10 resolutions per minute.",
                    code: "RATE_LIMIT_EXCEEDED",
                },
                { status: 429 }
            );
        }

        // ====== STEP 5: Verify signature ======
        const sigVerification = await verifyAdminSignature(
            message!,
            signature!,
            adminAddress!
        );

        if (!sigVerification.isValid) {
            logError("Signature verification failed", {
                marketId,
                adminAddress,
                error: sigVerification.error,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: sigVerification.error || "Signature verification failed",
                    code: "INVALID_SIGNATURE",
                },
                { status: 401 }
            );
        }

        // ====== STEP 6: Validate message content ======
        if (!validateMessageContent(message!, marketId, winner!)) {
            logError("Message content invalid", {
                marketId,
                adminAddress,
                error: "MESSAGE_INVALID",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Message does not contain expected market ID and winner",
                    code: "INVALID_MESSAGE",
                },
                { status: 400 }
            );
        }

        // ====== STEP 7: Fetch market from database ======
        const market = await db.market.findUnique({
            where: { marketId },
        });

        if (!market) {
            logError("Market not found", {
                marketId,
                adminAddress,
                error: "MARKET_NOT_FOUND",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Market not found",
                    code: "MARKET_NOT_FOUND",
                },
                { status: 404 }
            );
        }

        // ====== STEP 8: Validate market state ======
        if (market.status === "RESOLVED") {
            logError("Market already resolved", {
                marketId,
                adminAddress,
                error: "ALREADY_RESOLVED",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Market has already been resolved",
                    code: "ALREADY_RESOLVED",
                },
                { status: 400 }
            );
        }

        if (market.status !== "CLOSED") {
            logError("Market is not closed", {
                marketId,
                adminAddress,
                error: "NOT_CLOSED",
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Market must be CLOSED before resolution",
                    code: "INVALID_STATUS",
                },
                { status: 400 }
            );
        }

        // ====== STEP 9: Resolve market ======
        const resolvedMarket = await db.market.update({
            where: { marketId },
            data: {
                status: "RESOLVED",
                winner: winner === "YES" ? "YES" : "NO",
                updatedAt: new Date(),
            },
        });

        // ====== STEP 10: Fetch total bets ======
        const totalBets = await db.bet.count({
            where: { marketId },
        });

        // ====== STEP 11: Create audit log entry ======
        await db.betHistory.create({
            data: {
                betId: "MARKET-RESOLUTION", // Special marker for market events
                marketId,
                wallet: adminAddress!,
                action: "RESOLVED",
                reason: `Market resolved by admin ${adminAddress!.slice(0, 8)}... with winner: ${winner}`,
            },
        });

        const duration = Date.now() - startTime;

        logInfo("✅ Market resolved successfully", {
            marketId,
            adminAddress,
            winner,
            totalBets,
            duration,
        });

        // ====== STEP 12: Return response ======
        return NextResponse.json(
            {
                success: true,
                marketId,
                winner,
                totalBets,
                yesPool: (Number(market.yesPool) / 10 ** BET_LIMITS.USDT_DECIMALS).toFixed(2),
                noPool: (Number(market.noPool) / 10 ** BET_LIMITS.USDT_DECIMALS).toFixed(2),
            },
            { status: 200 }
        );
    } catch (error) {
        const duration = Date.now() - startTime;

        logError("Unexpected error resolving market", {
            marketId,
            error: (error as Error).message,
            duration,
        });

        // TODO: Report to Sentry
        // if (process.env.SENTRY_DSN) {
        //   Sentry.captureException(error);
        // }

        return NextResponse.json(
            {
                success: false,
                error: "An unexpected error occurred while resolving the market",
                code: "INTERNAL_ERROR",
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// CORS & OPTIONS
// ============================================================================

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    });
}

// ============================================================================
// SECURITY NOTES
// ============================================================================

/**
 * TODO: Add additional security measures
 * 
 * - HMAC signature validation (optional second layer)
 * - Nonce/timestamp validation in message
 * - Multi-sig support (require N of M admins)
 * - Admin action whitelist (only certain admins can resolve)
 * - Soft/hard delete with recovery period
 * - Admin audit trail (all actions logged immutably)
 * - Webhook notification on resolution
 */

/**
 * TODO: Add resolution analytics
 * 
 * Track:
 * - Resolution time (when vs endDate)
 * - Dispute rate (how often same market re-resolved)
 * - Admin metrics (actions per admin, accuracy)
 * - Market metrics (avg time to resolve)
 */