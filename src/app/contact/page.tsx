import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ContactContent from '@/components/ui/ContactContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact Us',
  description:
    'Get in touch with OmShakthy Homes. Visit our office at Ekkaduthangal, Chennai, call 044 4030 3040, or message us on WhatsApp for site visits and inquiries.',
}

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <ContactContent />
      <SiteLinksSection />
      <Footer />
    </>
  )
}
