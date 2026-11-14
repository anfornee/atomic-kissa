# Interaction guidelines

**Status: Approved working direction**

## Information architecture first

The public foundation uses clear destinations:

- Home
- Listen
- Drink
- Explore
- About
- Individual entry pages

Each destination must have a stable URL, support browser back and forward navigation, be directly linkable, and remain usable without animation. Category names may become route segments, but the exact URL convention is an [open question](decisions-and-open-questions.md#open-questions).

Persistent navigation should be present but understated. Visitors should always be able to determine where they are and how to leave an immersive state.

## Progressive enhancement

Semantic HTML, content, routes, and ordinary scrolling form the baseline. Experimental navigation, atmospheric archives, transitions, particles, and scroll-reactive scenes enhance that foundation rather than replace it.

Normal vertical scrolling may pace changes in light, color, scale, and emphasis. Avoid aggressive scroll hijacking, hidden browser behavior, or interactions that require a precise device. An immersive archive should have an accessible conventional list or grid alternative, whether that is the same responsive interface or an explicit view.

## Input and feedback

Input should feel acknowledged immediately. A small change in opacity, tension, state, or motion can confirm that an action has begun before a slower transformation completes.

Interactive controls must remain semantic beneath visual effects. Buttons and links need clear accessible names, visible focus, appropriate state attributes, and usable hit areas. Canvas and decorative SVG are visual layers, not the only interaction surfaces.

Keyboard behavior follows the same state model as pointer behavior. Escape should close transient navigation or immersive overlays where expected. If a transition temporarily prevents an action, the disabled, busy, or expanded state should communicate that condition without trapping focus.

## Navigation and transitions

Scene changes may preserve spatial or material continuity—for example, a selected form becoming part of the destination. Continuity is most valuable for major moments; routine controls do not all need choreography.

Transitions must not delay URL updates unpredictably, break history, conceal loading failures, or make the destination inaccessible. Where animation and navigation compete, navigation wins. Entry content should have a stable reading experience independent of its arrival transition.

## Responsive and resilient behavior

Mobile is the baseline. Test reading order, hit targets, safe areas, content density, media crops, particle budgets, virtual keyboards, and focus movement at narrow widths before expanding the composition.

Every meaningful state should account for:

- Slow or failed media
- Missing optional content
- Long titles and translated or user-entered text
- Touch, pointer, and keyboard input
- High zoom and text resizing
- Reduced motion and increased contrast preferences
- Server-rendered content before client enhancement is ready

## Accessibility baseline

The working target is WCAG 2.2 Level AA for the public site and CMS. Final conformance processes and supported-browser policy remain to be formalized.

At minimum:

- Preserve logical headings, landmarks, reading order, and focus order.
- Provide text alternatives, captions, and credits where relevant.
- Do not rely on color, position, sound, or motion alone to convey meaning.
- Keep focus visible against changing backgrounds.
- Announce meaningful asynchronous state changes without narrating decorative motion.
- Offer complete reduced-motion behavior and avoid unexpected autoplay audio.
- Keep CMS workflows operable without drag-and-drop or precision pointing.

Reduced-motion principles are detailed in [Motion language](motion-language.md).
