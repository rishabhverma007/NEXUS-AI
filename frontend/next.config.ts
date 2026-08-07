import type { NextConfig } from "next";

// Backend base URL for the /api/backend proxy. Override with BACKEND_URL
// env var (e.g. in Docker or production); defaults to local dev.
const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // lean Docker runtime image (see Dockerfile)
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
