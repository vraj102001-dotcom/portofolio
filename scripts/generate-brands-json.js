// Regenerates data/brands.json from whatever image files are sitting in
// assets/img/brands/. Run this after adding or removing logo files:
//
//   node scripts/generate-brands-json.js
//
const fs = require('fs');
const path = require('path');

const brandsDir = path.join(__dirname, '..', 'assets', 'img', 'brands');
const outFile = path.join(__dirname, '..', 'data', 'brands.json');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);

const logos = fs
  .readdirSync(brandsDir)
  .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

fs.writeFileSync(outFile, JSON.stringify({ logos }, null, 2) + '\n');

console.log(`Wrote ${logos.length} logo(s) to data/brands.json`);
