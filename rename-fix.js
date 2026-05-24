const fs = require('fs');
const glob = require('glob');

// First, rename files with double .css.css to single .css
const doubleCssFiles = glob.sync('**/*.css.css', { ignore: 'node_modules/**' });
doubleCssFiles.forEach(file => {
  const newPath = file.replace(/\.css\.css$/, '.css');
  fs.renameSync(file, newPath);
  console.log(`Renamed: ${file} -> ${newPath}`);
});

// Then update HTML to point to .css (without extra .css)
const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace any href ending with .css.css or .css?rnd... with .css
  content = content.replace(/\.css%3Frnd=98906\.css/g, '.css');
  content = content.replace(/\.css\.css/g, '.css');
  fs.writeFileSync(file, content);
  console.log(`Updated: ${file}`);
});
