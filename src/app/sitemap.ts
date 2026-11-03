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

  // One post's real indexed URL has a literal '&' its safe route slug
  // had to drop (see src/app/blog/[slug]/page.tsx's own comment) — list
  // the real, canonical '&' URL here, not the internal safe-slug
  // duplicate it resolves through via next.config.ts's rewrite. Written
  // as the XML entity '&amp;', not a raw '&': confirmed in
  // node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js
  // that Next interpolates `url` into `<loc>` with zero XML-escaping of
  // its own, so a raw '&' here would emit invalid XML (a bare '&' isn't
  // legal inside XML text content) — '&amp;' decodes back to the exact
  // same indexed URL once any XML parser reads it, just validly.
  const BLOG_SITEMAP_SLUG_OVERRIDE: Record<string, string> = {
    'e-stamp-application-verification-and-registry-explained': 'e-stamp-application-verification-&amp;-registry-explained',
  }
  const blogPosts: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${BLOG_SITEMAP_SLUG_OVERRIDE[slug] ?? slug}`,
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
    { url: `${baseUrl}/ongoing-projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/upcoming-projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/completed-projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/image-gallery`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/video-gallery`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/testimonials`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/what-we-do`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    // The 4 category-filter views — real, indexed URLs on the old site
    // (its own sitemap.xml lists exactly these), now a real feature
    // here too (see BlogListingContent.tsx's tabs), not just listed.
    { url: `${baseUrl}/blog?category=buying`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/blog?category=investment`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/blog?category=legal`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/blog?category=lifestyle`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    ...blogPosts,
    { url: `${baseUrl}/emi-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/homeloan`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/buying-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/land-aggregation-projects-chennai`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/buy-cmda-dtcp-plots-for-sale-chennai`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...locationPages,
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ]
}
