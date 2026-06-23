import type { NextConfig } from "next";

// Static export hosted on GitHub Pages at /study in prod (empty base in local dev).
// The shell is static; all data loads at runtime from Supabase behind Google login
// + parent-only RLS, so no school records are baked into the bundle.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  transpilePackages: ["@kidcenter/ui"],
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
