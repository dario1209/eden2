'use client'

import { Button } from '@/components/ui/button'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectButton() {
    const { address, isConnected } = useAccount()
    const { connect, connectors, isPending } = useConnect()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded-full font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button variant="outline" size="sm" onClick={() => disconnect()}>
                    Disconnect
                </Button>
            </div>
        )
    }

    return (
        <div className="flex gap-2">
            {connectors.map((connector) => (
                <Button
                    key={connector.uid}
                    variant="outline"
                    size="sm"
                    onClick={() => connect({ connector })}
                    disabled={!connector.ready || isPending}
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isPending === connector.id && ' (connecting)'}
                </Button>
            ))}
        </div>
    )
}
