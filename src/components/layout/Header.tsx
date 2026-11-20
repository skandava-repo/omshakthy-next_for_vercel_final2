'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Header.css'

// No icons — a stroke-icon-in-a-circle per row read as generic-corporate
// (roughly the same complaint as the flat list it replaced, just with
// icons added). Each row gets a plain numeral instead — 01 through 06,
// thin Fraunces serif — closer to how an actual fine-press book or
// gallery catalogue numbers its entries than a UI icon set. Doesn't need
// data of its own; the index into this array (see the .map below) IS
// the number, so nothing to keep in sync if entries get reordered.
type ResourceChild = { name: string; path: string; desc: string }
// Each dropdown's own right-hand feature card — was hardcoded to
// Resources' one real photo/stat/link directly in the JSX; pulled out
// here so a second dropdown (Locations, below) can have its own real
// feature card using the exact same dropdown markup/CSS, nothing new.
type DropdownFeature = { image: string; eyebrow: string; title: string; href: string }
type NavLink = { name: string; path: string; children?: ResourceChild[]; feature?: DropdownFeature }

// Was a plain link to /projects — prod's own nav has Projects as a
// dropdown (ongoing/upcoming/completed/land aggregation/industrial
// park each their own direct entry, confirmed against the real site
// mirror), none of which had a nav path here at all even though every
// one of these is a real, indexed page. Flagged back by the client/
// Adglobe team as "navigation is missing priority pages" — this is
// what that meant, not a vague note.
const navLinksLeft: NavLink[] = [
  {
    name: 'Projects',
    path: '/projects',
    children: [
      { name: 'All Projects', path: '/projects', desc: 'Every OmShakthy project, one place' },
      { name: 'Ongoing Projects', path: '/ongoing-projects', desc: 'Currently under development' },
      { name: 'Upcoming Projects', path: '/upcoming-projects', desc: 'Launching soon across Tamil Nadu' },
      { name: 'Completed Projects', path: '/completed-projects', desc: 'Delivered and handed over' },
      { name: 'Land Aggregation', path: '/land-aggregation-projects-chennai', desc: 'How we assemble large parcels' },
      { name: 'Industrial Park', path: '/industrial-park', desc: 'Industrial land in Thirumudivakkam' },
    ],
    feature: {
      image: '/timeline-2024.webp',
      eyebrow: '5,000+ Acres Aggregated',
      title: 'See Our Projects',
      href: '/projects',
    },
  },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/image-gallery' },
]

