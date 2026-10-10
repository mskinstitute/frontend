/**
 * Utilities for HTML, CSS, and JS web previews in Tutorial Reader and Playground.
 */

/**
 * Checks whether a language is eligible for live web preview in browser.
 */
export function isWebPreviewSupported(lang: string): boolean {
  if (!lang) return false;
  const l = lang.toLowerCase();
  return ['html', 'htm', 'markup', 'css', 'javascript', 'js'].includes(l);
}

/**
 * Generates an intelligent HTML skeleton matching the CSS selectors in the snippet,
 * ensuring students immediately see styled elements instead of a blank preview.
 */
export function generateHtmlFromCss(cssCode: string): string {
  if (!cssCode || !cssCode.trim()) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Live Preview</title>
  <link rel="stylesheet" href="style.css">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; padding: 20px;">
  <div style="padding: 24px; border: 1px dashed #cbd5e1; border-radius: 12px; text-align: center;">
    <h1 style="margin: 0 0 8px; color: #1e293b;">Live CSS Demo</h1>
    <p style="margin: 0; color: #64748b;">Add your CSS rules in style.css to see them live in this preview.</p>
  </div>
</body>
</html>`;
  }

  // Strip comments
  const cleanCss = cssCode.replace(/\/\*[\s\S]*?\*\//g, '').trim();

  // Find class selectors: .my-class
  const classMatches = Array.from(cleanCss.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
  const uniqueClasses = Array.from(new Set(classMatches)).filter(
    (c) =>
      ![
        'hover',
        'active',
        'focus',
        'visited',
        'disabled',
        'root',
        'first-child',
        'last-child',
        'before',
        'after',
      ].includes(c.toLowerCase())
  );

  // Find ID selectors: #my-id
  const idMatches = Array.from(cleanCss.matchAll(/#([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
  const uniqueIds = Array.from(new Set(idMatches));

  // Find tag selectors
  const tagMatches = Array.from(
    cleanCss.matchAll(
      /\b(h[1-6]|p|button|a|header|footer|nav|ul|ol|li|section|article|input|blockquote|table)\b/g
    )
  ).map((m) => m[1].toLowerCase());
  const uniqueTags = Array.from(new Set(tagMatches));

  const elements: string[] = [];

  // 1. If ID selectors exist (e.g. #main-header, #nav)
  uniqueIds.forEach((id) => {
    if (id.includes('header') || id.includes('nav')) {
      elements.push(
        `  <header id="${id}">\n    <h1>MSK Institute</h1>\n    <p>Your Coding Gateway & Learning Platform</p>\n  </header>`
      );
    } else if (id.includes('footer')) {
      elements.push(
        `  <footer id="${id}">\n    <p>&copy; 2026 MSK Institute. All rights reserved.</p>\n  </footer>`
      );
    } else {
      elements.push(
        `  <div id="${id}">\n    <h2>Section #${id}</h2>\n    <p>Styled container targeting ID <code>#${id}</code></p>\n  </div>`
      );
    }
  });

  // 2. If button classes or elements exist
  const btnClasses = uniqueClasses.filter((c) => c.includes('btn') || c.includes('button'));
  if (btnClasses.length > 0) {
    elements.push('  <div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0;">');
    btnClasses.forEach((btnCls) => {
      elements.push(`    <button class="${btnCls}">Button .${btnCls}</button>`);
    });
    elements.push('  </div>');
  }

  // 3. If text-center or text alignment classes exist
  const centerClasses = uniqueClasses.filter(
    (c) => c.includes('center') || c.includes('align') || c.includes('title')
  );
  if (centerClasses.length > 0) {
    centerClasses.forEach((cls) => {
      elements.push(
        `  <div class="${cls}">\n    <h1>Annual Sports Meet</h1>\n    <p>Friday, 10th October at the Main Stadium</p>\n    <button class="${cls}">Download Schedule</button>\n  </div>`
      );
    });
  }

  // 4. If card, box, container classes exist
  const cardClasses = uniqueClasses.filter(
    (c) =>
      c.includes('card') ||
      c.includes('box') ||
      c.includes('container') ||
      c.includes('profile') ||
      c.includes('banner')
  );
  if (cardClasses.length > 0) {
    cardClasses.forEach((cls) => {
      elements.push(
        `  <div class="${cls}">\n    <h2>Card Heading</h2>\n    <p>This box showcases your custom border, padding, shadows, and layout styles.</p>\n    <button class="btn">Explore More</button>\n  </div>`
      );
    });
  }

  // 5. Remaining standalone classes
  const remainingClasses = uniqueClasses.filter(
    (c) => !btnClasses.includes(c) && !centerClasses.includes(c) && !cardClasses.includes(c)
  );
  if (remainingClasses.length > 0) {
    remainingClasses.slice(0, 4).forEach((cls) => {
      elements.push(`  <p class="${cls}">Text with class <code>.${cls}</code> applied.</p>`);
    });
  }

  // 6. If HTML tag selectors were styled (like h1, p, button) and no elements yet
  if (elements.length === 0) {
    if (uniqueTags.includes('h1')) elements.push('  <h1>Annual Sports Meet 2026</h1>');
    if (uniqueTags.includes('h2')) elements.push('  <h2>Chapter 1: Modern CSS Styling</h2>');
    if (uniqueTags.includes('p'))
      elements.push(
        '  <p>Learn web development with hands-on practice, structured tutorials, and instant feedback.</p>'
      );
    if (uniqueTags.includes('button')) elements.push('  <button>Click Here to Register</button>');
    if (uniqueTags.includes('a')) elements.push('  <a href="#">Explore All Courses &rarr;</a>');
    if (uniqueTags.includes('ul') || uniqueTags.includes('li')) {
      elements.push(
        '  <ul>\n    <li>HTML5 Structure</li>\n    <li>CSS3 Modern Layouts</li>\n    <li>JavaScript Interactivity</li>\n  </ul>'
      );
    }
  }

  // Fallback if completely empty
  if (elements.length === 0) {
    elements.push(
      '  <div class="demo-box">\n    <h1>Live CSS Demo</h1>\n    <p>Live preview for your custom styles and rules.</p>\n    <button>Sample Action</button>\n  </div>'
    );
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Live Preview</title>
  <link rel="stylesheet" href="style.css">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      height: auto !important;
      min-height: 0 !important;
    }
  </style>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; line-height: 1.5; margin: 0;">
  <div id="msk-preview-root" style="display: flow-root;">
