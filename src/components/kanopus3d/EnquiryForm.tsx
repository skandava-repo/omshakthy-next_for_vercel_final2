'use client'

// Same behaviour as the site-visit form on the live project pages: it opens a
// WhatsApp chat with the details filled in. Nothing is stored or sent by us.

import { useState } from 'react'
import { Icon } from './icons'

const WHATSAPP_NUMBER = '919150088097'
const C = { ink: '#0B1F3A', slate: '#64748B', blue: '#0D6BB2', border: 'rgba(13, 107, 178, 0.18)' }

const input =
  'w-full px-4 py-3.5 rounded-xl text-[0.95rem] outline-none transition focus:border-[#0D6BB2] focus:ring-4 focus:ring-[#0D6BB2]/10'

export default function EnquiryForm({ projectName }: { projectName: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = [
      `Hi, I'm ${name || 'a visitor from omshakthy.net'}. I'd like to book a free site visit to ${projectName}.`,
      phone ? `My number: ${phone}.` : '',
      email ? `Email: ${email}.` : '',
    ]
      .filter(Boolean)
      .join(' ')
    window.open(
      `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const style = { backgroundColor: '#fff', border: `1px solid ${C.border}`, color: C.ink }

  return (
    <form onSubmit={submit} className="mt-7 flex flex-col gap-3">
      <label className="sr-only" htmlFor="kv-name">Name</label>
      <input id="kv-name" className={input} style={style} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
      <label className="sr-only" htmlFor="kv-phone">Phone</label>
      <input id="kv-phone" className={input} style={style} placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      <label className="sr-only" htmlFor="kv-email">Email</label>
      <input id="kv-email" className={input} style={style} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <button
        type="submit"
        className="group mt-2 inline-flex items-center justify-between gap-4 rounded-full py-2 pl-7 pr-2 text-sm font-semibold text-white transition-colors duration-500 hover:bg-[#004385] active:scale-[0.98]"
        style={{ backgroundColor: C.blue }}
      >
        Book a free site visit
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1">
          <Icon name="arrow" size={18} color="#fff" stroke={1.8} />
        </span>
      </button>
    </form>
  )
}
