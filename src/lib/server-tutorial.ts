import fs from 'fs/promises';
import path from 'path';
import { parseFrontmatter } from '@/lib/markdown';
import { fetchTutorialBySlug } from '@/services/api';
import { TutorialTopicFrontmatter, Course, TutorialItem } from '@/types';
import githubManifest from '@/data/githubTutorialManifest.json';

// In-memory cache for fast repeated reads during server execution
const memoryCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

export async function fetchTutorialTopic(
  tutorialSlug: string,
  topicSlug: string
): Promise<{
  frontmatter: TutorialTopicFrontmatter;
  content: string;
  course: Course;
  tutorial: TutorialItem;
  prevTopic: { title: string; slug: string } | null;
  nextTopic: { title: string; slug: string } | null;
} | null> {
  const tutorialData = await fetchTutorialBySlug(tutorialSlug);
  if (!tutorialData) return null;

  const { tutorial, course } = tutorialData;

  // Flatten course topics to find current, previous, and next
  const flatTopics: { title: string; slug: string }[] = [];
  course.chapters?.forEach((ch) => {
    ch.topics?.forEach((t) => {
      const s =
        (t as any).slug ||
        t.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      flatTopics.push({ title: t.title, slug: s });
    });
  });

  const normalizedSlug = topicSlug.toLowerCase().trim();

  const currentIndex = flatTopics.findIndex((t) => {
    const s = t.slug.toLowerCase();
    return (
      s === normalizedSlug ||
      s.replace(/-/g, '') === normalizedSlug.replace(/-/g, '') ||
      (normalizedSlug === 'introduction' && (s === 'introduction-to-python' || s === 'introduction-to-html' || s === 'python-introduction')) ||
      (normalizedSlug === 'introduction-to-python' && (s === 'introduction' || s === 'introduction-to-python' || s === 'python-introduction')) ||
      (normalizedSlug === 'python-introduction' && (s === 'introduction' || s === 'introduction-to-python' || s === 'python-introduction')) ||
      (normalizedSlug === 'introduction-to-html' && (s === 'introduction' || s === 'introduction-to-html')) ||
      (normalizedSlug === 'vs-code-setup' && s === 'vscode-setup') ||
      (normalizedSlug === 'vscode-setup' && s === 'vs-code-setup') ||
      ((normalizedSlug === 'colors' || normalizedSlug === 'html-colors' || normalizedSlug === 'html-colors-color-codes') && s === 'html-colors-rgb') ||
      ((normalizedSlug === 'links' || normalizedSlug === 'hyperlinks' || normalizedSlug === 'links-navigation-lists') && s === 'links-hyperlinks') ||
      ((normalizedSlug === 'lists' || normalizedSlug === 'html-lists') && s === 'unordered-ordered-lists') ||
      ((normalizedSlug === 'tables' || normalizedSlug === 'table' || normalizedSlug === 'tables-structured-data') && s === 'html-tables') ||
      ((normalizedSlug === 'block-and-inline' || normalizedSlug === 'block-inline') && s === 'block-vs-inline-elements') ||
      ((normalizedSlug === 'images-multimedia-embeds' || normalizedSlug === 'images' || normalizedSlug === 'multimedia') && s === 'images-responsive-art') ||
      ((normalizedSlug === 'forms-inputs-validations' || normalizedSlug === 'forms' || normalizedSlug === 'form') && s === 'forms-input-types') ||
      (normalizedSlug === 'html5-semantic-architecture' && s === 'semantic-layout-elements') ||
      (normalizedSlug === 'accessibility-aria-seo' && s === 'accessibility-aria')
    );
  });

  const prevTopic = currentIndex > 0 ? flatTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex !== -1 && currentIndex < flatTopics.length - 1 ? flatTopics[currentIndex + 1] : null;

  // Candidate file names to try
  const currentTopic = currentIndex !== -1 ? flatTopics[currentIndex] : null;
  const currentTopicFile = currentTopic
    ? `${currentTopic.slug}.md`
    : null;
  const currentTopicRawTitleFile = currentTopic
    ? `${currentTopic.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.md`
    : null;

  const candidates = [
    `${normalizedSlug}.md`,
    currentTopicFile,
    currentTopicRawTitleFile,
    normalizedSlug === 'python-introduction' ? 'introduction-to-python.md' : null,
    normalizedSlug === 'python-introduction' ? 'introduction.md' : null,
    normalizedSlug === 'introduction-to-python' ? 'python-introduction.md' : null,
    normalizedSlug === 'introduction-to-python' ? 'introduction.md' : null,
    normalizedSlug === 'introduction' ? 'python-introduction.md' : null,
    normalizedSlug === 'introduction' ? 'introduction-to-python.md' : null,
    normalizedSlug === 'introduction-to-html' ? 'introduction.md' : null,
    normalizedSlug === 'introduction' ? 'introduction-to-html.md' : null,
    normalizedSlug === 'vs-code-setup' ? 'vscode-setup.md' : null,
    normalizedSlug === 'vscode-setup' ? 'vs-code-setup.md' : null,
    normalizedSlug === 'elements' || normalizedSlug === 'html-elements' ? 'elements.md' : null,
    normalizedSlug === 'attributes' || normalizedSlug === 'html-attributes' ? 'attributes.md' : null,
    normalizedSlug.includes('document-structure') ? 'basic-document-structure.md' : null,
    normalizedSlug.includes('document-structure') ? 'basic-document-structure-boilerplate.md' : null,
    normalizedSlug.includes('heading') ? 'html-headings.md' : null,
    normalizedSlug.includes('paragraph') ? 'paragraphs-line-breaks.md' : null,
    normalizedSlug.includes('formatting') ? 'text-formatting-elements.md' : null,
    normalizedSlug.includes('quotation') ? 'quotations-citations.md' : null,
    normalizedSlug.includes('entity') || normalizedSlug.includes('symbol') || normalizedSlug.includes('emoji') ? 'html-entities-symbols.md' : null,
    normalizedSlug.includes('comment') ? 'html-comments.md' : null,
    normalizedSlug.includes('comment') ? 'comments.md' : null,
    normalizedSlug.includes('hex') || normalizedSlug.includes('hsl') ? 'hex-hsl-color-codes.md' : null,
    normalizedSlug.includes('color') || normalizedSlug.includes('rgb') ? 'html-colors-rgb.md' : null,
    normalizedSlug.includes('target') || normalizedSlug.includes('security') ? 'target-attributes-security.md' : null,
    normalizedSlug.includes('link') || normalizedSlug === 'links-hyperlinks' ? 'links-hyperlinks.md' : null,
    normalizedSlug.includes('description') ? 'description-lists.md' : null,
    normalizedSlug.includes('unordered') || normalizedSlug.includes('ordered') || normalizedSlug.includes('list') ? 'unordered-ordered-lists.md' : null,
    normalizedSlug.includes('colspan') || normalizedSlug.includes('rowspan') ? 'colspan-rowspan.md' : null,
    normalizedSlug.includes('table') || normalizedSlug === 'html-tables' ? 'html-tables.md' : null,
    normalizedSlug.includes('div') || normalizedSlug.includes('span') ? 'div-span-containers.md' : null,
    normalizedSlug.includes('inline') || normalizedSlug.includes('block') ? 'block-vs-inline-elements.md' : null,
    normalizedSlug.includes('iframe') || normalizedSlug.includes('embed') ? 'iframes-web-embeds.md' : null,
    normalizedSlug.includes('svg') || normalizedSlug.includes('canvas') ? 'html5-svg-canvas.md' : null,
    normalizedSlug.includes('audio') || normalizedSlug.includes('video') ? 'audio-video.md' : null,
    normalizedSlug.includes('image') || normalizedSlug.includes('art') || normalizedSlug.includes('media') ? 'images-responsive-art.md' : null,
    normalizedSlug.includes('control') || normalizedSlug.includes('validation') ? 'form-controls-validations.md' : null,
    normalizedSlug.includes('form') || normalizedSlug.includes('input') ? 'forms-input-types.md' : null,
    normalizedSlug.includes('layout') || normalizedSlug.includes('semantic') ? 'semantic-layout-elements.md' : null,
    normalizedSlug.includes('accessibility') || normalizedSlug.includes('aria') ? 'accessibility-aria.md' : null,
    normalizedSlug.includes('dialog') || normalizedSlug.includes('detail') || normalizedSlug.includes('interactive') ? 'interactive-elements-dialog.md' : null,
    normalizedSlug.includes('api') || normalizedSlug.includes('storage') ? 'html5-apis-storage-best-practices.md' : null,
    'introduction.md',
    'introduction-to-html.md',
    'introduction-to-python.md',
  ].filter(Boolean) as string[];

  let rawMarkdown = '';

  // 1. Check if tutorial is backed by GitHub repository via githubTutorialManifest
  const manifest = githubManifest as Record<string, { org: string; repo: string; branch: string; files: Record<string, string> }>;
  const ghConfig = manifest[tutorial.slug];

  if (ghConfig && ghConfig.files) {
    // Try candidate matches in GitHub manifest
    let matchedRelPath: string | null = null;
    const lookupKeys = [
      normalizedSlug,
      topicSlug,
      currentTopic?.slug,
      ...candidates.map((c) => c.replace(/\.md$/, '').replace(/^\d+-/, '')),
      ...candidates.map((c) => c.replace(/\.md$/, ''))
    ].filter(Boolean) as string[];

    for (const key of lookupKeys) {
      if (ghConfig.files[key]) {
        matchedRelPath = ghConfig.files[key];
        break;
      }
      if (ghConfig.files[key.toLowerCase()]) {
        matchedRelPath = ghConfig.files[key.toLowerCase()];
        break;
      }
    }

    if (matchedRelPath) {
      const cacheKey = `${ghConfig.org}/${ghConfig.repo}/${matchedRelPath}`;
      const cached = memoryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        rawMarkdown = cached.content;
      } else {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${ghConfig.org}/${ghConfig.repo}/${ghConfig.branch || 'main'}/${matchedRelPath}`;
          const res = await fetch(rawUrl, {
            next: { revalidate: 3600 }, // 1-hour ISR cache
          });
          if (res.ok) {
            rawMarkdown = await res.text();
            // Automatically rewrite local image paths to GitHub Raw CDN images
            const rawBase = `https://raw.githubusercontent.com/${ghConfig.org}/${ghConfig.repo}/${ghConfig.branch || 'main'}`;
            rawMarkdown = rawMarkdown.replace(
              new RegExp(`/content/tutorials/${tutorial.slug}/images/`, 'g'),
              `${rawBase}/images/`
            );
            rawMarkdown = rawMarkdown.replace(
              /\(images\//g,
              `(${rawBase}/images/`
            );
            memoryCache.set(cacheKey, { content: rawMarkdown, timestamp: Date.now() });
          }
        } catch (fetchErr) {
          console.error(`Failed to fetch tutorial markdown from GitHub (${cacheKey}):`, fetchErr);
        }
      }
    }
  }

  // 2. If not found in GitHub manifest or fetch failed, fallback to local disk
  if (!rawMarkdown) {
    const tutorialDir = path.join(
      process.cwd(),
      'public',
      'content',
      'tutorials',
      tutorial.slug
    );

    for (const filename of candidates) {
      try {
        const filePath = path.join(tutorialDir, filename);
        rawMarkdown = await fs.readFile(filePath, 'utf8');
        if (rawMarkdown) break;
      } catch {
        // Continue to next candidate
      }
    }

    // If not found in tutorial root, search in chapter subdirectories
    if (!rawMarkdown) {
      try {
        const entries = await fs.readdir(tutorialDir, { withFileTypes: true });
        const subdirs = entries
          .filter((e) => e.isDirectory() && e.name !== 'images')
          .map((e) => e.name);

        for (const sub of subdirs) {
          try {
            const subFiles = await fs.readdir(path.join(tutorialDir, sub));
            for (const filename of candidates) {
              const cleanCandidate = filename.replace(/^\d+-/, '');
              const matchedFile = subFiles.find((f) => {
                if (f === filename) return true;
                const cleanF = f.replace(/^\d+-/, '');
                return cleanF === filename || cleanF === cleanCandidate;
              });

              if (matchedFile) {
                const subFilePath = path.join(tutorialDir, sub, matchedFile);
                rawMarkdown = await fs.readFile(subFilePath, 'utf8');
                if (rawMarkdown) break;
              }
            }
            if (rawMarkdown) break;
          } catch {
            // Continue to next subdir
          }
        }
      } catch {
        // Directory read failed
      }
    }
  }

  if (!rawMarkdown) {
    return null;
  }

  const { frontmatter, content } = parseFrontmatter<TutorialTopicFrontmatter>(rawMarkdown);

  return {
    frontmatter: {
      ...frontmatter,
      title: frontmatter.title || flatTopics[currentIndex]?.title || 'Lesson',
      slug: topicSlug,
    },
    content,
    course,
    tutorial,
    prevTopic,
    nextTopic,
  };
}
