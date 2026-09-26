// Server component for the /kanopus-magha1 landing page. Built in the same
// visual language as the site's About page: white and pale-blue sections, real
// photography, big rounded cards with soft shadows, Fraunces headings, and the
// calm focus-pull / word-rise reveals. Every word is real HTML from the
// project's data file (or copy the company already publishes on /about); the
// 3D layer (Stage) and the motion (motion.tsx) are enhancements on top.

import Image from 'next/image'
import type { ProjectData } from '@/lib/projects'
import styles from './kanopus3d.module.css'
import Stage from './Stage'
import EnquiryForm from './EnquiryForm'
import { Icon, type IconName } from './icons'
import { ArtLand, ArtDeed, ArtRoutes, ArtCommunity } from './art'
import { Reveal, Kinetic, AutoSlide, ParallaxPhoto, HeroBg, CountUp, Bar, Marquee, ImageReveal } from './motion'

/* Same tokens as AboutContent.tsx. */
const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif" }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace" }
const soft = '0 24px 60px -20px rgba(11,31,58,0.25)'
const heroTextShadow = '2px 2px 4px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.55)'
const h2Style: React.CSSProperties = {
  ...display,
  color: C.ink,
  fontSize: 'clamp(2.2rem, 4.6vw, 3.7rem)',
  letterSpacing: '-0.03em',
  lineHeight: 1.05,
}
const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.28)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  color: '#fff',
}

const spec = (data: ProjectData, label: string) =>
  data.specs.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value ?? ''

// "Avadi Railway Station : 5 Mins" -> { name, time, mins }
const splitTime = (line: string) => {
  const i = line.lastIndexOf(':')
  const name = i === -1 ? line : line.slice(0, i).trim()
  const time = i === -1 ? '' : line.slice(i + 1).trim()
  return { name, time, mins: Number(time.match(/\d+/)?.[0] ?? 0) }
}

// Facilities named in the project's own amenities paragraph (connectivityIntro).
const facilities: { icon: IconName; title: string; note: string }[] = [
  { icon: 'arch', title: 'Regal entrance archways', note: 'Impressive entrances flanked by regal archways, the signature of the project.' },
  { icon: 'shield', title: 'Round-the-clock security', note: 'A completely private, guarded community.' },
  { icon: 'drop', title: 'Storm water drainage', note: 'Efficient drainage, planned in from the start.' },
  { icon: 'water', title: 'Potable water', note: 'Easily accessible potable water sources.' },
]

const Bar4 = () => (
  <span aria-hidden="true" className="block rounded" style={{ width: 46, height: 4, background: C.blue }} />
)

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <span
    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.68rem] uppercase"
    style={{
      ...mono,
      letterSpacing: '0.25em',
      color: light ? '#fff' : C.blueDeep,
      background: light ? 'rgba(255,255,255,0.14)' : 'rgba(13,107,178,0.08)',
      border: light ? '1px solid rgba(255,255,255,0.32)' : `1px solid ${C.border}`,
    }}
  >
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: light ? C.mist : C.blue }} />
    {children}
  </span>
)

