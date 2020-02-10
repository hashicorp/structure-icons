# structure-icons
Icons for the HashiCorp Structure design system.

## Installation
`npm i @hashicorp/structure-icons` or `yarn add @hashicorp/structure-icons`
depending on your flavor of package management.

## Versioning
The versions of this package are meant to track releases of Structure as closely
as possible.

## Usage in your application
Generally speaking, you install the package and then SVG files will be located
at `@hashicorp/structure-icons/dist/name-of-icon.svg`. If you need a list of
icons, one is available for import at `@hashicorp/structure-icons/dist/index.js`.

### ember-inline-svg
After installation, add the following to your `ember-cli-build.js`: 

```
var app = new EmberApp({
  svg: {
    // structure icons have already been through svgo so no reason to run again
    optimize: false,
    paths: [
      ... other paths here...,
      'node_modules/@hashicorp/structure-icons/dist'
    ]
  }
});
```

## Updating icons
For each release of Structure, we should update the icons in this library:

1. Go to the [Icon System page in Figma](https://www.figma.com/file/jCdDbni26PXXf4lJtTvh6G/Structure-1.x?node-id=0%3A64), highlight all of the icons under the "Icons" and "Logos" headers to the right of the sticker sheet and export them
1. Rename the files: Replace ` - ` with `-`, replace ` ` with `-`, convert all uppercase letters to lowercasex
1. Move the files into the `/src` directory of this repo
1. Commit the new files and/or follow the "New releases" instructions below

## New releases
To release a new version of `@hashicorp/structure-icons` you should:

1. ensure the `src` folder contains all of the CSS and SVG files you want to publish
1. bump version number in the package.json
1. run `npm publish` - this will run the `prepublishOnly` hook which will
   re-generate all of the optimized SVGs from the src folder and copy them to a
   `dist` folder.
1. commit & push changes
