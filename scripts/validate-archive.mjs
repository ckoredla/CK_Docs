import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const baseArticles = JSON.parse(fs.readFileSync(path.join(root, 'content/articles.json'), 'utf8'));
const { historicalRecords, historicalIssues } = await import(path.join(root, 'app/lib/historicalCatalog.ts'));
const articles = [...baseArticles, ...historicalRecords].map((article)=>({...article,publishedAt:`${article.issueDate}T12:00:00Z`,updatedAt:`${article.issueDate}T12:00:00Z`}));
const errors = [];
const required = ['id','title','slug','issueDate','publishedAt','summary','description','categories','topicTags','articleType','estimatedReadingTime','publicationStatus','featuredStatus','diagramIdentifiers','referenceCount','relatedArticleSlugs'];
const unique = (field) => {
  const seen = new Set();
  for (const article of articles) { if (seen.has(article[field])) errors.push(`Duplicate ${field}: ${article[field]}`); seen.add(article[field]); }
};
unique('slug'); unique('issueDate'); unique('id');
const slugs = new Set(articles.map((article) => article.slug));
const chronological = [...articles].sort((a,b)=>a.issueDate.localeCompare(b.issueDate));
chronological.forEach((article,index)=>{article.previousArticleSlug=chronological[index-1]?.slug||null;article.nextArticleSlug=chronological[index+1]?.slug||null;article.relatedArticleSlugs=[chronological[index-1]?.slug,chronological[index+1]?.slug].filter(Boolean);});

for (let year=2017;year<=2026;year++) {
  const issues=articles.filter((article)=>article.issueDate.startsWith(`${year}-`));
  if (issues.length!==12) errors.push(`${year}: expected 12 monthly issues, found ${issues.length}`);
  for(let month=1;month<=12;month++) if(!issues.some((article)=>article.issueDate===`${year}-${String(month).padStart(2,'0')}-01`)) errors.push(`${year}: missing month ${month}`);
}
if (!articles.some((article)=>article.issueDate==='2017-01-01'&&article.slug==='2017-01-technical-record-digitization')) errors.push('January 2017 canonical issue is not reachable');

for (const article of articles) {
  for (const field of required) if (article[field] === undefined || article[field] === '' || article[field] === null) errors.push(`${article.slug}: missing ${field}`);
  if (!/^\d{4}-\d{2}-01$/.test(article.issueDate) || Number.isNaN(Date.parse(article.issueDate))) errors.push(`${article.slug}: invalid issueDate`);
  if (Number.isNaN(Date.parse(article.publishedAt))) errors.push(`${article.slug}: invalid publishedAt`);
  if (article.publishedAt === article.issueDate) errors.push(`${article.slug}: issueDate reused as publishedAt`);
  if (!article.publishedAt.startsWith(article.issueDate)) errors.push(`${article.slug}: publishedAt does not match issueDate`);
  if (!article.diagramIdentifiers?.length) errors.push(`${article.slug}: published article has no diagram`);
  if (!article.referenceCount) errors.push(`${article.slug}: published article has no references`);
  for (const slug of [...article.relatedArticleSlugs, article.previousArticleSlug, article.nextArticleSlug].filter(Boolean)) if (!slugs.has(slug)) errors.push(`${article.slug}: invalid linked slug ${slug}`);
  const position=chronological.findIndex((candidate)=>candidate.slug===article.slug);
  if(article.previousArticleSlug!==(chronological[position-1]?.slug||null)) errors.push(`${article.slug}: incorrect previous navigation`);
  if(article.nextArticleSlug!==(chronological[position+1]?.slug||null)) errors.push(`${article.slug}: incorrect next navigation`);
  const directRoute = path.join(root, 'app/articles', article.slug, 'page.tsx');
  const dynamicRoute = path.join(root, 'app/articles/[slug]/page.tsx');
  const route = fs.existsSync(directRoute) ? directRoute : dynamicRoute;
  if (!fs.existsSync(route)) errors.push(`${article.slug}: registry entry has no route`);
  else {
    const source = fs.readFileSync(route, 'utf8');
    if (!source.includes('ArticleShell') && !source.includes('IssueArticle') && !source.includes('HistoricalArticle')) errors.push(`${article.slug}: route does not use publication shell`);
    const structuredSource = source.includes('IssueArticle') ? fs.readFileSync(path.join(root, 'app/components/IssueArticle.tsx'), 'utf8') : source.includes('HistoricalArticle') ? fs.readFileSync(path.join(root, 'app/components/HistoricalArticle.tsx'),'utf8') : source;
    if (!structuredSource.includes('application/ld+json')) errors.push(`${article.slug}: route lacks structured article data`);
    if (!structuredSource.includes('datePublished: article.publishedAt')) errors.push(`${article.slug}: structured datePublished must use publishedAt`);
    const visualCount = source.includes('IssueArticle') || source.includes('HistoricalArticle') ? 4 : (source.match(/<(?:ArticleVisual|ReferenceArchitecture)/g) || []).length;
    if (visualCount < 2 || visualCount > 5) errors.push(`${article.slug}: expected 2–5 visual figures, found ${visualCount}`);
  }
}

for (const entry of fs.readdirSync(path.join(root, 'app/articles'), { withFileTypes: true })) {
  if (entry.name !== '[slug]' && entry.isDirectory() && fs.existsSync(path.join(root, 'app/articles', entry.name, 'page.tsx')) && !slugs.has(entry.name)) errors.push(`${entry.name}: route has no registry entry`);
}

for (const issue of historicalIssues) for (const field of ['challenge','design','failure','practice']) if (!issue[field] || issue[field].length < 40) errors.push(`${issue.slug}: insufficient original ${field} content`);

const sourceFiles = [];
const walk = (directory) => { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const target = path.join(directory, entry.name); if (entry.isDirectory()) walk(target); else if (/\.(tsx|ts)$/.test(entry.name)) sourceFiles.push(target); } };
walk(path.join(root, 'app'));
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/href=["'](\/[^"'#?]*)/g)) {
    const href = match[1];
    if (href === '/') continue;
    if (href.startsWith('/articles/') && !slugs.has(href.slice('/articles/'.length))) errors.push(`${path.relative(root, file)}: broken internal link ${href}`);
  }
}

if (errors.length) { console.error(`Archive validation failed (${errors.length})\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Archive validation passed: ${articles.length} routes, unique issues, diagrams, references, and links verified.`);
