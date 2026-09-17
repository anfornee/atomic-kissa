import {
  listenTravelDuration,
  MOTION_CONFIG,
  wordCloseDelay,
  wordHandoffDelay,
} from './motionConfig'

type ParticleGroup = 'toggle' | 'listen' | 'drink' | 'explore' | 'journal'
type EngineMode = 'closed' | 'menu' | 'closing' | 'leaving' | 'listen'

interface Point { x: number; y: number }

interface Particle extends Point {
  group: ParticleGroup
  radius: number
  alpha: number
  seed: number
  anchor?: Point
  idlePhaseX: number
  idlePhaseY: number
  idlePeriodX: number
  idlePeriodY: number
  idleAmplitude: number
  idleActivatedAt: number
  recordPoint?: Point
  tween?: Tween
}

interface Tween {
  from: Point
  to: Point
  fromAlpha: number
  toAlpha: number
  startedAt: number
  duration: number
  bend: number
  opacityMode: 'linear' | 'iconMorph' | 'wordFormation' | 'wordDispersal' | 'clickedDissolve'
  handoffAt?: number
  handoffDuration?: number
  movementDelay?: number
  movementDuration?: number
}

const WORDS: ParticleGroup[] = ['listen', 'drink', 'explore', 'journal']
const GOLD = '222, 166, 85'
const TAU = Math.PI * 2
const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4)
const smoothstep = (value: number) => {
  const clamped = clamp01(value)
  return clamped * clamped * (3 - 2 * clamped)
}

/**
 * Canvas-only animation layer. React owns scene state; this class owns particle
 * identity and movement. Targets are sampled from the same live SVG paths that
 * become the crisp menu labels, so canvas and SVG share a coordinate system.
 */
export class ParticleEngine {
  private canvas: HTMLCanvasElement
  private options: { reduceMotion: boolean }
  private context: CanvasRenderingContext2D
  private particles: Particle[] = []
  private frameId = 0
  private completion?: () => void
  private destroyed = false
  private resizeTimer = 0
  private mode: EngineMode = 'closed'
  private recordCenter?: Point
  private recordRotationStartedAt?: number

  private resizeHandler = () => {
    window.clearTimeout(this.resizeTimer)
    this.resizeTimer = window.setTimeout(() => this.reflow(), 120)
  }

  constructor(canvas: HTMLCanvasElement, options: { reduceMotion: boolean }) {
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new Error('Canvas 2D is not supported in this browser.')
    this.canvas = canvas
    this.options = options
    this.context = context
    this.resizeCanvas()
    window.addEventListener('resize', this.resizeHandler, { passive: true })
  }

  showClosed() {
    this.mode = 'closed'
    const targets = this.sample('hamburger', MOTION_CONFIG.menuIconParticleDensity.samplingSpacing)
    this.particles = this.createParticles('toggle', targets, MOTION_CONFIG.settledParticleOpacity, targets)
    this.run()
  }

  openMenu(onComplete: () => void) {
    this.mode = 'menu'
    const now = performance.now()
    const toggle = this.group('toggle')
    const closeTargets = this.sampleAtCount('close', toggle.length)
    this.captureRenderedTogglePositions(toggle, now)

    toggle.forEach((particle, index) => {
      this.setTween(
        particle,
        closeTargets[index],
        now,
        this.options.reduceMotion ? 80 : MOTION_CONFIG.iconParticleHandoffDuration,
        MOTION_CONFIG.settledParticleOpacity,
        5,
        'iconMorph',
      )
    })

    WORDS.forEach((group, groupIndex) => {
      const targets = this.sample(group, this.particleSpacing())
      const loose = targets.map((target, pointIndex) => {
        const angle = this.noise(pointIndex * 1.71 + groupIndex * 9) * TAU
        const distance = 42 + this.noise(pointIndex * 2.37 + groupIndex) * 115
        return { x: target.x + Math.cos(angle) * distance, y: target.y + Math.sin(angle) * distance * 0.58 }
      })
      const particles = this.createParticles(group, loose, 0)
      this.particles.push(...particles)
      const handoffAt = now + wordHandoffDelay(groupIndex)

      particles.forEach((particle, index) => {
        const particleDelay = this.options.reduceMotion
          ? 0
          : this.noise(index * 3.1) * MOTION_CONFIG.wordParticleDelaySpread
        const stagger = this.options.reduceMotion ? 0 : groupIndex * MOTION_CONFIG.wordStagger
        this.setTween(
          particle,
          targets[index],
          now + stagger + particleDelay,
          this.options.reduceMotion ? 100 : MOTION_CONFIG.menuOpenWordDuration,
          0,
          18,
          'wordFormation',
          this.options.reduceMotion ? now : handoffAt,
          this.options.reduceMotion ? 100 : MOTION_CONFIG.wordSvgCrossfadeDuration,
        )
      })
    })

    this.run(onComplete)
  }

