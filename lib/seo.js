/**
 * Shared SEO helpers for the Node side of the blog.
 *
 * Both the production server (server/index.js) and the build-time sitemap
 * generator (scripts/generate-sitemap.js) require this module, so slug/strip/
 * description/escaping logic and the paginated post fetch + sitemap builder live
 * in exactly one place.
 *
 * NOTE: src/utils/seo.ts intentionally re-implements slugify / stripHtml /
 * toDescription for the browser bundle — Create React App's ModuleScopePlugin
 * forbids importing files outside src/, so the client cannot require() this
 * module. Keep the two in sync if you change that logic.
 */
const axios = require('axios');

const slugify = (title) =>
  (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';

const stripHtml = (html) =>
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

const toDescription = (html, maxLength = 155) => {
  const text = stripHtml(html);
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 1).replace(/\s+\S*$/, '') + '…';
};

// Escapes the characters that are unsafe inside a double-quoted HTML attribute.
const escapeHtml = (s) =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Serializes a value for embedding inside an inline <script> tag. JSON.stringify
// does NOT escape '/', so a value containing "</script>" would otherwise close
// the tag early and inject markup. Escaping '<' as < keeps the JSON valid
// while making that impossible.
const toInlineJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

// True when API_URL is an absolute http(s) origin. axios in Node cannot resolve
// a relative URL (no document origin), so meta injection / sitemap fetching only
// works against an absolute backend URL.
const hasAbsoluteApi = (apiUrl) => /^https?:\/\//i.test(apiUrl || '');

/**
 * Walks the paginated /posts endpoint until it stops returning new posts.
 * A hard iteration cap guards against a misbehaving API looping forever.
 */
async function fetchAllPosts(apiUrl, { limit = 50, maxPages = 1000 } = {}) {
  if (!hasAbsoluteApi(apiUrl)) {
    return [];
  }
  const posts = [];
  let offset = 0;
  for (let i = 0; i < maxPages; i++) {
    const { data } = await axios.get(
      `${apiUrl}/posts?offset=${offset}&limit=${limit}`
    );
    const batch = (data && data.posts) || [];
    posts.push(...batch);
    // Stop unless the API explicitly hands back a positive next offset. A
    // missing/zero/negative nextOffset means "no more pages" — using `> 0`
    // (not `<= 0`) also stops on `undefined`, which `<= 0` would let through.
    if (!data || !(data.nextOffset > 0) || batch.length === 0) {
      break;
    }
    offset = data.nextOffset;
  }
  return posts;
}

const postLoc = (siteUrl, post) =>
  `${siteUrl}/posts/${slugify(post.title)}/${post.uuid}`;

function buildSitemapXml(siteUrl, posts, staticPaths) {
  const entry = (loc, lastmod) =>
    `  <url>\n    <loc>${escapeHtml(loc)}</loc>` +
    (lastmod
      ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`
      : '') +
    '\n  </url>';
  const urls = [
    ...staticPaths.map((p) => entry(`${siteUrl}${p}`)),
    ...posts.map((p) => entry(postLoc(siteUrl, p), p.updatedAt || p.createdAt)),
  ];
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls.join('\n')}\n` +
    '</urlset>\n'
  );
}

module.exports = {
  STATIC_PATHS: ['/', '/about', '/contact', '/privacy'],
  buildSitemapXml,
  escapeHtml,
  fetchAllPosts,
  hasAbsoluteApi,
  postLoc,
  slugify,
  stripHtml,
  toDescription,
  toInlineJson,
};
