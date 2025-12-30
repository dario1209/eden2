/** @type {import('next').NextConfig} */
const nextConfig = {
    typedRoutes: true,
    experimental: {
        optimizePackageImports: ['viem', 'wagmi']
    },
    transpilePackages: ['@sportsbook/types']
}

module.exports = nextConfig
