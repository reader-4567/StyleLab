/**
 * Tokenizes CSS code into syntax-highlighted segments per line
 * without relying on raw HTML injection.
 */
export function tokenizeCssLines(cssText) {
  const lines = (cssText || '').split('\n');
  return lines.map((line) => tokenizeCssLine(line));
}

function tokenizeCssLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return [{ type: 'plain', text: line }];
  }

  // Selector or @keyframes opening line
  if (trimmed.startsWith('@')) {
    const braceIdx = line.indexOf('{');
    if (braceIdx !== -1) {
      return [
        { type: 'atrule', text: line.slice(0, braceIdx) },
        { type: 'punctuation', text: '{' },
      ];
    }
    return [{ type: 'atrule', text: line }];
  }

  if (trimmed.endsWith('{')) {
    const braceIdx = line.indexOf('{');
    return [
      { type: 'selector', text: line.slice(0, braceIdx) },
      { type: 'punctuation', text: '{' },
    ];
  }

  if (trimmed === '}') {
    return [{ type: 'punctuation', text: line }];
  }

  // Property: value;
  const colonIdx = line.indexOf(':');
  if (colonIdx !== -1) {
    const propPart = line.slice(0, colonIdx);
    const rest = line.slice(colonIdx + 1);
    const hasSemi = rest.trimEnd().endsWith(';');
    const semiIdx = hasSemi ? rest.lastIndexOf(';') : -1;
    const valPart = semiIdx !== -1 ? rest.slice(0, semiIdx) : rest;
    const afterSemi = semiIdx !== -1 ? rest.slice(semiIdx + 1) : '';

    const tokens = [
      { type: 'property', text: propPart },
      { type: 'punctuation', text: ':' },
      ...tokenizeCssValue(valPart),
    ];
    if (semiIdx !== -1) {
      tokens.push({ type: 'punctuation', text: ';' });
    }
    if (afterSemi) {
      tokens.push({ type: 'plain', text: afterSemi });
    }
    return tokens;
  }

  return [{ type: 'plain', text: line }];
}

function tokenizeCssValue(val) {
  // Highlight hex colors and numeric+unit values
  const regex = /(#[0-9a-fA-F]{3,8}|-?\d+(?:\.\d+)?(?:px|em|rem|%|deg|ms|s|fr|ch)?)/g;
  const tokens = [];
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(val)) !== null) {
    if (match.index > lastIdx) {
      tokens.push({ type: 'value', text: val.slice(lastIdx, match.index) });
    }
    const tokenText = match[0];
    if (tokenText.startsWith('#')) {
      tokens.push({ type: 'color', text: tokenText });
    } else {
      tokens.push({ type: 'number', text: tokenText });
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < val.length) {
    tokens.push({ type: 'value', text: val.slice(lastIdx) });
  }

  return tokens.length > 0 ? tokens : [{ type: 'value', text: val }];
}
