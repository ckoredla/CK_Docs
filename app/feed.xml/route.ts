import { articles, formatIssue } from '../lib/articles';
const xml = (value: string) => value.replace(/[<>&'\"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
export function GET() {
  const items = articles.map((a) => `<item><title>${xml(a.title)}</title><link>https://northboundlabs.ai/articles/${a.slug}</link><guid>https://northboundlabs.ai/articles/${a.slug}</guid><description>${xml(`${formatIssue(a.issueDate)} — ${a.summary}`)}</description><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0"?><rss version="2.0"><channel><title>Northbound Labs</title><link>https://northboundlabs.ai</link><description>Aviation maintenance engineering journal</description>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
