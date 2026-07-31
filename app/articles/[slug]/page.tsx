import type { Metadata } from 'next';
import { HistoricalArticle } from '../../components/HistoricalArticle';
import { historicalIssues } from '../../lib/historicalCatalog';
import { getArticle } from '../../lib/articles';

export const dynamicParams=false;
export function generateStaticParams(){return historicalIssues.map(({slug})=>({slug}));}
export function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{return params.then(({slug})=>{const article=getArticle(slug);return{title:article.title,description:article.description,alternates:{canonical:`/articles/${slug}`},openGraph:{type:'article',title:article.title,description:article.description,publishedTime:article.publishedAt,modifiedTime:article.updatedAt||article.publishedAt}}});}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;return <HistoricalArticle slug={slug}/>;}
