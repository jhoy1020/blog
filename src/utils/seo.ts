/**
 * SEO helpers shared across the blog: the canonical site URL, slug generation
 * for descriptive post URLs, and turning a post's HTML body into a plain-text
 * meta description.
 *
 * NOTE: the server (server/index.js) re-implements slugify / stripHtml /
 * toDescription so it can inject the same metadata into the initial HTML for
 * crawlers. Keep the two in sync if you change the logic here.
 */

// The canonical, public origin of the blog. Used for canonical URLs, Open
// Graph tags and the sitemap. Override per-environment with REACT_APP_SITE_URL.
export const SITE_URL = (
  process.env.REACT_APP_SITE_URL || 'https://joshhoy.com'
).replace(/\/+$/, '');

/**
 * Converts a post title into a URL-friendly slug.
 * e.g. "My First Post!" -> "my-first-post"
 * @param title The post title.
 */
export const slugify = (title: string): string =>
  (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';

/**
 * Builds the canonical path for a post: /posts/<slug>/<uuid>.
 * The uuid is what the app actually looks the post up by; the slug is purely
 * descriptive for humans and search engines.
 * @param post A post (only title + uuid are needed).
 */
export const postPath = (post: { title: string; uuid: string }): string =>
  `/posts/${slugify(post.title)}/${post.uuid}`;

/**
 * Strips HTML tags and decodes the most common entities, collapsing whitespace.
 * @param html The HTML string.
 */
export const stripHtml = (html: string): string =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Produces a meta-description-sized plain-text summary from post HTML.
 * @param html The post's HTML body.
 * @param maxLength The maximum length of the description (default 155).
 */
export const toDescription = (html: string, maxLength: number = 155): string => {
  const text = stripHtml(html);
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 1).replace(/\s+\S*$/, '') + '…';
};
