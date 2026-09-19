import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'

// Real content extracted from elite-orchard-lp.html — see
// src/data/projects/elite-orchard.json. Its own real "Locations
// Nearby" list (Guduvanchery Railway Station, Kilambakkam Bus
// Terminal, Mahindra World City, Potheri Railway Station, ORR) places
// this project in Guduvanchery — ProjectsContent.tsx previously said
// "Paruthipattu, Avadi", fixed in the same pass this page was built.
export const metadata: Metadata = {
  title: 'Elite Orchard — Residential Plots in Guduvanchery | OmShakthy Homes',
  description:
    'Elite Orchard is a sold-out 25-acre gated community of 510 residential plots in Guduvanchery, Chennai — close to Guduvanchery Railway Station and Mahindra World City.',
  openGraph: {
    title: 'Elite Orchard — Residential Plots in Guduvanchery',
    description: 'A 25-acre gated community of residential plots in Guduvanchery, Chennai.',
  },
}

export default function EliteOrchardPage() {
  const data = getProjectData('elite-orchard')!
  return (
    <>
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
