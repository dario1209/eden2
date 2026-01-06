import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Orbitron, Space_Grotesk } from 'next/font/google';
import { WagmiProvider } from 'wagmi';
import { config } from '../wagmi.config.js';
import './globals.css';
import { Providers } from './providers';

const queryClient = new QueryClient()

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
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <Providers>
                            {children}
                        </Providers>
                    </QueryClientProvider>
                </WagmiProvider>
            </body>
        </html>
    )
}
