import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo sits inside a parent directory that also holds a lockfile, so
  // pin the workspace root explicitly rather than letting Turbopack infer it.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
