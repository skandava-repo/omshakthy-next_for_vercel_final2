'use client'

// Real content from the old live site's own emi-calculator.html (via
// the local site mirror) — the informational sections are its real
// copy. The old page's actual calculator itself only exists there as
// third-party widget markup with no formula in the static HTML, so
// the tool below is a real, working EMI calculator built fresh
// (standard reducing-balance EMI formula), not a redirect to a widget
// or a fake non-functional form. Same C palette / Reveal / Kicker
// pattern as LocationPageContent.tsx.
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

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

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n))
}

// Standard reducing-balance EMI formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1)
function calcEmi(principal: number, annualRatePct: number, years: number) {
  const r = annualRatePct / 12 / 100
  const n = years * 12
  if (r === 0) return principal / n
  const factor = Math.pow(1 + r, n)
  return (principal * r * factor) / (factor - 1)
}

const features = [
  { title: 'Instant Results', text: 'Get your EMI amount in seconds by entering just a few details.' },
  { title: 'Customizable Inputs', text: 'Adjust the loan amount, tenure, and interest rate to see how your EMI changes.' },
  { title: 'Total Interest View', text: 'See the full interest outgo over the loan tenure, not just the monthly figure.' },
  { title: 'Floating Rate Ready', text: 'Simulate scenarios with both fixed and floating rates, useful under the current MCLR regime.' },
]

const areas = ['Anna Nagar', 'OMR (Old Mahabalipuram Road)', 'Velachery', 'Tambaram', 'Porur', 'Ambattur', 'Sholinganallur']
const banks = ['State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank', 'Axis Bank']

const steps = [
  'Use the home loan EMI calculator to estimate your monthly outflow and plan your budget.',
  'Check your eligibility based on income, age, and existing liabilities.',
  'Explore loan options — compare various banks’ offers, including floating rates.',
  'If buying an under-construction property, calculate pre-EMI to plan your cash flow.',
  'Gather documentation: identity proof, address proof, income statements, and property documents.',
  'Apply online or in person — through our portal or by visiting our office.',
  'Loan approval and disbursal — once approved, the loan is disbursed as per the agreed schedule.',
]

export default function EmiCalculatorContent() {
  const [principal, setPrincipal] = useState(3000000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)

  const emi = useMemo(() => calcEmi(principal, rate, years), [principal, rate, years])
  const totalPayment = emi * years * 12
  const totalInterest = totalPayment - principal

  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Plan Your Home Loan</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              EMI Calculator
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Buying a home is one of the most significant investments you&rsquo;ll make. Use our
              home loan EMI calculator to estimate your monthly repayment and plan your finances
              with confidence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Calculator ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-4xl mx-auto rounded-2xl p-6 md:p-10" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-sm font-semibold" style={{ color: C.ink }}>Loan Amount</label>
                    <span className="text-sm font-semibold" style={{ color: C.blue }}>₹{formatINR(principal)}</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={20000000}
                    step={50000}
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: C.gold }}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-sm font-semibold" style={{ color: C.ink }}>Interest Rate</label>
                    <span className="text-sm font-semibold" style={{ color: C.blue }}>{rate.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={15}
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: C.gold }}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-sm font-semibold" style={{ color: C.ink }}>Loan Tenure</label>
                    <span className="text-sm font-semibold" style={{ color: C.blue }}>{years} yrs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: C.gold }}
                  />
                </div>
              </div>

              <div className="rounded-xl p-6 flex flex-col justify-center" style={{ backgroundColor: C.panel }}>
                <span style={{ ...mono, color: C.blue, fontSize: '0.7rem' }}>Monthly EMI</span>
                <span className="text-3xl md:text-4xl mt-1 mb-6" style={{ ...display, color: C.ink, fontWeight: 500 }}>
                  ₹{formatINR(emi)}
                </span>
                <div className="space-y-3 text-sm" style={{ color: C.slate }}>
                  <div className="flex justify-between">
                    <span>Principal Amount</span>
                    <span style={{ color: C.ink, fontWeight: 600 }}>₹{formatINR(principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest</span>
                    <span style={{ color: C.ink, fontWeight: 600 }}>₹{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                    <span>Total Payment</span>
                    <span style={{ color: C.ink, fontWeight: 600 }}>₹{formatINR(totalPayment)}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs" style={{ color: C.slate }}>
              Estimate only, based on standard reducing-balance EMI calculation. Actual rates and
              eligibility depend on the lender&rsquo;s own assessment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Key features ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-10 text-center">
            <Kicker color={C.blue}>Why Use This Tool</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Key Features
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl p-6" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                  <h3 className="text-base md:text-lg mb-2" style={{ ...display, color: C.ink, fontWeight: 500 }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: C.slate }}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Areas + Banks ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14">
          <Reveal>
            <Kicker>Where We Help</Kicker>
            <h2 className="text-xl md:text-2xl mt-3 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Home Loan Assistance for Select Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <span key={a} className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: C.panel, border: `1px solid ${C.border}`, color: C.ink }}>
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>Trusted Partners</Kicker>
            <h2 className="text-xl md:text-2xl mt-3 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Partner Banks
            </h2>
            <div className="flex flex-wrap gap-2">
              {banks.map((b) => (
                <span key={b} className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: C.panel, color: C.ink }}>
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Steps ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-10 text-center">
            <Kicker color={C.blue}>Getting Started</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Steps to Apply for a Home Loan
            </h2>
          </Reveal>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s} delay={(i % 5) * 0.05}>
                <li className="flex gap-4 rounded-xl p-5" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                  <span
                    aria-hidden
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold"
                    style={{ width: 32, height: 32, backgroundColor: C.ink, color: '#fff' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm" style={{ color: C.slate, paddingTop: 4 }}>{s}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.ink }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Ready to Plan Your Home Loan?
            </h2>
            <p className="mb-6" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Financial clarity is the foundation of a successful home purchase. Talk to our team
              to check eligibility and compare rates.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I'd like help estimating my home loan EMI.")}`}
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
