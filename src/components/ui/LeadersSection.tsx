'use client'
import { useRef } from 'react'
import { useScaleToFit } from '@/lib/useScaleToFit'
import './LeadersSection.css'

/* Editorial video-intro band (video backdrop, "OUR LEADERSHIP" eyebrow,
   "Three decades..." headline) sitting above a "meet the team" pill-card
   roster (circular photo, name/role/tag, gold accents) ported from a
   reference design. The roster's cards keep their pill shape; a
   social-icon row a later pass had added is dropped here, and a numbered
   index (01/02/03/04), a foreground timeline strip, and a supporting
   line under the headline — all shown in that same reference — were each
   considered and deliberately left out, per instruction. .ld3__intro-main
   holds only the eyebrow + headline, nothing else. Content is still
   Omshakthy's real leadership (names/roles/photos), not any reference's
   placeholder text. */

type Leader = {
  name: string
  role: string
  tag: string
  // No `img` = no real photo exists yet (see Shakthi below) — renders an
  // initials placeholder instead of misattributing someone else's photo.
  img?: string
  pos: string
  size: string
}

const leaders: Leader[] = [
  {
    name: 'R. Ramachanthran',
    role: 'Chairman',
    tag: 'Vision & Legacy',
    img: '/leaders/chairman.webp',
    pos: '38% 6%',
    size: 'auto 168%',
  },
  {
    name: 'N R Manigantan',
    role: 'Managing Director',
    tag: 'Strategy & Growth',
    img: '/leaders/manigantan.webp',
    pos: '44% 8%',
    size: 'auto 138%',
  },
  {
    name: 'Rajib Kumar Hota',
    role: 'Executive Director',
    tag: 'Governance & Ethics',
    img: '/leaders/hota.webp',
    pos: 'center 22%',
    size: 'cover',
  },
  {
    name: 'Sakthi Buwaneshwari M',
    role: 'Executive Director',
    tag: 'Operations & Excellence',
    // Real distinct photo now provided — the old md-cutout.png (byte-
    // identical to manigantan.png, someone else's face) is still not
    // used anywhere.
    img: '/leaders/sakthi.webp',
    // Zoomed in on the face — same "auto <height>%" zoom trick as
    // chairman/manigantan above, instead of the plain 'cover' every
    // other entry here that doesn't need extra zoom uses.
    pos: 'center 5%',
    size: 'auto 210%',
  },
]

function Card({ leader, index }: { leader: Leader; index: number }) {
  return (
    <article
      className="ld3__card"
      style={{ animationDelay: `${0.2 + index * 0.09}s` }}
    >
      <div className="ld3__photo-wrap">
        {leader.img ? (
          <span
            className="ld3__photo"
            style={{ backgroundImage: `url(${leader.img})`, backgroundPosition: leader.pos, backgroundSize: leader.size }}
          />
        ) : (
          <div className="ld3__photo-placeholder" aria-hidden>
            <span>{leader.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="ld3__body">
        <h3 className="ld3__name">{leader.name}</h3>
        <span className="ld3__name-rule" aria-hidden="true" />
        <p className="ld3__role">{leader.role}</p>
        <p className="ld3__tag">{leader.tag}</p>
      </div>
      <span className="ld3__card-rule" aria-hidden="true" />
    </article>
  )
}

const LeadersSection = () => {
  // .ld3 is a fixed height:100vh, overflow:hidden slide — it never
  // scrolls and its own content never reflows into a different shape (no
  // breakpoint here wraps the roster into two rows or stacks the video
  // band, unlike the >980px media query further down in the CSS). The
  // vw/vh clamp() formulas throughout this file already shrink cards,
  // gaps, and type as the viewport narrows — that's normal fluid sizing
  // and is untouched. What they can't account for on their own is an
  // unusually SHORT viewport (a laptop's 768px-tall screen): the content
  // can still be "correctly" sized by width-driven formulas and yet be
  // taller than the 100vh box actually available, which is what let the
  // roster and the video intro band compress into each other. See
  // useScaleToFit's own comment for how the fix works — same hook now
  // shared by CinematicTimeline, TestimonialsSection, and
  // WhatWeDoCloneContent, the site's other fixed one-screen slides.
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  useScaleToFit(rootRef, stageRef)

  return (
    <section className="ld3" id="leadership" data-snap="true" aria-label="Our leadership" ref={rootRef}>
      <div className="ld3__stage" ref={stageRef}>
        <div className="ld3__intro">
          {/* Same background clip TrustedPartnersSection uses behind its
              pillars — reused here rather than the static skyline photo, so
              the backdrop is footage instead of a still. */}
          <video
            className="ld3__intro-video"
            src="/trusted-partners-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="ld3__intro-main">
            <p className="ld3__eyebrow">
              <span className="ld3__eyebrow-line" />
              OUR LEADERSHIP
              <span className="ld3__eyebrow-line" />
            </p>
            <h1 className="ld3__h1">
              Three decades.
              <br />
              One unwavering <span className="ld3__accent">vision.</span>
            </h1>
            <span className="ld3__h1-rule" aria-hidden="true" />
          </div>
        </div>

        <div className="ld3__roster">
          {leaders.map((leader, i) => (
            <Card key={leader.name} leader={leader} index={i} />
          ))}
        </div>

        <div className="ld3__tagline">
          <span className="ld3__tagline-dot" aria-hidden="true" />
          <span className="ld3__tagline-line" aria-hidden="true" />
          <p className="ld3__tagline-text">Built on values. Driven by purpose. Committed to tomorrow.</p>
          <span className="ld3__tagline-line" aria-hidden="true" />
          <span className="ld3__tagline-dot" aria-hidden="true" />
        </div>

        <span className="ld3__watermark" aria-hidden="true">EST. 1991</span>
      </div>
    </section>
  )
}

export default LeadersSection
