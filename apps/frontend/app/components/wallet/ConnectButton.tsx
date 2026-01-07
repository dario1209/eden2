'use client'

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useDisconnect } from 'wagmi'; // keep wagmi for disconnect

export function ConnectButton() {
    const { address, isConnected } = useAppKitAccount()
    const { open } = useAppKit()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {address?.slice(0, 2).toUpperCase()}
                </div>

                <span className="text-white font-medium max-w-[120px] truncate">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>

                <button
                    onClick={() => disconnect()}
                    className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-all text-white"
                    aria-label="Disconnect wallet"
                    title="Disconnect"
                >
                    ✕
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => open()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white font-medium transition-all flex items-center gap-2 text-sm"
        >
            📱 WalletConnect
        </button>
    )
}
