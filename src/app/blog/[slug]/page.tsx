import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostContent from '@/components/ui/BlogPostContent'
import { getAllBlogSlugs, getBlogPost } from '@/lib/blog'
import { getBreadcrumbSchema } from '@/lib/schema-org'
import summary from '@/data/blog/summary.json'

// Prerenders all real posts extracted from the old mirror site
// (www.omshakthy.com/blog/*.html) at build time — see src/lib/blog.ts
// for why the full body only ever gets read server-side here.
//
// One real, indexed post's URL has a literal '&' in it
// (/blog/e-stamp-application-verification-&-registry-explained —
// Google has this exact URL indexed per Balaji's Aug 2026 SEO
// report). Confirmed Next's dynamic [slug] route matcher can't
// resolve a literal '&' at request time even when the exact slug is
// prerendered (the build-time metadata comes back correctly, but the
// request still 404s) — a routing bug, not fixable from this page.
// So the data file/route slug itself is the safe
// 'e-stamp-application-verification-and-registry-explained' (no '&'),
// and next.config.ts's rewrites() — confirmed to match a literal '&'
// correctly, since it runs on the raw path before dynamic-segment
// matching — transparently serves this page's content at the real
// indexed '&' URL. See that file for the rewrite itself.
export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

// The one exception to `path = /blog/${slug}`: this post's real
// indexed URL has the literal '&' the safe route slug had to drop
// (see the comment above). Canonical should point at the URL Google
// actually has indexed, not the internal safe slug — this map is
// consulted anywhere a canonical/breadcrumb path gets built below.
const CANONICAL_SLUG_OVERRIDE: Record<string, string> = {
  'e-stamp-application-verification-and-registry-explained': 'e-stamp-application-verification-&-registry-explained',
}
const canonicalSlug = (slug: string) => CANONICAL_SLUG_OVERRIDE[slug] ?? slug

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Blog' }
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: `/blog/${canonicalSlug(post.slug)}` },
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.heroImage ? [post.heroImage] : undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  // A handful of other real posts in the same inferred category, so
  // "Keep Reading" links somewhere real rather than being dropped —
  // same principle as the rest of this pass: no link without a real
  // destination behind it.
  const related = summary
    .filter((s) => s.slug !== post.slug && s.category === post.category)
    .slice(0, 3)
    .map((s) => ({ slug: s.slug, title: s.title }))

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${canonicalSlug(post.slug)}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <BlogPostContent post={post} related={related} />
      <Footer />
    </>
  )
}
