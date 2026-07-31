import records from '../../content/articles.json';
import { historicalRecords } from './historicalCatalog';

export type ArticleRecord = {
  id: string; title: string; slug: string; issueDate: string; publishedAt: string;
  updatedAt: string | null; summary: string; description: string; categories: string[];
  topicTags: string[]; ataChapters: string[]; articleType: string;
  estimatedReadingTime: number; publicationStatus: 'draft' | 'published';
  featuredStatus: 'featured' | 'standard'; diagramIdentifiers: string[];
  referenceCount: number; relatedArticleSlugs: string[];
  previousArticleSlug: string | null; nextArticleSlug: string | null;
};

const combined = [...(records as ArticleRecord[]), ...historicalRecords].sort((a,b)=>a.issueDate.localeCompare(b.issueDate));
combined.forEach((article,index)=>{article.previousArticleSlug=combined[index-1]?.slug||null;article.nextArticleSlug=combined[index+1]?.slug||null;article.relatedArticleSlugs=[combined[index-1]?.slug,combined[index+1]?.slug].filter((slug):slug is string=>Boolean(slug));});

export const articles = combined
  .filter((article) => article.publicationStatus === 'published')
  .sort((a, b) => b.issueDate.localeCompare(a.issueDate));

export const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
export const getArticle = (slug: string) => {
  const article = articleBySlug.get(slug);
  if (!article) throw new Error(`Unknown article slug: ${slug}`);
  return article;
};

export const formatIssue = (date: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long', year: 'numeric', timeZone: 'UTC'
}).format(new Date(`${date}T00:00:00Z`));

export const formatPublished = (date: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago'
}).format(new Date(date));

export const archiveYears = Array.from({ length: 10 }, (_, index) => 2026 - index).map((year) => ({
  year,
  articles: articles.filter((article) => Number(article.issueDate.slice(0, 4)) === year)
}));

export const searchRecords = articles.map(({ slug, title, summary, categories, topicTags, issueDate }) => ({
  slug, title, summary, categories, topicTags, issueDate, href: `/articles/${slug}`
}));
