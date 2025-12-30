'use client'

import { ConnectButton } from './ConnectButton'

export function WalletConnect() {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
            <p className="text-white/60 mb-8">Connect to Cronos to place micro-bets</p>
            <ConnectButton />
        </div>
    )
}
