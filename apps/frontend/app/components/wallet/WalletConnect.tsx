'use client'

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useDisconnect } from 'wagmi'

export function WalletConnect() {
    const { address, isConnected } = useAppKitAccount()
    const { open } = useAppKit()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
                Disconnect {address?.slice(0, 6)}...
            </button>
        )
    }

    return (
        <button
            onClick={() => open()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
        >
            📱 WalletConnect
        </button>
    )
}
