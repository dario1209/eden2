// app/responsible-gaming/page.tsx
import Link from "next/link"

export default function ResponsibleGamingPage() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Atmosphere */}
            <div className="absolute inset-0 bg-[#1F3D2B]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(243,235,221,0.10),rgba(31,61,43,0.70),rgba(10,14,12,0.95))]" />

            {/* Film grain + vignette (no styled-jsx) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 2px), repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 3px)",
                    filter: "blur(0.25px)",
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: "-20px",
                    background:
                        "radial-gradient(1200px 700px at 50% 35%, transparent 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.65) 100%)",
                }}
            />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[980px] items-center px-6 py-16">
                <div className="w-full">
                    {/* Header */}
                    <div className="text-center">
                        <p className="text-[11px] tracking-[0.38em] uppercase text-[#B08D57]/85">
                            Eden Haus • House Discipline
                        </p>

                        <h1 className="mt-6 font-serif text-4xl md:text-5xl tracking-[0.10em] text-[#F3EBDD] drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
                            Responsible
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#D8CFC0]/80">
                            The House respects restraint. Wagering should remain entertainment—never a requirement, never a rescue.
                            If control slips, step back.
                        </p>

                        <div className="mx-auto mt-8 h-px w-52 bg-[#B08D57]/35" />
                    </div>

                    {/* Card */}
                    <div className="mt-10 rounded-[28px] p-8 md:p-12 backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.55)] bg-[linear-gradient(135deg,rgba(10,14,12,0.60),rgba(10,14,12,0.22))] ring-1 ring-[#B08D57]/15">
                        <div className="relative rounded-2xl border border-[#B08D57]/60 p-7 md:p-10">
                            <div className="pointer-events-none absolute inset-[10px] rounded-2xl border border-[#C2A14D]/25" />

                            {/* Warm spotlight */}
                            <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,161,77,0.18),rgba(194,161,77,0.00)_70%)] blur-2xl" />

                            <div className="space-y-10">
                                <section>
                                    <h2 className="text-[12px] tracking-[0.44em] uppercase text-[#C2A14D]/90">
                                        First Principles
                                    </h2>
                                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#D8CFC0]/80">
                                        <li>Only wager what you can afford to lose—fully and without consequence.</li>
                                        <li>Set limits before you start (time, stake, and loss), and keep them.</li>
                                        <li>Never chase losses; chasing turns discipline into damage.</li>
                                        <li>Don’t wager while stressed, intoxicated, or emotionally compromised.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-[12px] tracking-[0.44em] uppercase text-[#C2A14D]/90">
                                        Signs to Step Away
                                    </h2>
                                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#D8CFC0]/80">
                                        <li>You’re wagering to “get even” or solve a money problem.</li>
                                        <li>You’re hiding activity from people you trust.</li>
                                        <li>You’re increasing risk to feel something, or to feel nothing.</li>
                                        <li>It’s interfering with sleep, work, relationships, or mental health.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-[12px] tracking-[0.44em] uppercase text-[#C2A14D]/90">
                                        House Tools (Recommended)
                                    </h2>
                                    <p className="mt-4 text-sm leading-relaxed text-[#D8CFC0]/80">
                                        Use external guardrails even if you feel in control—limits protect you on the days you aren’t.
                                    </p>
                                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#D8CFC0]/80">
                                        <li>Hard budget: a fixed weekly/monthly allocation.</li>
                                        <li>Session timer: a strict timebox with breaks.</li>
                                        <li>Cooling-off: a voluntary pause for a set period.</li>
                                        <li>Self-exclusion: a longer lockout if you need distance.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-[12px] tracking-[0.44em] uppercase text-[#C2A14D]/90">
                                        Need help now?
                                    </h2>
                                    <p className="mt-4 text-sm leading-relaxed text-[#D8CFC0]/80">
                                        If you feel you’re losing control, reach out to a trusted friend or a local professional support
                                        service in your region. The fastest path back to control is asking early.
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-[#D8CFC0]/70">
                                        If you’d like Eden Haus to add or link region-specific resources (e.g., Greece/UK/US), request it via
                                        Contact.
                                    </p>
                                </section>

                                <section className="pt-2">
                                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="h-px w-full max-w-md bg-[#B08D57]/20" />
                                        <p className="text-xs italic text-[#D8CFC0]/55">
                                            “A steady hand is the only edge worth keeping.”
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                            <Link
                                                href="/"
                                                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.30em] text-[#F3EBDD] border border-[#B08D57]/70 bg-[linear-gradient(180deg,rgba(194,161,77,0.14),rgba(176,141,87,0.05))] hover:border-[#C2A14D]/90 transition"
                                            >
                                                Return to the door
                                            </Link>

                                            <Link
                                                href="/terms"
                                                className="text-[11px] tracking-[0.28em] uppercase text-[#D8CFC0]/55 hover:text-[#C2A14D] transition-colors"
                                            >
                                                Terms
                                            </Link>
                                            <span className="text-[#B08D57]/35">•</span>
                                            <Link
                                                href="/contact"
                                                className="text-[11px] tracking-[0.28em] uppercase text-[#D8CFC0]/55 hover:text-[#C2A14D] transition-colors"
                                            >
                                                Contact
                                            </Link>
                                        </div>

                                        <p className="pt-4 text-center text-[11px] tracking-[0.30em] uppercase text-[#B08D57]/60">
                                            Keep it controlled • Keep it private
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
