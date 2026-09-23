import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/projects'
import { getAllBlogSlugs } from '@/lib/blog'
import { getAllLocationSlugs } from '@/lib/locations'

// Was hand-maintained and drifted badly out of sync with the real app
// — 7 URLs listed against 140+ that actually exist. The 6 real project
// pages (everything getAllProjectSlugs() finds under src/data/projects)
// and all 131 real blog posts (getAllBlogSlugs()) are now pulled from
// the same source the routes themselves are generated from, so this
// can't drift again. Regalia keeps its own hand-written entry below —
// it isn't one of the six, it has its own separate page/template.
//
// Deliberately NOT included: /blog2 and /what-we-do2 through
// /what-we-do8 — near-duplicate variants of /blog and /what-we-do, not
// meant to compete with the originals for the same search terms.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.omshakthy.com'
  const now = new Date()

  const projectPages: MetadataRoute.Sitemap = getAllProjectSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const blogPosts: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  // The 11 /buy-cmda-dtcp-plots-for-sale-chennai/* location pages —
  // real, indexed, ranking URLs per Balaji's Aug 2026 SEO report,
  // rebuilt at their exact original paths rather than dropped.
  const locationPages: MetadataRoute.Sitemap = getAllLocationSlugs().map((slug) => ({
    url: `${baseUrl}/buy-cmda-dtcp-plots-for-sale-chennai/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/regalia-lp`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...projectPages,
    { url: `${baseUrl}/image-gallery`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/testimonials`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/what-we-do`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...blogPosts,
    { url: `${baseUrl}/buy-cmda-dtcp-plots-for-sale-chennai`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...locationPages,
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ]
}