  closeMenu(onComplete?: () => void) {
    this.mode = 'closing'
    const now = performance.now()
    const toggle = this.group('toggle')
    const hamburger = this.sampleAtCount('hamburger', toggle.length)
    this.captureRenderedTogglePositions(toggle, now)

    toggle.forEach((particle, index) => {
      this.setTween(
        particle,
        hamburger[index],
        now,
        this.options.reduceMotion ? 80 : MOTION_CONFIG.iconParticleHandoffDuration,
        MOTION_CONFIG.settledParticleOpacity,
        5,
        'iconMorph',
      )
    })

    WORDS.forEach((group, groupIndex) => {
      const groupDelay = this.options.reduceMotion ? 0 : wordCloseDelay(groupIndex, WORDS.length)
      this.group(group).forEach((particle, index) => {
        const angle = this.noise(index * 4.3 + groupIndex) * TAU
        const distance = 45 + this.noise(index * 7.9 + groupIndex) * 25
        const target = {
          x: particle.x + Math.cos(angle) * distance,
          y: particle.y + Math.sin(angle) * distance * 0.62,
        }
        const duration = this.options.reduceMotion ? 120 : MOTION_CONFIG.menuCloseWordDuration
        const dissolveDuration = this.options.reduceMotion ? 100 : MOTION_CONFIG.menuWordDissolveDuration
        const movementDelay = dissolveDuration * 0.62
        this.setTween(
          particle,
          target,
          now + groupDelay,
          duration,
          0,
          14,
          'wordDispersal',
          now + groupDelay,
          dissolveDuration,
          movementDelay,
          duration - movementDelay,
        )
      })
    })

    this.run(() => {
      this.particles = this.group('toggle')
      this.mode = 'closed'
      this.run()
      onComplete?.()
    })
  }

  departListen(onComplete: () => void) {
    this.mode = 'leaving'
    this.recordRotationStartedAt = undefined
    const now = performance.now()

    WORDS.filter((word) => word !== 'listen').forEach((group) => {
      this.group(group).forEach((particle) => {
        this.setTween(particle, particle, now, this.options.reduceMotion ? 80 : 380, 0.04, 0)
      })
    })
    this.group('toggle').forEach((particle) => {
      this.setTween(particle, particle, now, this.options.reduceMotion ? 80 : 380, 0, 0)
    })
    const dissolveDuration = this.options.reduceMotion ? 120 : MOTION_CONFIG.clickedItemDissolveDuration
    const releaseDelay = this.options.reduceMotion ? 0 : MOTION_CONFIG.clickedItemReleaseDelay
    const travelDuration = this.options.reduceMotion ? 0 : listenTravelDuration()
    const holdDuration = this.options.reduceMotion ? 0 : MOTION_CONFIG.clickedItemHoldDuration
    const totalDuration = Math.max(dissolveDuration, releaseDelay + travelDuration) + holdDuration

    this.group('listen').forEach((particle, index) => {
      const angle = this.noise(index * 2.83) * TAU
      const distance = 46 + this.noise(index * 7.11) * 128
      this.setTween(
        particle,
        { x: particle.x + Math.cos(angle) * distance, y: particle.y + Math.sin(angle) * distance * 0.7 },
        now,
        totalDuration,
        MOTION_CONFIG.movingParticleOpacity,
        18,
        'clickedDissolve',
        now,
        dissolveDuration,
        releaseDelay,
        Math.max(1, travelDuration),
      )
    })
    this.run(onComplete)
  }

