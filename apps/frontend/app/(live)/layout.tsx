export default function LiveLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen relative">
            {/* Dreamy gradient background */}
            <div className="fixed inset-0">
                {/* Main gradient - pink to cyan */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #FFB6C1 0%, #E0BBE4 25%, #957DAD 50%, #7EC8E3 75%, #7FE5F0 100%)'
                    }}
                />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />
                {/* Floating sparkles */}
                <div className="absolute top-20 left-[10%] text-4xl opacity-60 animate-pulse">✦</div>
                <div className="absolute top-40 right-[15%] text-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
                <div className="absolute top-60 left-[25%] text-2xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>✧</div>
                <div className="absolute bottom-40 right-[25%] text-3xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>
                <div className="absolute bottom-60 left-[15%] text-4xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
                <div className="absolute top-[30%] right-[10%] text-2xl opacity-30 animate-pulse" style={{ animationDelay: '0.8s' }}>🌙</div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}