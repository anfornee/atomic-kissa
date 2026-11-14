# Architecture notes

**Status: Approved working direction**

This document describes the target application. The checked-in Vite study is documented separately in [Prototype history](prototype-history.md).

## Target stack

- Next.js App Router and TypeScript
- Vercel hosting
- Firebase Authentication for identity
- Firestore for editorial and application data
- Google Cloud Storage through Firebase Storage for media objects
- Firebase Admin for server-owned access to Firebase services
- HttpOnly Firebase session cookies for authenticated web sessions
- Firebase Emulator Suite for local development
- A small, purpose-built CMS inside the Atomic Kissa application

Payload and other complete CMS frameworks are not part of the current direction.

## System boundaries

The browser interacts with Next.js. Public pages use Server Components for content reads where appropriate. Authenticated Route Handlers own CMS mutations and other privileged operations. Firebase Admin remains server-only and must never enter a client bundle.

Firestore stores structured content, metadata, settings, and authorization records. Storage holds media binaries; Firestore records describe those assets and their usage. Code owns rendering components, design tokens, allowed composition variants, motion profiles, validation, and permission definitions.

The public site initially has no reason to write directly to Firestore or Storage from the browser. If a future feature requires direct client access, it must receive an explicit threat review and restrictive Firebase Security Rules rather than inheriting CMS trust assumptions.

## Request classes

### Public content reads

Public routes query only publishable content. Server Components can render published entries and settings without exposing administrative credentials to the browser. Repository or query functions should encode the published-only boundary so it is difficult to bypass accidentally.

Public reads may be cached. Publishing or unpublishing content must revalidate the affected entry, indexes, navigation, featured content, and other known dependents only after the write succeeds.

### Authenticated CMS reads and mutations

CMS requests require a valid server-verified session and an authorization check for the requested capability. Route Handlers validate input, apply business rules, perform the write, record operational metadata where appropriate, and return a deliberate response. UI visibility is never the permission boundary.

Cookie-authenticated mutations also require cross-site request protections appropriate to the final deployment, including restrictive cookie attributes and origin validation. The precise CSRF mechanism is an [open decision](decisions-and-open-questions.md#open-questions), not a reason to omit the boundary.

### Media operations

Media upload, metadata updates, selection, and deletion are privileged CMS operations. A media record should be created or reconciled with its stored object so that orphaned files and broken references are detectable. Deletion must check known usage and prefer an explicit lifecycle over silent hard deletion.

The final upload transport and image-transformation strategy remain open. Whatever approach is selected must enforce authorization, type and size limits, metadata validation, and safe object naming on the server-owned boundary.

## Authentication and session flow

Authentication answers **who is this?** The intended flow is:

1. The user signs in with Firebase Authentication.
2. The browser sends the resulting Firebase ID token to a server endpoint over HTTPS.
3. The server verifies the token with Firebase Admin and creates an HttpOnly session cookie.
4. Subsequent server requests verify the session cookie before loading staff identity or capabilities.
5. Sign-out clears the cookie; sensitive account changes should support session revocation.

Session cookies should be `Secure` in deployed environments, `HttpOnly`, narrowly scoped, and use an intentional `SameSite` policy. Session lifetime and revocation policy remain to be decided.

Firebase browser configuration is public application metadata. Firebase Admin credentials, service-account material, private keys, and other infrastructure secrets must remain in protected deployment configuration and outside CMS settings, source control, and client-exposed environment variables.

## Authorization, profiles, and experience state

These concepts stay separate even when one person has records in several domains:

| Concern | Question answered | Initial state |
| --- | --- | --- |
| Authentication | Who is this? | Firebase Authentication identity |
| Authorization | What may this identity do? | One owner with server-evaluated capabilities |
| Profile | What personal or public information describes them? | Minimal private staff metadata only |
| Experience state | What preferences, registrations, saves, or memberships do they have? | Deferred |

Roles such as `owner`, `editor`, and `contributor` may group capabilities, but application code should ask for capabilities such as `entries.publish` or `media.delete`, not scatter role-name comparisons across routes and components. The server is authoritative.

Only the owner role is needed initially. The data boundary should allow more staff later without creating public profile or community features prematurely. See [CMS and content model](cms-and-content-model.md#users-and-staff-authorization).

## Draft preview and publishing

Next.js Draft Mode is a rendering switch, not authorization. Unpublished content can be rendered only when both conditions are true:

1. A valid Firebase session has the capability to preview that content.
2. Draft Mode is active through a protected server-controlled flow.

A Draft Mode cookie by itself must never expose draft content. Preview entry and exit endpoints must validate the session, authorize the requested content, and prevent arbitrary unsafe redirect targets. Draft queries remain separate from public published-only queries.

Publishing is a domain action rather than a raw field edit. It should validate required content, set publication metadata consistently, and revalidate affected caches after the successful change. Revision history, scheduling, rollback, and approval workflow are not assumed for the first version.

## Data and validation principles

- Treat server-side validation as authoritative even when the CMS validates earlier for usability.
- Keep stable identifiers separate from mutable slugs and display names.
- Store timestamps and actor identifiers for meaningful editorial changes.
- Represent relationships explicitly enough to find dependents before deletion or unpublishing.
- Version structured editorial sections if their schema changes in incompatible ways.
- Return safe errors to the browser; keep sensitive operational detail in server logs.
- Prefer small domain repositories or services over Firebase calls scattered through UI code.

The conceptual records are defined in [CMS and content model](cms-and-content-model.md). Exact Firestore collections, indexes, and validation schemas should be chosen during the content-schema phase.

## Local development and environments

The Firebase Emulator Suite should support local Authentication, Firestore, and Storage workflows without using production data or credentials. Seed data and a safe owner-bootstrap process will be needed, but their format is not yet decided.

Production, preview, and local environment separation—particularly the number of Firebase projects and how Vercel previews connect to them—is an open infrastructure decision. Preview deployments must not receive production administrative access by default.

## Operational baseline

Before launch, the system needs:

- Least-privilege deployment credentials and documented rotation
- Firestore and Storage rules appropriate to every permitted client path
- Backups or export procedures for content and metadata
- Logging for privileged failures and important editorial actions
- Upload limits and media lifecycle handling
- Dependency, platform, and security-update practices
- A recovery path for the sole owner account

Detailed monitoring, backup retention, and incident procedures are deferred until the infrastructure phase, but the security boundaries above are initial requirements rather than later enhancements.
