const fs = require('fs');
const path = require('path');

const candidates = [
  'html5-complete-masterclass',
  'javascript-react-frontend-engineering',
  'ccc-computer-concepts',
  'master-computer-coding-diploma',
  'html-complete-course',
  'python-programming-masterclass',
  'full-stack-web-development-bootcamp',
  'html5-css3-modern-ui-design',
  'ccc-course-on-computer-concepts',
  'adca-advanced-diploma-computer-applications',
  'full-stack-web-development'
];

function searchFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(item)) searchFiles(p);
    } else if (/\.(json|md|tsx|ts)$/.test(item)) {
      const txt = fs.readFileSync(p, 'utf8');
      candidates.forEach(cand => {
        if (txt.includes(cand)) {
          console.log(`Found "${cand}" in: ${p}`);
        }
      });
    }
  }
}

searchFiles(path.join(__dirname, '../content'));
searchFiles(path.join(__dirname, '../public/data'));
searchFiles(path.join(__dirname, '../src'));
