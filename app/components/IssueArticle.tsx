import { ArticleShell } from './ArticleShell';
import { ExecutiveSummary, KeyTakeaways, ReferenceList } from './Publication';
import { SystemDiagram } from './DiagramSystem';
import { getArticle } from '../lib/articles';
import { issueContent } from '../lib/issueContent';
import { ArticleVisual } from './WhitepaperVisuals';

export function IssueArticle({ slug }: { slug: string }) {
  const article = getArticle(slug); const content = issueContent[slug];
  if (!content) throw new Error(`Missing issue content: ${slug}`);
  return <ArticleShell article={article}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,datePublished: article.publishedAt,dateModified:article.updatedAt || article.publishedAt,mainEntityOfPage:`https://northboundlabs.ai/articles/${slug}`,publisher:{'@type':'Organization',name:'Northbound Labs'}})}} />
    <ExecutiveSummary><p>{content.thesis}</p>{content.context.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</ExecutiveSummary>
    <SystemDiagram id={article.diagramIdentifiers[0]} {...content.diagram} />
    {content.sections.map((section, index) => <section key={section.title}><h2>{index + 1}. {section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{index<3?<ArticleVisual slug={slug} index={index as 0|1|2}/>:null}</section>)}
    <KeyTakeaways><ul>{content.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul></KeyTakeaways>
    <ReferenceList>{content.references.map((reference) => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer">{reference.label}</a></li>)}</ReferenceList>
  </ArticleShell>;
}

export function issueMetadata(slug: string) { const article = getArticle(slug); return { title: article.title, description: article.description, alternates:{canonical:`/articles/${slug}`}, openGraph:{type:'article' as const,title:article.title,description:article.description,publishedTime:article.publishedAt,modifiedTime:article.updatedAt || article.publishedAt} }; }
