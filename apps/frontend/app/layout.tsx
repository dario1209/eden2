import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { config } from '@/lib/config'
import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { WagmiProvider } from 'wagmi'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Chainlink Sportsbook',
    description: 'Micro-bets with x402 + Chainlink on Cronos',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient()

    return (
        <html lang="en">
            <body className={inter.className}>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <Navbar />
                        <main className="min-h-screen">{children}</main>
                        <Toaster />
                    </QueryClientProvider>
                </WagmiProvider>
            </body>
        </html>
    )
}
