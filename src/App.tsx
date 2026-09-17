import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ParticleEngine } from './particles/ParticleEngine'
import {
  MOTION_CONFIG,
  wordCloseDelay,
  wordHandoffDelay,
} from './particles/motionConfig'
import { WordMark } from './geometry/WordMark'
import './App.css'

type Phase = 'closed' | 'opening' | 'menu' | 'closing' | 'leaving' | 'listen'

const MENU_ITEMS = ['LISTEN', 'DRINK', 'EXPLORE', 'JOURNAL'] as const

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [phase, setPhase] = useState<Phase>('closed')
  const [listenReady, setListenReady] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const engine = new ParticleEngine(canvasRef.current, { reduceMotion })
    engineRef.current = engine
    const frame = requestAnimationFrame(() => engine.showClosed())

    return () => {
      cancelAnimationFrame(frame)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (phase === 'menu' || phase === 'opening')) {
        setPhase('closing')
        engineRef.current?.closeMenu(() => {
          setPhase('closed')
          toggleRef.current?.focus()
        })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const openMenu = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    engineRef.current?.openMenu(() => setPhase('menu'))
  }

  const closeMenu = () => {
    if (phase !== 'menu' && phase !== 'opening') return
    setPhase('closing')
    engineRef.current?.closeMenu(() => {
      setPhase('closed')
      toggleRef.current?.focus()
    })
  }

  const handleToggle = () => {
    if (phase === 'closed') openMenu()
    else if (phase === 'menu') closeMenu()
  }

  const openListen = () => {
    if (phase !== 'menu') return
    setPhase('leaving')
    engineRef.current?.departListen(() => {
      setListenReady(false)
      setPhase('listen')
      requestAnimationFrame(() => {
        engineRef.current?.enterListen(() => setListenReady(true))
      })
    })
  }

  const menuIsInteractive = phase === 'menu'
  const menuIsOpen = phase === 'opening' || phase === 'menu' || phase === 'closing' || phase === 'leaving'

  return (
    <main
      className={`experience scene--${phase}${listenReady ? ' listen-is-ready' : ''}`}
      style={{
        '--word-svg-crossfade-duration': `${MOTION_CONFIG.wordSvgCrossfadeDuration}ms`,
        '--menu-word-dissolve-duration': `${MOTION_CONFIG.menuWordDissolveDuration}ms`,
        '--clicked-item-dissolve-duration': `${MOTION_CONFIG.clickedItemDissolveDuration}ms`,
      } as CSSProperties}
    >
      <div className="ambient-light" aria-hidden="true" />
      <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />

      <header className="site-header">
        <div className="monogram" aria-label="Atomic Kissa">
          <span className="monogram__rule" />
          <span>AK</span>
        </div>

        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={menuIsOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuIsOpen}
          aria-controls="main-menu"
          disabled={phase === 'opening' || phase === 'closing' || phase === 'leaving' || phase === 'listen'}
          onClick={handleToggle}
        >
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <g className="geometry-only">
              <path data-particle-target="hamburger" d="M12 17 H36 M12 24 H36 M12 31 H36" />
              <path data-particle-target="close" d="M15 15 L33 33 M33 15 L15 33" />
            </g>
          </svg>
        </button>
      </header>

      <nav id="main-menu" className="menu" aria-label="Primary" aria-hidden={!menuIsOpen}>
        {MENU_ITEMS.map((item, index) => (
          <button
            className="menu-item"
            type="button"
            key={item}
            data-word={item.toLowerCase()}
            style={{
              '--item-index': index,
              '--word-handoff-delay': `${wordHandoffDelay(index)}ms`,
              '--word-close-delay': `${wordCloseDelay(index, MENU_ITEMS.length)}ms`,
            } as CSSProperties}
            tabIndex={menuIsInteractive ? 0 : -1}
            aria-disabled={item !== 'LISTEN'}
            onClick={item === 'LISTEN' ? openListen : undefined}
          >
            <span className="visually-hidden">
              {item}{item !== 'LISTEN' ? ' — concept only' : ''}
            </span>
            <WordMark word={item} target={item.toLowerCase()} />
          </button>
        ))}
      </nav>

      <section className="listen-scene" aria-hidden={phase !== 'listen'}>
        <div className="record-geometry" aria-hidden="true">
          <svg viewBox="0 0 260 260">
            <g className="geometry-only">
              <circle data-particle-target="record" cx="130" cy="130" r="102" />
              <circle data-particle-target="record" cx="130" cy="130" r="36" />
              <circle data-particle-target="record" cx="130" cy="130" r="5" />
            </g>
          </svg>
        </div>
        <div className="selection-copy">
          <p className="selection-kicker">Atomic Kissa presents</p>
          <h1>TONIGHT’S SELECTION</h1>
          <span className="selection-rule" aria-hidden="true" />
        </div>
      </section>

      <footer className="site-signature" aria-hidden="true">
        <span>ATOMIC KISSA</span>
        <span lang="ja">原子喫茶</span>
      </footer>
      <div className="corner-coordinate" aria-hidden="true">35.6762° N · 139.6503° E</div>
    </main>
  )
}

export default App
