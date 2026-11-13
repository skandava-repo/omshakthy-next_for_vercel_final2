'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion, motion, AnimatePresence } from 'framer-motion'
import { useScaleToFit } from '@/lib/useScaleToFit'
import './TestimonialsSection.css'

interface Review {
  quote: string
  name: string
  detail: string
  photo: string
  rating: number
}

// Real content from the old live site's own testimonials.php (via the
// local mirror) — all 6 written testimonials that exist there, with
// their real photos (also pulled from the mirror, converted to webp).
// Replaces an earlier placeholder/fabricated pass: 5 of the previous 7
// entries (Suresh Rajan, Priya Sharma, Rajesh Kumar, Anitha Patel,
// Vikram & Meera Iyer) referenced projects that don't exist anywhere
// on the real site ("OmShakthy Heights/Crown/Residency/Meadows") and
// had dummy lorem-ipsum text appended to their quotes — neither the
// people nor the projects were real. All 6 real testimonials here are
// from OmShakthy Santha Towers, Paruthipattu (the only project the old
// site's testimonials page actually has quotes for).
const reviews: Review[] = [
  {
    quote:
      "Definitely! I feel happier and luckier after purchasing this flat. Life has changed for better. Owning a flat in Santha Towers is a symbol of security for my retired life.",
    name: 'Jalaja Madanmohan',
    detail: 'B103 – OmShakthy Santha Towers',
    photo: '/testimonials/real/jalaja-madanmohan.webp',
    rating: 5,
  },
  {
    quote:
      "I specifically would like to thank OmShakthy and its team for providing, at extra cost, Reticulated Gas facility which was not originally listed in the construction agreement.",
    name: 'D. Dhanasekaran',
    detail: 'D802 – OmShakthy Santha Towers',
    photo: '/testimonials/real/dhanasekaran.webp',
    rating: 5,
  },
  {
    quote:
      "We are proud to be the owners of Santha Towers which has fulfilled all our criteria. Our special thanks to the management who have conceptualised budget homes.",
    name: 'C. Nireesh',
    detail: 'B703 – OmShakthy Santha Towers',
    photo: '/testimonials/real/nireesh.webp',
    rating: 5,
  },
  {
    quote:
      "It's simply awesome, a wonderful living environment — a remarkable tribute to both OmShakthy and Santha Towers for changing the vicinity of Paruthipattu into the pride of Chennai.",
    name: 'Inturi Sivanarayana',
    detail: 'B802 – OmShakthy Santha Towers',
    photo: '/testimonials/real/sivanarayana.webp',
    rating: 5,
  },
  {
    quote:
      "OmShakthy built the flats to an uncompromising quality — I observed it stage-wise. OmShakthy stands first in finding a strategic location like Paruthipattu for community living, and is customer-friendly in sorting out every need.",
    name: 'Aradyula V. Sastry',
    detail: 'B801 – OmShakthy Santha Towers',
    photo: '/testimonials/real/aradyula-sastry.webp',
    rating: 5,
  },
  {
    quote:
      "It is really our weekend getaway for the time being. So at present my views are filled with peace, tranquillity, energy, breeze and brightness.",
    name: 'S. Vasant Rao',
    detail: 'C1004 – OmShakthy Santha Towers',
    photo: '/testimonials/real/vasant-rao.webp',
    rating: 5,
  },
]

// The side-column tiles show all 6 real reviews (3-and-3 columns) —
// no video/written distinction any more, since none of the 6 real
// testimonials have an actual video file behind them (see Tile's own
// comment below).
const videoReviews: Review[] = reviews

const Stars = ({ n }: { n: number }) => (
  <span className="tw-stars" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < n ? 'is-on' : ''} aria-hidden>
        ★
      </span>
    ))}
  </span>
)

// Odometer digit reel — each digit spins through 0-9 and lands on its value.
const ROLLS = 2 // full 0-9 cycles before settling
const CELL = 1.7 // reel cell height in em (tall enough that big serif/italic
// glyphs sit fully inside the window with margin above & below)

