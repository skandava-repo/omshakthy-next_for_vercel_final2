import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LocationPageContent from '@/components/ui/LocationPageContent'
import { getAllLocationSlugs, getLocationData } from '@/lib/locations'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content rebuilt from the live site's own 11
// /buy-cmda-dtcp-plots-for-sale-chennai/<location> pages — all
// indexed and crawled as recently as Aug 2026 (Balaji's SEO report).
// Kept at their exact original URLs rather than redirected or
// consolidated into one generic page, per the explicit direction:
// these are distinct local-search money pages, not interchangeable.
export function generateStaticParams() {
  return getAllLocationSlugs().map((location) => ({ location }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>
}): Promise<Metadata> {
  const { location } = await params
  const data = getLocationData(location)
  if (!data) return { title: 'Plots for Sale' }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `/buy-cmda-dtcp-plots-for-sale-chennai/${data.slug}` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
    },
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ location: string }>
}) {
  const { location } = await params
  const data = getLocationData(location)
  if (!data) notFound()

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Buy CMDA & DTCP Plots in Chennai', path: '/buy-cmda-dtcp-plots-for-sale-chennai' },
    { name: data.locationName, path: `/buy-cmda-dtcp-plots-for-sale-chennai/${data.slug}` },
  ])
  const faqSchema = getFAQSchema(data.faq.map((f) => ({ question: f.q, answer: f.a })))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <LocationPageContent data={data} />
      <Footer />
    </>
  )
}
