/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com', // OMDb API'nin görselleri aldığı domain
                pathname: '/images/**', // Domain altındaki görsel yollarını kapsar
            },
        ],
        
    },
};

export default nextConfig;