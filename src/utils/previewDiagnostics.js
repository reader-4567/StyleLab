/**
 * Pure diagnostic helper that inspects the active playground configuration,
 * items, and measured DOM metrics to explain when a selected CSS property
 * produces no visible effect under the current layout conditions.
 */
export function getPreviewDiagnostics(playgroundId, props = {}, items = [], metrics = {}) {
  const notes = [];
  const lineCount = typeof metrics.lineCount === 'number' ? metrics.lineCount : 1;
  const containerWidth = typeof metrics.width === 'number' ? metrics.width : 0;
  const containerHeight = typeof metrics.height === 'number' ? metrics.height : 0;
  const contentHeight = typeof metrics.contentHeight === 'number' ? metrics.contentHeight : 0;

  if (playgroundId === 'flexbox') {
    const isRow = props.flexDirection === 'row' || props.flexDirection === 'row-reverse';
    const isInline = props.display === 'inline-flex';
    const isWrapping = props.flexWrap !== 'nowrap';

    if (isInline && isRow && lineCount <= 1) {
      notes.push({
        id: 'inline-flex-justify',
        title: 'inline-flex sizes to its content',
        detail:
          'Because display: inline-flex shrink-wraps its width around its items when no explicit width is set, justify-content and flex-grow have no extra horizontal room to distribute on a single row. Switch flex-direction to column (to use min-height) or add enough items to wrap onto multiple lines.',
      });
    }

    if (!isWrapping) {
      notes.push({
        id: 'align-content-nowrap',
        title: 'Single-line flex container (nowrap)',
        detail:
          'With flex-wrap: nowrap, all items remain on a single line, so align-content has no effect. Switch flex-wrap to wrap and create 2+ lines to distribute space between lines.',
      });
    } else if (lineCount <= 1) {
      notes.push({
        id: 'align-content-single-line',
        title: 'align-content needs 2+ wrapped lines',
        detail:
          'Although flex-wrap is enabled, all items currently fit on 1 line. Add more items, narrow the preview viewport (Tablet/Mobile), or select an item and increase flex-basis so items wrap onto a second line.',
      });
    } else if (containerHeight > 0 && contentHeight > 0 && containerHeight <= contentHeight + 8) {
      notes.push({
        id: 'align-content-no-space',
        title: 'No leftover cross-axis space for align-content',
        detail:
          'Your items wrap onto multiple lines, but they already fill the container min-height. Increase min-height so align-content has extra vertical space to distribute between lines.',
      });
    }

    if (isWrapping && props.alignContent === 'flex-start' && props.alignItems === 'stretch') {
      notes.push({
        id: 'wrap-stretch-behavior',
        title: 'Why items do not stretch to full min-height',
        detail:
          'With flex-wrap: wrap and align-content: flex-start, each flex line shrinks to the tallest item on that line rather than stretching to container min-height. Switch flex-wrap to nowrap or align-content to stretch to stretch items across the full height.',
      });
    }

    if (props.alignItems === 'baseline') {
      notes.push({
        id: 'baseline-uniform-items',
        title: 'align-items: baseline with uniform typography',
        detail:
          'baseline aligns items along their first text baseline. When all items share the same font size and padding, baseline visually matches flex-start.',
      });
    }

    const hasCustomShrink = items.some((it) => (it.flexShrink ?? 1) !== 1);
    if (hasCustomShrink && isWrapping) {
      notes.push({
        id: 'flex-shrink-wrapping',
        title: 'flex-shrink inactive while wrapping',
        detail:
          'When flex-wrap is wrap, overflowing items move onto a new line instead of shrinking. Switch flex-wrap to nowrap and give items a larger flex-basis to see flex-shrink in action.',
      });
    }
  }

  if (playgroundId === 'grid') {
    if (props.columnMode === 'auto-fit' && containerWidth > 0) {
      const minW = props.minColWidth || 140;
      const gap = props.columnGap || 0;
      const maxColsThatFit = Math.max(1, Math.floor((containerWidth + gap) / (minW + gap)));
      if (items.length < maxColsThatFit) {
        notes.push({
          id: 'grid-autofit-collapse',
          title: 'auto-fit collapses empty tracks',
          detail: `Up to ${maxColsThatFit} columns of ${minW}px can fit here, but you have ${items.length} items. auto-fit collapses unused tracks so existing items expand to share the row.`,
        });
      }
    }

    const hasSpans = items.some((it) => (it.colSpan || 1) > 1 || (it.rowSpan || 1) > 1);
    if ((props.autoFlow === 'row dense' || props.autoFlow === 'column dense') && !hasSpans) {
      notes.push({
        id: 'grid-dense-no-spans',
        title: 'dense packing needs spanning cells',
        detail:
          'All cells are currently 1×1, so no gaps exist to backfill. Click a cell and set grid-column span > 1 to see dense move smaller later cells into empty holes.',
      });
    }

    if (props.autoFlow === 'column' || props.autoFlow === 'column dense') {
      notes.push({
        id: 'grid-column-flow',
        title: 'grid-auto-flow: column adds implicit columns',
        detail:
          'Because no explicit grid-template-rows count is set, grid-auto-flow: column places items side-by-side into Row 1, creating implicit horizontal columns.',
      });
    }
  }

  if (playgroundId === 'box-model') {
    if (props.boxSizing === 'border-box') {
      const horizChrome = (props.paddingLeft || 0) + (props.paddingRight || 0) + (props.borderWidth || 0) * 2;
      const vertChrome = (props.paddingTop || 0) + (props.paddingBottom || 0) + (props.borderWidth || 0) * 2;
      if (horizChrome >= props.width || vertChrome >= props.height) {
        notes.push({
          id: 'border-box-clamped',
          title: 'Padding + border exceeds declared width/height',
          detail:
            'In border-box mode, content shrinks down to 0px once padding + border reaches the declared size; past that threshold, the total border-box expands to hold the padding and border.',
        });
      }
    }
  }

  if (playgroundId === 'typography') {
    if (props.textAlign === 'justify') {
      notes.push({
        id: 'typography-justify-last-line',
        title: 'Last line never stretches with justify',
        detail:
          'text-align: justify spaces words evenly on wrapped lines, while the final line of a paragraph always stays left-aligned. Short text that fits on one line will look identical to left.',
      });
    }
  }

  if (playgroundId === 'borders') {
    if (props.outlineStyle === 'none' || props.outlineWidth === 0) {
      notes.push({
        id: 'borders-outline-hidden',
        title: 'Outline is currently hidden',
        detail:
          'Set outline-style (solid, dashed, or dotted) and outline-width > 0 to inspect how outline and outline-offset draw outside the border without shifting layout.',
      });
    }
    if (props.borderStyle === 'double' && props.borderWidth > 0 && props.borderWidth < 3) {
      notes.push({
        id: 'borders-double-thin',
        title: 'border-style: double needs at least 3px',
        detail:
          'Because a double border draws two lines with a gap between them, widths below 3px collapse into a single solid stroke. Increase border-width to 3px or higher.',
      });
    }
  }

  if (playgroundId === 'transforms') {
    if (props.rotateX === 0 && props.rotateY === 0) {
      notes.push({
        id: 'transforms-perspective-flat',
        title: 'perspective needs 3D rotation',
        detail:
          'perspective controls depth foreshortening, which is only visible once rotateX or rotateY tilts the element in 3D space.',
      });
    }

    const onlyTranslate =
      props.rotate === 0 &&
      props.scale === 1 &&
      props.skewX === 0 &&
      props.skewY === 0 &&
      props.rotateX === 0 &&
      props.rotateY === 0;
    if (props.transformOrigin !== 'center center' && onlyTranslate) {
      notes.push({
        id: 'transforms-origin-translate',
        title: 'transform-origin does not affect translate()',
        detail:
          'transform-origin acts as the pivot point for rotate(), scale(), and skew(). Increase rotate or scale to see how changing the pivot changes the movement.',
      });
    }
  }

  if (playgroundId === 'transitions' && props.property !== 'all') {
    const unchangedMap = {
      transform: props.targetTranslateY === 0 && props.targetScale === 1,
      'background-color': (props.targetBg || '').toLowerCase() === '#2563eb',
      'border-radius': props.targetRadius === 8,
      opacity: props.targetOpacity === 1,
    };
    if (unchangedMap[props.property]) {
      notes.push({
        id: 'transition-property-unchanged',
        title: `Target ${props.property} matches resting state`,
        detail: `transition-property is restricted to ${props.property}, and its Hover/Active target currently equals its resting value—other changing properties will snap instantly until you adjust ${props.property}.`,
      });
    }
  }

  if (playgroundId === 'animations') {
    if (props.iterationCount === 'infinite' && (props.fillMode === 'forwards' || props.fillMode === 'both')) {
      notes.push({
        id: 'animation-fillmode-infinite',
        title: 'forwards has no visible effect when looping infinitely',
        detail:
          'animation-fill-mode: forwards holds the final keyframe after playback stops. Set iteration-count to 1, 2, or 3 and click Restart to observe how fill-mode preserves the end state.',
      });
    }
  }

  return notes;
}
