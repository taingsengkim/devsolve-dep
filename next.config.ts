import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
   remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com/google.com',
      },
      // Or allow all remote HTTPS images during development:
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  // images: {
  //   dangerouslyAllowSVG: true,
  //   contentDispositionType: 'attachment',
  //   contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'cdn.simpleicons.org',
  //     },
  //   ],
  // },
};

export default nextConfig;



// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'i.pravatar.cc',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;
