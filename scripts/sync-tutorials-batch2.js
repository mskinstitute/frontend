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
    return null;
  }
}

const TOKEN = getGitToken() || process.env.GITHUB_TOKEN || '';
const USERNAME = process.env.GITHUB_USER || 'MrSumitKumar';
const USER_EMAIL = process.env.GITHUB_EMAIL || '72176567+MrSumitKumar@users.noreply.github.com';

const reposConfig = [
  // 1. Java
  {
    org: 'msk-java',
    repo: 'beginner',
    title: 'Java for Beginners (Level 1)',
    description: 'Java for Beginners Complete Tutorial & Notes — JDK setup, variables, control flow, loops, methods, arrays, OOP basics, and 4 practical console projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'java-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/java-for-beginners',
    courseSlug: 'java-for-beginners'
  },
  {
    org: 'msk-java',
    repo: 'intermediate',
    title: 'Java for Intermediate (Level 2)',
    description: 'Java for Intermediate Complete Tutorial & Notes — OOP inheritance, interfaces, exception handling, Java Collections Framework, file I/O, modern records, and 3 projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'java-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/java-for-intermediate',
    courseSlug: 'java-for-intermediate'
  },
  {
    org: 'msk-java',
    repo: 'advance',
    title: 'Java for Advanced (Level 3)',
    description: 'Java for Advanced Complete Tutorial & Notes — Generics, multithreading, concurrency, Lambdas, Streams API, JDBC MySQL connectivity, reflection, and 3 production capstones by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'java-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/java-for-advanced',
    courseSlug: 'java-for-advanced'
  },

  // 2. JavaScript
  {
    org: 'msk-javascript',
    repo: 'beginner',
    title: 'JavaScript for Beginners (Level 1)',
    description: 'JavaScript for Beginners Complete Tutorial & Notes — JS engine, syntax, data types, operators, conditionals, loops, functions, arrays, objects, and foundational projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'javascript-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/javascript-for-beginners',
    courseSlug: 'javascript-for-beginners'
  },
  {
    org: 'msk-javascript',
    repo: 'intermediate',
    title: 'JavaScript for Intermediate (Level 2)',
    description: 'JavaScript for Intermediate Complete Tutorial & Notes — DOM manipulation, browser events, ES6+ features, closures, promises, fetch API, and interactive web apps by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'javascript-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/javascript-for-intermediate',
    courseSlug: 'javascript-for-intermediate'
  },
  {
    org: 'msk-javascript',
    repo: 'advance',
    title: 'JavaScript for Advanced (Level 3)',
    description: 'JavaScript for Advanced Complete Tutorial & Notes — Event loop, prototypes & inheritance, async/await, memory management, modules, Web APIs, design patterns, and performance optimization by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'javascript-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/javascript-for-advanced',
    courseSlug: 'javascript-for-advanced'
  },

  // 3. React
  {
    org: 'msk-react',
    repo: 'beginner',
    title: 'React.js for Beginners (Level 1)',
    description: 'React.js for Beginners Complete Tutorial & Notes — React philosophy, JSX, components, props, state, event handling, and 4 practical mini-apps by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'react-js-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/react-js-for-beginners',
    courseSlug: 'react-js-for-beginners'
  },
  {
    org: 'msk-react',
    repo: 'intermediate',
    title: 'React.js for Intermediate (Level 2)',
    description: 'React.js for Intermediate Complete Tutorial & Notes — React Hooks (useEffect, useRef, useMemo, useCallback), Context API, React Router, form handling, and full SPA projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'react-js-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/react-js-for-intermediate',
    courseSlug: 'react-js-for-intermediate'
  },
  {
    org: 'msk-react',
    repo: 'advance',
    title: 'React.js for Advanced (Level 3)',
    description: 'React.js for Advanced Complete Tutorial & Notes — Custom hooks, Redux Toolkit, Zustand, performance optimization, Suspense, SSR fundamentals, and production architecture by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'react-js-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/react-js-for-advanced',
    courseSlug: 'react-js-for-advanced'
  },

  // 4. Power BI
  {
    org: 'msk-powerbi',
    repo: 'beginner',
    title: 'Power BI for Beginners (Level 1)',
    description: 'Power BI for Beginners Complete Tutorial & Notes — Power BI Desktop interface, importing data (Excel, CSV, Web), basic data modeling, core visuals, and interactive dashboards by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'power-bi-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/power-bi-for-beginners',
    courseSlug: 'power-bi-for-beginners'
  },
  {
    org: 'msk-powerbi',
    repo: 'intermediate',
    title: 'Power BI for Intermediate (Level 2)',
    description: 'Power BI for Intermediate Complete Tutorial & Notes — Power Query transformations, DAX fundamentals (CALCULATE, RELATED, FILTER), star schema data modeling, and business reports by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'power-bi-for-intermediate'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/power-bi-for-intermediate',
    courseSlug: 'power-bi-for-intermediate'
  },
  {
    org: 'msk-powerbi',
    repo: 'advance',
    title: 'Power BI for Advanced (Level 3)',
    description: 'Power BI for Advanced Complete Tutorial & Notes — Advanced DAX time intelligence, Row-Level Security (RLS), Power BI Service publishing, performance tuning, and executive capstones by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'power-bi-for-advanced'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/power-bi-for-advanced',
    courseSlug: 'power-bi-for-advanced'
  },

  // 5. Django
  {
    org: 'msk-django',
    repo: 'beginner',
    title: 'Django for Backend Development (Level 1)',
    description: 'Django for Backend Development Complete Tutorial & Notes — Django architecture (MVT), models, views, templates, forms, admin panel, SQLite/PostgreSQL, and full-stack web applications by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'django-for-backend-development'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/django-for-backend-development',
    courseSlug: 'django-for-backend-development'
  },
  {
    org: 'msk-django',
    repo: 'intermediate',
    title: 'REST API Development with Django (Level 2)',
    description: 'REST API Development with Django Complete Tutorial & Notes — Django REST Framework (DRF), serializers, viewsets, token & JWT authentication, permissions, pagination, and API testing by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'rest-api-development-with-django'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/rest-api-development-with-django',
    courseSlug: 'rest-api-development-with-django'
  },
  {
    org: 'msk-django',
    repo: 'advance',
    title: 'Django for Advanced (Level 3)',
    description: 'Django for Advanced Complete Tutorial & Notes — Asynchronous Django, WebSockets with Django Channels, background tasks with Celery & Redis, caching, Docker deployment, and enterprise backend engineering by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/django-for-backend-development',
    courseSlug: 'django-for-backend-development'
  },

  // 6. PowerPoint
  {
    org: 'msk-powerpoint',
    repo: 'beginner',
    title: 'MS PowerPoint for Beginners (Level 1)',
    description: 'MS PowerPoint for Beginners Complete Tutorial & Notes — Slides, layout, shapes, smart art, animations, transitions, presentation delivery, and professional slide deck projects by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'ms-powerpoint-for-beginners'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-powerpoint-for-beginners',
    courseSlug: 'ms-powerpoint-for-beginners'
  },
  {
    org: 'msk-powerpoint',
    repo: 'intermediate',
    title: 'MS PowerPoint for Intermediate (Level 2)',
    description: 'MS PowerPoint for Intermediate Complete Tutorial & Notes — Slide Master customization, multimedia video/audio embedding, custom motion paths, infographic designs, and business pitches by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-powerpoint-for-beginners',
    courseSlug: 'ms-powerpoint-for-beginners'
  },
  {
    org: 'msk-powerpoint',
    repo: 'advance',
    title: 'MS PowerPoint for Advanced (Level 3)',
    description: 'MS PowerPoint for Advanced Complete Tutorial & Notes — Interactive presentation dashboards, VBA macros for PowerPoint automation, kiosk self-running presentations, and enterprise branding templates by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/ms-powerpoint-for-beginners',
    courseSlug: 'ms-powerpoint-for-beginners'
  },

  // 7. Markdown
  {
    org: 'msk-markdown',
    repo: 'beginner',
    title: 'Markdown & GFM Mastery (Level 1)',
    description: 'Markdown & GitHub Flavored Markdown (GFM) Mastery — Headers, lists, code fences, blockquotes, tables, task lists, emojis, badges, and documentation best practices by MSK Institute.',
    sourceDir: path.join(__dirname, '..', 'public', 'content', 'tutorials', 'markdown'),
    siteUrl: 'https://www.mskinstitute.in/tutorials/markdown',
    courseSlug: 'markdown'
  },
  {
    org: 'msk-markdown',
    repo: 'intermediate',
    title: 'Markdown for Technical Writers (Level 2)',
    description: 'Markdown for Technical Writers — Static site generators (Hugo, Docusaurus, Nextra), MDX component embedding, frontmatter metadata, and open source documentation engineering by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/markdown',
    courseSlug: 'markdown'
  },
  {
    org: 'msk-markdown',
    repo: 'advance',
    title: 'Advanced Markdown & Documentation Architecture (Level 3)',
    description: 'Advanced Markdown Architecture — Automated documentation CI/CD pipelines, API spec doc generation, Mermaid diagram architectures, and enterprise knowledge base engineering by MSK Institute.',
    placeholder: true,
    siteUrl: 'https://www.mskinstitute.in/tutorials/markdown',
    courseSlug: 'markdown'
  }
];

