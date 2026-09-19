'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

/* ContactContent — same C/display/body/mono/Reveal pattern
   AboutContent.tsx/ProjectsContent.tsx already established for this
   site's content pages, duplicated locally rather than shared, same as
   those files did for their own primitives. Real contact details only
   (address/phone/email/WhatsApp number all pulled from Footer.tsx,
   the site's one existing source of truth for them) — nothing
   invented. No backend/API route exists anywhere in this codebase, so
   the form below doesn't pretend to submit to one: it hands the
   message off to the same WhatsApp number Footer's own floating button
   already uses, which is a real, working destination rather than a
   fake "Thanks, we'll be in touch" success state. */

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
const ease = [0.16, 1, 0.3, 1] as const

// Cheap 2-layer shadow, not .hero-slider__title's full 8-layer stack —
// see AboutContent.tsx/ProjectsContent.tsx for why: the 4 large-blur
// glow layers jank scroll badly on a heading this large.
const heroTextShadow = '2px 2px 4px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.55)'

const Reveal = ({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// Real details — same ones Footer.tsx already uses site-wide.
const ADDRESS = 'OmShakthy Tower, 1N1 Jawaharlal Nehru Salai, Ekkaduthangal, Chennai 600032'
const PHONE_DISPLAY = '044 4030 3040'
const PHONE_TEL = '04440303040'
const EMAIL = 'marketing@omshakthy.net'
const WHATSAPP_NUMBER = '919150088097'
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`

const contactCards = [
  {
    icon: 'pin',
    label: 'Visit Us',
    lines: [ADDRESS],
    href: MAPS_DIRECTIONS_URL,
    linkText: 'Get Directions',
    external: true,
  },
  {
    icon: 'phone',
    label: 'Call Us',
    lines: [PHONE_DISPLAY],
    href: `tel:${PHONE_TEL}`,
    linkText: 'Call Now',
    external: false,
  },
  {
    icon: 'mail',
    label: 'Email Us',
    lines: [EMAIL],
    href: `mailto:${EMAIL}`,
    linkText: 'Send an Email',
    external: false,
  },
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    lines: ['Fastest way to reach us'],
    href: `https://api.whatsapp.com/send?text=Hi,%20I%20am%20interested%20in%20OmShakthy.&phone=${WHATSAPP_NUMBER}`,
    linkText: 'Chat Now',
    external: true,
  },
]

const ICONS: Record<string, string> = {
  pin: 'M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z|12,9.5,2.4',
  phone: 'M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.5 2.5.8 3.9.8.6 0 1 .4 1 1v3.4c0 .6-.4 1-1 1C10.6 21.2 2.8 13.4 2.8 4.7c0-.6.4-1 1-1H7.2c.6 0 1 .4 1 1 0 1.4.3 2.7.8 3.9.2.3.1.7-.2 1L6.6 10.8Z',
  mail: 'M3 6.5h18v11H3z|M3 6.5l9 6.5 9-6.5',
  whatsapp: 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.34-.5.05-1.14.07-1.84-.12-.42-.11-.97-.31-1.66-.6-2.93-1.27-4.84-4.2-4.99-4.4-.15-.2-1.2-1.59-1.2-3.03 0-1.44.76-2.15 1.03-2.44.27-.29.6-.36.8-.36.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.6.83 2.06.9 2.21.07.15.11.32.02.52-.09.2-.14.32-.27.5-.13.17-.28.38-.4.51-.13.14-.27.28-.12.55.15.27.68 1.12 1.46 1.81 1 .89 1.85 1.16 2.12 1.29.27.13.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.51.31.07.11.07.63-.17 1.31z',
}

