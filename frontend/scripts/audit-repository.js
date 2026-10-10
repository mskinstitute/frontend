const fs = require('fs');
const path = require('path');

console.log('--- REPOSITORY AUDIT SCAN ---');

// 1. Load Courses
const coursesPath = path.join(__dirname, '../public/data/all-courses.json');
const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
console.log(`\n[COURSES] Total entries: ${courses.length}`);
const publishedCourses = courses.filter(c => c.status === 'PUBLISH');
const draftCourses = courses.filter(c => c.status === 'DRAFT');
const otherStatusCourses = courses.filter(c => c.status !== 'PUBLISH' && c.status !== 'DRAFT');
console.log(`- PUBLISH: ${publishedCourses.length}`);
console.log(`- DRAFT: ${draftCourses.length}`);
if (otherStatusCourses.length > 0) {
  console.log(`- OTHER STATUS:`, otherStatusCourses.map(c => ({ id: c.id, slug: c.slug, status: c.status })));
}

// Slugs & IDs duplicates
const courseSlugs = new Map();
courses.forEach(c => {
  if (!courseSlugs.has(c.slug)) courseSlugs.set(c.slug, []);
  courseSlugs.get(c.slug).push(c.id);
});
for (const [slug, ids] of courseSlugs.entries()) {
  if (ids.length > 1) {
    console.warn(`DUPLICATE COURSE SLUG: "${slug}" used by IDs:`, ids);
  }
}

// 2. Tutorials
const tutorialsPath = path.join(__dirname, '../public/data/tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));
console.log(`\n[TUTORIALS] Total: ${tutorials.length}`);
const tutSlugs = new Set(tutorials.map(t => t.slug));

// Check tutorial courseSlug links
tutorials.forEach(t => {
  if (t.courseSlug && !courseSlugs.has(t.courseSlug)) {
    console.warn(`[TUTORIAL WARNING] Tutorial "${t.slug}" references non-existent courseSlug "${t.courseSlug}"`);
  }
});

// 3. Study Materials
const smPath = path.join(__dirname, '../public/data/study-materials.json');
const studyMaterials = JSON.parse(fs.readFileSync(smPath, 'utf8'));
console.log(`\n[STUDY MATERIALS] Total: ${studyMaterials.length}`);

// 4. Batches
const apiPath = path.join(__dirname, '../src/services/api.ts');
const apiContent = fs.readFileSync(apiPath, 'utf8');

// 5. Blogs
const blogsDir = path.join(__dirname, '../content/blogs');
const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
console.log(`\n[BLOGS] Total markdown files: ${blogFiles.length}`);

// 6. Scan all TSX and TS files for hardcoded course routes and links
function scanDirectory(dir, list = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.next', '.git', 'out'].includes(item)) {
        scanDirectory(full, list);
      }
    } else if (/\.(tsx|ts|jsx|js|json|md)$/.test(item)) {
      list.push(full);
    }
  }
  return list;
}

const allProjectFiles = scanDirectory(path.join(__dirname, '../src'));
const linkMatches = [];
const courseLinkPattern = /['"\/]courses\/([a-zA-Z0-9_\-]+)['"]/g;

allProjectFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = courseLinkPattern.exec(content)) !== null) {
    const slug = m[1];
    linkMatches.push({ file: path.relative(path.join(__dirname, '..'), file), slug });
  }
});

console.log(`\n[INTERNAL COURSE LINKS IN SRC] Total references found: ${linkMatches.length}`);
const brokenCourseLinks = linkMatches.filter(lm => !courseSlugs.has(lm.slug));
if (brokenCourseLinks.length === 0) {
  console.log('No broken course links found in src!');
} else {
  console.warn(`Found ${brokenCourseLinks.length} broken course link references:`);
  brokenCourseLinks.forEach(b => {
    console.warn(`  - ${b.file} -> /courses/${b.slug}`);
  });
}

// 7. Check batch course references in api.ts
console.log('\n[BATCH AUDIT]');
const batchRegex = /id:\s*['"]([^'"]+)['"][\s\S]*?courseSlug:\s*['"]([^'"]+)['"]/g;
let bm;
while ((bm = batchRegex.exec(apiContent)) !== null) {
  const bId = bm[1];
  const bSlug = bm[2];
  const exists = courseSlugs.has(bSlug);
  console.log(`Batch "${bId}" -> courseSlug: "${bSlug}" (Exists in all-courses.json: ${exists})`);
}

// 8. Learning outcomes check
const coursesWithoutOutcomes = courses.filter(c => !c.learningOutcomes || c.learningOutcomes.length === 0);
console.log(`\n[COURSE OUTCOMES AUDIT] Courses without learningOutcomes in JSON: ${coursesWithoutOutcomes.length} of ${courses.length}`);
