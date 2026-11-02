/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/insights", destination: "/private-markets#notes", permanent: true },
      { source: "/watch-and-learn", destination: "/free-resources", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/sequence/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
};
export default nextConfig;
