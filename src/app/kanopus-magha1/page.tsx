import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Story from '@/components/kanopus3d/Story'
import { getProjectData } from '@/lib/projects'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// DRAFT redesign of the Kanopus Magha landing page, with a scroll-driven 3D
// story. It lives on its own route so the live /kanopus-magha page is
// untouched. It reads the same data file (read-only) and is marked noindex so
// it cannot compete with the live page in search until it is approved.
export const metadata: Metadata = {
  title: 'Kanopus Magha — Residential Plots in Avadi (3D preview)',
  description:
    'Kanopus Magha: CMDA and DTCP approved residential plots in Avadi, Chennai, with clear titles. Preview of the redesigned landing page.',
  robots: { index: false, follow: false },
}

export default function KanopusMagha1Page() {
  const data = getProjectData('canopus-magha-lp')!
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: data.name, path: '/kanopus-magha1' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <Story data={data} />
      {/* Same footer illustration as the About page. */}
      <Footer decoSrc="/footer-building.webp" decoClassName="ft__deco--sm" />
    </>
  )
}
