export default async function SportDashboard({ params }: { params: Promise<{ sport: string }> }) {
    const { sport } = await params
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-white mb-8">
                {sport.toUpperCase()} Live
            </h1>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Active Markets</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-sm text-white/60">Next Goal: Team A</p>
                            <div className="flex justify-between mt-2">
                                <span className="text-2xl font-bold text-green-400">1.85</span>
                                <span className="text-white/60">$0.01</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Scoreboard</h2>
                    <div className="text-center">
                        <div className="text-4xl font-black text-white">1 - 0</div>
                        <p className="text-white/60 mt-2">Team A vs Team B</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
