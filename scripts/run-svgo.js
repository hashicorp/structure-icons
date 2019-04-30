#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const SVGO = require('svgo');
const walkSync = require('walk-sync');

let icons = walkSync('icons', { globs: ['**/*.svg'] });
let css = walkSync('icons', { globs: ['**/*.css'] });
let svgo = new SVGO({
  plugins: [{
    removeViewBox: false,
  },{
    removeDimensions: true,
  }]
});

let readIcon = async(filePath) => {
  let icon = await fs.readFile(
    path.join(process.cwd(), 'icons', filePath)
  );
  return icon;
}

let writeFileToDist = async (filePath, fileData) => {
  let data = fileData || await readIcon(filePath);

  // make the dist and icons folder
  try {
    await fs.mkdir('dist/icons/', {recursive: true});
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  await fs.writeFile(
    path.join(process.cwd(), 'dist', filePath),
    data
  );
}

let processSVG = async (svgFile) => {
  let inputData = await readIcon(svgFile);
  let output = await svgo.optimize(inputData);
  await writeFileToDist(path.join('icons', svgFile), output.data);
}

css.forEach(async (cssFile) => {
  await writeFileToDist(cssFile);
});


icons.forEach(async (iconFile, i) => {
  await processSVG(iconFile);
});
