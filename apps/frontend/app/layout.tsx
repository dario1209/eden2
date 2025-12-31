import type { Metadata } from 'next'
import { Orbitron, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
})

const orbitron = Orbitron({
    subsets: ['latin'],
    variable: '--font-orbitron',
})

export const metadata: Metadata = {
    title: 'MicroBets - Live Sports Betting',
    description: 'x402 payments + Chainlink settlement on Cronos. Bet on every point, kill, corner. Real-time, on-chain, sub-second.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${orbitron.variable}`}>
            <body className="font-sans antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}