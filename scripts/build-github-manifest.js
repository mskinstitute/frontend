const fs = require('fs');
const path = require('path');

const courses = JSON.parse(fs.readFileSync('./public/data/all-courses.json', 'utf8'));
const manifestPath = path.join(__dirname, '..', 'src', 'data', 'githubTutorialManifest.json');

// Read existing manifest so we don't lose the first 12 tutorials
let manifest = {};
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

const batch2Config = [
  // 1. Java
  { slug: 'java-for-beginners', org: 'msk-java', repo: 'beginner', dir: 'java-for-beginners' },
  { slug: 'java-for-intermediate', org: 'msk-java', repo: 'intermediate', dir: 'java-for-intermediate' },
  { slug: 'java-for-advanced', org: 'msk-java', repo: 'advance', dir: 'java-for-advanced' },

  // 2. JavaScript
  { slug: 'javascript-for-beginners', org: 'msk-javascript', repo: 'beginner', dir: 'javascript-for-beginners' },
  { slug: 'javascript-for-intermediate', org: 'msk-javascript', repo: 'intermediate', dir: 'javascript-for-intermediate' },
  { slug: 'javascript-for-advanced', org: 'msk-javascript', repo: 'advance', dir: 'javascript-for-advanced' },

  // 3. React
  { slug: 'react-js-for-beginners', org: 'msk-react', repo: 'beginner', dir: 'react-js-for-beginners' },
  { slug: 'react-js-for-intermediate', org: 'msk-react', repo: 'intermediate', dir: 'react-js-for-intermediate' },
  { slug: 'react-js-for-advanced', org: 'msk-react', repo: 'advance', dir: 'react-js-for-advanced' },

  // 4. Power BI
  { slug: 'power-bi-for-beginners', org: 'msk-powerbi', repo: 'beginner', dir: 'power-bi-for-beginners' },
  { slug: 'power-bi-for-intermediate', org: 'msk-powerbi', repo: 'intermediate', dir: 'power-bi-for-intermediate' },
  { slug: 'power-bi-for-advanced', org: 'msk-powerbi', repo: 'advance', dir: 'power-bi-for-advanced' },

  // 5. Django
  { slug: 'django-for-backend-development', org: 'msk-django', repo: 'beginner', dir: 'django-for-backend-development' },
  { slug: 'rest-api-development-with-django', org: 'msk-django', repo: 'intermediate', dir: 'rest-api-development-with-django' },

  // 6. PowerPoint
  { slug: 'ms-powerpoint-for-beginners', org: 'msk-powerpoint', repo: 'beginner', dir: 'ms-powerpoint-for-beginners' },

  // 7. Markdown
  { slug: 'markdown', org: 'msk-markdown', repo: 'beginner', dir: 'markdown' }
];

for (const item of batch2Config) {
  const baseDir = path.join(__dirname, '..', 'public', 'content', 'tutorials', item.dir);
  if (!fs.existsSync(baseDir)) {
    console.warn(`Directory not found: ${baseDir}`);
    continue;
  }

  const fileMap = {};
  const allFiles = [];

  function walk(currentDir, relDir = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory() && e.name !== 'images') {
        walk(path.join(currentDir, e.name), path.join(relDir, e.name));
      } else if (e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md') {
        const fullRel = path.join(relDir, e.name).replace(/\\/g, '/');
        allFiles.push({ filename: e.name, relPath: fullRel });
      }
    }
  }

  walk(baseDir);

  // Map by clean file name
  for (const f of allFiles) {
    const noExt = f.filename.slice(0, -3); // remove .md
    const clean = noExt.replace(/^\d+-/, ''); // remove leading numbers like 01-
    fileMap[noExt] = f.relPath;
    fileMap[clean] = f.relPath;
    fileMap[clean.toLowerCase()] = f.relPath;
  }

  // Also map all topic slugs from all-courses.json
  const course = courses.find((c) => c.slug === item.slug || c.id === 'course-' + item.slug);
  if (course && course.chapters) {
    for (const ch of course.chapters) {
      for (const t of ch.topics) {
        const slug = t.slug;
        const normalized = slug.toLowerCase().trim();
        const match = allFiles.find((f) => {
          const base = f.filename.slice(0, -3);
          const clean = base.replace(/^\d+-/, '').toLowerCase();
          return clean === normalized || base.toLowerCase() === normalized;
        });
        if (match) {
          fileMap[slug] = match.relPath;
        }
      }
    }
  }

  manifest[item.slug] = {
    org: item.org,
    repo: item.repo,
    branch: 'main',
    files: fileMap
  };
  console.log(`Mapped ${item.slug} (${Object.keys(fileMap).length} topic keys)`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('✅ githubTutorialManifest.json updated successfully with total:', Object.keys(manifest).length, 'tutorials');
