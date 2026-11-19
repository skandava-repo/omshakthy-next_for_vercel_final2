import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import WhatWeDoContent from '@/components/ui/WhatWeDoContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

export const metadata: Metadata = {
  alternates: { canonical: '/what-we-do' },
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — the five disciplines behind everything OmShakthy builds.',
}

export default function WhatWeDoPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'What We Do', path: '/what-we-do' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <WhatWeDoContent />
      <SiteLinksSection />
      <Footer />
    </>
  )
}
