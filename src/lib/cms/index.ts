import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { z } from "zod";
import * as local from "@/data/editorial";
import { articleSchema, categorySchema, faqSchema, homepageSchema, settingsSchema, legalSchema } from "./types";

const image = (field: string) => `"${field}": ${field}.asset->url`;
const slug = '"slug": slug.current';
const queries = {
  articles: `*[_type=="article" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) {
    ${slug},title,excerpt,${image("coverImage")},"coverAlt":coverImage.alt,body,
    "author":author->{${slug},name,biography,${image("photo")},credentials},"category":category->slug.current,
    publishedAt,updatedAt,reviewedAt,sources[]{label,href},"relatedProducts":coalesce(relatedProducts,[]),
    "relatedArticles":coalesce(relatedArticles[]->slug.current,[]),seoTitle,seoDescription,canonicalUrl,"noindex":coalesce(noindex,false)
  }`,
  categories: `*[_type=="category"] | order(name) {${slug},name,description,${image("image")}}`,
  faqs: '*[_type=="faq"] | order(category,question) {question,answer,category}',
  legal: '*[_type=="legalUpdate"] | order(reviewedAt desc,title) {title,status,effectiveDate,reviewedAt,sourceUrl,summary}',
  homepage: `*[_type=="homepage" && _id in ["homepage","drafts.homepage"]][0] {
    heroHeadline,heroDescription,${image("heroImage")},heroCta,"featuredProducts":coalesce(featuredProducts,[]),
    "featuredCategories":coalesce(featuredCategories,[]),"featuredArticles":coalesce(featuredArticles[]->slug.current,[]),
    "contentSections":coalesce(contentSections,[])
  }`,
  settings: `*[_type=="siteSettings" && _id in ["siteSettings","drafts.siteSettings"]][0] {
    brandName,announcement,${image("logo")},contactEmail,"socialLinks":coalesce(socialLinks,[]),navigation,
    "footer":coalesce(footer,[]),defaultSeo,legalDetails
  }`,
};

async function read<T>(key: keyof typeof queries, schema: z.ZodType<T>, seed: T): Promise<T> {
  if (process.env.CMS_MODE !== "SANITY") return seed;
  const project = process.env.SANITY_PROJECT_ID ?? "";
  const dataset = process.env.SANITY_DATASET ?? "";
  if (!/^[a-z0-9]+$/.test(project) || !/^[a-z0-9][a-z0-9_-]*$/.test(dataset)) {
    throw new Error("Vul een geldig Sanity-project en dataset in om CMS_MODE=SANITY te gebruiken.");
  }
  const preview = (await draftMode()).isEnabled;
  const token = process.env.SANITY_READ_TOKEN;
  if (preview && !token) throw new Error("Een lezerstoken is vereist voor de redactiepreview.");
  const url = new URL(`https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set("query", queries[key]);
  url.searchParams.set("perspective", preview ? "drafts" : "published");
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    ...(preview ? {cache:"no-store" as const} : { next:{revalidate:300} }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Sanity kan ${key} niet ophalen (HTTP ${response.status}).`);
  const result = schema.safeParse((await response.json()).result);
  if (!result.success) throw new Error(`De CMS-inhoud voor ${key} is onvolledig. Controleer de verplichte publicatievelden.`);
  return result.data;
}
export const getArticles = cache(()=>read("articles", articleSchema.array(), local.articles));
export const getCategories = cache(()=>read("categories", categorySchema.array(), local.categories));
export const getFaqs = cache(()=>read("faqs", faqSchema.array(), local.faqs));
export const getLegalUpdates = cache(()=>read("legal", legalSchema.array(), local.legalUpdates));
export const getHomepage = cache(()=>read("homepage", homepageSchema, local.homepage));
export const getSettings = cache(()=>read("settings", settingsSchema, local.settings));
export async function getArticle(slug: string) {
  return (await getArticles()).find(article=>article.slug===slug);
}
