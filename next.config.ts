import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Ensure video and large assets in public/ are served correctly
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Confirmed via a raw-HTTP test that next.config's rewrite matcher
  // handles a literal '&' in a path correctly, unlike the dynamic
  // [slug] route's own request-time matcher (see the comment on
  // src/app/blog/[slug]/page.tsx's generateStaticParams for the full
  // story). This rewrite is what actually makes the real, already-
  // indexed URL (with the literal '&' Google has crawled — Balaji's
  // Aug 2026 SEO report) resolve to real content: the browser/crawler
  // still sees the original '&' URL, Next just serves the
  // '-and-'-slug page's content for it under the hood.
  async rewrites() {
    return [
      {
        source: '/blog/e-stamp-application-verification-&-registry-explained',
        destination: '/blog/e-stamp-application-verification-and-registry-explained',
      },
    ]
  },
}

export default nextConfig
