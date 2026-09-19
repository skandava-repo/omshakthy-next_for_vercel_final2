// JSON-LD structured data for SEO
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'OmShakthy Homes',
    alternateName: 'OmShakthy Agencies (Madras) Private Limited',
    url: 'https://www.omshakthy.com',
    logo: 'https://www.omshakthy.com/omshakthy-logo.webp',
    description:
      'OmShakthy Homes — generating real assets since 1991. Best plot developers in Chennai offering CMDA & DTCP approved residential plots.',
    foundingDate: '1991',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'OmShakthy Tower, 1N1, Jawaharlal Nehru Salai',
      addressLocality: 'Ekkaduthangal',
      addressRegion: 'Chennai',
      postalCode: '600032',
      addressCountry: 'IN',
    },
    telephone: '+914440303040',
    email: 'marketing@omshakthy.net',
    sameAs: [],
    areaServed: {
      '@type': 'City',
      name: 'Chennai',
    },
  }
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
