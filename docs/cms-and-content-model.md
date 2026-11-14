# CMS and content model

**Status: Approved working direction; exact schemas remain open**

The Atomic Kissa CMS is an editorial control room, not a generic website builder. It should make the intended work expressive and safe while keeping the interface small enough for one owner at launch.

The first-class domains are Entries, Media, Settings, and Users/staff authorization. Code owns the design grammar, rendering components, allowed variants, validation, and capabilities. CMS records supply content and choose from that controlled vocabulary.

## Entries

An entry is the primary editorial object. The conceptual model includes:

- Stable identifier
- Title and slug
- Draft or published status
- Publication date and editorial timestamps
- Category: initially Listen, Drink, or Explore
- Summary or introductory copy
- Structured editorial sections
- SEO title, description, and share-image selection
- Entry-specific palette, background, hero treatment, composition variant, and motion profile
- Related-entry references
- Created-by and last-updated-by staff references

This is a domain model, not a final Firestore document. Field optionality, section shapes, index strategy, revision storage, and localization are still open.

### Status and publication

The initial lifecycle is deliberately small:

- **Draft** — accessible only in the authorized preview flow.
- **Published** — eligible for public queries when its publication requirements are satisfied.

Publishing and unpublishing are explicit server-side actions. A published entry needs a unique valid slug and the minimum content required by its category and selected composition. Scheduled publishing, multi-stage approval, revisions, and rollback are deferred unless schema work demonstrates that one is essential.

### Structured editorial sections

Entries should be composed from a limited set of structured section types rather than an unrestricted rich-text page or arbitrary layout canvas. Possible section families include prose, image, quote, track list, credits, coffee or drink notes, and related-content groups.

The first implementation should add only the section types required by real launch content. Each type needs a stable schema, semantic rendering, responsive behavior, and migration strategy before editorial use.

### Curated art direction

Palettes, backgrounds, hero treatments, composition variants, and motion profiles are named references to application-owned options. The CMS may preview and select them; it may not accept arbitrary CSS, JavaScript, animation code, or unbounded layout values.

Every exposed option should define:

- Supported content and media requirements
- Responsive behavior
- Contrast and focus treatment
- Missing-media fallback
- Reduced-motion behavior

## Media

Storage contains media objects; Firestore contains editorial metadata and references. A media record should eventually support:

- Stable identifier and storage location
- Original filename and safe object name
- Media type, format, byte size, and dimensions where applicable
- Alt text, caption, and credit
- Tags and searchable descriptive fields
- Focal point for responsive crops
- Upload and update timestamps and staff attribution
- Processing or availability state if derivatives are introduced
- Known usage across entries and settings

The manager should support upload, selection, search, filtering, metadata editing, reuse, and safe deletion. Alt text can be required contextually rather than forced onto decorative assets; the content model must allow the rendering context to make that distinction.

Deletion should show known usage and prevent accidental breakage. Whether assets use soft deletion, a trash period, or protected hard deletion is an open decision. Media transformations, derivative ownership, and upload transport are also open.

## Settings

Settings are curated site-level content, not a general key-value store. Expected groups include:

- Site identity and the “Coffee · Jazz · Other Worlds” tagline
- Logos and fallback imagery
- Default palette and motion profile
- Navigation labels and destinations
- Featured entries or editorial selections
- SEO defaults
- Footer and social information
- Explicit feature flags

Settings require typed schemas and safe defaults. Changes that affect public pages should trigger relevant cache revalidation.

Infrastructure credentials, service-account material, API secrets, deployment configuration, permission definitions, and arbitrary executable values must never be CMS-managed settings.

## Users and staff authorization

The initial system has one owner. A private staff record can associate a Firebase Authentication UID with an internal status and role assignment. Permission evaluation maps that assignment to server-owned capabilities.

Likely capability families include:

- Read and edit entries
- Publish and unpublish entries
- Preview drafts
- Upload, edit, and delete media
- Edit settings
- Manage staff authorization

These names are illustrative until the authorization phase defines the minimum matrix. Route Handlers enforce capabilities; the CMS uses the same information to explain available actions, not to establish security.

Staff authorization is not a public profile. Public profiles, preferences, registrations, saved content, and memberships belong to separate future domains if they are introduced.

## Relationships and deletion

Entries can reference media, related entries, and controlled design options. Settings can reference media and featured entries. Before deleting or unpublishing a record, the system should identify these known dependents and either block the action, request a replacement, or apply an explicit safe fallback.

References should use stable identifiers rather than mutable slugs or filenames. Denormalized display data may be useful for queries, but it must have a clear update policy.

## CMS experience

The control room should prioritize:

- Clear content status and preview access
- Fast creation and editing of the small initial domain
- Useful validation near the field and again on the server
- Art-direction previews that reflect responsive and reduced-motion states
- Media usage awareness
- Explicit publish, unpublish, and destructive actions
- Keyboard-complete workflows and semantic forms

Bulk operations, workflow dashboards, arbitrary page composition, plugin ecosystems, and enterprise role administration are not initial requirements.
