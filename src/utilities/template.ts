import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { TemplateRenderError, TemplateResolveError } from './errors.js';
import { render as renderMarkdown } from './markdown.js';
import type { DoxicityConfig, DoxicityPage } from './types';
import type { TemplateDelegate } from 'handlebars';

const templateCache = new Map<string, TemplateDelegate>();

/** Renders a template and returns the resulting HTML. */
export async function render(
  page: DoxicityPage,
  templateName: string,
  data: Record<string, unknown>,
  config: DoxicityConfig
): Promise<string> {
  const source = await resolve(templateName, config.themeDir);
  let template: TemplateDelegate;

  // Cache templates for better performance
  if (templateCache.has(templateName)) {
    template = templateCache.get(templateName)!;
  } else {
    template = Handlebars.compile(source);
    templateCache.set(templateName, template);
  }

  // Sub-render page content and its markdown
  try {
    const contentTemplate = Handlebars.compile(data.content);
    data.content = renderMarkdown(contentTemplate(Object.assign(data, { content: undefined })));
  } catch (err) {
    const filename = path.relative(config.inputDir, page.inputFile);
    throw new TemplateRenderError(
      `Unable to render content from page "${filename}".\n\nHandlebars said: ${err as string}`
    );
  }

  // Render the template
  try {
    return template(data);
  } catch (err) {
    throw new TemplateRenderError(`Unable to render template "${templateName}".\n\nHandlebars said: ${err as string}`);
  }
}

/** Looks for the specified template in the user's theme directory directory. Returns the template's source. */
async function resolve(templateName: string, themeDir: string) {
  try {
    const file = path.join(themeDir, `${templateName}.hbs`);
    const source = await fs.readFile(file, 'utf8');
    return source;
  } catch {
    throw new TemplateResolveError(`Unable to resolve template "${templateName}"`);
  }
}

/** Registers a custom Handlebars helper. */
export function registerHelper(name: string, callback: (args: unknown) => string) {
  Handlebars.registerHelper(name, callback);
}

/** Registers a custom Handlebars partial. */
export function registerPartial(name: string, template: string) {
  Handlebars.registerPartial(name, template);
}
