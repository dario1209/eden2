"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, type Config } from "wagmi";

import { arbitrum, mainnet } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";

import { projectId, wagmiAdapter } from "@/lib/config/appkit"; // create this file below

const metadata = {
    name: "Eden Haus",
    description: "Eden Haus — Members Only",
    url: "https://edenhaus.vercel.app/", // must match your deployed domain
    icons: ["https://YOUR_DOMAIN_HERE/icon.png"],
};

// createAppKit must run before any useAppKit hook
createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet, arbitrum],
    projectId,
    metadata,
    features: { analytics: true },
});

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
