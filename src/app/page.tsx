import type { Metadata } from 'next'
import { getOrganizationSchema } from '@/lib/schema-org'
import HomeClient from '@/components/ui/HomeClient'

// Title/description already come from the root layout's defaults —
// this only adds the one thing every other page sets for itself but
// the homepage never did: a self-referencing canonical tag.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  const jsonLd = getOrganizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  )
}
