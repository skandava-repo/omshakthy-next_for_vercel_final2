import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomeLoanContent from '@/components/ui/HomeLoanContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report, never
// built in the rebuild before now.
export const metadata: Metadata = {
  alternates: { canonical: '/homeloan' },
  title: 'Home Loan in Chennai – Best Interest Rates & Easy Process',
  description: 'OmShakthy Homes offers end-to-end home loan assistance in Chennai — comparing rates, guiding eligibility and documentation, and supporting you through disbursal.',
}

export default function HomeLoanPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Home Loan', path: '/homeloan' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <HomeLoanContent />
      <Footer />
    </>
  )
}
