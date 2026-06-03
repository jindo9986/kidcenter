// Prefix root-relative public asset paths (e.g. /media/x.jpg) with the configured
// base path so they resolve when the site is served under a subpath
// (GitHub Pages project site: /kidcenter). Empty in local dev.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
