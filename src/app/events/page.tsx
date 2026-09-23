import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventsContent from '@/components/ui/EventsContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report. A past
// session's own code comment (see SiteLinksSection.tsx) notes Events
// was deliberately dropped from the footer earlier because no matching
// page existed yet — built for real now.
export const metadata: Metadata = {
  alternates: { canonical: '/events' },
  title: 'News and Events Updates - OmShakthy Homes',
  description: 'Milestones, launches and moments from three decades of OmShakthy Homes.',
}

export default function EventsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <EventsContent />
      <Footer />
    </>
  )
}
