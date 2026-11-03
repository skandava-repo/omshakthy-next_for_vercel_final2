import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogListingContent from '@/components/ui/BlogListingContent'

// The 4 real, indexed category-filter URLs the old site has
// (sitemap.xml: /blog/?category=buying|investment|legal|lifestyle) —
// same slug->label mapping BlogListingContent.tsx keeps for its own
// tabs, duplicated here rather than imported: that file is 'use
// client', and importing a plain export from a client module into a
// Server Component like this page doesn't resolve reliably (every
// export of a client module becomes a client reference — see
// src/lib/projectsData.ts's own header comment for the same issue
// hit before).
const CATEGORY_META: Record<string, { label: string; description: string }> = {
  buying: {
    label: 'Buying Guides',
    description: 'Buying guides and how-tos for purchasing residential and industrial plots in Chennai, from OmShakthy Homes.',
  },
  investment: {
    label: 'Market & Investment',
    description: 'Real estate market trends and investment insights for Chennai plots and land, from OmShakthy Homes.',
  },
  legal: {
    label: 'Legal & Documents',
    description: 'Legal documents, approvals and registration guides for buying plots in Chennai, from OmShakthy Homes.',
  },
  lifestyle: {
    label: 'Lifestyle & Decor',
    description: 'Home decor and lifestyle ideas for your new plot or home, from OmShakthy Homes.',
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}): Promise<Metadata> {
  const { category } = await searchParams
  const meta = category ? CATEGORY_META[category] : undefined
  // An unrecognized ?category= value isn't one of the 4 real indexed
  // views — falls back to the plain /blog metadata/canonical rather
  // than inventing a title for a URL nothing actually points to.
  if (!meta) {
    return {
      alternates: { canonical: '/blog' },
      title: 'Blog',
      description:
        'Real estate insights, buying guides, legal documents and lifestyle tips from OmShakthy Homes — top plot developers in Chennai.',
    }
  }
  return {
    alternates: { canonical: `/blog?category=${category}` },
    title: `${meta.label} | Blog`,
    description: meta.description,
  }
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <BlogListingContent />
      </Suspense>
      <Footer />
    </>
  )
}
