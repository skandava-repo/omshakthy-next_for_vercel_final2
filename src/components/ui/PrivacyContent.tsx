'use client'

// Real content: the old live site's privacy statement lives in a
// footer modal (footer-new.php's #modalaudiprivacy), not its own
// page — one real paragraph, kept verbatim rather than padded out
// with boilerplate legal text the real site doesn't have. Given its
// own indexed URL here because Footer.tsx already links to /privacy
// (same "footer links to a page that never existed" bug already
// fixed once for /careers). Same hero/section pattern as
// CareersContent.tsx / ContactContent.tsx.
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
const PHONE = '044 40303040'
const EMAIL = 'marketing@omshakthy.net'

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

export default function PrivacyContent() {
  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Your Information</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              How OmShakthy Homes handles the personal information you share with us.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Policy ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-base md:text-lg" style={{ color: C.slate }}>
              Your personal information (name, email, and phone number) submitted to us will not
              be sold, shared, or rented to others. We use this information to send you updates
              about our company and projects, and to contact you if requested or where we find it
              necessary.
            </p>
            <p className="mt-6 text-base md:text-lg" style={{ color: C.slate }}>
              You may opt out of receiving our communications at any time by calling us at{' '}
              <a href={`tel:${PHONE.replace(/\s/g, '')}`} style={{ color: C.blue }}>{PHONE}</a>, or
              by clicking the unsubscribe link included in any email we send you.
            </p>
            <p className="mt-10 text-sm" style={{ color: C.slate, borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem' }}>
              Questions about how your information is used? Write to us at{' '}
              <a href={`mailto:${EMAIL}`} style={{ color: C.blue }}>{EMAIL}</a>.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