${elements.join('\n\n')}
  </div>
</body>
</html>`;
}

/**
 * Builds a composite HTML document for iframe rendering with primary code + companion files + console bridge.
 */
export function buildCompositeWebSrcDoc(
  primaryLang: string,
  primaryCode: string,
  companionLang?: string,
  companionCode?: string
): string {
  let html = '';
  let css = '';
  let js = '';

  const cleanLang = (primaryLang || 'html').toLowerCase();

  if (cleanLang === 'html' || cleanLang === 'htm' || cleanLang === 'markup') {
    html = primaryCode;
    if (companionLang === 'css' && companionCode) {
      css = companionCode;
    } else if ((companionLang === 'javascript' || companionLang === 'js') && companionCode) {
      js = companionCode;
    }
  } else if (cleanLang === 'css') {
    css = primaryCode;
    if (companionLang === 'html' && companionCode) {
      html = companionCode;
    } else {
      html = generateHtmlFromCss(css);
    }
  } else if (cleanLang === 'javascript' || cleanLang === 'js') {
    js = primaryCode;
    if (companionLang === 'html' && companionCode) {
      html = companionCode;
    } else {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 16px;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
    }
    #app, #output {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      margin-top: 10px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h3 style="margin: 0 0 8px; font-size: 15px; color: #334155;">JavaScript Runtime</h3>
  <div id="output">Output or DOM elements will render here...</div>
</body>
</html>`;
    }
  } else {
    html = `<!DOCTYPE html><html><body><pre>${primaryCode}</pre></body></html>`;
  }

  // Ensure standard document container if raw fragment
  if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      height: auto !important;
      min-height: 0 !important;
    }
    #msk-preview-root {
      display: flow-root;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 16px;
      margin: 0;
      color: #0f172a;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div id="msk-preview-root">
