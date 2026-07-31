import type { MetadataRoute } from 'next';
import { articles } from './lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://northboundlabs.ai', lastModified: new Date(Math.max(...articles.map((a) => new Date(a.updatedAt || a.publishedAt).getTime()))) },
    ...articles.map((article) => ({ url: `https://northboundlabs.ai/articles/${article.slug}`, lastModified: new Date(article.updatedAt || article.publishedAt) }))
  ];
}
