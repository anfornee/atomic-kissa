/** Central tuning surface for particle density, opacity, and motion timing. */
export const MOTION_CONFIG = {
  // General word/record particles.
  particleRadius: { min: 0.7, max: 1.05 },
  particleDensity: {
    mobileSamplingSpacing: 2.65,
    desktopSamplingSpacing: 2.35,
    targetResamplingSpacing: 0.5,
  },

  // The compact menu icon uses denser, finer points than the large word marks.
  menuIconParticleRadius: { min: 0.52, max: 0.78 },
  menuIconParticleDensity: { samplingSpacing: 1.05 },

  movingParticleOpacity: 0.68,
  settledParticleOpacity: 0.92,
  iconParticleHandoffDuration: 950,
  wordSvgCrossfadeDuration: 520,
  menuOpenWordDuration: 2250,
  menuCloseWordDuration: 1700,
  menuCloseWordStagger: 130,
  menuWordDissolveDuration: 600,

  // LISTEN begins moving during its dissolve; only a short seam remains before reforming.
  clickedItemDissolveDuration: 720,
  clickedItemReleaseDelay: 180,
  clickedItemHoldDuration: 160,
  sceneFormationDuration: 2600,
  overallListenTransitionDuration: 4700,
  sceneFormationDelaySpread: 160,

  recordRPM: 33.3333333333,
  iconIdleAmplitude: 1.05,
  iconIdleMinPeriod: 4500,
  iconIdleMaxPeriod: 8500,
  iconIdleNoiseStrength: 0.2,

  // Supporting timings remain here so the CSS/SVG handoff uses one source.
  wordStagger: 170,
  wordParticleDelaySpread: 260,
  iconIdleSettleDuration: 1100,
  dprCap: 2,
} as const

export function wordHandoffDelay(index: number) {
  return (
    index * MOTION_CONFIG.wordStagger +
    MOTION_CONFIG.wordParticleDelaySpread +
    MOTION_CONFIG.menuOpenWordDuration -
    MOTION_CONFIG.wordSvgCrossfadeDuration
  )
}

/** Reverse order makes the close read as the temporal inverse of opening. */
export function wordCloseDelay(index: number, wordCount: number) {
  return (wordCount - index - 1) * MOTION_CONFIG.menuCloseWordStagger
}

/** Travel overlaps the dissolve, preventing a stationary release phase. */
export function listenTravelDuration() {
  return (
    MOTION_CONFIG.overallListenTransitionDuration -
    MOTION_CONFIG.clickedItemReleaseDelay -
    MOTION_CONFIG.clickedItemHoldDuration -
    MOTION_CONFIG.sceneFormationDuration -
    MOTION_CONFIG.sceneFormationDelaySpread
  )
}
