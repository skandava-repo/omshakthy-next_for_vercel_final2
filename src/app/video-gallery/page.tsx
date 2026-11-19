import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import VideoGalleryContent from '@/components/ui/VideoGalleryContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report.
export const metadata: Metadata = {
  alternates: { canonical: '/video-gallery' },
  title: 'Construction & Project Videos | OmShakthy Video Gallery',
  description: "A closer look at OmShakthy Homes' projects, in motion.",
}

export default function VideoGalleryPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Video Gallery', path: '/video-gallery' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <VideoGalleryContent />
      <SiteLinksSection />
      <Footer />
    </>
  )
}
