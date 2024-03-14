/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "_next",
    images: {
        remotePatterns: [{hostname: "*.public.blob.vercel-storage.com"}],
    },
    generateBuildId: async () => {
        if (process.env.BUILD_ID) {
            return process.env.BUILD_ID;
        } else {
            return `${new Date().getTime()}`;
        }
    },
};

export default nextConfig;
