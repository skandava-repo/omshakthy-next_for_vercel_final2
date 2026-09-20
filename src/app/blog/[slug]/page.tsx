import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostContent from '@/components/ui/BlogPostContent'
import { getAllBlogSlugs, getBlogPost } from '@/lib/blog'
import { getBreadcrumbSchema } from '@/lib/schema-org'
import summary from '@/data/blog/summary.json'

// Prerenders all 131 real posts extracted from the old mirror site
// (www.omshakthy.com/blog/*.html) at build time — see src/lib/blog.ts
// for why the full body only ever gets read server-side here.
export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

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
    alternates: { canonical: `/blog/${post.slug}` },
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
    { name: post.title, path: `/blog/${post.slug}` },
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
