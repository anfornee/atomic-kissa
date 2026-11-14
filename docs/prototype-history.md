# Prototype history

**Status: Historical context**

The checked-in application is a small Vite, React, and TypeScript proof of concept for particle-led navigation. It has no router, backend, audio system, content platform, or production application features. Its purpose was to test atmosphere, material continuity, responsive particle rendering, and accessible fallbacks.

It should be treated as creative and technical reference. The new application may reuse its lessons or selected techniques, but it is not required to preserve its component structure, state model, hosting setup, or animation engine.

## What the study explored

- A React scene state machine for `closed → opening → menu → closing` and `leaving → listen`.
- Semantic buttons, focus management, Escape behavior, and reduced-motion states beneath a visual canvas layer.
- Custom SVG word geometry used both as crisp letterforms and as source paths sampled by canvas particles.
- A particle engine responsible for canvas sizing, device-pixel-ratio capping, path sampling, particle reuse, interpolation, deterministic idle drift, and `requestAnimationFrame` timing.
- A centralized motion configuration for density, radius, opacity, handoffs, drift, and record speed.
- Responsive composition in CSS, with mobile treated as the baseline.

Menu particles were reused across hamburger and close states. Words assembled from particles and crossfaded into aligned SVG paths; closing reversed that material handoff. Selecting **LISTEN** preserved particles as they traveled and re-formed into a record rotating at 33⅓ RPM. Long phases overlapped so input felt acknowledged even while the overall transition remained slow.

Reduced-motion behavior shortened transformations, removed idle drift, and stopped continuous record rotation while preserving the same controls and navigation state.

## Lessons worth carrying forward

- Atmosphere can coexist with immediate input acknowledgement.
- Shared source geometry makes transitions feel continuous and prevents visible handoff jumps.
- Time-based animation is more robust than frame-count movement.
- Mobile performance, DPR caps, and particle density need deliberate budgets.
- Canvas should remain a visual layer rather than the interaction surface.
- Reduced motion is a distinct, composed experience—not merely a faster animation.
- Experimental navigation works best as an enhancement to a conventional, URL-based foundation.

These lessons inform [Interaction guidelines](interaction-guidelines.md) and [Motion language](motion-language.md), without dictating the new application's implementation.

## Current prototype files

- `src/App.tsx` coordinates scene state, semantic controls, focus, and copy.
- `src/geometry/WordMark.tsx` defines the custom SVG path alphabet.
- `src/particles/ParticleEngine.ts` owns the canvas particle system.
- `src/particles/motionConfig.ts` centralizes particle and timing controls.
- `src/App.css` owns responsive composition and non-canvas fades.

## Historical Firebase Hosting setup

The prototype includes a registered Firebase web app and Firebase Hosting configuration. Hosting serves the Vite production output from `dist`. No Authentication, database, Storage, or other Firebase product is enabled by the current setup.

The existing scripts remain:

```bash
npm run hosting:serve
npm run deploy
```

The repository's GitHub Actions workflows build with `npm ci && npm run build`, create Firebase Hosting previews for pull requests, and deploy the prototype when changes reach `main`. They expect `FIREBASE_SERVICE_ACCOUNT_ATOMIC_KISSA` in GitHub Actions secrets. Service-account JSON must never be committed.

Firebase web configuration is public client metadata, not an administrative credential. Server credentials, private keys, and non-public API secrets must remain outside source control and browser-exposed environment variables.

The target application will use Vercel rather than this Firebase Hosting arrangement. The transition plan remains an [open question](decisions-and-open-questions.md#open-questions).
