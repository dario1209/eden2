/** @type {import('next').NextConfig} */

const nextConfig = {
    typedRoutes: true,
    output: 'standalone',
    experimental: {
        optimizePackageImports: ['viem', 'wagmi']
    },
    transpilePackages: ['@sportsbook/types'],
    webpack: (config, { isServer }) => {
        // Handle pino-pretty as optional dependency for production builds
        if (isServer) {
            config.externals.push('pino-pretty', 'lokijs', 'encoding')
        }
        return config
    }
}

module.exports = nextConfig
