'use client'
import { useState, useEffect } from 'react'

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
  // Reported live: tapping the tab on an actual phone did nothing
  // visible — it actually DOES open every time, `right: 430` (chosen
  // to clear Kenyt's ~380px desktop chat panel, see below) plus this
  // form's own 300px width need 730px of viewport to fit at all. On
  // any phone-width screen that puts the whole form off-screen to the
  // left, invisible, not failing to open. Centering it on narrow
  // viewports instead — the chat panel this was dodging isn't
  // anywhere near full desktop width there either.
  const [isNarrow, setIsNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const check = () => setIsNarrow(mq.matches)
    check()
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])

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
        {/* writing-mode:vertical-rl + a transform (rotate(180deg), on
            this span first, then split onto a separate wrapper span)
            kept producing real, reproducible WebKit bugs — in order:
            text clipped on an actual iPad, a bogus width reading that
            turned out to be a flawed measurement script, and then a
            genuine one confirmed on-device: the button's own 14px
            top/bottom padding barely rendering at all around the
            text, unlike Chrome where it's clearly visible. Three
            separate bugs from the same pairing is enough — rebuilt as
            plain stacked letters instead (one real horizontal
            character per row, normal text, zero rotation and zero
            writing-mode anywhere), which has no equivalent cross-
            browser history of sizing bugs because it's just ordinary
            block layout. */}
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {['ENQUIRE', 'NOW'].map((word, wi) => (
            <span
              key={word}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: wi > 0 ? '10px' : 0 }}
            >
              {word.split('').map((ch, ci) => (
                <span key={ci} style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.35 }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Book a free site visit"
          style={{
            position: 'fixed',
            top: '50%',
            ...(isNarrow
              ? // Centered instead of dodging the chat panel — that
                // 430px clearance doesn't fit at all below 730px wide,
                // and Kenyt's own widget isn't anywhere near desktop
                // width here either, so there's nothing to clear.
                { left: '50%', transform: 'translate(-50%, -50%)', width: 'min(300px, calc(100vw - 32px))' }
              : // Kenyt's chatbot panel (separately embedded, see
                // layout.tsx) can be open at the same time and occupies
                // a ~380px-wide strip on the right — sitting this clear
                // of that strip, rather than directly behind it, so
                // neither widget hides the other regardless of which
                // opened first.
                { right: 430, transform: 'translateY(-50%)', width: 300 }),
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
