import type { Metadata } from 'next'
import RegaliaContent from '@/components/ui/RegaliaContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/schema-org'

// Same 5 real questions RegaliaContent.tsx's own FAQ section renders —
// duplicated here rather than imported since that array lives inline
// in the client component's JSX, not exported. Keep both in sync if
// the FAQ copy there ever changes.
const REGALIA_FAQ = [
  {
    question: 'Is Omshakthy a trusted real estate developer in Chennai?',
    answer:
      'Omshakthy Homes (a division of Omshakthy Agencies, established 1991) has served more than 20,000 customers across several RERA-registered residential plots and apartment projects.',
  },
  {
    question: 'Is Omshakthy Regalia RERA registered?',
    answer:
      'Yes — the project carries CMDA and DTCP approvals, and is registered with TNRERA. Ask our sales team for the exact RERA registration number and verify it directly on the TNRERA portal before booking.',
  },
  {
    question: 'How long has Omshakthy been in the business?',
    answer:
      'Omshakthy Agencies (Madras) Pvt Ltd traces its roots to 1991 and carries more than 30 years of experience in the Chennai land market.',
  },
  {
    question: 'Where is Omshakthy located?',
    answer:
      'OmShakthy Tower, 1N1 Jawaharlal Nehru Salai, Ekkaduthangal, Chennai 600032. Call to arrange an office visit or a Saturday site walk.',
  },
  {
    question: 'Can NRIs buy plots from Omshakthy?',
    answer: 'Yes. NRIs can invest subject to standard RBI and FEMA guidelines governing NRI property purchases in India.',
  },
]

export const metadata: Metadata = {
  alternates: { canonical: '/regalia-lp' },
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
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'OmShakthy Regalia', path: '/regalia-lp' },
  ])
  const faqSchema = getFAQSchema(REGALIA_FAQ)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <RegaliaContent />
      <Footer />
    </>
  )
}
