'use client'

// Real content: the old live site's own careers.html (via the local
// mirror) is genuinely this thin — one intro paragraph and "send your
// resume to hr@omshakthy.net" (its "Our Openings" section is
// literally commented out in the source, i.e. no live openings at
// capture time). Kept faithful rather than inventing job listings the
// real site doesn't have. Same email/WhatsApp CTA pattern
// ContactContent.tsx already uses for its real contact details.
import { motion } from 'framer-motion'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const
const EMAIL = 'hr@omshakthy.net'
const WHATSAPP_NUMBER = '919150088097'

const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10%' }}
    transition={{ duration: 0.7, delay, ease }}
  >
    {children}
  </motion.div>
)

const Kicker = ({ children, color = C.blue }: { children: React.ReactNode; color?: string }) => (
  <div>
    <span style={{ ...mono, color }}>{children}</span>
    <span aria-hidden style={{ display: 'block', width: 34, height: 2.5, borderRadius: 999, background: C.gold, marginTop: 8 }} />
  </div>
)

export default function CareersContent() {
  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Join Our Team</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Careers
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Our values create a sense of shared identity within the OmShakthy organization. We
              define what we stand for and how we do things — values that help us work together
              in the most effective and fulfilling way, bringing us closer to being the best real
              estate organization.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Apply ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <Kicker color={C.blue}>Current Openings</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3 mb-6" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              No Open Positions Right Now
            </h2>
            <p className="mb-8 text-base" style={{ color: C.slate }}>
              We&rsquo;re not actively hiring at the moment, but we&rsquo;re always glad to hear from
              people who&rsquo;d be a good fit. Interested candidates can send their resume to:
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold mb-4"
              style={{ ...body, backgroundColor: C.gold, color: C.ink }}
            >
              {EMAIL}
            </a>
            <p className="mt-6 text-sm" style={{ color: C.slate }}>
              Or reach out directly on{' '}
              <a
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I'm interested in career opportunities at OmShakthy Homes.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
                style={{ color: C.blue }}
              >
                WhatsApp
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
