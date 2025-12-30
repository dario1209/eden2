/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        typedRoutes: true,
        optimizePackageImports: ['viem', 'wagmi']
    },
    transpilePackages: ['@sportsbook/types']
}

module.exports = nextConfig
