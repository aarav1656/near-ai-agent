/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites(){
        return [
            {
                source: "/.well-known/ai-plugin.json",
                destination: "/api/ai-plugin",
            }
        ]
    },
};

export default nextConfig;