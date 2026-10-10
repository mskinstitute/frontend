export const TUTORIAL_SLUGS = new Set([
  'html5-complete-course',
  'css-for-beginners',
  'css-for-intermediate',
  'css-for-advanced',
  'python-for-beginners',
  'python-for-intermediate',
  'python-for-advanced',
  'sql-for-beginners',
  'sql-for-intermediate',
  'sql-for-advanced',
  'ms-word-for-beginners',
  'ms-word-for-advanced',
  'ms-powerpoint-for-beginners',
  'ms-excel-for-beginners',
  'ms-excel-for-intermediate',
  'ms-excel-for-advanced',
  'numpy-complete-course',
  'ccc',
  'markdown',
  'pandas-complete-course',
  'data-analysis--visualization--statistics',
  'power-bi-for-beginners',
  'power-bi-for-intermediate',
  'power-bi-for-advanced',
  'tableau-for-beginners',
  'data-analysis--advanced-pandas--ml-basics',
  'tailwind-css-mastery',
  'nodejs-and-express-backend',
  'mongodb-and-mongoose-database',
  'nextjs-complete-course',
  'dsa-mastery-course',
  'git--github-basics',
  'javascript-for-beginners',
  'javascript-for-intermediate',
  'javascript-for-advanced',
  'react-js-for-beginners',
  'react-js-for-intermediate',
  'react-js-for-advanced',
  'django-for-backend-development',
  'rest-api-development-with-django',
  'flask-complete-course',
]);

export function isTutorialCourse(courseSlug?: string): boolean {
  if (!courseSlug) return false;
  return TUTORIAL_SLUGS.has(courseSlug.toLowerCase().trim());
}

