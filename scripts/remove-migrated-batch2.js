const fs = require('fs');
const path = require('path');

const batch2Dirs = [
  'java-for-beginners',
  'java-for-intermediate',
  'java-for-advanced',
  'javascript-for-beginners',
  'javascript-for-intermediate',
  'javascript-for-advanced',
  'react-js-for-beginners',
  'react-js-for-intermediate',
  'react-js-for-advanced',
  'power-bi-for-beginners',
  'power-bi-for-intermediate',
  'power-bi-for-advanced',
  'django-for-backend-development',
  'rest-api-development-with-django',
  'ms-powerpoint-for-beginners',
  'markdown'
];

const baseDir = path.join(__dirname, '..', 'public', 'content', 'tutorials');
let deletedCount = 0;

for (const dirName of batch2Dirs) {
  const fullPath = path.join(baseDir, dirName);
  if (!fs.existsSync(fullPath)) continue;

  function removeMds(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(currentPath, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'images') {
          removeMds(p);
          try {
            const rem = fs.readdirSync(p);
            if (rem.length === 0) fs.rmdirSync(p);
          } catch (err) {}
        }
      } else if (e.isFile() && e.name.endsWith('.md')) {
        fs.unlinkSync(p);
        deletedCount++;
      }
    }
  }

  removeMds(fullPath);

  // If directory is now completely empty, remove it
  try {
    const remaining = fs.readdirSync(fullPath);
    if (remaining.length === 0) {
      fs.rmdirSync(fullPath);
      console.log(`🗑️ Removed empty folder: ${dirName}`);
    } else {
      console.log(`ℹ️ Preserved folder with assets: ${dirName} (${remaining.join(', ')})`);
    }
  } catch (err) {}
}

console.log(`\n🎉 Successfully deleted ${deletedCount} local markdown files across Batch 2 tutorials!`);
