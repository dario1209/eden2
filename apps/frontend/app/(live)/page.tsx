export default function LiveLanding() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-5xl font-black text-white mb-12 text-center">
                    Live Markets
                </h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <a href="/live/soccer" className="group">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all group-hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold text-white mb-2">⚽ Soccer</h3>
                            <p className="text-white/80">Next goal, corner, card</p>
                        </div>
                    </a>
                    <a href="/live/lol" className="group">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all group-hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold text-white mb-2">🎮 LoL</h3>
                            <p className="text-white/80">Next kill, tower, dragon</p>
                        </div>
                    </a>
                    <a href="/live/cs2" className="group">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all group-hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold text-white mb-2">🔫 CS2</h3>
                            <p className="text-white/80">Next kill, bomb plant</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}
