import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'

// Real content extracted from canopus-magha-lp.html on the old mirror
// site — see src/data/projects/kanopus-magha.json. The page's own copy
// says "Enveloped in the epicenter of Avadi" — the ProjectsContent.tsx
// listing this links from previously said "Guduvanchery, Chennai" for
// this project; Avadi is what this page's own real content actually
// backs up, so that's what's used here (and fixed at the source in
// ProjectsContent.tsx/PropertyGrid.tsx in the same pass).
export const metadata: Metadata = {
  title: 'Kanopus Magha — Residential Plots in Avadi | OmShakthy Homes',
  description:
    'Kanopus Magha is a 172-acre mega plotted township in Avadi, Chennai — 440 residential plots, litigation-free clear titles, close to Avadi Railway Station and Metro.',
  openGraph: {
    title: 'Kanopus Magha — Residential Plots in Avadi',
    description: 'A 172-acre mega plotted township in Avadi, Chennai.',
  },
}

export default function KanopusMaghaPage() {
  const data = getProjectData('kanopus-magha')!
  return (
    <>
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
