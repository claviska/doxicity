---
title: Plugins
description: Learn how to do amazing things with Doxicity's plugin system.
---

# {{title}}

Plugins are used to extend Doxicity's functionality. For your convenience, a number of useful first-party plugins come out of the box. You can enable as many or as few as you'd like.

## Activating Plugins

Plugins are imported and activated in your [config file](/config/) like this.

```js
// doxicity.config.js
import myPlugin from 'doxicity/dist/plugins.js';

export default {
  // ...
  plugins: [
    myPlugin({
      /* plugin options go here */
    })
  ]
};
```

Plugins are be executed in the same order they appear in the `plugins` array.

## First-party Plugins

The following plugins ship with the official Doxicity package. This project is still young, so for now please see the source of each plugin (linked below) to see which config options are available. Additional third-party plugins will soon be found on [npm](https://www.npmjs.com/search?q=doxicity).

- [`activeLinksPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/active-links/active-links.ts): Adds a custom class name to active links on the page.
- [`anchorHeadingsPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/anchor-headings/anchor-headings.ts): Turns headings into deep-linkable anchors with unique ids.
- [`beautifyPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/beautify/beautify.ts): Runs the resulting HTML through JS Beautify to improve formatting and indentation.
- [`copyCodePlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/copy-code/copy-code.ts): Adds a button to each code field that copies the code when clicked.
- [`customTitlePlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/custom-title/custom-title.ts): Adds a custom prefix and/or suffix to each page's `<title>`
- [`externalLinksPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/external-links/external-links.ts): Makes external links safe by adding `rel="noopener noreferrer"` and optionally opens them in a new window.
- [`highlightCodePlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/highlight-code/highlight-code.ts): Highlights code fields using Prism. All languages that Prism supports work by default. Highlighting is done at build time, so no JavaScript is shipped to the client.
- [`iconAddonPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/icon-addon/icon-addon.ts): Adds a custom icon to the icon addons container, e.g. links to GitHub, Twitter, etc. Supports both custom SVG icons and a handful of built-ins.
- [`searchPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/search/search.ts): Adds an accessible, full-text search client to your docs. Powered by [Lunr](https://lunrjs.com/).
- [`smoothLinksPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/smooth-links/smooth-links.ts): Makes in-page links scroll smoothly.
- [`tableOfContentsPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/table-of-contents/table-of-contents.ts): Generates a table of contents. You can select which headings are selected and where the TOC gets rendered. Can be used multiple times per page.
- [`tableScrollPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/table-scroll/table-scroll.ts): Adds a wrapper around table elements, allowing them to scroll horizontally as needed on smaller screens.
- [`typographyPlugin`](https://github.com/claviska/doxicity/blob/main/src/plugins/typography/typography.ts): Converts regular quotes to smart quotes and other common typographical symbols such as en dash, em dash, ellipsis, and more.

Example usage:

```js
// doxicity.config.js
import { activeLinks, anchorHeadings, highlightCode, search } from 'doxicity/dist/plugins.js';

export default {
  // ...
  plugins: [activeLinksPlugin(), anchorHeadingsPlugin(), highlightCodePlugin(), searchPlugin()]
};
```

## Writing Your Own Plugins

Many static site generators offer a ton of hooks for plugin authors to tap into. However, this usually results in confusion and unintended results. For example, how does each hook affect rendering? What if a plugin runs too soon or too late? What if it only applies to markdown content and not the rest of the HTML? With so many hooks, it's difficult to keep track of which plugins are doing what and when.

Doxicity simplies this by offering only a limited number of hooks and making it easy to mutate the entire page — not just the markdown content. At the heart of Doxicity's plugin API is the `transform` hook. It provides you with a `Document` object that you can mutate just like you would in a browser.

Here's a contrived example that prepends the text "Wow " to every paragraph of every page.

```js
const wowPlugin = {
  transform: doc => {
    doc.querySelectorAll('p').forEach(p => {
      p.innerHTML = 'Wow ' + p.innerHTML;
    });
  }
};

export default wowPlugin;
```

This may seem silly, but the important thing to note is that you have complete control over every page. You can change the template's structure, add or remove things from the DOM, mutate existing elements, and more.

:::tip
A good starting point for aspiring plugin authors is to look at [Doxicity's plugins folder](https://github.com/claviska/doxicity/tree/main/src/plugins) to see how some of the built-in plugins work.
:::

### Plugin Hooks

The following hooks are currently available to plugin authors.

| Name              | Description                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transform`       | Hooks into the DOM transform phase, allowing you to mutate the document object before it gets turned into HTML. Use this for all types of DOM manipulation.           |
| `afterTransform ` | Hooks into the raw HTML string after all rendering and transformations are complete. Use this for formatters.                                                         |
| `afterAll`        | Hooks into the pages after they've been rendered and after all transforms have completed. Use this when you need to do something after all pages have been processed. |

Every Doxicity plugin must adhere to the `DoxicityPlugin` interface. The interface is described in TypeScript, but you can write plugins in JavaScript as well. All hooks can be synchronous or asynchronous.

```ts
export interface DoxicityPlugin {
  transform?: (doc: Document, page: DoxicityPage, config: DoxicityConfig) => Document | Promise<Document>;
  afterTransform?: (html: string, page: DoxicityPage, config: DoxicityConfig) => string | Promise<string>;
  afterAll?: (pages: DoxicityPage[], config: DoxicityConfig) => void | Promise<void>;
}
```
