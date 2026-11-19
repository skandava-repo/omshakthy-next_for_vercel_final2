import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ProjectsContent from '@/components/ui/ProjectsContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

export const metadata: Metadata = {
  alternates: { canonical: '/projects' },
  title: 'Projects',
  description:
    'Explore OmShakthy Homes ongoing, upcoming and completed residential, industrial and land aggregation projects across Chennai.',
}

export default function ProjectsPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <ProjectsContent />
      {/* This page alone gets the colorful 3D building render instead of
          the site-wide monochrome skyline, and at a smaller size — both
          per request, and both scoped to just this page via Footer's
          own props rather than touching the shared .ft__deco rule. */}
      <SiteLinksSection />
      <Footer decoSrc="/footer-building.webp" decoClassName="ft__deco--sm" />
    </>
  )
}
