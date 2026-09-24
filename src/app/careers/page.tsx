import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CareersContent from '@/components/ui/CareersContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report — and
// fixes a real broken link: Footer.tsx already links here, but this
// page never existed until now.
export const metadata: Metadata = {
  alternates: { canonical: '/careers' },
  title: 'Careers at OmShakthy | Jobs & Opportunities',
  description: 'Join the OmShakthy Homes team. Interested candidates can send their resume to hr@omshakthy.net.',
}

export default function CareersPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/careers' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <CareersContent />
      <Footer />
    </>
  )
}
