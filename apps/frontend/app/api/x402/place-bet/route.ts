import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const body = await request.json()

    // Proxy to backend x402 endpoint
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/v1/x402/place-bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    const data = await backendRes.json()

    // Return 402 if backend returns payment required
    if (backendRes.status === 402) {
        return new NextResponse(JSON.stringify(data), {
            status: 402,
            headers: {
                'Payment-Required': data.paymentUrl || '',
                'X-Quote-ID': data.quoteId
            }
        })
    }

    return NextResponse.json(data)
}
