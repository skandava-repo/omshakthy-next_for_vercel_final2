/**
 * Background media preloader.
 *
 * Used by IntroSection: once the intro video is actually playing, the
 * remaining ~10s of runway is used to warm the browser cache for the
 * heaviest below-the-fold images (hero slider, property grid, financial
 * partner logos) so they don't compete with the video for bandwidth/decode
 * time and don't stutter in when the intro swipes away.
 *
 * All requests fire in parallel — the browser's own connection pool and
 * priority scheduling handles contention with the video far better than an
 * artificial one-at-a-time queue would.
 */
export function preloadImages(urls: string[]) {
  if (typeof window === 'undefined') return

  urls.forEach((url) => {
    const img = new window.Image()
    img.decoding = 'async'
    img.src = url
  })
}

// The heaviest below-the-fold assets the user hits right after the intro:
// hero slideshow first, then the property grid (both visible within the
// first couple of scrolls on Home).
export const HERO_PRELOAD_IMAGES = [
  '/hero-new-3.webp',
  '/hero-slide-9.webp',
  '/hero-slide-3.webp',
  '/hero-slide-1.webp',
  '/hero-slide-8.webp',
  '/hero-slide-2.webp',
  '/hero-new-2.webp',
]

export const PROPERTY_PRELOAD_IMAGES = [
  '/canopus-magha.webp',
  '/regalia.webp',
  '/elite-grand.webp',
  '/mathura.webp',
  '/property-5.webp',
  '/property-6.webp',
]

// Financial Partners logo strip (TrustedPartnersSection) — small files, but
// warming them here means they're already cached by the time the user
// scrolls that far down the page.
export const PARTNER_PRELOAD_IMAGES = [
  '/partners/hdfc.webp',
  '/partners/icici.webp',
  '/partners/axis.webp',
  '/partners/kotak.webp',
  '/partners/idfc-first.webp',
  '/partners/bajaj-finserv.webp',
]
