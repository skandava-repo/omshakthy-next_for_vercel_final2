import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GalleryContent from '@/components/ui/GalleryContent'

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
  return (
    <>
      <Header />
      <main>
        <GalleryContent />
      </main>
      <Footer />
    </>
  )
}
