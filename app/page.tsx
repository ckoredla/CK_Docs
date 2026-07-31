const topics = [
  { index: '01', title: 'AI for Maintenance Operations', copy: 'Evidence-grounded copilots, alert triage, chronic-defect analysis, predictive maintenance, and human-review safeguards.' },
  { index: '02', title: 'MRO & Work Management', copy: 'Work orders, task cards, digital work packages, planning, records, parts, technician workflows, and legacy-system renewal.' },
  { index: '03', title: 'Aircraft Systems & Reliability', copy: 'ATA chapters, aircraft health messages, alerts, repeat defects, component reliability, telemetry, and fleet engineering.' },
  { index: '04', title: 'Aviation Data & Cloud Architecture', copy: 'Event-driven platforms, AWS architectures, governed data products, system integration, observability, and resilient operations.' }
];

const publications = [
  { date: 'July 2026', title: 'Building a Modern Aircraft Maintenance Intelligence Platform', href: '/articles/2026-07-aircraft-maintenance-intelligence-platform', summary: 'A reference architecture for turning aircraft telemetry, maintenance history, and operational context into explainable maintenance decisions.', type: 'Reference Architecture', readTime: '14 min' },
  { date: 'June 2026', title: 'AI-Assisted Maintenance Control Without Losing Human Authority', href: '/articles/2026-06-ai-assisted-maintenance-control', summary: 'A practical operating model for evidence-aware AI assistance while preserving licensed review, accountability, and approved maintenance authority.', type: 'Operating Model', readTime: '12 min' },
  { date: 'Research Brief', title: 'How AI Is Quietly Transforming Aircraft Maintenance', href: '/articles/ai-aircraft-maintenance', summary: 'A practical guide to using AI in maintenance without confusing prediction with operational truth.', type: 'Field Note', readTime: '9 min' }
];

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const publishedMonths: Record<string, string> = {
  '2026-JUN': '/articles/2026-06-ai-assisted-maintenance-control',
  '2026-JUL': '/articles/2026-07-aircraft-maintenance-intelligence-platform'
};

export default function HomePage() {
  return (
    <main>
      <nav className="masthead">
        <a className="brand" href="#top" aria-label="Northbound Labs home"><span className="brand-mark">N</span><span>NORTHBOUND LABS</span></a>
        <div className="edition">Independent aviation maintenance, MRO & AI journal · Est. 2026</div>
        <div className="navlinks"><a href="#research">Research</a><a href="#publications">Archive</a><a href="#about">About</a></div>
      </nav>

      <div className="layout" id="top">
        <div className="main-column">
          <section className="hero">
            <div className="issue-line"><span>ISSUE 001</span><span>VOLUME 01 · JULY 2026</span></div>
            <p className="eyebrow">Aviation maintenance · MRO modernization · Applied AI · Reliability engineering</p>
            <h1>Modernizing the systems behind aircraft maintenance.</h1>
            <div className="hero-bottom">
              <p className="lead">Northbound Labs examines how AI, modern MRO platforms, aircraft telemetry, ATA-domain knowledge, reliability engineering, and cloud architecture can improve maintenance decisions while preserving traceability and qualified human review.</p>
              <a className="text-link" href="#publications">Open the archive <span>↘</span></a>
            </div>
          </section>

          <section id="research" className="research-index" aria-labelledby="research-title">
            <header className="section-header"><span>Research desk</span><h2 id="research-title">Four operating domains</h2></header>
            <div className="topic-list">
              {topics.map((topic) => <article className="topic-row" key={topic.title}><span className="topic-index">{topic.index}</span><h3>{topic.title}</h3><p>{topic.copy}</p><span className="topic-arrow">↗</span></article>)}
            </div>
          </section>

          <section id="publications" className="publications" aria-labelledby="archive-title">
            <header className="section-header archive-header"><span>Publication log</span><div><h2 id="archive-title">The aviation maintenance archive</h2><p>A retrospective archive covering AI in MRO, ATA systems, alerts and health messages, chronic and repeat defects, work-order management, digital work packages, reliability, parts, records, planning, telemetry, and aviation-platform modernization from 2017 to the present. Historical pieces are assembled and published in 2026, then labeled plainly.</p></div></header>
            <div className="publication-list">
              {publications.map((item, index) => <a className="publication" href={item.href} key={item.href}><div className="publication-number">{String(index + 1).padStart(2, '0')}</div><div className="publication-date">{item.date}</div><div className="publication-copy"><div className="publication-meta"><span>{item.type}</span><span>{item.readTime}</span></div><h3>{item.title}</h3><p>{item.summary}</p></div><span className="publication-arrow">↗</span></a>)}
            </div>
          </section>
        </div>

        <aside className="year-rail" aria-label="Archive by year"><div className="rail-sticky"><div className="rail-label">Archive index</div><div className="rail-current"><span>Current issue</span><strong>2026.07</strong></div><div className="year-list">
          {years.map((year) => <details key={year} open={year === 2026}><summary><span>{year}</span><span>{year === 2026 ? 'In progress' : 'Planned collection'}</span></summary><div className="month-grid">{months.map((month) => { const href = publishedMonths[`${year}-${month}`]; return href ? <a className="month-link active-month" href={href} key={month}>{month}</a> : <span className="month-pending" title={`${month} ${year} research issue is in production`} key={month}>{month}</span>; })}</div></details>)}
        </div></div></aside>
      </div>

      <footer id="about" className="site-footer"><div><span className="brand-mark small">N</span> Northbound Labs</div><p>Independent research on aviation maintenance, MRO modernization, applied AI, aircraft systems, and the technology connecting operational evidence to human decisions.</p><div>Research · Architecture · Field notes</div></footer>
    </main>
  );
}
