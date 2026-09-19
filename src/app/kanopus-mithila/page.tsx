import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'

// Real content extracted from canopus-mithila-lp.html — see
// src/data/projects/kanopus-mithila.json. Its own real "Locations
// Nearby" list (Avadi Railway Station, Ayyapakkam, Mogappair, Heavy
// Vehicles Factory) places this project in the Avadi corridor —
// ProjectsContent.tsx previously said "Vandalur, Chennai", fixed in
// the same pass this page was built.
export const metadata: Metadata = {
  title: 'Kanopus Mithila — Residential Plots in Avadi | OmShakthy Homes',
  description:
    'Kanopus Mithila offers 68 residential plots in the Avadi corridor of Chennai — DTCP approved, close to Avadi Railway Station and Ayyapakkam.',
  openGraph: {
    title: 'Kanopus Mithila — Residential Plots in Avadi',
    description: 'DTCP approved residential plots in the Avadi corridor, Chennai.',
  },
}

export default function KanopusMithilaPage() {
  const data = getProjectData('kanopus-mithila')!
  return (
    <>
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
