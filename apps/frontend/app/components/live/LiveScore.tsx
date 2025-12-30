'use client'

interface LiveScoreProps {
    sport: string
    marketId: string
}

export function LiveScore({ sport, marketId }: LiveScoreProps) {
    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">{sport.toUpperCase()}</h2>
                <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                    LIVE
                </span>
            </div>
            <div className="text-center mb-8">
                <div className="text-6xl font-black text-white mb-4">1 - 0</div>
                <div className="text-xl text-white/80">Team A vs Team B</div>
                <div className="text-sm text-white/60 mt-2">90:23</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-400">1.92</div>
                    <div className="text-white/80 text-sm">Team A Next Point</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-red-400">1.88</div>
                    <div className="text-white/80 text-sm">Team B Next Point</div>
                </div>
            </div>
        </div>
    )
}
