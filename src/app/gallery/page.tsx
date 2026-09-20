import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GalleryContent from '@/components/ui/GalleryContent'

export const metadata: Metadata = {
  alternates: { canonical: '/gallery' },
  title: 'Gallery',
  description: 'Photo and video gallery of OmShakthy Homes projects across Chennai.',
}

export default function GalleryPage() {
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
