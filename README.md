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

### ember-svg-jar
After installation, add the following to your `ember-cli-build.js`:

```
var app = new EmberApp({
  svgJar: {
    // Icons have already been optimized via SVGO,
    // so we don't need to optimize them again.
    optimize: false,

    paths: [
      'path/to/node_modules/@hashicorp/structure-icons/dist',
      // ... additional paths
    ]
  }
});
```

## Updating icons
For each release of Structure, we should update the icons in this library:

1. Go to the [Icon System page in Figma](https://www.figma.com/file/B7yd8loYS7nA2TiQcJ8UtV/Structure-1.9?node-id=0%3A64). _Note:_ This link might be out of date, so check with someone in Design if you're not sure.
1. Highlight all of the icons under the "Icons" and "Logos" headers to the right of the sticker sheet
1. Use the right panel to export the icons in SVG format to the `/src` folder in this repo (if you delete any files from `/src`, be careful not to delete the "run" or "loading" SVG files or their CSS).
1. Run `npm run generate`
1. Review `/dist/index.html` to make sure your updates were added correctly
1. Commit your changes and follow the "New releases" instructions below

## New releases

### Prerequisites

In order to publish packages, you must:

1. Be added to the HashiCorp organization on `npm`
2. [Enable 2-factor authentication](https://docs.npmjs.com/configuring-two-factor-authentication) on your npm account
3. Log into to `npm` in your CLI with [`npm login`](https://docs.npmjs.com/cli/adduser)

### Publishing

To release a new version of `@hashicorp/structure-icons` you should:

1. ensure the `src` folder contains all of the CSS and SVG files you want to publish
1. bump version number in the package.json
1. commit & merge changes after review
1. run `npm publish` - this will run the `prepublishOnly` hook which will
   re-generate all of the optimized SVGs from the src folder and copy them to a
   `dist` folder.
