// The real project dataset — originally defined inline in
// ProjectsContent.tsx (the same array PropertyGrid.tsx / home page
// already uses). Pulled out into its own plain (non-'use client')
// module so Server Component pages — /ongoing-projects,
// /upcoming-projects, /completed-projects, all real indexed URLs per
// Balaji's Aug 2026 SEO report — can import and filter it directly.
// Importing a plain data export from a 'use client' module into a
// Server Component doesn't resolve reliably (every export of a client
// module becomes a client reference), so the data lives here instead
// and ProjectsContent.tsx imports it back.
export interface Project {
  image: string
  name: string
  location: string
  /* Back to two states per request — a 'Completed' state briefly
     existed here (Mathura/Kanopus Mithila were 'Sold' but their own
     pages show real, live prices, not "Sold Out") but was folded back
     into 'Ongoing' rather than 'Sold': both still have a real price on
     their own page, which 'Ongoing' honestly reflects — 'Sold' stays
     reserved for the one project whose own page literally says
     "Price: Sold Out" (Elite Orchard). */
  status: 'Ongoing' | 'Sold'
  type: string
  price: string
  /* Numeric ₹-lakh value for real price-range bucketing — null for
     sold-out projects (no live asking price to bucket) or ones priced
     per-sq.ft rather than as a single lakh figure. */
  priceLakh: number | null
  link?: string
  /* CSS object-position override for the card photo — most images
     center fine by default; a couple (their gate sign sits high, with
     a lot of empty sky above it) read better shifted down so the crop
     favors the entrance itself. */
  imagePosition?: string
}

/* Real data — the same array PropertyGrid.tsx (home page) already
   uses, just recompressed images (public/projects/*.jpg vs. the
   original 2.3-2.8MB public/*.png files) since ProjectsContent.tsx
   shows them at a larger, more prominent size than the home slider
   does. */
