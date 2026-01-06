// @ts-check
import { createConfig, http } from 'wagmi'
import { cronos } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const projectId = /** @type {string} */ (process.env.NEXT_PUBLIC_WC_PROJECT_ID)

export const config = createConfig({
  chains: [cronos],
  connectors: [
    walletConnect({
      projectId
    })
  ],
  transports: {
    [cronos.id]: http()
  }
})