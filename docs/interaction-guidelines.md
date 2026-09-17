# Interaction guidelines

User input should feel acknowledged immediately. A subtle change in opacity, tension, glow, or motion is enough to confirm that an action has begun. The larger transformation may then unfold slowly. Deliberate slowness should remain visibly intentional and should never resemble lag.

Interactive controls must remain semantic and accessible beneath visual effects. Buttons and links should retain clear labels, keyboard focus, appropriate state attributes, and usable hit areas. Canvas is a visual layer, not the interaction surface.

Keyboard behavior should follow the same state model as pointer interaction. Focus should remain visible, and Escape should close transient navigation where expected. When a transition temporarily prevents another action, the control’s disabled or expanded state should communicate that condition.

Mobile is the baseline rather than a reduced desktop layout. Geometry sampling, hit targets, spacing, particle density, and performance should be checked at narrow viewports first, then allowed to expand into larger compositions.

Scene changes should preserve spatial or material continuity when practical. A selected form can become the next scene’s object instead of disappearing before an unrelated page appears. This continuity is especially valuable for major navigation moments; minor actions do not all need elaborate choreography.

Particle effects should carry meaning: shared material, transformation, focus, or continuity. They should not become a universal hover treatment or ambient decoration on every element.

Reduced-motion alternatives must preserve access to every state and control. Simplifying travel, drift, or rotation should not remove context or make feedback ambiguous. Short fades, clear settled geometry, and stable focus can maintain the project’s tone without reproducing its full motion.
