const topics = [
  {
    index: '01',
    title: 'Aviation Maintenance',
    copy: 'Aircraft health, reliability, telemetry, predictive maintenance, and maintenance-control modernization.'
  },
  {
    index: '02',
    title: 'MRO Modernization',
    copy: 'Digital work packages, parts intelligence, technician workflows, planning, and legacy-system renewal.'
  },
  {
    index: '03',
    title: 'Enterprise AI & AWS',
    copy: 'Event-driven systems, governed AI, data platforms, and resilient cloud architecture for regulated operations.'
  }
];

const publications = [
  {
    date: 'July 2026',
    title: 'Building a Modern Aircraft Maintenance Intelligence Platform',
    href: '/articles/2026-07-aircraft-maintenance-intelligence-platform',
    summary: 'A reference architecture for turning aircraft telemetry, maintenance history, and operational context into explainable maintenance decisions.',
    type: 'Reference Architecture',
    readTime: '14 min'
  },
  {
    date: 'June 2026',
    title: 'AI-Assisted Maintenance Control Without Losing Human Authority',
    href: '/articles/2026-06-ai-assisted-maintenance-control',
    summary: 'A practical operating model for evidence-aware AI assistance while preserving licensed review, accountability, and approved maintenance authority.',
    type: 'Operating Model',
    readTime: '12 min'
  },
  {
    date: 'Research Brief',
    title: 'How AI Is Quietly Transforming Aircraft Maintenance',
    href: '/articles/ai-aircraft-maintenance',
    summary: 'A practical guide to using AI in maintenance without confusing prediction with operational truth.',
    type: 'Field Note',
    readTime: '9 min'
  }
];

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function HomePage() {
  return (
    <main>
      <nav className="masthead">
        <a className="brand" href="#top" aria-label="Northbound Labs home">
          <span className="brand-mark">N</span>
          <span>NORTHBOUND LABS</span>
        </a>
        <div className="edition">Independent aviation systems journal · Est. 2026</div>
        <div className="navlinks">
          <a href="#research">Research</a>
          <a href="#publications">Archive</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <div className="layout" id="top">
        <div className="main-column">
          <section className="hero">
            <div className="issue-line">
              <span>ISSUE 001</span>
              <span>FRISCO · JULY 2026</span>
            </div>
            <p className="eyebrow">Aviation systems · Maintenance operations · Applied intelligence</p>
            <h1>Engineering the systems that keep aircraft moving.</h1>
            <div className="hero-bottom">
              <p className="lead">Northbound Labs studies the machinery behind modern aviation: maintenance control, MRO platforms, aircraft telemetry, reliability engineering, and the cloud systems connecting them.</p>
              <a className="text-link" href="#publications">Open the archive <span>↘</span></a>
            </div>
          </section>

          <section id="research" className="research-index" aria-labelledby="research-title">
            <header className="section-header">
              <span>Research desk</span>
              <h2 id="research-title">Three operating domains</h2>
            </header>
            <div className="topic-list">
              {topics.map((topic) => (
                <article className="topic-row" key={topic.title}>
                  <span className="topic-index">{topic.index}</span>
                  <h3>{topic.title}</h3>
                  <p>{topic.copy}</p>
                  <span className="topic-arrow">↗</span>
                </article>
              ))}
            </div>
          </section>

          <section id="publications" className="publications" aria-labelledby="archive-title">
            <header className="section-header archive-header">
              <span>Publication log</span>
              <div>
                <h2 id="archive-title">The maintenance archive</h2>
                <p>A retrospective archive tracing aviation maintenance and enterprise technology from 2017 to the present. Most years will contain twelve monthly studies plus one or two special editions where the subject deserves more room. Historical pieces are assembled and published in 2026, then labeled plainly.</p>
              </div>
            </header>

            <div className="publication-list">
              {publications.map((item, index) => (
                <a className="publication" href={item.href} key={item.href}>
                  <div className="publication-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="publication-date">{item.date}</div>
                  <div className="publication-copy">
                    <div className="publication-meta"><span>{item.type}</span><span>{item.readTime}</span></div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <span className="publication-arrow">↗</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <aside className="year-rail" aria-label="Archive by year">
          <div className="rail-sticky">
            <div className="rail-label">Archive index</div>
            <div className="rail-current">
              <span>Current issue</span>
              <strong>2026.07</strong>
            </div>
            <div className="year-list">
              {years.map((year) => (
                <details key={year} open={year === 2026}>
                  <summary>
                    <span>{year}</span>
                    <span>{year === 2026 ? '7+ issues' : '12–14 issues'}</span>
                  </summary>
                  <div className="month-grid">
                    {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map((month) => (
                      <span className={year === 2026 && (month === 'JUN' || month === 'JUL') ? 'active-month' : ''} key={month}>{month}</span>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            <div className="rail-note">The active archive now extends through 2017. Special editions will be added selectively for architecture, reliability, regulation, and major industry transitions.</div>
          </div>
        </aside>
      </div>

      <footer id="about" className="site-footer">
        <div><span className="brand-mark small">N</span> Northbound Labs</div>
        <p>Independent research for people responsible for aviation systems where “restart it and hope” is not an operating model.</p>
        <div>Research · Architecture · Field notes</div>
      </footer>
    </main>
  );
}
