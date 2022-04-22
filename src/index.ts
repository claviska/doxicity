#!/usr/bin/env node

import { existsSync } from 'fs';
import path from 'path';
import process from 'process';
import { URL } from 'url'; // in Browser, the URL in native accessible on window
import browserSync from 'browser-sync';
import chalk from 'chalk';
import chokidar from 'chokidar';
import commandLineArgs from 'command-line-args';
import merge from 'deepmerge';
import getPort, { portNumbers } from 'get-port';
import { AfterTransformPluginError, TransformPluginError, TemplateRenderError } from './utilities/errors.js';
import { isMarkdownFile } from './utilities/file.js';
import { clean, copyAssets, copyTheme, publish } from './utilities/publish.js';
import type { DoxicityConfig } from './utilities/types';

const bs = browserSync.create();
const currentDir = new URL('.', import.meta.url).pathname;
let targetDirectory = process.cwd();
let config: DoxicityConfig;

interface CommandLineOptions {
  dir: string;
  serve: boolean;
  watch: boolean;
}

export const defaultConfig: DoxicityConfig = {
  assetFolderName: 'assets',
  cleanOnPublish: true,
  copyAssets: ['assets/**/*'],
  data: {},
  helpers: [],
  inputDir: '.',
  outputDir: '_site',
  partials: [],
  plugins: [],
  themeDir: path.join(currentDir, '../themes/default'),
  themeFolderName: 'theme'
};

// Fetch command line options
let options: CommandLineOptions;

try {
  options = {
    dir: targetDirectory,
    serve: false,
    watch: false,
    ...(commandLineArgs([
      { name: 'dir', alias: 'd', type: String },
      { name: 'serve', alias: 's', type: Boolean },
      { name: 'watch', alias: 'w', type: Boolean }
    ]) as Partial<CommandLineOptions>)
  };
} catch (err) {
  console.error(chalk.red((err as Error).message));
  process.exit(1);
}

// When using --serve, watch mode must be enabled
if (options.serve) {
  options.watch = true;
}

// Switch to the target directory
if (options.dir) {
  try {
    targetDirectory = path.resolve(options.dir);
    process.chdir(targetDirectory);
  } catch (err) {
    console.error(chalk.red(`Invalid target directory: "${options.dir}"`));
    process.exit(2);
  }
}

// Load the user's config
const userConfigFilename = path.join(targetDirectory, 'doxicity.config.js');
if (existsSync(userConfigFilename)) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userConfig = (await import(userConfigFilename)).default as Partial<DoxicityConfig>;
  config = merge(defaultConfig, userConfig);
} else {
  config = { ...defaultConfig };
  console.warn(chalk.yellow(`No config filed found at "${userConfigFilename}". Using default options!`));
}

async function publishPages() {
  try {
    const result = await publish(config);
    const numPages = result.publishedPages.length;
    const term = numPages === 1 ? 'one page' : `${numPages} pages`;

    console.log(chalk.green(`Doxicity successfully published ${term} to "${config.outputDir}"`));
  } catch (err: Error | TransformPluginError | AfterTransformPluginError | unknown) {
    if (
      err instanceof AfterTransformPluginError ||
      err instanceof TemplateRenderError ||
      err instanceof TransformPluginError
    ) {
      console.error(chalk.red(`${err.page.inputFile}: ${err.message}`));
    } else {
      console.error(chalk.red((err as Error).message ?? err));
    }
  }
}

// Clean before publishing
if (config.cleanOnPublish) {
  try {
    await clean(config);
  } catch (err) {
    console.error(chalk.yellow(`Unable to clean the output directory before publishing: ${(err as Error).message}`));
  }
}

// Initial copying of assets, copying of themes, and publishing of pages
try {
  await Promise.all([copyAssets(config), copyTheme(config)]);
  await publishPages();
} catch (err) {
  console.error(chalk.red((err as Error).message));
}

// Watch files for changes
if (options.watch) {
  console.log(`Watching for changes in: ${targetDirectory}`);

  const watcher = chokidar.watch(
    [
      // Watch the target directory
      path.join(targetDirectory, '**/*'),
      // Watch the default theme directory (helpful for dev)
      path.join(currentDir, '../themes')
    ],
    {
      persistent: true,
      ignored: [path.resolve(config.outputDir)],
      ignoreInitial: true
    }
  );

  watcher
    .on('add', async filename => {
      // A file was added
      if (isMarkdownFile(filename)) {
        console.log(`New page created: "${filename}"`);
        await publishPages();
      } else {
        console.log(`New file created: "${filename}"`);
        await Promise.all([copyAssets(config), copyTheme(config)]);
      }

      if (options.serve) {
        bs.reload();
      }
    })
    .on('change', async filename => {
      console.log('change');
      // A file was changed
      if (isMarkdownFile(filename)) {
        console.log(`Page changed: "${filename}"`);
        await publishPages();
      } else {
        console.log(`File changed: "${filename}"`);
        await Promise.all([copyAssets(config), copyTheme(config)]);
      }

      if (options.serve) {
        bs.reload();
      }
    })
    .on('unlink', async filename => {
      // A file was deleted
      console.log(`Page removed: "${filename}"`);

      // Delete and republish everything. This could be optimized a bit, but works for now.
      try {
        await clean(config);
      } catch (err) {
        console.error(
          chalk.yellow(`Unable to clean the output directory before publishing: ${(err as Error).message}`)
        );
      }

      try {
        await Promise.all([copyAssets(config), copyTheme(config)]);
        await publishPages();
      } catch (err) {
        console.error(chalk.red((err as Error).message));
      }

      if (options.serve) {
        bs.reload();
      }
    });
}

// Launch the dev server
if (options.serve) {
  const port = await getPort({
    port: portNumbers(4000, 4999)
  });

  bs.init(
    {
      open: true,
      startPath: '/',
      port,
      logLevel: 'silent',
      logPrefix: '[doxicity]',
      logFileChanges: false,
      notify: false,
      ghostMode: false,
      server: {
        baseDir: config.outputDir
      }
    },
    () => {
      const url = `http://localhost:${port}`;
      console.log(chalk.cyan(`Launched the Doxicity dev server at ${url} 📚\n`));
    }
  );
}
