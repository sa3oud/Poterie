const fs = require('fs');
const path = require('path');
const glob = require('glob'); // npm install glob

// Recursively find all HTML files
const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove <base href="..."> tag (any variant)
  content = content.replace(/<base\s+href=["'][^"']*["']\s*\/?>/gi, '');

  // 2. Fix relative paths for src, href, url(...)
  //    Replace relative paths like "../../core/..." with "/Poterie/core/..."
  //    This regex catches src="...", href="...", and url("...") in style attributes.
  content = content.replace(/(?:src|href)\s*=\s*["'](\.\.\/)+/g, (match) => {
    return match.replace(/\.\.\//g, ''); // remove all "../"
  });
  // Then prepend "/Poterie/" to those that start with core/ or sites/ or modules/
  content = content.replace(/((?:src|href)\s*=\s*["'])(core\/|sites\/|modules\/)/g, `$1/Poterie/$2`);
  content = content.replace(/url\(["']?(\.\.\/)+/g, (match) => {
    return match.replace(/\.\.\//g, '');
  });
  content = content.replace(/url\(["']?(core\/|sites\/|modules\/)/g, `url(/Poterie/$1`);

  // 3. If your CSS files are referenced with absolute paths like "/core/..." but missing "/Poterie",
  //    add the missing prefix.
  content = content.replace(/(?:src|href)\s*=\s*["']\/(core\/|sites\/|modules\/)/g, `$1/Poterie/$2`);

  fs.writeFileSync(file, content);
  console.log(`Fixed: ${file}`);
});
