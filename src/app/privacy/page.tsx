import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import PrivacyContent from '@/components/ui/PrivacyContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: fixes a real broken link — Footer.tsx already links to
// /privacy, but this page never existed until now (same bug pattern
// already fixed once for /careers).
export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  title: 'Privacy Policy | OmShakthy Homes',
  description: 'How OmShakthy Homes handles the personal information you share with us.',
}

export default function PrivacyPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <PrivacyContent />
      <SiteLinksSection />
      <Footer />
    </>
  )
}