export default function Story({ data }: { data: ProjectData }) {
  const units = spec(data, 'Number of Units')
  const size = spec(data, 'Size')
  const possession = spec(data, 'Posession date')
  const priceRaw = spec(data, 'Price')
  const priceNum = priceRaw.match(/[\d,]+/)?.[0]
  const price = priceNum ? `₹${Number(priceNum.replace(/,/g, '')).toLocaleString('en-IN')} / sq ft` : priceRaw

  const [nLocation, nApproval, nAmenities, nPlot] = data.narrativeSections
  const connect = data.connectivity.map(splitTime)
  const maxMins = Math.max(...connect.map((c) => c.mins), 1)
  const keyRoutes = connect.filter((c) => /railway|metro|bus/i.test(c.name))
  const lastOf = (a: string[]) => a[a.length - 1]
  const ticker = ['CMDA Approved', 'DTCP Approved', ...data.amenities]

  const heroStats = [
    { label: 'Plots', value: units },
    { label: 'Plot size', value: size },
    { label: 'Price', value: price },
    { label: 'Possession', value: possession },
  ]

  // Figures the company already publishes on its About page.
  const trust: { icon: IconName; to: number; prefix?: string; suffix: string; label: string }[] = [
    { icon: 'calendar', to: 35, suffix: '+', label: 'Years of real estate excellence' },
    { icon: 'users', to: 7500, suffix: '+', label: 'Happy customers' },
    { icon: 'coin', to: 2000, prefix: '₹', suffix: '+ Cr', label: 'In business transactions' },
    { icon: 'shield', to: 100, suffix: '%', label: 'Litigation-free track record' },
  ]

  const chapters = [
    { id: 'land', no: '01', kicker: 'The layout', title: nPlot.heading, body: [nPlot.paragraphs[0]], chips: [units, size].filter(Boolean), art: <ArtLand /> },
    {
      id: 'title',
      no: '02',
      kicker: 'The paperwork',
      title: nApproval.heading,
      body: [nApproval.paragraphs[0], lastOf(nApproval.paragraphs)],
      chips: ['CMDA approved', 'DTCP approved'],
      art: <ArtDeed />,
    },
    { id: 'connect', no: '03', kicker: 'The location', title: nLocation.heading, body: [nLocation.paragraphs[1]], routes: keyRoutes, art: <ArtRoutes /> },
    {
      id: 'community',
      no: '04',
      kicker: 'The community',
      title: nAmenities.heading,
      body: [nAmenities.paragraphs[0], data.connectivityIntro],
      art: <ArtCommunity />,
    },
  ]

  const whyRows = [
    { img: '/projects-lp/kanopus-magha-hero.webp', title: 'Approved, with clear titles', desc: nApproval.paragraphs[1] },
    { img: '/about/loc-4.webp', title: 'A connected address', desc: nLocation.paragraphs[2] },
    { img: '/about/loc-9.webp', title: 'A plot that fits your next chapter', desc: nPlot.paragraphs[1] },
  ]

  return (
    <main style={{ backgroundColor: '#fff', color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden px-4 pb-12 pt-40 md:px-6">
        <HeroBg src="/canopus-magha.webp" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(4,14,30,0.55) 0%, rgba(4,14,30,0.08) 36%, rgba(4,14,30,0.8) 100%)' }}
        />
        <div className="relative mx-auto w-full max-w-[1180px]">
          <Reveal blur={false}>
            <Eyebrow light>OmShakthy Homes presents</Eyebrow>
          </Reveal>
          <Kinetic
            as="h1"
            onLoad
            delay={0.1}
            text={data.name}
            className="mt-6 font-bold"
            style={{ ...display, color: '#fff', textShadow: heroTextShadow, fontSize: 'clamp(3.6rem, 12vw, 9.5rem)', letterSpacing: '-0.04em', lineHeight: 0.92 }}
          />
          <Reveal delay={0.5} blur={false}>
            <p className="mt-6 max-w-xl text-lg md:text-xl" style={{ color: 'rgba(255,255,255,0.94)', textShadow: '0 1px 14px rgba(0,0,0,0.55)' }}>
              Premium {data.type?.toLowerCase() ?? 'plots'} in Avadi, Chennai. CMDA and DTCP approved, with litigation-free, clear titles.
            </p>
          </Reveal>
          <Reveal delay={0.65} blur={false} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#visit"
              className="group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-semibold"
              style={{ background: '#fff', color: C.ink }}
            >
              Book a free site visit
              <span
                className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1"
                style={{ background: C.blue }}
              >
                <Icon name="arrow" size={16} color="#fff" stroke={1.8} />
              </span>
            </a>
            <a href="#story" className="rounded-full px-6 py-3.5 text-sm font-semibold text-white" style={{ border: '1px solid rgba(255,255,255,0.55)' }}>
              Explore the layout
            </a>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {heroStats.map((s, i) => (
              <Reveal key={s.label} delay={0.8 + i * 0.08} blur={false} className="h-full">
                <div className="h-full rounded-2xl p-4 md:p-5" style={glass}>
                  <div className="text-[0.66rem] uppercase" style={{ ...mono, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.75)' }}>
                    {s.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold leading-tight md:text-2xl" style={display}>
                    {s.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Overview ---------------- */}
      <div className="relative overflow-hidden">
        <Image
          src="/about/building-sketch.webp"
          alt=""
          aria-hidden
          width={1280}
          height={904}
          className="pointer-events-none absolute -left-20 hidden w-[820px] select-none sm:block md:-left-32 md:w-[1280px]"
          style={{ opacity: 0.08, top: '50%', transform: 'translateY(-50%)' }}
        />
        <section className="relative px-4 py-16 md:px-6 md:py-28" data-header-theme="light">
          <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <Reveal>
                <Bar4 />
              </Reveal>
              <Kinetic text="A signature address in Avadi" className="mt-6 font-bold" style={h2Style} />
              <Reveal delay={0.1}>
                <p className="mt-6 text-base leading-relaxed md:text-lg" style={{ color: C.slate }}>
                  {nLocation.paragraphs[0]}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {['CMDA approved', 'DTCP approved', 'Clear titles', possession].filter(Boolean).map((t) => (
                    <li
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium"
                      style={{ border: `1px solid ${C.border}`, color: C.blueDeep, boxShadow: '0 8px 20px -12px rgba(11,31,58,0.25)' }}
                    >
                      <Icon name="check" size={15} color={C.blue} stroke={2} /> {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal className="relative" y={40}>
              <div className="relative h-[380px] overflow-hidden rounded-[28px] md:h-[540px]" style={{ boxShadow: soft }}>
                <AutoSlide
                  images={['/projects-lp/kanopus-magha-hero.webp', '/about/loc-2.webp', '/about/loc-3.webp', '/about/loc-4.webp']}
                  alt={`${data.name}, Avadi, Chennai`}
                  sizes="(min-width: 768px) 560px, 100vw"
                />
              </div>
              <div
                className="absolute -bottom-6 left-4 rounded-2xl bg-white px-5 py-4 md:-left-6"
                style={{ boxShadow: '0 20px 44px -18px rgba(11,31,58,0.35)', border: `1px solid ${C.border}` }}
              >
                <div className="text-[0.66rem] uppercase" style={{ ...mono, letterSpacing: '0.22em', color: C.slate }}>
                  Residential plots
                </div>
                <div className="mt-1 text-2xl font-bold" style={{ ...display, color: C.ink }}>
                  {units}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ---------------- Trust figures ---------------- */}
      <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ backgroundColor: C.panel }} data-header-theme="light">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="text-center">
            <Eyebrow>Since 1991</Eyebrow>
            <h2 className="mt-5 font-bold" style={h2Style}>
              A legacy measured by trust
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {trust.map((t, i) => (
              <Reveal key={t.label} delay={i * 0.07} className="h-full">
                <div
                  className="relative h-full overflow-hidden rounded-3xl bg-white p-5 text-center md:p-7"
                  style={{ boxShadow: '0 14px 36px -16px rgba(11,31,58,0.2)', border: `1px solid ${C.border}` }}
                >
                  <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#004385,#0D6BB2,#7DB4EB)' }} />
                  <div className="flex justify-center">
                    <Icon name={t.icon} size={32} />
                  </div>
                  <div className="mt-5 text-3xl font-bold md:text-5xl" style={{ ...display, color: C.ink, letterSpacing: '-0.03em' }}>
                    <CountUp to={t.to} prefix={t.prefix} suffix={t.suffix} />
                  </div>
                  <div className="mt-2 text-sm md:text-base" style={{ color: C.slate }}>
                    {t.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Ticker ---------------- */}
      <div className="border-y bg-white py-5" style={{ borderColor: C.border }} aria-label="Highlights" data-header-theme="light">
        <Marquee seconds={70}>
          {ticker.map((t) => (
            <span key={t} className="flex items-center whitespace-nowrap text-2xl italic md:text-3xl" style={{ ...display, color: C.blueDeep }}>
              {t}
              <span className="mx-8 inline-block h-2 w-2 rotate-45" style={{ background: C.mist }} />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------------- 3D story ---------------- */}
      <section id="story-intro" className="px-4 pb-6 pt-20 text-center md:px-6 md:pt-28" data-header-theme="light">
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>Discover {data.name}</Eyebrow>
          <h2 className="mt-5 font-bold" style={h2Style}>
            The layout, the paperwork, the location, the community
          </h2>
        </Reveal>
      </section>

      <div id="story" data-story className={styles.story} data-header-theme="light">
        <Stage />
        {chapters.map((c) => (
          <section key={c.id} data-chapter className={styles.chapter} aria-labelledby={`${c.id}-h`}>
            <div className={styles.pin}>
              <div className={styles.copy}>
                <span className="text-xs uppercase" style={{ ...mono, letterSpacing: '0.25em', color: C.blueDeep }}>
                  {c.no} · {c.kicker}
                </span>
                <h3
                  id={`${c.id}-h`}
                  className="mt-3 font-bold"
                  style={{ ...display, color: C.ink, fontSize: 'clamp(1.9rem, 3.4vw, 3rem)', lineHeight: 1.06, letterSpacing: '-0.025em' }}
                >
                  {c.title}
                </h3>
                {c.body.filter(Boolean).map((p) => (
                  <p key={p.slice(0, 32)} className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: C.slate }}>
                    {p}
                  </p>
                ))}
                {c.chips && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {c.chips.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-white px-4 py-2 text-sm font-medium"
                        style={{ border: `1px solid ${C.border}`, color: C.blueDeep, boxShadow: '0 8px 20px -12px rgba(11,31,58,0.25)' }}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {c.routes && (
                  <dl className="mt-5">
                    {c.routes.map((r) => (
                      <div key={r.name} className="flex justify-between gap-4 border-b py-3" style={{ borderColor: C.border }}>
                        <dt className="font-medium">{r.name}</dt>
                        <dd className="font-semibold" style={{ color: C.blue }}>
                          {r.time}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className={styles.art}>{c.art}</div>
            </div>
          </section>
        ))}
      </div>

      {/* ---------------- Why (photo / text rows with parallax) ---------------- */}
      <section className="relative px-4 py-16 md:px-6 md:py-28" data-header-theme="light">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="text-center">
            <h2 className="font-bold" style={h2Style}>
              Why Kanopus Magha
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base md:text-lg" style={{ color: C.slate }}>
              The approvals, the address and the freedom to build on your own timeline.
            </p>
          </Reveal>
          <div className="mt-14 flex flex-col gap-10 md:gap-16">
            {whyRows.map((f, i) => {
              const flip = i % 2 === 1
              return (
                <div key={f.title} className={`flex flex-col gap-6 md:items-center md:gap-14 ${flip ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <Reveal className="w-full flex-shrink-0 md:w-[52%]" y={40}>
                    <div className="relative h-[280px] overflow-hidden rounded-[28px] md:h-[420px]" style={{ boxShadow: soft }}>
                      <ParallaxPhoto src={f.img} alt={f.title} sizes="(min-width: 768px) 600px, 100vw" />
                    </div>
                  </Reveal>
                  <Reveal delay={0.12} className={flip ? 'md:text-right' : ''}>
                    <span className="text-xs" style={{ ...mono, letterSpacing: '0.25em', color: C.blueDeep }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold md:text-4xl" style={{ ...display, color: C.ink, letterSpacing: '-0.025em' }}>
                      {f.title}
                    </h3>
                    <p className={`mt-4 max-w-md text-base leading-relaxed md:text-lg ${flip ? 'md:ml-auto' : ''}`} style={{ color: C.slate }}>
                      {f.desc}
                    </p>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Facilities (bento) ---------------- */}
      <section className="relative px-4 py-16 md:px-6 md:py-28" style={{ backgroundColor: C.panel }} data-header-theme="light">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Life at {data.name}</Eyebrow>
            <h2 className="mt-5 font-bold" style={h2Style}>
              Thoughtfully planned, beautifully finished
            </h2>
            <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>
              {data.tagline}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:auto-rows-[minmax(12rem,auto)] md:grid-cols-12">
            <Reveal className="relative min-h-[380px] overflow-hidden rounded-[28px] md:col-span-7 md:row-span-2" style={{ background: 'linear-gradient(160deg,#F6FAFE,#D6E7F6)', boxShadow: '0 18px 44px -22px rgba(11,31,58,0.22)', border: `1px solid ${C.border}` }}>
              <Image src="/decor/playground.webp" alt="Children's play area" fill sizes="(min-width: 768px) 700px, 100vw" className="object-contain object-right-bottom p-4 md:p-8" />
              <div className="relative z-10 max-w-[70%] p-7 md:max-w-[50%] md:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white" style={{ border: `1px solid ${C.border}` }}>
                  <Icon name="play" />
                </span>
                <h3 className="mt-5 text-2xl font-bold md:text-3xl" style={{ ...display, color: C.ink, letterSpacing: '-0.02em' }}>
                  Children&apos;s play area
                </h3>
                <p className="mt-2 text-base" style={{ color: C.slate }}>
                  Energetic play, close to home.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="relative min-h-[240px] overflow-hidden rounded-[28px] md:col-span-5" style={{ background: 'linear-gradient(160deg,#FFFFFF,#DDEBF8)', boxShadow: '0 18px 44px -22px rgba(11,31,58,0.22)', border: `1px solid ${C.border}` }}>
              <Image src="/decor/lamp-post.webp" alt="Solar LED street light" fill sizes="(min-width: 768px) 420px, 100vw" className="object-contain object-right p-4" />
              <div className="relative z-10 max-w-[60%] p-7 md:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white" style={{ border: `1px solid ${C.border}` }}>
                  <Icon name="lamp" />
                </span>
                <h3 className="mt-5 text-xl font-bold md:text-2xl" style={{ ...display, color: C.ink }}>
                  Solar LED street lights
                </h3>
                <p className="mt-2 text-sm" style={{ color: C.slate }}>
                  Eco-friendly lighting throughout.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16} className="relative min-h-[240px] overflow-hidden rounded-[28px] md:col-span-5" style={{ background: 'linear-gradient(160deg,#FFFFFF,#DDEBF8)', boxShadow: '0 18px 44px -22px rgba(11,31,58,0.22)', border: `1px solid ${C.border}` }}>
              <Image src="/decor/tree-accent.webp" alt="Landscaped park" fill sizes="(min-width: 768px) 420px, 100vw" className="object-contain object-right-bottom p-4" />
              <div className="relative z-10 max-w-[60%] p-7 md:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white" style={{ border: `1px solid ${C.border}` }}>
                  <Icon name="tree" />
                </span>
                <h3 className="mt-5 text-xl font-bold md:text-2xl" style={{ ...display, color: C.ink }}>
                  Well-designed parks
                </h3>
                <p className="mt-2 text-sm" style={{ color: C.slate }}>
                  Serenity close to home.
                </p>
              </div>
            </Reveal>

            {facilities.map((f, i) => (
              <Reveal
                key={f.title}
                delay={i * 0.07}
                className="rounded-[28px] bg-white p-7 md:col-span-3"
                style={{ boxShadow: '0 18px 44px -22px rgba(11,31,58,0.22)', border: `1px solid ${C.border}` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: C.panel }}>
                  <Icon name={f.icon} />
                </span>
                <h3 className="mt-5 text-xl font-bold" style={{ ...display, color: C.ink }}>
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: C.slate }}>
                  {f.note}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Specs ---------------- */}
      <section className="relative px-4 py-16 md:px-6 md:py-28" data-header-theme="light">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="text-center">
            <Eyebrow>At a glance</Eyebrow>
            <h2 className="mt-5 font-bold" style={h2Style}>
              The plots, in detail
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="h-full">
                <div
                  className="relative h-full overflow-hidden rounded-3xl bg-white p-6 md:p-8"
                  style={{ boxShadow: '0 14px 36px -16px rgba(11,31,58,0.2)', border: `1px solid ${C.border}` }}
                >
                  <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#004385,#0D6BB2,#7DB4EB)' }} />
                  <div className="text-[0.7rem] uppercase" style={{ ...mono, letterSpacing: '0.22em', color: C.slate }}>
                    {s.label}
                  </div>
                  <div className="mt-3 text-2xl font-bold md:text-3xl" style={{ ...display, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    {s.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Location ---------------- */}
      <section className="relative px-4 py-16 md:px-6 md:py-28" style={{ backgroundColor: C.panel }} data-header-theme="light">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Location</Eyebrow>
              <h2 className="mt-5 font-bold" style={h2Style}>
                Everything within reach
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-5">
              {connect.map((c, i) => (
                <li key={c.name}>
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <span className="font-medium">{c.name}</span>
                    <b className="whitespace-nowrap font-semibold" style={{ color: C.blue }}>
                      {c.time}
                    </b>
                  </div>
                  <Bar ratio={c.mins / maxMins} delay={i * 0.05} />
                </li>
              ))}
            </ul>
          </div>
          {data.mapIframe && (
            <Reveal y={40}>
              <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-white md:sticky md:top-28 md:h-[600px]" style={{ boxShadow: soft }}>
                <iframe
                  src={data.mapIframe}
                  title={`Map of ${data.name}, Avadi`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section id="visit" className="px-4 pb-24 pt-16 md:px-6 md:pb-28 md:pt-24" data-header-theme="light">
        <Reveal className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] md:grid-cols-2" style={{ backgroundColor: C.panel, boxShadow: soft }}>
          <div className="flex flex-col justify-center p-7 md:p-12">
            <Bar4 />
            <h2 className="mt-6 font-bold" style={{ ...h2Style, fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
              Book a free site visit
            </h2>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: C.slate }}>
              Visit {data.name}, see the layout and the location for yourself, and understand your plot options with clarity.
            </p>
            <ul className="mt-6 grid gap-3 text-sm md:text-base">
              <li className="flex items-center gap-3">
                <Icon name="phone" size={20} color={C.blue} />
                <a href="tel:04440303040" className="font-medium" style={{ color: C.ink }}>
                  +91 44 40303040
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="chat" size={20} color={C.blue} />
                <a href="mailto:marketing@omshakthy.net" className="font-medium" style={{ color: C.ink }}>
                  marketing@omshakthy.net
                </a>
              </li>
            </ul>
            <EnquiryForm projectName={data.name} />
          </div>
          <div className="relative min-h-[320px]">
            <ImageReveal src="/about/loc-7.webp" sizes="(min-width: 768px) 590px, 100vw" imgClassName="object-cover brightness-[0.55]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <Image src="/omshakthy-logo.webp" alt="OmShakthy Homes" width={112} height={112} className="h-20 w-20 object-contain md:h-28 md:w-28" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }} />
              <span className="text-sm font-semibold uppercase md:text-base" style={{ color: '#fff', letterSpacing: '0.3em' }}>
                OmShakthy Homes
              </span>
              <span className="px-6 text-base italic" style={{ ...display, color: 'rgba(255,255,255,0.85)' }}>
                Building legacy, in land &amp; trust.
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Sticky call / WhatsApp bar for phones */}
      <nav
        aria-label="Quick contact"
        className="fixed left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full p-1.5 md:hidden"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
          background: 'rgba(255,255,255,0.92)',
          border: `1px solid ${C.border}`,
          boxShadow: '0 14px 40px -12px rgba(11,31,58,0.35)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <a href="tel:04440303040" className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium" style={{ color: C.ink }}>
          <Icon name="phone" size={18} color={C.blue} /> Call
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=919150088097"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium"
          style={{ color: C.ink }}
        >
          <Icon name="chat" size={18} color={C.blue} /> WhatsApp
        </a>
        <a href="#visit" className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white" style={{ background: C.blue }}>
          Book a visit
        </a>
      </nav>
    </main>
  )
}
