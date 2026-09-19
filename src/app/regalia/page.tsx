import type { Metadata } from 'next'
import RegaliaContent from '@/components/ui/RegaliaContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  // 'Avadi' was wrong (see RegaliaContent.tsx's own comment) — the
  // original site's regalia-lp.html repeatedly places this project in
  // Tambaram. The fabricated RERA ID (TN/1/Layout/2490/2025, not found
  // anywhere on the original site) is also dropped from the description
  // rather than repeated here.
  title: 'OmShakthy Regalia — Luxury Gated Community in Tambaram',
  description:
    'OmShakthy Regalia is a premium gated community in Tambaram, Chennai — 961 CMDA & DTCP approved residential plots across 70 acres, clear title.',
  openGraph: {
    title: 'OmShakthy Regalia — Luxury Gated Community',
    description: 'Premium gated community in Tambaram, Chennai. CMDA & DTCP approved.',
  },
}

export default function RegaliaPage() {
  return (
    <>
      <Header />
      <RegaliaContent />
      <Footer />
    </>
  )
}
