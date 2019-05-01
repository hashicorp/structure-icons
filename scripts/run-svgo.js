#!/usr/bin/env node

const FS = require('fs');
const fs = FS.promises;
const path = require('path');
const SVGO = require('svgo');
const walkSync = require('walk-sync');

let icons = walkSync('icons', { globs: ['**/*.svg'] });
let css = walkSync('icons', { globs: ['**/*.css'] });
let svgo = new SVGO({
  plugins: [
    {
      removeViewBox: false,
    },
    {
      removeDimensions: true,
    },
  ],
});

let readIcon = async filePath => {
  let icon = await fs.readFile(path.join(process.cwd(), 'icons', filePath));
  return icon;
};

let writeFileToDist = async (filePath, fileData) => {
  let data = fileData || (await readIcon(filePath));
  if (!FS.existsSync('dist/icons')) {
    await fs.mkdir('dist/icons', { recursive: true });
  }
  await fs.writeFile(path.join(process.cwd(), 'dist', filePath), data);
};

let processSVG = async svgFile => {
  let inputData = await readIcon(svgFile);
  console.log(`optimizing SVG file: ${svgFile}`);
  let output = await svgo.optimize(inputData);
  console.log(`writing optimized SVG to dist: ${svgFile}`);
  await writeFileToDist(path.join('icons', svgFile), output.data);
};

async function main() {
  await Promise.all([...css.map(writeFileToDist), ...icons.map(processSVG)]);

  console.log(
    `🚀 All Finished! copied ${css.length} CSS files and processed ${icons.length} SVG files 💅💅💅.`
  );
}

main();
