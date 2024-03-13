/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = { 
            /*
            fs: false,
            net: false,
            tls: false
            */
        };
        return config;
    },
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "quizaida.s3.eu-north-1.amazonaws.com",
            port: "",
            pathname: "/**"
        }],
        /*
        domains: [
            "quizaida.s3.eu-north-1.amazonaws.com"
        ]*/
    }
};

export default nextConfig;
