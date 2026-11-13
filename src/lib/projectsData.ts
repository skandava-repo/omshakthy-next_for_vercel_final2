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
  /* Was two states ('Ongoing' | 'Sold') per an earlier request — a
     'Completed' state briefly existed (Mathura/Kanopus Mithila were
     'Sold' but their own pages show real, live prices, not "Sold
     Out") but was folded back into 'Ongoing' rather than 'Sold': both
     still have a real price on their own page, which 'Ongoing'
     honestly reflects — 'Sold' stays reserved for the one project
     whose own page literally says "Price: Sold Out" (Elite Orchard).
     'Upcoming' added back for the one real not-yet-launched project
     prod's own upcoming-projects.php still lists (Proposed Scheme III
     below) — distinct from 'Sold'/'Ongoing' since it has no live price
     or sale at all yet, just a "Coming Soon" placeholder on prod too. */
  status: 'Ongoing' | 'Sold' | 'Upcoming'
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
  // Status has flip-flopped on direct instruction before (Ongoing ->
  // Sold -> back to Ongoing, see earlier git history) — now marked
  // Sold again, link dropped so the card is non-clickable, same per
  // direct instruction. Note: industrial-park-lp itself is untouched
  // and still live/reachable directly by URL; it's just no longer
  // linked from this card.
  { image: '/projects/property-6.webp', name: 'Industrial Park', location: 'Sriperumbudur, Chennai', status: 'Sold', type: 'Industrial', price: 'Sold Out', priceLakh: null },
  // Location corrected: canopus-magha-lp.html's own copy explicitly
  // says "Enveloped in the epicenter of Avadi" — 'Guduvanchery' looks
  // like leftover boilerplate copy-pasted from a different project (the
  // same class of error regalia-lp.html itself had once, for Regalia).
  // Marked Sold; link restored per direct instruction — the earlier "no
  // independent page navigation for sold projects" rule is reversed.
  // /canopus-magha-lp itself was always unchanged/still live; the
  // real site's own footer (omshakthy-mirror) still links "Canopus
  // Magha" straight to canopus-magha-lp.html too, same as this.
  { image: '/projects/canopus-magha.webp', name: 'Kanopus Magha', location: 'Avadi, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null, link: '/canopus-magha-lp' },
  // Location corrected: mathura-lp.html's own real FAQ says plainly
  // "OmShakthy Mathura is a residential plot development project
  // located in Chromepet" — 'Tambaram' was wrong. Marked Sold; link
  // restored per direct instruction (same reversal as Kanopus Magha
  // above) — note mathura-lp itself still shows a live price/form
  // unless that page is separately updated. Distinct from "OmShakthy
  // Mathura Elite" (Thirumazhisai) below.
  { image: '/projects/mathura.webp', name: 'OmShakthy Mathura', location: 'Chromepet, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null, link: '/mathura-lp' },
  // Location corrected: canopus-mithila-lp.html's own "Locations
  // Nearby" list (Avadi Railway Station, Ayyapakkam, Mogappair, Heavy
  // Vehicles Factory) places this in the Avadi corridor — 'Vandalur'
  // was wrong. Marked Sold; link restored per direct instruction (same
  // reversal) — note canopus-mithila-lp itself still shows a live
  // price/form unless that page is separately updated.
  { image: '/projects/property-5.webp', name: 'Kanopus Mithila', location: 'Avadi, Chennai', status: 'Sold', type: 'Gated Community', price: 'Sold Out', priceLakh: null, link: '/canopus-mithila-lp' },
  // Location corrected: elite-orchard-lp.html's own "Locations Nearby"
  // list (Guduvanchery Railway Station, Kilambakkam Bus Terminal,
  // Mahindra World City, Potheri Railway Station, ORR) places this in
  // Guduvanchery — 'Paruthipattu, Avadi' was wrong. Marked Sold; link
  // restored per direct instruction (same reversal) — this one had
  // already had its link dropped once before this same rule, now back.
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
  // Real project missing entirely before this pass — prod's own
  // upcoming-projects.php (checked directly, not stale) still lists
  // exactly one real upcoming card: "Proposed Scheme III - Industrial
  // Plot," Thirumudivakkam, 8 Acres / 349,000 sq.ft., marked "Coming
  // Soon" with no live link there either — same no-`link` treatment as
  // the completed legacy entries above. No real photo exists for it
  // (prod's own image there is a route/location map graphic, not a
  // property shot), so this reuses Industrial Park's image above
  // rather than inventing a fake one — same generic industrial-type
  // treatment, not a claim they're the same project.
  { image: '/projects/property-6.webp', name: 'Proposed Scheme III - Industrial Plot', location: 'Thirumudivakkam, Chennai', status: 'Upcoming', type: 'Industrial', price: 'Coming Soon', priceLakh: null },
  // Three new real upcoming MSB (Multi-Storey Building) projects, with
  // real renders provided directly — no `link` yet (no landing page
  // exists for any of them), same as Proposed Scheme III above. Specs
  // noted here since there's no dedicated field for acreage/floors/
  // saleable area beyond `price`/`type`:
  // - Paruthipattu: 1.76 acres, Basement + Stilt + 14 floors, 2,10,000 sq.ft. saleable
  { image: '/projects/msb-paruthipattu.webp', name: 'Paruthipattu', location: 'Paruthipattu, Chennai', status: 'Upcoming', type: 'Residential Apartment', price: 'Coming Soon', priceLakh: null },
  // - Coimbatore: 2.45 acres, Stilt + 5 floors, 2,75,000 sq.ft. saleable
  { image: '/projects/msb-coimbatore.webp', name: 'Coimbatore', location: 'Coimbatore, Tamil Nadu', status: 'Upcoming', type: 'Residential Apartment', price: 'Coming Soon', priceLakh: null },
  // - Madurai: 1.65 acres, Stilt + 5 floors, 2,00,000 sq.ft. saleable
  { image: '/projects/msb-madurai.webp', name: 'Madurai', location: 'Madurai, Tamil Nadu', status: 'Upcoming', type: 'Residential Apartment', price: 'Coming Soon', priceLakh: null },
]
