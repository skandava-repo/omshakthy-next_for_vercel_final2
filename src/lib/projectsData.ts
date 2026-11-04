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
  // Ordering: Ongoing (available) projects first, Sold after — per
  // direct request, so the listing/grid leads with what's actually
  // still for sale rather than array order being arbitrary.
  //
  // Status per direct instruction: every project is Sold except these
  // two. Sold projects also lose their `link` — "for sold out project
  // we should not allow to independent page navigation" — so a sold
  // card is portfolio-only now, same as the legacy entries below
  // always were, instead of still pointing at a live landing page with
  // its own price and site-visit form.
  //
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
  // New project, added from "Mathura broucher PDF FILE 5mm Bleed.pdf"
  // (OCR'd — no text layer, print-ready file). Distinct from the
  // existing "OmShakthy Mathura" above (Chromepet) — this one is
  // Thirumazhisai, a separate, newly-launching project. The brochure
  // itself states no price — was a raw "PRICE_TBD" literal (a
  // programmer placeholder, never meant for real users) shown verbatim
  // on-screen everywhere this card renders, caught live on /regalia-lp's
  // own new Featured Projects cross-sell card during a parity pass.
  // "Price on Request" instead — same real treatment Industrial Park's
  // own still-unresolved price already uses.
  { image: '/projects/mathura-elite.webp', name: 'OmShakthy Mathura Elite', location: 'Thirumazhisai, Chennai', status: 'Ongoing', type: 'Residential Plots', price: 'Price on Request', priceLakh: null, link: '/mathura-elite-lp' },
  // Location left as-is, flagged rather than guessed: industrial-park-lp.html
  // names no specific locality at all (title/meta both just say
  // "Chennai"), and its own real drive times (Airport 10 min, Tambaram
  // Railway Station 15 min) don't actually match Sriperumbudur (a
  // 40+ min drive from the airport) — but with nothing more specific
  // stated on the source page, this wasn't replaced with a guess.
  // Was briefly marked Sold per direct instruction, then reverted back
  // to Ongoing per a later direct instruction — link and price restored
  // to match industrial-park-lp's own still-live page (an unset
  // "Price: XXXX" on the real site, no "Sold Out" banner, active
  // "Book a Free Site Visit" form).
  { image: '/projects/property-6.webp', name: 'Industrial Park', location: 'Sriperumbudur, Chennai', status: 'Ongoing', type: 'Industrial', price: 'Price on Request', priceLakh: null, link: '/industrial-park-lp' },
  // Location corrected: canopus-magha-lp.html's own copy explicitly
  // says "Enveloped in the epicenter of Avadi" — 'Guduvanchery' looks
  // like leftover boilerplate copy-pasted from a different project (the
  // same class of error regalia-lp.html itself had once, for Regalia).
  // Marked Sold per direct instruction — link dropped (see note above);
  // /canopus-magha-lp itself is unchanged/still live, just no longer
  // linked from this card.
  { image: '/projects/canopus-magha.webp', name: 'Kanopus Magha', location: 'Avadi, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null },
  // Location corrected: mathura-lp.html's own real FAQ says plainly
  // "OmShakthy Mathura is a residential plot development project
  // located in Chromepet" — 'Tambaram' was wrong. Marked Sold per
  // direct instruction, link dropped — note mathura-lp itself still
  // shows a live price/form unless that page is separately updated.
  // Distinct from "OmShakthy Mathura Elite" (Thirumazhisai) below.
  { image: '/projects/mathura.webp', name: 'OmShakthy Mathura', location: 'Chromepet, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null },
  // Location corrected: canopus-mithila-lp.html's own "Locations
  // Nearby" list (Avadi Railway Station, Ayyapakkam, Mogappair, Heavy
  // Vehicles Factory) places this in the Avadi corridor — 'Vandalur'
  // was wrong. Marked Sold per direct instruction, link dropped — note
  // canopus-mithila-lp itself still shows a live price/form unless
  // that page is separately updated.
  { image: '/projects/property-5.webp', name: 'Kanopus Mithila', location: 'Avadi, Chennai', status: 'Sold', type: 'Gated Community', price: 'Sold Out', priceLakh: null },
  // Location corrected: elite-orchard-lp.html's own "Locations Nearby"
  // list (Guduvanchery Railway Station, Kilambakkam Bus Terminal,
  // Mahindra World City, Potheri Railway Station, ORR) places this in
  // Guduvanchery — 'Paruthipattu, Avadi' was wrong. Was already Sold,
  // but still had a `link` to elite-orchard-lp — dropped now per the
  // "no independent page navigation for sold projects" rule.
  { image: '/projects/elite-orchard.webp', name: 'Elite Orchard', location: 'Guduvanchery, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null },
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
