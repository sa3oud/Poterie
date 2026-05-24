const fs = require('fs');
const glob = require('glob');

const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove <base> tag
  content = content.replace(/<base\s+href=["'][^"']*["']\s*\/?>/gi, '');

  // 2. Add /Poterie/ to any src/href that points to a local asset
  //    Match src="/storage/...", href="/core/...", etc.
  content = content.replace(/((?:src|href)\s*=\s*["'])\/(?!https?:|www\.|data:|\/\/)([^"']+)/g, (match, p1, p2) => {
    // If the path already starts with /Poterie/, leave it
    if (p2.startsWith('Poterie/')) return match;
    return `${p1}/Poterie/${p2}`;
  });

  // 3. Fix url(...) in inline styles (e.g., background-image)
  content = content.replace(/url\(["']?\/(?!https?:|www\.|data:|\/\/)([^"')]+)["']?\)/g, (match, p1) => {
    if (p1.startsWith('Poterie/')) return match;
    return `url("/Poterie/${p1}")`;
  });

  // 4. Also fix paths that are relative without leading slash (e.g., "storage/...")
  //    but only if they are not already absolute or external
  content = content.replace(/((?:src|href)\s*=\s*["'])(?!https?:|www\.|data:|\/\/|\/Poterie\/)([^"']+)/g, (match, p1, p2) => {
    // Skip if it's an anchor # or javascript:
    if (p2.startsWith('#') || p2.startsWith('javascript:')) return match;
    return `${p1}/Poterie/${p2}`;
  });

  fs.writeFileSync(file, content);
  console.log(`✅ Fixed: ${file}`);
});
