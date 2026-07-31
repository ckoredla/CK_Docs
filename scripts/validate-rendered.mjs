import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();const articleRoot=path.join(root,'.next/server/app/articles');const errors=[];
const expectedProfiles=new Map([['2017-12-rotable-history','component-lifecycle'],['2026-01-maintenance-decision-brief','maintenance-control'],['2025-03-repeat-defect-case-detection','defect-investigation'],['2025-09-digital-task-card-control','work-execution'],['2025-10-mro-cloud-migration','cloud-platform'],['2025-12-maintenance-copilot-boundaries','knowledge-assistance'],['2026-03-ai-agent-assurance','governance']]);
const files=[];const familyCoverage=new Set();const modes=new Set();const profiles=new Set();const walk=(directory)=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())walk(target);else if(entry.name.endsWith('.html'))files.push(target);}};walk(articleRoot);
if(files.length!==140)errors.push(`expected 140 rendered article pages, found ${files.length}`);
for(const file of files){const html=fs.readFileSync(file,'utf8');const slug=path.basename(file,'.html');const figures=(html.match(/<figure/g)||[]).length;const families=[...html.matchAll(/data-visual-family="([^"]+)"/g)].map(match=>match[1]);const articleProfiles=[...html.matchAll(/data-visual-profile="([^"]+)"/g)].map(match=>match[1]);const mode=html.match(/data-publication-mode="([^"]+)"/)?.[1];const text=html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ');const words=(text.match(/[A-Za-z][A-Za-z'-]*/g)||[]).length;
  if(figures<4||figures>5)errors.push(`${slug}: expected 4–5 rendered figures, found ${figures}`);
  if(families.length!==4)errors.push(`${slug}: expected four design-system visuals, found ${families.length}`);
  if(/class="publication-visual pv-(?!family-)/.test(html))errors.push(`${slug}: visual frame uses an unnamespaced family class`);
  if(new Set(families).size<3)errors.push(`${slug}: visual story uses fewer than three families (${families.join(', ')})`);
  if(!mode)errors.push(`${slug}: missing publication mode`);else modes.add(mode);
  if(articleProfiles.length!==4||new Set(articleProfiles).size!==1)errors.push(`${slug}: expected one coherent content profile across four visuals`);else profiles.add(articleProfiles[0]);
  if(expectedProfiles.has(slug)&&articleProfiles[0]!==expectedProfiles.get(slug))errors.push(`${slug}: expected ${expectedProfiles.get(slug)} visual plan, found ${articleProfiles[0]}`);
  if(families.includes('aws-architecture')&&articleProfiles[0]!=='cloud-platform')errors.push(`${slug}: AWS architecture used outside the cloud-platform profile`);
  if((html.match(/data-visual-question="[^"]+"/g)||[]).length!==4)errors.push(`${slug}: each visual must state its technical question`);
  families.forEach((family)=>familyCoverage.add(family));
  if(words<800)errors.push(`${slug}: expected at least 800 rendered words, found ${words}`);
  for(const marker of ['Issue','Published','References','Related articles','Article navigation'])if(!html.includes(marker))errors.push(`${slug}: missing rendered ${marker}`);
  if(!html.includes('datePublished'))errors.push(`${slug}: missing rendered datePublished structured data`);
}
const expectedFamilies=['aws-architecture','architecture','topology','dashboard','timeline','decision-tree','heatmap','service-blueprint','journey-map','knowledge-graph','aircraft','metrics','infographic','risk','table'];for(const family of expectedFamilies)if(!familyCoverage.has(family))errors.push(`design-system family not rendered: ${family}`);if(modes.size<8)errors.push(`expected all 8 publication modes, found ${modes.size}`);if(profiles.size<7)errors.push(`expected broad content-aware profile coverage, found ${profiles.size}`);
const sitemapPath=path.join(root,'.next/server/app/sitemap.xml.body');if(!fs.existsSync(sitemapPath))errors.push('rendered sitemap is missing');else{const sitemap=fs.readFileSync(sitemapPath,'utf8');const urls=(sitemap.match(/<url>/g)||[]).length;if(urls!==141)errors.push(`expected 141 sitemap URLs, found ${urls}`);if(!sitemap.includes('/articles/2017-01-technical-record-digitization'))errors.push('January 2017 missing from sitemap');}
if(errors.length){console.error(`Rendered publication validation failed (${errors.length})\n- ${errors.join('\n- ')}`);process.exit(1);}console.log(`Rendered publication validation passed: ${files.length} articles, ${familyCoverage.size} visual families, ${profiles.size} content-aware profiles, explicit technical questions, AWS diagrams restricted to cloud topics, substantive text, metadata, navigation, references, and 141 sitemap URLs.`);