  enterListen(onComplete: () => void) {
    this.mode = 'listen'
    const listenParticles = this.group('listen')
    const recordTargets = this.sampleAtCount('record', listenParticles.length)
    this.recordCenter = this.centerOf(recordTargets)
    this.recordRotationStartedAt = undefined
    const now = performance.now()

    listenParticles.forEach((particle, index) => {
      particle.recordPoint = recordTargets[index]
      this.setTween(
        particle,
        recordTargets[index],
        now + (this.options.reduceMotion ? 0 : this.noise(index * 1.9) * MOTION_CONFIG.sceneFormationDelaySpread),
        this.options.reduceMotion ? 140 : MOTION_CONFIG.sceneFormationDuration,
        MOTION_CONFIG.settledParticleOpacity,
        28,
      )
    })
    this.particles = listenParticles
    this.run(() => {
      this.recordRotationStartedAt = performance.now()
      if (!this.options.reduceMotion) this.run()
      onComplete()
    })
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.frameId)
    window.clearTimeout(this.resizeTimer)
    window.removeEventListener('resize', this.resizeHandler)
  }

  private reflow() {
    this.resizeCanvas()
    if (this.mode === 'closed') return this.showClosed()

    if (this.mode === 'listen') {
      const particles = this.group('listen')
      const targets = this.sampleAtCount('record', particles.length)
      this.recordCenter = this.centerOf(targets)
      particles.forEach((particle, index) => {
        Object.assign(particle, targets[index])
        particle.recordPoint = targets[index]
      })
    } else if (this.mode === 'menu' || this.mode === 'closing') {
      const toggle = this.group('toggle')
      const toggleTarget = this.mode === 'closing' ? 'hamburger' : 'close'
      const toggleTargets = this.sampleAtCount(toggleTarget, toggle.length)
      toggle.forEach((particle, index) => {
        Object.assign(particle, toggleTargets[index])
        particle.anchor = toggleTargets[index]
      })
      WORDS.forEach((group) => {
        const particles = this.group(group)
        const targets = this.sampleAtCount(group, particles.length)
        particles.forEach((particle, index) => Object.assign(particle, targets[index]))
      })
    }
    this.draw(performance.now())
  }

  private resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, MOTION_CONFIG.dprCap)
    const width = window.innerWidth
    const height = window.innerHeight
    this.canvas.width = Math.round(width * ratio)
    this.canvas.height = Math.round(height * ratio)
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  private particleSpacing() {
    return window.innerWidth < 520
      ? MOTION_CONFIG.particleDensity.mobileSamplingSpacing
      : MOTION_CONFIG.particleDensity.desktopSamplingSpacing
  }

  private sample(target: string, spacing: number): Point[] {
    const paths = Array.from(document.querySelectorAll<SVGGeometryElement>(`[data-particle-target="${target}"]`))
    const points: Point[] = []

    paths.forEach((path) => {
      const matrix = path.getScreenCTM()
      if (!matrix) return
      const length = path.getTotalLength()
      const scale = Math.hypot(matrix.a, matrix.b)
      const count = Math.max(2, Math.ceil((length * scale) / spacing))
      for (let index = 0; index < count; index += 1) {
        const local = path.getPointAtLength((index / Math.max(1, count - 1)) * length)
        const screen = local.matrixTransform(matrix)
        points.push({ x: screen.x, y: screen.y })
      }
    })
    return points
  }

  private sampleAtCount(target: string, count: number): Point[] {
    const source = this.sample(target, MOTION_CONFIG.particleDensity.targetResamplingSpacing)
    if (!source.length) {
      return Array.from({ length: count }, () => ({ x: innerWidth / 2, y: innerHeight / 2 }))
    }
    return Array.from({ length: count }, (_, index) => source[Math.floor((index / count) * source.length)])
  }

  private createParticles(group: ParticleGroup, points: Point[], alpha: number, anchors?: Point[]): Particle[] {
    const radiusConfig = group === 'toggle'
      ? MOTION_CONFIG.menuIconParticleRadius
      : MOTION_CONFIG.particleRadius
    const radiusRange = radiusConfig.max - radiusConfig.min
    const dprAdjustment = window.devicePixelRatio > 1 ? (group === 'toggle' ? -0.02 : -0.04) : 0

    return points.map((point, index) => {
      const seed = this.noise(index * 8.13 + group.length * 3)
      const secondSeed = this.noise(index * 3.77 + group.length * 11)
      return {
        ...point,
        group,
        alpha,
        radius: Math.max(
          radiusConfig.min,
          radiusConfig.min + seed * radiusRange + dprAdjustment,
        ),
        seed,
        anchor: anchors?.[index],
        idlePhaseX: seed * TAU,
        idlePhaseY: secondSeed * TAU,
        idlePeriodX: this.lerp(MOTION_CONFIG.iconIdleMinPeriod, MOTION_CONFIG.iconIdleMaxPeriod, seed),
        idlePeriodY: this.lerp(MOTION_CONFIG.iconIdleMinPeriod, MOTION_CONFIG.iconIdleMaxPeriod, secondSeed),
        idleAmplitude: MOTION_CONFIG.iconIdleAmplitude * (0.55 + secondSeed * 0.45),
        idleActivatedAt: performance.now(),
      }
    })
  }

  private group(group: ParticleGroup) {
    return this.particles.filter((particle) => particle.group === group)
  }

  private captureRenderedTogglePositions(particles: Particle[], time: number) {
    particles.forEach((particle) => {
      const rendered = this.renderPosition(particle, time)
      particle.x = rendered.x
      particle.y = rendered.y
      particle.anchor = undefined
    })
  }

  private setTween(
    particle: Particle,
    to: Point,
    startedAt: number,
    duration: number,
    toAlpha: number,
    bend: number,
    opacityMode: Tween['opacityMode'] = 'linear',
    handoffAt?: number,
    handoffDuration?: number,
    movementDelay?: number,
    movementDuration?: number,
  ) {
    particle.tween = {
      from: { x: particle.x, y: particle.y },
      to,
      fromAlpha: particle.alpha,
      toAlpha,
      startedAt,
      duration,
      bend: (particle.seed - 0.5) * bend,
      opacityMode,
      handoffAt,
      handoffDuration,
      movementDelay,
      movementDuration,
    }
  }

  private run(onComplete?: () => void) {
    this.completion = onComplete
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(this.tick)
  }

  private tick = (time: number) => {
    if (this.destroyed) return
    let isMoving = false

    this.particles.forEach((particle) => {
      const tween = particle.tween
      if (!tween) return
      if (time < tween.startedAt) {
        isMoving = true
        return
      }

      const timelineProgress = clamp01((time - tween.startedAt) / tween.duration)
      const motionStartedAt = tween.startedAt + (tween.movementDelay ?? 0)
      const motionDuration = tween.movementDuration ?? tween.duration
      const progress = clamp01((time - motionStartedAt) / motionDuration)
      const usesSuspendedTravel =
        tween.opacityMode === 'wordDispersal' || tween.opacityMode === 'clickedDissolve'
      const eased = usesSuspendedTravel ? smoothstep(progress) : easeOutQuart(progress)
      const arc = Math.sin(Math.PI * eased) * tween.bend
      const dx = tween.to.x - tween.from.x
      const dy = tween.to.y - tween.from.y
      const distance = Math.max(1, Math.hypot(dx, dy))
      particle.x = tween.from.x + dx * eased + (-dy / distance) * arc
      particle.y = tween.from.y + dy * eased + (dx / distance) * arc
      particle.alpha = this.tweenAlpha(tween, progress, timelineProgress, time)

      const handoffEndsAt = (tween.handoffAt ?? 0) + (tween.handoffDuration ?? 0)
      const isHandoffRunning = tween.opacityMode === 'wordFormation' && time < handoffEndsAt
      if (timelineProgress < 1 || isHandoffRunning) {
        isMoving = true
      } else {
        particle.x = tween.to.x
        particle.y = tween.to.y
        particle.tween = undefined
        if (particle.group === 'toggle') {
          particle.anchor = { ...tween.to }
          particle.idleActivatedAt = time
        }
      }
    })

    this.draw(time)
    const shouldContinue = isMoving || this.hasContinuousMotion()
    if (shouldContinue) this.frameId = requestAnimationFrame(this.tick)

    if (!isMoving && this.completion) {
      const callback = this.completion
      this.completion = undefined
      callback()
    }
  }

  private tweenAlpha(tween: Tween, progress: number, timelineProgress: number, time: number) {
    if (tween.opacityMode === 'wordFormation') {
      const arrival = smoothstep(progress / 0.2)
      const handoff = smoothstep((time - (tween.handoffAt ?? time)) / (tween.handoffDuration ?? 1))
      return MOTION_CONFIG.movingParticleOpacity * arrival * (1 - handoff)
    }

    if (tween.opacityMode === 'wordDispersal') {
      const materialize = smoothstep((time - (tween.handoffAt ?? time)) / (tween.handoffDuration ?? 1))
      const fadeOut = smoothstep((timelineProgress - 0.58) / 0.42)
      return MOTION_CONFIG.movingParticleOpacity * 0.82 * materialize * (1 - fadeOut)
    }

    if (tween.opacityMode === 'clickedDissolve') {
      return MOTION_CONFIG.movingParticleOpacity * smoothstep(
        (time - (tween.handoffAt ?? time)) / (tween.handoffDuration ?? 1),
      )
    }

    const base = tween.fromAlpha + (tween.toAlpha - tween.fromAlpha) * easeOutQuart(progress)
    if (tween.opacityMode === 'iconMorph') {
      const travelDip = Math.sin(Math.PI * progress)
      return base - (MOTION_CONFIG.settledParticleOpacity - MOTION_CONFIG.movingParticleOpacity) * travelDip
    }
    return base
  }

  private hasContinuousMotion() {
    if (this.options.reduceMotion) return false
    return this.mode === 'closed' || this.mode === 'menu' || (this.mode === 'listen' && this.recordRotationStartedAt !== undefined)
  }

  private draw(time: number) {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)

    this.particles.forEach((particle) => {
      if (particle.alpha <= 0.01) return
      const position = this.renderPosition(particle, time)
      this.context.beginPath()
      this.context.fillStyle = `rgba(${GOLD}, ${particle.alpha})`
      this.context.arc(position.x, position.y, particle.radius, 0, TAU)
      this.context.fill()
    })
  }

  private renderPosition(particle: Particle, time: number): Point {
    if (particle.group === 'toggle' && particle.anchor && !particle.tween && !this.options.reduceMotion) {
      const settle = smoothstep((time - particle.idleActivatedAt) / MOTION_CONFIG.iconIdleSettleDuration)
      const primaryX = Math.sin((time / particle.idlePeriodX) * TAU + particle.idlePhaseX)
      const primaryY = Math.sin((time / particle.idlePeriodY) * TAU + particle.idlePhaseY)
      const secondaryX = Math.sin((time / (particle.idlePeriodY * 1.37)) * TAU + particle.idlePhaseY)
      const secondaryY = Math.sin((time / (particle.idlePeriodX * 1.51)) * TAU + particle.idlePhaseX)
      const noise = MOTION_CONFIG.iconIdleNoiseStrength
      return {
        x: particle.anchor.x + (primaryX + secondaryX * noise) * particle.idleAmplitude * settle,
        y: particle.anchor.y + (primaryY + secondaryY * noise) * particle.idleAmplitude * settle,
      }
    }

    if (
      particle.group === 'listen' &&
      particle.recordPoint &&
      this.recordCenter &&
      this.recordRotationStartedAt !== undefined &&
      !this.options.reduceMotion
    ) {
      const elapsedMinutes = (time - this.recordRotationStartedAt) / 60000
      const angle = elapsedMinutes * MOTION_CONFIG.recordRPM * TAU
      const dx = particle.recordPoint.x - this.recordCenter.x
      const dy = particle.recordPoint.y - this.recordCenter.y
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)
      return {
        x: this.recordCenter.x + dx * cosine - dy * sine,
        y: this.recordCenter.y + dx * sine + dy * cosine,
      }
    }

    return particle
  }

  private centerOf(points: Point[]): Point {
    if (!points.length) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const xs = points.map((point) => point.x)
    const ys = points.map((point) => point.y)
    return {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: (Math.min(...ys) + Math.max(...ys)) / 2,
    }
  }

  private lerp(from: number, to: number, amount: number) {
    return from + (to - from) * amount
  }

  // Stable pseudo-random values become per-particle phase/frequency parameters.
  private noise(value: number) {
    const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453
    return raw - Math.floor(raw)
  }
}
