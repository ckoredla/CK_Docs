import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();const articleRoot=path.join(root,'.next/server/app/articles');const errors=[];
const expectedProfiles=new Map([['2017-12-rotable-history','component-lifecycle'],['2026-01-maintenance-decision-brief','knowledge-assistance'],['2025-03-repeat-defect-case-detection','defect-investigation'],['2025-09-digital-task-card-control','work-execution'],['2025-10-mro-cloud-migration','cloud-platform'],['2025-12-maintenance-copilot-boundaries','knowledge-assistance'],['2026-03-ai-agent-assurance','governance'],['2026-11-maintenance-outcome-learning','outcome-learning']]);
const files=[];const familyCoverage=new Set();const familiesBySlug=new Map();const modes=new Set();const profiles=new Set();const walk=(directory)=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())walk(target);else if(entry.name.endsWith('.html'))files.push(target);}};walk(articleRoot);
if(files.length!==140)errors.push(`expected 140 rendered article pages, found ${files.length}`);
for(const file of files){const html=fs.readFileSync(file,'utf8');const slug=path.basename(file,'.html');const figures=(html.match(/<figure/g)||[]).length;const families=[...html.matchAll(/data-visual-family="([^"]+)"/g)].map(match=>match[1]);const articleProfiles=[...html.matchAll(/data-visual-profile="([^"]+)"/g)].map(match=>match[1]);const mode=html.match(/data-publication-mode="([^"]+)"/)?.[1];const text=html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ');const words=(text.match(/[A-Za-z][A-Za-z'-]*/g)||[]).length;
  if(figures<2||figures>5)errors.push(`${slug}: expected 2–5 purposeful rendered figures, found ${figures}`);
  if(families.length<2||families.length>4)errors.push(`${slug}: expected two to four selected design-system visuals, found ${families.length}`);
  if(/class="publication-visual pv-(?!family-)/.test(html))errors.push(`${slug}: visual frame uses an unnamespaced family class`);
  if(new Set(families).size<2)errors.push(`${slug}: visual story repeats one family without adding a distinct information model (${families.join(', ')})`);
  if(!mode)errors.push(`${slug}: missing publication mode`);else modes.add(mode);
  if(articleProfiles.length!==families.length||new Set(articleProfiles).size!==1)errors.push(`${slug}: expected one coherent content profile across selected visuals`);else profiles.add(articleProfiles[0]);
  if(expectedProfiles.has(slug)&&articleProfiles[0]!==expectedProfiles.get(slug))errors.push(`${slug}: expected ${expectedProfiles.get(slug)} visual plan, found ${articleProfiles[0]}`);
  if(families.includes('aws-architecture')&&articleProfiles[0]!=='cloud-platform')errors.push(`${slug}: AWS architecture used outside the cloud-platform profile`);
  if((html.match(/data-visual-question="[^"]+"/g)||[]).length!==families.length)errors.push(`${slug}: each visual must state its technical question`);
  families.forEach((family)=>familyCoverage.add(family));
  familiesBySlug.set(slug,families);
  if(words<800)errors.push(`${slug}: expected at least 800 rendered words, found ${words}`);
  for(const marker of ['Issue','Published','References','Related articles','Article navigation'])if(!html.includes(marker))errors.push(`${slug}: missing rendered ${marker}`);
  if(!html.includes('datePublished'))errors.push(`${slug}: missing rendered datePublished structured data`);
  if(!html.includes('Continue through the archive')||!html.includes('article-nav-button'))errors.push(`${slug}: missing explicit previous/next article navigation`);
}
if(!familyCoverage.has('aws-architecture'))errors.push('AWS architecture family is not rendered');if([...familyCoverage].filter(family=>family.startsWith('lab-')).length<7)errors.push('approved Technical Visualization Laboratory components are not broadly connected to articles');for(const synthetic of ['metrics','heatmap','risk','dashboard'])if(familyCoverage.has(synthetic))errors.push(`synthetic ${synthetic} visual rendered without an article dataset`);if(familyCoverage.size<10)errors.push(`expected at least 10 purposeful visual families, found ${familyCoverage.size}`);if(modes.size<8)errors.push(`expected all 8 publication modes, found ${modes.size}`);if(profiles.size<10)errors.push(`expected broad content-aware profile coverage, found ${profiles.size}`);
const compared=['2026-06-ai-assisted-maintenance-control','2026-01-maintenance-decision-brief'].map(slug=>familiesBySlug.get(slug)||[]);if(compared[0].some(family=>compared[1].includes(family)))errors.push('AI maintenance control and maintenance decision brief still reuse the same diagram families');
const storyCounts=new Map();for(const families of familiesBySlug.values()){const story=families.join(' > ');storyCounts.set(story,(storyCounts.get(story)||0)+1)}for(const [story,count] of storyCounts)if(count>8)errors.push(`visual story reused by ${count} articles: ${story}`);
const sitemapPath=path.join(root,'.next/server/app/sitemap.xml.body');if(!fs.existsSync(sitemapPath))errors.push('rendered sitemap is missing');else{const sitemap=fs.readFileSync(sitemapPath,'utf8');const urls=(sitemap.match(/<url>/g)||[]).length;if(urls!==141)errors.push(`expected 141 sitemap URLs, found ${urls}`);if(!sitemap.includes('/articles/2017-01-technical-record-digitization'))errors.push('January 2017 missing from sitemap');}
if(errors.length){console.error(`Rendered publication validation failed (${errors.length})\n- ${errors.join('\n- ')}`);process.exit(1);}console.log(`Rendered publication validation passed: ${files.length} articles, ${familyCoverage.size} visual families, ${profiles.size} content-aware profiles, explicit technical questions, AWS diagrams restricted to cloud topics, substantive text, metadata, navigation, references, and 141 sitemap URLs.`);
