const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to rename files to remove "?rnd=98906"
const filesToRename = glob.sync('**/*.css?rnd=98906.css', {
  ignore: 'node_modules/**',
});
filesToRename.forEach(file => {
  const newPath = file.replace(/\?rnd=98906\.css$/, '.css');
  fs.renameSync(file, newPath);
  console.log(`Renamed: ${file} -> ${newPath}`);
});

// Function to update paths in HTML files
const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.css%3Frnd=98906\.css/g, '.css');
  fs.writeFileSync(file, content);
  console.log(`Updated paths in: ${file}`);
});
