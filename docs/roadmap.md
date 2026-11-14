# Roadmap

**Status: Approved working direction**

This roadmap sequences outcomes and decision gates. It is not a date commitment, and a later phase should not force speculative machinery into an earlier one.

## 1. Documentation and decisions

Establish the product vision, interaction standards, target architecture, content domains, security boundaries, decision record, and open questions. Decide the repository transition and environment strategy before scaffolding the target application.

**Exit:** the documentation set is internally consistent, and blocking foundation questions have owners or decisions.

## 2. Next.js and Firebase foundation

Create the Next.js App Router and TypeScript foundation, Vercel deployment path, Firebase server/client boundaries, Emulator Suite workflow, environment validation, and baseline quality checks.

**Exit:** local, preview, and production-shaped environments can render a minimal application without using production data during development.

## 3. Authentication and owner authorization

Implement Firebase sign-in, server-created HttpOnly sessions, sign-out and revocation behavior, owner bootstrap, protected CMS routing, and the first server-side capability checks.

**Exit:** the owner can access the CMS; unauthenticated or unauthorized requests cannot access protected reads or mutations.

## 4. Content schema and authenticated API

Define the minimum Entry, staff, and shared reference schemas; validation; repository boundaries; lifecycle actions; audit metadata; and authenticated Route Handlers.

**Exit:** validated draft entries can be created, read, updated, and lifecycle-tested through server-owned APIs.

## 5. Basic Entries CMS

Build the control-room shell, entry index, create/edit flows, category fields, slugs, structured launch sections, status display, and accessible validation.

**Exit:** the owner can manage the text and structure of representative launch entries without direct database access.

## 6. Media manager

Add authorized upload and selection, metadata, search/filtering, focal points, reuse, usage awareness, and a safe deletion lifecycle.

**Exit:** entries can reliably reference managed media, and destructive actions cannot silently break known usage.

## 7. Settings

Add typed controls for identity, tagline, defaults, navigation, featured content, SEO, footer/social data, and the first necessary feature flags.

**Exit:** intended site-level editorial changes can be made without code changes, while secrets and infrastructure remain outside the CMS.

## 8. Draft preview and publishing

Implement the authorized Draft Mode flow, draft rendering, publication validation, publish/unpublish actions, and targeted cache revalidation.

**Exit:** unpublished content requires both authorization and Draft Mode; successful publishing updates every affected public surface.

## 9. Standard public routes and entry rendering

Build Home, Listen, Drink, Explore, About, and entry routes with semantic rendering, metadata, responsive layouts, browser navigation, and no dependence on animation.

**Exit:** the initial public information architecture is complete, linkable, accessible, and resilient without client enhancement.

## 10. Entry-level art direction

Introduce the minimum proven palettes, hero/background treatments, composition variants, motion profiles, and CMS previews required by real content.

**Exit:** selected entries can vary meaningfully within tested application-owned design grammar and reliable fallbacks.

## 11. Experimental experience layer

Explore the quiet threshold, atmospheric archive, Side A/Side B, particle continuity, and scroll-reactive atmosphere as progressive enhancements. Establish performance budgets and reduced-motion equivalents.

**Exit:** adopted experiments improve the experience without replacing URLs, semantics, ordinary scrolling, or accessible alternatives.

## 12. Future users, events, and community capabilities

Reassess public accounts, profiles, personalization, saved listening sessions, registrations, memberships, community features, and additional staff workflows using evidence from the released product.

**Exit:** each chosen capability receives its own scope, privacy model, authorization design, data lifecycle, and delivery plan before implementation.

## Continuous concerns

Accessibility, responsive behavior, security review, content migration, performance, observability, backups, and documentation apply throughout the roadmap. They are not a final hardening phase.
