'use client'
import { useState, useEffect } from 'react'
import './HeroSlider.css'

// mobileImage (optional): portrait-cropped variant served via <picture>,
// so phones get a proper vertical crop instead of a squeezed landscape
// photo. Was width-only (max-width: 768px) — same bug as every other
// breakpoint in this codebase: iPad portrait doesn't reliably report
// under 768px, so it kept falling through to the desktop crop (user-
// reported live: "why i see the desktop images in the portrait mode").
// (pointer: coarse) and (orientation: portrait) adds the real signal —
// any touch device held in portrait gets the mobile crop regardless of
// reported width — without touching desktop or landscape.
const MOBILE_MEDIA = '(max-width: 768px), (pointer: coarse) and (orientation: portrait)'

const slides: { image: string; mobileImage?: string; title: string }[] = [
  { image: '/hero-new-3.webp', mobileImage: '/mobile/hero-new-3.webp', title: 'OmShakthy Regalia' },
  { image: '/hero-slide-9.webp', title: 'Elite Apartments' },
  // Was mislabeled 'Elite Grand' — this is the real "OMSHAKTHY Elite"
  // gate photo, which is Elite Phase 1's (a different, older project;
  // Elite Grand has its own real photo elsewhere in this rebuild).
  { image: '/hero-slide-3.webp', title: 'OmShakthy Elite Phase 1' },
  { image: '/hero-slide-1.webp', title: 'OmShakthy Santha' },
  { image: '/hero-slide-8.webp', title: 'Elite Apartments' },
  { image: '/hero-slide-2.webp', title: 'Kanopus Magha' },
  { image: '/hero-new-2.webp', title: 'Premium Living' },
  // Three new upcoming MSB (Multi-Storey Building) projects — real
  // renders provided directly, same images used for their /projects
  // cards (projectsData.ts). Each already has its own baked-in title/
  // stats bar across the TOP of the frame, not the bottom, so it
  // doesn't collide with this slider's own caption overlay (bottom:
  // 14%, per HeroSlider.css) the way an infographic with bottom-baked
  // text would.
  { image: '/msb-paruthipattu.webp', title: 'Paruthipattu' },
  { image: '/msb-coimbatore.webp', title: 'Coimbatore' },
  { image: '/msb-madurai.webp', title: 'Madurai' },
]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [started, setStarted] = useState(false)

  // Wait for intro to complete before starting the slideshow
  useEffect(() => {
    // If intro is already gone (e.g. hot reload), start immediately
    if (!document.querySelector('.intro-section')) {
      setStarted(true)
      return
    }
    const onIntroComplete = () => setStarted(true)
    window.addEventListener('introComplete', onIntroComplete)
    return () => window.removeEventListener('introComplete', onIntroComplete)
  }, [])

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => {
      setPrev(current)
      setCurrent((c) => (c + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [current, started])

  const nextIndex = (current + 1) % slides.length

  return (
    <section className="hero-slider" id="hero" data-snap="true">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slider__slide ${
            i === current ? 'hero-slider__slide--active' : ''
          } ${i === prev ? 'hero-slider__slide--prev' : ''}`}
        >
          <picture>
            {slide.mobileImage && <source media={MOBILE_MEDIA} srcSet={slide.mobileImage} />}
            <img src={slide.image} alt={slide.title} style={{ objectPosition: ['/hero-slide-9.webp', '/hero-slide-8.webp'].includes(slide.image) ? 'center 35%' : 'center 20%' }} />
          </picture>
        </div>
      ))}

      {/* Overlay */}
      <div className="hero-slider__overlay" />

      {/* Content */}
      {slides[current].title && (
        <div className="hero-slider__content" key={current}>
          <h1 className="hero-slider__title">{slides[current].title}</h1>
          <a href="/projects" className="hero-slider__cta">Explore Projects</a>
        </div>
      )}

      {/* Next slide thumbnail — bottom right */}
      <div
        className="hero-slider__thumbnail"
        onClick={() => {
          setPrev(current)
          setCurrent(nextIndex)
        }}
      >
        <img src={slides[nextIndex].image} alt="Next" />
      </div>

      {/* Dots */}
      <div className="hero-slider__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-slider__dot ${i === current ? 'hero-slider__dot--active' : ''}`}
            onClick={() => { setPrev(current); setCurrent(i) }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider
