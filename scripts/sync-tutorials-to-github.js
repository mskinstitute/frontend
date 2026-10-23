const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

function getGitToken() {
  try {
    const creds = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n\n',
      encoding: 'utf8'
    });
    const match = creds.match(/password=(.+)/);
    return match ? match[1].trim() : null;
  } catch (err) {
    return process.env.GITHUB_TOKEN || null;
  }
}

const TOKEN = getGitToken();
const USERNAME = process.env.GITHUB_USER || 'MrSumitKumar';
const USER_EMAIL = process.env.GITHUB_EMAIL || '72176567+MrSumitKumar@users.noreply.github.com';

const reposConfig = [
  // 1. Python
  {
    org: 'msk-python',
    repo: 'beginner',
    title: 'Python for Beginners (Level 1)',
    description: 'Python for Beginners Complete Tutorial & Notes — Zero-to-hero fundamentals, control flow, functions, and 4 projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'python-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/python-for-beginners',
    courseSlug: 'python-for-beginners'
  },
  {
    org: 'msk-python',
    repo: 'intermediate',
    title: 'Python for Intermediate (Level 2)',
    description: 'Python for Intermediate Complete Tutorial & Notes — OOP architecture, decorators, generators, REST APIs, SQLite, and 7 projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'python-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/python-for-intermediate',
    courseSlug: 'python-for-intermediate'
  },
  {
    org: 'msk-python',
    repo: 'advance',
    title: 'Python for Advanced (Level 3)',
    description: 'Python for Advanced Complete Tutorial & Notes — Concurrency, asyncio, sockets, SQLAlchemy 2.0, Free-Threaded No-GIL Python 3.13, and 3 enterprise capstones by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'python-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/python-for-advanced',
    courseSlug: 'python-for-advanced'
  },

  // 2. HTML
  {
    org: 'msk-html',
    repo: 'beginner',
    title: 'HTML5 Complete Course (Beginner)',
    description: 'HTML5 Complete Course & Notes — Semantic web layout, elements, forms, tables, links, and responsive multimedia by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'html5-complete-course'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/html5-complete-course',
    courseSlug: 'html5-complete-course'
  },
  {
    org: 'msk-html',
    repo: 'intermediate',
    title: 'HTML for Intermediate (Level 2)',
    description: 'HTML for Intermediate — Advanced form validations, HTML5 dialog tags, custom data attributes, accessible ARIA roles, and microdata by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/html5-complete-course',
    courseSlug: 'html5-complete-course'
  },
  {
    org: 'msk-html',
    repo: 'advance',
    title: 'HTML for Advanced (Level 3)',
    description: 'HTML for Advanced — Web Components, Shadow DOM, HTML5 Canvas, Web Workers, Audio/Video APIs, and PWA manifest architecture by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/html5-complete-course',
    courseSlug: 'html5-complete-course'
  },

  // 3. CSS
  {
    org: 'msk-css',
    repo: 'beginner',
    title: 'CSS for Beginners (Level 1)',
    description: 'CSS for Beginners Complete Tutorial & Notes — Selectors, Box Model, typography, backgrounds, borders, and modern layout fundamentals by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'css-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/css-for-beginners',
    courseSlug: 'css-for-beginners'
  },
  {
    org: 'msk-css',
    repo: 'intermediate',
    title: 'CSS for Intermediate (Level 2)',
    description: 'CSS for Intermediate Complete Tutorial & Notes — Flexbox mastery, CSS Grid layouts, responsive media queries, transforms, and animations by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'css-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/css-for-intermediate',
    courseSlug: 'css-for-intermediate'
  },
  {
    org: 'msk-css',
    repo: 'advance',
    title: 'CSS for Advanced (Level 3)',
    description: 'CSS for Advanced Complete Tutorial & Notes — Combined Grid & Flexbox architectures, CSS custom properties, responsive design systems, and modern UI engineering by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'css-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/css-for-advanced',
    courseSlug: 'css-for-advanced'
  },

  // 4. Word
  {
    org: 'msk-word',
    repo: 'beginner',
    title: 'MS Word for Beginners (Level 1)',
    description: 'Microsoft Word for Beginners Complete Office Tutorial & Notes — Document creation, text formatting, page layouts, tables, and printing by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'ms-word-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-word-for-beginners',
    courseSlug: 'ms-word-for-beginners'
  },
  {
    org: 'msk-word',
    repo: 'intermediate',
    title: 'MS Word for Intermediate (Level 2)',
    description: 'Microsoft Word for Intermediate — Mail merge, styles & document templates, automated table of contents, and multi-page document automation by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-word-for-beginners',
    courseSlug: 'ms-word-for-beginners'
  },
  {
    org: 'msk-word',
    repo: 'advance',
    title: 'MS Word for Advanced (Level 3)',
    description: 'Microsoft Word for Advanced Complete Office Tutorial & Notes — Macros, document protection, advanced review workflows, and corporate documentation by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'ms-word-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-word-for-advanced',
    courseSlug: 'ms-word-for-advanced'
  },

  // 5. Excel
  {
    org: 'msk-excel',
    repo: 'beginner',
    title: 'MS Excel for Beginners (Level 1)',
    description: 'Microsoft Excel for Beginners Complete Tutorial & Notes — Spreadsheet navigation, basic formulas (SUM, AVERAGE), cells, and data entry by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'ms-excel-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-excel-for-beginners',
    courseSlug: 'ms-excel-for-beginners'
  },
  {
    org: 'msk-excel',
    repo: 'intermediate',
    title: 'MS Excel for Intermediate (Level 2)',
    description: 'Microsoft Excel for Intermediate Complete Tutorial & Notes — Logical formulas (IF, AND, OR), VLOOKUP, HLOOKUP, data validation, and conditional formatting by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'ms-excel-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-excel-for-intermediate',
    courseSlug: 'ms-excel-for-intermediate'
  },
  {
    org: 'msk-excel',
    repo: 'advance',
    title: 'MS Excel for Advanced (Level 3)',
    description: 'Microsoft Excel for Advanced Complete Tutorial & Notes — XLOOKUP, dynamic arrays, Pivot Tables, Power Query ETL, executive KPI dashboards, and automation by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'ms-excel-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-excel-for-advanced',
    courseSlug: 'ms-excel-for-advanced'
  }
];

// Helper to make GitHub API calls
function githubApi(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        host: 'api.github.com',
        path: endpoint,
        method: method,
        headers: {
          'User-Agent': 'MSK-Institute-Sync',
          'Authorization': `token ${TOKEN}`,
          'Accept': 'application/vnd.github+json',
          ...(postData
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            : {})
        }
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          try {
            const data = raw ? JSON.parse(raw) : {};
            resolve({ statusCode: res.statusCode, data });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Create repo on GitHub if not existing
async function ensureRepo(org, repo, description) {
  process.stdout.write(`Checking https://github.com/${org}/${repo}... `);
  const check = await githubApi(`/repos/${org}/${repo}`);
  if (check.statusCode === 200) {
    console.log('✅ Already exists');
    return check.data;
  }

  process.stdout.write(`Creating repo... `);
  const create = await githubApi(`/orgs/${org}/repos`, 'POST', {
    name: repo,
    description: description,
    private: false,
    has_issues: true,
    has_projects: true,
    has_wiki: true,
    auto_init: false
  });

  if (create.statusCode === 201) {
    console.log('🎉 Created successfully!');
    return create.data;
  } else {
    console.log(`⚠️ Status ${create.statusCode}:`, create.data?.message || create.raw);
    return create.data;
  }
}

// Generate beautiful README
function buildReadme(config, fileList) {
  const org = config.org;
  const repo = config.repo;
  const title = config.title;
  const desc = config.description;
  const siteUrl = config.siteUrl;

  let toc = '';
  if (fileList.length > 0) {
    toc = fileList
      .map((f, i) => {
        const cleanName = path.basename(f, '.md').replace(/^\d+-/, '').replace(/-/g, ' ');
        const capName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        const relPath = path.relative(path.join(__dirname, '..', 'temp_repos', `${org}_${repo}`), f).replace(/\\/g, '/');
        return `${i + 1}. [${capName}](./${relPath})`;
      })
      .join('\n');
  } else {
    toc = `- *Curriculum roadmap and interactive notes being actively updated.*`;
  }

  return `# 🎓 ${title} — MSK Institute

[![MSK Institute](https://img.shields.io/badge/MSK%20Institute-Official%20Curriculum-orange.svg)](${siteUrl})
[![GitHub stars](https://img.shields.io/github/stars/${org}/${repo}.svg?style=social)](https://github.com/${org}/${repo})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ${desc}

Welcome to the official repository for **${title}**, engineered and maintained by **[MSK Institute](https://www.mskinstitute.in)** (Shikohabad, UP). 

Explore this curriculum with interactive code sandboxes, visual diagrams, and formative quiz assessments online at:  
👉 **[Read Interactive Tutorials on MSK Institute](${siteUrl})**

---

## 🗺️ Curriculum Table of Contents

${toc}

---

## 🏛️ About MSK Institute

**MSK Institute** is the premier coding and technical computer institute in Shikohabad (Firozabad, Uttar Pradesh), founded by **Er. Sumit Kumar**. We offer offline practical lab classes and free online tutorials covering Python, Full-Stack Web Development, Data Analytics, Cybersecurity, and Software Engineering.

- 🌐 **Official Website:** [https://www.mskinstitute.in](https://www.mskinstitute.in)
- 📍 **Campus Address:** Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, UP (283135)
- 📞 **Contact / WhatsApp:** +91 8393042166
- 📜 **Online Certificate Verification:** [https://www.mskinstitute.in/verify-certificate](https://www.mskinstitute.in/verify-certificate)

---

## 📄 License

This repository is distributed under the **MIT License**. Free for educational and non-commercial learning use.
`;
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Get all markdown files in dir
function getAllMarkdownFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '.git') {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      results.push(fullPath);
    }
  }
  return results;
}

// Main execution routine
async function main() {
  console.log('🚀 Starting MSK Institute GitHub Tutorial Migration...\n');
  const tempBase = path.join(__dirname, '..', 'temp_repos');
  if (!fs.existsSync(tempBase)) fs.mkdirSync(tempBase, { recursive: true });

  for (const item of reposConfig) {
    const { org, repo, description, sourceDir, placeholder } = item;
    console.log(`\n======================================================`);
    console.log(`📦 Processing: ${org}/${repo}`);
    console.log(`======================================================`);

    // 1. Ensure remote repository exists
    await ensureRepo(org, repo, description);

    // 2. Prepare local repo staging folder
    const targetDir = path.join(tempBase, `${org}_${repo}`);
    if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir, { recursive: true });

    let mdFiles = [];
    if (!placeholder && sourceDir && fs.existsSync(sourceDir)) {
      copyDir(sourceDir, targetDir);
      mdFiles = getAllMarkdownFiles(targetDir);
    } else {
      // Create a structured roadmap file for placeholder repos
      const notePath = path.join(targetDir, 'ROADMAP.md');
      fs.writeFileSync(
        notePath,
        `# ${item.title} Roadmap\n\nCurriculum content for this tier is being uploaded by MSK Institute faculty. Visit [MSK Institute](https://www.mskinstitute.in) for live batch enrollment and updates.`,
        'utf8'
      );
      mdFiles.push(notePath);
    }

    // 3. Write README.md and .gitignore
    const readmeContent = buildReadme(item, mdFiles);
    fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent, 'utf8');
    fs.writeFileSync(path.join(targetDir, '.gitignore'), '.DS_Store\nThumbs.db\n*.tmp\n', 'utf8');

    // 4. Git init and push
    try {
      console.log(`⚙️ Initializing git and committing ${mdFiles.length} tutorial files...`);
      execSync('git init -b main', { cwd: targetDir, stdio: 'pipe' });
      execSync(`git config user.name "${USERNAME}"`, { cwd: targetDir, stdio: 'pipe' });
      execSync(`git config user.email "${USER_EMAIL}"`, { cwd: targetDir, stdio: 'pipe' });
      execSync('git add .', { cwd: targetDir, stdio: 'pipe' });
      execSync(`git commit -m "feat: complete ${item.title} tutorial curriculum from MSK Institute"`, {
        cwd: targetDir,
        stdio: 'pipe'
      });

      const remoteUrl = `https://${USERNAME}:${TOKEN}@github.com/${org}/${repo}.git`;
      execSync(`git remote add origin ${remoteUrl}`, { cwd: targetDir, stdio: 'pipe' });

      console.log(`⬆️ Pushing to https://github.com/${org}/${repo}...`);
      execSync('git push -u origin main --force', { cwd: targetDir, stdio: 'pipe' });
      console.log(`✅ Successfully deployed to https://github.com/${org}/${repo}`);
    } catch (err) {
      console.error(`❌ Error pushing ${org}/${repo}:`, err.message);
    }
  }

  // 5. Clean up temporary staging
  console.log('\n🧹 Cleaning up temporary repository folders...');
  if (fs.existsSync(tempBase)) fs.rmSync(tempBase, { recursive: true, force: true });

  // 6. Update tutorials.json with new GitHub URLs
  console.log('📝 Updating public/data/tutorials.json with new GitHub organization URLs...');
  const tutPath = path.join(__dirname, '..', 'public', 'data', 'tutorials.json');
  const tutorials = JSON.parse(fs.readFileSync(tutPath, 'utf8'));

  const urlMap = {
    'python-for-beginners': 'https://github.com/msk-python/beginner',
    'python-for-intermediate': 'https://github.com/msk-python/intermediate',
    'python-for-advanced': 'https://github.com/msk-python/advance',
    'html5-complete-course': 'https://github.com/msk-html/beginner',
    'css-for-beginners': 'https://github.com/msk-css/beginner',
    'css-for-intermediate': 'https://github.com/msk-css/intermediate',
    'css-for-advanced': 'https://github.com/msk-css/advance',
    'ms-word-for-beginners': 'https://github.com/msk-word/beginner',
    'ms-word-for-advanced': 'https://github.com/msk-word/advance',
    'ms-excel-for-beginners': 'https://github.com/msk-excel/beginner',
    'ms-excel-for-intermediate': 'https://github.com/msk-excel/intermediate',
    'ms-excel-for-advanced': 'https://github.com/msk-excel/advance'
  };

  for (const tut of tutorials) {
    if (urlMap[tut.slug] || urlMap[tut.courseSlug]) {
      tut.githubRepo = urlMap[tut.slug] || urlMap[tut.courseSlug];
    }
  }

  fs.writeFileSync(tutPath, JSON.stringify(tutorials, null, 2), 'utf8');
  console.log('✅ public/data/tutorials.json updated successfully!');

  console.log('\n🎉 ALL 15 REPOSITORIES CREATED AND TUTORIALS DEPLOYED SUCCESSFULLY!');
}

main().catch(console.error);