export function resolveTopicTutorialUrl(
  courseSlug: string | undefined,
  chapterTitle: string,
  topicTitle: string,
  existingNotes?: { title: string; url: string }[],
  topicSlugParam?: string
): string | null {
  // Check if existing notes point to an internal tutorial route
  if (existingNotes) {
    const internal = existingNotes.find((n) => n.url.startsWith('/tutorials/'));
    if (internal) return internal.url;
  }

  const cSlug = (courseSlug || '').toLowerCase().trim();
  const chTitle = (chapterTitle || '').toLowerCase();

  let tutorialSlug: string | null = null;

  if (cSlug === 'html5-complete-course' || cSlug.includes('html5-complete') || (cSlug.includes('html') && !chTitle.includes('css') && !chTitle.includes('tailwind'))) {
    tutorialSlug = 'html5-complete-course';
  } else if (cSlug === 'python-for-advanced' || cSlug.includes('python-for-advanced')) {
    tutorialSlug = 'python-for-advanced';
  } else if (cSlug === 'python-for-intermediate' || cSlug.includes('python-for-intermediate')) {
    tutorialSlug = 'python-for-intermediate';
  } else if (cSlug === 'python-for-beginners' || cSlug.includes('python-for-beginners') || (cSlug.includes('python') && !cSlug.includes('full-stack'))) {
    tutorialSlug = 'python-for-beginners';
  } else if (cSlug === 'sql-for-advanced' || cSlug.includes('sql-for-advanced')) {
    tutorialSlug = 'sql-for-advanced';
  } else if (cSlug === 'sql-for-intermediate' || cSlug.includes('sql-for-intermediate')) {
    tutorialSlug = 'sql-for-intermediate';
  } else if (cSlug === 'sql-for-beginners' || cSlug.includes('sql-for-beginners') || cSlug.includes('sql')) {
    tutorialSlug = 'sql-for-beginners';
  } else if (cSlug === 'css-for-advanced' || cSlug.includes('css-for-advanced')) {
    tutorialSlug = 'css-for-advanced';
  } else if (cSlug === 'css-for-intermediate' || cSlug.includes('css-for-intermediate')) {
    tutorialSlug = 'css-for-intermediate';
  } else if (cSlug === 'css-for-beginners' || cSlug.includes('css-for-beginners') || cSlug.includes('css') || chTitle.includes('css') || chTitle.includes('tailwind')) {
    tutorialSlug = 'css-for-beginners';
  } else if (cSlug === 'ms-word-for-advanced' || cSlug.includes('word-for-advanced')) {
    tutorialSlug = 'ms-word-for-advanced';
  } else if (cSlug === 'ms-word-for-beginners' || cSlug.includes('word-for-beginners') || (cSlug.includes('word') && !cSlug.includes('complete'))) {
    tutorialSlug = 'ms-word-for-beginners';
  } else if (cSlug.includes('word') && cSlug.includes('complete')) {
    if (chTitle.includes('advanced') || chTitle.includes('merge') || chTitle.includes('macro') || chTitle.includes('template') || chTitle.includes('collaboration')) {
      tutorialSlug = 'ms-word-for-advanced';
    } else {
      tutorialSlug = 'ms-word-for-beginners';
    }
  } else if (cSlug === 'ms-powerpoint-for-beginners' || cSlug.includes('powerpoint') || cSlug.includes('ppt')) {
    tutorialSlug = 'ms-powerpoint-for-beginners';
  } else if (cSlug.includes('office')) {
    if (chTitle.includes('word')) {
      if (chTitle.includes('advanced') || chTitle.includes('merge') || chTitle.includes('macro')) {
        tutorialSlug = 'ms-word-for-advanced';
      } else {
        tutorialSlug = 'ms-word-for-beginners';
      }
    } else if (chTitle.includes('powerpoint') || chTitle.includes('ppt') || chTitle.includes('presentation')) {
      tutorialSlug = 'ms-powerpoint-for-beginners';
    } else if (chTitle.includes('excel') || chTitle.includes('spreadsheet')) {
      tutorialSlug = 'ms-excel-for-beginners';
    }
  } else if (cSlug === 'ms-excel-for-advanced' || cSlug.includes('excel-for-advanced')) {
    tutorialSlug = 'ms-excel-for-advanced';
  } else if (cSlug === 'ms-excel-for-intermediate' || cSlug.includes('excel-for-intermediate')) {
    tutorialSlug = 'ms-excel-for-intermediate';
  } else if (cSlug === 'ms-excel-for-beginners' || cSlug.includes('excel-for-beginners') || (cSlug.includes('excel') && !cSlug.includes('advanced') && !cSlug.includes('intermediate') && !cSlug.includes('6-months'))) {
    tutorialSlug = 'ms-excel-for-beginners';
  } else if (cSlug.includes('excel') && cSlug.includes('6-months')) {
    if (chTitle.includes('advanced') || chTitle.includes('macro') || chTitle.includes('vba') || chTitle.includes('power query') || chTitle.includes('power pivot') || chTitle.includes('dashboard') || chTitle.includes('what-if') || chTitle.includes('xlookup')) {
      tutorialSlug = 'ms-excel-for-advanced';
    } else if (chTitle.includes('intermediate') || chTitle.includes('pivot') || chTitle.includes('lookup') || chTitle.includes('conditional') || chTitle.includes('validation') || chTitle.includes('large data') || chTitle.includes('attendance')) {
      tutorialSlug = 'ms-excel-for-intermediate';
    } else {
      tutorialSlug = 'ms-excel-for-beginners';
    }
  } else if (cSlug === 'numpy-complete-course' || cSlug.includes('numpy')) {
    tutorialSlug = 'numpy-complete-course';
  } else if (cSlug.includes('data-analysis') && (chTitle.includes('numpy') || chTitle.includes('numerical'))) {
    tutorialSlug = 'numpy-complete-course';
  } else if (cSlug === 'ccc' || cSlug.includes('ccc')) {
    tutorialSlug = 'ccc';
  } else if (cSlug === 'markdown' || cSlug.includes('markdown')) {
    tutorialSlug = 'markdown';
  } else if (cSlug === 'data-analysis--advanced-pandas--ml-basics' || cSlug.includes('advanced-pandas')) {
    tutorialSlug = 'data-analysis--advanced-pandas--ml-basics';
  } else if (cSlug === 'pandas-complete-course' || (cSlug.includes('pandas') && !cSlug.includes('advanced-pandas'))) {
    tutorialSlug = 'pandas-complete-course';
  } else if (cSlug === 'data-analysis--visualization--statistics' || (cSlug.includes('visualization') && cSlug.includes('statistics'))) {
    tutorialSlug = 'data-analysis--visualization--statistics';
  } else if (cSlug === 'power-bi-for-advanced' || cSlug.includes('power-bi-for-advanced') || cSlug.includes('powerbi-advanced')) {
    tutorialSlug = 'power-bi-for-advanced';
  } else if (cSlug === 'power-bi-for-intermediate' || cSlug.includes('power-bi-for-intermediate') || cSlug.includes('powerbi-intermediate')) {
    tutorialSlug = 'power-bi-for-intermediate';
  } else if (cSlug === 'power-bi-for-beginners' || cSlug.includes('power-bi') || cSlug.includes('powerbi')) {
    tutorialSlug = 'power-bi-for-beginners';
  } else if (cSlug === 'tableau-for-beginners' || cSlug.includes('tableau')) {
    tutorialSlug = 'tableau-for-beginners';
  } else if (cSlug === 'tailwind-css-mastery' || cSlug.includes('tailwind')) {
    tutorialSlug = 'tailwind-css-mastery';
  } else if (cSlug === 'nodejs-and-express-backend' || cSlug.includes('nodejs') || cSlug.includes('node-js') || cSlug.includes('express')) {
    tutorialSlug = 'nodejs-and-express-backend';
  } else if (cSlug === 'mongodb-and-mongoose-database' || cSlug.includes('mongodb') || cSlug.includes('mongoose')) {
    tutorialSlug = 'mongodb-and-mongoose-database';
  } else if (cSlug === 'nextjs-complete-course' || cSlug.includes('nextjs') || cSlug.includes('next-js')) {
    tutorialSlug = 'nextjs-complete-course';
  } else if (cSlug === 'dsa-mastery-course' || cSlug.includes('dsa') || cSlug.includes('data-structure') || cSlug.includes('algorithm')) {
    tutorialSlug = 'dsa-mastery-course';
  } else if (cSlug === 'git--github-basics' || cSlug.includes('git--github') || cSlug.includes('git-github') || (cSlug.includes('git') && !cSlug.includes('digital'))) {
    tutorialSlug = 'git--github-basics';
  } else if (cSlug === 'javascript-for-advanced' || cSlug.includes('javascript-for-advanced') || cSlug.includes('javascript-advanced')) {
    tutorialSlug = 'javascript-for-advanced';
  } else if (cSlug === 'javascript-for-intermediate' || cSlug.includes('javascript-for-intermediate') || cSlug.includes('javascript-intermediate')) {
    tutorialSlug = 'javascript-for-intermediate';
  } else if (cSlug === 'javascript-for-beginners' || (cSlug.includes('javascript') && !cSlug.includes('intermediate') && !cSlug.includes('advanced')) || (cSlug.includes('js-for-beginners'))) {
    tutorialSlug = 'javascript-for-beginners';
  } else if (cSlug === 'react-js-for-advanced' || cSlug.includes('react-js-for-advanced') || cSlug.includes('react-advanced')) {
    tutorialSlug = 'react-js-for-advanced';
  } else if (cSlug === 'react-js-for-intermediate' || cSlug.includes('react-js-for-intermediate') || cSlug.includes('react-intermediate')) {
    tutorialSlug = 'react-js-for-intermediate';
  } else if (cSlug === 'react-js-for-beginners' || (cSlug.includes('react') && !cSlug.includes('intermediate') && !cSlug.includes('advanced'))) {
    tutorialSlug = 'react-js-for-beginners';
  } else if (cSlug === 'rest-api-development-with-django' || cSlug.includes('rest-api') || cSlug.includes('drf')) {
    tutorialSlug = 'rest-api-development-with-django';
  } else if (cSlug === 'django-for-backend-development' || cSlug.includes('django')) {
    tutorialSlug = 'django-for-backend-development';
  } else if (cSlug.includes('data-analysis') && (chTitle.includes('pandas') || chTitle.includes('wrangling') || chTitle.includes('cleaning')) && !cSlug.includes('advanced-pandas')) {
    tutorialSlug = 'pandas-complete-course';
  } else if (cSlug.includes('full-stack') || cSlug.includes('bootcamp')) {
    if (chTitle.includes('html')) tutorialSlug = 'html5-complete-course';
    else if (chTitle.includes('css') || chTitle.includes('tailwind')) tutorialSlug = 'css-for-beginners';
    else if (chTitle.includes('python')) tutorialSlug = 'python-for-beginners';
    else if (chTitle.includes('sql') || chTitle.includes('database')) tutorialSlug = 'sql-for-beginners';
    else if (chTitle.includes('react')) tutorialSlug = 'react-js-for-beginners';
    else if (chTitle.includes('django') || chTitle.includes('drf')) tutorialSlug = 'django-for-backend-development';
    else if (chTitle.includes('javascript') || chTitle.includes('js')) tutorialSlug = 'javascript-for-beginners';
  }

  if (!tutorialSlug) return null;

  // If topic slug is explicitly provided, prioritize it
  if (topicSlugParam && topicSlugParam.trim()) {
    const cleanSlug = topicSlugParam.trim().replace(/\.md$/, '');
    return `/tutorials/${tutorialSlug}/${cleanSlug}`;
  }

  const rawSlug = topicTitle
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  let topicSlug = rawSlug;
  if (tutorialSlug === 'python-for-beginners') {
    if (rawSlug === 'introduction' || rawSlug === 'introduction-to-python' || rawSlug === 'python-introduction') topicSlug = 'python-introduction';
    else if (rawSlug === 'vscode-setup' || rawSlug === 'vs-code-setup') topicSlug = 'vs-code-setup';
  } else if (tutorialSlug === 'html5-complete-course') {
    if (rawSlug === 'introduction' || rawSlug.includes('introduction-to-html') || rawSlug.includes('introduction')) {
      topicSlug = 'introduction-to-html';
    } else if (rawSlug === 'basic-document-structure' || rawSlug === 'basic-document-structure-boilerplate') {
      topicSlug = 'basic-document-structure';
    } else if (rawSlug === 'vscode-setup' || rawSlug === 'vs-code-setup') {
      topicSlug = 'vs-code-setup';
    } else if (rawSlug === 'elements' || rawSlug === 'html-elements') {
      topicSlug = 'elements';
    } else if (rawSlug === 'attributes' || rawSlug === 'html-attributes') {
      topicSlug = 'attributes';
    } else if (rawSlug === 'html-headings' || rawSlug === 'headings') {
      topicSlug = 'html-headings';
    } else if (rawSlug === 'paragraphs-line-breaks' || rawSlug === 'paragraphs') {
      topicSlug = 'paragraphs-line-breaks';
    } else if (rawSlug === 'text-formatting-elements' || rawSlug === 'text-elements-formatting' || rawSlug.includes('formatting')) {
      topicSlug = 'text-formatting-elements';
    } else if (rawSlug === 'quotations-citations' || rawSlug === 'quotations' || rawSlug.includes('quotation')) {
      topicSlug = 'quotations-citations';
    } else if (rawSlug === 'html-entities-symbols' || rawSlug.includes('entity') || rawSlug.includes('symbol') || rawSlug.includes('emoji')) {
      topicSlug = 'html-entities-symbols';
    } else if (rawSlug === 'html-comments' || rawSlug === 'comments' || rawSlug.includes('comment')) {
      topicSlug = 'html-comments';
    } else if (rawSlug === 'html-colors-rgb' || rawSlug === 'colors' || rawSlug === 'html-colors' || rawSlug === 'html-colors-color-codes') {
      topicSlug = 'html-colors-rgb';
    } else if (rawSlug === 'hex-hsl-color-codes' || rawSlug.includes('hex') || rawSlug.includes('hsl')) {
      topicSlug = 'hex-hsl-color-codes';
    } else if (rawSlug === 'links-hyperlinks' || rawSlug === 'links' || rawSlug === 'hyperlinks' || rawSlug === 'links-navigation-lists') {
      topicSlug = 'links-hyperlinks';
    } else if (rawSlug === 'target-attributes-security' || rawSlug.includes('target') || rawSlug.includes('security')) {
      topicSlug = 'target-attributes-security';
    } else if (rawSlug === 'unordered-ordered-lists' || rawSlug === 'lists' || rawSlug.includes('unordered') || rawSlug.includes('ordered')) {
      topicSlug = 'unordered-ordered-lists';
    } else if (rawSlug === 'description-lists' || rawSlug.includes('description')) {
      topicSlug = 'description-lists';
    } else if (rawSlug === 'html-tables' || rawSlug === 'tables' || rawSlug === 'table' || rawSlug === 'tables-structured-data') {
      topicSlug = 'html-tables';
    } else if (rawSlug === 'colspan-rowspan' || rawSlug.includes('colspan') || rawSlug.includes('rowspan')) {
      topicSlug = 'colspan-rowspan';
    } else if (rawSlug === 'block-vs-inline-elements' || rawSlug === 'block-and-inline' || rawSlug.includes('block') || rawSlug.includes('inline')) {
      topicSlug = 'block-vs-inline-elements';
    } else if (rawSlug === 'div-span-containers' || rawSlug.includes('div') || rawSlug.includes('span')) {
      topicSlug = 'div-span-containers';
    } else if (rawSlug === 'images-responsive-art' || rawSlug === 'images-multimedia-embeds' || rawSlug.includes('image')) {
      topicSlug = 'images-responsive-art';
    } else if (rawSlug === 'audio-video' || rawSlug.includes('audio') || rawSlug.includes('video') || rawSlug.includes('media')) {
      topicSlug = 'audio-video';
    } else if (rawSlug === 'iframes-web-embeds' || rawSlug.includes('iframe') || rawSlug.includes('embed')) {
      topicSlug = 'iframes-web-embeds';
    } else if (rawSlug === 'html5-svg-canvas' || rawSlug.includes('svg') || rawSlug.includes('canvas')) {
      topicSlug = 'html5-svg-canvas';
    } else if (rawSlug === 'forms-input-types' || rawSlug === 'forms' || rawSlug === 'form' || rawSlug === 'forms-inputs-validations') {
      topicSlug = 'forms-input-types';
    } else if (rawSlug === 'form-controls-validations' || rawSlug.includes('validation') || rawSlug.includes('control')) {
      topicSlug = 'form-controls-validations';
    } else if (rawSlug === 'semantic-layout-elements' || rawSlug === 'html5-semantic-architecture' || rawSlug.includes('semantic') || rawSlug.includes('layout')) {
      topicSlug = 'semantic-layout-elements';
    } else if (rawSlug === 'accessibility-aria' || rawSlug === 'accessibility-aria-seo' || rawSlug.includes('accessibility') || rawSlug.includes('aria')) {
      topicSlug = 'accessibility-aria';
    } else if (rawSlug === 'interactive-elements-dialog' || rawSlug.includes('dialog') || rawSlug.includes('interactive') || rawSlug.includes('detail')) {
      topicSlug = 'interactive-elements-dialog';
    } else if (rawSlug === 'html5-apis-storage-best-practices' || rawSlug.includes('api') || rawSlug.includes('storage')) {
      topicSlug = 'html5-apis-storage-best-practices';
    }
  } else if (tutorialSlug === 'css-for-beginners') {
    if (rawSlug === 'what-is-css-and-why-it-matters' || rawSlug === 'what-is-css' || rawSlug.includes('what-is-css')) {
      topicSlug = 'what-is-css-and-why-it-matters';
    } else if (rawSlug === 'how-css-works-with-html' || rawSlug === 'how-css-works' || rawSlug.includes('how-css-works')) {
      topicSlug = 'how-css-works-with-html';
    } else if (rawSlug === 'inline-internal-external-css' || rawSlug.includes('inline') || rawSlug.includes('internal') || rawSlug.includes('external')) {
      topicSlug = 'inline-internal-external-css';
    } else if (rawSlug === 'css-syntax-comments-and-structure' || rawSlug.includes('syntax') || rawSlug.includes('comment')) {
      topicSlug = 'css-syntax-comments-and-structure';
    } else if (rawSlug === 'universal-and-element-selectors' || rawSlug.includes('universal') || rawSlug.includes('element')) {
      topicSlug = 'universal-and-element-selectors';
    } else if (rawSlug === 'class-and-id-selectors' || (rawSlug.includes('class') && rawSlug.includes('id')) || rawSlug === 'basic-selectors-element-class-id') {
      topicSlug = 'class-and-id-selectors';
    } else if (rawSlug === 'grouping-and-combinator-selectors' || rawSlug.includes('grouping') || rawSlug.includes('combin')) {
      topicSlug = 'grouping-and-combinator-selectors';
    } else if (rawSlug === 'color-formats-names-hex-rgb-hsl' || rawSlug.includes('color-format') || rawSlug.includes('hex') || rawSlug.includes('rgb') || rawSlug.includes('hsl')) {
      topicSlug = 'color-formats-names-hex-rgb-hsl';
    } else if (rawSlug === 'background-color-image-position-size' || rawSlug.includes('background') || rawSlug.includes('position') || (rawSlug.includes('image') && rawSlug.includes('background'))) {
      topicSlug = 'background-color-image-position-size';
    } else if (rawSlug === 'css-gradients-linear-radial' || rawSlug.includes('gradient')) {
      topicSlug = 'css-gradients-linear-radial';
    } else if (rawSlug === 'css-box-model-content-padding-border-margin' || rawSlug.includes('box-model') || (rawSlug.includes('content') && rawSlug.includes('padding')) || (rawSlug.includes('margin') && rawSlug.includes('border'))) {
      topicSlug = 'css-box-model-content-padding-border-margin';
    } else if (rawSlug === 'width-height-max-min-dimensions' || rawSlug.includes('width') || rawSlug.includes('height') || rawSlug.includes('dimension')) {
      topicSlug = 'width-height-max-min-dimensions';
    } else if (rawSlug === 'box-sizing-border-box-vs-content-box' || rawSlug.includes('box-sizing') || rawSlug.includes('border-box') || rawSlug.includes('content-box')) {
      topicSlug = 'box-sizing-border-box-vs-content-box';
    } else if (rawSlug === 'font-families-web-safe-fonts' || rawSlug.includes('font-famil') || rawSlug.includes('web-safe')) {
      topicSlug = 'font-families-web-safe-fonts';
    } else if (rawSlug === 'font-size-weight-style-line-height' || rawSlug.includes('font-size') || rawSlug.includes('weight') || rawSlug.includes('line-height')) {
      topicSlug = 'font-size-weight-style-line-height';
    } else if (rawSlug === 'text-align-decoration-transform-spacing' || rawSlug.includes('text-align') || rawSlug.includes('transform') || rawSlug.includes('decoration')) {
      topicSlug = 'text-align-decoration-transform-spacing';
    } else if (rawSlug === 'css-units-absolute-px-pt' || rawSlug.includes('absolute') || rawSlug.includes('px-pt')) {
      topicSlug = 'css-units-absolute-px-pt';
    } else if (rawSlug === 'css-units-relative-percentages-rem-em-vh-vw' || rawSlug.includes('relative') || rawSlug.includes('vh-vw') || (rawSlug.includes('rem') && rawSlug.includes('em'))) {
      topicSlug = 'css-units-relative-percentages-rem-em-vh-vw';
    } else if (rawSlug === 'responsive-units-and-calc-function' || rawSlug.includes('calc') || rawSlug.includes('best-practice') || (rawSlug.includes('responsive') && rawSlug.includes('unit'))) {
      topicSlug = 'responsive-units-and-calc-function';
    } else if (rawSlug === 'border-styles-colors-shorthand' || (rawSlug.includes('border') && (rawSlug.includes('style') || rawSlug.includes('shorthand')))) {
      topicSlug = 'border-styles-colors-shorthand';
    } else if (rawSlug === 'border-radius-rounded-corners-circles' || rawSlug.includes('border-radius') || rawSlug.includes('rounded') || rawSlug.includes('circle')) {
      topicSlug = 'border-radius-rounded-corners-circles';
    } else if (rawSlug === 'box-shadows-and-text-shadows' || rawSlug.includes('shadow')) {
      topicSlug = 'box-shadows-and-text-shadows';
    } else if (rawSlug === 'styling-links-pseudo-classes' || (rawSlug.includes('link') && (rawSlug.includes('pseudo') || rawSlug.includes('style')))) {
      topicSlug = 'styling-links-pseudo-classes';
    } else if (rawSlug === 'styling-ordered-unordered-lists' || rawSlug.includes('list') || rawSlug.includes('ordered') || rawSlug.includes('unordered')) {
      topicSlug = 'styling-ordered-unordered-lists';
    } else if (rawSlug === 'styling-tables-borders-striping' || rawSlug.includes('table') || rawSlug.includes('striping')) {
      topicSlug = 'styling-tables-borders-striping';
    } else if (rawSlug === 'display-block-inline-inline-block' || (rawSlug.includes('block') && rawSlug.includes('inline'))) {
      topicSlug = 'display-block-inline-inline-block';
    } else if (rawSlug === 'display-none-vs-visibility-hidden' || (rawSlug.includes('visibility') || (rawSlug.includes('display') && rawSlug.includes('none')))) {
      topicSlug = 'display-none-vs-visibility-hidden';
    } else if (rawSlug === 'css-overflow-visible-hidden-scroll-auto' || rawSlug.includes('overflow')) {
      topicSlug = 'css-overflow-visible-hidden-scroll-auto';
    } else if (rawSlug === 'position-static-relative-absolute' || (rawSlug.includes('position') && (rawSlug.includes('static') || rawSlug.includes('relative') || rawSlug.includes('absolute')))) {
      topicSlug = 'position-static-relative-absolute';
    } else if (rawSlug === 'position-fixed-and-sticky' || rawSlug.includes('fixed') || rawSlug.includes('sticky')) {
      topicSlug = 'position-fixed-and-sticky';
    } else if (rawSlug === 'z-index-and-stacking-context' || rawSlug.includes('z-index') || rawSlug.includes('stacking')) {
      topicSlug = 'z-index-and-stacking-context';
    } else if (rawSlug === 'float-and-clear-basics' || rawSlug.includes('float') || rawSlug.includes('clear')) {
      topicSlug = 'float-and-clear-basics';
    } else if (rawSlug === 'aligning-elements-text-align-and-margin' || (rawSlug.includes('align') && (rawSlug.includes('margin') || rawSlug.includes('text-align')))) {
      topicSlug = 'aligning-elements-text-align-and-margin';
    } else if (rawSlug === 'intro-to-flexbox-basics' || rawSlug.includes('flex')) {
      topicSlug = 'intro-to-flexbox-basics';
    } else if (rawSlug === 'project-styled-profile-card' || rawSlug.includes('profile') || rawSlug.includes('id-card')) {
      topicSlug = 'project-styled-profile-card';
    } else if (rawSlug === 'project-simple-landing-page-layout' || rawSlug.includes('landing')) {
      topicSlug = 'project-simple-landing-page-layout';
    } else if (rawSlug === 'project-navigation-bar-styling' || (rawSlug.includes('navigation') && rawSlug.includes('bar')) || rawSlug.includes('navbar')) {
      topicSlug = 'project-navigation-bar-styling';
    }
  } else if (tutorialSlug === 'css-for-intermediate') {
    if (rawSlug === 'attribute-selectors-attr-patterns' || rawSlug.includes('attribute')) {
      topicSlug = 'attribute-selectors-attr-patterns';
    } else if (rawSlug === 'child-descendant-sibling-selectors' || rawSlug.includes('sibling') || rawSlug.includes('descendant') || rawSlug.includes('child')) {
      topicSlug = 'child-descendant-sibling-selectors';
    } else if (rawSlug === 'pseudo-classes-and-pseudo-elements' || (rawSlug.includes('pseudo') && (rawSlug.includes('class') || rawSlug.includes('element')))) {
      topicSlug = 'pseudo-classes-and-pseudo-elements';
    } else if (rawSlug === 'complex-combinators-and-chaining' || rawSlug.includes('combinator') || rawSlug.includes('chaining')) {
      topicSlug = 'complex-combinators-and-chaining';
    } else if (rawSlug === 'css-specificity-calculation-and-cascade' || rawSlug.includes('specificity') || rawSlug.includes('cascade')) {
      topicSlug = 'css-specificity-calculation-and-cascade';
    } else if (rawSlug === 'using-important-rule-best-practices' || rawSlug.includes('important')) {
      topicSlug = 'using-important-rule-best-practices';
    } else if (rawSlug === 'opacity-and-rgba-hsla-colors' || rawSlug.includes('opacity') || rawSlug.includes('rgba') || rawSlug.includes('hsla')) {
      topicSlug = 'opacity-and-rgba-hsla-colors';
    } else if (rawSlug === 'advanced-linear-radial-gradients' || (rawSlug.includes('gradient') && (rawSlug.includes('radial') || rawSlug.includes('advanced')))) {
      topicSlug = 'advanced-linear-radial-gradients';
    } else if (rawSlug === 'background-blend-modes-css' || rawSlug.includes('blend')) {
      topicSlug = 'background-blend-modes-css';
    } else if (rawSlug === 'flex-container-and-flex-items' || (rawSlug.includes('container') && rawSlug.includes('items'))) {
      topicSlug = 'flex-container-and-flex-items';
    } else if (rawSlug === 'justify-content-align-items-align-self' || rawSlug.includes('justify') || rawSlug.includes('align-items') || rawSlug.includes('align-self')) {
      topicSlug = 'justify-content-align-items-align-self';
    } else if (rawSlug === 'flex-grow-flex-shrink-flex-basis' || rawSlug.includes('grow') || rawSlug.includes('shrink') || rawSlug.includes('basis')) {
      topicSlug = 'flex-grow-flex-shrink-flex-basis';
    } else if (rawSlug === 'row-vs-column-direction-responsive-flipping' || (rawSlug.includes('row') && rawSlug.includes('column'))) {
      topicSlug = 'row-vs-column-direction-responsive-flipping';
    } else if (rawSlug === 'flex-wrapping-and-nested-flexbox' || rawSlug.includes('wrap') || rawSlug.includes('nested')) {
      topicSlug = 'flex-wrapping-and-nested-flexbox';
    } else if (rawSlug === 'building-responsive-navbar-with-flexbox' || rawSlug.includes('navbar')) {
      topicSlug = 'building-responsive-navbar-with-flexbox';
    } else if (rawSlug === 'grid-container-and-grid-items' || (rawSlug.includes('grid') && rawSlug.includes('container'))) {
      topicSlug = 'grid-container-and-grid-items';
    } else if (rawSlug === 'grid-template-columns-and-rows' || (rawSlug.includes('template') && (rawSlug.includes('columns') || rawSlug.includes('rows')))) {
      topicSlug = 'grid-template-columns-and-rows';
    } else if (rawSlug === 'grid-gap-fractional-units-fr-repeat' || rawSlug.includes('fractional') || rawSlug.includes('repeat') || rawSlug.includes('fr')) {
      topicSlug = 'grid-gap-fractional-units-fr-repeat';
    } else if (rawSlug === 'grid-template-areas-and-named-lines' || rawSlug.includes('areas') || rawSlug.includes('named-lines')) {
      topicSlug = 'grid-template-areas-and-named-lines';
    } else if (rawSlug === 'auto-fit-vs-auto-fill-minmax' || rawSlug.includes('auto-fit') || rawSlug.includes('auto-fill') || rawSlug.includes('minmax')) {
      topicSlug = 'auto-fit-vs-auto-fill-minmax';
    } else if (rawSlug === 'building-page-layouts-with-css-grid' || (rawSlug.includes('building') && rawSlug.includes('layout'))) {
      topicSlug = 'building-page-layouts-with-css-grid';
    } else if (rawSlug === 'min-width-max-width-media-queries' || (rawSlug.includes('min-width') || rawSlug.includes('max-width'))) {
      topicSlug = 'min-width-max-width-media-queries';
    } else if (rawSlug === 'mobile-first-vs-desktop-first' || (rawSlug.includes('mobile-first') || rawSlug.includes('desktop-first'))) {
      topicSlug = 'mobile-first-vs-desktop-first';
    } else if (rawSlug === 'responsive-breakpoints-best-practices' || rawSlug.includes('breakpoint')) {
      topicSlug = 'responsive-breakpoints-best-practices';
    } else if (rawSlug === 'css-transitions-timing-functions-delays' || rawSlug.includes('transition')) {
      topicSlug = 'css-transitions-timing-functions-delays';
    } else if (rawSlug === 'css-animations-keyframes-and-performance' || rawSlug.includes('keyframe') || rawSlug.includes('animation')) {
      topicSlug = 'css-animations-keyframes-and-performance';
    } else if (rawSlug === 'practical-interactive-button-and-card-effects' || (rawSlug.includes('button') && rawSlug.includes('effect')) || rawSlug.includes('micro-interaction')) {
      topicSlug = 'practical-interactive-button-and-card-effects';
    } else if (rawSlug === 'declaring-and-using-css-variables' || (rawSlug.includes('declaring') && rawSlug.includes('variables'))) {
      topicSlug = 'declaring-and-using-css-variables';
    } else if (rawSlug === 'the-root-pseudo-class-design-tokens' || rawSlug.includes('root') || rawSlug.includes('token')) {
      topicSlug = 'the-root-pseudo-class-design-tokens';
    } else if (rawSlug === 'theme-switching-light-dark-mode-css-variables' || rawSlug.includes('theme') || rawSlug.includes('dark-mode')) {
      topicSlug = 'theme-switching-light-dark-mode-css-variables';
    } else if (rawSlug === 'box-shadow-text-shadow-advanced-tricks' || (rawSlug.includes('shadow') && rawSlug.includes('trick'))) {
      topicSlug = 'box-shadow-text-shadow-advanced-tricks';
    } else if (rawSlug === 'css-filters-and-backdrop-filter' || rawSlug.includes('filter')) {
      topicSlug = 'css-filters-and-backdrop-filter';
    } else if (rawSlug === 'glassmorphism-and-modern-visual-effects' || rawSlug.includes('glass') || rawSlug.includes('neumorphism')) {
      topicSlug = 'glassmorphism-and-modern-visual-effects';
    } else if (rawSlug === 'project-1-responsive-landing-page-with-flexbox' || (rawSlug.includes('project') && rawSlug.includes('landing'))) {
      topicSlug = 'project-1-responsive-landing-page-with-flexbox';
    } else if (rawSlug === 'project-2-blog-layout-using-css-grid' || (rawSlug.includes('project') && rawSlug.includes('blog'))) {
      topicSlug = 'project-2-blog-layout-using-css-grid';
    } else if (rawSlug === 'project-3-animated-pricing-table' || (rawSlug.includes('project') && rawSlug.includes('pricing'))) {
      topicSlug = 'project-3-animated-pricing-table';
    }
  } else if (tutorialSlug === 'css-for-advanced') {
    if (rawSlug === 'calc-min-max-clamp-mathematical-functions' || rawSlug.includes('calc') || rawSlug.includes('clamp') || rawSlug.includes('min-max')) {
      topicSlug = 'calc-min-max-clamp-mathematical-functions';
    } else if (rawSlug === 'advanced-nth-child-and-nth-of-type-patterns' || rawSlug.includes('nth-child') || rawSlug.includes('nth-of-type')) {
      topicSlug = 'advanced-nth-child-and-nth-of-type-patterns';
    } else if (rawSlug === 'custom-properties-with-fallback-values' || (rawSlug.includes('custom-properties') || (rawSlug.includes('fallback') && rawSlug.includes('value')))) {
      topicSlug = 'custom-properties-with-fallback-values';
    } else if (rawSlug === '2d-transforms-translate-rotate-scale-skew' || (rawSlug.includes('2d') && rawSlug.includes('transform'))) {
      topicSlug = '2d-transforms-translate-rotate-scale-skew';
    } else if (rawSlug === '3d-transforms-perspective-rotatex-rotatey' || (rawSlug.includes('3d') && rawSlug.includes('transform')) || rawSlug.includes('perspective')) {
      topicSlug = '3d-transforms-perspective-rotatex-rotatey';
    } else if (rawSlug === 'combining-transforms-for-advanced-effects' || (rawSlug.includes('combining') && rawSlug.includes('transform'))) {
      topicSlug = 'combining-transforms-for-advanced-effects';
    } else if (rawSlug === 'keyframes-deep-dive-animation-choreography' || (rawSlug.includes('keyframes') && (rawSlug.includes('deep') || rawSlug.includes('choreography')))) {
      topicSlug = 'keyframes-deep-dive-animation-choreography';
    } else if (rawSlug === 'chaining-animations-and-delays' || (rawSlug.includes('chaining') && rawSlug.includes('animation'))) {
      topicSlug = 'chaining-animations-and-delays';
    } else if (rawSlug === 'css-animation-performance-optimization' || (rawSlug.includes('animation') && rawSlug.includes('performance'))) {
      topicSlug = 'css-animation-performance-optimization';
    } else if (rawSlug === 'css-shapes-clip-path-and-shape-outside' || rawSlug.includes('shape') || rawSlug.includes('clip-path')) {
      topicSlug = 'css-shapes-clip-path-and-shape-outside';
    } else if (rawSlug === 'css-multi-column-layouts' || rawSlug.includes('multi-column')) {
      topicSlug = 'css-multi-column-layouts';
    } else if (rawSlug === 'combining-grid-and-flexbox-advanced-layouts' || (rawSlug.includes('grid') && rawSlug.includes('flexbox'))) {
      topicSlug = 'combining-grid-and-flexbox-advanced-layouts';
    } else if (rawSlug === 'advanced-image-effects-with-css-filters' || (rawSlug.includes('image') && rawSlug.includes('filter'))) {
      topicSlug = 'advanced-image-effects-with-css-filters';
    } else if (rawSlug === 'mix-blend-mode-and-background-blend-mode-mastery' || rawSlug.includes('blend-mode')) {
      topicSlug = 'mix-blend-mode-and-background-blend-mode-mastery';
    } else if (rawSlug === 'creative-ui-effects-with-filters-and-gradients' || (rawSlug.includes('creative') && rawSlug.includes('effect'))) {
      topicSlug = 'creative-ui-effects-with-filters-and-gradients';
    } else if (rawSlug === 'dynamic-theming-with-css-variables' || (rawSlug.includes('dynamic') && rawSlug.includes('theming'))) {
      topicSlug = 'dynamic-theming-with-css-variables';
    } else if (rawSlug === 'advanced-dark-light-mode-system-tokens' || ((rawSlug.includes('dark') || rawSlug.includes('light')) && rawSlug.includes('mode'))) {
      topicSlug = 'advanced-dark-light-mode-system-tokens';
    } else if (rawSlug === 'scoped-variables-and-runtime-performance' || (rawSlug.includes('scoped') && rawSlug.includes('variable'))) {
      topicSlug = 'scoped-variables-and-runtime-performance';
    } else if (rawSlug === 'sass-scss-variables-nesting-and-partials' || (rawSlug.includes('sass') && rawSlug.includes('variable')) || rawSlug.includes('nesting')) {
      topicSlug = 'sass-scss-variables-nesting-and-partials';
    } else if (rawSlug === 'sass-mixins-functions-and-inheritance' || rawSlug.includes('mixin') || rawSlug.includes('inheritance')) {
      topicSlug = 'sass-mixins-functions-and-inheritance';
    } else if (rawSlug === 'compiling-and-organizing-scss-architecture' || (rawSlug.includes('compiling') || rawSlug.includes('organizing')) && rawSlug.includes('scss')) {
      topicSlug = 'compiling-and-organizing-scss-architecture';
    } else if (rawSlug === 'fluid-typography-and-responsive-units' || rawSlug.includes('fluid') || rawSlug.includes('typography')) {
      topicSlug = 'fluid-typography-and-responsive-units';
    } else if (rawSlug === 'css-container-queries-modern-modular-responsive' || rawSlug.includes('container-quer')) {
      topicSlug = 'css-container-queries-modern-modular-responsive';
    } else if (rawSlug === 'multi-device-testing-and-responsive-debugging' || rawSlug.includes('multi-device') || rawSlug.includes('debugging')) {
      topicSlug = 'multi-device-testing-and-responsive-debugging';
    } else if (rawSlug === 'bem-methodology-block-element-modifier' || rawSlug.includes('bem')) {
      topicSlug = 'bem-methodology-block-element-modifier';
    } else if (rawSlug === 'utility-first-vs-component-based-css' || (rawSlug.includes('utility') && rawSlug.includes('component'))) {
      topicSlug = 'utility-first-vs-component-based-css';
    } else if (rawSlug === 'writing-maintainable-and-scalable-css' || (rawSlug.includes('maintainable') || rawSlug.includes('scalable'))) {
      topicSlug = 'writing-maintainable-and-scalable-css';
    } else if (rawSlug === 'advanced-glassmorphism-and-neumorphism-patterns' || (rawSlug.includes('glassmorphism') || rawSlug.includes('neumorphism'))) {
      topicSlug = 'advanced-glassmorphism-and-neumorphism-patterns';
    } else if (rawSlug === 'pure-css-parallax-scrolling-effects' || rawSlug.includes('parallax')) {
      topicSlug = 'pure-css-parallax-scrolling-effects';
    } else if (rawSlug === 'loading-spinners-and-skeleton-screens' || rawSlug.includes('spinner') || rawSlug.includes('skeleton')) {
      topicSlug = 'loading-spinners-and-skeleton-screens';
    } else if (rawSlug === 'critical-css-and-eliminating-render-blocking' || rawSlug.includes('critical-css') || rawSlug.includes('render-blocking')) {
      topicSlug = 'critical-css-and-eliminating-render-blocking';
    } else if (rawSlug === 'css-minification-purging-and-tree-shaking' || rawSlug.includes('minification') || rawSlug.includes('purging')) {
      topicSlug = 'css-minification-purging-and-tree-shaking';
    } else if (rawSlug === 'improving-lighthouse-performance-and-core-web-vitals' || rawSlug.includes('lighthouse') || rawSlug.includes('vitals')) {
      topicSlug = 'improving-lighthouse-performance-and-core-web-vitals';
    } else if (rawSlug === 'project-1-interactive-dashboard-ui' || (rawSlug.includes('project-1') || (rawSlug.includes('dashboard') && rawSlug.includes('project')))) {
      topicSlug = 'project-1-interactive-dashboard-ui';
    } else if (rawSlug === 'project-2-portfolio-website-with-dark-light-theme' || (rawSlug.includes('project-2') || (rawSlug.includes('portfolio') && rawSlug.includes('project')))) {
      topicSlug = 'project-2-portfolio-website-with-dark-light-theme';
    } else if (rawSlug === 'project-3-responsive-ecommerce-product-page' || (rawSlug.includes('project-3') || (rawSlug.includes('ecommerce') && rawSlug.includes('project')))) {
      topicSlug = 'project-3-responsive-ecommerce-product-page';
    }
  }

  return `/tutorials/${tutorialSlug}/${topicSlug}`;
}
