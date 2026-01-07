import { createAppKit } from '@reown/appkit'
import { cronos } from '@reown/appkit/networks'

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!

export const appKit = createAppKit({
    projectId,
    networks: [cronos],
    metadata: {
        name: 'Eden Haus',
        description: 'Real-time micro-betting',
        url: 'https://sportsbook-monorepo-frontend.vercel.app',
        icons: []
    }
})
