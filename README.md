# Doxicity 📗

Doxicity turns a directory of markdown files into a robust, accessible documentation website. You can configure it, add plugins, and use Handlebars expressions to do amazing things.

It's fast, free, and flexible.

Designed in New Hampshire by [Cory LaViska](https://twitter.com/claviska).

🚨 Doxicity is very young and still experimental, so there may be breaking changes as the project evolves. Please ask questions on the [discussion board](https://github.com/claviska/doxicity/discussions) and post bugs to the [issue tracker](https://github.com/claviska/doxicity/issues).

---

## Overview

Doxicity is simple tool focused on producing easy-to-write, easy-to-read documentation that ships as a static website. It's opinionated, yet wildly flexible. At its core is a static site generator (SSG) that reads markdown files and renders them into a default template.

Just create a markdown file and run the CLI:

```sh
echo "# This is amazing\n\nYour content goes here." > index.md
doxicity
```

By default, your documentation site will be output in a folder called `docs`.

## Configuration

You can configure your Doxicity site by adding a file called `doxicity.config.js` to the root directory of your project. Available options are shown below.

```js
export default {
  inputDir: '.',
  outputDir: 'docs',
  helpers: [],
  copyAssets: ['assets/**/*'],
  dev: true,
  plugins: [],
  data: {}
};
```

:::tip
TypeScript users can import the `DoxicityConfig` type to get a strongly typed config.
:::

## CLI

To run the CLI, install the `doxicity` package globally and run `doxicity` in the target directory.

```sh
npm i -g doxicity
doxicity
```

This will publish the site at the current directory and exit.

The CLI accepts a few optional arguments:

- `--dir`: By default, Doxicity will use the current directory as the input directory. Use this flag to set it to a different directory.
- `--serve`: Publishes your docs and launches a browser that shows your changes as you work. When using this option, the `--watch` flag will be set automatically.
- `--watch`: Publishes your docs and watches files for changes.

## Templates

Due to its elegant syntax and fast rendering, Doxicity uses [Handlebars](https://handlebarsjs.com/) for rendering templates. Importantly, you can use Handlebars within your markdown files to render template data, helpers, and even custom partials. This unlocks a ton of functionality that you can bake right into your markdown files.

Here's an example that sets an `animals` array in front matter, then renders each item in a list.

```md
---
animals:
  - Birds
  - Cats
  - Dogs
---

<ul>
  {{#each animals}}
    <li>{{this}}</li>
  {{/each}}
</ul>
```

This will render:

```html
<ul>
  <li>Birds</li>
  <li>Cats</li>
  <li>Dogs</li>
</ul>
```

Learn more about [Handlebars built-in helpers](https://handlebarsjs.com/guide/builtin-helpers.html).

### Template Data

Template data can be set in your config using the `data` property. Data is "global" and will be made available to all pages. Additionally, your markdown files can contain front matter. The data in your front matter will be merged with the data from your config. You can access this data in your custom templates and your markdown files using Handlebars syntax such as `{{fieldName}}`. You can use helpers to loop through arrays and objects, e.g. `{{#each person}} {{this.name}} {{/each}}`.

TODO: add example
TODO: define reserved fields

### Helpers

You can use any of [Handlebar's built-in helpers](https://handlebarsjs.com/guide/builtin-helpers.html) in your templates or markdown files. Additionally, you can register your own custom helpers in your config.

TODO: add examples

### Partials

You can register custom [partials](https://handlebarsjs.com/guide/partials.html#basic-partials) to use in your templates.

TODO: add examples

## Plugins

Doxicity's plugin API is simple but robust. Rather than hooking into a multitude of confusing lifecycle events, most plugins can operate using a subset of the following hooks:

TODO: add examples

- `transform`: Runs after markdown and Handlebars have been rendered, but before the page is serialized. The hook receives a `Document` object, a `DoxicityPage` object, and a `DoxicityConfig` object. You can mutate the `Document` object with standard DOM methods (e.g. `document.querySelector()`, `el.setAttribute()`, etc.) to change how the HTML is output. Transform plugins must return the `Document` object so it can be passed to the next plugin.
- `afterTransform`: Runs after all transforms have completed. The hook receives a raw HTML string, a `DoxicityPage` object, and a `DoxicityConfig` object. It must return a string containing HTML that will be passed to the next plugin.
- `afterAll`: Runs after all rendering and transformations have completed. The hook receives an array of `DoxicityPage` objects that have been published and a `DoxicityConfig` object. No return value is expected.

Note that plugins can be synchronous or asynchronous as desired.

### First-party Plugins

Doxicity's core only handles rendering and publishing files. This is useful, but a handful of first-party plugins unlock so much more.

- `anchor-headings`: Turns headings into deep-linkable anchors with unique ids
- `beautify`: Runs the resulting HTML through JS Beautify to improve formatting and indentation
- `copy-code`: Adds a button to each code field that copies the code when clicked
- `external-links`: Makes external links safe by adding `rel="noopener noreferrer"` and optionally opens them in a new window
- `highlight-code`: Highlights code fields using Prism. All languages that Prism supports work by default. Highlighting is done at build time, so no JavaScript is shipped to the client.
- `search`: (IN PROGRESS) Generates a Lunr search index and adds a search UI to your site.
- `smooth-link`: Makes in-page links scroll smoothly instead of jumping.
- `table-of-contents`: A customizable plugin that generates a table of contents. You can select which headings are selected and where the TOC gets rendered.
