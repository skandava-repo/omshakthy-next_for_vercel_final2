import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BuyingGuideContent from '@/components/ui/BuyingGuideContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report, never
// built in the rebuild before now.
export const metadata: Metadata = {
  alternates: { canonical: '/buying-guide' },
  title: 'Buy Your Dream Home with Confidence | OmShakthy Homes Guide',
  description: "The homebuyer's guide — tips, tools and information on whatever issues you may face during your decision-making process, from OmShakthy Homes.",
}

export default function BuyingGuidePage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Buying Guide', path: '/buying-guide' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <BuyingGuideContent />
      <Footer />
    </>
  )
}
