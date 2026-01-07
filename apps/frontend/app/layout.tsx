import type { Metadata } from "next"
import { Playfair_Display, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
})

const cormorantGaramond = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-cormorant-garamond",
})

export const metadata: Metadata = {
    title: "Eden Haus — Members Only",
    description:
        "A discreet room for those who read the game fast and wager with composure. Slip inside for the prediction market.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            className={`${spaceGrotesk.variable} ${cormorantGaramond.variable}`}
        >
            <body className="font-sans antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
