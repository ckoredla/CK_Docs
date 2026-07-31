import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();const articleRoot=path.join(root,'.next/server/app/articles');const errors=[];
const files=[];const walk=(directory)=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())walk(target);else if(entry.name.endsWith('.html'))files.push(target);}};walk(articleRoot);
if(files.length!==120)errors.push(`expected 120 rendered article pages, found ${files.length}`);
for(const file of files){const html=fs.readFileSync(file,'utf8');const slug=path.basename(file,'.html');const figures=(html.match(/<figure/g)||[]).length;const text=html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ');const words=(text.match(/[A-Za-z][A-Za-z'-]*/g)||[]).length;
  if(figures<4||figures>5)errors.push(`${slug}: expected 4–5 rendered figures, found ${figures}`);
  if(words<800)errors.push(`${slug}: expected at least 800 rendered words, found ${words}`);
  for(const marker of ['Issue','Published','References','Related articles','Article navigation'])if(!html.includes(marker))errors.push(`${slug}: missing rendered ${marker}`);
  if(!html.includes('datePublished'))errors.push(`${slug}: missing rendered datePublished structured data`);
}
const sitemapPath=path.join(root,'.next/server/app/sitemap.xml.body');if(!fs.existsSync(sitemapPath))errors.push('rendered sitemap is missing');else{const sitemap=fs.readFileSync(sitemapPath,'utf8');const urls=(sitemap.match(/<url>/g)||[]).length;if(urls!==121)errors.push(`expected 121 sitemap URLs, found ${urls}`);if(!sitemap.includes('/articles/2017-01-technical-record-digitization'))errors.push('January 2017 missing from sitemap');}
if(errors.length){console.error(`Rendered publication validation failed (${errors.length})\n- ${errors.join('\n- ')}`);process.exit(1);}console.log(`Rendered publication validation passed: ${files.length} articles, 4–5 figures each, substantive text, metadata, navigation, references, and 121 sitemap URLs.`);
