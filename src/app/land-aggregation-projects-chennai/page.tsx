import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LandAggregationContent from '@/components/ui/LandAggregationContent'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report, never
// built in the rebuild before now.
const FAQS = [
  {
    question: 'What is Land Aggregation?',
    answer:
      'Land aggregation is the process of collecting land parcels from several locations for the purpose of developing land into plots. OmShakthy acquires land through clean negotiations with land owners having clear ownership titles, creating larger, more manageable properties for development or investment.',
  },
  {
    question: 'How do land aggregators work?',
    answer:
      'We identify multiple small land parcels in a targeted area and negotiate with individual landowners to purchase their land, consolidating these parcels into a larger piece of land for development.',
  },
  {
    question: 'What are the benefits of land aggregation for buyers?',
    answer:
      'Access to larger and more strategically located land parcels, more efficient land use, potentially lower purchase prices due to scale, and clear titles that remove the post-purchase hassle of document verification.',
  },
]

export const metadata: Metadata = {
  alternates: { canonical: '/land-aggregation-projects-chennai' },
  title: 'Top Land Aggregator Chennai, Best Land Aggregation Plots Chennai',
  description: "OmShakthy's land aggregation — shifting horizons in real estate. Prime locations, clear titles, and profitable land investments across Chennai.",
}

export default function LandAggregationPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Land Aggregation', path: '/land-aggregation-projects-chennai' },
  ])
  const faqSchema = getFAQSchema(FAQS)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <LandAggregationContent />
      <Footer />
    </>
  )
}
