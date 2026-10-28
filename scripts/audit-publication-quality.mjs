import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();const articleRoot=path.join(root,'.next/server/app/articles');
if(!fs.existsSync(articleRoot)){console.error('Build output missing. Run npm run build first.');process.exit(1)}
const files=[];const walk=directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);entry.isDirectory()?walk(target):entry.name.endsWith('.html')&&files.push(target)}};walk(articleRoot);
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ');
const rows=[];
for(const file of files){
  const html=fs.readFileSync(file,'utf8'),slug=path.basename(file,'.html'),text=strip(html),words=(text.match(/[A-Za-z][A-Za-z'-]*/g)||[]).length;
  const families=[...html.matchAll(/data-visual-family="([^"]+)"/g)].map(match=>match[1]);
  const references=(html.split('id="references"')[1]||html.split('<h2>Sources</h2>')[1]||html.split('<h2>References</h2>')[1]||'').split('Related articles')[0];
  const hrefs=[...references.matchAll(/href="(https?:\/\/[^"/]+)/g)].map(match=>match[1]);
  const checks={
    substantive:words>=800,
    structured:(html.match(/<h2/g)||[]).length>=5,
    purposefulVisuals:families.length>=2&&families.length<=4&&new Set(families).size>=2,
    visualQuestions:(html.match(/data-visual-question=/g)||[]).length===families.length,
    // Four references spanning at least two independent authoritative publishers
    // is a structural floor. Claim-level relevance is assessed in peer review;
    // counting extra domains would reward breadth without evidentiary quality.
    references:(references.match(/<li/g)||[]).length>=4&&new Set(hrefs).size>=2,
    limitations:/limitation|assumption|uncertainty|boundary/i.test(text),
    authority:/qualified|approved data|human authority|licensed|accountable role/i.test(text),
    navigation:html.includes('Continue through the archive')&&html.includes('article-nav-button'),
    accessibility:!families.some(f=>f.startsWith('flagship-'))||html.includes('nbl-flagship-transcript')
  };
  const passed=Object.values(checks).filter(Boolean).length;rows.push({slug,passed,total:Object.keys(checks).length,failed:Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name)});
}
const distribution=rows.reduce((out,row)=>{const grade=row.passed===row.total?'A':row.passed>=row.total-1?'B':'REVIEW';out[grade]=(out[grade]||0)+1;return out},{});
const failures=rows.filter(row=>row.failed.length);
console.log(JSON.stringify({articles:rows.length,distribution,failures},null,2));
if(files.length!==147||failures.length){process.exitCode=1}
