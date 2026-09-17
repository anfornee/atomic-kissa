const GLYPHS: Record<string, string[]> = {
  A: ['M0 16 L5 0 L10 16', 'M2.2 9 H7.8'],
  D: ['M0 0 V16 H3.5 C8 16 10 13 10 8 C10 3 8 0 3.5 0 Z'],
  E: ['M10 0 H0 V16 H10', 'M0 8 H8'],
  I: ['M1 0 H9', 'M5 0 V16', 'M1 16 H9'],
  J: ['M1 0 H10', 'M7 0 V11 C7 15 5 16 2.8 16 C1.3 16 .3 15.3 0 14'],
  K: ['M0 0 V16', 'M10 0 L0 10', 'M3.6 6.4 L10 16'],
  L: ['M0 0 V16 H10'],
  N: ['M0 16 V0 L10 16 V0'],
  O: ['M5 0 C1.5 0 0 2.8 0 8 C0 13.2 1.5 16 5 16 C8.5 16 10 13.2 10 8 C10 2.8 8.5 0 5 0 Z'],
  P: ['M0 16 V0 H4.5 C8 0 10 1.6 10 4.5 C10 7.4 8 9 4.5 9 H0'],
  R: ['M0 16 V0 H4.5 C8 0 10 1.6 10 4.5 C10 7.4 8 9 4.5 9 H0', 'M4.5 9 L10 16'],
  S: ['M10 1.5 C8.8 .4 7.2 0 5.2 0 C2 0 .2 1.7 .2 4.1 C.2 6.6 2.2 7.5 5.1 8.2 C8.2 9 10 10.1 10 12.5 C10 14.7 8.2 16 5 16 C2.8 16 1 15.4 0 14.3'],
  T: ['M0 0 H10', 'M5 0 V16'],
  U: ['M0 0 V10.5 C0 14.2 1.8 16 5 16 C8.2 16 10 14.2 10 10.5 V0'],
  X: ['M0 0 L10 16', 'M10 0 L0 16'],
}

const ADVANCE = 14

interface WordMarkProps {
  word: string
  target: string
}

/**
 * The visible letterforms and particle targets share these exact SVG paths.
 * Editing a glyph automatically updates both the crisp SVG and the animation.
 */
export function WordMark({ word, target }: WordMarkProps) {
  const width = word.length * ADVANCE - (ADVANCE - 10)

  return (
    <svg
      className="word-mark"
      viewBox={`-1 -1 ${width + 2} 18`}
      width={width}
      height="16"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
    >
      {Array.from(word).map((letter, index) => (
        <g key={`${letter}-${index}`} transform={`translate(${index * ADVANCE} 0)`}>
          {GLYPHS[letter].map((path, pathIndex) => (
            <path key={pathIndex} data-particle-target={target} d={path} pathLength="100" />
          ))}
        </g>
      ))}
    </svg>
  )
}
