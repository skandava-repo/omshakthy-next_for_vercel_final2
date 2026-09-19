import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'

// Real content extracted from mathura-lp.html — see
// src/data/projects/mathura.json. Its own real FAQ states plainly
// "OmShakthy Mathura is a residential plot development project located
// in Chromepet" and its connectivity intro repeats "in chromepet" —
// ProjectsContent.tsx previously said "Tambaram, Chennai", fixed in
// the same pass this page was built. Status is 'Ongoing', not 'Sold'
// — this page's own live spec table shows a real price (22.5 Lakhs),
// not "Sold Out"; a prior pass here had mismarked it.
export const metadata: Metadata = {
  title: 'OmShakthy Mathura — Residential Plots in Chromepet | OmShakthy Homes',
  description:
    'OmShakthy Mathura is a residential plot development in Chromepet, Chennai — 110 CMDA & RERA approved plots across 3.55 acres, starting from ₹22.5 Lakhs.',
  openGraph: {
    title: 'OmShakthy Mathura — Residential Plots in Chromepet',
    description: 'CMDA & RERA approved residential plots in Chromepet, Chennai.',
  },
}

export default function MathuraPage() {
  const data = getProjectData('mathura')!
  return (
    <>
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
