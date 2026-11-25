export const MOTION_GUIDES = {
  transforms: {
    id: 'transforms',
    name: 'Transforms',
    mentalModel:
      '`transform` moves, spins, scales, or tilts an element visually on the GPU compositor **without altering layout flow**. Notice the dashed ghost box in the preview—the browser still reserves space at the original ghost spot.',
    keyConcept:
      'Because transforms skip expensive layout recalculations, animating `transform` runs at a silky-smooth 60fps compared to animating `top`, `left`, or `width`.',
    properties: [
      {
        id: 'translate',
        cssProperty: 'translateX() & translateY()',
        controlLabel: 'translateX / translateY',
        shortSummary: 'Slides an element horizontally or vertically without pushing neighboring elements around.',
        whatItMeans:
          '`translate(x, y)` shifts an element visually from its resting spot (`0px, 0px`). Positive `X` moves **right**, and positive `Y` moves **down** (negative `Y` lifts **up**).',
        howItWorks:
          'Unlike `margin-top` or `left`, `transform: translateY(-8px)` leaves neighboring cards completely still. The preview\'s dashed ghost outline shows where the box still lives in the document flow.',
        values: [
          {
            value: '0px, 0px',
            label: 'Rest Position',
            description: 'Sits squarely inside its original ghost box.',
            applyProps: { translateX: 0, translateY: 0 },
          },
          {
            value: '0px, -16px',
            label: 'Hover Lift (Y: -16px)',
            description: 'Moves the card upward cleanly on hover without nudging rows below.',
            applyProps: { translateX: 0, translateY: -16, rotate: 0, scale: 1.03 },
          },
          {
            value: '28px, 12px',
            label: 'Diagonal Shift',
            description: 'Slides right 28px and down 12px while keeping original space reserved.',
            applyProps: { translateX: 28, translateY: 12 },
          },
        ],
        whenToUse:
          'Use `translate` for hover card lifts, slide-in drawers (`translateX(-100%)` to `0`), and tooltip offsets.',
        realWorldExample: {
          title: 'Off-Canvas Slide-Out Drawer',
          description:
            'Mobile navigation menus start at `transform: translateX(-100%)` off-screen and slide smoothly to `translateX(0)` when opened.',
        },
        codeExample: {
          css: `.lift-card {\n  transform: translate(0px, -12px) scale(1.04);\n}`,
          applyProps: { translateX: 0, translateY: -12, rotate: 0, scale: 1.04, skewX: 0, skewY: 0, rotateX: 0, rotateY: 0 },
        },
        commonMistakes: [
          {
            mistake: 'Using `margin-top: -8px` on `:hover` instead of `transform: translateY(-8px)`, which causes surrounding content to jump.',
            fix: 'Always use `transform: translateY()` for hover lifts so layout stays rock-steady.',
          },
        ],
        visualType: 'transform-translate',
      },
      {
        id: 'rotate',
        cssProperty: 'rotate() & skewX() / skewY()',
        controlLabel: 'rotate / skewX / skewY',
        shortSummary: 'Spins an element around its pivot (`deg`) or slants its edges along X/Y axes.',
        whatItMeans:
          '`rotate(deg)` turns an element clockwise (positive) or counter-clockwise (negative) in 2D space. `skewX` / `skewY` tilts vertical or horizontal edges into a parallelogram.',
        howItWorks:
          'Both transformations pivot around `transform-origin` (center by default). Small rotations (`2deg`–`15deg` or `180deg` for chevron arrows) add crisp visual cues; subtle `skewX` creates dynamic diagonal badges or kinetic motion lines.',
        values: [
          {
            value: '0deg',
            label: '0deg (Level)',
            description: 'Unrotated, crisp horizontal alignment.',
            applyProps: { rotate: 0, skewX: 0, skewY: 0 },
          },
          {
            value: '18deg',
            label: 'rotate(18deg)',
            description: 'Tilts clockwise 18 degrees around `transform-origin`.',
            applyProps: { rotate: 18, skewX: 0, skewY: 0 },
          },
          {
            value: 'skewX(-14deg)',
            label: 'skewX(-14deg)',
            description: 'Slants vertical edges for dynamic badges or angled stripes.',
            applyProps: { rotate: 0, skewX: -14, skewY: 0 },
          },
        ],
        whenToUse:
          'Use `rotate(180deg)` to flip accordion chevron arrows when open, and tiny `rotate(-2deg)` / `skewX` sparingly for playful badges or stickers.',
        realWorldExample: {
          title: 'Accordion Chevron Flip',
          description:
            'When an FAQ item expands, its chevron icon transitions smoothly to `transform: rotate(180deg)` to show it is open.',
        },
        codeExample: {
          css: `.tilted-badge {\n  transform: rotate(-3deg) skewX(-12deg);\n}`,
          applyProps: { rotate: -3, skewX: -12, skewY: 0, translateX: 0, translateY: 0 },
        },
        commonMistakes: [
          {
            mistake: 'Writing two separate `transform` rules (`transform: rotate(15deg); transform: scale(1.1);`)—the second overwrites the first!',
            fix: 'Combine all transform functions in one declaration separated by spaces: `transform: rotate(15deg) scale(1.1);`.',
          },
        ],
        visualType: 'transform-rotate',
      },
      {
        id: 'scale',
        cssProperty: 'scale()',
        controlLabel: 'scale',
        shortSummary: 'Shrinks (`< 1`) or enlarges (`> 1`) an element visually without shifting neighbors.',
        whatItMeans:
          '`scale()` multiplies an element\'s rendered width and height (`1` = 100% original size, `1.2` = 120%, `0.8` = 80%).',
        howItWorks:
          'Because `scale()` happens after layout, enlarging a thumbnail card on hover (`scale(1.05)`) won\'t push nearby grid cards sideways. Note that text inside a scaled element scales along with the box.',
        values: [
          {
            value: '0.85',
            label: '0.85× (Pressed / Compact)',
            description: 'Subtle shrink feedback when a button is clicked or popped out.',
            applyProps: { scale: 0.85 },
          },
          {
            value: '1',
            label: '1.0× (Original)',
            description: 'Natural 100% size.',
            applyProps: { scale: 1 },
          },
          {
            value: '1.25',
            label: '1.25× (Zoomed Focus)',
            description: 'Enlarges an image or avatar cleanly inside an `overflow: hidden` frame.',
            applyProps: { scale: 1.25 },
          },
        ],
        whenToUse:
          'Use subtle `scale(1.03)`–`scale(1.08)` on photo thumbnails (inside `overflow: hidden`) and `scale(0.97)` on `:active` button presses for tactile feedback.',
        realWorldExample: {
          title: 'Image Zoom Inside Card Frame',
          description:
            'A card thumbnail wrapper has `overflow: hidden`, and hovering scales the inner `<img>` to `scale(1.06)` without changing the card dimensions.',
        },
        codeExample: {
          css: `.zoom-card:hover {\n  transform: scale(1.08);\n}`,
          applyProps: { scale: 1.08, rotate: 0, translateX: 0, translateY: 0 },
        },
        commonMistakes: [
          {
            mistake: 'Using large `scale(1.5)` on cards containing crisp body text, making letters look slightly soft on some displays.',
            fix: 'Keep text-card scale boosts subtle (`1.02`–`1.06`), or apply larger `scale()` only to images and icons.',
          },
        ],
        visualType: 'transform-scale',
      },
      {
        id: 'perspective',
        cssProperty: 'perspective & rotateX() / rotateY()',
        controlLabel: 'perspective / rotateX / rotateY',
        shortSummary: 'Adds 3D camera depth so tilting around X or Y axes looks genuinely three-dimensional.',
        whatItMeans:
          '`perspective(px)` sets how close the virtual camera sits to the element (`400px` = dramatic 3D angle, `1200px` = subtle flat angle), unlocking realistic `rotateX` (nodding forward/back) and `rotateY` (turning left/right).',
        howItWorks:
          'Without `perspective()`, `rotateY(45deg)` just squishes the box horizontally like a flat sticker. Adding `perspective(520px)` causes the closer edge to appear larger and the farther edge smaller, creating true 3D depth.',
        values: [
          {
            value: '400px · 3D Tilt',
            label: 'Dramatic 3D (400px)',
            description: 'Close camera distance exaggerates perspective foreshortening.',
            applyProps: { perspective: 400, rotateX: 18, rotateY: -22, rotate: 0 },
          },
          {
            value: '900px · Subtle 3D',
            label: 'Subtle Tilt (900px)',
            description: 'Distant camera creates a refined, understated 3D card angle.',
            applyProps: { perspective: 900, rotateX: 10, rotateY: -12, rotate: 0 },
          },
        ],
        whenToUse:
          'Use `perspective` with `rotateX` / `rotateY` for interactive 3D card-flip reveals or subtle pointer-tracking showcase cards.',
        realWorldExample: {
          title: 'Interactive Credit Card 3D Preview',
          description:
            'Tilting a payment card with `perspective(520px) rotateX(16deg) rotateY(-18deg)` gives immediate depth without WebGL.',
        },
        codeExample: {
          css: `.card-3d {\n  transform: perspective(520px) rotateX(16deg) rotateY(-18deg);\n}`,
          applyProps: { perspective: 520, rotateX: 16, rotateY: -18, rotate: 0, translateX: 0, translateY: 0, scale: 1 },
        },
        commonMistakes: [
          {
            mistake: 'Writing `rotateY(30deg) perspective(500px)` with `perspective()` at the end instead of the start.',
            fix: 'When using `perspective()` inside `transform`, always place `perspective(...)` **first** in the list.',
          },
        ],
        visualType: 'transform-3d',
      },
      {
        id: 'transformOrigin',
        cssProperty: 'transform-origin',
        controlLabel: 'transform-origin',
        shortSummary: 'Moves the anchor pin around which rotations, scales, and skews pivot.',
        whatItMeans:
          '`transform-origin` decides which point of the element stays nailed down while `rotate()` or `scale()` happens.',
        howItWorks:
          'By default (`center center`), a box spins around its midpoint and scales outward equally in all directions. Changing `transform-origin` to `top left` pins the top-left corner—so scaling grows strictly down-and-right like a dropdown menu unfolding from a corner button!',
        values: [
          {
            value: 'center center',
            label: 'center center (Default)',
            description: 'Pivots symmetrically from the middle of the box.',
            applyProps: { transformOrigin: 'center center', rotate: 18 },
          },
          {
            value: 'top left',
            label: 'top left',
            description: 'Hinges from the top-left corner—ideal for dropdowns opening below a left-aligned trigger.',
            applyProps: { transformOrigin: 'top left', rotate: 18 },
          },
          {
            value: 'bottom center',
            label: 'bottom center',
            description: 'Hinges from the bottom middle—great for tooltips popping up above a button.',
            applyProps: { transformOrigin: 'bottom center', rotate: 18 },
          },
        ],
        whenToUse:
          'Match `transform-origin` to the trigger edge on popovers and dropdown menus (`top right` for a right-aligned menu button) so scaling animations originate naturally from the button.',
        realWorldExample: {
          title: 'Origin-Matched Dropdown Menu',
          description:
            'A profile menu anchored under a top-right avatar sets `transform-origin: top right` so it scales open smoothly from the avatar corner.',
        },
        codeExample: {
          css: `.corner-hinge {\n  transform: rotate(18deg) scale(0.95);\n  transform-origin: top left;\n}`,
          applyProps: { transformOrigin: 'top left', rotate: 18, scale: 0.95, translateX: 0, translateY: 0 },
        },
        commonMistakes: [
          {
            mistake: 'Trying to animate `transform-origin` smoothly—changing origin mid-animation causes sudden jumps.',
            fix: 'Set `transform-origin` statically in the base rule so both resting and active states share the same pivot.',
          },
        ],
        visualType: 'transform-origin',
      },
    ],
  },

  transitions: {
    id: 'transitions',
    name: 'Transitions',
    mentalModel:
      '`transition` acts as a shock absorber between two CSS states (such as resting vs `:hover`). Instead of snapping abruptly in 1 frame, the browser smoothly blends the changed property over your chosen duration and easing curve.',
    keyConcept:
      'Put `transition` on the **base** element rule—not only inside `:hover`—so it animates smoothly both when hovering IN and when moving OUT.',
    properties: [
      {
        id: 'property',
        cssProperty: 'transition-property',
        controlLabel: 'transition-property',
        shortSummary: 'Chooses exactly which CSS properties should animate smoothly when changed.',
        whatItMeans:
          '`transition-property` names the specific CSS property (or `all`) that the browser should interpolate instead of changing instantaneously.',
        howItWorks:
          'Setting `transition-property: transform` animates only movement/scaling while letting background color snap immediately—or using `all` (or comma-separated `transform, background-color, opacity`) smoothly blends every changed property together.',
        values: [
          {
            value: 'all',
            label: 'all',
            description: 'Smoothly transitions every animatable property that changes on hover/active.',
            applyProps: { property: 'all' },
          },
          {
            value: 'transform',
            label: 'transform',
            description: 'Animates only GPU-friendly motion (`translate`, `scale`, `rotate`), leaving color instant.',
            applyProps: { property: 'transform' },
          },
          {
            value: 'background-color',
            label: 'background-color',
            description: 'Cross-fades only surface color changes while position stays instant.',
            applyProps: { property: 'background-color' },
          },
          {
            value: 'border-radius',
            label: 'border-radius',
            description: 'Smoothly morphs corner roundness between states.',
            applyProps: { property: 'border-radius', targetRadius: 32 },
          },
        ],
        whenToUse:
          'In production apps, prefer naming exact fast properties (`transform, opacity, background-color`) over `all` so unintended properties like `width` or `padding` don\'t accidentally animate during resize.',
        realWorldExample: {
          title: 'Responsive Button Polish',
          description:
            'A CTA button sets `transition: transform 180ms ease-out, background-color 180ms ease-out` so hover feedback feels immediate without layout lag.',
        },
        codeExample: {
          css: `.cta-button {\n  transition-property: transform;\n  transition-duration: 240ms;\n  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);\n}`,
          applyProps: { property: 'transform', duration: 240, timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        commonMistakes: [
          {
            mistake: 'Expecting `transition: all` to animate `display: none` to `display: block`.',
            fix: 'Discrete layout switches like `display` cannot transition smoothly by default. Animate `opacity` and `transform` instead.',
          },
        ],
        visualType: 'transition-property',
      },
      {
        id: 'duration',
        cssProperty: 'transition-duration',
        controlLabel: 'transition-duration',
        shortSummary: 'Sets how many milliseconds (`ms`) or seconds (`s`) the transition takes from start to finish.',
        whatItMeans:
          '`transition-duration` sets the total length of the motion. Without a duration greater than `0`, changes happen instantly.',
        howItWorks:
          'Human perception judges UI speed finely: `120ms`–`220ms` feels crisp and responsive for buttons and hover states; `250ms`–`400ms` suits larger panels and drawers; anything over `600ms` starts feeling sluggish for routine clicks.',
        values: [
          {
            value: '140ms',
            label: '140ms (Crisp Micro)',
            description: 'Snappy hover color and lift feedback on buttons and links.',
            applyProps: { duration: 140 },
          },
          {
            value: '260ms',
            label: '260ms (Balanced UI)',
            description: 'Smooth settling for cards, switches, and small drawers.',
            applyProps: { duration: 260 },
          },
          {
            value: '650ms',
            label: '650ms (Slow Showcase)',
            description: 'Deliberate slow motion useful for inspecting easing curves.',
            applyProps: { duration: 650 },
          },
        ],
        whenToUse:
          'Stick to `150ms`–`240ms` for everyday UI interactions so the interface always feels fast and never makes users wait.',
        realWorldExample: {
          title: 'Toggle Switch Knob',
          description:
            'A `180ms` duration lets the toggle thumb glide visibly across the track without delaying repeated clicks.',
        },
        codeExample: {
          css: `.toggle-knob {\n  transition-duration: 180ms;\n}`,
          applyProps: { duration: 180 },
        },
        commonMistakes: [
          {
            mistake: 'Setting `500ms+` transitions on dropdown menus or hover buttons.',
            fix: 'Keep interactive UI transitions under `250ms` so the app feels agile.',
          },
        ],
        visualType: 'transition-duration',
      },
      {
        id: 'timingFunction',
        cssProperty: 'transition-timing-function',
        controlLabel: 'timing-function',
        shortSummary: 'Shapes the acceleration curve—fast start, smooth settle, steady linear, or springy overshoot.',
        whatItMeans:
          '`transition-timing-function` controls **how speed changes** during the transition rather than moving robotically at one flat pace.',
        howItWorks:
          '`linear` moves at constant speed (good for continuous spinners, robotic for UI). `ease-out` / `Expo Out` launches quickly right when you hover and decelerates gently into place—feeling natural and snappy. `Spring Overshoot` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) pushes slightly past `100%` before bouncing back.',
        values: [
          {
            value: 'cubic-bezier(0.16, 1, 0.3, 1)',
            label: 'Expo Out (UI)',
            description: 'Instant launch with ultra-smooth deceleration—gold standard for modern UI.',
            applyProps: { timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: 260 },
          },
          {
            value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            label: 'Spring Overshoot',
            description: 'Bounces slightly past the target before settling—playful tactile feel.',
            applyProps: { timingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: 420 },
          },
          {
            value: 'ease-in-out',
            label: 'ease-in-out',
            description: 'Starts slowly, speeds up in the middle, and slows down at the end.',
            applyProps: { timingFunction: 'ease-in-out', duration: 320 },
          },
          {
            value: 'linear',
            label: 'linear',
            description: 'Constant, flat speed from start to finish with zero acceleration.',
            applyProps: { timingFunction: 'linear', duration: 320 },
          },
        ],
        whenToUse:
          'Use `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)` for elements entering or responding to hover; use `ease-in-out` when moving an element from A to B inside the screen.',
        realWorldExample: {
          title: 'Like Button Pop',
          description:
            'Using `cubic-bezier(0.34, 1.56, 0.64, 1)` makes a heart icon briefly pop to 112% before settling back to 100%.',
        },
        codeExample: {
          css: `.spring-btn {\n  transition: transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);\n}`,
          applyProps: { property: 'transform', duration: 420, timingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', targetTranslateY: -12, targetScale: 1.08 },
        },
        commonMistakes: [
          {
            mistake: 'Using `ease-in` on hover buttons, which starts slowly and makes the button feel laggy at the moment of click.',
            fix: 'Prefer `ease-out` or `Expo Out` so the element responds on the very first frame.',
          },
        ],
        visualType: 'transition-easing',
      },
      {
        id: 'delay',
        cssProperty: 'transition-delay',
        controlLabel: 'transition-delay',
        shortSummary: 'Pauses for a chosen number of milliseconds before starting the transition.',
        whatItMeans:
          '`transition-delay` tells the browser to wait `X` milliseconds after a state change before beginning the animation.',
        howItWorks:
          'A `0ms` delay starts immediately. Adding a tiny `120ms`–`300ms` delay stops tooltips or hover menus from flashing abruptly when a user\'s mouse merely sweeps across the page.',
        values: [
          {
            value: '0ms',
            label: '0ms (Immediate)',
            description: 'Reacts instantaneously on hover or focus.',
            applyProps: { delay: 0 },
          },
          {
            value: '160ms',
            label: '160ms (Hover Intent)',
            description: 'Brief pause prevents accidental flicker on tooltips.',
            applyProps: { delay: 160 },
          },
          {
            value: '400ms',
            label: '400ms (Staggered Wait)',
            description: 'Creates deliberate choreographed sequencing after another element finishes.',
            applyProps: { delay: 400 },
          },
        ],
        whenToUse:
          'Keep `delay: 0ms` for buttons and clicks; use a short `120ms–250ms` delay for hover tooltips or staggered multi-item reveals.',
        realWorldExample: {
          title: 'Non-Annoying Icon Tooltip',
          description:
            'Setting `transition-delay: 200ms` on tooltips prevents them from popping open while the cursor glides quickly across toolbar buttons.',
        },
        codeExample: {
          css: `.tooltip {\n  transition: opacity 160ms ease-out 200ms;\n}`,
          applyProps: { duration: 160, timingFunction: 'ease-out', delay: 200 },
        },
        commonMistakes: [
          {
            mistake: 'Adding `transition-delay` to primary buttons, making users think the button is broken or slow.',
            fix: 'Always keep `transition-delay: 0ms` on direct click/tap controls.',
          },
        ],
        visualType: 'transition-delay',
      },
    ],
  },

  animations: {
    id: 'animations',
    name: 'Animations',
    mentalModel:
      'Unlike `transition` (which only blends between two states when triggered), CSS `@keyframes` animations run multi-step timelines automatically—capable of looping infinitely, alternating direction, and staggering across items.',
    keyConcept:
      'An animation pairs a named `@keyframes` storyboard (`0%` -> `50%` -> `100%`) with playback rules (`duration`, `iteration-count`, `direction`, and `fill-mode`).',
    properties: [
      {
        id: 'keyframe',
        cssProperty: '@keyframes & animation-name',
        controlLabel: '@keyframes',
        shortSummary: 'Selects the multi-step motion choreography (`float`, `bounce`, `spin`, `pulse`, `shake`, `slide-in`).',
        whatItMeans:
          '`@keyframes` defines the visual milestones of an animation from `0%` (start) through `50%` (midpoint) to `100%` (finish), and `animation-name` attaches that sequence to an element.',
        howItWorks:
          'You write a `@keyframes` block once, and any element can play it at its own speed, delay, or repeat count. Each keyframe step describes CSS properties like `transform` and `opacity` at that percentage of the timeline.',
        values: [
          {
            value: 'float',
            label: 'float',
            description: 'Gentle vertical levitation with a subtle tilt—ideal for ambient cards or icons.',
            applyProps: { keyframe: 'float', duration: 2.2, direction: 'alternate', iterationCount: 'infinite' },
          },
          {
            value: 'pulse',
            label: 'pulse',
            description: 'Rhythmic scale and opacity breathing for loading skeletons or beacons.',
            applyProps: { keyframe: 'pulse', duration: 1.6, direction: 'normal', iterationCount: 'infinite' },
          },
          {
            value: 'spin',
            label: 'spin',
            description: 'Smooth 360-degree continuous rotation—classic loading spinner motion.',
            applyProps: { keyframe: 'spin', duration: 1.4, timingFunction: 'linear', direction: 'normal', iterationCount: 'infinite' },
          },
          {
            value: 'shake',
            label: 'shake',
            description: 'Quick horizontal wiggle used to draw attention to invalid form inputs.',
            applyProps: { keyframe: 'shake', duration: 0.5, direction: 'normal', iterationCount: '2' },
          },
        ],
        whenToUse:
          'Use `spin` (`linear`) for loading indicators, `pulse` for skeleton loaders, `slide-in` for entrance reveals, and `shake` briefly on validation errors.',
        realWorldExample: {
          title: 'Invalid Password Shake Feedback',
          description:
            'Running a short `0.45s` horizontal `shake` animation on a wrong password input gives instant tactile error feedback alongside clear error text.',
        },
        codeExample: {
          css: `@keyframes stylelab-float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-14px); }\n}\n.hero-badge {\n  animation: stylelab-float 2.2s ease-in-out infinite alternate;\n}`,
          applyProps: { keyframe: 'float', duration: 2.2, timingFunction: 'ease-in-out', iterationCount: 'infinite', direction: 'alternate' },
        },
        commonMistakes: [
          {
            mistake: 'Playing heavy infinite bouncing animations without respecting `prefers-reduced-motion`.',
            fix: 'Wrap decorative animations in `@media (prefers-reduced-motion: reduce)` so motion-sensitive users get a calm experience.',
          },
        ],
        visualType: 'anim-keyframe',
      },
      {
        id: 'duration',
        cssProperty: 'animation-duration & delay & stagger',
        controlLabel: 'duration / delay / stagger',
        shortSummary: 'Sets cycle length in seconds (`s`), start wait, and per-item stagger offset.',
        whatItMeans:
          '`animation-duration` controls how long one full `0% -> 100%` cycle lasts. `animation-delay` waits before starting, and **staggering** gives each item a slightly larger delay (`idx * 120ms`) so items cascade like dominoes.',
        howItWorks:
          'Notice how adding a second and third preview box in StyleLab lets `item stagger` create a rhythmic wave across boxes without changing the `@keyframes` block at all.',
        values: [
          {
            value: '0.6s · 0s delay',
            label: 'Fast Entrance (0.6s)',
            description: 'Brisk entrance or alert shake that finishes cleanly without holding up the user.',
            applyProps: { duration: 0.6, delay: 0, staggerMs: 100 },
          },
          {
            value: '2.0s · 140ms stagger',
            label: 'Staggered Wave (2.0s)',
            description: 'Each item launches 140ms after the previous item for rhythmic flow.',
            applyProps: { duration: 2.0, delay: 0, staggerMs: 140 },
          },
        ],
        whenToUse:
          'Keep UI entrance animations crisp (`0.3s`–`0.7s`) with small staggers (`40ms`–`120ms`), and use slower `1.8s`–`3.0s` cycles for gentle ambient loops.',
        realWorldExample: {
          title: 'Staggered List Entrance',
          description:
            'Dashboard cards entering with `animation-delay: calc(var(--i) * 80ms)` appear in a smooth waterfall instead of popping in all at once.',
        },
        codeExample: {
          css: `.item-2 {\n  animation-duration: 1.8s;\n  animation-delay: 0.14s;\n}`,
          applyProps: { duration: 1.8, delay: 0, staggerMs: 140 },
        },
        commonMistakes: [
          {
            mistake: 'Making `staggerMs` too large across 10+ list items so the last item takes 3 seconds to appear.',
            fix: 'Keep per-item stagger small (`40ms`–`100ms`) and cap total delay under `500ms`.',
          },
        ],
        visualType: 'anim-timing',
      },
      {
        id: 'iterationCount',
        cssProperty: 'animation-iteration-count',
        controlLabel: 'iteration-count',
        shortSummary: 'Chooses how many times the animation plays (`1`, `2`, `3`, or `infinite`).',
        whatItMeans:
          '`animation-iteration-count` defines whether an animation runs once (`1`), repeats a fixed number of times (`2`, `3`), or loops forever (`infinite`).',
        howItWorks:
          'One-shot entrance effects (like `slide-in`) should run `1` time and stop. Error attention shakes work best at `2` or `3` repeats. Loading spinners run `infinite`.',
        values: [
          {
            value: '1',
            label: '1 (Play Once)',
            description: 'Runs a single cycle—standard for entrance animations.',
            applyProps: { iterationCount: '1', keyframe: 'slide-in', fillMode: 'both' },
          },
          {
            value: '3',
            label: '3 (Attention Burst)',
            description: 'Repeats three times then rests—great for alerts or nudges.',
            applyProps: { iterationCount: '3', keyframe: 'shake', duration: 0.6 },
          },
          {
            value: 'infinite',
            label: 'infinite (Loop)',
            description: 'Loops continuously—use for loading spinners or calm ambient states.',
            applyProps: { iterationCount: 'infinite', keyframe: 'spin', timingFunction: 'linear' },
          },
        ],
        whenToUse:
          'Use `1` for page-load reveals so motion settles cleanly, and reserve `infinite` for active loaders or ultra-subtle ambient cues.',
        realWorldExample: {
          title: 'Single-Play Modal Entrance',
          description:
            'A dialog fades and slides upward once (`iteration-count: 1`) when mounted, then sits completely still while the user reads.',
        },
        codeExample: {
          css: `.modal-enter {\n  animation: stylelab-slide-in 0.4s ease-out 1 both;\n}`,
          applyProps: { keyframe: 'slide-in', duration: 0.4, timingFunction: 'ease-out', iterationCount: '1', fillMode: 'both' },
        },
        commonMistakes: [
          {
            mistake: 'Leaving `infinite` on distracting bouncing buttons or headings near readable text.',
            fix: 'Run attention animations once or twice, never infinitely beside reading prose.',
          },
        ],
        visualType: 'anim-iteration',
      },
      {
        id: 'direction',
        cssProperty: 'animation-direction',
        controlLabel: 'direction',
        shortSummary: 'Plays keyframes forward (`normal`), backward (`reverse`), or ping-pong (`alternate`).',
        whatItMeans:
          '`animation-direction` chooses whether keyframes run from `0% -> 100%` every cycle, run backwards `100% -> 0%`, or smoothly reverse back and forth.',
        howItWorks:
          '`normal` restarts at `0%` every time (if `0%` and `100%` don\'t match, it snaps back). `alternate` runs `0% -> 100%` on odd cycles and `100% -> 0%` on even cycles—eliminating abrupt snaps on looping motions.',
        values: [
          {
            value: 'normal',
            label: 'normal (0% → 100%)',
            description: 'Plays forward every cycle; ideal for continuous 360deg `spin`.',
            applyProps: { direction: 'normal' },
          },
          {
            value: 'reverse',
            label: 'reverse (100% → 0%)',
            description: 'Plays the exact same `@keyframes` backwards.',
            applyProps: { direction: 'reverse' },
          },
          {
            value: 'alternate',
            label: 'alternate (Ping-Pong)',
            description: 'Plays forward then smoothly reverses back—eliminates jump cuts.',
            applyProps: { direction: 'alternate', iterationCount: 'infinite' },
          },
        ],
        whenToUse:
          'Use `alternate` whenever looping a back-and-forth motion like floating or glowing; use `normal` for full-circle `spin` (`0deg -> 360deg`) and one-shot entrances.',
        realWorldExample: {
          title: 'Seamless Back-and-Forth Float',
          description:
            'Pairing `0% { translateY(0) }` -> `100% { translateY(-16px) }` with `direction: alternate` produces seamless bobbing with half the keyframe code.',
        },
        codeExample: {
          css: `.floating-orb {\n  animation: stylelab-float 2s ease-in-out infinite alternate;\n}`,
          applyProps: { keyframe: 'float', duration: 2, timingFunction: 'ease-in-out', iterationCount: 'infinite', direction: 'alternate' },
        },
        commonMistakes: [
          {
            mistake: 'Using `alternate` on a `spin` loader (`0deg` to `360deg`), causing it to spin clockwise then rewind counter-clockwise.',
            fix: 'Full-circle rotations should always use `direction: normal` with `linear` timing.',
          },
        ],
        visualType: 'anim-direction',
      },
      {
        id: 'fillMode',
        cssProperty: 'animation-fill-mode',
        controlLabel: 'fill-mode',
        shortSummary: 'Controls whether an element keeps its `0%` look while waiting or its `100%` look after finishing.',
        whatItMeans:
          '`animation-fill-mode` decides what styles apply **before** a delayed animation starts and **after** a finite animation ends.',
        howItWorks:
          'With `none` (default), once an entrance animation finishes, the element snaps right back to its un-animated base styles—and during a `delay`, it briefly flashes visible before jumping to `0%`! Setting `forwards` holds the `100%` ending state, `backwards` applies the `0%` state immediately during any `delay`, and `both` does **both**.',
        values: [
          {
            value: 'none',
            label: 'none (Snap Back)',
            description: 'Reverts to base CSS before delay and after playback ends.',
            applyProps: { fillMode: 'none' },
          },
          {
            value: 'forwards',
            label: 'forwards (Hold End)',
            description: 'Keeps the `100%` final keyframe styles once the animation completes.',
            applyProps: { fillMode: 'forwards', iterationCount: '1' },
          },
          {
            value: 'backwards',
            label: 'backwards (Hold Start)',
            description: 'Applies `0%` styles immediately during any `animation-delay` wait.',
            applyProps: { fillMode: 'backwards', delay: 0.4 },
          },
          {
            value: 'both',
            label: 'both (Best for Entrances)',
            description: 'Applies `0%` during delay AND holds `100%` after completion.',
            applyProps: { fillMode: 'both', iterationCount: '1', keyframe: 'slide-in' },
          },
        ],
        whenToUse:
          'Always use `animation-fill-mode: both` (or `forwards`) on one-shot fade-in / slide-in animations so elements stay visible at `opacity: 1` after finishing.',
        realWorldExample: {
          title: 'Staggered Fade-In Without Flash',
          description:
            'Cards entering with `opacity: 0 -> 1` and a `200ms` delay use `fill-mode: both` so they stay invisible during the delay and remain visible once revealed.',
        },
        codeExample: {
          css: `.reveal-card {\n  animation: stylelab-slide-in 0.5s ease-out 0.2s 1 normal both;\n}`,
          applyProps: { keyframe: 'slide-in', duration: 0.5, timingFunction: 'ease-out', delay: 0.2, iterationCount: '1', direction: 'normal', fillMode: 'both' },
        },
        commonMistakes: [
          {
            mistake: 'Writing a fade-out animation (`100% { opacity: 0 }`) with default `fill-mode: none`, causing the dismissed alert to flash back to `opacity: 1` at the end.',
            fix: 'Add `forwards` or `both` so the element stays at `opacity: 0` when the animation ends.',
          },
        ],
        visualType: 'anim-fill-mode',
      },
    ],
  },
};
