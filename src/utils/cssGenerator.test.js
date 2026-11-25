import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYGROUNDS, PLAYGROUND_IDS } from '../data/playgrounds.js';
import {
  buildGradientValue,
  buildGridColumnsValue,
  buildShadowValue,
  buildTransformValue,
  escapeHtml,
  generateCssCode,
  generateExportHtml,
  getPreviewStyles,
} from './cssGenerator.js';
import { tokenizeCssLines } from './syntaxHighlight.js';
import {
  deleteCustomPreset,
  loadCustomPresets,
  loadPreferences,
  saveCustomPreset,
  savePreferences,
} from './storage.js';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

test('all 10 required playgrounds are configured with presets and explanations', () => {
  assert.equal(PLAYGROUND_IDS.length, 10);
  for (const id of PLAYGROUND_IDS) {
    const pg = PLAYGROUNDS[id];
    assert.ok(pg, `Missing playground ${id}`);
    assert.ok(pg.presets.length >= 3, `Expected presets for ${id}`);
    assert.ok(Object.keys(pg.explanations).length >= 3, `Expected explanations for ${id}`);
    const css = generateCssCode(id, pg.defaultProps, pg.defaultItems);
    assert.ok(css.includes('{') && css.includes('}'), `Invalid CSS output for ${id}`);
    const html = generateExportHtml(id, pg.defaultProps, pg.defaultItems);
    assert.ok(html.includes('<!doctype html>') && html.includes('<style>'), `Invalid HTML export for ${id}`);
  }
});

test('flexbox CSS and item overrides generate accurately', () => {
  const props = { ...PLAYGROUNDS.flexbox.defaultProps, justifyContent: 'space-between', gap: 20 };
  const items = [
    { id: 1, label: '01', text: 'A', flexGrow: 2, flexShrink: 1, alignSelf: 'center', order: 0 },
    { id: 2, label: '02', text: 'B', flexGrow: 0, flexShrink: 1, alignSelf: 'auto', order: 0 },
  ];
  const css = generateCssCode('flexbox', props, items);
  assert.ok(css.includes('justify-content: space-between;'));
  assert.ok(css.includes('gap: 20px;'));
  assert.ok(css.includes('.flex-item-1'));
  assert.ok(css.includes('flex-grow: 2;'));
  assert.ok(css.includes('align-self: center;'));
});

test('gradients, shadows, and transforms builders format valid CSS', () => {
  const grad = buildGradientValue(PLAYGROUNDS.gradients.defaultProps);
  assert.ok(grad.startsWith('linear-gradient(135deg,'));

  const shadow = buildShadowValue(PLAYGROUNDS.shadows.defaultProps);
  assert.ok(shadow.includes('rgba('));

  const transform = buildTransformValue({
    translateX: 10,
    translateY: -5,
    rotate: 15,
    scale: 1.2,
    skewX: 0,
    skewY: 0,
    rotateX: 0,
    rotateY: 0,
    perspective: 600,
  });
  assert.equal(transform, 'translate(10px, -5px) rotate(15deg) scale(1.2)');
});

test('transitions preview style reflects active toggle state', () => {
  const props = PLAYGROUNDS.transitions.defaultProps;
  const restStyle = getPreviewStyles('transitions', props, { isTransitionActive: false });
  const activeStyle = getPreviewStyles('transitions', props, { isTransitionActive: true });
  assert.notEqual(restStyle.transform, activeStyle.transform);
  assert.equal(activeStyle.backgroundColor, props.targetBg);
});

test('syntax highlighter tokenizes selectors, properties, and values', () => {
  const lines = tokenizeCssLines('.box {\n  gap: 16px;\n  color: #2563eb;\n}');
  assert.equal(lines.length, 4);
  assert.equal(lines[0][0].type, 'selector');
  assert.equal(lines[1][0].type, 'property');
  assert.ok(lines[1].some((t) => t.type === 'number' && t.text === '16px'));
  assert.ok(lines[2].some((t) => t.type === 'color' && t.text === '#2563eb'));
});

