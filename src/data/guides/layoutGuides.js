export const LAYOUT_GUIDES = {
  flexbox: {
    id: 'flexbox',
    name: 'Flexbox',
    mentalModel:
      'Think of Flexbox as a one-directional track (either a horizontal row or a vertical column). You put a parent element in charge by setting `display: flex`, and that parent controls how its direct children line up, space out, wrap, and resize to share available room.',
    keyConcept:
      'Flexbox always works with two axes: the **main axis** (the direction items flow, controlled by `flex-direction`) and the **cross axis** (perpendicular to the main axis).',
    properties: [
      {
        id: 'display',
        cssProperty: 'display',
        controlLabel: 'display',
        shortSummary: 'Turns an element into a flex container so its direct children obey Flexbox rules.',
        whatItMeans:
          'The `display` property switches a container from normal block stacking into a **Flexbox formatting context**. Without `display: flex` or `display: inline-flex`, properties like `justify-content`, `align-items`, and `gap` have no effect.',
        howItWorks:
          'Normally, `<div>` blocks stack vertically one after another. Setting `display: flex` tells the browser to arrange all direct children inside one flexible track. Choosing `flex` makes the container itself span the full available width like a block, while `inline-flex` makes the container shrink-wrap to fit its children so it can sit inline beside text or other buttons.',
        values: [
          {
            value: 'flex',
            label: 'flex',
            description: 'Creates a **block-level** flex container that stretches across the full width of its parent.',
            applyProps: { display: 'flex' },
          },
          {
            value: 'inline-flex',
            label: 'inline-flex',
            description: 'Creates an **inline-level** flex container whose outer box hugs the size of its items.',
            applyProps: { display: 'inline-flex' },
          },
        ],
        whenToUse:
          'Use `flex` for page sections, navigation bars, toolbars, and card rows. Use `inline-flex` for compact components like buttons with an icon next to a label, or inline badges.',
        realWorldExample: {
          title: 'Icon + Label Action Button',
          description:
            'A "Save Changes" button uses `display: inline-flex` with `align-items: center` and `gap: 8px` so the icon and text stay vertically centered while the button stays only as wide as its content.',
        },
        codeExample: {
          css: `.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}`,
          applyProps: { display: 'flex', alignItems: 'center', gap: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Applying `justify-content` or `align-items` to a child element instead of the parent flex container.',
            fix: 'Put `display: flex` and container alignment properties on the **parent** wrapper, not on the items inside it.',
          },
          {
            mistake: 'Switching to `display: inline-flex` and wondering why `justify-content: space-between` does nothing.',
            fix: 'Because `inline-flex` shrink-wraps its width to match its children, there is zero leftover horizontal space to distribute unless you set a wider explicit `width` or switch `flex-direction: column`.',
          },
        ],
        visualType: 'flex-display',
      },
      {
        id: 'flexDirection',
        cssProperty: 'flex-direction',
        controlLabel: 'flex-direction',
        shortSummary: 'Chooses whether items flow horizontally in a row or vertically in a column.',
        whatItMeans:
          '`flex-direction` sets the direction of the **main axis**—the invisible line along which flex items are placed one after another.',
        howItWorks:
          'By default, `flex-direction` is `row`, meaning items sit side by side from left to right. Switching to `column` rotates the main axis 90 degrees so items stack top to bottom. Crucially, rotating the main axis also swaps what `justify-content` and `align-items` control.',
        values: [
          {
            value: 'row',
            label: 'row',
            description: 'Items flow **left to right** along a horizontal main axis (default).',
            applyProps: { flexDirection: 'row' },
          },
          {
            value: 'row-reverse',
            label: 'row-reverse',
            description: 'Items flow **right to left** starting from the far right edge.',
            applyProps: { flexDirection: 'row-reverse' },
          },
          {
            value: 'column',
            label: 'column',
            description: 'Items stack **top to bottom** along a vertical main axis.',
            applyProps: { flexDirection: 'column' },
          },
          {
            value: 'column-reverse',
            label: 'column-reverse',
            description: 'Items stack **bottom to top** starting from the bottom edge.',
            applyProps: { flexDirection: 'column-reverse' },
          },
        ],
        whenToUse:
          'Use `row` for navbars, button groups, and horizontal bars. Switch to `column` inside mobile media queries or inside vertical cards where a title, body, and footer stack vertically.',
        realWorldExample: {
          title: 'Responsive Card Content Stack',
          description:
            'A pricing card uses `flex-direction: column` so the plan title, feature list, and "Choose Plan" button stack neatly, even when cards sit in a horizontal row.',
        },
        codeExample: {
          css: `.card-stack {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}`,
          applyProps: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', gap: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Using `row-reverse` or `column-reverse` when you only want to reorder content for sighted users without updating HTML order.',
            fix: 'Screen readers and `Tab` keyboard navigation still follow the original HTML order. Only use `-reverse` when visual mirroring is safe for accessibility.',
          },
          {
            mistake: 'Forgetting that `justify-content` becomes vertical when `flex-direction: column` is active.',
            fix: 'Remember: `justify-content` always follows the `flex-direction` axis, while `align-items` always crosses it.',
          },
        ],
        visualType: 'flex-direction',
      },
      {
        id: 'justifyContent',
        cssProperty: 'justify-content',
        controlLabel: 'justify-content',
        shortSummary: 'Distributes items and leftover empty space along the main axis.',
        whatItMeans:
          '`justify-content` controls how items are grouped or spread out along the **main axis** whenever there is extra leftover space in the container.',
        howItWorks:
          'First, the browser places items at their natural sizes. Any remaining empty space in the track is then distributed according to the value you choose: packed at the start, centered, pushed to the end, or divided into gaps between or around items.',
        values: [
          {
            value: 'flex-start',
            label: 'flex-start',
            description: 'Packs all items tightly toward the **start** of the main axis.',
            applyProps: { justifyContent: 'flex-start' },
          },
          {
            value: 'center',
            label: 'center',
            description: 'Groups items together right in the **middle** of the container.',
            applyProps: { justifyContent: 'center' },
          },
          {
            value: 'flex-end',
            label: 'flex-end',
            description: 'Pushes all items tightly toward the **end** of the main axis.',
            applyProps: { justifyContent: 'flex-end' },
          },
          {
            value: 'space-between',
            label: 'space-between',
            description: 'Pins the first and last items to the edges and splits space **evenly between** items.',
            applyProps: { justifyContent: 'space-between' },
          },
          {
            value: 'space-around',
            label: 'space-around',
            description: 'Gives every item equal space on **both sides** (outer edges get half the space of inner gaps).',
            applyProps: { justifyContent: 'space-around' },
          },
          {
            value: 'space-evenly',
            label: 'space-evenly',
            description: 'Makes outer edge spaces and inner gaps **100% identical** in width.',
            applyProps: { justifyContent: 'space-evenly' },
          },
        ],
        whenToUse:
          'Use `space-between` for header bars (logo on the left, actions on the right), `center` for hero call-to-action buttons, and `flex-end` for modal footer buttons like "Cancel" and "Save".',
        realWorldExample: {
          title: 'Top Navigation Bar Split',
          description:
            'A header with a brand logo on the left and a "Sign In" button on the right uses `justify-content: space-between` so both ends hug the container edges automatically at any screen width.',
        },
        codeExample: {
          css: `.navbar {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n}`,
          applyProps: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        },
        commonMistakes: [
          {
            mistake: 'Expecting `justify-content` to do something when items already fill 100% of the container width (or have `flex-grow: 1`).',
            fix: '`justify-content` only distributes **unused** space. If items stretch across the whole row, reduce item widths or remove `flex-grow: 1`.',
          },
          {
            mistake: 'Confusing `space-around` with `space-evenly`.',
            fix: 'Remember that `space-around` doubles the space between adjacent items compared to the outer edges; use `space-evenly` when every gap should look identical.',
          },
        ],
        visualType: 'flex-justify',
      },
      {
        id: 'alignItems',
        cssProperty: 'align-items',
        controlLabel: 'align-items',
        shortSummary: 'Aligns items across the perpendicular cross axis (vertical alignment in a row).',
        whatItMeans:
          '`align-items` controls how items sit along the **cross axis**—for a normal `row`, that means top, middle, bottom, or stretched full height.',
        howItWorks:
          'While `justify-content` handles placement along the flow direction, `align-items` handles alignment across the thickness of the track. By default (`stretch`), items grow to match the tallest item or container height unless they have a fixed height.',
        values: [
          {
            value: 'stretch',
            label: 'stretch',
            description: 'Stretches items to fill the full cross-axis size of the flex line (default).',
            applyProps: { alignItems: 'stretch' },
          },
          {
            value: 'flex-start',
            label: 'flex-start',
            description: 'Aligns items cleanly along the **top** edge (for `row`) or **left** edge (for `column`).',
            applyProps: { alignItems: 'flex-start' },
          },
          {
            value: 'center',
            label: 'center',
            description: 'Centers items along the cross axis—classic way to vertically center elements.',
            applyProps: { alignItems: 'center' },
          },
          {
            value: 'flex-end',
            label: 'flex-end',
            description: 'Aligns items to the **bottom** edge (for `row`) or **right** edge (for `column`).',
            applyProps: { alignItems: 'flex-end' },
          },
          {
            value: 'baseline',
            label: 'baseline',
            description: 'Aligns items so their **text baselines** sit on the exact same horizontal line.',
            applyProps: { alignItems: 'baseline' },
          },
        ],
        whenToUse:
          'Use `center` almost everywhere in UI bars so icons, inputs, and buttons line up vertically. Use `stretch` when building equal-height pricing cards side by side.',
        realWorldExample: {
          title: 'Equal-Height Feature Cards',
          description:
            'Three cards in a row have different paragraph lengths, yet `align-items: stretch` keeps all three card borders aligned to the exact same bottom edge.',
        },
        codeExample: {
          css: `.hero-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 280px;\n}`,
          applyProps: { justifyContent: 'center', alignItems: 'center', containerHeight: 280 },
        },
        commonMistakes: [
          {
            mistake: 'Setting `align-items: stretch` on items that already have an explicit `height` set.',
            fix: 'An explicit height overrides `stretch`. Remove fixed heights (use `min-height` instead) if you want equal-height cards.',
          },
          {
            mistake: 'Expecting `align-items: center` to center an item vertically when the container itself has no extra height.',
            fix: 'Make sure the container has `min-height` or taller sibling items, otherwise there is no cross-axis space to center within.',
          },
        ],
        visualType: 'flex-align-items',
      },
      {
        id: 'flexWrap',
        cssProperty: 'flex-wrap',
        controlLabel: 'flex-wrap',
        shortSummary: 'Decides whether overflowing items squeeze onto one line or wrap onto new lines.',
        whatItMeans:
          '`flex-wrap` controls whether all flex items are forced onto a **single line** or allowed to break onto **multiple rows/columns** when space runs out.',
        howItWorks:
          'By default (`nowrap`), Flexbox tries hard to keep every item on one line, shrinking items if needed or overflowing the container. Setting `wrap` lets items gracefully drop onto the next line instead of squishing.',
        values: [
          {
            value: 'nowrap',
            label: 'nowrap',
            description: 'Forces all items onto **one single line**, shrinking them if space gets tight.',
            applyProps: { flexWrap: 'nowrap' },
          },
          {
            value: 'wrap',
            label: 'wrap',
            description: 'Allows items to **wrap onto additional lines** from top to bottom as needed.',
            applyProps: { flexWrap: 'wrap' },
          },
          {
            value: 'wrap-reverse',
            label: 'wrap-reverse',
            description: 'Wraps items onto new lines in the **opposite cross-axis direction** (bottom to top).',
            applyProps: { flexWrap: 'wrap-reverse' },
          },
        ],
        whenToUse:
          'Use `wrap` for tag lists, filter chips, or responsive card strips where items should reflow onto new lines on smaller screens. Keep `nowrap` for single-line toolbars.',
        realWorldExample: {
          title: 'Responsive Filter Button Group',
          description:
            'A row of 8 category filter buttons uses `flex-wrap: wrap` and `gap: 8px` so buttons stay crisp on desktop and flow neatly onto two lines on mobile.',
        },
        codeExample: {
          css: `.tag-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}`,
          applyProps: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
        },
        commonMistakes: [
          {
            mistake: 'Leaving `flex-wrap: nowrap` on a list of fixed-width cards and wondering why it overflows horizontally on mobile.',
            fix: 'Switch to `flex-wrap: wrap` so cards wrap to the next row instead of breaking the page width.',
          },
        ],
        visualType: 'flex-wrap',
      },
      {
        id: 'alignContent',
        cssProperty: 'align-content',
        controlLabel: 'align-content',
        shortSummary: 'Controls vertical spacing between multiple wrapped flex lines.',
        whatItMeans:
          '`align-content` packs or spaces **entire wrapped lines** along the cross axis when `flex-wrap: wrap` has created two or more rows.',
        howItWorks:
          'Think of `align-content` as `justify-content`, except it moves whole wrapped lines along the cross axis instead of individual items along the main axis. If there is only one line of items (`flex-wrap: nowrap` or not enough items to wrap), `align-content` does nothing.',
        values: [
          {
            value: 'flex-start',
            label: 'flex-start',
            description: 'Packs all wrapped lines together at the **start** of the cross axis.',
            applyProps: { flexWrap: 'wrap', alignContent: 'flex-start' },
          },
          {
            value: 'center',
            label: 'center',
            description: 'Centers the wrapped lines as a block in the middle of the container.',
            applyProps: { flexWrap: 'wrap', alignContent: 'center' },
          },
          {
            value: 'flex-end',
            label: 'flex-end',
            description: 'Packs all wrapped lines toward the **end** of the cross axis.',
            applyProps: { flexWrap: 'wrap', alignContent: 'flex-end' },
          },
          {
            value: 'space-between',
            label: 'space-between',
            description: 'Pins top and bottom lines to the edges and spreads lines evenly between.',
            applyProps: { flexWrap: 'wrap', alignContent: 'space-between' },
          },
          {
            value: 'space-around',
            label: 'space-around',
            description: 'Adds equal padding above and below each wrapped line.',
            applyProps: { flexWrap: 'wrap', alignContent: 'space-around' },
          },
          {
            value: 'stretch',
            label: 'stretch',
            description: 'Expands lines to divide any leftover cross-axis height evenly (default).',
            applyProps: { flexWrap: 'wrap', alignContent: 'stretch' },
          },
        ],
        whenToUse:
          'Use `align-content: flex-start` inside tall wrapping containers so wrapped rows stay neatly grouped near the top instead of leaving big awkward vertical gaps between rows.',
        realWorldExample: {
          title: 'Multi-Row Badge Gallery',
          description:
            'Inside a fixed-height sidebar panel, `align-content: flex-start` keeps wrapped status items compact at the top rather than stretching them apart.',
        },
        codeExample: {
          css: `.wrapped-grid {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n  min-height: 280px;\n  gap: 12px;\n}`,
          applyProps: { flexWrap: 'wrap', alignContent: 'flex-start', containerHeight: 280, gap: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Setting `align-content: center` on a single-row flex container and wondering why nothing moved.',
            fix: 'Use `align-items` for single-line alignment. `align-content` only works when `flex-wrap: wrap` produces **multiple lines**.',
          },
        ],
        visualType: 'flex-align-content',
      },
      {
        id: 'gap',
        cssProperty: 'gap',
        controlLabel: 'gap',
        shortSummary: 'Adds clean, consistent spacing strictly between flex items.',
        whatItMeans:
          '`gap` creates uniform breathing room **between** neighboring items without adding extra space on the outer container edges.',
        howItWorks:
          'Before `gap`, developers had to add `margin-right` to items and remove it from `:last-child`. Now `gap: 16px` automatically inserts 16px between adjacent items on both rows and wrapped columns, and inserts 0px on the outside walls.',
        values: [
          {
            value: '0px',
            label: '0px (Tight)',
            description: 'Items touch edge-to-edge—useful for segmented button bars.',
            applyProps: { gap: 0 },
          },
          {
            value: '12px',
            label: '12px (Standard UI)',
            description: 'Comfortable spacing for toolbars, chips, and compact card lists.',
            applyProps: { gap: 12 },
          },
          {
            value: '28px',
            label: '28px (Airy)',
            description: 'Generous separation for feature cards and marketing sections.',
            applyProps: { gap: 28 },
          },
        ],
        whenToUse:
          'Use `gap` instead of item margins whenever spacing sibling elements inside a Flexbox or Grid container.',
        realWorldExample: {
          title: 'Form Button Pair',
          description:
            'Placing "Cancel" and "Save" inside a flex row with `gap: 10px` keeps a consistent 10px gutter without ever misaligning the right edge.',
        },
        codeExample: {
          css: `.button-group {\n  display: flex;\n  gap: 12px;\n}`,
          applyProps: { gap: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Combining `gap` with manual `margin` on every child, causing double spacing.',
            fix: 'Let `gap` handle spacing between siblings and use container `padding` for outer edges.',
          },
        ],
        visualType: 'flex-gap',
      },
      {
        id: 'containerHeight',
        cssProperty: 'min-height',
        controlLabel: 'min-height',
        shortSummary: 'Sets a minimum container height so vertical alignment and wrapping have room.',
        whatItMeans:
          '`min-height` guarantees the flex container stays at least this tall, while still growing taller if content needs extra room.',
        howItWorks:
          'Without an explicit height or `min-height`, a container shrinks vertically to hug its content, leaving zero extra vertical space for `align-items: center` or `flex-direction: column` spacing.',
        values: [
          {
            value: '160px',
            label: '160px (Compact)',
            description: 'Good for short header banners and single-row toolbars.',
            applyProps: { containerHeight: 160 },
          },
          {
            value: '280px',
            label: '280px (Standard)',
            description: 'Balanced workspace height to inspect alignment and wrapping.',
            applyProps: { containerHeight: 280 },
          },
          {
            value: '380px',
            label: '380px (Tall Hero)',
            description: 'Ample vertical room for centered hero layouts or bottom-aligned bars.',
            applyProps: { containerHeight: 380 },
          },
        ],
        whenToUse:
          'Prefer `min-height` over fixed `height` on containers with dynamic text or wrapping items so content never gets clipped if it grows taller.',
        realWorldExample: {
          title: 'Full-Viewport Hero Banner',
          description:
            'Hero sections use `min-height: 480px` (or `min-height: 80vh`) with `align-items: center` so content centers vertically without overflowing on short screens.',
        },
        codeExample: {
          css: `.hero-panel {\n  display: flex;\n  align-items: center;\n  min-height: 320px;\n}`,
          applyProps: { containerHeight: 320, alignItems: 'center' },
        },
        commonMistakes: [
          {
            mistake: 'Using fixed `height` instead of `min-height` on responsive cards.',
            fix: 'If text wraps onto extra lines on mobile, a fixed `height` causes overflow. `min-height` grows safely with content.',
          },
        ],
        visualType: 'flex-height',
      },
      {
        id: 'itemProperties',
        cssProperty: 'flex-grow / flex-shrink / flex-basis / align-self / order',
        controlLabel: 'Item Properties (click an item)',
        shortSummary: 'Overrides sizing, alignment, and order on a single selected flex child.',
        whatItMeans:
          'While most Flexbox controls sit on the parent container, **item properties** apply to individual children so one item can set its starting `flex-basis`, grow wider, refuse to shrink, align itself differently, or change visual order.',
        howItWorks:
          '`flex-basis` sets the item\'s ideal starting main-axis size (`auto` uses content width; `0px` makes `flex-grow` divide space equally). `flex-grow` claims leftover empty space (`0` stays natural; `1` expands). `flex-shrink` compresses items when a `nowrap` row overflows (`0` prevents squishing). `align-self` overrides `align-items` for one item, and `order` shifts visual sequence.',
        values: [
          {
            value: 'flex-grow: 1',
            label: 'flex-grow: 1',
            description: 'Lets the selected item expand to soak up remaining empty main-axis space.',
          },
          {
            value: 'flex-shrink: 0',
            label: 'flex-shrink: 0',
            description: 'Protects an item from squishing when a `nowrap` container gets narrow.',
          },
          {
            value: 'flex-basis: 160px',
            label: 'flex-basis',
            description: 'Sets the initial main-axis size (`auto`, `0px`, `160px`, `50%`) before grow/shrink runs.',
          },
          {
            value: 'align-self: center',
            label: 'align-self',
            description: 'Aligns just this item (`auto`, `flex-start`, `center`, `flex-end`, `stretch`).',
          },
          {
            value: 'order: -1',
            label: 'order',
            description: 'Moves an item visually before (`< 0`) or after (`> 0`) siblings (default `0`).',
          },
        ],
        whenToUse:
          'Use `flex-grow: 1` with `flex-basis: 0px` for strictly equal columns regardless of text length, or `flex-basis: 200px` with `flex-wrap: wrap` to build responsive wrapping cards.',
        realWorldExample: {
          title: 'Expanding Search Bar in a Header',
          description:
            'Logo (`flex-grow: 0`), Search Input (`flex-grow: 1; flex-basis: 160px`), and Profile Button (`flex-shrink: 0`) keep the logo and avatar snug while the search field stretches fluidly.',
        },
        codeExample: {
          css: `.main-pane {\n  flex-grow: 1;\n  flex-shrink: 1;\n  flex-basis: 0px;\n}`,
        },
        commonMistakes: [
          {
            mistake: 'Using `order` to rearrange interactive buttons or form inputs.',
            fix: 'Keyboard `Tab` navigation follows HTML order, not CSS `order`. Update the HTML order for critical interactive flows.',
          },
        ],
        visualType: 'flex-item',
      },
    ],
  },

  grid: {
    id: 'grid',
    name: 'Grid',
    mentalModel:
      'CSS Grid is a two-dimensional blueprint of **rows and columns** defined on the parent container. Unlike Flexbox (which places items one line at a time), Grid lets you design a strict table-like structure where items snap neatly into cells or span across multiple tracks.',
    keyConcept:
      'The `fr` unit stands for **fraction of leftover space**. `repeat(3, minmax(0, 1fr))` splits the container into three equal columns that never blow out when text is long.',
    properties: [
      {
        id: 'columnMode',
        cssProperty: 'grid-template-columns',
        controlLabel: 'Column Sizing',
        shortSummary: 'Chooses between a fixed column count or responsive auto-fitting columns.',
        whatItMeans:
          '`grid-template-columns` defines how many vertical columns exist and how wide each column track should be.',
        howItWorks:
          'In **Fixed Tracks (`fr`)** mode, `repeat(3, minmax(0, 1fr))` always creates 3 equal columns regardless of screen width. In **Auto-Fit** mode, `repeat(auto-fit, minmax(140px, 1fr))` automatically calculates how many `140px` columns fit side-by-side and wraps extras onto new rows as the screen narrows—with zero media queries.',
        values: [
          {
            value: 'fr',
            label: 'Fixed Tracks (fr)',
            description: 'Keeps an exact column count (`repeat(N, minmax(0, 1fr))`) and divides width equally.',
            applyProps: { columnMode: 'fr', columns: 3 },
          },
          {
            value: 'auto-fit',
            label: 'Auto-Fit Responsive',
            description: 'Fits as many columns of at least `minColWidth` as possible, wrapping automatically on narrow screens.',
            applyProps: { columnMode: 'auto-fit', minColWidth: 140 },
          },
        ],
        whenToUse:
          'Use `Fixed Tracks (fr)` when a layout strictly requires e.g. 2 or 3 columns. Use `Auto-Fit` for product cards, photo galleries, and dashboard widgets that adapt smoothly from desktop to mobile.',
        realWorldExample: {
          title: 'Zero-Media-Query Product Grid',
          description:
            'An e-commerce grid uses `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` so 4 cards fit on a wide monitor, 2 fit on a tablet, and 1 stacks cleanly on a phone.',
        },
        codeExample: {
          css: `.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 16px;\n}`,
          applyProps: { columnMode: 'auto-fit', minColWidth: 140, columnGap: 16, rowGap: 16 },
        },
        commonMistakes: [
          {
            mistake: 'Writing `repeat(3, 1fr)` without `minmax(0, 1fr)` when cells contain long unbroken URLs or code.',
            fix: 'By default, `1fr` means `minmax(auto, 1fr)`, which lets wide content stretch the column past 1/3 width. Use `minmax(0, 1fr)` so columns stay strictly equal.',
          },
        ],
        visualType: 'grid-columns',
      },
      {
        id: 'columns',
        cssProperty: 'repeat(N, minmax(0, 1fr))',
        controlLabel: 'Columns',
        shortSummary: 'Sets how many equal-width column tracks appear per row.',
        whatItMeans:
          'Controls the number of columns (`N`) generated by `repeat(N, minmax(0, 1fr))` when using fixed tracks.',
        howItWorks:
          'The browser takes the container width, subtracts all `column-gap` spaces, and splits the remaining space into `N` equal fractions (`1fr` each).',
        values: [
          {
            value: '2',
            label: '2 Columns',
            description: 'Ideal for split comparisons, settings forms, and 50/50 layouts.',
            applyProps: { columnMode: 'fr', columns: 2 },
          },
          {
            value: '3',
            label: '3 Columns',
            description: 'Classic grid for feature highlights, pricing tiers, and dashboards.',
            applyProps: { columnMode: 'fr', columns: 3 },
          },
          {
            value: '4',
            label: '4 Columns',
            description: 'Compact bento layout or metric strip on wide viewports.',
            applyProps: { columnMode: 'fr', columns: 4 },
          },
        ],
        whenToUse:
          'Pick 2–3 columns for readable text cards, and 4–6 columns for compact icon tiles or stat KPIs.',
        realWorldExample: {
          title: '3-Column Feature Section',
          description:
            'Marketing landing pages commonly pair 3 equal columns (`repeat(3, minmax(0, 1fr))`) to showcase three core benefits side by side.',
        },
        codeExample: {
          css: `.feature-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 16px;\n}`,
          applyProps: { columnMode: 'fr', columns: 3, columnGap: 16, rowGap: 16 },
        },
        commonMistakes: [
          {
            mistake: 'Using 4+ fixed columns without checking mobile preview width.',
            fix: 'Switch to Mobile preview (`375px`) to verify text inside 4 narrow columns stays legible—or use `auto-fit` so columns wrap automatically.',
          },
        ],
        visualType: 'grid-count',
      },
      {
        id: 'rowHeight',
        cssProperty: 'grid-auto-rows',
        controlLabel: 'grid-auto-rows',
        shortSummary: 'Sets the default height for every automatically created grid row.',
        whatItMeans:
          '`grid-auto-rows` tells the browser how tall each row track should be when items wrap onto new rows automatically.',
        howItWorks:
          'Even if one cell has two words and its neighbor has three lines, setting `grid-auto-rows: minmax(84px, auto)` or a fixed `84px` keeps every row uniform and tidy.',
        values: [
          {
            value: '64px',
            label: '64px (Compact)',
            description: 'Tight row height suited for dense metrics or tool tiles.',
            applyProps: { rowHeight: 64 },
          },
          {
            value: '96px',
            label: '96px (Balanced)',
            description: 'Roomy cell height for cards with titles and metadata.',
            applyProps: { rowHeight: 96 },
          },
          {
            value: '140px',
            label: '140px (Tall Bento)',
            description: 'Creates square-like bento tiles great for visual dashboards.',
            applyProps: { rowHeight: 140 },
          },
        ],
        whenToUse:
          'Use `grid-auto-rows` for bento grids and photo mosaics where rows should share a rhythmic vertical module.',
        realWorldExample: {
          title: 'Bento Dashboard Tiles',
          description:
            'Setting `grid-auto-rows: 88px` makes a `row-span: 2` tile align cleanly with two stacked single-row tiles next to it.',
        },
        codeExample: {
          css: `.bento-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  grid-auto-rows: 96px;\n  gap: 12px;\n}`,
          applyProps: { columnMode: 'fr', columns: 3, rowHeight: 96, columnGap: 12, rowGap: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Setting a small fixed `grid-auto-rows` (like `40px`) when cells hold long multi-line paragraphs.',
            fix: 'For variable text lengths, use `minmax(80px, auto)` in production CSS so rows grow when text wraps.',
          },
        ],
        visualType: 'grid-rows',
      },
      {
        id: 'columnGap',
        cssProperty: 'column-gap & row-gap',
        controlLabel: 'column-gap / row-gap',
        shortSummary: 'Controls horizontal spacing between columns and vertical spacing between rows.',
        whatItMeans:
          '`column-gap` sets the gutter width between vertical columns, while `row-gap` sets the gutter height between horizontal rows.',
        howItWorks:
          'You can set them independently—for example, wider horizontal gaps between columns and tighter vertical gaps between rows—or use the shorthand `gap: rowGap columnGap` when both match.',
        values: [
          {
            value: '8px / 8px',
            label: 'Tight (8px)',
            description: 'Compact spacing for dense toolbars or calendar grids.',
            applyProps: { columnGap: 8, rowGap: 8 },
          },
          {
            value: '24px / 12px',
            label: 'Asymmetric (24px × 12px)',
            description: 'Wider separation between columns than between rows.',
            applyProps: { columnGap: 24, rowGap: 12 },
          },
          {
            value: '24px / 24px',
            label: 'Open (24px)',
            description: 'Clean airy gutters for portfolio or card galleries.',
            applyProps: { columnGap: 24, rowGap: 24 },
          },
        ],
        whenToUse:
          'Use separate `column-gap` and `row-gap` in form layouts where fields need more horizontal breathing room between columns than vertical spacing between stacked inputs.',
        realWorldExample: {
          title: 'Two-Column Checkout Form',
          description:
            'Using `column-gap: 24px` and `row-gap: 14px` clearly separates left and right form columns while keeping stacked inputs visually grouped.',
        },
        codeExample: {
          css: `.form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  column-gap: 24px;\n  row-gap: 14px;\n}`,
          applyProps: { columnMode: 'fr', columns: 2, columnGap: 24, rowGap: 14 },
        },
        commonMistakes: [
          {
            mistake: 'Trying to use padding on grid items to fake gaps, which shrinks inner backgrounds inconsistently.',
            fix: 'Always use `column-gap` and `row-gap` (or `gap`) on the grid container for crisp gutters.',
          },
        ],
        visualType: 'grid-gaps',
      },
      {
        id: 'justifyItems',
        cssProperty: 'justify-items & align-items',
        controlLabel: 'justify-items / align-items',
        shortSummary: 'Aligns every item horizontally and vertically inside its own grid cell.',
        whatItMeans:
          '`justify-items` aligns each item **horizontally** inside its cell, and `align-items` aligns each item **vertically** inside its cell.',
        howItWorks:
          'Think of every grid cell as a mini frame. By default (`stretch`), each child stretches to fill 100% of its cell width and height. Setting `center` shrinks each child to fit its own text/content and floats it in the middle of its cell.',
        values: [
          {
            value: 'stretch',
            label: 'stretch (Fill Cell)',
            description: 'Items expand to fill the full width and height of their grid cell (default).',
            applyProps: { justifyItems: 'stretch', alignItems: 'stretch' },
          },
          {
            value: 'start',
            label: 'start (Top-Left)',
            description: 'Pins items at natural size to the top-left corner of each cell.',
            applyProps: { justifyItems: 'start', alignItems: 'start' },
          },
          {
            value: 'center',
            label: 'center (Dead Center)',
            description: 'Centers items horizontally and vertically inside every grid cell.',
            applyProps: { justifyItems: 'center', alignItems: 'center' },
          },
          {
            value: 'end',
            label: 'end (Bottom-Right)',
            description: 'Pins items to the bottom-right corner of each cell.',
            applyProps: { justifyItems: 'end', alignItems: 'end' },
          },
        ],
        whenToUse:
          'Keep `stretch` for dashboard cards that should align edge-to-edge. Use `center` (`place-items: center`) for icon matrices, logo walls, or centering a single element in a container.',
        realWorldExample: {
          title: 'Partner Logo Grid',
          description:
            'Company logos of different aspect ratios sit inside equal grid cells with `justify-items: center` and `align-items: center` so every logo looks visually balanced.',
        },
        codeExample: {
          css: `.logo-wall {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  justify-items: center;\n  align-items: center;\n}`,
          applyProps: { columnMode: 'fr', columns: 3, justifyItems: 'center', alignItems: 'center' },
        },
        commonMistakes: [
          {
            mistake: 'Confusing `justify-items` (moves items inside cells) with `justify-content` (moves the grid tracks inside the container).',
            fix: 'Remember: `-items` controls what happens **inside each cell**; `-content` controls the **whole grid tracks** when the grid is smaller than its container.',
          },
        ],
        visualType: 'grid-align',
      },
      {
        id: 'autoFlow',
        cssProperty: 'grid-auto-flow',
        controlLabel: 'grid-auto-flow',
        shortSummary: 'Controls whether items fill row-by-row, column-by-column, and backfill gaps.',
        whatItMeans:
          '`grid-auto-flow` chooses the order in which auto-placed items fill empty cells—across rows first (`row`) or down columns first (`column`)—and whether `dense` packing fills holes left by larger spanning cells.',
        howItWorks:
          'Normally (`row`), items fill left-to-right across Row 1, then move to Row 2. If a wide `span 2` item doesn\'t fit at the end of Row 1, it jumps to Row 2 and leaves an empty hole. Adding `dense` lets smaller later items jump backwards into that empty hole.',
        values: [
          {
            value: 'row',
            label: 'row',
            description: 'Fills each row left-to-right before starting the next row (default).',
            applyProps: { autoFlow: 'row' },
          },
          {
            value: 'column',
            label: 'column',
            description: 'Fills down columns top-to-bottom before moving to the next column.',
            applyProps: { autoFlow: 'column' },
          },
          {
            value: 'row dense',
            label: 'row dense',
            description: 'Fills rows and **backfills empty gaps** with smaller upcoming items.',
            applyProps: { autoFlow: 'row dense' },
          },
          {
            value: 'column dense',
            label: 'column dense',
            description: 'Fills columns and backfills any leftover vertical gaps.',
            applyProps: { autoFlow: 'column dense' },
          },
        ],
        whenToUse:
          'Use `row dense` in bento dashboards or masonry-style photo grids where some tiles span 2 columns and you want zero awkward blank holes.',
        realWorldExample: {
          title: 'Bento Widget Dashboard',
          description:
            'Featured analytics charts span 2 columns while smaller KPI tiles use `grid-auto-flow: row dense` to automatically fill every remaining 1×1 slot cleanly.',
        },
        codeExample: {
          css: `.bento-board {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  grid-auto-flow: row dense;\n  gap: 12px;\n}`,
          applyProps: { columnMode: 'fr', columns: 4, autoFlow: 'row dense', columnGap: 12, rowGap: 12 },
        },
        commonMistakes: [
          {
            mistake: 'Using `dense` on numbered steps or sequential checklists.',
            fix: 'Because `dense` moves smaller items backwards to fill holes, it changes visual reading order. Only use `dense` when item sequence doesn\'t strictly matter.',
          },
        ],
        visualType: 'grid-flow',
      },
      {
        id: 'cellSpan',
        cssProperty: 'grid-column & grid-row',
        controlLabel: 'Cell Span (click a cell)',
        shortSummary: 'Makes a single grid item span across multiple columns or rows.',
        whatItMeans:
          'Individual grid items can stretch across 2 or more column/row tracks using `grid-column: span N` and `grid-row: span N`.',
        howItWorks:
          'By default every child occupies 1 column and 1 row (`1×1`). Increasing `grid-column: span 2` lets a hero tile cover two columns horizontally; `grid-row: span 2` lets a sidebar tile cover two rows vertically.',
        values: [
          {
            value: 'grid-column: span 2',
            label: 'Wide Span (2×1)',
            description: 'Doubles the item width across two adjacent columns.',
          },
          {
            value: 'grid-row: span 2',
            label: 'Tall Span (1×2)',
            description: 'Doubles the item height across two stacked rows.',
          },
          {
            value: 'span 2 / span 2',
            label: 'Hero Tile (2×2)',
            description: 'Creates a prominent 2×2 featured quadrant inside a dashboard.',
          },
        ],
        whenToUse:
          'Use cell spans for page shells (full-width header + tall sidebar + main area) or featured chart widgets in a dashboard.',
        realWorldExample: {
          title: 'Featured Chart Card',
          description:
            'In a 3-column metrics grid, the primary Revenue chart sets `grid-column: span 2` while two smaller stat cards sit stacked beside it.',
        },
        codeExample: {
          css: `.featured-cell {\n  grid-column: span 2;\n  grid-row: span 2;\n}`,
        },
        commonMistakes: [
          {
            mistake: 'Setting `grid-column: span 4` inside a 2-column grid, which forces implicit extra columns and breaks symmetry.',
            fix: 'Keep `span N` smaller than or equal to the grid\'s column count, or lower the span on smaller viewports.',
          },
        ],
        visualType: 'grid-span',
      },
    ],
  },

  'box-model': {
    id: 'box-model',
    name: 'Box Model',
    mentalModel:
      'Every single HTML element is a rectangular box wrapped in four concentric layers from inside out: **Content** -> **Padding** -> **Border** -> **Margin**.',
    keyConcept:
      'Always understand `box-sizing: border-box`: with `border-box`, setting `width: 240px` means the **total visible box** (content + padding + border) stays locked at 240px.',
    properties: [
      {
        id: 'boxSizing',
        cssProperty: 'box-sizing',
        controlLabel: 'box-sizing',
        shortSummary: 'Determines whether padding and border are included inside `width`/`height` or added on top.',
        whatItMeans:
          '`box-sizing` controls the math the browser uses to calculate an element\'s final rendered width and height.',
        howItWorks:
          'With `content-box` (CSS\'s legacy default), `width: 200px` only sizes the inner text area—adding `24px` padding and `8px` border balloons the box out to `264px` wide! With `border-box`, the browser locks the outer border edge at `200px` and gently shrinks the inner content area to make room for padding and border.',
        values: [
          {
            value: 'border-box',
            label: 'border-box (Modern Standard)',
            description: '`width` and `height` **include** content, padding, and border. Predictable sizing.',
            applyProps: { boxSizing: 'border-box', width: 240, paddingTop: 20, paddingRight: 24, paddingBottom: 20, paddingLeft: 24, borderWidth: 4 },
          },
          {
            value: 'content-box',
            label: 'content-box (CSS Legacy Default)',
            description: '`width` and `height` size **only content**; padding and border add extra pixels outside.',
            applyProps: { boxSizing: 'content-box', width: 200, paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24, borderWidth: 8 },
          },
        ],
        whenToUse:
          'Use `border-box` everywhere in modern CSS (most stylesheets start with `*, *::before, *::after { box-sizing: border-box; }`) so `width: 50%` columns never overflow when you add padding.',
        realWorldExample: {
          title: 'Two 50% Side-by-Side Columns',
          description:
            'With `border-box`, two `width: 50%` boxes with `padding: 20px` and `border: 2px solid` still total 100% and fit side by side cleanly without wrapping.',
        },
        codeExample: {
          css: `*, *::before, *::after {\n  box-sizing: border-box;\n}\n\n.card {\n  width: 240px;\n  padding: 20px;\n  border: 4px solid #2563eb;\n}`,
          applyProps: { boxSizing: 'border-box', width: 240, paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20, borderWidth: 4 },
        },
        commonMistakes: [
          {
            mistake: 'Forgetting `box-sizing: border-box` on `width: 100%` inputs that have padding, causing them to poke out of their parent container.',
            fix: 'Set `box-sizing: border-box` globally or on every sized container and form field.',
          },
        ],
        visualType: 'box-sizing',
      },
      {
        id: 'padding',
        cssProperty: 'padding',
        controlLabel: 'padding',
        shortSummary: 'Creates inner breathing room between the content and the element border.',
        whatItMeans:
          '`padding` is the **inner cushion** inside an element\'s border. Unlike margin, padding shows the element\'s own background color.',
        howItWorks:
          'Padding pushes the border outward from the text or image inside. You can set all four sides at once (`padding: 20px`) or control top, right, bottom, and left individually (like `padding: 10px 18px` on buttons so horizontal sides feel wider than top/bottom).',
        values: [
          {
            value: '8px',
            label: '8px (Tight)',
            description: 'Compact padding suited for dense table cells or small badges.',
            applyProps: { linkPadding: true, paddingTop: 8, paddingRight: 8, paddingBottom: 8, paddingLeft: 8 },
          },
          {
            value: '20px',
            label: '20px (Card Standard)',
            description: 'Balanced inner breathing room for cards and panels.',
            applyProps: { linkPadding: true, paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20 },
          },
          {
            value: '12px 28px',
            label: '12px × 28px (Button)',
            description: 'Split horizontal/vertical padding for crisp, clickable buttons.',
            applyProps: { linkPadding: false, paddingTop: 12, paddingRight: 28, paddingBottom: 12, paddingLeft: 28 },
          },
        ],
        whenToUse:
          'Use `padding` whenever text looks cramped against a card border or button edge, or when increasing the clickable hit area of a link/button.',
        realWorldExample: {
          title: 'Comfortable Button Hit Area',
          description:
            'A primary button uses `padding: 10px 20px` (horizontal roughly twice vertical) so text feels balanced and mobile fingers have a generous tap target.',
        },
        codeExample: {
          css: `.panel {\n  padding: 20px 24px;\n}`,
          applyProps: { linkPadding: false, paddingTop: 20, paddingRight: 24, paddingBottom: 20, paddingLeft: 24 },
        },
        commonMistakes: [
          {
            mistake: 'Using `margin` instead of `padding` when you want space inside a colored button or bordered box.',
            fix: '`margin` adds transparent space **outside** the border; use `padding` for space **inside** the background and border.',
          },
        ],
        visualType: 'box-layers',
      },
      {
        id: 'borderWidth',
        cssProperty: 'border',
        controlLabel: 'border-width / style / color',
        shortSummary: 'Draws the structural frame sitting between padding and margin.',
        whatItMeans:
          '`border` wraps around the outside of the padding box, visually defining the edge of a card, input, or button.',
        howItWorks:
          'A border needs three ingredients to show up: thickness (`border-width`), line style (`border-style`—without this, nothing renders!), and color (`border-color`). Because borders sit inside the element\'s box, changing border thickness affects total size unless `box-sizing: border-box` is active.',
        values: [
          {
            value: '1px solid',
            label: '1px Hairline',
            description: 'Crisp, subtle divider border used in modern UI cards and inputs.',
            applyProps: { borderWidth: 1, borderStyle: 'solid' },
          },
          {
            value: '4px solid',
            label: '4px Frame',
            description: 'Thick structural frame highlighting active focus or selection.',
            applyProps: { borderWidth: 4, borderStyle: 'solid' },
          },
          {
            value: '3px dashed',
            label: '3px Dashed',
            description: 'Signals drop zones, placeholders, or editable regions.',
            applyProps: { borderWidth: 3, borderStyle: 'dashed' },
          },
        ],
        whenToUse:
          'Use `1px solid` hairline borders for subtle card separation and form inputs, and thicker `2px–4px` borders for active/selected states.',
        realWorldExample: {
          title: 'Active Plan Selection Card',
          description:
            'Highlighting the selected pricing tier with a `2px solid #2563eb` border draws attention cleanly without heavy drop shadows.',
        },
        codeExample: {
          css: `.highlighted-box {\n  border: 4px solid #2563eb;\n}`,
          applyProps: { borderWidth: 4, borderStyle: 'solid', borderColor: '#2563eb' },
        },
        commonMistakes: [
          {
            mistake: 'Writing `border-width: 2px; border-color: blue;` and seeing nothing because `border-style` defaulted to `none`.',
            fix: 'Always include a `border-style` like `solid` (or use the shorthand `border: 2px solid #2563eb;`).',
          },
        ],
        visualType: 'box-layers',
      },
      {
        id: 'margin',
        cssProperty: 'margin',
        controlLabel: 'margin',
        shortSummary: 'Pushes surrounding elements away outside the element border.',
        whatItMeans:
          '`margin` is the **transparent outer space** around the border that separates an element from its neighbors.',
        howItWorks:
          'Margin never shows the element\'s background color and is not part of the clickable box area. In normal vertical block flow, touching top and bottom margins between two paragraphs **collapse** into the larger of the two margins (though inside Flexbox and Grid, margins do not collapse).',
        values: [
          {
            value: '0px',
            label: '0px (Flush)',
            description: 'No outer push—rely on parent Flexbox/Grid `gap` instead.',
            applyProps: { marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 },
          },
          {
            value: '20px',
            label: '20px (Separated)',
            description: 'Adds 20px of clear outer separation on all four sides.',
            applyProps: { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20 },
          },
          {
            value: '40px',
            label: '40px (Section Gap)',
            description: 'Strong visual pause separating distinct content blocks.',
            applyProps: { marginTop: 40, marginRight: 40, marginBottom: 40, marginLeft: 40 },
          },
        ],
        whenToUse:
          'Use `margin` to separate standalone sections, headings from paragraphs (`margin-bottom`), or center a fixed-width container with `margin: 0 auto`.',
        realWorldExample: {
          title: 'Centering a Page Container',
          description:
            'Setting `max-width: 1100px; margin: 0 auto;` tells the browser to distribute leftover horizontal margin evenly on left and right, centering the entire page layout.',
        },
        codeExample: {
          css: `.box {\n  margin: 20px;\n  padding: 20px;\n}`,
          applyProps: { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20, paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20 },
        },
        commonMistakes: [
          {
            mistake: 'Being surprised when two stacked headings with `margin-bottom: 24px` and `margin-top: 24px` only have `24px` between them instead of `48px`.',
            fix: 'Vertical margins collapse in standard block layout. Use consistent one-directional margins (e.g. only `margin-bottom`) or parent `gap`.',
          },
        ],
        visualType: 'box-layers',
      },
    ],
  },

  typography: {
    id: 'typography',
    name: 'Typography',
    mentalModel:
      'Good web typography balances **hierarchy** (making titles and body text instantly distinguishable) with **readability** (comfortable line height, measure, and contrast so readers never lose their place).',
    keyConcept:
      'Three settings drive 80% of readability: `font-size` (`16px` baseline), unitless `line-height` (`1.5–1.7` for body copy), and `max-width` in `ch` (`50–70ch` per line).',
    properties: [
      {
        id: 'fontFamily',
        cssProperty: 'font-family',
        controlLabel: 'font-family',
        shortSummary: 'Selects the typeface family and fallback fonts for text.',
        whatItMeans:
          '`font-family` supplies a prioritized list of fonts—the browser uses the first font available on the device and falls back down the list.',
        howItWorks:
          'Because not every computer has every font installed, developers write a **font stack** ending with a generic keyword (`sans-serif`, `serif`, or `monospace`). Multi-word font names like `"Plus Jakarta Sans"` are wrapped in quotes.',
        values: [
          {
            value: '"Plus Jakarta Sans", sans-serif',
            label: 'Sans-Serif (UI)',
            description: 'Clean geometric letters built for interfaces, dashboards, and buttons.',
            applyProps: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
          },
          {
            value: 'Georgia, Cambria, "Times New Roman", serif',
            label: 'Serif (Editorial)',
            description: 'Traditional strokes at letter ends that guide long-form article reading.',
            applyProps: { fontFamily: 'Georgia, Cambria, "Times New Roman", serif' },
          },
          {
            value: '"JetBrains Mono", monospace',
            label: 'Monospace (Code & Data)',
            description: 'Every character shares the exact same width—essential for code and aligned tables.',
            applyProps: { fontFamily: '"JetBrains Mono", monospace' },
          },
        ],
        whenToUse:
          'Pair one sans-serif (or serif) family for UI/headings with a monospace family strictly for code snippets, numbers, and CSS values.',
        realWorldExample: {
          title: 'Developer Documentation Stack',
          description:
            'Docs sites use a crisp sans-serif for explanations and a monospace font for code blocks so syntax and punctuation stand out immediately.',
        },
        codeExample: {
          css: `body {\n  font-family: "Plus Jakarta Sans", system-ui, sans-serif;\n}`,
          applyProps: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
        },
        commonMistakes: [
          {
            mistake: 'Listing only one custom font without a generic fallback like `sans-serif` or `monospace`.',
            fix: 'Always end your `font-family` stack with `sans-serif`, `serif`, or `monospace` in case custom webfonts fail to load.',
          },
        ],
        visualType: 'type-family',
      },
      {
        id: 'fontSize',
        cssProperty: 'font-size & font-weight',
        controlLabel: 'font-size / font-weight',
        shortSummary: 'Controls text height in pixels and stroke thickness (`300` light to `800` extra-bold).',
        whatItMeans:
          '`font-size` sets how tall characters render, while `font-weight` controls how thick or bold each letter stroke appears.',
        howItWorks:
          'Numeric font weights run from `100` (thin) through `400` (regular body text) and `600`/`700` (semibold/bold headings) up to `900` (black). Combining size contrast with weight contrast establishes clear visual order.',
        values: [
          {
            value: '14px / 400',
            label: '14px Regular (Compact UI)',
            description: 'Clean size for dense tables, labels, and secondary UI text.',
            applyProps: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
          },
          {
            value: '18px / 400',
            label: '18px Regular (Article Body)',
            description: 'Comfortable reading size for paragraphs and documentation.',
            applyProps: { fontSize: 18, fontWeight: 400, lineHeight: 1.65 },
          },
          {
            value: '32px / 700',
            label: '32px Bold (Headline)',
            description: 'High-impact display heading that pairs well with tighter `line-height` (`1.15`).',
            applyProps: { fontSize: 32, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.02 },
          },
        ],
        whenToUse:
          'Keep body copy between `14px` and `18px` with weight `400`–`500`, and reserve `24px+` with weight `600`–`700` for headings.',
        realWorldExample: {
          title: 'Article Title & Body Scale',
          description:
            'A blog uses `32px / 700` for the title and `18px / 400` for the body so visitors instantly scan what the page is about.',
        },
        codeExample: {
          css: `.article-title {\n  font-size: 32px;\n  font-weight: 700;\n  line-height: 1.15;\n}`,
          applyProps: { fontSize: 32, fontWeight: 700, lineHeight: 1.15 },
        },
        commonMistakes: [
          {
            mistake: 'Setting body text smaller than `12px` or relying solely on color instead of size/weight for headings.',
            fix: 'Ensure body text is at least `14px`–`16px` and give headings a distinct step up in both size and weight.',
          },
        ],
        visualType: 'type-scale',
      },
      {
        id: 'lineHeight',
        cssProperty: 'line-height & letter-spacing',
        controlLabel: 'line-height / letter-spacing',
        shortSummary: 'Adjusts vertical space between lines and horizontal breathing room between letters.',
        whatItMeans:
          '`line-height` controls the vertical spacing between wrapped lines of text; `letter-spacing` tightens or widens the gap between individual characters.',
        howItWorks:
          'A **unitless** `line-height` like `1.6` multiplies the current `font-size` (`18px × 1.6 = 28.8px` line box), scaling automatically if font size changes. `letter-spacing` in `em` units scales proportionally too: slight negative tracking (`-0.02em`) makes large headings look crisp, while positive tracking (`+0.08em`) helps uppercase labels breathe.',
        values: [
          {
            value: '1.15 / -0.02em',
            label: 'Tight Headline',
            description: 'Keeps multi-line big headings cohesive without awkward vertical gaps.',
            applyProps: { fontSize: 30, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.02 },
          },
          {
            value: '1.65 / 0em',
            label: 'Airy Paragraph',
            description: 'Gives eyes an easy path from the end of one line to the start of the next.',
            applyProps: { fontSize: 17, fontWeight: 400, lineHeight: 1.65, letterSpacing: 0 },
          },
          {
            value: '1.4 / 0.1em',
            label: 'Spaced Uppercase Kicker',
            description: 'Positive tracking makes small uppercase labels far easier to read.',
            applyProps: { fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.1, textTransform: 'uppercase' },
          },
        ],
        whenToUse:
          'Use `1.5–1.75` `line-height` for paragraphs, `1.1–1.25` for large headings, and positive `letter-spacing` (`0.05em–0.12em`) whenever setting uppercase micro-labels.',
        realWorldExample: {
          title: 'Readable Documentation Prose',
          description:
            'Setting `line-height: 1.65` stops adjacent lines of dense technical explanation from visually blurring together.',
        },
        codeExample: {
          css: `.prose {\n  font-size: 16px;\n  line-height: 1.65;\n  letter-spacing: 0em;\n}`,
          applyProps: { fontSize: 16, lineHeight: 1.65, letterSpacing: 0 },
        },
        commonMistakes: [
          {
            mistake: 'Writing `line-height: 24px` (a fixed pixel unit) on a parent container, then wondering why a `36px` child heading overlaps itself.',
            fix: 'Always write `line-height` as a **unitless number** (`1.5`, `1.6`) so every child font size gets proportional spacing.',
          },
        ],
        visualType: 'type-rhythm',
      },
      {
        id: 'maxWidthCh',
        cssProperty: 'max-width (ch) & text-align',
        controlLabel: 'max-width / text-align',
        shortSummary: 'Caps line length by character count (`ch`) and sets horizontal text alignment.',
        whatItMeans:
          '`1ch` equals the width of the `"0"` character in the active font. Setting `max-width: 60ch` keeps lines around 55–65 characters wide—even if the screen is huge.',
        howItWorks:
          'Human eyes struggle to track back to the next line when paragraphs stretch 120+ characters across a wide monitor. Capping `max-width` in `ch` stops lines from getting too long, while `text-align` anchors lines to `left`, `center`, `right`, or `justify`.',
        values: [
          {
            value: '45ch · left',
            label: 'Narrow Left (45ch)',
            description: 'Crisp narrow measure ideal for sidebars and callout notes.',
            applyProps: { maxWidthCh: 45, textAlign: 'left' },
          },
          {
            value: '60ch · left',
            label: 'Optimal Reading (60ch)',
            description: 'Classic editorial line length for maximum reading speed and comfort.',
            applyProps: { maxWidthCh: 60, textAlign: 'left' },
          },
          {
            value: '36ch · center',
            label: 'Centered Intro (36ch)',
            description: 'Balanced centered subheading beneath a hero title.',
            applyProps: { maxWidthCh: 36, textAlign: 'center' },
          },
        ],
        whenToUse:
          'Always apply `max-width: 55ch` to `65ch` on article paragraphs and descriptions. Keep body copy `left`-aligned (`center` only works well for short 1–3 line blocks).',
        realWorldExample: {
          title: 'Medium-Style Blog Column',
          description:
            'Even on an ultrawide 2560px monitor, `max-width: 65ch` keeps the article column comfortably centered and effortless to scan.',
        },
        codeExample: {
          css: `.article-body {\n  max-width: 60ch;\n  text-align: left;\n}`,
          applyProps: { maxWidthCh: 60, textAlign: 'left' },
        },
        commonMistakes: [
          {
            mistake: 'Using `text-align: justify` on narrow mobile columns, creating huge "rivers" of white space between words.',
            fix: 'Stick to `text-align: left` for narrow UI columns and mobile screens.',
          },
        ],
        visualType: 'type-measure',
      },
      {
        id: 'textTransform',
        cssProperty: 'text-transform & text-decoration & color',
        controlLabel: 'transform / decoration / color',
        shortSummary: 'Styles letter casing, underlines/strikethroughs, and foreground ink color.',
        whatItMeans:
          '`text-transform` visually changes capitalization (`uppercase`, `capitalize`, `lowercase`) without editing the HTML text. `text-decoration` adds lines (`underline`, `line-through`), and `color` sets text ink.',
        howItWorks:
          'Using CSS `text-transform: uppercase` keeps the underlying HTML sentence-cased so screen readers read words naturally instead of spelling out acronyms. Always pair `color` with enough contrast against its background (at least 4.5:1 for normal text).',
        values: [
          {
            value: 'none',
            label: 'Normal Case',
            description: 'Displays text exactly as typed in HTML.',
            applyProps: { textTransform: 'none', textDecoration: 'none' },
          },
          {
            value: 'uppercase',
            label: 'Uppercase Label',
            description: 'Turns text into all caps—best paired with small size and positive `letter-spacing`.',
            applyProps: { textTransform: 'uppercase', letterSpacing: 0.08, fontSize: 13 },
          },
          {
            value: 'underline',
            label: 'Underline Link',
            description: 'Draws a line under text to signal clickable links.',
            applyProps: { textDecoration: 'underline', color: '#2563eb' },
          },
          {
            value: 'line-through',
            label: 'Strikethrough',
            description: 'Crosses out completed checklist items or old original prices.',
            applyProps: { textDecoration: 'line-through', color: '#64748b' },
          },
        ],
        whenToUse:
          'Use `uppercase` for short section kickers (`1–3` words), `underline` on inline text links for accessibility, and `line-through` for completed tasks or discounted prices.',
        realWorldExample: {
          title: 'Sale Price Comparison',
          description:
            'An online store displays the original price with `text-decoration: line-through` and muted gray `color` next to the bold active sale price.',
        },
        codeExample: {
          css: `.old-price {\n  text-decoration: line-through;\n  color: #64748b;\n}`,
          applyProps: { textDecoration: 'line-through', color: '#64748b' },
        },
        commonMistakes: [
          {
            mistake: 'Typing ALL CAPS directly in HTML or setting long multi-line paragraphs to `text-transform: uppercase`.',
            fix: 'Keep HTML in natural case and reserve `uppercase` strictly for short headings or labels.',
          },
        ],
        visualType: 'type-style',
      },
    ],
  },
};
