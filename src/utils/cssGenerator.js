function hexToRgba(hex, opacity) {
  const clean = (hex || '#000000').replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((ch) => ch + ch).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const alpha = Number(opacity ?? 1);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isLightHex(hex) {
  const clean = (hex || '#ffffff').replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.52;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildGradientValue(props) {
  const stopsStr = (props.stops || [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');

  if (props.type === 'radial') {
    return `radial-gradient(${props.radialShape || 'circle'} at ${props.radialPosition || 'center'}, ${stopsStr})`;
  }
  if (props.type === 'conic') {
    return `conic-gradient(from ${props.angle ?? 0}deg at ${props.radialPosition || 'center'}, ${stopsStr})`;
  }
  return `linear-gradient(${props.angle ?? 135}deg, ${stopsStr})`;
}

export function buildShadowValue(props) {
  const layers = props.layers || [];
  if (layers.length === 0) return 'none';
  return layers
    .map((layer) => {
      const insetPrefix = layer.inset ? 'inset ' : '';
      return `${insetPrefix}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${hexToRgba(layer.color, layer.opacity)}`;
    })
    .join(', ');
}

export function buildTransformValue(props) {
  const parts = [];
  if (props.perspective && (props.rotateX !== 0 || props.rotateY !== 0)) {
    parts.push(`perspective(${props.perspective}px)`);
  }
  if (props.translateX !== 0 || props.translateY !== 0) {
    parts.push(`translate(${props.translateX}px, ${props.translateY}px)`);
  }
  if (props.rotate !== 0) {
    parts.push(`rotate(${props.rotate}deg)`);
  }
  if (props.rotateX !== 0) {
    parts.push(`rotateX(${props.rotateX}deg)`);
  }
  if (props.rotateY !== 0) {
    parts.push(`rotateY(${props.rotateY}deg)`);
  }
  if (props.scale !== 1) {
    parts.push(`scale(${props.scale})`);
  }
  if (props.skewX !== 0 || props.skewY !== 0) {
    parts.push(`skew(${props.skewX}deg, ${props.skewY}deg)`);
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function buildGridColumnsValue(props) {
  if (props.columnMode === 'auto-fit') {
    return `repeat(auto-fit, minmax(${props.minColWidth || 120}px, 1fr))`;
  }
  return `repeat(${props.columns || 3}, minmax(0, 1fr))`;
}

export function getPreviewStyles(playgroundId, props, options = {}) {
  const { isTransitionActive = false, isAnimationPlaying = true } = options;

  switch (playgroundId) {
    case 'flexbox':
      return {
        display: props.display,
        flexDirection: props.flexDirection,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flexWrap: props.flexWrap,
        alignContent: props.alignContent,
        gap: `${props.gap}px`,
        minHeight: `${props.containerHeight}px`,
      };

    case 'grid':
      return {
        display: 'grid',
        gridTemplateColumns: buildGridColumnsValue(props),
        gridAutoRows: `${props.rowHeight}px`,
        columnGap: `${props.columnGap}px`,
        rowGap: `${props.rowGap}px`,
        justifyItems: props.justifyItems,
        alignItems: props.alignItems,
        gridAutoFlow: props.autoFlow,
      };

    case 'box-model':
      return {
        width: `${props.width}px`,
        height: `${props.height}px`,
        padding: `${props.paddingTop}px ${props.paddingRight}px ${props.paddingBottom}px ${props.paddingLeft}px`,
        border: `${props.borderWidth}px ${props.borderStyle} ${props.borderColor}`,
        margin: `${props.marginTop}px ${props.marginRight}px ${props.marginBottom}px ${props.marginLeft}px`,
        boxSizing: props.boxSizing,
      };

    case 'typography':
      return {
        fontFamily: props.fontFamily,
        fontSize: `${props.fontSize}px`,
        fontWeight: props.fontWeight,
        lineHeight: props.lineHeight,
        letterSpacing: `${props.letterSpacing}em`,
        textAlign: props.textAlign,
        textTransform: props.textTransform,
        textDecoration: props.textDecoration,
        color: props.color,
        maxWidth: `${props.maxWidthCh}ch`,
      };

    case 'gradients':
      return {
        backgroundImage: buildGradientValue(props),
      };

    case 'shadows':
      return {
        backgroundColor: props.cardBg,
        borderRadius: `${props.cardRadius}px`,
        boxShadow: buildShadowValue(props),
      };

    case 'borders':
      return {
        borderWidth: `${props.borderWidth}px`,
        borderStyle: props.borderStyle,
        borderColor: props.borderColor,
        borderRadius: props.linkRadius
          ? `${props.radiusTL}px`
          : `${props.radiusTL}px ${props.radiusTR}px ${props.radiusBR}px ${props.radiusBL}px`,
        outlineWidth: `${props.outlineWidth}px`,
        outlineStyle: props.outlineStyle,
        outlineColor: props.outlineColor,
        outlineOffset: `${props.outlineOffset}px`,
      };

    case 'transforms':
      return {
        transform: buildTransformValue(props),
        transformOrigin: props.transformOrigin,
      };

    case 'transitions': {
      const base = {
        transitionProperty: props.property,
        transitionDuration: `${props.duration}ms`,
        transitionTimingFunction: props.timingFunction,
        transitionDelay: `${props.delay}ms`,
        backgroundColor: '#2563eb',
        borderRadius: '8px',
        transform: 'translateY(0px) scale(1)',
        opacity: 1,
      };
      if (isTransitionActive) {
        return {
          ...base,
          backgroundColor: props.targetBg,
          borderRadius: `${props.targetRadius}px`,
          transform: `translateY(${props.targetTranslateY}px) scale(${props.targetScale})`,
          opacity: props.targetOpacity,
        };
      }
      return base;
    }

    case 'animations':
      return {
        animationName: `stylelab-${props.keyframe}`,
        animationDuration: `${props.duration}s`,
        animationTimingFunction: props.timingFunction,
        animationDelay: `${props.delay}s`,
        animationIterationCount: props.iterationCount,
        animationDirection: props.direction,
        animationFillMode: props.fillMode,
        animationPlayState: isAnimationPlaying ? 'running' : 'paused',
      };

    default:
      return {};
  }
}

export function generateCssCode(playgroundId, props, items = []) {
  switch (playgroundId) {
    case 'flexbox': {
      const lines = [
        '.flex-container {',
        `  display: ${props.display};`,
        `  flex-direction: ${props.flexDirection};`,
        `  justify-content: ${props.justifyContent};`,
        `  align-items: ${props.alignItems};`,
        `  flex-wrap: ${props.flexWrap};`,
      ];
      if (props.flexWrap !== 'nowrap') {
        lines.push(`  align-content: ${props.alignContent};`);
      }
      lines.push(`  gap: ${props.gap}px;`);
      lines.push(`  min-height: ${props.containerHeight}px;`);
      lines.push('}');

      const customizedItems = items.filter(
        (item) =>
          item.flexGrow !== 0 ||
          item.flexShrink !== 1 ||
          (item.flexBasis && item.flexBasis !== 'auto') ||
          (item.alignSelf && item.alignSelf !== 'auto') ||
          item.order !== 0
      );
      customizedItems.forEach((item, index) => {
        const itemIdx = items.indexOf(item) + 1 || index + 1;
        lines.push('');
        lines.push(`.flex-item-${itemIdx} {`);
        if (item.flexGrow !== 0) lines.push(`  flex-grow: ${item.flexGrow};`);
        if (item.flexShrink !== 1) lines.push(`  flex-shrink: ${item.flexShrink};`);
        if (item.flexBasis && item.flexBasis !== 'auto') lines.push(`  flex-basis: ${item.flexBasis};`);
        if (item.alignSelf && item.alignSelf !== 'auto') lines.push(`  align-self: ${item.alignSelf};`);
        if (item.order !== 0) lines.push(`  order: ${item.order};`);
        lines.push('}');
      });
      return lines.join('\n');
    }

    case 'grid': {
      const lines = [
        '.grid-container {',
        '  display: grid;',
        `  grid-template-columns: ${buildGridColumnsValue(props)};`,
        `  grid-auto-rows: ${props.rowHeight}px;`,
        `  column-gap: ${props.columnGap}px;`,
        `  row-gap: ${props.rowGap}px;`,
        `  justify-items: ${props.justifyItems};`,
        `  align-items: ${props.alignItems};`,
        `  grid-auto-flow: ${props.autoFlow};`,
        '}',
      ];
      items.forEach((item, idx) => {
        if ((item.colSpan && item.colSpan > 1) || (item.rowSpan && item.rowSpan > 1)) {
          lines.push('');
          lines.push(`.grid-item-${idx + 1} {`);
          if (item.colSpan > 1) lines.push(`  grid-column: span ${item.colSpan};`);
          if (item.rowSpan > 1) lines.push(`  grid-row: span ${item.rowSpan};`);
          lines.push('}');
        }
      });
      return lines.join('\n');
    }

    case 'box-model': {
      const pad = props.linkPadding
        ? `${props.paddingTop}px`
        : `${props.paddingTop}px ${props.paddingRight}px ${props.paddingBottom}px ${props.paddingLeft}px`;
      const mar = props.linkMargin
        ? `${props.marginTop}px`
        : `${props.marginTop}px ${props.marginRight}px ${props.marginBottom}px ${props.marginLeft}px`;
      return [
        '.box-element {',
        `  box-sizing: ${props.boxSizing};`,
        `  width: ${props.width}px;`,
        `  height: ${props.height}px;`,
        `  padding: ${pad};`,
        `  border: ${props.borderWidth}px ${props.borderStyle} ${props.borderColor};`,
        `  margin: ${mar};`,
        '}',
      ].join('\n');
    }

    case 'typography':
      return [
        '.typography-sample {',
        `  font-family: ${props.fontFamily};`,
        `  font-size: ${props.fontSize}px;`,
        `  font-weight: ${props.fontWeight};`,
        `  line-height: ${props.lineHeight};`,
        `  letter-spacing: ${props.letterSpacing}em;`,
        `  text-align: ${props.textAlign};`,
        `  text-transform: ${props.textTransform};`,
        `  text-decoration: ${props.textDecoration};`,
        `  color: ${props.color};`,
        `  max-width: ${props.maxWidthCh}ch;`,
        '}',
      ].join('\n');

    case 'gradients':
      return [
        '.gradient-surface {',
        `  background-image: ${buildGradientValue(props)};`,
        '}',
      ].join('\n');

    case 'shadows':
      return [
        '.shadow-card {',
        `  background-color: ${props.cardBg};`,
        `  border-radius: ${props.cardRadius}px;`,
        `  box-shadow: ${buildShadowValue(props)};`,
        '}',
      ].join('\n');

    case 'borders': {
      const radius = props.linkRadius
        ? `${props.radiusTL}px`
        : `${props.radiusTL}px ${props.radiusTR}px ${props.radiusBR}px ${props.radiusBL}px`;
      const lines = [
        '.bordered-box {',
        `  border: ${props.borderWidth}px ${props.borderStyle} ${props.borderColor};`,
        `  border-radius: ${radius};`,
      ];
      if (props.outlineStyle !== 'none' && props.outlineWidth > 0) {
        lines.push(`  outline: ${props.outlineWidth}px ${props.outlineStyle} ${props.outlineColor};`);
        lines.push(`  outline-offset: ${props.outlineOffset}px;`);
      }
      lines.push('}');
      return lines.join('\n');
    }

    case 'transforms':
      return [
        '.transformed-element {',
        `  transform: ${buildTransformValue(props)};`,
        `  transform-origin: ${props.transformOrigin};`,
        '}',
      ].join('\n');

    case 'transitions':
      return [
        '.interactive-element {',
        '  background-color: #2563eb;',
        '  border-radius: 8px;',
        '  transform: translateY(0px) scale(1);',
        '  opacity: 1;',
        `  transition: ${props.property} ${props.duration}ms ${props.timingFunction} ${props.delay}ms;`,
        '}',
        '',
        '.interactive-element:hover {',
        `  background-color: ${props.targetBg};`,
        `  border-radius: ${props.targetRadius}px;`,
        `  transform: translateY(${props.targetTranslateY}px) scale(${props.targetScale});`,
        `  opacity: ${props.targetOpacity};`,
        '}',
      ].join('\n');

    case 'animations': {
      const lines = [
        '.animated-element {',
        `  animation: ${props.keyframe} ${props.duration}s ${props.timingFunction} ${props.delay}s ${props.iterationCount} ${props.direction} ${props.fillMode};`,
        '}',
      ];
      if (items.length > 1 && (props.staggerMs || 0) > 0) {
        items.forEach((_, idx) => {
          if (idx === 0) return;
          const staggeredDelay = Number(
            (Number(props.delay) + (idx * (props.staggerMs || 0)) / 1000).toFixed(2)
          );
          lines.push('');
          lines.push(`.animated-element-${idx + 1} {`);
          lines.push(`  animation-delay: ${staggeredDelay}s;`);
          lines.push('}');
        });
      }
      lines.push('');
      lines.push(getKeyframeSnippet(props.keyframe));
      return lines.join('\n');
    }

    default:
      return '';
  }
}

function getKeyframeSnippet(name) {
  switch (name) {
    case 'bounce':
      return `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-28px); }\n}`;
    case 'pulse':
      return `@keyframes pulse {\n  0%, 100% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.12); opacity: 0.78; }\n}`;
    case 'spin':
      return `@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}`;
    case 'shake':
      return `@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  20% { transform: translateX(-10px); }\n  40% { transform: translateX(10px); }\n  60% { transform: translateX(-6px); }\n  80% { transform: translateX(6px); }\n}`;
    case 'slide-in':
      return `@keyframes slide-in {\n  0% { transform: translateX(-40px); opacity: 0.2; }\n  100% { transform: translateX(0); opacity: 1; }\n}`;
    case 'float':
    default:
      return `@keyframes float {\n  0%, 100% { transform: translateY(0) rotate(0deg); }\n  50% { transform: translateY(-14px) rotate(2deg); }\n}`;
  }
}

function getExportDemoBaseCss(playgroundId, props) {
  switch (playgroundId) {
    case 'flexbox':
      return [
        '.flex-container {',
        '  padding: 10px;',
        '  border-radius: 6px;',
        '  background: #ffffff;',
        '  outline: 1px dashed rgba(59, 130, 246, 0.75);',
        '}',
        '.flex-item {',
        '  padding: 8px 12px;',
        '  border: 1px solid #e2e8f0;',
        '  border-radius: 6px;',
        '  background: #f8fafc;',
        '  color: #1e293b;',
        '  font-size: 12px;',
        '  font-weight: 600;',
        '}',
        '.inline-sibling {',
        '  display: inline-block;',
        '  margin-top: 6px;',
        '  padding: 6px 10px;',
        '  border: 1px dashed #cbd5e1;',
        '  border-radius: 4px;',
        '  background: #f1f5f9;',
        '  color: #475569;',
        '  font-family: ui-monospace, monospace;',
        '  font-size: 11px;',
        '  vertical-align: top;',
        '}',
      ].join('\n');

    case 'grid':
      return [
        '.grid-container {',
        '  padding: 10px;',
        '  border-radius: 6px;',
        '  background: #ffffff;',
        '  outline: 1px dashed rgba(59, 130, 246, 0.7);',
        '}',
        '.grid-item {',
        '  display: flex;',
        '  align-items: center;',
        '  padding: 8px;',
        '  border: 1px solid #e2e8f0;',
        '  border-radius: 6px;',
        '  background: #f8fafc;',
        '  color: #1e293b;',
        '  font-size: 12px;',
        '  font-weight: 600;',
        '}',
      ].join('\n');

    case 'box-model':
      return [
        '.box-element {',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  background: rgba(16, 185, 129, 0.16);',
        '  color: #1e3a8a;',
        '  font-family: ui-monospace, monospace;',
        '  font-size: 12px;',
        '  font-weight: 500;',
        '  text-align: center;',
        '}',
      ].join('\n');

    case 'gradients':
      return [
        '.gradient-surface {',
        '  min-height: 176px;',
        '  width: 100%;',
        '  display: flex;',
        '  align-items: flex-end;',
        '  padding: 16px;',
        '  margin-bottom: 16px;',
        '  border-radius: 8px;',
        '  color: #ffffff;',
        '  font-family: ui-monospace, monospace;',
        '  font-size: 12px;',
        '  font-weight: 500;',
        '  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);',
        '}',
      ].join('\n');

    case 'shadows': {
      const lightCard = isLightHex(props.cardBg);
      return [
        '.shadow-card {',
        '  width: 208px;',
        '  height: 144px;',
        '  padding: 16px;',
        '  margin: 12px;',
        '  display: inline-flex;',
        '  flex-direction: column;',
        '  justify-content: flex-end;',
        `  color: ${lightCard ? '#0f172a' : '#f1f5f9'};`,
        '  font-size: 14px;',
        '  font-weight: 600;',
        '}',
      ].join('\n');
    }

    case 'borders':
      return [
        '.bordered-box {',
        '  width: 192px;',
        '  height: 128px;',
        '  padding: 16px;',
        '  margin: 12px;',
        '  display: inline-flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  background: #ffffff;',
        '  color: #1e293b;',
        '  font-size: 12px;',
        '  font-weight: 600;',
        '  text-align: center;',
        '}',
      ].join('\n');

    case 'transforms':
      return [
        '.transformed-element {',
        '  width: 160px;',
        '  height: 128px;',
        '  padding: 12px;',
        '  margin: 36px;',
        '  display: inline-flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  border-radius: 6px;',
        '  background: #2563eb;',
        '  color: #ffffff;',
        '  font-size: 12px;',
        '  font-weight: 600;',
        '  text-align: center;',
        '}',
      ].join('\n');

    case 'transitions':
      return [
        '.interactive-element {',
        '  padding: 12px 24px;',
        '  margin: 8px;',
        '  border: none;',
        '  color: #ffffff;',
        '  font-size: 14px;',
        '  font-weight: 600;',
        '  cursor: pointer;',
        '}',
      ].join('\n');

    case 'animations':
      return [
        '.animated-element {',
        '  width: 128px;',
        '  height: 96px;',
        '  padding: 12px;',
        '  margin: 16px;',
        '  display: inline-flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  border-radius: 8px;',
        '  background: #2563eb;',
        '  color: #ffffff;',
        '  font-size: 12px;',
        '  font-weight: 600;',
        '  text-align: center;',
        '}',
      ].join('\n');

    default:
      return '';
  }
}

export function generateExportHtml(playgroundId, props, items = []) {
  const css = generateCssCode(playgroundId, props, items);
  const safeCss = css.replace(/<\/style/gi, '<\\/style');
  const baseDemoCss = getExportDemoBaseCss(playgroundId, props);
  const safeTitle = escapeHtml(playgroundId);
  const bodyBg =
    playgroundId === 'typography' && isLightHex(props.color)
      ? '#0f172a'
      : playgroundId === 'shadows'
        ? '#f1f5f9'
        : '#f8fafc';
  const bodyText = playgroundId === 'typography' && isLightHex(props.color) ? '#f8fafc' : '#0f172a';
  let bodyMarkup = '';

  if (playgroundId === 'flexbox') {
    const children = items
      .map(
        (item, i) =>
          `    <div class="flex-item flex-item-${i + 1}">${escapeHtml(item.text || `Item ${i + 1}`)}</div>`
      )
      .join('\n');
    bodyMarkup = `  <div class="flex-container">\n${children}\n  </div>`;
    if (props.display === 'inline-flex') {
      bodyMarkup += `\n  <span class="inline-sibling">Adjacent inline sibling</span>`;
    }
  } else if (playgroundId === 'grid') {
    const children = items
      .map(
        (item, i) =>
          `    <div class="grid-item grid-item-${i + 1}">${escapeHtml(item.text || `Cell ${i + 1}`)}</div>`
      )
      .join('\n');
    bodyMarkup = `  <div class="grid-container">\n${children}\n  </div>`;
  } else if (playgroundId === 'box-model') {
    bodyMarkup = items
      .map((item) => `  <div class="box-element">${escapeHtml(item.text || 'Content Area')}</div>`)
      .join('\n');
  } else if (playgroundId === 'typography') {
    bodyMarkup = items
      .map((item) => `  <p class="typography-sample">${escapeHtml(item.text)}</p>`)
      .join('\n');
  } else if (playgroundId === 'gradients') {
    bodyMarkup = items
      .map((item) => `  <div class="gradient-surface">${escapeHtml(item.text)}</div>`)
      .join('\n');
  } else if (playgroundId === 'shadows') {
    bodyMarkup = items
      .map((item) => `  <div class="shadow-card">${escapeHtml(item.text)}</div>`)
      .join('\n');
  } else if (playgroundId === 'borders') {
    bodyMarkup = items
      .map((item) => `  <div class="bordered-box">${escapeHtml(item.text)}</div>`)
      .join('\n');
  } else if (playgroundId === 'transforms') {
    bodyMarkup = items
      .map((item) => `  <div class="transformed-element">${escapeHtml(item.text)}</div>`)
      .join('\n');
  } else if (playgroundId === 'transitions') {
    bodyMarkup = items
      .map((item) => `  <button type="button" class="interactive-element">${escapeHtml(item.text)}</button>`)
      .join('\n');
  } else if (playgroundId === 'animations') {
    bodyMarkup = items
      .map(
        (item, i) =>
          `  <div class="animated-element animated-element-${i + 1}">${escapeHtml(item.text)}</div>`
      )
      .join('\n');
  }

  const baseCssBlock = baseDemoCss
    ? `\n    /* Base preview layout styles */\n${baseDemoCss
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')}\n`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>StyleLab Export — ${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, -apple-system, sans-serif;
      background: ${bodyBg};
      color: ${bodyText};
    }${baseCssBlock}
${safeCss
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}
  </style>
</head>
<body>
${bodyMarkup}
</body>
</html>`;
}
