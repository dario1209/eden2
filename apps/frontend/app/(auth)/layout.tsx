'use client'

import { useAccount } from 'wagmi'
import { WalletConnect } from '../components/wallet/WalletConnect'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isConnected } = useAccount()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-md w-full space-y-8 p-8">
                {!isConnected ? (
                    <WalletConnect />
                ) : (
                    <div>{children}</div>
                )}
            </div>
        </div>
    )
}
