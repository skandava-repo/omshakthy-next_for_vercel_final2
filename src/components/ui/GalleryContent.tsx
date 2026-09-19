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

// Second pass swaps each tile's size (sm<->md, lg stays lg but shifted in
// the sequence) so a repeated photo doesn't land in an identically-shaped
// slot right after its first appearance.
const SWAP_SIZE: Record<string, 'lg' | 'md' | 'sm'> = { lg: 'lg', md: 'sm', sm: 'md' }

const images = [
  ...baseImages.map((img, i) => ({ ...img, key: `a-${i}` })),
  ...baseImages.map((img, i) => ({
    ...img,
    size: SWAP_SIZE[img.size],
    key: `b-${i}`,
  })),
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