test('storage helpers save and load preferences and custom presets', () => {
  const mem = createMemoryStorage();
  savePreferences({ theme: 'dark', activePlayground: 'grid', viewportSize: 'tablet' }, mem);
  const prefs = loadPreferences(mem);
  assert.equal(prefs.theme, 'dark');
  assert.equal(prefs.activePlayground, 'grid');
  assert.equal(prefs.viewportSize, 'tablet');

  saveCustomPreset('grid', 'My Grid', PLAYGROUNDS.grid.defaultProps, PLAYGROUNDS.grid.defaultItems, mem);
  const presets = loadCustomPresets(mem);
  assert.equal(presets.grid.length, 1);
  assert.equal(presets.grid[0].name, 'My Grid');

  const afterDelete = deleteCustomPreset('grid', presets.grid[0].id, mem);
  assert.equal(afterDelete.grid.length, 0);
});

import { LEARNING_GUIDES, getModuleLearningGuide, getPropertyGuide } from '../data/learningGuides.js';

test('learning guides cover all 10 playgrounds with complete beginner sections and valid apply patches', () => {
  assert.equal(Object.keys(LEARNING_GUIDES).length, 10);

  for (const id of PLAYGROUND_IDS) {
    const guide = getModuleLearningGuide(id);
    const pg = PLAYGROUNDS[id];
    assert.ok(guide, `Missing learning guide for ${id}`);
    assert.ok(guide.mentalModel && guide.mentalModel.length > 20, `Missing mentalModel for ${id}`);
    assert.ok(guide.keyConcept && guide.keyConcept.length > 15, `Missing keyConcept for ${id}`);
    assert.ok(Array.isArray(guide.properties) && guide.properties.length >= 3, `Too few property guides for ${id}`);

    for (const prop of guide.properties) {
      assert.equal(getPropertyGuide(id, prop.id)?.id, prop.id);
      assert.ok(prop.controlLabel && prop.cssProperty, `Missing controlLabel/cssProperty in ${id}.${prop.id}`);
      assert.ok(prop.shortSummary && prop.shortSummary.length > 10, `Missing shortSummary in ${id}.${prop.id}`);
      assert.ok(prop.whatItMeans && prop.whatItMeans.length > 15, `Missing whatItMeans in ${id}.${prop.id}`);
      assert.ok(prop.howItWorks && prop.howItWorks.length > 15, `Missing howItWorks in ${id}.${prop.id}`);
      assert.ok(Array.isArray(prop.values) && prop.values.length >= 2, `Expected values array in ${id}.${prop.id}`);
      assert.ok(prop.whenToUse && prop.whenToUse.length > 15, `Missing whenToUse in ${id}.${prop.id}`);
      assert.ok(prop.realWorldExample?.title && prop.realWorldExample?.description, `Missing realWorldExample in ${id}.${prop.id}`);
      assert.ok(prop.codeExample?.css && prop.codeExample.css.includes('{'), `Missing codeExample.css in ${id}.${prop.id}`);
      assert.ok(Array.isArray(prop.commonMistakes) && prop.commonMistakes.length >= 1, `Missing commonMistakes in ${id}.${prop.id}`);
      assert.ok(prop.visualType, `Missing visualType in ${id}.${prop.id}`);

      const patches = [
        prop.codeExample?.applyProps,
        ...prop.values.map((v) => v.applyProps),
      ].filter(Boolean);

      if (prop.id !== 'itemProperties' && prop.id !== 'cellSpan') {
        assert.ok(patches.length >= 1, `Expected at least one applyProps patch in ${id}.${prop.id}`);
      }
      for (const patch of patches) {
        const mergedProps = { ...pg.defaultProps, ...patch };
        const css = generateCssCode(id, mergedProps, pg.defaultItems);
        assert.ok(css.includes('{') && css.includes('}'), `Patch broke CSS output in ${id}.${prop.id}`);
      }
    }
  }
});

import { getPreviewDiagnostics } from './previewDiagnostics.js';

