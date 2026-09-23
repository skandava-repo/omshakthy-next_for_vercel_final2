'use client'
// Shared "Site Links" footer block — regalia-lp.html's own
// <div class="innrfooterbox"> content, originally built inline inside
// RegaliaContent.tsx and audited link-by-link there (see that file's
// git history for the full list of fixes: Kanopus vs Canopus spelling,
// Industrial Park's real status, dropped Video Gallery/Events/four
// Property Locations with no matching listing, etc.). Pulled out into
// its own component once every individual project landing page
// (/kanopus-magha, /kanopus-mithila, /elite-grand, /elite-orchard,
// /industrial-park, /mathura, /regalia) needed the exact same, already-
// verified block — duplicating it seven times would only let them drift
// out of sync again.
//
// Now that each of those pages is real, "Ongoing Projects"/"Completed
// Projects" link straight to its own page instead of the shared
// /projects listing.
import blogPosts from '@/data/blog/summary.json'

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }

const FOOTER_BLOG_SLUGS = [
  'avadi-property-tax-online-payment',
  'chennai-or-bangalore-which-is-better',
  'stilt-parking-meaning-rules-benefits-and-legal-rights-under-rera',
  'rent-control-act-rental-agreement-rights-of-tenant-and-landlord',
  'builder-buyer-agreement-meaning-checklist-and-clauses',
  'why-real-estate-investment-is-better-than-gold-investment',
]
const footerBlogPosts = FOOTER_BLOG_SLUGS
  .map((slug) => blogPosts.find((b) => b.slug === slug))
  .filter((b): b is (typeof blogPosts)[number] => Boolean(b))
const footerCategories = Array.from(new Set(blogPosts.map((b) => b.category)))

export default function SiteLinksSection({ backgroundColor = '#F8F8F5' }: { backgroundColor?: string }) {
  return (
    <section className="px-6 md:px-16 py-20" style={{ backgroundColor, color: C.ink }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-sm font-bold uppercase mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Ongoing Projects
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { t: 'Kanopus Magha', h: '/kanopus-magha' },
              { t: 'Omshakthy Regalia', h: '/regalia' },
              { t: 'Elite Grand', h: '/elite-grand' },
            ].map((l) => (
              <li key={l.t}><a href={l.h} style={{ color: C.slate }} className="hover:opacity-70">{l.t}</a></li>
            ))}
          </ul>
          <h3 className="text-sm font-bold uppercase mt-8 mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Completed Projects
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { t: 'Omshakthy Mathura', h: '/mathura' },
              { t: 'Kanopus Mithila', h: '/kanopus-mithila' },
              { t: 'Elite Orchard', h: '/elite-orchard' },
              { t: 'Industrial Park', h: '/industrial-park' },
            ].map((l) => (
              <li key={l.t}><a href={l.h} style={{ color: C.slate }} className="hover:opacity-70">{l.t}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Other Projects
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { t: 'Residential Plots', h: '/projects' },
              { t: 'Industrial Plots', h: '/projects' },
              { t: 'Land Aggregation', h: '/about' },
            ].map((l) => (
              <li key={l.t}><a href={l.h} style={{ color: C.slate }} className="hover:opacity-70">{l.t}</a></li>
            ))}
          </ul>
          <h3 className="text-sm font-bold uppercase mt-8 mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Featured Links
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { t: 'Home', h: '/' },
              { t: 'About Us', h: '/about' },
              { t: 'Image Gallery', h: '/gallery' },
              { t: 'Testimonials', h: '/#testimonials' },
              { t: 'Contact Us', h: '/contact' },
            ].map((l) => (
              <li key={l.t}><a href={l.h} style={{ color: C.slate }} className="hover:opacity-70">{l.t}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Blogs
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {footerBlogPosts.map((b) => (
              <li key={b.slug}><a href={`/blog/${b.slug}`} style={{ color: C.slate }} className="hover:opacity-70">{b.title}</a></li>
            ))}
          </ul>
          <h3 className="text-sm font-bold uppercase mt-8 mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Knowledge Hub
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {footerCategories.map((t) => (
              <li key={t}><a href="/blog" style={{ color: C.slate }} className="hover:opacity-70">{t}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase mb-4" style={{ ...display, color: C.ink, letterSpacing: '0.06em' }}>
            Property Locations
          </h3>
          {/* These now point at the real 12 pages rebuilt at
              /buy-cmda-dtcp-plots-for-sale-chennai/* — indexed, ranking
              URLs per Balaji's Aug 2026 SEO report that previously had
              no on-site link at all (every entry here used to point at
              /projects or a generic project page instead of its own
              real page). Same real anchor text the old live site's own
              footer used (confirmed against the local site mirror). */}
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { t: 'Plots for Sale in Chennai', h: '/buy-cmda-dtcp-plots-for-sale-chennai' },
              { t: 'Residential Plots for Sale in Chennai', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-land-plots' },
              { t: 'Plots for Sale in Avadi', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-avadi' },
              { t: 'Plots for Sale in Guduvanchery', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-guduvanchery' },
              { t: 'Plots for Sale in Thirumullaivoyal', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-thirumullaivoyal' },
              { t: 'Plots for Sale in Paruthipattu', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-paruthipattu' },
              { t: 'Plots for Sale in Vandalur', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-vandalur' },
              { t: 'Plots for Sale in Tambaram', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-tambaram' },
              { t: 'Plots for Sale in Maraimalai Nagar', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-maraimalai-nagar' },
              { t: 'Plots for Sale in Ambattur', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-ambattur' },
              { t: 'Plots for Sale in GST Road', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-gst-road' },
              { t: 'Plots for Sale in Poonamallee', h: '/buy-cmda-dtcp-plots-for-sale-chennai/residential-plots-for-sale-near-poonamallee' },
            ].map((l) => (
              <li key={l.t}><a href={l.h} style={{ color: C.slate }} className="hover:opacity-70">{l.t}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
