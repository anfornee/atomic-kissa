# Documentation index

This directory is the working product and architecture foundation for Atomic Kissa. Documents favor durable principles and system boundaries over detailed implementation plans.

## Status language

- **Approved working direction** — the current basis for product and technical planning. It can change through an explicit decision.
- **Assumption** — a useful planning premise that still needs validation.
- **Exploratory** — a promising concept, not a delivery commitment.
- **Open question** — a decision still required.
- **Deferred** — intentionally outside the initial release.
- **Historical** — context from the existing proof of concept, not a target requirement.

## Document map

| Document | Purpose | Primary status |
| --- | --- | --- |
| [Experience principles](experience-principles.md) | Vision, product character, initial scope, and experience standards | Approved working direction |
| [Visual direction](visual-direction.md) | Color, composition, typography, imagery, and art-direction boundaries | Approved working direction |
| [Interaction guidelines](interaction-guidelines.md) | Information architecture, progressive enhancement, accessibility, and input behavior | Approved working direction |
| [Motion language](motion-language.md) | Motion character, continuity, pacing, and reduced-motion behavior | Approved working direction |
| [Architecture notes](architecture-notes.md) | Target stack, service boundaries, authentication, authorization, previews, caching, and security | Approved working direction |
| [CMS and content model](cms-and-content-model.md) | Editorial domains, controlled creative vocabulary, media, settings, and staff data | Approved working direction with labeled open details |
| [Roadmap](roadmap.md) | Phased delivery sequence and outcomes | Approved working direction |
| [Decisions and open questions](decisions-and-open-questions.md) | Decision record, assumptions, unresolved choices, and deferred work | Mixed, explicitly labeled |
| [Prototype history](prototype-history.md) | Existing Vite/React particle study and lessons worth preserving | Historical |

## Reading paths

For product and design work, begin with the experience, visual, interaction, and motion documents. For implementation planning, begin with architecture, CMS/content, the decision record, and the roadmap. The prototype document is reference material for either path; it is not a migration specification.

When a direction changes, update the owning document and record the decision in [Decisions and open questions](decisions-and-open-questions.md). Avoid copying the same rule into several files; link to the owning document instead.
