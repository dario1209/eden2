"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

export default function Home() {
    const router = useRouter()
    const [knockSequence, setKnockSequence] = useState<number[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [doorShaking, setDoorShaking] = useState(false)
    const [smokeEffect, setSmokeEffect] = useState(false)

    const secretPattern = [1, 1, 1]

    const knockText = useMemo(() => {
        if (knockSequence.length > 0 && knockSequence.length < 3) {
            const remaining = 3 - knockSequence.length
            return `Knock ${remaining} more time${remaining > 1 ? "s" : ""}...`
        }
        return "Those who know, knock thrice..."
    }, [knockSequence])

    const handleKnock = () => {
        const newSequence = [...knockSequence, 1]
        setKnockSequence(newSequence)
        setDoorShaking(true)
        setTimeout(() => setDoorShaking(false), 200)

        if (newSequence.length === 3) {
            if (JSON.stringify(newSequence) === JSON.stringify(secretPattern)) {
                setIsAuthenticated(true)
                setSmokeEffect(true)
                setTimeout(() => router.push("/prediction"), 1200)
            } else {
                setTimeout(() => setKnockSequence([]), 1000)
            }
        }
    }

    const handleSlipInside = () => {
        setSmokeEffect(true)
        setTimeout(() => router.push("/prediction"), 800)
    }

    return (
        <main className="relative h-screen overflow-hidden">
            {/* Base atmosphere */}
            <div className="absolute inset-0 bg-[#1F3D2B]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(243,235,221,0.10),rgba(31,61,43,0.65),rgba(10,14,12,0.92))]" />

            {/* Subtle wallpaper + deco geometry */}
            <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light wallpaper" />
            <div className="absolute inset-0 opacity-[0.12] deco-lines" />

            {/* Film grain + vignette (hero-only) */}
            <div className="absolute inset-0 pointer-events-none film" />
            <div className="absolute inset-0 pointer-events-none vignette" />

            {/* Smoke overlay (gentle drift, not pulse) */}
            {smokeEffect && <div className="absolute inset-0 z-50 pointer-events-none smoke" />}

            {/* Content */}
            <div className="relative z-10 flex h-screen items-center justify-center px-4 py-4">
                <div className="w-full max-w-[700px]">
                    {/* Plaque */}
                    <div
                        className={[
                            "rounded-[20px] p-4 md:p-6",
                            "backdrop-blur-md",
                            "shadow-[0_40px_120px_rgba(0,0,0,0.55)]",
                            "bg-[linear-gradient(135deg,rgba(10,14,12,0.55),rgba(10,14,12,0.22))]",
                            "ring-1 ring-[#B08D57]/15",
                            doorShaking ? "shake" : "",
                        ].join(" ")}
                    >
                        {/* Brass double border */}
                        <div className="relative rounded-2xl border border-[#B08D57]/60 p-1 md:p-4">
                            <div className="pointer-events-none absolute inset-[10px] rounded-2xl border border-[#C2A14D]/25" />

                            {/* Warm spotlight */}
                            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,161,77,0.22),rgba(194,161,77,0.00)_70%)] blur-2xl" />

                            {/* Emblem + knock door */}
                            <div className="mx-auto flex w-full max-w-[400px] flex-col items-center">
                                <div className="rounded-2xl bg-[#FDFBD4] p-1 ring-1 ring-[#B08D57]/25 inline-block">
                                    <Image
                                        src="/EdenEden.png"
                                        alt="Eden Haus - Members Only"
                                        width={250}
                                        height={375}
                                        className="rounded-xl drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)] cursor-pointer hover:scale-105 transition-transform duration-300 mx-auto"
                                        style={{ backgroundColor: 'transparent' }}
                                        onClick={handleKnock}
                                        priority
                                    />

                                    <div className="mt-3 flex justify-center gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className={[
                                                    "h-2 w-2 rounded-full transition-all duration-300",
                                                    knockSequence[i]
                                                        ? "bg-[#C2A14D] shadow-[0_0_20px_rgba(194,161,77,0.55)]"
                                                        : "bg-[#6B4A32]/35",
                                                ].join(" ")}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="mt-4 text-center">
                                    <h1 className="font-serif text-3xl md:text-4xl tracking-[0.10em] text-[#F3EBDD] drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
                                        Eden Haus
                                    </h1>
                                    <p className="mt-2 text-[10px] tracking-[0.52em] uppercase text-[#B08D57]/90">
                                        Members Only
                                    </p>

                                    <div className="mx-auto mt-3 h-px w-32 bg-[#B08D57]/35" />

                                    <p className="mx-auto mt-3 max-w-md text-center text-xs leading-relaxed text-[#D8CFC0]/80">
                                        A discreet room for those who read the game fast and wager with composure. Knock thrice, or slip in
                                        quietly.
                                    </p>
                                </div>

                                {/* CTA */}
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleSlipInside}
                                        className={`group relative inline-flex items-center justify-center rounded-full px-8 py-2.5
text-xs uppercase tracking-[0.35em] text-[#F3EBDD]
border border-[#B08D57]/70
bg-[linear-gradient(180deg,rgba(194,161,77,0.16),rgba(176,141,87,0.06))]
shadow-[0_18px_55px_rgba(0,0,0,0.55)]
transition hover:border-[#C2A14D]/90 hover:shadow-[0_18px_75px_rgba(0,0,0,0.70)]`}
                                    >
                                        <span className="absolute inset-0 rounded-full ring-1 ring-[#C2A14D]/15 group-hover:ring-[#C2A14D]/25" />
                                        Enter the House
                                    </button>

                                    <p className="text-[10px] italic text-[#D8CFC0]/45">{knockText}</p>
                                </div>

                                {/* Optional: text-link entrance (extra elegant) */}
                                <div className="mt-2">
                                    <Link
                                        href="/prediction"
                                        className="text-[10px] tracking-[0.28em] uppercase text-[#D8CFC0]/50 hover:text-[#C2A14D] transition-colors"
                                    >
                                        Enter via the side door
                                    </Link>
                                </div>
                            </div>

                            {/* Bottom links */}
                            <div className="mt-3 pt-3">
                                <div className="mx-auto mb-3 h-px w-full max-w-md bg-[#B08D57]/20" />

                                <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px]">
                                    <Link
                                        href="/terms"
                                        className="tracking-[0.22em] uppercase text-[#D8CFC0]/60 hover:text-[#C2A14D] transition-colors"
                                    >
                                        Terms
                                    </Link>
                                    <span className="text-[#B08D57]/40">•</span>
                                    <Link
                                        href="/responsible-gaming"
                                        className="tracking-[0.22em] uppercase text-[#D8CFC0]/60 hover:text-[#C2A14D] transition-colors"
                                    >
                                        Responsible
                                    </Link>
                                    <span className="text-[#B08D57]/40">•</span>
                                    <Link
                                        href="/contact"
                                        className="tracking-[0.22em] uppercase text-[#D8CFC0]/60 hover:text-[#C2A14D] transition-colors"
                                    >
                                        Contact
                                    </Link>
                                </nav>

                                <p className="mt-3 text-center text-[10px] tracking-[0.30em] uppercase text-[#B08D57]/60">
                                    Est. 2026 • By invitation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Local CSS for texture/lines/smoke */}
            <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .shake {
          animation: shake 0.2s ease-in-out;
        }

        /* Wallpaper: soft, non-repeating feel */
        .wallpaper {
          background-image: radial-gradient(circle at 25% 20%, rgba(194, 161, 77, 0.06), transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(15, 92, 74, 0.07), transparent 60%),
            radial-gradient(circle at 40% 85%, rgba(90, 31, 43, 0.05), transparent 60%);
          filter: blur(0.2px);
        }

        /* Art-deco linework overlay */
        .deco-lines {
          background-image: linear-gradient(to right, rgba(176, 141, 87, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(176, 141, 87, 0.14) 1px, transparent 1px);
          background-size: 120px 120px;
          mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 72%);
        }

        /* Film grain + vignette (hero-only) */
        .film {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.1;
          mix-blend-mode: overlay;
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.035) 0 1px,
              transparent 1px 2px
            ),
            repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.035) 0 1px, transparent 1px 3px);
          filter: blur(0.25px);
        }

        .vignette {
          position: absolute;
          inset: -20px;
          pointer-events: none;
          background: radial-gradient(
            1200px 700px at 50% 35%,
            transparent 35%,
            rgba(0, 0, 0, 0.35) 70%,
            rgba(0, 0, 0, 0.65) 100%
          );
        }

        /* Smoke drift overlay */
        .smoke {
          background: radial-gradient(800px 420px at 30% 35%, rgba(95, 111, 82, 0.2), transparent 60%),
            radial-gradient(900px 520px at 70% 55%, rgba(216, 207, 192, 0.1), transparent 65%),
            radial-gradient(1000px 620px at 45% 80%, rgba(95, 111, 82, 0.18), transparent 70%);
          animation: drift 1.2s ease-out forwards;
        }
        @keyframes drift {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </main>
    )
}