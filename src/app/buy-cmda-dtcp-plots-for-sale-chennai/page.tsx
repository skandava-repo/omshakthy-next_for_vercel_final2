import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LocationPageContent from '@/components/ui/LocationPageContent'
import { getLocationHubData } from '@/lib/locations'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Real content rebuilt from the live site's own
// /buy-cmda-dtcp-plots-for-sale-chennai/ page — indexed and crawled
// as recently as Aug 2026 per Balaji's SEO report. Kept at its exact
// original URL rather than redirected, per the explicit direction to
// preserve marketing's indexed URLs.
export const metadata: Metadata = {
  alternates: { canonical: '/buy-cmda-dtcp-plots-for-sale-chennai' },
  title: 'Residential & Industrial Plots for Sale in Chennai | OmShakthy Homes',
  description:
    'CMDA and DTCP approved plots in Chennai for those who are looking for safe, legally clear plots to invest in — residential and industrial plots in strategic locations across the city.',
}

export default function BuyPlotsHubPage() {
  const data = getLocationHubData()
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Buy CMDA & DTCP Plots in Chennai', path: '/buy-cmda-dtcp-plots-for-sale-chennai' },
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
