import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactContent from '@/components/ui/ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with OmShakthy Homes. Visit our office at Ekkaduthangal, Chennai, call 044 4030 3040, or message us on WhatsApp for site visits and inquiries.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactContent />
      <Footer />
    </>
  )
}
