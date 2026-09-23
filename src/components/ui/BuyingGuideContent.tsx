'use client'

// Real content from the old live site's own buying-guide.html (via
// the local site mirror) — including its 4 tabs sharing the same
// generic body paragraph, which is how the original page itself was
// written (not something shortened or altered here). Same C palette /
// Reveal / Kicker pattern as LocationPageContent.tsx.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  paper: '#F8F8F5',
  blue: '#0D6BB2',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
  gold: '#C9A227',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05, letterSpacing: '-0.01em', fontWeight: 400 }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif", lineHeight: 1.6, fontWeight: 400 }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace", letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }
const ease = [0.16, 1, 0.3, 1] as const
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

const GENERIC_BLURB =
  "Before you get too far into the process, it's a great idea to know what's involved and what it will mean for you. Our EMI calculator will give you an idea what to expect financially, and our blog is packed with articles about how to prepare for home buying. For information about the process itself, keep reading."

const tabs = [
  { label: 'Home Buying Basics', kicker: 'HOME BUYING BASICS' },
  { label: 'Affording a Home', kicker: 'AFFORDING A HOME' },
  { label: 'Pre-Approval Process', kicker: 'PRE-APPROVAL PROCESS' },
  { label: 'Making a Purchase', kicker: 'MAKING A PURCHASE' },
]

const stepCards = [
  { title: 'One Step at a Time', text: 'Walk through the steps of the process, beginning even before you start to look for a home or real estate agent. From pre-approval to inspections, making an offer to moving in, and everything in between.' },
  { title: 'The Basics of Borrowing', text: "If you've never taken out a mortgage before, it can seem overly complicated and intimidating. Learn about loan types, the difference between pre-approved and pre-qualified, and the meaning behind everything from APR to rate lock and closing costs." },
  { title: 'What Kind of Payments to Expect', text: "If you've found the property you want and have a price in mind, get an idea of what kind of monthly payment to expect. Just plug in the home price, down payment, and interest rate into our EMI calculator." },
]

export default function BuyingGuideContent() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Home Buyers Guide</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Buying a Home Doesn&rsquo;t Have to Be Confusing
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Welcome to the homebuyer&rsquo;s guide! Buying a home is a huge step in everyone&rsquo;s
              life and there&rsquo;s a lot to be learnt along the way. This guide will help you be
              prepared — tips, tools and further information on whatever issues you may face during
              your decision-making process.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Tabs ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActiveTab(i)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeTab === i ? C.ink : C.panel,
                  color: activeTab === i ? '#fff' : C.ink,
                }}
              >
                {t.label}
              </button>
            ))}
          </Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-2xl p-8"
              style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
            >
              <span style={{ ...mono, color: C.gold, fontSize: '0.7rem' }}>{tabs[activeTab].kicker}</span>
              <h2 className="text-xl md:text-2xl mt-2 mb-4" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                A great place to start — tools, tips and what to expect.
              </h2>
              <p className="text-sm md:text-base" style={{ color: C.slate }}>{GENERIC_BLURB}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------- Step cards ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {stepCards.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl p-6" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                <h3 className="text-base md:text-lg mb-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>{s.title}</h3>
                <p className="text-sm" style={{ color: C.slate }}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.ink }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Ready to Take the Next Step?
            </h2>
            <p className="mb-6" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Talk to our team, or use our EMI calculator to plan your budget before you start
              looking.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I'm just getting started on buying a home and could use some guidance.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold"
              style={{ ...body, backgroundColor: C.gold, color: C.ink }}
            >
              Enquire on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