${html}
  </div>
</body>
</html>`;
  }

  // Console bridge script to forward logs to parent window
  const consoleScript = `
<script>
  (function() {
    function send(level, args) {
      try {
        const text = args.map(function(a) {
          if (a === null) return 'null';
          if (a === undefined) return 'undefined';
          if (typeof a === 'object') {
            try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
          }
          return String(a);
        }).join(' ');
        window.parent.postMessage({ type: 'MSK_INLINE_CONSOLE', level: level, text: text }, '*');
      } catch(e) {}
    }
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origInfo = console.info;

    console.log = function() { send('log', Array.prototype.slice.call(arguments)); origLog.apply(console, arguments); };
    console.warn = function() { send('warn', Array.prototype.slice.call(arguments)); origWarn.apply(console, arguments); };
    console.error = function() { send('error', Array.prototype.slice.call(arguments)); origError.apply(console, arguments); };
    console.info = function() { send('info', Array.prototype.slice.call(arguments)); origInfo.apply(console, arguments); };

    window.onerror = function(msg, url, line) {
      send('error', ['[Uncaught] ' + msg + (line ? ' (Line ' + line + ')' : '')]);
    };

    // Auto-calculate and report exact content height (isolated to container, never viewport)
    var lastSentHeight = 0;
    function reportContentHeight() {
      try {
        var root = document.getElementById('msk-preview-root');
        var h = 0;
        if (root) {
          h = Math.ceil(root.getBoundingClientRect().height);
        } else if (document.body) {
          var children = document.body.children;
          var maxBottom = 0;
          for (var i = 0; i < children.length; i++) {
            if (children[i].tagName !== 'SCRIPT' && children[i].tagName !== 'STYLE') {
              var rect = children[i].getBoundingClientRect();
              if (rect.bottom > maxBottom) {
                maxBottom = rect.bottom;
              }
            }
          }
          h = maxBottom > 0 ? Math.ceil(maxBottom + 16) : Math.ceil(document.body.scrollHeight || 50);
        }

        if (h > 0 && Math.abs(h - lastSentHeight) >= 2) {
          lastSentHeight = h;
          window.parent.postMessage({ type: 'MSK_PREVIEW_RESIZE', height: h }, '*');
        }
      } catch(e) {}
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      reportContentHeight();
    } else {
      window.addEventListener('DOMContentLoaded', reportContentHeight);
    }
    window.addEventListener('load', reportContentHeight);

    var targetEl = document.getElementById('msk-preview-root') || document.body;
    if (typeof ResizeObserver !== 'undefined' && targetEl) {
      try {
        var ro = new ResizeObserver(function() {
          reportContentHeight();
        });
        ro.observe(targetEl);
      } catch(e) {}
    }
  })();
</script>
`;

  // Inject CSS
  if (css) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    } else {
      html = `<style>\n${css}\n</style>\n` + html;
    }
  }

  // Inject JavaScript
  if (js) {
    const wrappedJs = `<script>\ntry {\n${js}\n} catch (err) {\n  console.error(err && err.message ? err.message : String(err));\n}\n</script>`;
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${wrappedJs}\n</body>`);
    } else {
      html = html + `\n${wrappedJs}`;
    }
  }

  // Inject console & resize bridge right before </body> so elements are fully parsed
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${consoleScript}\n</body>`);
  } else {
    html = html + consoleScript;
  }

  return html;
}
