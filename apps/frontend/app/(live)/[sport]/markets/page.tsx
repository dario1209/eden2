export default function Markets({ params }: { params: { sport: string } }) {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-white mb-12">
                {params.sport.toUpperCase()} Markets
            </h1>
            <div className="grid gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4">Next Point Winner</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-all">
                            <p className="text-white/80 mb-2">Team A</p>
                            <div className="text-3xl font-black text-green-400">1.92</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-all">
                            <p className="text-white/80 mb-2">Team B</p>
                            <div className="text-3xl font-black text-green-400">1.88</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
