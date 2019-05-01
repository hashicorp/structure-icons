#!/usr/bin/env node

const FS = require('fs');
const fs = FS.promises;
const path = require('path');
const walkSync = require('walk-sync');

let icons = walkSync('icons', { globs: ['**/*.svg'] });

icons = icons.map(path => {
  // we want the filename w/o the extension
  return path.replace(/\.svg$/, '');
});

let writeFileToDist = async (filePath, fileData) => {
  if (!FS.existsSync('dist')) {
    await fs.mkdir('dist');
  }
  await fs.writeFile(path.join(process.cwd(), 'dist', filePath), fileData);
};

console.log(`writing index.js with ${icons.length} SVG filenames`);
writeFileToDist('index.js', `export default ${JSON.stringify(icons, null, 2)};`);
