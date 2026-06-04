import type { NextConfig } from "next";

// Base path for the GitHub Pages subpath deploy (served at /quest in prod).
// Empty in local dev; set to "/quest" by the deploy workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  transpilePackages: ["@kidcenter/ui"],
  // Static HTML export so it can be hosted on GitHub Pages.
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  // GitHub Pages serves /foo as /foo/index.html
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