test('flexbox flex-basis emits CSS and previewDiagnostics explains inactive property conditions', () => {
  const items = [
    { id: 1, label: '01', text: 'A', flexGrow: 1, flexShrink: 1, flexBasis: '160px', alignSelf: 'auto', order: 0 },
  ];
  const css = generateCssCode('flexbox', PLAYGROUNDS.flexbox.defaultProps, items);
  assert.ok(css.includes('flex-basis: 160px;'));

  const inlineRowNotes = getPreviewDiagnostics(
    'flexbox',
    { ...PLAYGROUNDS.flexbox.defaultProps, display: 'inline-flex', flexWrap: 'wrap' },
    PLAYGROUNDS.flexbox.defaultItems,
    { lineCount: 1, width: 290, height: 280, contentHeight: 60 }
  );
  assert.ok(inlineRowNotes.some((n) => n.id === 'inline-flex-justify'));
  assert.ok(inlineRowNotes.some((n) => n.id === 'align-content-single-line'));

  const nowrapNotes = getPreviewDiagnostics(
    'flexbox',
    { ...PLAYGROUNDS.flexbox.defaultProps, flexWrap: 'nowrap' },
    PLAYGROUNDS.flexbox.defaultItems,
    { lineCount: 1, width: 640, height: 280, contentHeight: 60 }
  );
  assert.ok(nowrapNotes.some((n) => n.id === 'align-content-nowrap'));

  const denseGridNotes = getPreviewDiagnostics(
    'grid',
    { ...PLAYGROUNDS.grid.defaultProps, autoFlow: 'row dense' },
    PLAYGROUNDS.grid.defaultItems,
    { width: 640, height: 200 }
  );
  assert.ok(denseGridNotes.some((n) => n.id === 'grid-dense-no-spans'));

  const flatPerspectiveNotes = getPreviewDiagnostics(
    'transforms',
    { ...PLAYGROUNDS.transforms.defaultProps, rotateX: 0, rotateY: 0, perspective: 600 },
    PLAYGROUNDS.transforms.defaultItems
  );
  assert.ok(flatPerspectiveNotes.some((n) => n.id === 'transforms-perspective-flat'));
});

