#!/usr/bin/env node

const walkSync = require('walk-sync');
const path = require('path');
const fs = require('fs').promises;

let icons = walkSync('icons', { globs: ['**/*.svg'] });


icons = icons.map(path => {
  // we want the relative path w/o the extension
  return `${path.replace(/\.svg$/, '')}`;
});


let writeFileToDist = async (filePath, fileData) => {
  let data = fileData || await readIcon(filePath);

  // make the dist folder
  try {
    await fs.mkdir('dist');
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  await fs.writeFile(
    path.join(process.cwd(), 'dist', filePath),
    data
  );
}

writeFileToDist('index.js', `export default ${JSON.stringify(icons, null, 2)};`);

