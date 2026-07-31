import type { ReactNode } from 'react';
import Link from 'next/link';
import { articleBySlug, formatIssue, formatPublished, type ArticleRecord } from '../lib/articles';

export const IssueDate = ({ value }: { value: string }) => <span>Issue: {formatIssue(value)}</span>;
export const PublishedDate = ({ value }: { value: string }) => <span>Published {formatPublished(value)}</span>;
export const TopicBadge = ({ children }: { children: ReactNode }) => <span className="topic-badge">{children}</span>;
export const ATAChapterBadge = ({ children }: { children: ReactNode }) => <span className="ata-badge">ATA {children}</span>;
export const PublicationStatus = ({ status }: { status: string }) => <span className="publication-status">{status}</span>;

export function ArticleMetadata({ article }: { article: ArticleRecord }) {
  return <div className="article-metadata"><IssueDate value={article.issueDate} /><PublishedDate value={article.publishedAt} /><span>{article.estimatedReadingTime} minute read</span></div>;
}

export function ArticleHeader({ article }: { article: ArticleRecord }) {
  return <header className="article-header"><div className="kicker">{article.categories.join(' · ')}</div><div className="issue-title"><IssueDate value={article.issueDate} /></div><h1>{article.title}</h1><ArticleMetadata article={article} /><div className="badge-row">{article.topicTags.map((tag) => <TopicBadge key={tag}>{tag}</TopicBadge>)}{article.ataChapters.map((chapter) => <ATAChapterBadge key={chapter}>{chapter}</ATAChapterBadge>)}</div></header>;
}

export const ExecutiveSummary = ({ children }: { children: ReactNode }) => <section className="executive-summary"><h2>Executive summary</h2>{children}</section>;
export const KeyTakeaways = ({ children }: { children: ReactNode }) => <section className="key-takeaways"><h2>Key takeaways</h2>{children}</section>;
export const ArticleSection = ({ id, title, children }: { id?: string; title: string; children: ReactNode }) => <section id={id}><h2>{title}</h2>{children}</section>;
export const DiagramLegend = ({ children }: { children: ReactNode }) => <div className="diagram-legend">{children}</div>;
export const ArchitectureFigure = ({ children, caption }: { children: ReactNode; caption: string }) => <figure className="architecture-figure">{children}<figcaption>{caption}</figcaption></figure>;
export const WorkflowFigure = ArchitectureFigure;

export function ReferenceList({ children }: { children: ReactNode }) {
  return <section id="references"><h2>References</h2><ul>{children}</ul></section>;
}

export function RelatedArticles({ article }: { article: ArticleRecord }) {
  return <section className="related-articles"><h2>Related articles</h2><div>{article.relatedArticleSlugs.map((slug) => { const related = articleBySlug.get(slug)!; return <a href={`/articles/${slug}`} key={slug}><span>{related.articleType}</span><strong>{related.title}</strong></a>; })}</div></section>;
}

export function PreviousNextNavigation({ article }: { article: ArticleRecord }) {
  const previous = article.previousArticleSlug ? articleBySlug.get(article.previousArticleSlug) : null;
  const next = article.nextArticleSlug ? articleBySlug.get(article.nextArticleSlug) : null;
  return <nav className="previous-next" aria-label="Article navigation"><h2>Continue through the archive</h2><div>{previous ? <Link className="article-nav-button previous" href={`/articles/${previous.slug}`} aria-label={`Previous article: ${previous.title}`}><span>← Previous article</span><strong>{previous.title}</strong><small>{formatIssue(previous.issueDate)}</small></Link> : <span className="article-nav-end">Beginning of archive</span>}</div><div>{next ? <Link className="article-nav-button next" href={`/articles/${next.slug}`} aria-label={`Next article: ${next.title}`}><span>Next article →</span><strong>{next.title}</strong><small>{formatIssue(next.issueDate)}</small></Link> : <span className="article-nav-end">Latest article</span>}</div></nav>;
}