const Icon = ({ name, size = 26 }: { name: string; size?: number }) => {
  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={C.blue} aria-hidden>
        <path d={ICONS.whatsapp} />
      </svg>
    )
  }
  if (name === 'pin') {
    const [outline, circle] = ICONS.pin.split('|')
    const [cx, cy, r] = circle.split(',')
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={C.blue} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={outline} />
        <circle cx={cx} cy={cy} r={r} />
      </svg>
    )
  }
  if (name === 'mail') {
    const [box, flap] = ICONS.mail.split('|')
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={C.blue} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={box} />
        <path d={flap} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={C.blue} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS.phone} />
    </svg>
  )
}

const ContactContent = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend/API route exists in this codebase — hands the message
    // to the same real WhatsApp number Footer's own floating button
    // uses, instead of pretending to submit to a form endpoint that
    // isn't there.
    const text = [
      `Hi, I'm ${name || 'a visitor from omshakthy.net'}.`,
      phone ? `My number: ${phone}.` : '',
      message,
    ]
      .filter(Boolean)
      .join(' ')
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main style={{ backgroundColor: '#fff', color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section
        className="relative flex items-end min-h-[46vh] pt-40 pb-14 px-6 md:px-10"
        style={{
          backgroundImage: `url('/projects/hero.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1180px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-3"
            style={{ ...mono, fontSize: '0.8rem', letterSpacing: '0.2em', color: C.mist, textTransform: 'uppercase', textShadow: heroTextShadow }}
          >
            <span style={{ width: 36, height: 1.5, background: C.mist, display: 'inline-block' }} />
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-6xl font-bold"
            style={{ ...display, color: '#fff', textShadow: heroTextShadow }}
          >
            Let&rsquo;s Build Something Real
          </motion.h1>
        </div>
      </section>

      {/* ---------------- Contact cards ---------------- */}
      <section className="px-6 md:px-10 py-16" data-header-theme="light">
        <div className="max-w-[1180px] mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold uppercase" style={{ ...display, color: C.ink, letterSpacing: '0.08em' }}>
              Get In Touch
            </h2>
            <p className="mt-3 text-base md:text-lg" style={{ color: C.slate }}>
              Reach us directly — a real person answers, not a queue.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card, i) => (
              <Reveal key={card.label} delay={i * 0.06}>
                <div
                  className="h-full rounded-2xl p-6 flex flex-col"
                  style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, boxShadow: '0 10px 30px -14px rgba(11,31,58,0.12)' }}
                >
                  <Icon name={card.icon} />
                  <h3 className="mt-4 text-base font-bold uppercase" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
                    {card.label}
                  </h3>
                  <div className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: C.slate }}>
                    {card.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <a
                    href={card.href}
                    target={card.external ? '_blank' : undefined}
                    rel={card.external ? 'noopener noreferrer' : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: C.blue }}
                  >
                    {card.linkText}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Form + Map ---------------- */}
      <section className="px-6 md:px-10 py-16" style={{ backgroundColor: C.panel }} data-header-theme="light">
        <div className="max-w-[1180px] mx-auto grid md:grid-cols-2 gap-10 items-start">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ ...display, color: C.ink }}>
              Send Us a Message
            </h2>
            <p className="mt-3 text-base" style={{ color: C.slate }}>
              Fill this in and it opens straight into WhatsApp with your message ready to send —
              no forms disappearing into an inbox nobody checks.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-5 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full px-5 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
              />
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are you looking for?"
                rows={4}
                className="w-full px-5 py-3.5 rounded-3xl text-sm outline-none resize-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
              />
              <button
                type="submit"
                className="mt-1 px-6 py-3.5 rounded-full text-sm font-semibold uppercase self-start"
                style={{ ...mono, backgroundColor: C.ink, color: '#fff', letterSpacing: '0.08em' }}
              >
                Send via WhatsApp
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[28px] overflow-hidden" style={{ boxShadow: '0 24px 60px -20px rgba(11,31,58,0.2)', height: 420 }}>
              <iframe
                title="OmShakthy Tower location"
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Link
              href="/projects"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: C.blue }}
            >
              Explore our projects
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default ContactContent