function githubRequest(method, apiPath, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: apiPath,
      method: method,
      headers: {
        'User-Agent': 'NodeJS-MSK-Sync',
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function ensureRepo(org, repo, description) {
  console.log(`\n🔍 Checking repository https://github.com/${org}/${repo}...`);
  const check = await githubRequest('GET', `/repos/${org}/${repo}`);
  if (check.status === 200) {
    console.log(`   Repo ${org}/${repo} already exists.`);
    return true;
  }

  console.log(`   Creating repository ${org}/${repo} under organization ${org}...`);
  const create = await githubRequest('POST', `/orgs/${org}/repos`, {
    name: repo,
    description: description,
    homepage: 'https://www.mskinstitute.in',
    private: false,
    has_issues: true,
    has_projects: false,
    has_wiki: false,
    auto_init: false
  });

  if (create.status === 201) {
    console.log(`   ✅ Repo ${org}/${repo} created successfully.`);
    return true;
  } else {
    console.error(`   ❌ Failed to create repo ${org}/${repo}:`, create.data);
    return false;
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(target, file));
      } else {
        fs.copyFileSync(curSource, path.join(target, file));
      }
    });
  }
}

function buildReadme(config, files) {
  const { title, description, org, repo, siteUrl } = config;

  let toc = '';
  if (files && files.length > 0) {
    const mdFiles = files.filter((f) => f.endsWith('.md') && !f.endsWith('README.md'));
    mdFiles.sort();

    const grouped = {};
    for (const f of mdFiles) {
      const parts = f.split(/[\\/]/);
      const chapter = parts.length > 1 ? parts[0] : 'Curriculum Notes';
      const file = parts.length > 1 ? parts[1] : parts[0];
      if (!grouped[chapter]) grouped[chapter] = [];
      grouped[chapter].push({ file, fullRel: f.replace(/\\/g, '/') });
    }

    for (const [ch, items] of Object.entries(grouped)) {
      const chTitle = ch.replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase();
      toc += `### 📂 ${chTitle}\n`;
      for (const item of items) {
        const itemTitle = item.file
          .replace(/\.md$/, '')
          .replace(/^\d+-/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        toc += `- [📖 ${itemTitle}](./${item.fullRel})\n`;
      }
      toc += '\n';
    }
  } else {
    toc = `> 🚀 **Course syllabus roadmap is available on [MSK Institute](${siteUrl})**\n\n- Detailed chapter notes are being synchronized from MSK Institute curriculum systems.\n- Visit [MSK Institute](${siteUrl}) to access all interactive lessons, projects, and certification tracks.\n`;
  }

  return `# ${title}

[![MSK Institute](https://img.shields.io/badge/MSK%20Institute-Official%20Curriculum-blue.svg)](${siteUrl})
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Website](https://img.shields.io/badge/Website-mskinstitute.in-0066cc.svg)](https://www.mskinstitute.in)

> ${description}

---

## 🌐 Official Web Portal & Interactive Learning
All notes in this repository are actively synchronized with **[MSK Institute's Online Learning Portal](${siteUrl})**, featuring interactive code readers, quizzes, real-world coding exercises, and industry certification.

- 🎓 **Read full interactive guide:** [${siteUrl}](${siteUrl})
- 🏢 **Institution:** [MSK Institute (mskinstitute.in)](https://www.mskinstitute.in)
- 📍 **Location:** Shikohabad, Uttar Pradesh, India

---

## 📑 Curriculum & Table of Contents

${toc}

---

## 💡 About MSK Institute
**MSK Institute** is a premier technical training institution empowering students with cutting-edge software engineering skills, hands-on programming mastery, and industry-ready job placement training.

- 🌐 Website: [https://www.mskinstitute.in](https://www.mskinstitute.in)
- 📞 Admission & Queries: [info@mskinstitute.in](mailto:info@mskinstitute.in)
- 📍 Shikohabad, UP, India

---

© ${new Date().getFullYear()} [MSK Institute](https://www.mskinstitute.in). All rights reserved. Notes and educational materials are curated for MSK Institute students.
`;
}

async function main() {
  console.log('🚀 STARTING BATCH 2 MIGRATION TO GITHUB (7 Skills, 21 Repositories)...');
  console.log(`Authenticated as: ${USERNAME}`);

  const tempBase = path.join(__dirname, '..', '.tmp-github-sync-b2');
  if (fs.existsSync(tempBase)) {
    fs.rmSync(tempBase, { recursive: true, force: true });
  }
  fs.mkdirSync(tempBase, { recursive: true });

  for (const item of reposConfig) {
    const { org, repo, description, sourceDir, placeholder } = item;
    console.log(`\n======================================================`);
    console.log(`📦 Processing ${org}/${repo} [${item.title}]`);
    console.log(`======================================================`);

    // 1. Ensure repo exists on GitHub
    const ok = await ensureRepo(org, repo, description);
    if (!ok) {
      console.error(`Skipping ${org}/${repo} due to creation error.`);
      continue;
    }

    // 2. Prepare staging directory
    const targetDir = path.join(tempBase, `${org}-${repo}`);
    fs.mkdirSync(targetDir, { recursive: true });

    let mdFiles = [];

    if (!placeholder && sourceDir && fs.existsSync(sourceDir)) {
      console.log(`📂 Copying tutorial files from ${sourceDir}...`);
      copyFolderRecursiveSync(sourceDir, targetDir);

      const allFiles = getAllFiles(targetDir);
      mdFiles = allFiles
        .map((f) => path.relative(targetDir, f))
        .filter((f) => f.endsWith('.md') && !f.endsWith('README.md'));
      console.log(`   Copied ${mdFiles.length} markdown notes.`);
    } else {
      console.log(`ℹ️ Preparing placeholder roadmap repository for ${item.title}...`);
      const roadmapDir = path.join(targetDir, '01-roadmap-and-overview');
      fs.mkdirSync(roadmapDir, { recursive: true });
      const notePath = path.join('01-roadmap-and-overview', '01-course-overview-and-syllabus.md');
      fs.writeFileSync(
        path.join(targetDir, notePath),
        `# ${item.title}\n\n${description}\n\nVisit [MSK Institute](${item.siteUrl}) for complete interactive modules and enrollments.\n`,
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
    'java-for-beginners': 'https://github.com/msk-java/beginner',
    'java-for-intermediate': 'https://github.com/msk-java/intermediate',
    'java-for-advanced': 'https://github.com/msk-java/advance',
    'javascript-for-beginners': 'https://github.com/msk-javascript/beginner',
    'javascript-for-intermediate': 'https://github.com/msk-javascript/intermediate',
    'javascript-for-advanced': 'https://github.com/msk-javascript/advance',
    'react-js-for-beginners': 'https://github.com/msk-react/beginner',
    'react-js-for-intermediate': 'https://github.com/msk-react/intermediate',
    'react-js-for-advanced': 'https://github.com/msk-react/advance',
    'power-bi-for-beginners': 'https://github.com/msk-powerbi/beginner',
    'power-bi-for-intermediate': 'https://github.com/msk-powerbi/intermediate',
    'power-bi-for-advanced': 'https://github.com/msk-powerbi/advance',
    'django-for-backend-development': 'https://github.com/msk-django/beginner',
    'rest-api-development-with-django': 'https://github.com/msk-django/intermediate',
    'ms-powerpoint-for-beginners': 'https://github.com/msk-powerpoint/beginner',
    'markdown': 'https://github.com/msk-markdown/beginner'
  };

  for (const tut of tutorials) {
    if (urlMap[tut.slug]) {
      tut.githubRepo = urlMap[tut.slug];
    }
  }

  fs.writeFileSync(tutPath, JSON.stringify(tutorials, null, 2), 'utf8');
  console.log('✅ public/data/tutorials.json updated successfully!');

  console.log('\n🎉 ALL 21 REPOSITORIES CREATED AND TUTORIALS DEPLOYED SUCCESSFULLY!');
}

main().catch(console.error);
