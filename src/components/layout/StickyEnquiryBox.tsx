'use client'
import { useState } from 'react'

// Real element prod has (footer-new.php: .enquire-vertical-btn +
// .floating-visit-form, "Book a free Site Visit" / Name·Phone·Email)
// that this rebuild never had — Adglobe's Nov 2026 audit flagged it as
// one of the "missing essentials". Rendered once, globally, in
// layout.tsx (same spot as the Kenyt chatbot script) rather than wired
// into all 25+ page.tsx files individually.
//
// Prod's own version posts to send.php, a PHP mailer this codebase has
// no equivalent of — routes to WhatsApp instead, the exact same
// no-backend pattern ContactContent.tsx's own form already uses
// (same real WHATSAPP_NUMBER). Colors are this site's own already-
// established tokens (gold accent, ink panel) filling the same role
// prod's raw #ecc81a/#000 did, not a new palette.
const WHATSAPP_NUMBER = '919150088097'
const GOLD = '#C9A227'
const INK = '#0B1F3A'

export default function StickyEnquiryBox() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = [
      `Hi, I'd like to book a free site visit.`,
      name ? `Name: ${name}.` : '',
      phone ? `Phone: ${phone}.` : '',
      email ? `Email: ${email}.` : '',
    ]
      .filter(Boolean)
      .join(' ')
    window.open(
      `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Enquire now"
        style={{
          position: 'fixed',
          right: 0,
          top: '55%',
          transform: 'translateY(-50%)',
          zIndex: 998,
          background: GOLD,
          color: INK,
          padding: '14px 8px',
          borderRadius: '10px 0 0 10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {/* Was writing-mode:vertical-rl + transform:rotate(180deg) on
            this SAME span — reported live, cut off on an actual iPad:
            a known WebKit bug where a vertical-writing-mode element
            that also carries its own transform gets its post-rotation
            bounding box computed from the pre-rotation (unrotated)
            layout size, clipping the rotated text to that wrong box.
            Chrome computes it correctly, which is why this never
            showed up in any of this session's own Chrome testing.
            Splitting the two properties onto separate elements — the
            rotate on this outer span, vertical-rl on the inner one —
            means neither single element carries both at once, which
            avoids the specific pairing the bug triggers on. */}
        <span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}>
          <span
            style={{
              writingMode: 'vertical-rl',
              fontFamily: "'JetBrains Mono', Consolas, monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
            }}
          >
            ENQUIRE NOW
          </span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Book a free site visit"
          style={{
            position: 'fixed',
            // Kenyt's chatbot panel (separately embedded, see
            // layout.tsx) can be open at the same time and occupies a
            // ~380px-wide strip on the right — sitting this clear of
            // that strip, rather than directly behind it, so neither
            // widget hides the other regardless of which opened first.
            right: 430,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 300,
            background: INK,
            color: '#fff',
            padding: '1.5rem',
            borderRadius: 14,
            boxShadow: '0 15px 40px rgba(0,0,0,0.35)',
            zIndex: 100000,
            fontFamily: "'Inter', Helvetica, Arial, sans-serif",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: GOLD,
              color: INK,
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: '28px',
            }}
          >
            ×
          </button>
          <h3
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.15rem',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Book a Free Site Visit
          </h3>
          <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            Share your details and we&rsquo;ll get back to you
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ height: 40, borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: '#fff', color: INK, padding: '0 10px', fontSize: '0.85rem' }}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ height: 40, borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: '#fff', color: INK, padding: '0 10px', fontSize: '0.85rem' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ height: 40, borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: '#fff', color: INK, padding: '0 10px', fontSize: '0.85rem' }}
            />
            <button
              type="submit"
              style={{
                height: 42,
                background: GOLD,
                color: INK,
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Book a Free Site Visit
            </button>
          </form>
        </div>
      )}
    </>
  )
}
