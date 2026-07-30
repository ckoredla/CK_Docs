const topics = [
  ['Airline Maintenance', 'AI, telemetry, predictive maintenance, MRO modernization, and operational reliability.'],
  ['Enterprise AI', 'Practical patterns for agents, RAG, governance, evaluation, and safe production adoption.'],
  ['AWS Architecture', 'Plain-English breakdowns of resilient, event-driven, cloud-native systems.']
];

export default function HomePage() {
  return (
    <main>
      <nav>
        <div className="brand">AVIATION AI MODERNIZATION</div>
        <div className="navlinks"><a href="#research">Research</a><a href="/articles/ai-aircraft-maintenance">Articles</a><a href="#about">About</a></div>
      </nav>
      <section className="hero">
        <div className="kicker">Enterprise AI · Aviation · AWS</div>
        <h1>Complex systems, explained without the usual cloud-shaped fog.</h1>
        <p className="lead">Independent technical research on modernizing airline maintenance and mission-critical enterprise platforms with AI, event-driven architecture, and AWS.</p>
        <a className="cta" href="/articles/ai-aircraft-maintenance">Read the first article →</a>
      </section>
      <section id="research" className="grid">
        {topics.map(([title, copy]) => <article className="card" key={title}><div className="kicker">Focus area</div><h3>{title}</h3><p>{copy}</p></article>)}
      </section>
      <footer id="about">Written for engineering leaders and builders responsible for systems that cannot casually “try turning production off and on again.”</footer>
    </main>
  );
}
