'use client'

// Real content from the old live site's own homeloan.html (via the
// local site mirror). Same C palette / Reveal / Kicker pattern as
// LocationPageContent.tsx.
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

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span aria-hidden className="flex-shrink-0 mt-1 rounded-full flex items-center justify-center" style={{ width: 20, height: 20, backgroundColor: C.panel, color: C.blue, fontSize: '0.7rem' }}>✓</span>
    <span className="text-sm md:text-base" style={{ color: C.slate }}>{children}</span>
  </li>
)

const benefits = [
  { title: 'Personalized Guidance', text: 'Our experienced advisors understand the nuances of the Chennai home loan interest rate market and offer tailored solutions.' },
  { title: 'Transparent Process', text: 'We believe in complete transparency, ensuring you are informed about every step, from application to approval.' },
  { title: 'Wide Network', text: 'Strong relationships with top banks and home finance companies in Chennai give you access to the most competitive rates and terms.' },
  { title: 'Support for All Needs', text: 'Whether you’re salaried, self-employed, or looking for a home loan without income proof in Chennai, we have solutions for every profile.' },
]

const areas = ['Anna Nagar', 'OMR (Old Mahabalipuram Road)', 'Velachery', 'Tambaram', 'Porur', 'Ambattur', 'Sholinganallur']

const eligibility = [
  'Age: Most lenders require applicants to be between 21 and 65 years.',
  'Income: Both salaried and self-employed individuals are eligible.',
  'Credit Score: A good credit score (usually above 700) improves your chances of getting the best home loan interest rates in Chennai.',
  'Employment Stability: Consistent work history is preferred.',
]

const banks = ['State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Canara Bank', 'Tamilnad Mercantile Bank']

const steps = [
  { title: 'Initial Consultation', text: 'We assess your requirements, budget, and preferred location to suggest the best financing options.' },
  { title: 'Eligibility Check', text: 'Our team evaluates your eligibility, considering your income, credit score, and property type.' },
  { title: 'Comparing Rates', text: 'We help you compare current home loan interest rates and terms from multiple lenders to find the most suitable option.' },
  { title: 'Documentation Support', text: 'Our experts guide you in gathering and organizing all necessary documents, ensuring a smooth application.' },
  { title: 'Application Submission', text: 'We assist in filling out the application forms and submitting them to the selected bank.' },
  { title: 'Loan Approval', text: 'We coordinate with the lender for quick processing and keep you updated at every stage.' },
  { title: 'Property Verification', text: 'The bank conducts a technical and legal verification of your chosen property to ensure eligibility for financing.' },
  { title: 'Sanction and Disbursal', text: 'Once approved, the loan is sanctioned and disbursed as per the agreement — in full or in installments for under-construction properties.' },
  { title: 'Post-Disbursal Support', text: 'We provide ongoing support for EMI management, prepayment options, and any queries you may have.' },
]

export default function HomeLoanContent() {
  return (
    <main style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="px-6 md:px-16 pt-40 pb-20" style={{ backgroundColor: C.ink }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Kicker color={C.mist}>Home Loan Assistance</Kicker>
            <h1 className="text-4xl md:text-6xl mt-4 mb-6" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Home Loan
            </h1>
            <p className="text-base md:text-lg max-w-2xl" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Navigating the world of home loans can be overwhelming, with dozens of home finance
              companies in Chennai and a variety of loan products. Our mission is to provide
              home loan assistance tailored to your unique needs — comparing rates, guiding you
              through eligibility and documentation, and supporting you end-to-end from
              application to disbursal.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Benefits ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-10">
            <Kicker>Why Choose Us</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Benefits of Choosing OmShakthy Homes
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl p-6" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                  <h3 className="text-base md:text-lg mb-2" style={{ ...display, color: C.ink, fontWeight: 500 }}>{b.title}</h3>
                  <p className="text-sm" style={{ color: C.slate }}>{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Areas + Eligibility ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14">
          <Reveal>
            <Kicker>Where We Help</Kicker>
            <h2 className="text-xl md:text-2xl mt-3 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Key Areas in Chennai
            </h2>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <span key={a} className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }}>
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>Eligibility &amp; Documentation</Kicker>
            <h2 className="text-xl md:text-2xl mt-3 mb-5" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              What You&rsquo;ll Need
            </h2>
            <ul className="space-y-3">
              {eligibility.map((e) => <CheckItem key={e}>{e}</CheckItem>)}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Partner banks ---------------- */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <Kicker color={C.blue}>Trusted Partners</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3 mb-8" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Partner Banks for Home Loan Assistance
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
            {banks.map((b) => (
              <span key={b} className="px-5 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: C.panel, color: C.ink }}>
                {b}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="px-6 md:px-16 py-20" style={{ backgroundColor: C.panel }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-10 text-center">
            <Kicker color={C.blue}>How It Works</Kicker>
            <h2 className="text-2xl md:text-3xl mt-3" style={{ ...display, color: C.ink, fontWeight: 500 }}>
              Step-by-Step Process
            </h2>
          </Reveal>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={(i % 5) * 0.05}>
                <div className="flex gap-4 rounded-xl p-5" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
                  <span
                    aria-hidden
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold"
                    style={{ width: 32, height: 32, backgroundColor: C.ink, color: '#fff' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm md:text-base mb-1" style={{ ...display, color: C.ink, fontWeight: 500 }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: C.slate }}>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-6 md:px-16 py-20 text-center" style={{ backgroundColor: C.ink }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ ...display, color: '#fff', fontWeight: 500 }}>
              Your Trusted Partner for Home Loans
            </h2>
            <p className="mb-6" style={{ ...body, color: 'rgba(248,248,245,0.75)' }}>
              Securing a home loan in Chennai doesn&rsquo;t have to be complicated. Talk to our team
              and we&rsquo;ll simplify the entire process, from finding the best rate to finalizing your
              dream property.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I'd like help with a home loan for an OmShakthy property.")}`}
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
