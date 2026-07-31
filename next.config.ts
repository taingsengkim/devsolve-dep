import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {
  //  remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'github.githubassets.com',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'upload.wikimedia.org',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'www.google.com',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'assets.nflxext.com',
  //     },
  //     // Or allow all remote HTTPS images during development:
  //     {
  //       protocol: 'https',
  //       hostname: '**',
  //     },
  //   ],
  // },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
  },
};

export default nextConfig;
