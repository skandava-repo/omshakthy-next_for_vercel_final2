'use client'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import blogPosts from '@/data/blog/summary.json'
import './BlogListingContent.css'

/* "Blog" — v4. v3 built the newsroom layout (hero/side-card/recent-grid/
   mixed-section/strip) around 5 placeholder posts, 4 of which (per
   PriceTrends.tsx's own comment: "the Avadi property-tax post is from
   Figma; the others are derived") never existed on the real site at
   all — and every single card in the page linked to href="#". Neither
   problem was visible until the real content showed up.

   v4 swaps in all 131 real posts extracted from the old mirror site
   (www.omshakthy.com/blog/*.html — see src/data/blog/ and
   src/lib/blog.ts) and gives every card a real /blog/<slug> href.
   The hero/side-card/mixed/banner slots are still hand-picked (a
   131-item newsroom front page needs curation same as a 5-item one
   did), just picked from real posts now — the "Chennai vs Bangalore"
   post flagged as a dead link elsewhere in this session
   (chennai-or-bangalore-which-is-better) is real and lives in the
   bottom strip.

   Two false starts on how to fit 131 posts into a layout built for 5,
   both corrected per direct feedback: first pass let "Recently Added"
   grow to fit all of them, which stretched its asymmetric feature+list
   grid into an ~18,000px column (and broke its scroll-reveal — see the
   viewport comment below); second pass added a Load More button INSIDE
   that same grid, which changed its shape on every click. Landed here:
   "Recently Added" stays fixed at its original 1 feature + 4 list
   shape — same as when there were only 5 posts total, never more —
   and a separate "More From the Blog" section below the strip holds
   everything else, in a plain uniform grid (no feature/list split) that
   only grows downward via its own Load More button. Nothing above it
   changes shape. */

type BlogSummary = (typeof blogPosts)[number]

const bySlug = (slug: string): BlogSummary => {
  const post = blogPosts.find((b) => b.slug === slug)
  if (!post) throw new Error(`blog post missing from summary.json: ${slug}`)
  return post
}

const HERO_SLUG = 'avadi-property-tax-online-payment'
const FEATURE_SLUG = 'influencing-real-estate-investments-in-guduvanchery'
const BANNER_SLUG = 'top-10-developing-hotspots-to-invest-in-chennai'
const MIXED_SLUGS = [
  'key-advantages-of-owning-a-plot-in-tambaram-in-spotlight',
  'best-areas-in-chennai-for-gated-community-plots',
]
const STRIP_SLUGS = [
  'bhk-in-real-estate-meaning-full-form-and-types',
  'builder-buyer-agreement-meaning-checklist-and-clauses',
  'why-real-estate-investment-is-better-than-gold-investment',
  'stilt-parking-meaning-rules-benefits-and-legal-rights-under-rera',
  'rent-control-act-rental-agreement-rights-of-tenant-and-landlord',
  'chennai-or-bangalore-which-is-better',
]

// Real corridor pages this rebuild does have (/projects lists every
// live listing, including Tambaram and Guduvanchery ones) — keyed by
// slug rather than the old exact-title match, which broke the moment
// a title changed.
const corridors: Record<string, string> = {
  [HERO_SLUG]: 'Avadi',
  [FEATURE_SLUG]: 'Guduvanchery',
}

const categories = ['All', ...Array.from(new Set(blogPosts.map((b) => b.category)))]

// Real, indexed category-filter URLs the old site has (sitemap.xml:
// /blog/?category=buying|investment|legal|lifestyle) — short slugs
// that don't match our fuller on-page category labels 1:1, so they're
// mapped explicitly rather than derived. Any category without a real
// indexed slug (just "Company & Community", one post) still gets a
// working slug via the generic fallback below — filtering still works
// for it, it's just not a URL Google already has indexed.
const EXPLICIT_CATEGORY_SLUGS: Record<string, string> = {
  'Buying Guides': 'buying',
  'Market & Investment': 'investment',
  'Legal & Documents': 'legal',
  'Lifestyle & Decor': 'lifestyle',
}
const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const categoryToSlug = (c: string) => EXPLICIT_CATEGORY_SLUGS[c] ?? slugify(c)
const CATEGORY_SLUGS: Record<string, string> = Object.fromEntries(
  categories.filter((c) => c !== 'All').map((c) => [c, categoryToSlug(c)])
)
const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category])
)

