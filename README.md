# Atomic Kissa

> Coffee · Jazz · Other Worlds

Atomic Kissa is a digital Japanese jazz-kissa and listening-bar experience. It combines modern Japanese minimalism, mid-century atomic-age forms, deep nocturnal color, warm light, and deliberately paced motion to create a place for music, coffee, and editorial discovery.

The product direction is atmospheric and unusual, but its foundation should remain intuitive: real URLs, conventional browser navigation, semantic controls, responsive layouts, and complete keyboard, assistive-technology, and reduced-motion support.

## Repository status

This repository currently contains a Vite, React, and TypeScript navigation study. It is useful creative and technical reference, not the assumed architecture of the new application.

The approved target direction is a Next.js App Router application hosted on Vercel, with Firebase Authentication, Firestore, Cloud Storage, Firebase Admin, and a purpose-built editorial CMS. The migration has not started; this documentation pass intentionally adds no application scaffolding, dependencies, or configuration.

See [Prototype history](docs/prototype-history.md) for the current study and [Architecture notes](docs/architecture-notes.md) for the target system.

## Documentation

The documentation index explains the purpose and status of each document:

- [Documentation index](docs/README.md)
- [Experience principles](docs/experience-principles.md)
- [Visual direction](docs/visual-direction.md)
- [Interaction guidelines](docs/interaction-guidelines.md)
- [Motion language](docs/motion-language.md)
- [Architecture notes](docs/architecture-notes.md)
- [CMS and content model](docs/cms-and-content-model.md)
- [Roadmap](docs/roadmap.md)
- [Decisions and open questions](docs/decisions-and-open-questions.md)
- [Prototype history](docs/prototype-history.md)

Together, these documents describe the working direction rather than a frozen specification. Approved decisions, assumptions, exploratory concepts, deferred capabilities, and unresolved questions are labeled so that future ideas are not mistaken for initial-release scope.

## Run the current prototype

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

The prototype's Firebase Hosting setup and deployment notes are retained in [Prototype history](docs/prototype-history.md). They do not define the target Vercel architecture.
