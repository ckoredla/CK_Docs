import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const articles = JSON.parse(fs.readFileSync(path.join(root, 'content/articles.json'), 'utf8'));
const errors = [];
const required = ['id','title','slug','issueDate','publishedAt','summary','description','categories','topicTags','articleType','estimatedReadingTime','publicationStatus','featuredStatus','diagramIdentifiers','referenceCount','relatedArticleSlugs'];
const unique = (field) => {
  const seen = new Set();
  for (const article of articles) { if (seen.has(article[field])) errors.push(`Duplicate ${field}: ${article[field]}`); seen.add(article[field]); }
};
unique('slug'); unique('issueDate'); unique('id');
const slugs = new Set(articles.map((article) => article.slug));
const now = Date.now();

for (const article of articles) {
  for (const field of required) if (article[field] === undefined || article[field] === '' || article[field] === null) errors.push(`${article.slug}: missing ${field}`);
  if (!/^\d{4}-\d{2}-01$/.test(article.issueDate) || Number.isNaN(Date.parse(article.issueDate))) errors.push(`${article.slug}: invalid issueDate`);
  if (Number.isNaN(Date.parse(article.publishedAt))) errors.push(`${article.slug}: invalid publishedAt`);
  if (article.publishedAt === article.issueDate) errors.push(`${article.slug}: issueDate reused as publishedAt`);
  if (Date.parse(article.publishedAt) > now) errors.push(`${article.slug}: future publishedAt`);
  if (!article.diagramIdentifiers?.length) errors.push(`${article.slug}: published article has no diagram`);
  if (!article.referenceCount) errors.push(`${article.slug}: published article has no references`);
  for (const slug of [...article.relatedArticleSlugs, article.previousArticleSlug, article.nextArticleSlug].filter(Boolean)) if (!slugs.has(slug)) errors.push(`${article.slug}: invalid linked slug ${slug}`);
  const route = path.join(root, 'app/articles', article.slug, 'page.tsx');
  if (!fs.existsSync(route)) errors.push(`${article.slug}: registry entry has no route`);
  else {
    const source = fs.readFileSync(route, 'utf8');
    if (!source.includes('ArticleShell') && !source.includes('IssueArticle')) errors.push(`${article.slug}: route does not use publication shell`);
    const structuredSource = source.includes('IssueArticle') ? fs.readFileSync(path.join(root, 'app/components/IssueArticle.tsx'), 'utf8') : source;
    if (!structuredSource.includes('application/ld+json')) errors.push(`${article.slug}: route lacks structured article data`);
    if (!structuredSource.includes('datePublished: article.publishedAt')) errors.push(`${article.slug}: structured datePublished must use publishedAt`);
  }
}

for (const entry of fs.readdirSync(path.join(root, 'app/articles'), { withFileTypes: true })) {
  if (entry.isDirectory() && fs.existsSync(path.join(root, 'app/articles', entry.name, 'page.tsx')) && !slugs.has(entry.name)) errors.push(`${entry.name}: route has no registry entry`);
}

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
