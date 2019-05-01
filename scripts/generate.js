#!/usr/bin/env node

const fs = require('fs').promises;
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
let svgs = [];

let readIcon = async filePath => {
  let icon = await fs.readFile(path.join(process.cwd(), 'src', filePath));
  return icon;
};

let cleanDist = async () => {
  await fs.rmdir('dist');
  await fs.mkdir('dist');
};

let writeFileToDist = async (filePath, fileData) => {
  let data = fileData || (await readIcon(filePath));
  await fs.writeFile(path.join(process.cwd(), 'dist', filePath), data);
};

let processSVG = async svgFile => {
  let inputData = await readIcon(svgFile);
  console.log(`${svgFile}: optimizing SVG file`);
  let output = await svgo.optimize(inputData);
  console.log(`${svgFile}: writing optimized SVG to dist`);
  // keep the string to write an HTML file with embbeded SVGs
  svgs.push({name: svgFile, svg: output.data});
  await writeFileToDist(svgFile, output.data);
};

let emojiMeter = (emoji, len) => {
  return new Array(len).fill(emoji).join('');
};


let writeJS = async () => {
  let list= icons.map(path => {
    // we want the filename w/o the extension
    return path.replace(/\.svg$/, '');
  });

  console.log(`writing index.js with ${icons.length} SVG filenames`);
  await writeFileToDist('index.js', `export default ${JSON.stringify(list, null, 2)};`);
};

let writeHTML = async () => {
  let svgsString = svgs.map(icon => {
    return `<figure>${icon.svg}<figcaption>${icon.name}</figcaption><figure>`;
  }).join('');

  let doc = `
  <DOCTYPE html>
  <head>
  <style>
  </style>
  </head>
  ${svgString}
  `;
  await writeFileToDist('index.html', doc);
  svgs = [];
};

async function main() {
  await cleanDist();
  await Promise.all([...css.map(writeFileToDist), ...icons.map(processSVG)]);
  await writeHTML();
  await writeJS();
  console.log(`
    🚀 All finished! 
    Copied ${css.length} CSS files: ${emojiMeter('✨', css.length)}
    Processed ${icons.length} SVG files: ${emojiMeter('💅', icons.length)}
    Preview them by openting the dist/index.html file.
    `);
}

main();
