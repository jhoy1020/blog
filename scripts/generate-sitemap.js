/* eslint-disable no-console */
/**
 * Build-time sitemap generator.
 *
 * Runs as the `prebuild` step (see package.json) and writes
 * public/sitemap.xml so it gets copied into the production build. It queries
 * the live posts API for the current set of posts; if the API is unreachable
 * (e.g. during a CI build with no network) it falls back to a sitemap
 * containing just the static pages and never fails the build.
 *
 * At runtime the Express server (server/index.js) serves an always-current
 * /sitemap.xml that supersedes this file; this build-time copy only exists as a
 * fallback for when the live API is unreachable at request time.
 *
 * The slug / fetch / XML helpers live in ../lib/seo.js, shared with the server.
 */
const fs = require('fs');
const path = require('path');
const {
  STATIC_PATHS,
  buildSitemapXml,
  fetchAllPosts,
} = require('../lib/seo');

const SITE_URL = (
  process.env.REACT_APP_SITE_URL || 'https://joshhoy.com'
).replace(/\/+$/, '');
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

async function generate() {
  let posts = [];
  try {
    posts = await fetchAllPosts(API_URL);
  } catch (e) {
    console.warn(
      `[sitemap] Could not fetch posts (${e.message}). ` +
        'Writing sitemap with static pages only.'
    );
  }

  const xml = buildSitemapXml(SITE_URL, posts, STATIC_PATHS);
  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(
    `[sitemap] Wrote ${STATIC_PATHS.length + posts.length} urls to ${outPath}`
  );
}

generate().catch((e) => {
  // Never fail the build because of the sitemap.
  console.warn(`[sitemap] generation skipped: ${e.message}`);
});
