'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Was a plain unconditional next/script <Script> in layout.tsx — fine
// on every page except the homepage, where it auto-opened with a
// greeting right on top of the intro splash video (user report).
//
// Two things had to change, both confirmed live:
// 1. next/script's own strategy="lazyOnload" scheduling ran ahead of
//    any gate placed around it — its internal script cache/dedup
//    injected eagerly regardless of when the owning component
//    actually rendered. Replaced with a manually-created <script>
//    element, created and appended directly inside this component's
//    own effect, so there's no framework-level caching to fight.
// 2. The gate itself first used the same `.intro-section`
//    MutationObserver / querySelector check HomeClient.tsx uses to
//    show its own Header — but IntroSection renders nothing for one
//    tick on mount (it reads sessionStorage first, see its own
//    `ready` state), and that first synchronous check landed in
//    exactly that gap: ".intro-section not in the DOM" read as
//    "intro already finished" when really it just hadn't rendered
//    yet, so the chatbot fired immediately instead of waiting.
//    IntroSection already dispatches a purpose-built `introComplete`
//    event the moment it actually finishes (see its own finish()) —
//    listening for that real signal instead removes the race. The
//    one other path, intro already played earlier this session
//    (sessionStorage 'introPlayed', same flag IntroSection itself
//    checks), skips straight to injecting since no intro — and no
//    introComplete event — will happen at all in that case.
const SCRIPT_SRC = 'https://www.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js'

function injectChatbotScript() {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
  const script = document.createElement('script')
  script.src = SCRIPT_SRC
  script.setAttribute('data-bot', '23429929')
  script.async = true
  document.body.appendChild(script)
}

export default function ChatbotLoader() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome || sessionStorage.getItem('introPlayed') === '1') {
      injectChatbotScript()
      return
    }
    window.addEventListener('introComplete', injectChatbotScript, { once: true })
    return () => window.removeEventListener('introComplete', injectChatbotScript)
  }, [isHome])

  return null
}
