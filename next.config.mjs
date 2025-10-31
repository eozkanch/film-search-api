/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image Optimization - Performance 100%
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
                pathname: '/images/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year cache
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        unoptimized: false,
    },

    // Compression
    compress: true,

    // React optimizations
    reactStrictMode: true,
    
    // Production source maps (for debugging)
    productionBrowserSourceMaps: false,
    
    // Compiler optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Performance: Optimize production builds
    // Note: swcMinify is enabled by default in Next.js 15, no need to specify
    experimental: {
        optimizePackageImports: ['react-icons'],
    },

    // Optimize imports for better tree-shaking
    modularizeImports: {
        '@mui/material': {
            transform: '@mui/material/{{member}}',
        },
        '@mui/icons-material': {
            transform: '@mui/icons-material/{{member}}',
        },
    },

    // Headers for caching and security
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|woff|woff2)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    // Security headers
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
                    },
                    // Content Security Policy - XSS Protection
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com", // Next.js requires unsafe-eval in dev, GTM added
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https://m.media-amazon.com https://www.imdb.com https://www.googletagmanager.com",
                            "font-src 'self' data:",
                            "connect-src 'self' https://www.omdbapi.com https://m.media-amazon.com https://www.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://google-analytics.com",
                            "frame-ancestors 'self'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-src 'self' https://www.googletagmanager.com", // Allow GTM noscript iframe
                            "object-src 'none'",
                            "upgrade-insecure-requests"
                        ].join('; ')
                    },
                    // XSS Protection
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    // Prevent clickjacking
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                ],
            },
            // API routes için özel güvenlik headers
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                ],
            },
        ];
    },
};

export default nextConfig;