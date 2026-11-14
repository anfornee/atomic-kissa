# Decisions and open questions

This record keeps approved working direction separate from assumptions, exploratory concepts, and deferred capabilities. When a decision changes, update the owning document as well as this record.

## Approved working direction

| ID | Decision | Consequence |
| --- | --- | --- |
| D-001 | Atomic Kissa is an atmospheric digital jazz-kissa and listening-bar experience with the line “Coffee · Jazz · Other Worlds.” | Product and editorial choices should reinforce place, attention, and restraint. |
| D-002 | The public foundation uses Home, Listen, Drink, Explore, About, and individual entry routes. | Experimental navigation enhances real URLs and conventional browser behavior rather than replacing them. |
| D-003 | The target application uses Next.js App Router, TypeScript, and Vercel. | The existing Vite/Firebase Hosting study is historical reference, not target architecture. |
| D-004 | Firebase Authentication establishes identity; HttpOnly Firebase session cookies establish authenticated web sessions. | Server requests verify sessions with Firebase Admin; privileged credentials stay server-only. |
| D-005 | Firestore stores structured content and application data; Firebase/Google Cloud Storage stores media objects. | Metadata, references, and binary lifecycle must be coordinated. |
| D-006 | The CMS is a purpose-built Atomic Kissa control room, not Payload or another complete CMS framework. | Initial tools focus on Entries, Media, Settings, and staff authorization. |
| D-007 | Code owns design grammar; content selects from a controlled creative vocabulary. | The CMS does not accept arbitrary CSS, scripts, unrestricted layouts, or unbounded motion values. |
| D-008 | CMS mutations use authenticated Next.js Route Handlers with server-side validation and capability checks. | UI visibility and client validation are usability features, never security boundaries. |
| D-009 | Public content reads use Server Components where appropriate and expose only published content. | Draft and public repository paths remain distinct; publication revalidates affected caches. |
| D-010 | Unpublished previews require both an authorized Firebase session and active Next.js Draft Mode. | A draft cookie alone can never reveal unpublished content. |
| D-011 | Authorization is capability-based even if roles group capabilities. | Application code asks what an actor may do instead of scattering role-name comparisons. |
| D-012 | The initial account is one owner; public users and richer staff workflows are not launch scope. | Data boundaries should permit growth without prebuilding community systems. |
| D-013 | Accessibility, responsive behavior, reduced motion, and progressive enhancement are foundation requirements. | Atmosphere must survive without animation, audio, precision pointing, or client enhancement. |

## Assumptions to validate

- The current Vite proof of concept will remain available as reference during the transition, but the repository migration method is undecided.
- Listen, Drink, and Explore are sufficient initial entry categories.
- A two-state draft/published lifecycle is adequate for the first owner workflow.
- Structured editorial sections can cover launch content without a generic rich-text page builder.
- The public site can read content through the Next.js server boundary without direct browser-to-Firestore access.
- One owner can manage the initial editorial volume without bulk tools or approval workflows.
- WCAG 2.2 Level AA is the appropriate working accessibility target.

## Open questions

### Foundation and operations

1. How should the existing prototype be retained when the Next.js application begins: archive branch/tag, subdirectory, or replacement after a recorded milestone?
2. Which Firebase projects and credentials will serve local, Vercel preview, staging if any, and production environments?
3. How will the first owner be bootstrapped and recovered without creating a standing privilege-escalation path?
4. What session lifetime, revocation checks, cookie scope, and CSRF protection will CMS requests use?
5. What backup, restore, logging, audit, and credential-rotation policies are required before launch?

### Content and publishing

6. What launch content examples determine the first structured editorial section types?
7. How should schema versions and migrations work as structured sections evolve?
8. Are autosave, revision history, rollback, scheduled publication, or editorial approvals required before launch?
9. What makes an entry publishable in each category, and can a publication date differ from the actual publish event?
10. Should Listen, Drink, and Explore be fixed categories, managed taxonomy, or both category and route concepts?
11. How are slugs reserved, redirected after changes, and handled across categories?

### Media and presentation

12. Will uploads pass through the application server, use short-lived signed upload permissions, or use another controlled path?
13. Which image formats, size limits, transformations, responsive derivatives, and retention rules are required?
14. Should deletion use a trash period, soft deletion, protected hard deletion, or a combination?
15. Which palettes, composition variants, and motion profiles are proven by actual launch entries rather than hypothetical flexibility?

### Public experience

16. What is the exact route convention for categories and entries?
17. Is the accessible archive alternative one responsive interface or a separate view toggle?
18. Which parts of Side A/Side B belong in the first experience experiment, if any?
19. What supported-browser, performance-budget, analytics, privacy, and consent policies apply?
20. Will the experience use audio at launch, and if so, what controls, rights, loading, and autoplay constraints apply?

## Exploratory concepts

- A homepage as a quiet threshold
- An atmospheric archive with a conventional list or grid alternative
- Side A for an immersive listening room and Side B for notes, credits, track lists, and pairings
- Scroll-reactive atmosphere using normal vertical scrolling
- Particle or material continuity between navigation and content

Exploration belongs after the standard route foundation and does not imply inclusion in the initial release.

## Deferred capabilities

- Public user profiles
- Personalized experiences and preferences
- Event registration
- Saved listening sessions
- Community and social features
- Memberships
- Multiple editorial roles beyond what is needed to validate the capability model
- Multi-stage editorial approval
- Scheduled publishing and advanced revision workflows
- Localization unless launch content establishes a requirement
- A plugin ecosystem or generic page-builder controls

Deferred does not mean rejected. Each capability needs separate product evidence, privacy and security analysis, data lifecycle rules, and roadmap approval before it becomes active scope.
