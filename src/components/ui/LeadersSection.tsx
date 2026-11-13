'use client'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  // Optional, only set on Hota below: shown directly under the name,
  // same styling as .ld3__tag below the role (same font-size/italic/
  // color), not appended inline to `name` itself.
  credential?: string
  // No `img` = no real photo exists yet (see Shakthi below) — renders an
  // initials placeholder instead of misattributing someone else's photo.
  img?: string
  pos: string
  size: string
  // Real bio points from the old live site's own homepage/about page —
  // shown via a "Read bio" link on cards that have one (not every
  // leader's page had a bio; Shakthi's doesn't, so no link renders for
  // her rather than a dead one). Opens in a lightweight modal
  // (position: fixed, outside this section's own layout flow) rather
  // than expanding the card in place — the roster cards are a
  // carefully fixed size already (see useScaleToFit's own comment on
  // this fixed 100vh slide), and 2-4 bio bullets would overflow a
  // compact pill card badly.
  bio?: string[]
}

const leaders: Leader[] = [
  {
    name: 'R. Ramachanthran',
    role: 'Chairman',
    tag: 'Vision & Legacy',
    img: '/leaders/chairman.webp',
    pos: '38% 6%',
    size: 'auto 168%',
    bio: [
      'A passion for engineering inspired him to establish a small-scale industry.',
      'Founded OmShakthy Agencies (Madras) Pvt. Ltd. in 1991.',
      'Grew the group into a preferred land aggregator for corporates and state government.',
      'Over three decades of experience across real estate, construction, and hospitality.',
    ],
  },
  {
    name: 'N R Manigantan',
    role: 'Managing Director',
    tag: 'Strategy & Growth',
    img: '/leaders/manigantan.webp',
    pos: '44% 8%',
    size: 'auto 138%',
    bio: [
      'More than two decades of experience in real estate and construction.',
      'Extensive knowledge in land acquisition and agglomeration.',
      'Sets a clear vision for industrial infrastructure development and asset building.',
      'Keen on exploring new areas of business, including renewable energy and healthcare.',
    ],
  },
  {
    name: 'Rajib Kumar Hota',
    role: 'Executive Director',
    tag: 'Governance & Ethics',
    credential: 'IRS (Retd.)',
    img: '/leaders/hota.webp',
    pos: 'center 22%',
    size: 'cover',
    bio: [
      'Post-graduated from Delhi University, with an enrolment with the Bar Council and an MBA diploma from LIBA.',
      'An eloquent speaker and voracious reader, and an Independent Director with several boards — with a lasting passion for social service and education, and a drive toward excellence in everything he does.',
    ],
  },
  {
    name: 'Sakthi Buwaneshwari M',
    role: 'Associate Director',
    tag: 'Operations & Excellence',
    // Real distinct photo now provided — the old md-cutout.png (byte-
    // identical to manigantan.png, someone else's face) is still not
    // used anywhere.
    img: '/leaders/sakthi.webp',
    // Zoomed in on the face — same "auto <height>%" zoom trick as
    // chairman/manigantan above, instead of the plain 'cover' every
    // other entry here that doesn't need extra zoom uses. Photo
    // swapped again to a more zoomed-out shot (more hallway/body
    // visible, smaller face in frame) than the close headshot the
    // previous '56% 20%' / 'auto 210%' values were tuned for — that
    // zoom level would now crop in far too tight. Reduced accordingly.
    pos: '63% 20%',
    size: 'auto 190%',
  },
]

function Card({ leader, index, onReadBio }: { leader: Leader; index: number; onReadBio: () => void }) {
  // The whole capsule is the bio trigger now (was a separate "Read bio →"
  // link inside it) — only for leaders who actually have one; Sakthi's
  // card has no bio yet, so it stays a plain, non-interactive card
  // rather than a dead click target.
  const hasBio = !!leader.bio
  return (
    <article
      className={`ld3__card${hasBio ? ' ld3__card--clickable' : ''}`}
      style={{ animationDelay: `${0.2 + index * 0.09}s` }}
      {...(hasBio
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: onReadBio,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onReadBio()
              }
            },
            'aria-label': `Read ${leader.name}'s bio`,
          }
        : {})}
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
        <h3 className="ld3__name">
          {leader.name}
          {leader.credential && (
            <>
              <br />
              <span className="ld3__credential">{leader.credential}</span>
            </>
          )}
        </h3>
        <span className="ld3__name-rule" aria-hidden="true" />
        <p className="ld3__role">{leader.role}</p>
        <p className="ld3__tag">{leader.tag}</p>
      </div>
      <span className="ld3__card-rule" aria-hidden="true" />
    </article>
  )
}

// Fixed-position overlay (outside .ld3__stage's own layout/scale-to-fit
// flow entirely, same reasoning as Header.css's own site-nav) so a full
// bio never has to fit inside this roster's deliberately compact pill
// cards.
function BioModal({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  return (
    <motion.div
      className="ld3__bio-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="ld3__bio-modal"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ld3__bio-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 className="ld3__bio-name">
          {leader.name}
          {leader.credential && <span className="ld3__bio-credential"> · {leader.credential}</span>}
        </h3>
        <p className="ld3__bio-role">{leader.role}</p>
        <ul className="ld3__bio-list">
          {leader.bio?.map((line) => (
            <li key={line.slice(0, 30)}>{line}</li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
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
  const [openBio, setOpenBio] = useState<Leader | null>(null)

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
            <Card key={leader.name} leader={leader} index={i} onReadBio={() => setOpenBio(leader)} />
          ))}
        </div>

        <AnimatePresence>
          {openBio && <BioModal leader={openBio} onClose={() => setOpenBio(null)} />}
        </AnimatePresence>

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
