# Architecture notes

The current implementation separates responsibilities by medium:

- React coordinates application state, scene transitions, semantic controls, accessibility attributes, and focus behavior.
- Canvas renders and animates particles without making React responsible for individual points.
- SVG defines source and destination geometry, including shapes that later become crisp visual states.
- A centralized motion configuration keeps density, radius, opacity, and timing easy to tune together.

This division is worth preserving because it supports experimentation without binding presentation, interaction, and particle simulation into one component. Scenes can change while the particle engine continues to work with named geometry and state transitions.

Animation should remain based on elapsed time and `requestAnimationFrame`. Frame-count movement produces inconsistent pacing and makes longer transitions fragile under load. Continuous loops should run only while ongoing movement requires them, such as subtle icon drift or record rotation.

Canvas sizing should account for `devicePixelRatio` while retaining a sensible cap. Particle density, draw cost, and resize behavior need regular checks on mobile hardware. Visual richness should come from considered geometry and motion before raw particle count.

SVG and canvas should share a coordinate source whenever a crisp handoff is expected. Duplicated typography, independent transforms, or separately tuned dimensions create visible jumps and should be avoided.

Large animation libraries are not inherently out of scope, but they should solve a demonstrated problem—such as orchestration, accessibility, or maintainability—before being added. The current lightweight engine keeps the behavior legible and tuneable.

Future scenes should remain loosely coupled. Prefer small scene-state contracts and reusable geometry or motion concepts over a single timeline that knows every destination. This keeps the project open to new experiments without turning the current proof of concept into a permanent template.
