# Motion language

**Status: Approved working direction**

Atomic Kissa's motion is calm, suspended, organic, and slightly ceremonial. It suggests matter moving through a quiet room rather than effects triggered for display. Stillness provides contrast; motion should have a reason to begin and a clear state in which to rest.

## Purposes of motion

Motion may communicate:

- Immediate acknowledgement of input
- Continuity between an origin and destination
- Hierarchy or a change of state
- The pace and atmosphere of an editorial passage
- Shared material, such as a form reorganizing into another form

Motion should not become a universal hover treatment, ambient decoration on every element, or compensation for weak information architecture.

## Continuity and handoffs

A menu mark may become a close mark; a title may loosen, travel, and become part of the next scene. Reusing visual material can make navigation feel continuous rather than assembled from unrelated effects.

When crisp and particle-rendered forms meet, they should share a geometry and coordinate source whenever practical. Crossfades work when dimensions, transforms, view boxes, and placement align. The exact implementation need not reproduce the historical prototype.

## Pacing

Input acknowledgement should occur quickly—generally within a fraction of a second—even when the complete transition takes several seconds. Long sequences should overlap related phases so that dissolve, travel, and formation feel like one change rather than a queue of pauses.

Small differences in start time can give a composition rhythm without becoming a theatrical cascade. Timing should be tuned by feel, viewport, distance, content, and performance rather than treated as a universal token table.

Ordinary vertical scrolling may drive restrained atmospheric change. The page should continue to behave like a page: avoid forced scroll positions, long pinned passages without clear benefit, and motion that makes reading or orientation harder.

## Technical qualities

Animation should be based on elapsed time rather than frame count. Continuous loops should run only while visible movement requires them. Particle density, device-pixel-ratio caps, resize behavior, memory, and battery cost need explicit mobile testing.

Motion profiles exposed to the CMS must be named, bounded, and tested compositions. Content may choose a profile; it may not provide arbitrary timing code, scripts, or animation properties.

## Reduced motion

Reduced motion is a composed version of the same experience. It must preserve content, state, hierarchy, immediate feedback, and navigation while replacing particle-heavy travel, parallax, continuous drift, rotation, and large spatial movement with stable forms or short fades.

The reduced-motion experience should not:

- Remove routes or controls
- Depend on an animation's completion to reveal essential content
- Substitute abrupt flashes for long movement
- Leave decorative loops running merely because they are slow

The public site and CMS should remain understandable before client-side motion initializes and if enhancement fails entirely. The historical particle experiments and their lessons are documented in [Prototype history](prototype-history.md).
