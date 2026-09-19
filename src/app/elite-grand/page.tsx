import type { Metadata } from 'next'
import ProjectLandingContent from '@/components/ui/ProjectLandingContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getProjectData } from '@/lib/projects'

// Real content extracted from elite-grand-lp.html — see
// src/data/projects/elite-grand.json. Its own copy explicitly says
// "Strategically Located Near Guduvanchery" — ProjectsContent.tsx
// previously said "Thirumullaivoyal, Chennai", fixed in the same pass
// this page was built.
export const metadata: Metadata = {
  title: 'Elite Grand — Residential Plots Near Guduvanchery | OmShakthy Homes',
  description:
    'Elite Grand offers 177 residential plots near Guduvanchery, Chennai — DTCP approved, close to SRM University and major educational institutions.',
  openGraph: {
    title: 'Elite Grand — Residential Plots Near Guduvanchery',
    description: 'DTCP approved residential plots near Guduvanchery, Chennai.',
  },
}

export default function EliteGrandPage() {
  const data = getProjectData('elite-grand')!
  return (
    <>
      <Header />
      <ProjectLandingContent data={data} />
      <Footer />
    </>
  )
}