// Spells out the post count in the closing note below — this used to be a
// hardcoded "Three entries" that quietly went wrong the moment a fourth
// post was added; keying off blogPosts.length means it can never go
// stale again as the library grows.
const NUMBER_WORDS: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine',
}
const numberWord = (n: number) =>
  NUMBER_WORDS[n] ?? n.toLocaleString('en-IN')

const CorridorLink = ({ slug }: { slug: string }) => {
  const corridor = corridors[slug]
  if (!corridor) return null
  return (
    <Link href="/projects" className="bp__corridor">
      See live listings in {corridor}
      {/* Its own span so the arrow alone can slide on hover, via CSS —
          a small tell that this link actually goes somewhere. */}
      <span className="bp__corridor-arrow" aria-hidden="true">→</span>
    </Link>
  )
}

// Fade+slide reveal used by every major section below, so the page feels
// like it's unfolding as you scroll rather than the reference's flat,
// fully-rendered-at-load newsroom clone. Recently Added had this already;
// the hero, mixed section and strip previously just appeared static.
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
}

const AuthorByline = ({ read, onPhoto }: { read?: string; onPhoto?: boolean }) => (
  <span className={`bp__author${onPhoto ? ' bp__author--on-photo' : ''}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/omshakthy-logo.webp" alt="" className="bp__author-avatar" />
    <span className="bp__author-text">
      OmShakthy Team
      {/* No publish date shown — none exists anywhere on the source
          page this content was extracted from, so showing one here
          would just be inventing it (same reasoning this project
          already applied once to a fabricated RERA ID/address). Read
          time is real: computed from this post's own word count. */}
      {read ? <><br /><small>{read}</small></> : null}
    </span>
  </span>
)

// "Recently Added" is fixed at this size (1 feature + 4 list) no
// matter how many posts exist — its own original shape, from back
// when there were only 5 posts total.
const RECENT_GRID_SIZE = 5
const MORE_PAGE_SIZE = 12

const BlogListingContent = () => {
  // Filter now lives in the URL (?category=buying), not just local
  // state — so the 4 category views are real, bookmarkable, crawlable
  // pages matching what the old site already has indexed
  // (sitemap.xml: /blog/?category=buying|investment|legal|lifestyle),
  // instead of a client-only toggle no search engine could ever see a
  // link to. The tabs below are real <Link>s now, not onClick buttons.
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category')
  const filter = categorySlug ? (SLUG_TO_CATEGORY[categorySlug] ?? 'All') : 'All'
  const [moreCount, setMoreCount] = useState(MORE_PAGE_SIZE)
  useEffect(() => {
    setMoreCount(MORE_PAGE_SIZE)
  }, [filter])
  const hero = bySlug(HERO_SLUG)
  const feature = bySlug(FEATURE_SLUG)
  const banner = bySlug(BANNER_SLUG)
  const [mixedA, mixedB] = MIXED_SLUGS.map(bySlug)
  const stripPosts = STRIP_SLUGS.map(bySlug)
  const curatedSlugs = new Set([HERO_SLUG, FEATURE_SLUG, BANNER_SLUG, ...MIXED_SLUGS, ...STRIP_SLUGS])
  const filtered = filter === 'All' ? blogPosts : blogPosts.filter((b) => b.category === filter)
  // The fixed-shape grid above stays exactly RECENT_GRID_SIZE cards.
  // Everything else matching the current filter — minus whatever's
  // already hand-placed elsewhere on the page — goes in the plain grid
  // at the bottom, revealed in batches by its own Load More button.
  const recentTop = filtered.slice(0, RECENT_GRID_SIZE)
  const moreCandidates = filtered.filter((b) => !curatedSlugs.has(b.slug))
  const moreVisible = moreCandidates.slice(0, moreCount)

  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  /* .bp__mixed's right banner needs to match the left column's actual
     rendered height (two stacked .bp__mini cards + the gap between
     them) — not an approximation. CSS alone can't do this reliably
     here: the banner's own source photo is a portrait image (taller
     than wide), and a flex/grid-based "stretch to fill" approach hits
     a genuine circular-sizing case (the grid row's auto height is
     computed FROM the banner's own intrinsic content size, which for
     an aspect-ratio image ignores flex-basis/flex-grow and reports its
     full un-shrunk height back into that same calculation). Measuring
     the left column directly and applying it as an explicit pixel
     height sidesteps that entirely. Only applied above the 860px
     stacked-layout breakpoint (BlogListingContent.css) — below it,
     bannerHeight stays undefined and the banner just flows naturally. */
  const mixedListRef = useRef<HTMLDivElement>(null)
  const [bannerHeight, setBannerHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const el = mixedListRef.current
    if (!el) return
    // Same fix as PageController.tsx/ProjectsContent.tsx: width alone
    // (innerWidth > 860) isn't a reliable "is this the desktop layout"
    // signal — a touch device in portrait needs the stacked layout
    // regardless of its reported width, matching BlogListingContent.css's
    // own now-updated 860px media query.
    const coarsePortraitQuery = window.matchMedia('(pointer: coarse) and (orientation: portrait)')
    const isStacked = () => window.innerWidth <= 860 || coarsePortraitQuery.matches
    const update = () => {
      setBannerHeight(isStacked() ? undefined : el.getBoundingClientRect().height)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    coarsePortraitQuery.addEventListener('change', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      coarsePortraitQuery.removeEventListener('change', update)
    }
  }, [])

  /* .bp__hero-main (photo + text column) needs to match .bp__side's
     (photo card + corridor link + quote) natural height — not the
     other way around. A long/4-line title used to make the text
     column the tallest thing in the row, stretching the grid row (and
     with it the photo and .bp__side) to match; growing .bp__quote to
     absorb that extra height was tried and reverted per direct
     feedback (read as the card getting taller for no reason, not a
     fix). Same measure-and-apply-as-a-pixel-height approach as
     bannerHeight above, just driving the opposite column, plus one
     more step CSS alone can't do: if the headline doesn't fit inside
     that now-shorter height even at its default size, shrink its own
     font-size (not the whole layout) until it does, down to a floor
     instead of shrinking indefinitely. Runs via useLayoutEffect, not
     useEffect, so the shrink applies before paint rather than
     flashing oversized text first. Only applied above the 860px
     stacked-layout breakpoint, same as bannerHeight — below it both
     inline overrides are cleared and the column just flows naturally. */
  const heroMainRef = useRef<HTMLAnchorElement>(null)
  const heroBodyRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const sideRef = useRef<HTMLDivElement>(null)
  const HERO_TITLE_MIN_FONT_SIZE = 18 // px floor — never shrinks past this

  useLayoutEffect(() => {
    const mainEl = heroMainRef.current
    const bodyEl = heroBodyRef.current
    const titleEl = heroTitleRef.current
    const sideEl = sideRef.current
    if (!mainEl || !bodyEl || !titleEl || !sideEl) return

    const coarsePortraitQuery = window.matchMedia('(pointer: coarse) and (orientation: portrait)')
    const fit = () => {
      // Same stacked-layout condition as bannerHeight's effect above.
      if (window.innerWidth <= 860 || coarsePortraitQuery.matches) {
        mainEl.style.height = ''
        titleEl.style.fontSize = ''
        return
      }
      mainEl.style.height = `${sideEl.getBoundingClientRect().height}px`
      // Clear any previous shrink before re-measuring against the
      // (possibly new, on resize) target height.
      titleEl.style.fontSize = ''
      let fontSize = parseFloat(getComputedStyle(titleEl).fontSize)
      while (bodyEl.scrollHeight > mainEl.clientHeight && fontSize > HERO_TITLE_MIN_FONT_SIZE) {
        fontSize -= 1
        titleEl.style.fontSize = `${fontSize}px`
      }
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(sideEl)
    window.addEventListener('resize', fit)
    coarsePortraitQuery.addEventListener('change', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
      coarsePortraitQuery.removeEventListener('change', fit)
    }
  }, [hero.title, hero.description, hero.readTime])

  return (
    <main className="bp">
      <header className="bp__masthead">
        <span className="bp__masthead-meta">
          {today} <span className="bp__masthead-dot" />Chennai
        </span>
        <div className="bp__masthead-center">
          <span className="bp__masthead-name">Blog</span>
        </div>
        <a className="bp__masthead-mail" href="mailto:marketing@omshakthy.net">
          Mail Us
        </a>
      </header>

      <motion.section className="bp__hero" {...reveal}>
        {/* The photo is a tall block running the full hero height,
            beside a narrow text column (headline/excerpt/byline). This
            used to let the headline overlap onto the photo's left edge
            (a solid box behind the title text, via box-decoration-break
            so a multi-line heading got one background per line) — but
            whether any given title's wrapped lines actually reached
            that far depended on word length, so a short line never
            touched the photo while a long one did, leaving one random
            disconnected box on the photo with nothing matching it on
            the other lines (reported as a content-overlap bug). The
            text column is now capped well clear of the photo instead —
            no overlap is possible regardless of how a title wraps, so
            every post renders the same way; no box/shade needed. */}
        <Link href={`/blog/${hero.slug}`} className="bp__hero-main" aria-label={hero.title} ref={heroMainRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.heroImage ?? undefined} alt={hero.title} className="bp__hero-img" />
          <div className="bp__hero-body" ref={heroBodyRef}>
            <span className="bp__cat">{hero.category}</span>
            <h1 className="bp__hero-title" ref={heroTitleRef}>{hero.title}</h1>
            <p className="bp__hero-excerpt">
              <span className="bp__dropcap">{hero.description.charAt(0)}</span>
              {hero.description.slice(1)}
            </p>
            <AuthorByline read={hero.readTime} />
          </div>
        </Link>

        <div className="bp__side" ref={sideRef}>
          {/* Badge, headline AND byline all overlaid on the photo's own
              scrim — the reference's sidebar card does this throughout;
              the previous version only overlaid the badge and put the
              title below the photo instead. */}
          <Link href={`/blog/${feature.slug}`} className="bp__side-card" aria-label={feature.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feature.heroImage ?? undefined} alt={feature.title} className="bp__side-img" />
            <span className="bp__side-shade" aria-hidden="true" />
            <span className="bp__cat bp__cat--on-photo">{feature.category}</span>
            <div className="bp__side-body">
              <h2 className="bp__side-title">{feature.title}</h2>
              <span className="bp__byline bp__byline--on-photo">{feature.readTime}</span>
            </div>
          </Link>
          <CorridorLink slug={feature.slug} />

          {/* A real customer testimonial, not an invented editorial pull-
              quote — the reference's quote card, filled with content that
              actually exists. */}
          <figure className="bp__quote">
            <blockquote>
              &ldquo;Owning a flat in Santha Towers is a symbol of security for my retired life. The
              team was transparent, on-time and truly cared.&rdquo;
            </blockquote>
            <figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/testimonials/jalaja.webp" alt="Jalaja Madanmohan" />
              <span>Jalaja Madanmohan<br /><small>B103 · OmShakthy Santha Towers</small></span>
            </figcaption>
          </figure>
        </div>
      </motion.section>

      <motion.section
        className="bp__recent"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        // amount: 0.2 needed 20% of this section's own height visible at
        // once to fire — fine at 5 posts tall, impossible to ever satisfy
        // now that it holds all 131 (the section is taller than any
        // viewport many times over). A fixed "-10%" viewport margin
        // fires as soon as the section's top edge is close, regardless
        // of how tall the whole thing is — same trigger style Reveal
        // already uses elsewhere in this codebase.
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bp__recent-header">
          <h2 className="bp__recent-title">Recently Added</h2>
          <div className="bp__recent-tabs">
            {categories.map((c) => (
              <Link
                key={c}
                href={c === 'All' ? '/blog' : `/blog?category=${CATEGORY_SLUGS[c]}`}
                scroll={false}
                className={`bp__tab${filter === c ? ' is-active' : ''}`}
              >
                {/* Shared layoutId — framer-motion animates this one pill
                    sliding between buttons as it unmounts/remounts in
                    whichever button is active, instead of the filter just
                    snapping between plain text colors. */}
                {filter === c && (
                  <motion.span
                    className="bp__tab-pill"
                    layoutId="bp-tab-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="bp__tab-label">{c}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* One big overlaid-caption feature, plus the rest as a 2-column
            grid of photo-top/text-below cards — the reference's small
            cards are never photo-left/text-right, which is what this
            used to be. */}
        <div className="bp__grid">
          <AnimatePresence mode="popLayout">
            {recentTop[0] && (
              <motion.article
                className="bp__feature"
                key={recentTop[0].slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/blog/${recentTop[0].slug}`} className="bp__feature-link" aria-label={recentTop[0].title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={recentTop[0].heroImage ?? undefined} alt={recentTop[0].title} className="bp__feature-img" />
                  <span className="bp__feature-shade" aria-hidden="true" />
                  <span className="bp__cat bp__cat--on-photo">{recentTop[0].category}</span>
                  <div className="bp__feature-body">
                    <h3 className="bp__feature-title">{recentTop[0].title}</h3>
                    <span className="bp__byline bp__byline--on-photo">{recentTop[0].readTime}</span>
                  </div>
                </Link>
              </motion.article>
            )}
          </AnimatePresence>

          <div className="bp__list">
            <AnimatePresence mode="popLayout">
              {recentTop.slice(1).map((b) => (
                <motion.article
                  className="bp__card"
                  key={b.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* The card's own read-more target — a separate link from
                      CorridorLink below, not nested inside it: an <a>
                      inside an <a> is invalid HTML and threw a real
                      hydration error here before this was split apart. */}
                  <Link href={`/blog/${b.slug}`} className="bp__card-link" aria-label={b.title}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.heroImage ?? undefined} alt={b.title} className="bp__card-img" />
                    <div className="bp__card-body">
                      <span className="bp__cat">{b.category}</span>
                      <h3 className="bp__card-title">{b.title}</h3>
                      <span className="bp__byline">{b.readTime}</span>
                    </div>
                  </Link>
                  <CorridorLink slug={b.slug} />
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Section that didn't exist before: a compact text-first list
          (thumbnail to the right of the copy, not above it) beside one
          large banner story (headline sitting above the photo as plain
          text, not overlaid — the reference varies this on purpose
          instead of using the overlay treatment everywhere). */}
      <motion.section className="bp__mixed" {...reveal}>
        <div className="bp__mixed-list" ref={mixedListRef}>
          {[mixedA, mixedB].map((b) => (
            <Link href={`/blog/${b.slug}`} className="bp__mini" key={b.slug} aria-label={b.title}>
              <div className="bp__mini-body">
                <span className="bp__cat">{b.category}</span>
                <h3 className="bp__mini-title">{b.title}</h3>
                <p className="bp__mini-excerpt">{b.description}</p>
                <span className="bp__byline">{b.readTime}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.heroImage ?? undefined} alt="" className="bp__mini-img" />
            </Link>
          ))}
        </div>

        <Link
          href={`/blog/${banner.slug}`}
          className="bp__banner"
          aria-label={banner.title}
          style={bannerHeight ? { height: bannerHeight } : undefined}
        >
          <h2 className="bp__banner-title">{banner.title}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner.heroImage ?? undefined} alt={banner.title} className="bp__banner-img" />
        </Link>
      </motion.section>

      {/* Bottom recap strip — the reference's last row before its
          footer. */}
      <motion.div className="bp__strip" {...reveal}>
        {stripPosts.map((b) => (
          <Link href={`/blog/${b.slug}`} className="bp__strip-item" key={b.slug} aria-label={b.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.heroImage ?? undefined} alt="" className="bp__strip-img" />
            <span>
              <span className="bp__cat">{b.category}</span>
              <span className="bp__strip-title">{b.title}</span>
            </span>
          </Link>
        ))}
      </motion.div>

      {/* Everything else in the library, below the curated sections
          above (hero/side-card/recent-grid/mixed/banner/strip) — a
          plain, even grid, no feature/list split, so Load More just
          adds rows at the bottom instead of reshaping anything above
          it. Respects whichever category tab is active. */}
      {moreCandidates.length > 0 && (
        <motion.section className="bp__more" {...reveal}>
          <h2 className="bp__more-title">More From the Blog</h2>
          <div className="bp__more-grid">
            {moreVisible.map((b) => (
              <Link href={`/blog/${b.slug}`} className="bp__more-card" key={b.slug} aria-label={b.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.heroImage ?? undefined} alt={b.title} className="bp__more-img" />
                <div className="bp__more-body">
                  <span className="bp__cat">{b.category}</span>
                  <h3 className="bp__more-card-title">{b.title}</h3>
                  <span className="bp__byline">{b.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {moreCount < moreCandidates.length && (
            <div className="bp__load-more">
              <button
                type="button"
                className="bp__load-more-btn"
                onClick={() => setMoreCount((n) => n + MORE_PAGE_SIZE)}
              >
                Load More ({moreCandidates.length - moreCount} more)
              </button>
            </div>
          )}
        </motion.section>
      )}

      <p className="bp__note">
        {numberWord(blogPosts.length)} entries, each one real — this is a working
        journal, not a stock feed. More field notes land here as we build.
      </p>
    </main>
  )
}

export default BlogListingContent
