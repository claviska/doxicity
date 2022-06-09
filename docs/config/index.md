---
title: Configuration
description: Unlock additional features by adding a configuration file.
---

# {{title}}

A config file lets you customize assets, data, plugins, and every other aspect of how Doxicity works. Configuration is optional, but strongly recommended to take full advantage of Doxicity's features.

## Sample Config

You can configure your Doxicity site by adding a file called `doxicity.config.js` to your project's root directory. Doxicity expects your config file to be an ES Module. If your project is not [configured to be a module](https://nodejs.org/api/packages.html#modules-packages), you can name your configuration file `doxicity.config.mjs` to avoid NodeJS errors.  You can use this template as a starting point.

```js
// doxicity.config.js
export default {
  assetFolderName: 'assets',
  cleanOnPublish: true,
  copyAssets: ['assets/**/*'],
  data: {},
  dev: true,
  helpers: [],
  inputDir: '.',
  outputDir: '_docs',
  plugins: [],
  primaryColor: 'green'
};
```

:::tip
Doxicity ships with many [first-party plugins](/config/plugins.html) for things like code highlighting, search, and more. Check out the [config file for this website](https://github.com/claviska/doxicity/blob/main/docs/doxicity.config.js) to see how they're activated and configured.
:::

## All Configuration Options

The following options are available in your config.

| Name              | Type               | Description                                                                                                                                                                                                                                       |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| `assetFolderName` | `string`           | The name of the folder to copy assets to. This should not be a full path, only a folder name. Defaults to `"assets"`.                                                                                                                               |
| `cleanOnPublish`  | `boolean`          | Cleans the outputDir before publishing. Defaults to `true`.                                                                                                                                                                                         |
| `copyAssets`      | `string[]`         | An array of files to copy to the published assets folder. Supports globs. All directories must be relative to your project's root folder. If unset, Doxicity will look for a folder called "assets" in your root folder and copy it if it exists. |
| `data`            | `object`           | Global "config data" to be passed to every page.                                                                                                                                                                                                  |
| `dev`             | `boolean`          | Set to true when working in dev mode. This prevents templates from being cached and makes publishing less efficient, but it improves the developer experience.                                                                                    |
| `helpers`         | `DoxicityHelper[]` | Custom Handlebars helpers to register for use in templates.                                                                                                                                                                                       |
| `inputDir`        | `string`           | The source directory containing your markdown files.                                                                                                                                                                                              |
| `outputDir`       | `string`           | The directory to write processed files.                                                                                                                                                                                                           |
| `plugins`         | `DoxicityPlugin[]` | Optional plugins that hook into the Doxicity API and gives you superpowers.                                                                                                                                                                       |
| `themeFolderName` | `string`           | The name of the folder to copy theme files to. This should not be a full path, only a folder name. Defaults to `"theme"`. |
