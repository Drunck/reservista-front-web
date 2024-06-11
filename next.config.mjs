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
    },
    // uncomment the line below to enable standalone mode for the docker image
    // output: "standalone",
};

export default nextConfig;
