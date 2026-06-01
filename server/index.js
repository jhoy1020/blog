/* eslint-disable no-console */
/**
 * Lightweight production server for the blog.
 *
 * It serves the static Create React App build, but for crawlers it does two
 * things a plain static host (nginx) cannot:
 *
 *   1. Injects per-post <title> / meta description / Open Graph / Twitter /
 *      JSON-LD into the *initial* HTML for /posts/:slug/:uuid requests, so
 *      social link previews (Facebook, LinkedIn, Slack, iMessage, ...) and
 *      non-JavaScript search engines see real metadata. The React app still
 *      hydrates and takes over as normal in the browser.
 *
 *   2. Serves an always-current /sitemap.xml built from the live posts API.
 *
 * The backend posts API is untouched — this server is just a client of it.
 *
 * The slug / strip / description / escaping / sitemap helpers live in
 * ../lib/seo.js, shared with scripts/generate-sitemap.js.
 *
 * IMPORTANT: this server must be given an ABSOLUTE backend URL via API_URL (or
 * REACT_APP_API_URL). Unlike the browser bundle — which can use a relative ''
 * base because the browser resolves it against the current origin — axios in
 * Node has no origin to resolve against, so a relative/empty base makes every
 * API call fail and both features below silently no-op.
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const {
  STATIC_PATHS,
  buildSitemapXml,
  escapeHtml,
  fetchAllPosts,
  hasAbsoluteApi,
  postLoc,
  slugify,
  toDescription,
  toInlineJson,
} = require('../lib/seo');

const PORT = process.env.PORT || 80;
const SITE_URL = (
  process.env.SITE_URL ||
  process.env.REACT_APP_SITE_URL ||
  'https://joshhoy.com'
).replace(/\/+$/, '');
const API_URL = (
  process.env.API_URL ||
  process.env.REACT_APP_API_URL ||
  ''
).replace(/\/+$/, '');
const API_OK = hasAbsoluteApi(API_URL);

const BUILD_DIR = path.join(__dirname, '..', 'build');
const INDEX_HTML = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');

const SITE_NAME = "Josh Hoy's Blog";
const AUTHOR = 'Josh Hoy';
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;

const app = express();

// ---- per-post meta injection ----
function buildMetaTags(post) {
  const url = postLoc(SITE_URL, post);
  const title = `${post.title} | ${SITE_NAME}`;
  const description = toDescription(post.text);
  const image = post.imageUrl || DEFAULT_IMAGE;
  const published = post.createdAt
    ? new Date(post.createdAt).toISOString()
    : undefined;
  const modified = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : published;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: { '@type': 'Person', name: AUTHOR },
    dateModified: modified,
    datePublished: published,
    description,
    headline: post.title,
    image,
    mainEntityOfPage: { '@id': url, '@type': 'WebPage' },
    publisher: { '@type': 'Person', name: AUTHOR },
  };

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    '<meta property="og:type" content="article" />',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<script type="application/ld+json">${toInlineJson(jsonLd)}</script>`,
  ].join('');
}

function injectMeta(html, post) {
  // Remove the default static <title>, then drop our tags in before </head>.
  return html
    .replace(/<title>.*?<\/title>/i, '')
    .replace('</head>', `${buildMetaTags(post)}</head>`);
}

async function handlePost(uuid, res, next) {
  // No absolute backend URL → we can't fetch the post; serve the SPA shell.
  if (!API_OK) {
    return next();
  }
  try {
    const { data: post } = await axios.get(`${API_URL}/posts/${uuid}`);
    if (!post || !post.uuid) {
      return next();
    }
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(injectMeta(INDEX_HTML, post));
  } catch (e) {
    // On any failure, fall through to the normal SPA shell.
    return next();
  }
}

app.get('/posts/:slug/:uuid', (req, res, next) =>
  handlePost(req.params.uuid, res, next)
);
app.get('/posts/:uuid', (req, res, next) =>
  handlePost(req.params.uuid, res, next)
);

// ---- live sitemap (cached) ----
let sitemapCache = { xml: null, at: 0 };
const SITEMAP_TTL_MS = 60 * 60 * 1000; // 1 hour

async function buildSitemap() {
  const posts = await fetchAllPosts(API_URL);
  return buildSitemapXml(SITE_URL, posts, STATIC_PATHS);
}

app.get('/sitemap.xml', async (req, res) => {
  try {
    const now = Date.now();
    if (!sitemapCache.xml || now - sitemapCache.at > SITEMAP_TTL_MS) {
      sitemapCache = { xml: await buildSitemap(), at: now };
    }
    res.set('Content-Type', 'application/xml').send(sitemapCache.xml);
  } catch (e) {
    // Fall back to the build-time sitemap shipped with the static files.
    res.sendFile(path.join(BUILD_DIR, 'sitemap.xml'), (err) => {
      if (err) {
        res.status(500).end();
      }
    });
  }
});

// ---- static assets + SPA fallback ----
app.use(express.static(BUILD_DIR));
app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

// Only start listening when run directly (node server/index.js). Importing the
// module (e.g. for tests) gives access to the helpers without binding a port.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Blog server listening on :${PORT} (site=${SITE_URL})`);
    if (!API_OK) {
      console.warn(
        '[seo] API_URL is empty or not absolute (got ' +
          `"${API_URL}"). Per-post meta injection and the live sitemap are ` +
          'DISABLED — set API_URL to the absolute backend origin ' +
          '(e.g. https://api.joshhoy.com) to enable them.'
      );
    }
  });
}

module.exports = {
  app,
  buildMetaTags,
  buildSitemap,
  injectMeta,
  slugify,
  toDescription,
};
