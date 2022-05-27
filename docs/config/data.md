---
title: Data
description: Add data to your pages and do more with Doxicity.
---

# {{title}}

You can add custom data to Doxicity. The data you provide will be made available to all pages through the use of [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html) in your markdown.

## Providing Data

Two types of data can be provided. The first type is [config data](#config-data), which is globally available to all pages. The second type is [page data](#page-data), which is only available on the page it's provided on.

### Config Data

As its name implies, config data is provided through your [config file](/concepts/index.html). You have complete control over the data you provide here. However, with great power comes great responsibility. It's up to you to structure your data in a way that scales with your documentation.

You can set custom data in your config file using the `data` property. The object is flexible enough to hold any type of value, including arrays and objects.

```js
// doxicity.config.js
export default {
  // ...
  data: {
    name: 'Bob Marley',
    occupation: 'Entertainer',
    songs: [
      /* ... */
    ]
  }
};
```

:::tip
You can gather data asynchronously using [top-level `await`](https://v8.dev/features/top-level-await). This requires Node.js 14.8 or higher.
:::

### Page Data

In addition to config data, page data can be provided by prepending [front matter](https://github.com/jxson/front-matter#example) to your markdown files. An important thing to consider is that config data and page data will be merged before each page is rendered. This is by design, so you can supplement and/or override config data on a per-page basis.

Front matter is an elegant format that uses [YAML](https://yaml.org/) to provide data within a markdown file. If that sounds complicated, perhaps an example will clear things up.

```md
---
title: Hello, world!
description: Just a page to demonstrate front matter.
items:
  - Item 1
  - Item 2
  - Item 3
---

# Your content begins here
```

This is equivalent to the following JavaScript object:

```js
const data = {
  title: 'Hello, world!',
  description: 'Just a page to demonstrate front matter.',
  items: ['Item 1', 'Item 2', 'Item 3']
};
```

:::warning
Note that [partials](/concepts/partials.html) cannot contain their own front matter. Partials are executed in the context of the page that's including them, so they have access to config data and page data.
:::

## Metadata

Doxicity uses the `data.meta` property to configure the default theme. While it's perfectly acceptable to configure the following properties, avoid adding your own to the `data.meta` object.

| Name             | Type     | Description                                                                                                                                      |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`          | `string` | The default title of your documentation website.                                                                                                 |
| `description`    | `string` | The default description of your documentation website, primarily used for sharing.                                                               |
| `image`          | `string` | The image to provide to OpenGraph clients. Used primarily when sharing links on third-party websites.                                            |
| `favicon`        | `string` | The favicon to show in browsers and bookmarks.                                                                                                   |
| `logo`           | `string` | The logo to use in light mode.                                                                                                                   |
| `logoDark`       | `string` | Optional logo to use in dark mode.                                                                                                               |
| `sidebar`        | `string` | Determines if the sidebar should show. You can target individual pages by setting `meta.sidebar` to false in your front matter. Default is true. |
| `twitterCreator` | `string` | The Twitter username to provide when sharing on Twitter and supportive platforms.                                                                |

:::details Example using a config file
Here's how metadata can be configured in a config file.

```js
// doxicity.config.js
export default {
  // ...
  data: {
    meta: {
      logo: '/assets/logo.svg',
      title: 'My Doxicity Site',
      description: 'Proudly built with Doxicity.',
      favicon: '/assets/favicon.svg'
    }
  },
};
```
:::

:::details Example using front matter
Here's how metadata can be overwritten in front matter.

```md
---
meta:
  logo: /assets/logo.svg
  title: My Doxicity Site
  description: Proudly built with Doxicity.
  favicon: /assets/favicon.svg
---
```
:::

## Special Properties

Avoid using property names that begin with `$`, as these are reserved for Doxicity. The following special properties are available.

| Name              | Type     | Description                                                                                                                                      |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$url`            | `string` | The URL to the current page, determined by concatenating the base URL from `config.url` with the current page's pathname.                        |
| `$pathname`       | `string` | The current page's pathname, e.g. `/index.html`                                                                                                  |

## Consuming Data

As mentioned earlier, [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html) are used to consume data in your pages. You can output selected data, selectively render content using conditionals, loop through arrays and objects, and even pass data to [partials](/concepts/partials.html).

Let's assume we have the following data.

```js
const data = {
  occupation: 'Zoologist',
  animals: [
    { name: 'Cat', size: 'small' },
    { name: 'Mouse', size: 'really small' },
    { name: 'Elephant', size: 'giant' }
  ]
};
```

Now let's consider the following Handlebars expressions in this contrived markdown file.

```md
---
name: Zoe Zookeeper
occupation: Zoologist
isEmployed: true
animals:
  - name: Cat
    size: small
  - name: Mouse
    size: tiny
  - name: Elephant
    size: gigantic
---

My name is \{{name}} and I'm a \{{occupation}}.

\{{#if isEmployed}}
  I am currently employed!
\{{else}}
  I am currently unemployed and open to new opportunities!
\{{/if}}

My favorite animals are:

\{{#each animals}}
- \{{this.name}} which is a \{{this.size}} creature
\{{/each}}
```

The resulting HTML will be:

```html
<p>My name is Zoey Zookeeper and I am a Zoologist.</p>
<p>I am currently employed!</p>
<p>My favorite animals are:</p>
<ul>
  <li>Cat which is a small creature</li>
  <li>Mouse which is a tiny creature</li>
  <li>Elephant which is a gigantic creature</li>
</ul>
```
