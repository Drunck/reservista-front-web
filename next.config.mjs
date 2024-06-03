/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "reservista-main-bucket.s3.amazonaws.com",
                port: "",
            }
        ],
        // domains: ["reservista-main-bucket.s3.amazonaws.com"],
    },
};

export default nextConfig;
