---
title: Quick Start
description: Get started with Doxicity in no time at all.
---

# {{title}}

Doxicity is a <abbr title="Command Line Interface">CLI</abbr> that removes the friction of creating an accessible documentation website and lets you focus on writing useful content. With zero configuration, simple markdown files are transformed into beautiful webpages. Additional features can be unlocked by adding a [config file](/config/index.html) with [plugins](/config/plugins.html), [helpers](/config/helpers.html), and more.

## Your First Project

Every page is a markdown file. For every markdown file in your project's directory, Doxicity will publish a corresponding HTML file of the same name in the `_docs` directory. To add a new page, simply create a new markdown file.

Let's start a new project by navigating to a fresh directory and entering the following commands:

```bash
echo '# Welcome to Doxicity' > index.md
npx doxicity --serve
```

This will create a single markdown filed called `index.md` and publish it to `_docs/index.html`. It will then launch a development server so you can preview your work as you edit. Go ahead and make some changes to `index.md` and watch the browser instantly update. ✨

## Adding a Config

You may have noticed your docs aren't as full featured as the docs you're reading right now. That's because many of Doxicity's best features are unlocked by adding a config file! This is how you can unlock plugins, helpers, and more.

Create a file called `doxicity.config.js` in the root of your project's directory. We'll import a couple first-party plugins to add code highlighting and search. We'll also add some [config data](/config/data.html) that we'll use a bit later.

```js
import { highlightCodePlugin, searchPlugin } from 'doxicity/dist/plugins.js';

export default {
  plugins: [highlightCodePlugin(), searchPlugin()],
  data: {
    title: 'My Awesome Docs',
    description: 'Proudly built with Doxicity.'
  }
};
```

Since we updated our config, Doxicity will tell us the dev server needs to be restarted. You can terminate the process by pressing [[CTRL]] [[C]] and restarting it with the following command. (I plan on making config changes update without a restart in the future.)

```bash
npx doxicity --serve
```

Congratulations, you've added a search and syntax highlighting for code blocks! But we haven't done anything with that `data` property yet...

## Using Data

Let's update `index.md` so it renders some of the data we added to our config. In Doxicity, this is done using [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html#expressions).

```md
# \{{title}}

\{{description}}
```

When you save your changes, the dev server will reload and you'll see the data from your config on the page! Let's take this a step further and provide some additional data using front matter. Update `index.md` to look like this.

```md
---
title: My Awesome Page
---

# \{{title}}

\{{description}}
```

Notice how the title changed from "My Awesome Docs" to "My Awesome Page"? That's because page data gets merged with your config data, allowing you to supplement and/or override it as needed.

Now let's add an array of items and loop through them — right in our markdown! Update `index.md` to look like this.

```md
---
title: My Awesome Page
animals:
  - Birds
  - Cats
  - Dogs
---

# \{{title}}

\{{#each animals}}
  \{{this}}<br>
\{{/each}}
```

Now save it and you'll see all the animals in the list appear on the page!

:::tip
You may be thinking, "this doesn't really look like markdown anymore!" Remember that this example is showing you what you _can_ do with Doxicity, but it's all optional. You can start with basic markdown and only add variables and logic when you find them useful.
:::

## Including Content

The last thing we'll do is add a file that can be included in any page. These are called [partials](/config/partials.html), and they're defined declaratively by creating a markdown file starting with an underscore.

Go ahead and create `_amazing.md` and add the following content to it.

```md
## Amazing

This content is coming from `_amazing.md`.
```

Now we can include it in `index.md` using a partial expression. Note that the underscore and the file extension are removed from the expression.

```md
---
title: My Awesome Page
animals:
  - Birds
  - Cats
  - Dogs
---

# \{{title}}

\{{#each animals}}
  \{{this}}<br>
\{{/each}}

\{{>amazing}}
```

As you can see, Doxicity starts off simple but quickly ramps up to handle complex data and tasks. It's a very powerful tool for documentation with a low barrier of entry and endless possibilities.

Ready to dive in deeper? Check out the [configuration page](/config/index.html) next.