import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EmiCalculatorContent from '@/components/ui/EmiCalculatorContent'
import { getBreadcrumbSchema } from '@/lib/schema-org'

// New page: real, indexed URL per Balaji's Aug 2026 SEO report, never
// built in the rebuild before now.
export const metadata: Metadata = {
  alternates: { canonical: '/emi-calculator' },
  title: 'Loan EMI Eligibility Calculator – Chennai Home Loans',
  description: 'Use our home loan EMI calculator to estimate your monthly repayment based on loan amount, interest rate, and tenure.',
}

export default function EmiCalculatorPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'EMI Calculator', path: '/emi-calculator' },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <EmiCalculatorContent />
      <Footer />
    </>
  )
}
