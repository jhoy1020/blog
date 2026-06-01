import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../../utils/seo';

interface IArticleMeta {
  /** ISO date string for when the post was first published. */
  publishedTime?: string;
  /** ISO date string for when the post was last updated. */
  modifiedTime?: string;
}

interface ISeoProps {
  /** The page title (shown in the browser tab and search results). */
  title: string;
  /** A ~155 character plain-text summary of the page. */
  description: string;
  /** Path (starting with "/") used to build the canonical URL + og:url. */
  canonicalPath: string;
  /** Absolute URL of the share/preview image. */
  imageUrl?: string;
  /** When provided, marks the page as an article and emits BlogPosting JSON-LD. */
  article?: IArticleMeta;
}

const SITE_NAME = "Josh Hoy's Blog";
const AUTHOR = 'Josh Hoy';
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;

/**
 * Centralised <head> management for a page: title, meta description, canonical
 * URL, Open Graph + Twitter card tags, and (for articles) schema.org
 * BlogPosting structured data. Powered by react-helmet-async.
 */
const Seo = ({
  title,
  description,
  canonicalPath,
  imageUrl,
  article,
}: ISeoProps): JSX.Element => {
  const url = `${SITE_URL}${canonicalPath}`;
  const image = imageUrl || DEFAULT_IMAGE;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const type = article ? 'article' : 'website';

  const jsonLd = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        author: { '@type': 'Person', name: AUTHOR },
        dateModified: article.modifiedTime || article.publishedTime,
        datePublished: article.publishedTime,
        description,
        headline: title,
        image,
        mainEntityOfPage: { '@id': url, '@type': 'WebPage' },
        publisher: { '@type': 'Person', name: AUTHOR },
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <link rel='canonical' href={url} />

      {/* Open Graph (Facebook, LinkedIn, Slack, iMessage, ...) */}
      <meta property='og:site_name' content={SITE_NAME} />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />

      {/* Twitter / X */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {jsonLd ? (
        // Escape '<' so a post containing "</script>" can't break out of this
        // inline script tag (JSON.stringify does not escape '/').
        <script type='application/ld+json'>
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>
      ) : null}
    </Helmet>
  );
};

export default Seo;
