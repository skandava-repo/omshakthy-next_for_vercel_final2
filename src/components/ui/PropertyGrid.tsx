'use client'
import { useState } from 'react'
import Link from 'next/link'
import './PropertyGrid.css'

interface Property {
  image: string
  name: string
  location: string
  status: string
  type: string
  price: string
  link?: string
}

// Locations + links kept in sync with ProjectsContent.tsx — see that
// file's own per-project comments for exactly what each location fix
// is sourced from (each project's own real landing page, extracted
// into src/data/projects/*.json).
const properties: Property[] = [
  {
    image: '/canopus-magha.webp',
    name: 'Kanopus Magha',
    location: 'Avadi, Chennai',
    status: 'Ongoing',
    type: 'Residential Plots',
    price: '₹25L onwards',
    link: '/canopus-magha-lp',
  },
  {
    image: '/regalia.webp',
    name: 'OmShakthy Regalia',
    location: 'Tambaram, Chennai',
    status: 'Ongoing',
    type: 'Gated Community',
    price: '₹32L onwards',
    link: '/regalia-lp',
  },
  {
    image: '/elite-grand.webp',
    name: 'Elite Grand',
    location: 'Guduvanchery, Chennai',
    status: 'Ongoing',
    type: 'Premium Plots',
    price: '₹28L onwards',
    link: '/elite-grand-lp',
  },
  {
    image: '/mathura.webp',
    name: 'OmShakthy Mathura',
    location: 'Chromepet, Chennai',
    // Status: mathura-lp's own live spec table shows a real price
    // (22.5 Lakhs), not "Sold Out" — see ProjectsContent.tsx's comment
    // on this same entry for why this is 'Ongoing' rather than 'Sold'.
    status: 'Ongoing',
    type: 'Residential Plots',
    price: '₹22.5L onwards',
    link: '/mathura-lp',
  },
  {
    image: '/property-6.webp',
    name: 'Industrial Park',
    // Location left as-is, flagged rather than guessed — see
    // ProjectsContent.tsx's comment on this same entry for why.
    location: 'Sriperumbudur, Chennai',
    // Status corrected: industrial-park-lp's own price field has never
    // been filled in (literal "XXXX" on the real site) and the page
    // still runs an active "Book a Free Site Visit" form with no
    // "Sold Out" banner — not actually sold out.
    status: 'Ongoing',
    type: 'Industrial',
    price: 'Price on Request',
    link: '/industrial-park-lp',
  },
  {
    // Same real "Santha Towers" gate photo HeroSlider.tsx/GalleryContent.tsx
    // already use — one file referenced everywhere this project appears,
    // rather than a separate copy that could drift out of sync later.
    // No dedicated page exists for it anywhere, even on the live site,
    // so no `link` here either.
    image: '/hero-slide-1.webp',
    name: 'OmShakthy Santha Towers',
    location: 'Avadi, Chennai',
    status: 'Sold',
    type: 'Residential Apartment',
    price: 'Sold Out',
  },
]

const PropertyGrid = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="property-section" id="property-grid" data-snap="true">
      <div className="property-list">
        {properties.map((property, i) => (
          <div
            key={property.name}
            className={`property-item ${activeIndex === i ? 'active' : ''} ${property.status === 'Sold' ? 'sold' : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <Link className="property-item__link" href={property.link || '/projects'}>
              <div className="property-item__img">
                <img src={property.image} alt={property.name} loading="lazy" />
                <div className="property-item__gradient" />
              </div>

              {/* Always-visible info block — status tag stays on screen
                  whether the card is collapsed or expanded, instead of the
                  old rotated label that only appeared on hover and
                  vanished the moment a card became active. */}
              <div className="property-item__info">
                <p className={`property-item__status property-item__status--${property.status === 'Sold' ? 'sold' : 'ongoing'}`}>
                  <span className="property-item__status-dot" />
                  {property.status}
                </p>
                <h4 className="property-item__name">{property.name}</h4>
                <p className="property-item__location">
                  <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                    <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.4" />
                  </svg>
                  {property.location}
                </p>

                {/* Extra detail — only when expanded, so collapsed strips
                    stay uncluttered like the reference. */}
                {property.status === 'Sold' ? (
                  <span className="property-item__badge">Sold Out</span>
                ) : (
                  <span className="property-item__price">{property.price}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* View More CTA */}
      <div className="property-cta">
        <a href="/projects" className="property-cta__btn">View More</a>
      </div>
    </section>
  )
}

export default PropertyGrid
