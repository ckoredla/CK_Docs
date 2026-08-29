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

const weeklyArticle: ArticleRecord = {
  id:'nbl-2026-08-28', title:'Build a Maintenance Event Ledger Before You Build More AI', slug:'2026-08-maintenance-event-ledger', issueDate:'2026-08-28',
  publishedAt:'2026-08-28T19:00:00-05:00', updatedAt:'2026-08-28T19:00:00-05:00',
  summary:'A reference architecture for creating an immutable, replayable maintenance event backbone before layering analytics and AI over operational workflows.',
  description:'How airlines can connect maintenance state changes, aircraft evidence, lineage, and downstream intelligence through a governed event ledger.',
  categories:['MRO Modernization','Data & Cloud Architecture'], topicTags:['Event ledger','Event-driven architecture','Evidence lineage'], ataChapters:[],
  articleType:'Reference Architecture', estimatedReadingTime:10, publicationStatus:'published', featuredStatus:'featured',
  diagramIdentifiers:['maintenance-event-ledger'], referenceCount:5, relatedArticleSlugs:['2026-08-maintenance-observability','2026-08-digital-shift-handover'],
  previousArticleSlug:'2026-08-digital-shift-handover', nextArticleSlug:null
};

const combined = [weeklyArticle, ...(records as ArticleRecord[]), ...historicalRecords].map((article)=>({
  ...article,
  publishedAt: `${article.issueDate}T12:00:00Z`,
  updatedAt: `${article.issueDate}T12:00:00Z`
})).sort((a,b)=>a.issueDate.localeCompare(b.issueDate));
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