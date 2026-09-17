# Atomic Kissa navigation study

A small Vite + React + TypeScript proof of concept for a slow, particle-led navigation system. It has no backend, router, audio, or production application features.

## Run it

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run lint
npm run build
```

## Firebase Hosting

The registered Firebase web app is initialized in `src/firebase.ts`. Hosting deploys the Vite production output from `dist` to the `atomic-kissa` Firebase project; no Authentication, database, Storage, or other Firebase product is enabled by this setup.

Authenticate the local CLI once, preview the built site with the Hosting emulator, and deploy when ready:

```bash
npm exec firebase login
npm run hosting:serve
npm run deploy
```

The Firebase web configuration is public client metadata. Authorization still belongs in Firebase Security Rules if backend products are added later.

### GitHub deployment and credentials

GitHub Actions creates a Firebase Hosting preview for pull requests opened from this repository and deploys the live site when changes reach `main`. Both workflows build with `npm ci && npm run build` before deploying.

The deploy credential must remain in the repository's Actions secrets as `FIREBASE_SERVICE_ACCOUNT_ATOMIC_KISSA`. The workflow references that secret but the service-account JSON must never be committed. `GITHUB_TOKEN` is supplied automatically by GitHub Actions.

The values in `src/firebase.ts`, including the Firebase Web API key, identify the public browser app and are expected to ship in the client bundle. They do not grant administrative access. If Authentication, Firestore, Realtime Database, or Storage is added later, protect data with Firebase Security Rules and consider App Check. Keep server credentials, private keys, and non-Firebase API secrets out of `VITE_*` variables because Vite exposes those values to browser code.

Local environment files and common Firebase service-account filenames are excluded by `.gitignore`. An `.env.example` file may be committed later, but it must contain placeholders only.

## Design and motion documentation

- [Experience principles](docs/experience-principles.md)
- [Motion language](docs/motion-language.md)
- [Visual direction](docs/visual-direction.md)
- [Interaction guidelines](docs/interaction-guidelines.md)
- [Architecture notes](docs/architecture-notes.md)

These documents are living guidance, not a finished design system. Future experimentation is encouraged, and the guidance can change as Atomic Kissa develops. New interactions should follow the spirit of the experience rather than reproduce existing animations by rote.

## Architecture

- `src/App.tsx` is a small React state machine (`closed → opening → menu → closing` or `leaving → listen`). It owns semantic buttons, focus behavior, and scene copy.
- `src/geometry/WordMark.tsx` contains the custom SVG path alphabet. The same rendered paths are both the crisp final letterforms and the source geometry sampled by the particle layer.
- `src/particles/ParticleEngine.ts` owns canvas sizing, DPR capping, SVG path sampling, particle reuse, interpolation, deterministic icon drift, and `requestAnimationFrame`. React never renders individual particles.
- `src/particles/motionConfig.ts` is the single tuning surface for density, radius, opacity, handoff timing, icon drift, and record speed.
- `src/App.css` owns responsive composition and non-canvas fades. The mobile layout is the baseline.

The menu-toggle particles are reused for hamburger → X. At rest, each point stays tied to a fixed SVG target and receives a deterministic, sub-two-pixel sine offset with its own stable phase and period. The menu icon has its own denser sampling and smaller radius configuration.

Menu particles and crisp labels use the same rendered SVG paths. Opening assembles loose particles and crossfades them into those paths. Closing mirrors the idea in reverse: the SVG paths fade into aligned particles in reverse item order, then the particles loosen, drift outward, and disappear. A dedicated `closing` state keeps the geometry mounted until the reverse animation finishes.

LISTEN immediately acknowledges the click, and particle travel begins while the SVG is still dissolving. This overlap removes the stationary release beat; only a short seam remains before record formation begins. The preserved LISTEN particles become the record and rotate as one rigid group at 33⅓ RPM around the geometry’s measured center.

`prefers-reduced-motion` collapses the long transformations to brief fades, disables icon drift, and leaves the record stationary while preserving navigation state and accessible controls.

## Useful values to tune

The main controls are consolidated in `src/particles/motionConfig.ts`:

- `menuIconParticleRadius`: hamburger/X point-size range
- `menuIconParticleDensity.samplingSpacing`: hamburger/X sampling distance; smaller means denser
- `menuOpenWordDuration`: particle word-formation time
- `menuCloseWordDuration`: complete aligned-particle-to-dispersal time per word
- `menuCloseWordStagger`: reverse-order close offset between words
- `menuWordDissolveDuration`: SVG-to-particle close handoff
- `clickedItemDissolveDuration`: LISTEN SVG-to-particle handoff
- `clickedItemReleaseDelay`: brief delay before travel begins during the dissolve
- `clickedItemHoldDuration`: short seam between travel and record formation
- `sceneFormationDuration`: particle-to-record formation time
- `overallListenTransitionDuration`: target duration from LISTEN click through completed record
- `recordRPM`: rigid record speed (`33.3333333333`)
- `iconIdleAmplitude`, period range, and noise strength: restrained icon breathing

`listenTravelDuration()` derives the travel interval from the requested overall duration after subtracting release delay, the short seam, formation, and formation spread. Dissolve and travel intentionally overlap. Layout, color, SVG stroke weight, and CSS handoffs remain in `App.css`; glyph geometry and letter spacing remain in `WordMark.tsx`.
