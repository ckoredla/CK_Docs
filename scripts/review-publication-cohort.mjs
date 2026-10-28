import fs from 'node:fs';
import path from 'node:path';

const from=Number(process.argv[2]||2023);
const through=Number(process.argv[3]||2026);
const root=process.cwd();
const articleRoot=path.join(root,'.next/server/app/articles');
const files=[];
const walk=directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())walk(target);else if(entry.name.endsWith('.html'))files.push(target)}};
walk(articleRoot);

const results=[];
for(const file of files){
  const slug=path.basename(file,'.html');
  const year=Number(slug.slice(0,4));
  if(!Number.isFinite(year)||year<from||year>through)continue;
  const html=fs.readFileSync(file,'utf8');
  const plain=html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ');
  const words=(plain.match(/[A-Za-z][A-Za-z'-]*/g)||[]).length;
  const families=[...html.matchAll(/data-visual-family="([^"]+)"/g)].map(match=>match[1]);
  const questions=[...html.matchAll(/data-visual-question="([^"]+)"/g)].map(match=>match[1]);
  const figures=(html.match(/<figure/g)||[]).length;
  const captions=(html.match(/<figcaption/g)||[]).length;
  const code=html.includes('implementation-sketch');
  const failures=[];
  if(words<800)failures.push(`only ${words} words`);
  if(figures<2||figures>5)failures.push(`${figures} figures`);
  if(families.length<2||families.length>4)failures.push(`${families.length} selected visuals`);
  if(new Set(families).size!==families.length)failures.push('repeated visual family');
  if(questions.length!==families.length||new Set(questions).size!==questions.length)failures.push('missing or repeated technical question');
  if(captions<figures)failures.push('figure without caption');
  if(!html.includes('qualified')&&!html.includes('authority'))failures.push('authority boundary absent');
  if(!html.includes('References'))failures.push('references absent');
  if(!html.includes('Article navigation'))failures.push('archive navigation absent');
  if(html.includes('Amazon Bedrock eligible')&&year<2023)failures.push('Bedrock used before availability');
  if(html.includes('ShowcaseFigures'))failures.push('fixed showcase figure rendered');
  results.push({slug,year,words,figures,families,code,failures});
}

const failed=results.filter(result=>result.failures.length);
for(const result of results.sort((a,b)=>b.slug.localeCompare(a.slug))){
  const disposition=result.failures.length?`FAIL — ${result.failures.join('; ')}`:'PASS';
  console.log(`${disposition}\t${result.slug}\t${result.words} words\t${result.figures} figures\t${result.families.join(' > ')}\tpseudocode:${result.code?'yes':'no'}`);
}
console.log(`\nCohort review ${from}–${through}: ${results.length-failed.length}/${results.length} passed.`);
if(failed.length)process.exit(1);
