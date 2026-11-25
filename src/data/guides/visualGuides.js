export const VISUAL_GUIDES = {
  gradients: {
    id: 'gradients',
    name: 'Gradients',
    mentalModel:
      'CSS gradients are smooth color transitions rendered dynamically by the browser as `background-image` values—meaning they scale sharply to any screen resolution with zero image file download.',
    keyConcept:
      'Every gradient needs two things: a **geometry** (`linear`, `radial`, or `conic`) and at least two **color stops** telling the browser where each color begins along that path.',
    properties: [
      {
        id: 'type',
        cssProperty: 'linear-gradient / radial-gradient / conic-gradient',
        controlLabel: 'Gradient Type',
        shortSummary: 'Chooses whether colors blend along a straight line, outward from a circle, or around a center wheel.',
        whatItMeans:
          'The gradient function determines the **shape and path** colors follow across the element background.',
        howItWorks:
          '`linear-gradient()` paints colors along a straight directional line from one edge to the opposite edge. `radial-gradient()` radiates outward from a focal center point like a spotlight. `conic-gradient()` sweeps clockwise around a center point like hands on a clock or a pie chart.',
        values: [
          {
            value: 'linear',
            label: 'Linear',
            description: 'Smooth straight-line blend ideal for buttons, banners, and subtle surface depth.',
            applyProps: { type: 'linear', angle: 135 },
          },
          {
            value: 'radial',
            label: 'Radial',
            description: 'Circular or elliptical glow radiating outward from a focal point.',
            applyProps: { type: 'radial', radialShape: 'circle', radialPosition: 'center' },
          },
          {
            value: 'conic',
            label: 'Conic',
            description: 'Angular sweep around a center point—great for pie charts, rings, and color wheels.',
            applyProps: { type: 'conic', angle: 45, radialPosition: 'center' },
          },
        ],
        whenToUse:
          'Use `linear-gradient` for subtle lighting shifts on surfaces, `radial-gradient` for soft ambient spotlights behind hero sections, and `conic-gradient` for progress rings or data charts.',
        realWorldExample: {
          title: 'Hero Spotlight Backdrop',
          description:
            'A dark product header uses a subtle `radial-gradient(circle at top, #1e3a8a, #0f172a)` to cast gentle overhead lighting behind the headline.',
        },
        codeExample: {
          css: `.spotlight {\n  background-image: radial-gradient(circle at top, #60a5fa 0%, #1e3a8a 65%, #0f172a 100%);\n}`,
          applyProps: {
            type: 'radial',
            radialShape: 'circle',
            radialPosition: 'top',
            stops: [
              { id: 1, color: '#60a5fa', position: 0 },
              { id: 2, color: '#1e3a8a', position: 65 },
              { id: 3, color: '#0f172a', position: 100 },
            ],
          },
        },
        commonMistakes: [
          {
            mistake: 'Trying to put a gradient inside `background-color` instead of `background` or `background-image`.',
            fix: 'CSS treats gradients as generated **images**, not flat colors. Always use `background:` or `background-image:`.',
          },
        ],
        visualType: 'gradient-type',
      },
      {
        id: 'angle',
        cssProperty: 'angle (deg) & shape/position',
        controlLabel: 'Angle / Shape & Position',
        shortSummary: 'Rotates linear/conic direction in degrees or positions the focal center of radial gradients.',
        whatItMeans:
          '`angle` steers which way a `linear-gradient` flows (in compass degrees) or where a `conic-gradient` begins its sweep. For `radial-gradient`, `shape` and `position` choose where the circle/ellipse sits.',
        howItWorks:
          'In CSS linear gradients, `0deg` points **straight up** (bottom to top), `90deg` points **right** (left to right), `180deg` points **down** (top to bottom), and `135deg` sweeps diagonally from top-left to bottom-right.',
        values: [
          {
            value: '90deg',
            label: '90deg (Left → Right)',
            description: 'Horizontal sweep commonly used on progress bars and accent stripes.',
            applyProps: { type: 'linear', angle: 90 },
          },
          {
            value: '135deg',
            label: '135deg (Top-Left → Bottom-Right)',
            description: 'Natural top-left daylight direction that feels organic on UI cards.',
            applyProps: { type: 'linear', angle: 135 },
          },
          {
            value: '180deg',
            label: '180deg (Top → Bottom)',
            description: 'Vertical fade ideal for sky backdrops or image legibility scrims.',
            applyProps: { type: 'linear', angle: 180 },
          },
        ],
        whenToUse:
          'Pick `180deg` for vertical fades and photo overlays, `90deg` for horizontal progress indicators, and `135deg` for subtle diagonal surface sheen.',
        realWorldExample: {
          title: 'Readable Text Scrim Over Photo',
          description:
            'A `180deg` gradient from transparent (`0%`) to dark slate (`100%`) sits over card photos so white titles remain easy to read.',
        },
        codeExample: {
          css: `.diagonal-panel {\n  background-image: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%);\n}`,
          applyProps: {
            type: 'linear',
            angle: 135,
            stops: [
              { id: 1, color: '#1d4ed8', position: 0 },
              { id: 2, color: '#0ea5e9', position: 100 },
            ],
          },
        },
        commonMistakes: [
          {
            mistake: 'Assuming `0deg` starts on the left like in trigonometry.',
            fix: 'CSS gradient angles follow a **compass**: `0deg` points North (up), `90deg` East (right), `180deg` South (down).',
          },
        ],
        visualType: 'gradient-angle',
      },
      {
        id: 'stops',
        cssProperty: 'color-stop (% positions)',
        controlLabel: 'Color Stops',
        shortSummary: 'Places exact colors at percentage checkpoints along the gradient.',
        whatItMeans:
          '**Color stops** define which color appears at each percentage point (`0%` start to `100%` end) and how quickly one color fades into the next.',
        howItWorks:
          'Putting two stops far apart (`0%` and `100%`) creates a gradual blend. Putting two stops close together (e.g., `49%` and `50%`) creates a razor-sharp hard edge—allowing stripes, pie slices, or split backgrounds with pure CSS.',
        values: [
          {
            value: '0% → 100%',
            label: 'Smooth 2-Stop Blend',
            description: 'Clean gradual transition across the entire surface.',
            applyProps: {
              stops: [
                { id: 1, color: '#2563eb', position: 0 },
                { id: 2, color: '#14b8a6', position: 100 },
              ],
            },
          },
          {
            value: '0% · 50% · 100%',
            label: '3-Stop Depth',
            description: 'Adds a middle midpoint color to prevent muddy gray transitions.',
            applyProps: {
              stops: [
                { id: 1, color: '#1e3a8a', position: 0 },
                { id: 2, color: '#0ea5e9', position: 50 },
                { id: 3, color: '#14b8a6', position: 100 },
              ],
            },
          },
          {
            value: '50% / 50%',
            label: 'Hard Split Edge',
            description: 'Two stops at the exact same percentage create a crisp geometric split.',
            applyProps: {
              type: 'linear',
              angle: 135,
              stops: [
                { id: 1, color: '#1e293b', position: 50 },
                { id: 2, color: '#2563eb', position: 50 },
              ],
            },
          },
        ],
        whenToUse:
          'Add a subtle middle stop when blending complementary colors (so the middle stays vivid), or stack two stops at the same `%` for crisp split-tone graphics.',
        realWorldExample: {
          title: 'Conic Donut Progress Ring',
          description:
            'A `conic-gradient(#2563eb 0% 72%, #e2e8f0 72% 100%)` draws an exact 72% completion ring using two touching color stops at `72%`.',
        },
        codeExample: {
          css: `.hard-split {\n  background-image: linear-gradient(135deg, #1e293b 50%, #2563eb 50%);\n}`,
          applyProps: {
            type: 'linear',
            angle: 135,
            stops: [
              { id: 1, color: '#1e293b', position: 50 },
              { id: 2, color: '#2563eb', position: 50 },
            ],
          },
        },
        commonMistakes: [
          {
            mistake: 'Creating a `conic-gradient` whose `0%` and `100%` colors are different, leaving a harsh seam line at 12 o\'clock.',
            fix: 'For smooth full-circle conic wheels, repeat the starting color again at `100%`.',
          },
        ],
        visualType: 'gradient-stops',
      },
    ],
  },

  shadows: {
    id: 'shadows',
    name: 'Shadows',
    mentalModel:
      '`box-shadow` simulates physical elevation by casting a soft or crisp silhouette behind (or inside) an element. Layering two subtle shadows looks far more realistic than one heavy dark blur.',
    keyConcept:
      'Every `box-shadow` layer follows the same order: `offset-x offset-y blur-radius spread-radius color` (plus optional `inset`).',
    properties: [
      {
        id: 'xOffset',
        cssProperty: 'offset-x & offset-y',
        controlLabel: 'offset-x / offset-y',
        shortSummary: 'Moves the shadow left/right (`offset-x`) and up/down (`offset-y`) relative to the box.',
        whatItMeans:
          '`offset-x` and `offset-y` decide where the imaginary light source sits. Positive `offset-y` pushes the shadow **downward**, as if light shines from overhead.',
        howItWorks:
          'Real-world interfaces almost always simulate a light source slightly above the screen, so `offset-x: 0px` and a small positive `offset-y` (`4px` to `16px`) feels natural. Increasing `offset-y` makes a card appear to float higher off the page.',
        values: [
          {
            value: '0px 2px',
            label: 'Subtle Lift (0, 2px)',
            description: 'Low elevation for buttons, badges, and subtle interactive cards.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 2, blur: 6, spread: 0, color: '#0f172a', opacity: 0.12, inset: false }],
            },
          },
          {
            value: '0px 16px',
            label: 'Floating Modal (0, 16px)',
            description: 'High vertical offset for dropdown menus, popovers, and dialogs.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 16, blur: 32, spread: -4, color: '#0f172a', opacity: 0.16, inset: false }],
            },
          },
          {
            value: '6px 6px',
            label: 'Diagonal Hard Offset (6px, 6px)',
            description: 'Bold graphic offset shadow when paired with `0px` blur.',
            applyProps: {
              layers: [{ id: 1, x: 6, y: 6, blur: 0, spread: 0, color: '#0f172a', opacity: 0.9, inset: false }],
            },
          },
        ],
        whenToUse:
          'Keep `offset-x: 0` for clean overhead UI elevation, and scale `offset-y` up (`2px` -> `8px` -> `20px`) as components sit higher in z-index (cards -> dropdowns -> modals).',
        realWorldExample: {
          title: 'Elevation Scale Across UI Layers',
          description:
            'Cards sit at `y: 2px`, hover states lift to `y: 8px`, and modal dialogs float at `y: 20px` so depth communicates hierarchy.',
        },
        codeExample: {
          css: `.elevated-card {\n  box-shadow: 0px 12px 24px -4px rgba(15, 23, 42, 0.14);\n}`,
          applyProps: {
            layers: [{ id: 1, x: 0, y: 12, blur: 24, spread: -4, color: '#0f172a', opacity: 0.14, inset: false }],
          },
        },
        commonMistakes: [
          {
            mistake: 'Using random horizontal offsets (`x: 12px`) on different cards, making the page look unevenly lit.',
            fix: 'Pick one consistent light direction across your entire app (usually `offset-x: 0`).',
          },
        ],
        visualType: 'shadow-offset',
      },
      {
        id: 'blur',
        cssProperty: 'blur-radius & spread-radius',
        controlLabel: 'blur-radius / spread-radius',
        shortSummary: '`blur-radius` softens the shadow edge; `spread-radius` expands or shrinks the shadow footprint.',
        whatItMeans:
          '`blur-radius` controls how fuzzy or sharp the shadow edge is (`0px` = razor sharp). `spread-radius` grows (positive) or trims (negative) the shadow box before blurring.',
        howItWorks:
          'A **negative** `spread-radius` (like `-4px`) is a pro UI trick: it narrows the shadow slightly inward so it peeks out mainly below the card rather than looking muddy on the left and right edges. Meanwhile, `blur: 0px` with `spread: 1px` creates a crisp border-like ring that never shifts layout.',
        values: [
          {
            value: 'blur 0 · spread 1',
            label: '1px Crisp Ring',
            description: 'Zero blur + 1px spread creates a razor-sharp outline without altering box size.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 0, blur: 0, spread: 1, color: '#2563eb', opacity: 0.45, inset: false }],
            },
          },
          {
            value: 'blur 20 · spread -4',
            label: 'Refined Soft Shadow',
            description: 'Negative spread tucks side fuzziness inward for clean bottom depth.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 10, blur: 20, spread: -4, color: '#0f172a', opacity: 0.16, inset: false }],
            },
          },
          {
            value: 'blur 32 · spread 4',
            label: 'Wide Ambient Glow',
            description: 'Large blur + positive spread creates an even surrounding halo.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 0, blur: 32, spread: 4, color: '#2563eb', opacity: 0.25, inset: false }],
            },
          },
        ],
        whenToUse:
          'Pair a tight contact shadow (`blur: 4px`) with a wider ambient shadow (`blur: 24px, spread: -4px`) for natural card depth.',
        realWorldExample: {
          title: 'Two-Layer Modern Card Elevation',
          description:
            'Layer 1 adds a tight edge anchor (`0 1px 3px`) while Layer 2 casts soft distance (`0 12px 28px -4px`) at low opacity.',
        },
        codeExample: {
          css: `.card {\n  box-shadow:\n    0px 2px 6px 0px rgba(15, 23, 42, 0.08),\n    0px 12px 24px -4px rgba(15, 23, 42, 0.12);\n}`,
          applyProps: {
            layers: [
              { id: 1, x: 0, y: 2, blur: 6, spread: 0, color: '#0f172a', opacity: 0.08, inset: false },
              { id: 2, x: 0, y: 12, blur: 24, spread: -4, color: '#0f172a', opacity: 0.12, inset: false },
            ],
          },
        },
        commonMistakes: [
          {
            mistake: 'Using high opacity (`0.4`–`0.6`) with large blur, creating dirty gray smudges around cards.',
            fix: 'Keep shadow opacity low (`0.06`–`0.16`) on light backgrounds so shadows whisper instead of shouting.',
          },
        ],
        visualType: 'shadow-blur',
      },
      {
        id: 'inset',
        cssProperty: 'inset & rgba() opacity',
        controlLabel: 'inset / color & opacity',
        shortSummary: 'Flips the shadow inside the box for recessed inputs or pressed buttons, with `rgba()` alpha.',
        whatItMeans:
          'Adding the `inset` keyword pulls the shadow **inside** the element border instead of outside, making the surface look carved inward or pressed down.',
        howItWorks:
          'Because `box-shadow` sits over backgrounds, `rgba(r, g, b, opacity)` lets the underlying page tint show through the shadow cleanly.',
        values: [
          {
            value: 'outer',
            label: 'Outer (Raised)',
            description: 'Shadow falls outside the card, making it pop forward toward the viewer.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 8, blur: 20, spread: -2, color: '#0f172a', opacity: 0.14, inset: false }],
            },
          },
          {
            value: 'inset',
            label: 'Inset (Recessed)',
            description: 'Shadow falls along the inner top/left edge, making the box look sunken in.',
            applyProps: {
              layers: [{ id: 1, x: 0, y: 3, blur: 8, spread: 0, color: '#0f172a', opacity: 0.18, inset: true }],
            },
          },
        ],
        whenToUse:
          'Use `inset` on `:active` pressed button states, text input wells, and progress bar tracks.',
        realWorldExample: {
          title: 'Recessed Search Input Field',
          description:
            'A subtle `inset 0 2px 4px rgba(15, 23, 42, 0.08)` makes an input field look slightly sunken below the form surface.',
        },
        codeExample: {
          css: `.recessed-input {\n  box-shadow: inset 0px 2px 8px 0px rgba(15, 23, 42, 0.16);\n}`,
          applyProps: {
            layers: [{ id: 1, x: 0, y: 2, blur: 8, spread: 0, color: '#0f172a', opacity: 0.16, inset: true }],
          },
        },
        commonMistakes: [
          {
            mistake: 'Using `inset` shadows on dark surfaces with dark black shadow colors—the shadow becomes invisible.',
            fix: 'On dark cards, either add a crisp `1px` top highlight (`inset 0 1px 0 rgba(255,255,255,0.08)`) or rely on subtle borders.',
          },
        ],
        visualType: 'shadow-inset',
      },
    ],
  },

  borders: {
    id: 'borders',
    name: 'Borders',
    mentalModel:
      '`border` builds the visible frame and rounded corners of an element, while `outline` draws an extra ring **outside** the border without ever nudging nearby elements.',
    keyConcept:
      'Use `border` for permanent component edges and `outline` (with `outline-offset`) for keyboard `:focus-visible` accessibility rings.',
    properties: [
      {
        id: 'borderStyle',
        cssProperty: 'border-style & border-width & border-color',
        controlLabel: 'border-style / width / color',
        shortSummary: 'Chooses the line pattern (`solid`, `dashed`, `dotted`, `double`), thickness, and stroke color.',
        whatItMeans:
          '`border-style` selects what kind of stroke wraps the element edge; `border-width` sets its pixel thickness; `border-color` sets its ink.',
        howItWorks:
          'Unlike `outline`, borders occupy real layout space inside the box model. Even a subtle `1px solid` border separates white cards cleanly on light gray backgrounds without needing heavy drop shadows.',
        values: [
          {
            value: 'solid',
            label: 'solid',
            description: 'Continuous crisp line—the everyday workhorse for cards, inputs, and dividers.',
            applyProps: { borderStyle: 'solid', borderWidth: 2 },
          },
          {
            value: 'dashed',
            label: 'dashed',
            description: 'Segmented dashes—universally signals file dropzones or add-new placeholders.',
            applyProps: { borderStyle: 'dashed', borderWidth: 2 },
          },
          {
            value: 'dotted',
            label: 'dotted',
            description: 'Small circular dots—useful for subtle underline cues or decorative frames.',
            applyProps: { borderStyle: 'dotted', borderWidth: 3 },
          },
          {
            value: 'double',
            label: 'double',
            description: 'Two parallel strokes (requires at least `3px` width to see the gap clearly).',
            applyProps: { borderStyle: 'double', borderWidth: 6 },
          },
        ],
        whenToUse:
          'Use `1px solid` for UI containers, `2px dashed` for drag-and-drop upload zones, and `double` (`>= 4px`) for formal certificates or callout frames.',
        realWorldExample: {
          title: 'File Upload Dropzone',
          description:
            'A `2px dashed #64748b` border paired with `border-radius: 12px` visually invites users to drag files inside.',
        },
        codeExample: {
          css: `.dropzone {\n  border: 2px dashed #64748b;\n  border-radius: 12px;\n}`,
          applyProps: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#64748b', linkRadius: true, radiusTL: 12, radiusTR: 12, radiusBR: 12, radiusBL: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Changing `border-width` from `1px` to `2px` on hover, causing text inside the button or adjacent elements to jitter.',
            fix: 'Keep `border-width` constant on hover (only swap `border-color`) or use `outline` / `box-shadow` for thickness changes.',
          },
        ],
        visualType: 'border-style',
      },
      {
        id: 'borderRadius',
        cssProperty: 'border-radius',
        controlLabel: 'border-radius',
        shortSummary: 'Rounds corners uniformly or sets distinct radii per corner (TL, TR, BR, BL).',
        whatItMeans:
          '`border-radius` softens sharp 90-degree corners into smooth arcs—from subtle `6px` UI corners up to asymmetric leaf shapes or full circles.',
        howItWorks:
          'One value (`border-radius: 12px`) rounds all four corners equally. Four values (`28px 4px 28px 4px`) go clockwise starting from **top-left -> top-right -> bottom-right -> bottom-left**. Pro tip: when placing an inner box inside a rounded outer card with padding `P`, set `innerRadius = outerRadius - P` so corners look concentric.',
        values: [
          {
            value: '0px',
            label: '0px (Sharp)',
            description: 'Crisp architectural 90-degree corners.',
            applyProps: { linkRadius: true, radiusTL: 0, radiusTR: 0, radiusBR: 0, radiusBL: 0 },
          },
          {
            value: '10px',
            label: '10px (UI Card)',
            description: 'Balanced, approachable corner rounding for cards and inputs.',
            applyProps: { linkRadius: true, radiusTL: 10, radiusTR: 10, radiusBR: 10, radiusBL: 10 },
          },
          {
            value: '28px 4px 28px 4px',
            label: 'Asymmetric (28/4)',
            description: 'Alternating corner radii create bespoke directional shapes or chat bubbles.',
            applyProps: { linkRadius: false, radiusTL: 28, radiusTR: 4, radiusBR: 28, radiusBL: 4 },
          },
        ],
        whenToUse:
          'Pick a small consistent radius scale (`4px`, `8px`, `12px`) across your UI, and use individual corners for chat bubbles (`16px 16px 16px 4px`) or attached input-button pairs.',
        realWorldExample: {
          title: 'Chat Message Bubble',
          description:
            'Setting three corners to `16px` and the bottom-left corner to `4px` gives a clean speech-bubble tail without SVG paths.',
        },
        codeExample: {
          css: `.chat-bubble {\n  border: 2px solid #0284c7;\n  border-radius: 28px 4px 28px 4px;\n}`,
          applyProps: { borderColor: '#0284c7', linkRadius: false, radiusTL: 28, radiusTR: 4, radiusBR: 28, radiusBL: 4 },
        },
        commonMistakes: [
          {
            mistake: 'Adding `border-radius` to a card containing an `<img>` and noticing the square image corners poke over the rounded card edge.',
            fix: 'Add `overflow: hidden` on the rounded parent card (or apply `border-radius` directly to the image).',
          },
        ],
        visualType: 'border-radius',
      },
      {
        id: 'outline',
        cssProperty: 'outline & outline-offset',
        controlLabel: 'outline / outline-offset',
        shortSummary: 'Draws a non-layout-shifting ring outside the border with customizable gap spacing.',
        whatItMeans:
          '`outline` paints a stroke **outside** the element\'s border box without taking up any layout space, and `outline-offset` pushes that ring outward (or inward if negative).',
        howItWorks:
          'Unlike `border`, toggling `outline: 2px solid #2563eb` on `:focus-visible` never shifts neighboring buttons or resizes the box. `outline-offset: 4px` adds a clean 4px breathing gap between the button border and the focus ring so both stay visible.',
        values: [
          {
            value: 'none',
            label: 'None',
            description: 'No outer ring (never remove focus outlines on keyboard `:focus-visible` without a replacement!).',
            applyProps: { outlineStyle: 'none', outlineWidth: 0, outlineOffset: 0 },
          },
          {
            value: '2px solid · 4px offset',
            label: 'Accessible Focus Ring',
            description: 'Crisp `2px` outer ring separated cleanly by a `4px` gap.',
            applyProps: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: '#2563eb', outlineOffset: 4 },
          },
          {
            value: '2px dashed · -6px offset',
            label: 'Inset Stitched Ring',
            description: 'Negative offset pulls the dashed outline inside the element edge.',
            applyProps: { outlineStyle: 'dashed', outlineWidth: 2, outlineColor: '#2563eb', outlineOffset: -8 },
          },
        ],
        whenToUse:
          'Always use `outline` + `outline-offset` for keyboard `:focus-visible` rings so keyboard users clearly see where focus sits without layout jumps.',
        realWorldExample: {
          title: 'WCAG Accessible Focus Ring',
          description:
            'Dark buttons use `outline: 2px solid #2563eb; outline-offset: 3px;` on `:focus-visible` so the blue ring contrasts against both the dark button and the white page.',
        },
        codeExample: {
          css: `.btn:focus-visible {\n  outline: 2px solid #2563eb;\n  outline-offset: 4px;\n}`,
          applyProps: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: '#2563eb', outlineOffset: 4 },
        },
        commonMistakes: [
          {
            mistake: 'Writing `*:focus { outline: none; }` to hide focus rings, making the site unusable for keyboard-only users.',
            fix: 'Use `:focus-visible` instead of `:focus` so mouse clicks stay clean while `Tab` keyboard navigation gets a clear `outline`.',
          },
        ],
        visualType: 'border-outline',
      },
    ],
  },
};