test('escapeHtml and generateExportHtml safely escape user-entered text and style tags', () => {
  assert.equal(escapeHtml('<script>alert("xss")</script> & \'test\''), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;test&#39;');

  const xssItems = [
    { id: 1, text: '<img src=x onerror="alert(1)"> & "quoted" \'single\'' },
  ];
  const html = generateExportHtml('typography', { ...PLAYGROUNDS.typography.defaultProps, color: '#f8fafc' }, xssItems);
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &quot;quoted&quot; &#39;single&#39;'));
  assert.ok(html.includes('background: #0f172a;'));

  const maliciousCssProps = { ...PLAYGROUNDS.borders.defaultProps, borderColor: '</style><script>alert(1)</script>' };
  const borderHtml = generateExportHtml('borders', maliciousCssProps, PLAYGROUNDS.borders.defaultItems);
  assert.ok(!borderHtml.includes('</style><script>'));
});

test('exported HTML and generated CSS maintain parity across animations stagger, inline-flex, box-model, and borders', () => {
  const animItems = [
    { id: 1, label: '01', text: 'One' },
    { id: 2, label: '02', text: 'Two' },
    { id: 3, label: '03', text: 'Three' },
  ];
  const animProps = { ...PLAYGROUNDS.animations.defaultProps, delay: 0.1, staggerMs: 140 };
  const animCss = generateCssCode('animations', animProps, animItems);
  assert.ok(animCss.includes('.animated-element-2'));
  assert.ok(animCss.includes('animation-delay: 0.24s;'));
  assert.ok(animCss.includes('.animated-element-3'));
  assert.ok(animCss.includes('animation-delay: 0.38s;'));
  const animHtml = generateExportHtml('animations', animProps, animItems);
  assert.ok(animHtml.includes('class="animated-element animated-element-2"'));

  const inlineFlexHtml = generateExportHtml(
    'flexbox',
    { ...PLAYGROUNDS.flexbox.defaultProps, display: 'inline-flex' },
    PLAYGROUNDS.flexbox.defaultItems
  );
  assert.ok(inlineFlexHtml.includes('display: inline-flex;'));
  assert.ok(inlineFlexHtml.includes('Adjacent inline sibling'));

  const splitBoxProps = {
    ...PLAYGROUNDS['box-model'].defaultProps,
    linkPadding: false,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 30,
    paddingLeft: 40,
    linkMargin: false,
    marginTop: 4,
    marginRight: 8,
    marginBottom: 12,
    marginLeft: 16,
  };
  const boxCss = generateCssCode('box-model', splitBoxProps);
  assert.ok(boxCss.includes('padding: 10px 20px 30px 40px;'));
  assert.ok(boxCss.includes('margin: 4px 8px 12px 16px;'));

  const noOutlineBorders = generateCssCode('borders', {
    ...PLAYGROUNDS.borders.defaultProps,
    outlineStyle: 'none',
    outlineWidth: 4,
  });
  assert.ok(!noOutlineBorders.includes('outline:'));
});

test('gradients, shadows, grid, and transforms edge cases generate valid CSS', () => {
  const conic = buildGradientValue({
    type: 'conic',
    angle: 0,
    radialPosition: 'top left',
    stops: [
      { id: 1, color: '#ff0000', position: 100 },
      { id: 2, color: '#00ff00', position: 0 },
    ],
  });
  assert.equal(conic, 'conic-gradient(from 0deg at top left, #00ff00 0%, #ff0000 100%)');

  assert.equal(buildShadowValue({ layers: [] }), 'none');
  assert.equal(
    buildShadowValue({ layers: [{ x: 0, y: 2, blur: 4, spread: 0, color: '#abc', opacity: 0, inset: true }] }),
    'inset 0px 2px 4px 0px rgba(170, 187, 204, 0)'
  );

  assert.equal(
    buildGridColumnsValue({ columnMode: 'auto-fit', minColWidth: 160 }),
    'repeat(auto-fit, minmax(160px, 1fr))'
  );

  assert.equal(
    buildTransformValue({
      translateX: 0,
      translateY: 0,
      rotate: 0,
      scale: 1,
      skewX: 0,
      skewY: 0,
      rotateX: 20,
      rotateY: 0,
      perspective: 500,
    }),
    'perspective(500px) rotateX(20deg)'
  );
  assert.equal(
    buildTransformValue({
      translateX: 0,
      translateY: 0,
      rotate: 0,
      scale: 1,
      skewX: 0,
      skewY: 0,
      rotateX: 0,
      rotateY: 0,
      perspective: 500,
    }),
    'none'
  );
});

test('previewDiagnostics detects clamped border-box, thin double border, and animation fill-mode warnings', () => {
  const clamped = getPreviewDiagnostics(
    'box-model',
    { ...PLAYGROUNDS['box-model'].defaultProps, boxSizing: 'border-box', width: 100, height: 60, paddingLeft: 40, paddingRight: 40, borderWidth: 12 },
    PLAYGROUNDS['box-model'].defaultItems
  );
  assert.ok(clamped.some((n) => n.id === 'border-box-clamped'));

  const thinDouble = getPreviewDiagnostics(
    'borders',
    { ...PLAYGROUNDS.borders.defaultProps, borderStyle: 'double', borderWidth: 2, outlineStyle: 'solid', outlineWidth: 2 },
    PLAYGROUNDS.borders.defaultItems
  );
  assert.ok(thinDouble.some((n) => n.id === 'borders-double-thin'));
  assert.ok(!thinDouble.some((n) => n.id === 'borders-outline-hidden'));

  const infiniteForwards = getPreviewDiagnostics(
    'animations',
    { ...PLAYGROUNDS.animations.defaultProps, iterationCount: 'infinite', fillMode: 'forwards' },
    PLAYGROUNDS.animations.defaultItems
  );
  assert.ok(infiniteForwards.some((n) => n.id === 'animation-fillmode-infinite'));
});

test('storage helpers handle corrupted JSON and ignore blank custom preset names', () => {
  const mem = createMemoryStorage();
  mem.setItem('stylelab_preferences_v1', '{broken-json');
  mem.setItem('stylelab_custom_presets_v1', 'not-valid-json');

  const prefs = loadPreferences(mem);
  assert.equal(prefs.theme, 'light');
  assert.equal(prefs.activePlayground, 'flexbox');

  const presets = saveCustomPreset('flexbox', '   ', PLAYGROUNDS.flexbox.defaultProps, PLAYGROUNDS.flexbox.defaultItems, mem);
  assert.deepEqual(presets, {});
});
