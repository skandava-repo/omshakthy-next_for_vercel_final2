import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Neither /api/ nor /sanity/ is a live route right now (checked —
      // no src/app/api or src/app/sanity segment exists), but sanity/
      // schemas.ts and src/lib/sanity.ts are already in the repo, so
      // this stays as pre-emptive cover for whenever a Studio route or
      // API routes actually get mounted, rather than dead config to
      // delete.
      disallow: ['/api/', '/sanity/'],
    },
    sitemap: 'https://www.omshakthy.com/sitemap.xml',
  }
}
