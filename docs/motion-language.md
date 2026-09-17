# Motion language

Atomic Kissa treats particles as shared matter. A hamburger can become an X; a word can loosen, travel, and become a record. Reusing visual material across states makes navigation feel continuous rather than assembled from separate effects.

SVG supplies exact source and destination geometry. Canvas particles sample those same paths, and the crisp SVG takes over only when the particles are almost settled. The handoff works when both layers share the same dimensions, transforms, viewBox, and placement. A crossfade should reveal clarity without exposing two misaligned versions of the shape.

Formation often benefits from a restrained stagger. Small differences in start time give a composition rhythm without turning it into a cascade. Major transformations can last several seconds when each phase remains legible and something is continuously changing.

Useful timing ranges include:

- Input acknowledgement: roughly 50–200ms
- Small interface responses: a few hundred milliseconds
- Menu construction or dissolution: a few seconds
- Scene-to-scene transformation: several seconds

These are starting points, not specifications. Timing should be tuned by feel, viewport, particle density, and the visual distance being traveled.

Long sequences should overlap related phases. Dissolve can blend into travel, and travel can flow into formation. This avoids dead pauses while retaining an unhurried pace. The visitor should feel suspended in a transformation, not held in a queue.

Resting particles may move almost imperceptibly. Stable per-particle phases and long periods create breathing or floating; fresh randomness creates jitter. Idle motion should remain attached to its geometry and become noticeable only with attention.

Movement is time-based and driven by `requestAnimationFrame`, so elapsed time—not frame count—determines progress. This keeps motion consistent when frame rates vary.

Reduced-motion behavior should preserve state, hierarchy, tone, and immediate feedback while replacing particle-heavy travel, continuous drift, and rotation with short, composed fades or stationary forms.
