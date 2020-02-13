#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const SVGO = require('svgo');
const del = require('del');
const walkSync = require('walk-sync');

let icons = walkSync('src', { globs: ['**/*.svg'] });
let css = walkSync('src', { globs: ['**/*.css'] });
let svgo = new SVGO({
  plugins: [
    {
      removeViewBox: false,
    },
    {
      removeDimensions: true,
    },
    {
      convertColors: {
        currentColor: 'black',
      },
    },
  ],
});
let svgs = [];

async function readIcon(filePath) {
  let icon = await fs.readFile(path.join(process.cwd(), 'src', filePath));
  return icon;
}

async function cleanDist() {
  await del('dist/**');
  await fs.mkdir('dist');
}

function dasherize(string) {
  return string
    .replace(/\s-\s/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

async function writeFileToDist(filePath, fileData) {
  let dest = path.join(process.cwd(), 'dist', dasherize(filePath));
  if (fileData) {
    await fs.writeFile(dest, fileData);
  } else {
    // we want to copy
    await fs.copyFile(path.join(process.cwd(), 'src', filePath), dest);
  }
}

async function processSVG(svgFile) {
  let inputData = await readIcon(svgFile);
  let output = await svgo.optimize(inputData);
  console.log(`${svgFile}: writing optimized SVG to dist as ${dasherize(svgFile)}`);
  // keep the string to write an HTML file with embbeded SVGs
  svgs.push({ name: dasherize(svgFile), svg: output.data });
  await writeFileToDist(svgFile, output.data);
}

function emojiMeter(emoji, len) {
  return new Array(len).fill(emoji).join('');
}

async function writeJS() {
  let list = icons.map(path => {
    // we want the filename w/o the extension
    return dasherize(path).replace(/\.svg$/, '');
  });

  console.log(`writing index.js with ${icons.length} SVG filenames`);
  await writeFileToDist('index.js', `export default ${JSON.stringify(list, null, 2)};`);
}

async function writeHTML() {
  let styleString = css
    .map(sheet => {
      return `<link href="./${sheet}" rel="stylesheet" />`;
    })
    .join('');
  let svgsString = svgs
    .map(icon => {
      return `<figure>${icon.svg}<figcaption>${icon.name}</figcaption></figure>`;
    })
    .join('');

  let doc = `
  <!DOCTYPE html>
  ${styleString}
  <style>
    body { display: grid; grid-template-columns: repeat(auto-fill, minmax(16em, 1fr)); grid-gap: 1em; }
    figure svg { height: 24px; width: 24px; }
  </style>
  ${svgsString}
  `;
  console.log('writing preview HTML to index.html');
  await writeFileToDist('index.html', doc);
  svgs = [];
}

async function main() {
  await cleanDist();
  await Promise.all([...css.map(f => writeFileToDist(f)), ...icons.map(processSVG)]);
  await writeHTML();
  await writeJS();
  console.log(`
    🚀 All finished! 
    Copied ${css.length} CSS files: ${emojiMeter('✨', css.length)}
    Processed ${icons.length} SVG files: ${emojiMeter('💅', icons.length)}
    Preview them by opening the dist/index.html file.
  `);
}

main();