const navLinksRight: NavLink[] = [
  {
    // Fixes a real gap: the 12 real /buy-cmda-dtcp-plots-for-sale-chennai/*
    // location pages (this site's actual money pages) had no nav entry
    // anywhere — Adglobe's Nov 2026 audit flagged "no navigation for city
    // pages". Was capped at 6 slots assuming the dropdown grid was a fixed
    // 2x3 shape — it isn't (`.site-nav__dropdown-grid` is 2 explicit
    // columns, implicit/auto rows, confirmed in Header.css), so there's no
    // layout reason to drop 6 of 12 real pages from nav. All of them now.
    name: 'Locations',
    path: '/buy-cmda-dtcp-plots-for-sale-chennai',
    children: [
      { name: 'All Locations', path: '/buy-cmda-dtcp-plots-for-sale-chennai', desc: 'CMDA & DTCP approved plots across Chennai' },
      { name: 'Avadi', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-avadi', desc: 'Plots near Avadi Railway Station' },
      { name: 'Guduvanchery', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-guduvanchery', desc: "Chennai's fastest-growing suburb" },
      { name: 'Tambaram', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-tambaram', desc: 'East & West Tambaram plots' },
      { name: 'GST Road', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-gst-road', desc: "South Chennai's growth corridor" },
      { name: 'Poonamallee', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-poonamallee', desc: 'Near Chennai-Bangalore Highway' },
      { name: 'Thirumullaivoyal', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-thirumullaivoyal', desc: 'Close to Avadi & Ambattur' },
      { name: 'Paruthipattu', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-paruthipattu', desc: 'Near Avadi, off the GST corridor' },
      { name: 'Vandalur', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-vandalur', desc: 'Near Vandalur Zoo & GST Road' },
      { name: 'Maraimalai Nagar', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-maraimalai-nagar', desc: 'South Chennai industrial corridor' },
      { name: 'Ambattur', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-ambattur', desc: 'Established industrial suburb' },
      { name: 'Chrompet', path: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-chrompet', desc: 'Well-connected South Chennai suburb' },
    ],
    feature: {
      image: '/canopus-magha.webp',
      eyebrow: 'CMDA & DTCP Approved',
      title: 'Explore All Locations',
      href: '/buy-cmda-dtcp-plots-for-sale-chennai',
    },
  },
  {
    name: 'Resources',
    path: '/blog',
    children: [
      { name: 'Blog', path: '/blog', desc: 'Insights and updates from the field' },
      { name: 'EMI Calculator', path: '/emi-calculator', desc: 'Estimate your monthly payments' },
      { name: 'Home Loan', path: '/homeloan', desc: 'Financing options and partner banks' },
      { name: 'Buying Guide', path: '/buying-guide', desc: 'What to know before you invest' },
      { name: 'Land Aggregation', path: '/land-aggregation-projects-chennai', desc: 'How we assemble large parcels' },
      { name: 'Events', path: '/events', desc: 'Site visits, launches and meetups' },
    ],
    feature: {
      image: '/timeline-2024.webp',
      eyebrow: '5,000+ Acres Aggregated',
      title: 'See Our Projects',
      href: '/projects',
    },
  },
  { name: 'Contact', path: '/contact' },
]

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [solid, setSolid] = useState(false)
  // Which data-header-theme value the currently-active section declares —
  // '' (default gradient/dark), 'light' (paper sections), or 'solid-blue'
  // (flat brand blue, no gradient — currently just Leadership).
  const [theme, setTheme] = useState('')
  // Was a single resourcesOpen boolean back when Resources was the only
  // dropdown — now tracks which dropdown (by name) is open, since
  // Locations is a second one using the exact same markup/CSS.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  // Was hover-to-open, patched twice trying to fix a dropdown closing
  // mid-hover (a delay cancelled on re-entry, then handlers wired onto
  // the panel too) — both real fixes for that specific symptom, but the
  // actual report underneath it was broader: resting the cursor
  // anywhere near the header could pop open the WRONG dropdown. Cause:
  // each trigger's invisible hover-bridge/panel is a fixed 820px wide,
  // centered on ITS OWN button — for buttons that aren't centered in a
  // wide nav bar, that 820px sprawls well past the button itself and
  // overlaps neighboring triggers' own hover zones, so hovering near
  // Locations or Gallery could land inside Resources' bridge instead.
  // No amount of timing-fixing solves that; the geometry itself is the
  // problem. Click-to-open sidesteps it entirely — a click only ever
  // targets the one real button under the cursor, no bridge, no
  // geometry to get wrong. Closes on click-away (see the effect below)
  // or by clicking the same button again (the existing toggle onClick
  // already did this).
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!openDropdown) return
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [openDropdown])
  // Below 1024px .site-nav__links, .site-nav__phone and .site-nav__cta
  // all disappear via CSS with nothing left to replace them — this panel
  // is that replacement. Same content as the desktop nav (both link
  // lists flattened, Resources' children included, phone + CTA), styled
  // to match .site-nav__dropdown's own dark frosted-glass look rather
  // than inventing a new visual language.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = { pathname: usePathname() }
  const isHome = location.pathname === '/'
  // Exact match, or nested under it with a trailing slash (not a bare
  // startsWith — that would make "/" match every route). Only /blog
  // actually has a dynamic child route today (/blog/[slug]) so this
  // only ever matters there in practice, but it's the correct general
  // check rather than one hardcoded to "Blog specifically" — a future
  // /projects/[slug] would get the same "still highlighted on the
  // detail page" behavior for free instead of silently not working.
  const isActive = (path: string) =>
    location.pathname === path || location.pathname?.startsWith(`${path}/`)

  useEffect(() => {
    document.body.style.overflowY = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflowY = ''
    }
  }, [mobileMenuOpen])

  // Close on route change (Link clicks inside the panel already call
  // this directly, but this also covers back/forward navigation).
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // On content pages the header is fixed and transparent; make it solid once
  // the user scrolls past the hero so page content doesn't collide with the nav.
  useEffect(() => {
    if (isHome) {
      setSolid(false)
      return
    }
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome, location.pathname])

  useEffect(() => {
    const updateNav = () => {
      // PageController: Hero=0, Property=1, Timeline=2
      const currentSection = (window as any).__pageControllerCurrentSection

      setScrolled(currentSection >= 1)

      // Most sections are dark/photo-backed, so the header defaults to white
      // text on a dark scrim. A section can opt into a light background by
      // tagging itself data-header-theme="light" (e.g. PriceTrends' paper
      // theme) — read that off whichever section is currently active rather
      // than hardcoding an index, so it keeps working if section order changes.
      const sections = document.querySelectorAll('.page-controller__section')
      const activeSection = sections[currentSection]
      const themedEl = activeSection?.querySelector('[data-header-theme]')
      setTheme(themedEl?.getAttribute('data-header-theme') || '')

      // .site-nav__inner padding now lives in Header.css (desktop 15px/90px,
      // tighter on mobile). It used to be set inline here, which overrode
      // any responsive CSS and left large empty gutters on phones.
    }

    updateNav()
    // PageController dispatches this event on section change
    window.addEventListener('pageSectionChange', updateNav)
    return () => window.removeEventListener('pageSectionChange', updateNav)
  }, [])

  // The above only tracks theme while PageController owns the scroll (via
  // pageSectionChange). Once it hands off to native scroll — past the last
  // snapped section — currentSection stops changing, so that effect goes
  // stale. This picks theme detection back up from actual scroll position
  // for whatever's now in normal document flow (also tagged
  // data-header-theme="light" where relevant, e.g. TrustedPartners/Spotlight).
  useEffect(() => {
    const checkThemeByScroll = () => {
      if (window.scrollY <= 0) return // still in PageController's domain
      // Was: only ever called setTheme when a themed section currently
      // overlapped the header, and did nothing otherwise — so once the
      // header scrolled PAST a data-header-theme="light" section into a
      // plain one further down the page (there's always a gap between
      // these on a normal content page — a hero, a dark band, a project
      // grid — nothing on /about or /projects tags every single
      // section), theme just stayed stuck at whatever it was last set
      // to. The header kept showing that section's paper scrim instead
      // of falling back to the real default gradient for the rest of
      // the page — confirmed live: exactly the "no gradient partway
      // down /about and /projects" bug. Computing the match first and
      // always calling setTheme once with the result (falling back to
      // '' when nothing currently overlaps) fixes that — same one-pass
      // "last match wins" behavior when multiple themed sections are
      // adjacent, but now correctly resets when none do.
      const sections = document.querySelectorAll('[data-header-theme]')
      let matched = ''
      sections.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= 80 && r.bottom >= 0) {
          matched = el.getAttribute('data-header-theme') || ''
        }
      })
      setTheme(matched)
    }
    window.addEventListener('scroll', checkThemeByScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkThemeByScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  return (
    <>
      <nav ref={navRef} className={`site-nav ${scrolled || solid ? 'site-nav--scrolled' : ''} ${theme ? `site-nav--${theme}` : ''}`}>
        <div className="site-nav__inner">
          {/* Logo — left aligned */}
          <Link href="/" className="site-nav__logo">
            <img
              src="/omshakthy-logo.webp"
              alt="OmShakthy Homes"
              className="site-nav__logo-img site-nav__logo-img--light"
            />
            <img
              src="/omshakthy-logo.webp"
              alt="OmShakthy Homes"
              className="site-nav__logo-img site-nav__logo-img--dark"
            />
          </Link>

          {/* Center nav: both link lists, pushed to the middle of the header
              (flex:1 + justify-content:center) instead of bunched next to
              the phone/CTA on the right. */}
          <div className="site-nav__center">
            <ul className="site-nav__links">
              {navLinksLeft.map((link, i) =>
                link.children ? (
                  <li
                    key={link.name}
                    className="site-nav__item site-nav__item--dropdown"
                  >
                    <button
                      type="button"
                      className={`site-nav__link site-nav__link--dropdown${
                        link.children.some((c) => isActive(c.path)) ? ' site-nav__link--active' : ''
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                      onClick={() => setOpenDropdown((v) => (v === link.name ? null : link.name))}
                      aria-expanded={openDropdown === link.name}
                    >
                      <span>{link.name}</span>
                    </button>
                    {openDropdown === link.name && (
                      <div
                        className="site-nav__dropdown"
                      >
                        <div className="site-nav__dropdown-main">
                          <span className="site-nav__dropdown-eyebrow">
                            <span className="site-nav__dropdown-eyebrow-line" />
                            {link.name}
                          </span>
                          <ul className="site-nav__dropdown-grid">
                            {link.children.map((child, ci) => (
                              <li
                                key={child.name}
                                className="site-nav__dropdown-item"
                                style={{ animationDelay: `${0.05 + ci * 0.05}s` }}
                              >
                                <Link
                                  href={child.path}
                                  className={`site-nav__dropdown-link${
                                    isActive(child.path) ? ' site-nav__dropdown-link--active' : ''
                                  }`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span className="site-nav__dropdown-number" aria-hidden="true">
                                    {String(ci + 1).padStart(2, '0')}
                                  </span>
                                  <span className="site-nav__dropdown-text">
                                    <span className="site-nav__dropdown-title">{child.name}</span>
                                    <span className="site-nav__dropdown-desc">{child.desc}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {link.feature && (
                          <Link
                            href={link.feature.href}
                            className="site-nav__dropdown-feature"
                            style={{ animationDelay: '0.4s' }}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={link.feature.image} alt="" aria-hidden="true" />
                            <span className="site-nav__dropdown-feature-scrim" aria-hidden="true" />
                            <span className="site-nav__dropdown-feature-content">
                              <span className="site-nav__dropdown-feature-eyebrow">{link.feature.eyebrow}</span>
                              <span className="site-nav__dropdown-feature-title">{link.feature.title}</span>
                              <span className="site-nav__dropdown-feature-cta">Explore &rarr;</span>
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.name} className="site-nav__item">
                    <Link
                      href={link.path}
                      className={`site-nav__link${isActive(link.path) ? ' site-nav__link--active' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
            <ul className="site-nav__links">
              {navLinksRight.map((link, i) =>
                link.children ? (
                  <li
                    key={link.name}
                    className="site-nav__item site-nav__item--dropdown"
                  >
                    <button
                      type="button"
                      className={`site-nav__link site-nav__link--dropdown${
                        link.children.some((c) => isActive(c.path)) ? ' site-nav__link--active' : ''
                      }`}
                      style={{ animationDelay: `${(i + 3) * 0.1}s` }}
                      onClick={() => setOpenDropdown((v) => (v === link.name ? null : link.name))}
                      aria-expanded={openDropdown === link.name}
                    >
                      <span>{link.name}</span>
                    </button>
                    {openDropdown === link.name && (
                      <div
                        className="site-nav__dropdown"
                      >
                        <div className="site-nav__dropdown-main">
                          <span className="site-nav__dropdown-eyebrow">
                            <span className="site-nav__dropdown-eyebrow-line" />
                            {link.name}
                          </span>
                          <ul className="site-nav__dropdown-grid">
                            {link.children.map((child, ci) => (
                              <li
                                key={child.name}
                                className="site-nav__dropdown-item"
                                style={{ animationDelay: `${0.05 + ci * 0.05}s` }}
                              >
                                <Link
                                  href={child.path}
                                  className={`site-nav__dropdown-link${
                                    isActive(child.path) ? ' site-nav__dropdown-link--active' : ''
                                  }`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span className="site-nav__dropdown-number" aria-hidden="true">
                                    {String(ci + 1).padStart(2, '0')}
                                  </span>
                                  <span className="site-nav__dropdown-text">
                                    <span className="site-nav__dropdown-title">{child.name}</span>
                                    <span className="site-nav__dropdown-desc">{child.desc}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* The link grid alone read as flat/generic next to how
                            photo-heavy every other part of this site is
                            (Hero, LeadersSection, WhatWeDoCloneContent all lean
                            on real photography, not just icons+type). One real
                            project photo per dropdown (each item's own
                            `feature`, e.g. Resources' same "5,000+ acres" figure
                            already used in WhatWeDoCloneContent's stat card)
                            ties this menu back into the site's own actual
                            content instead of being a generic nav afterthought. */}
                        {link.feature && (
                          <Link
                            href={link.feature.href}
                            className="site-nav__dropdown-feature"
                            style={{ animationDelay: '0.4s' }}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={link.feature.image} alt="" aria-hidden="true" />
                            <span className="site-nav__dropdown-feature-scrim" aria-hidden="true" />
                            <span className="site-nav__dropdown-feature-content">
                              <span className="site-nav__dropdown-feature-eyebrow">{link.feature.eyebrow}</span>
                              <span className="site-nav__dropdown-feature-title">{link.feature.title}</span>
                              <span className="site-nav__dropdown-feature-cta">Explore &rarr;</span>
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.name} className="site-nav__item">
                    <Link
                      href={link.path}
                      className={`site-nav__link${isActive(link.path) ? ' site-nav__link--active' : ''}`}
                      style={{ animationDelay: `${(i + 3) * 0.1}s` }}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Right: phone + CTA, kept separate from the (now centered) links */}
          <div className="site-nav__actions">
            <a href="tel:04440303040" className="site-nav__phone">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                <path
                  fill="currentColor"
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
                />
              </svg>
              <span>044 4030 3040</span>
            </a>
            <Link href="/contact" className="site-nav__cta">
              Book Site Visit
            </Link>

            {/* Hamburger — CSS hides this above 1024px (same breakpoint
                .site-nav__links disappears at) and shows .site-nav__links
                instead, so exactly one of the two is ever visible. */}
            <button
              type="button"
              className={`site-nav__burger ${mobileMenuOpen ? 'site-nav__burger--open' : ''}`}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav panel — same content as the desktop center nav +
          phone + CTA, styled after .site-nav__dropdown's own dark
          frosted-glass look rather than a new visual language. Only
          reachable below 1024px (the hamburger that opens it doesn't
          render above that width either). */}
      <div
        id="mobile-nav-panel"
        className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav--open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-nav__backdrop" onClick={() => setMobileMenuOpen(false)} />
        <div className="mobile-nav__panel">
          <ul className="mobile-nav__links">
            {navLinksLeft.map((link) =>
              link.children ? (
                <li key={link.name} className="mobile-nav__group">
                  <span className="mobile-nav__group-label">{link.name}</span>
                  <ul>
                    {link.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.path}
                          className={isActive(child.path) ? 'mobile-nav__link--active' : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={isActive(link.path) ? 'mobile-nav__link--active' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            )}
            {navLinksRight.map((link) =>
              link.children ? (
                <li key={link.name} className="mobile-nav__group">
                  <span className="mobile-nav__group-label">{link.name}</span>
                  <ul>
                    {link.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.path}
                          className={isActive(child.path) ? 'mobile-nav__link--active' : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={isActive(link.path) ? 'mobile-nav__link--active' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            )}
          </ul>
          <div className="mobile-nav__footer">
            <a href="tel:04440303040" className="mobile-nav__phone">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                <path
                  fill="currentColor"
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
                />
              </svg>
              <span>044 4030 3040</span>
            </a>
            <Link href="/contact" className="mobile-nav__cta" onClick={() => setMobileMenuOpen(false)}>
              Book Site Visit
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
