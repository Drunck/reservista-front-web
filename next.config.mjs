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
    // output: "standalone", # uncomment this line to enable standalone mode for the docker image
};

export default nextConfig;
