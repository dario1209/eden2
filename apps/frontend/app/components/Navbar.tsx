'use client'

import { ConnectButton } from '@/components/wallet/ConnectButton'
import Link from 'next/link'

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Sportsbook
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/live" className="text-sm font-medium hover:text-primary transition-colors">
                        Live
                    </Link>
                    <ConnectButton />
                </div>
            </div>
        </nav>
    )
}
