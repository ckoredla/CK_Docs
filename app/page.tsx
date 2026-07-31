const topics = [
  ['Aviation Maintenance', 'Aircraft health, reliability, telemetry, predictive maintenance, and maintenance-control modernization.'],
  ['MRO Modernization', 'Practical architectures for digital work packages, parts intelligence, technician workflows, and legacy-system renewal.'],
  ['Enterprise AI & AWS', 'Production patterns for event-driven systems, governed AI, data platforms, and resilient cloud architecture.']
];

const publications = [
  {
    date: 'July 2026',
    title: 'Building a Modern Aircraft Maintenance Intelligence Platform',
    href: '/articles/2026-07-aircraft-maintenance-intelligence-platform',
    summary: 'A reference architecture for turning aircraft telemetry, maintenance history, and operational context into explainable maintenance decisions.'
  },
  {
    date: 'Research Brief',
    title: 'How AI Is Quietly Transforming Aircraft Maintenance',
    href: '/articles/ai-aircraft-maintenance',
    summary: 'A practical guide to using AI in maintenance without confusing prediction with operational truth.'
  }
];

export default function HomePage() {
  return (
    <main>
      <nav>
        <div className="brand">NORTHBOUND LABS</div>
        <div className="navlinks"><a href="#research">Research</a><a href="#publications">Articles</a><a href="#about">About</a></div>
      </nav>
      <section className="hero">
        <div className="kicker">Aviation · MRO · AI · Enterprise Architecture</div>
        <h1>Complex systems, explained without the usual cloud-shaped fog.</h1>
        <p className="lead">Independent research and practical architecture guidance for aviation maintenance, MRO modernization, aircraft telemetry, enterprise AI, and resilient cloud platforms.</p>
        <a className="cta" href="#publications">Explore the research →</a>
      </section>
      <section id="research" className="grid">
        {topics.map(([title, copy]) => <article className="card" key={title}><div className="kicker">Focus area</div><h3>{title}</h3><p>{copy}</p></article>)}
      </section>
      <section id="publications" className="publications">
        <div className="kicker">Latest publications</div>
        <h2>Research archive</h2>
        <p className="section-intro">A monthly retrospective archive tracing the evolution of aviation maintenance technology from 2019 to the present. Archive articles are assembled and published by Northbound Labs in 2026 and are clearly labeled as retrospective research.</p>
        <div className="publication-list">
          {publications.map((item) => (
            <a className="publication" href={item.href} key={item.href}>
              <div className="publication-date">{item.date}</div>
              <div><h3>{item.title}</h3><p>{item.summary}</p></div>
              <span>→</span>
            </a>
          ))}
        </div>
      </section>
      <footer id="about">Northbound Labs publishes independent research for engineering leaders and builders responsible for aviation and enterprise systems that cannot casually “try turning production off and on again.”</footer>
    </main>
  );
}
