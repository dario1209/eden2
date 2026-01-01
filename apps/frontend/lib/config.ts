import { createConfig, http } from 'wagmi'
import { cronos } from 'wagmi/chains'

export const config = createConfig({
    chains: [cronos],
    transports: {
        [cronos.id]: http('https://evm-t3.cronos.org')
    }
})
