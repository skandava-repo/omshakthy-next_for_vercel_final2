import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteLinksSection from '@/components/ui/SiteLinksSection'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import GalleryContent from '@/components/ui/GalleryContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// Renamed from /gallery, not redirected: /gallery was never indexed
// anywhere (checked against Balaji's Aug 2026 SEO report), while
// /image-gallery is a real, indexed URL on the old live site — same
// rename-not-redirect rule used for the project pages.
export const metadata: Metadata = {
  alternates: { canonical: '/image-gallery' },
  title: 'OmShakthy Gallery | Real Estate Project Images & Site Photos',
  description: 'Photo and video gallery of OmShakthy Homes projects across Chennai.',
}

export default function ImageGalleryPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/image-gallery' },
  ]
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <main>
        <GalleryContent />
      </main>
      <SiteLinksSection />
      <Footer />
    </>
  )
}
