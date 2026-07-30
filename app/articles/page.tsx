import { archiveArticles } from '../../data/archive';

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
}).format(new Date(`${value}T00:00:00Z`));

export const metadata = {
  title: 'Article Archive | Aviation AI Modernization',
  description: 'A monthly technology archive covering cloud, platforms, distributed systems, enterprise AI, agents, and forward deployed engineering from 2020 through July 2026.'
};

export default function ArticlesPage() {
  const years = [...new Set(archiveArticles.map((article) => article.date.slice(0, 4)))];

  return (
    <main>
      <nav>
        <a className="brand" href="/">AVIATION AI MODERNIZATION</a>
        <div className="navlinks"><a href="/">Home</a><a href="#archive">Archive</a></div>
      </nav>

      <section className="archiveHero">
        <div className="kicker">79 monthly field notes · January 2020 to July 2026</div>
        <h1>Technology evolution, without rewriting history.</h1>
        <p className="lead">The archive follows the industry's shift from cloud foundations and platform engineering to generative AI, agents, deployment engineering, and the renewed demand for forward deployed engineers.</p>
        <div className="archiveNotice"><strong>Archive disclosure:</strong> These are retrospective field notes assembled in July 2026 and assigned an archive month to present the technology sequence clearly. The dates do not claim the pages existed online in those earlier months.</div>
      </section>

      <section id="archive">
        {years.map((year) => (
          <div className="yearBlock" key={year}>
            <div className="yearHeading"><h2>{year}</h2><span>{archiveArticles.filter((article) => article.date.startsWith(year)).length} articles</span></div>
            <div className="archiveGrid">
              {archiveArticles.filter((article) => article.date.startsWith(year)).map((article) => (
                <a className="archiveCard" href={`/articles/${article.slug}`} key={article.slug}>
                  <div className="archiveMeta"><time dateTime={article.date}>{formatDate(article.date)}</time><span>{article.category}</span></div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <strong>Read field note →</strong>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
