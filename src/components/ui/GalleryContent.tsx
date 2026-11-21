'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './GalleryContent.css'

/* ============================================================
   GalleryContent — bento grid.
   Three tile sizes (lg/md/sm) spanning different col/row counts, arranged
   in clean order (no overlap) — this is what creates visual hierarchy
   here, since every source photo is roughly the same 3:2 landscape ratio
   and a plain equal-width grid gave zero size variation otherwise.
   ============================================================ */

const baseImages = [
  { src: '/hero-new-1.webp', size: 'lg' },
  { src: '/hero-new-2.webp', size: 'md' },
  { src: '/hero-new-3.webp', size: 'sm' },
  { src: '/hero-new-22.webp', size: 'sm' },
  { src: '/hero-slide-1.webp', size: 'md' },
  { src: '/hero-slide-2.webp', size: 'sm' },
  { src: '/hero-slide-3.webp', size: 'sm' },
  { src: '/hero-slide-4.webp', size: 'lg' },
  { src: '/hero-slide-5.webp', size: 'sm' },
  { src: '/hero-slide-6.webp', size: 'md' },
  { src: '/hero-slide-7.webp', size: 'sm' },
  { src: '/hero-slide-8.webp', size: 'sm' },
  { src: '/hero-slide-9.webp', size: 'md' },
  { src: '/hero-slide-11.webp', size: 'sm' },
  { src: '/hero-slide-88.webp', size: 'lg' },
  { src: '/hero-slide-99.webp', size: 'sm' },
  { src: '/canopus-magha.webp', size: 'md' },
  { src: '/elite-grand.webp', size: 'sm' },
] as const

// Everything after the first 18 tiles is the AI-polished hero shot set
// (public/gallery/*), already interleaved across projects (Elite Mathura,
// Industrial Park, Magha, Regalia, Elite Grand, Potheri, Santha Towers,
// site photos) so neighbouring tiles come from different sites. The
// company-history timeline images that used to fill this were removed on
// request. 54 shots = 3 x 18, so the tile-size pattern repeats cleanly.
const polishedImages = [
  '/gallery/01-elite-mathura.webp',
  '/gallery/02-industrial-park.webp',
  '/gallery/03-magha.webp',
  '/gallery/04-magha-grand.webp',
  '/gallery/05-omshakthy-regalia.webp',
  '/gallery/06-omshkathyelite-grand.webp',
  '/gallery/07-potheri-render-images.webp',
  '/gallery/08-santha-towers-photos.webp',
  '/gallery/09-site-photos.webp',
  '/gallery/10-elite-mathura.webp',
  '/gallery/11-industrial-park.webp',
  '/gallery/12-magha.webp',
  '/gallery/13-magha-grand.webp',
  '/gallery/14-omshakthy-regalia.webp',
  '/gallery/15-omshkathyelite-grand.webp',
  '/gallery/16-potheri-render-images.webp',
  '/gallery/17-site-photos.webp',
  '/gallery/18-elite-mathura.webp',
  '/gallery/19-industrial-park.webp',
  '/gallery/20-magha.webp',
  '/gallery/21-omshkathyelite-grand.webp',
  '/gallery/22-potheri-render-images.webp',
  '/gallery/23-site-photos.webp',
  '/gallery/24-elite-mathura.webp',
  '/gallery/25-industrial-park.webp',
  '/gallery/26-magha.webp',
  '/gallery/27-omshkathyelite-grand.webp',
  '/gallery/28-potheri-render-images.webp',
  '/gallery/29-site-photos.webp',
  '/gallery/30-elite-mathura.webp',
  '/gallery/31-industrial-park.webp',
  '/gallery/32-magha.webp',
  '/gallery/33-site-photos.webp',
  '/gallery/34-elite-mathura.webp',
  '/gallery/35-industrial-park.webp',
  '/gallery/36-magha.webp',
  '/gallery/37-elite-mathura.webp',
  '/gallery/38-industrial-park.webp',
  '/gallery/39-magha.webp',
  '/gallery/40-elite-mathura.webp',
  '/gallery/41-industrial-park.webp',
  '/gallery/42-magha.webp',
  '/gallery/43-elite-mathura.webp',
  '/gallery/44-industrial-park.webp',
  '/gallery/45-magha.webp',
  '/gallery/46-elite-mathura.webp',
  '/gallery/47-industrial-park.webp',
  '/gallery/48-magha.webp',
  '/gallery/49-elite-mathura.webp',
  '/gallery/50-industrial-park.webp',
  '/gallery/51-magha.webp',
  '/gallery/52-elite-mathura.webp',
  '/gallery/53-industrial-park.webp',
  '/gallery/54-magha.webp',
] as const

const SWAP_SIZE: Record<string, 'lg' | 'md' | 'sm'> = { lg: 'lg', md: 'sm', sm: 'md' }

const images = [
  ...baseImages.map((img, i) => ({ ...img, key: `a-${i}` })),
  ...polishedImages.map((src, i) => {
    const base = baseImages[i % baseImages.length]
    // odd passes swap the size so a repeated slot isn't identically shaped
    return { src, size: Math.floor(i / baseImages.length) % 2 === 0 ? SWAP_SIZE[base.size] : base.size, key: `p-${i}` }
  }),
]

const EASE = [0.16, 1, 0.3, 1] as const

const GalleryContent = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, amount: 0.05 })

  return (
    <section className="gc" aria-label="Gallery">
      <div className="gc__inner">
        <header className="gc__header">
          <span className="gc__eyebrow">OmShakthy Gallery</span>
          <motion.h1
            className="gc__title"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Moments <em>Worth Keeping</em>
          </motion.h1>
        </header>

        <div className="gc__grid" ref={gridRef}>
          {images.map((item, i) => (
            <motion.figure
              className={`gc__tile gc__tile--${item.size}`}
              key={item.key}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 6) * 0.06 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" loading="lazy" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GalleryContent
