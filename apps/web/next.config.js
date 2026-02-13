/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pignaudit/ui", "@pignaudit/shared"],
  output: "standalone",
};

module.exports = nextConfig;
