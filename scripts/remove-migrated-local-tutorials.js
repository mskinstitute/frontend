const fs = require('fs');
const path = require('path');

const migratedTutorials = [
  'python-for-beginners',
  'python-for-intermediate',
  'python-for-advanced',
  'html5-complete-course',
  'css-for-beginners',
  'css-for-intermediate',
  'css-for-advanced',
  'ms-word-for-beginners',
  'ms-word-for-advanced',
  'ms-excel-for-beginners',
  'ms-excel-for-intermediate',
  'ms-excel-for-advanced'
];

let removedFiles = 0;
let removedDirs = 0;
let preservedImages = 0;

for (const slug of migratedTutorials) {
  const dirPath = path.join(__dirname, '..', 'public', 'content', 'tutorials', slug);
  if (!fs.existsSync(dirPath)) continue;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.name === 'images') {
      preservedImages++;
      continue;
    }

    if (entry.isFile()) {
      if (entry.name.endsWith('.md')) {
        fs.unlinkSync(fullPath);
        removedFiles++;
      }
    } else if (entry.isDirectory()) {
      // Remove all markdown files in subfolder
      const subEntries = fs.readdirSync(fullPath);
      for (const f of subEntries) {
        if (f.endsWith('.md')) {
          fs.unlinkSync(path.join(fullPath, f));
          removedFiles++;
        }
      }
      // If folder is now empty, remove directory
      const remaining = fs.readdirSync(fullPath);
      if (remaining.length === 0) {
        fs.rmdirSync(fullPath);
        removedDirs++;
      }
    }
  }
}

console.log(`✅ Cleanup Complete:`);
console.log(`   - Removed ${removedFiles} local markdown files`);
console.log(`   - Removed ${removedDirs} empty chapter folders`);
console.log(`   - Preserved all ${preservedImages} images/ directories for visual diagrams`);
