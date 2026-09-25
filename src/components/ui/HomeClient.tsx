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
        {/* Desktop: snap-scroll (one wheel tick = one section) all the
            way through What We Do; everything after that is normal
            free-flow scroll — see PageController's `released` state
            for the handoff. WhatWeDoCloneContent takes
            TrustedPartnersSection's old spot as the last slide here —
            same snap mechanism (this component's wheel handling), not
            a CSS-only scroll-snap substitute (that was tried and
            didn't behave the same way; see git history).
            TrustedPartnersSection itself is preserved on its own at
            /what-we-do8 per explicit request, not discarded.

            Mobile/tablet: only HeroSlider stays snap-scrolled — see
            freeFlowFrom below.

            freeFlowFrom={1}: below PageController's own mobile/tablet
            breakpoint, everything after HeroSlider stops being pinned/
            wheel-jacked and renders as plain stacked content instead.

            LeadersSection/TestimonialsSection/WhatWeDoCloneContent
            (3-5): each of their own CSS deliberately grows taller than
            100vh once stacked at tablet widths (confirmed live at iPad
            Air's 820px: WhatWeDoCloneContent alone had ~1970px of real
            content silently clipped to 870px and permanently
            unreachable, since .page-controller__section's forced
            height:100vh + overflow:hidden had no matching override).

            PropertyGrid (1) has the same clipping bug for a different
            reason: it's a hover-to-expand accordion (desktop-mouse-only
            — a touch tap has no hover-equivalent), and confirmed live
            at 410px width, the active card's flex-grow:99 still fully
            applied even stacked into a column, growing to its own
            photo's natural ~1472px height while the other 5 collapsed
            to unreadable 15px slivers — with the excess clipped the
            same way. PropertyGrid.css now gives every card a fixed,
            equal height and always shows name/price at this breakpoint
            (was hidden until .active, i.e. never, on touch) instead of
            relying on the expand mechanic at all — see its own comment.

            CinematicTimeline (2) doesn't have either problem — it's a
            self-contained height:100vh slider, not affected by
            anything stacking taller — but freeFlowFrom is a single
            contiguous cutoff, so it comes along since it sits between
            PropertyGrid and LeadersSection. That's fine: its own
            wheel-driven milestone stepping already has an independent
            tap-to-jump fallback (.ct-seg buttons), so it isn't stranded
            by no longer being wheel-pinned either. */}
        <PageController freeFlowFrom={1}>
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
