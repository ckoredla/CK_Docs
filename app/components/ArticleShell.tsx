import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ArticleRecord } from '../lib/articles';
import { ArticleHeader, PreviousNextNavigation, RelatedArticles } from './Publication';

export function ArticleShell({ article, children }: { article: ArticleRecord; children: ReactNode }) {
  return <main><nav><Link className="brand" href="/">NORTHBOUND LABS</Link><div className="navlinks"><Link href="/">Home</Link><Link href="/#publications">Archive</Link><a href="#references">References</a></div></nav><article className="article"><ArticleHeader article={article} />{children}<RelatedArticles article={article} /><PreviousNextNavigation article={article} /></article></main>;
}
