'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Header.css'

const navLinksLeft = [
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/image-gallery' },
]

const navLinksRight: { name: string; path: string; children?: { name: string; path: string }[] }[] = [
  {
    name: 'Resources',
    path: '/blog',
    children: [
      { name: 'Blog', path: '/blog' },
      { name: 'EMI Calculator', path: '/emi-calculator' },
      { name: 'Home Loan', path: '/homeloan' },
      { name: 'Buying Guide', path: '/buying-guide' },
      { name: 'Land Aggregation', path: '/land-aggregation-projects-chennai' },
      { name: 'Events', path: '/events' },
    ],
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
  const [resourcesOpen, setResourcesOpen] = useState(false)
  // Below 1024px .site-nav__links, .site-nav__phone and .site-nav__cta
  // all disappear via CSS with nothing left to replace them — this panel
  // is that replacement. Same content as the desktop nav (both link
  // lists flattened, Resources' children included, phone + CTA), styled
  // to match .site-nav__dropdown's own dark frosted-glass look rather
  // than inventing a new visual language.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = { pathname: usePathname() }
  const isHome = location.pathname === '/'

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

      const nav = document.querySelector('.site-nav__inner') as HTMLElement
      if (nav) {
        nav.style.transition = 'padding 0.5s ease'
        // Left padding fixed at 15px; right padding stays wide/compact per section
        nav.style.paddingLeft = '15px'
        if (currentSection >= 1) {
          nav.style.paddingRight = '90px'
        } else {
          nav.style.paddingRight = '90px'
        }
      }
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
      const sections = document.querySelectorAll('[data-header-theme]')
      sections.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= 80 && r.bottom >= 0) {
          setTheme(el.getAttribute('data-header-theme') || '')
        }
      })
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
      <nav className={`site-nav ${scrolled || solid ? 'site-nav--scrolled' : ''} ${theme ? `site-nav--${theme}` : ''}`}>
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
              {navLinksLeft.map((link, i) => (
                <li key={link.name} className="site-nav__item">
                  <Link
                    href={link.path}
                    className="site-nav__link"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="site-nav__links">
              {navLinksRight.map((link, i) =>
                link.children ? (
                  <li
                    key={link.name}
                    className="site-nav__item site-nav__item--dropdown"
                    onMouseEnter={() => setResourcesOpen(true)}
                    onMouseLeave={() => setResourcesOpen(false)}
                  >
                    <button
                      type="button"
                      className="site-nav__link site-nav__link--dropdown"
                      style={{ animationDelay: `${(i + 3) * 0.1}s` }}
                      onClick={() => setResourcesOpen((v) => !v)}
                      aria-expanded={resourcesOpen}
                    >
                      <span>{link.name}</span>
                    </button>
                    {resourcesOpen && (
                      <ul className="site-nav__dropdown">
                        {link.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.path}
                              className="site-nav__dropdown-link"
                              onClick={() => setResourcesOpen(false)}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={link.name} className="site-nav__item">
                    <Link
                      href={link.path}
                      className="site-nav__link"
                      style={{ animationDelay: `${(i + 3) * 0.1}s` }}
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
            {navLinksLeft.map((link) => (
              <li key={link.name}>
                <Link href={link.path} onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              </li>
            ))}
            {navLinksRight.map((link) =>
              link.children ? (
                <li key={link.name} className="mobile-nav__group">
                  <span className="mobile-nav__group-label">{link.name}</span>
                  <ul>
                    {link.children.map((child) => (
                      <li key={child.name}>
                        <Link href={child.path} onClick={() => setMobileMenuOpen(false)}>
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.name}>
                  <Link href={link.path} onClick={() => setMobileMenuOpen(false)}>
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