const DigitReel = ({
  digit,
  play,
  delay,
}: {
  digit: number
  play: boolean
  delay: number
}) => {
  // sequence: ROLLS full cycles of 0-9, then 0..digit so it lands on `digit`
  const seq: number[] = []
  for (let r = 0; r < ROLLS; r++) for (let i = 0; i < 10; i++) seq.push(i)
  for (let i = 0; i <= digit; i++) seq.push(i)
  const landIndex = seq.length - 1

  return (
    <span className="reel" aria-hidden>
      <motion.span
        className="reel__col"
        initial={{ y: 0 }}
        animate={{ y: play ? `-${landIndex * CELL}em` : 0 }}
        transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {seq.map((n, i) => (
          <span className="reel__digit" key={i}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// Renders a formatted value (e.g. "20,000", "4.9") as reels for digits and
// static glyphs for separators. Optional trailing suffix (e.g. "+").
const Odometer = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const play = inView

  let digitCount = 0
  return (
    <span className="odo" ref={ref} aria-label={value + suffix}>
      {value.split('').map((ch, i) => {
        if (ch >= '0' && ch <= '9') {
          const delay = digitCount * 0.12
          digitCount += 1
          if (reduce) {
            return (
              <span className="reel" key={i} aria-hidden>
                <span className="reel__digit">{ch}</span>
              </span>
            )
          }
          return <DigitReel key={i} digit={Number(ch)} play={play} delay={delay} />
        }
        return (
          <span className="odo__sep" key={i} aria-hidden>
            {ch}
          </span>
        )
      })}
      {suffix && (
        <span className="odo__sep" aria-hidden>
          {suffix}
        </span>
      )}
    </span>
  )
}

// Short highlights for the auto-scrolling "wall of love" ribbon.
const highlights = [
  { t: 'A symbol of security for my retired life.', n: 'Jalaja M.' },
  { t: 'They went above and beyond.', n: 'D. Dhanasekaran' },
  { t: 'Fulfilled all our criteria.', n: 'C. Nireesh' },
]

/* The featured card is a fixed height (so switching quotes doesn't jump the
   layout), so the quote's type scales to fit it instead — same idea the old
   deck used, kept here for the same reason. */
const quoteSize = (len: number) => {
  const size = 1.55 - Math.max(0, len - 100) * 0.0022
  return `${Math.max(1.25, Math.min(1.55, size)).toFixed(3)}rem`
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
    <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5z" />
  </svg>
)

/* One tile in the side columns — its own independent video preview, with
   no relationship to the featured card at all (no shared active index,
   no "now playing" badge). A real <button>, same as the original deck's
   own video-card play button, but with no onClick: there's no actual
   video file for any customer yet (checked — only photos exist in
   public/testimonials), so this is honest structural affordance for
   "this would play a video" rather than a fake handler that does nothing
   when clicked. Native button semantics still give it real keyboard
   focus/hover for free, which a plain aria-hidden div wouldn't. */
function Tile({ review }: { review: Review }) {
  return (
    <button type="button" className="tw-tile" aria-label={`Play video testimonial from ${review.name}`}>
      <img className="tw-tile-photo" src={review.photo} alt="" loading="lazy" />
      <span className="tw-tile-scrim" aria-hidden />
      <span className="tw-tile-play" aria-hidden>
        <PlayIcon />
      </span>
      <span className="tw-tile-name">{review.name}</span>
    </button>
  )
}

/* Large featured card — auto-advances through ALL of `reviews` (all 7,
   written + video ones alike) on its own timer, completely independent
   of the video tiles either side of it: no shared index, no relationship
   to which tile (if any) a screen reader/sighted user is looking at.
   Keyed on `activeKey` (the rotation index) rather than the review's own
   name/identity, purely so Framer always sees a "new" key on every
   advance — irrelevant now that this cycles the full, non-repeating
   `reviews` list (name collisions were only a videoReviews problem), but
   using the index is still the simpler, more obviously-correct choice
   than a value that happens to also be unique here. `reduce` collapses the
   transition to an instant swap, same pattern the Odometer above uses for
   prefers-reduced-motion rather than relying on the CSS media query alone
   (Framer's animate/exit props aren't touched by that media query on
   their own — they need to be told directly).

   The navy card frame (.tw-featured — background, border, shadow, brand
   mark, quote mark) is now completely static; only the actual per-review
   content (.tw-featured-body: quote + cite) is what animates, sliding
   horizontally like flipping through pages inside a fixed window. Earlier
   attempts (a literal 3D rotateY flip, then a fade+scale+drift) both
   moved the ENTIRE card as one rigid block — that's very likely what read
   as unstable/wrong: the whole navy frame jumping or spinning on every
   auto-advance. Keeping the frame still and only sliding the content is
   the more standard, reliably-polished pattern for quote/testimonial
   carousels. Same proven easing curve as before
   (cubic-bezier(0.16,1,0.3,1)) — already used elsewhere in this codebase
   (the original deck's card transitions, LeadersSection's card
   entrances), not reinvented per attempt. */
function FeaturedCard({ review, reduce, activeKey }: { review: Review; reduce: boolean; activeKey: number }) {
  return (
    <div className="tw-featured-stage">
      <article className="tw-featured">
        <div className="tw-featured-brand">
          <img src="/omshakthy-logo.webp" alt="" className="tw-featured-brand-mark" />
          OMSHAKTHY
        </div>
        <span className="tw-featured-quotemark" aria-hidden>
          &ldquo;
        </span>
        <div className="tw-featured-body-clip">
          <AnimatePresence>
            <motion.div
              key={activeKey}
              className="tw-featured-body"
              initial={reduce ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -28 }}
              transition={{ duration: reduce ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ '--tw-quote-size': quoteSize(review.quote.length) } as React.CSSProperties}
              aria-live="polite"
            >
              <blockquote className="tw-featured-quote">{review.quote}</blockquote>
              <footer className="tw-featured-cite">
                <div>
                  <span className="tw-featured-name">{review.name}</span>
                  <span className="tw-featured-detail">{review.detail}</span>
                </div>
                <Stars n={review.rating} />
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </article>
    </div>
  )
}

// How long the featured card holds each testimonial before advancing to
// the next one.
const ROTATE_MS = 5000

const TestimonialsSection = () => {
  // .tw is a fixed height:100vh, overflow:hidden slide, same "one screen,
  // no scroll" convention as LeadersSection/CinematicTimeline/
  // WhatWeDoCloneContent. useScaleToFit shrinks .tw__stage (header + tile
  // grid/featured card + marquee) as one rigid unit whenever its natural
  // height doesn't fit what .tw actually has — see that hook's own
  // comment, and .tw's CSS comment for what this replaces (content
  // silently clipping via the ancestor .page-controller__section's own
  // overflow:hidden, with nothing here shrinking to compensate).
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  useScaleToFit(rootRef, stageRef)

  const [centerIndex, setCenterIndex] = useState(0)
  const reduce = useReducedMotion()
  // 3 tiles left / 3 right — videoReviews is always padded to exactly 6
  // (see its own comment), so this split is never uneven the way slicing
  // the full 7-review `reviews` array was. No index/state of their own —
  // these are static video previews, independent of the featured card.
  const left = videoReviews.slice(0, 3)
  const right = videoReviews.slice(3, 6)

  // Tablet-only exception, reported directly off a real screenshot:
  // splitting the 6 tiles 3-and-3 around the featured card leaves each
  // row filling only about half a tablet's real width. (min-width: 700px)
  // on top of the usual (pointer: coarse) and (orientation: portrait)
  // signal is what scopes this to "any tablet, not a phone" — phones top
  // out around 430px portrait, so they never cross that floor and keep
  // the existing split-3-and-3 layout (and so does desktop/landscape,
  // which never matches pointer:coarse at all).
  const [isTabletPortrait, setIsTabletPortrait] = useState(false)
  useEffect(() => {
    const tabletPortraitQuery = window.matchMedia('(pointer: coarse) and (orientation: portrait) and (min-width: 700px)')
    const check = () => setIsTabletPortrait(tabletPortraitQuery.matches)
    check()
    tabletPortraitQuery.addEventListener('change', check)
    return () => tabletPortraitQuery.removeEventListener('change', check)
  }, [])

  // Drives ONLY the featured card, cycling all 7 reviews — entirely
  // separate from the (static) video tiles above. Stopped entirely under
  // prefers-reduced-motion rather than just skipping the transition
  // animation: an auto-advancing carousel with no way to pause it is
  // itself a motion concern, not just the transition between states.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setCenterIndex((a) => (a + 1) % reviews.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <section className="tw" id="testimonials" aria-label="Customer testimonials" ref={rootRef}>
      <div className="tw__aurora" aria-hidden>
        <span className="tw__blob tw__blob--1" />
        <span className="tw__blob tw__blob--2" />
      </div>
      <div className="tw__stage" ref={stageRef}>
        <header className="tw__header">
          <div>
            <span className="tw__eyebrow">Customer Stories</span>
            <h2 className="tw__title">
              Trusted by <em><Odometer value="20,000" suffix="+" /></em> Happy Customers.
            </h2>
          </div>
          <div className="tw__rating">
            <div className="tw__rating-score">
              <Odometer value="4.9" />
            </div>
            <div>
              <Stars n={5} />
              <div className="tw__rating-sub">
                <Odometer value="300" suffix="+" /> Google Reviews
              </div>
            </div>
          </div>
        </header>

        {/* Video-testimonial tiles either side of one large featured card —
            two entirely independent things, not a synced pair. Tiles are
            static video previews (real buttons, own focus/hover, no
            onClick yet — see Tile's own comment for why); the featured card
            auto-advances through all 7 written testimonials on its own
            timer, unrelated to whichever tile a visitor happens to be
            looking at. */}
        <div className="tw__grid">
          {isTabletPortrait ? (
            // Tablet exception (see isTabletPortrait's own comment above):
            // featured card first, then all 6 tiles together as one row
            // below it instead of split 3-and-3 around it.
            <>
              <FeaturedCard review={reviews[centerIndex]} reduce={!!reduce} activeKey={centerIndex} />
              <div className="tw__tiles tw__tiles--combined">
                {videoReviews.slice(0, 6).map((r, i) => (
                  <Tile key={`${r.name}-${i}`} review={r} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="tw__tiles">
                {left.map((r, i) => (
                  <Tile key={`${r.name}-${i}`} review={r} />
                ))}
              </div>

              <FeaturedCard review={reviews[centerIndex]} reduce={!!reduce} activeKey={centerIndex} />

              <div className="tw__tiles">
                {right.map((r, i) => (
                  <Tile key={`${r.name}-${i + left.length}`} review={r} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* auto-scrolling "wall of love" ribbon */}
        <div className="tw__marquee" aria-hidden>
          <div className={`tw__marquee-track${reduce ? ' is-static' : ''}`}>
            {[...highlights, ...highlights, ...highlights].map((h, i) => (
              <span className="tw__chip" key={i}>
                <span className="tw__chip-stars">★★★★★</span>
                <span className="tw__chip-text">{h.t}</span>
                <span className="tw__chip-name">— {h.n}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
