import { formatDateHelper, formatNumberHelper, formatUrlHelper } from '../dist/helpers.js';
import {
  activeLinksPlugin,
  anchorHeadingsPlugin,
  beautifyPlugin,
  copyCodePlugin,
  customTitlePlugin,
  externalLinksPlugin,
  highlightCodePlugin,
  iconAddonPlugin,
  searchPlugin,
  smoothLinksPlugin,
  tableOfContentsPlugin,
  tableScrollPlugin,
  typographyPlugin
} from '../dist/plugins.js';

export default {
  url: 'https://doxicity.com/',
  inputDir: '.',
  outputDir: '_website',
  cleanOnPublish: true,
  helpers: [formatDateHelper, formatNumberHelper, formatUrlHelper],
  copyAssets: ['assets/**/*'],
  dev: true,
  plugins: [
    activeLinksPlugin(),
    anchorHeadingsPlugin({ levels: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
    externalLinksPlugin({ target: '_blank', noopener: false, noreferrer: false }),
    copyCodePlugin(),
    iconAddonPlugin({
      title: `View Doxicity on GitHub`,
      url: 'https://github.com/claviska/doxicity',
      target: '_blank',
      icon: 'github'
    }),
    iconAddonPlugin({
      title: 'Follow Doxicity on Twitter',
      url: 'https://twitter.com/doxicityApp',
      target: '_blank',
      icon: 'twitter'
    }),
    iconAddonPlugin({
      title: `Sponsor Doxicity on GitHub`,
      url: 'https://github.com/sponsors/claviska',
      target: '_blank',
      icon: 'heart'
    }),
    highlightCodePlugin(),
    tableOfContentsPlugin({
      target: '.table-of-contents',
      startLevel: 'h2',
      endLevel: 'h2'
    }),
    tableScrollPlugin(),
    typographyPlugin(),
    smoothLinksPlugin(),
    searchPlugin(),
    customTitlePlugin({
      suffix: ' &middot; Doxicity',
      skip: page => page.inputFile === 'index.md'
    }),
    beautifyPlugin({ indent_size: 2, indent_char: ' ' })
  ],
  data: {
    meta: {
      title: 'Doxicity',
      description: 'Write amazing docs. Fast, free, and flexible.',
      image: 'https://doxicity.vercel.app/assets/share.png',
      twitterCreator: 'doxicityApp'
    }
  }
};
