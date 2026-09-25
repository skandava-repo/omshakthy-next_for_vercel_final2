'use client'

import IntroSection from '@/components/ui/IntroSection'
import HeroSlider from '@/components/ui/HeroSlider'
import PropertyGrid from '@/components/ui/PropertyGrid'
import CinematicTimeline from '@/components/ui/CinematicTimeline'
import MilestoneSection from '@/components/ui/MilestoneSection'
import LeadersSection from '@/components/ui/LeadersSection'
import TestimonialsSection from '@/components/ui/TestimonialsSection'
import WhatWeDoCloneContent from '@/components/ui/WhatWeDoCloneContent'
import FinancialPartnersSection from '@/components/ui/FinancialPartnersSection'
import SpotlightSection from '@/components/ui/SpotlightSection'
import PageController from '@/components/ui/PageController'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useState, useEffect } from 'react'

export default function HomeClient() {
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    const checkIntro = () => {
      const introEl = document.querySelector('.intro-section')
      setShowHeader(!introEl)
    }
    checkIntro()
    const observer = new MutationObserver(checkIntro)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {showHeader && <Header />}
      <main>
        <IntroSection />
        {/* Snap-scroll (one wheel tick = one section) through Testimonials
            AND What We Do. Everything after that is normal free-flow
            scroll — see PageController's `released` state for the
            handoff. WhatWeDoCloneContent takes TrustedPartnersSection's
            old spot as the last slide here — same snap mechanism (this
            component's wheel handling), not a CSS-only scroll-snap
            substitute (that was tried and didn't behave the same way;
            see git history). TrustedPartnersSection itself is preserved
            on its own at /what-we-do8 per explicit request, not
            discarded.

            freeFlowFrom={3}: below PageController's own mobile/tablet
            breakpoint, LeadersSection/TestimonialsSection/
            WhatWeDoCloneContent (indices 3-5) stop being pinned/wheel-
            jacked and render as plain stacked content instead — each of
            their own CSS deliberately grows taller than 100vh once
            stacked at tablet widths (confirmed live at iPad Air's
            820px: WhatWeDoCloneContent alone had ~1970px of real
            content silently clipped to 870px and permanently
            unreachable, since .page-controller__section's forced
            height:100vh + overflow:hidden had no matching override).
            HeroSlider/PropertyGrid/CinematicTimeline (0-2) stay pinned
            at every width — none of them have this problem, and
            CinematicTimeline's own wheel-driven milestone stepping
            already has an independent tap-to-jump fallback (its
            .ct-seg buttons), so it isn't stranded by staying pinned. */}
        <PageController freeFlowFrom={3}>
          <HeroSlider />
          <PropertyGrid />
          <CinematicTimeline />
          <LeadersSection />
          <TestimonialsSection />
          <WhatWeDoCloneContent />
        </PageController>
        {/* First thing native scroll reaches once the pillar gallery above
            releases — was part of TrustedPartnersSection, split out so
            that slide could dedicate its full 100vh to the gallery alone. */}
        <FinancialPartnersSection />
        <SpotlightSection />
      </main>
      <Footer />
    </>
  )
}