export const projects: Project[] = [
  // Location corrected: canopus-magha-lp.html's own copy explicitly
  // says "Enveloped in the epicenter of Avadi" — 'Guduvanchery' looks
  // like leftover boilerplate copy-pasted from a different project (the
  // same class of error regalia-lp.html itself had once, for Regalia).
  // /kanopus-magha is now a real page (src/data/projects/kanopus-magha.json).
  { image: '/projects/canopus-magha.webp', name: 'Kanopus Magha', location: 'Avadi, Chennai', status: 'Ongoing', type: 'Residential Plots', price: '₹25L onwards', priceLakh: 25, link: '/canopus-magha-lp' },
  // Location corrected: 'Avadi' was wrong — regalia-lp.html on the
  // original site repeatedly and explicitly places this project in
  // Tambaram ("Omshakthy Regalia Tambaram location," 70 acres/961
  // plots matching that paragraph's own numbers exactly). Avadi looks
  // like leftover boilerplate copy-pasted from a different project.
  { image: '/projects/regalia.webp', name: 'OmShakthy Regalia', location: 'Tambaram, Chennai', status: 'Ongoing', type: 'Gated Community', price: '₹32L onwards', priceLakh: 32, link: '/regalia-lp', imagePosition: '50% 31%' },
  // Location corrected: elite-grand-lp.html's own copy explicitly says
  // "Strategically Located Near Guduvanchery" — 'Thirumullaivoyal' was
  // wrong. /elite-grand is now a real page.
  { image: '/projects/elite-grand.webp', name: 'Elite Grand', location: 'Guduvanchery, Chennai', status: 'Ongoing', type: 'Premium Plots', price: '₹28L onwards', priceLakh: 28, link: '/elite-grand-lp', imagePosition: '50% 35%' },
  // Location corrected: mathura-lp.html's own real FAQ says plainly
  // "OmShakthy Mathura is a residential plot development project
  // located in Chromepet" — 'Tambaram' was wrong. /mathura is now a
  // real page. Status corrected too: this was marked 'Sold' with
  // price "Sold Out", but mathura-lp's own live spec table shows a
  // real price ("22.5 Lakhs") — it's a "Completed Project" on the
  // site's own footer nav (construction/layout finished), not sold out.
  { image: '/projects/mathura.webp', name: 'OmShakthy Mathura', location: 'Chromepet, Chennai', status: 'Ongoing', type: 'Residential Plots', price: '₹22.5L onwards', priceLakh: 22.5, link: '/mathura-lp' },
  // Location corrected: canopus-mithila-lp.html's own "Locations
  // Nearby" list (Avadi Railway Station, Ayyapakkam, Mogappair, Heavy
  // Vehicles Factory) places this in the Avadi corridor — 'Vandalur'
  // was wrong. /kanopus-mithila is now a real page. Status corrected
  // too: canopus-mithila-lp's own live spec table shows a real price
  // ("₹3,500/- per Sq.Ft."), not "Sold Out" — same fix as Mathura.
  { image: '/projects/property-5.webp', name: 'Kanopus Mithila', location: 'Avadi, Chennai', status: 'Ongoing', type: 'Gated Community', price: '₹3,500 / Sq.Ft', priceLakh: null, link: '/canopus-mithila-lp' },
  // Location left as-is, flagged rather than guessed: industrial-park-lp.html
  // names no specific locality at all (title/meta both just say
  // "Chennai"), and its own real drive times (Airport 10 min, Tambaram
  // Railway Station 15 min) don't actually match Sriperumbudur (a
  // 40+ min drive from the airport) — but with nothing more specific
  // stated on the source page, this wasn't replaced with a guess.
  // Status corrected: this was marked 'Sold' with price "Sold Out",
  // but industrial-park-lp's own live spec table has never had a real
  // price at all — it's a literal, unfilled "Price: XXXX" on the real
  // site, and the page still has a live, active "Book a Free Site
  // Visit" form and no "Sold Out" banner anywhere. That's a project
  // still being sold with an unset price, not a sold-out one — the
  // site's own footer nav lists it under Ongoing too. /industrial-park
  // is now a real page.
  { image: '/projects/property-6.webp', name: 'Industrial Park', location: 'Sriperumbudur, Chennai', status: 'Ongoing', type: 'Industrial', price: 'Price on Request', priceLakh: null, link: '/industrial-park-lp' },
  // Location corrected: elite-orchard-lp.html's own "Locations Nearby"
  // list (Guduvanchery Railway Station, Kilambakkam Bus Terminal,
  // Mahindra World City, Potheri Railway Station, ORR) places this in
  // Guduvanchery — 'Paruthipattu, Avadi' was wrong. /elite-orchard is
  // now a real page.
  { image: '/projects/elite-orchard.webp', name: 'Elite Orchard', location: 'Guduvanchery, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null, link: '/elite-orchard-lp' },
  // The 7 entries below are real, older completed projects that were
  // missing entirely — confirmed against the live site's own
  // /completed-projects carousel (checked directly, not the mirror,
  // since it isn't in the 131-page mirror this rebuild is otherwise
  // built from). None of these 7 have a "KNOW MORE" link anywhere on
  // the live site either — they're portfolio-only entries there too,
  // so no `link` here either rather than inventing a page the real
  // site itself never built. Sizes/acreage/location are the live
  // site's own stated figures, word for word.
  { image: '/projects-legacy/omshakthy-eden.webp', name: 'OmShakthy Eden', location: 'Kundrathur, Chennai', status: 'Sold', type: 'Residential Apartment', price: 'Sold Out', priceLakh: null },
  // Same real "OMSHAKTHY Elite" gate photo HeroSlider.tsx/GalleryContent.tsx
  // already reference — HeroSlider.tsx had mislabeled it "Elite Grand"
  // (a different, unrelated project with its own real photo), fixed in
  // the same pass as this entry.
  { image: '/hero-slide-3.webp', name: 'OmShakthy Elite Phase 1', location: 'Guduvanchery, Chennai', status: 'Sold', type: 'Residential Land', price: 'Sold Out', priceLakh: null },
  // Same real gate photo HeroSlider.tsx/GalleryContent.tsx/PropertyGrid.tsx
  // already use for this project — one file everywhere it appears.
  { image: '/hero-slide-1.webp', name: 'OmShakthy Santha Towers', location: 'Avadi, Chennai', status: 'Sold', type: 'Residential Apartment', price: 'Sold Out', priceLakh: null },
  { image: '/projects-legacy/omshakthy-sara-courtyard.webp', name: 'OmShakthy Sara Courtyard', location: 'K.K. Nagar, Chennai', status: 'Sold', type: 'Residential Apartment', price: 'Sold Out', priceLakh: null },
  { image: '/projects-legacy/omshakthy-santha-patio.webp', name: 'OmShakthy Santha Patio', location: 'Adyar, Chennai', status: 'Sold', type: 'Residential Apartment', price: 'Sold Out', priceLakh: null },
  { image: '/projects-legacy/omshakthy-temple-nagar.webp', name: 'OmShakthy Temple Nagar', location: 'Kundrathur, Chennai', status: 'Sold', type: 'Residential Land', price: 'Sold Out', priceLakh: null },
]
