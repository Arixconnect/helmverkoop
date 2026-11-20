import { z } from "zod";

const text = z.string().trim().min(1);
export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}(?:T.*)?$/).refine(value => Number.isFinite(Date.parse(value)));
const https = z.url({ protocol: /^https$/ });
const internal = z.string().regex(/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/);
const image = z.union([z.string().regex(/^\/images\/[\w.-]+$/), z.url({protocol: /^https$/, hostname: /^cdn\.sanity\.io$/})]);
const link = z.object({label: text, href: internal});
export const sourceSchema = z.object({label: text, href: https});
export const categorySchema = z.object({slug, name: text, description: text, image});
export const faqSchema = z.object({question: text, answer: text, category: text});
export const authorSchema = z.object({name: text, slug, biography: text, photo: image.nullish(), credentials: z.string().nullish()});
const blockSchema = z.object({
  _type: z.literal("block"),
  style: z.enum(["normal", "h2", "h3"]),
  children: z.array(z.object({_type: z.literal("span"), text: z.string(), marks: z.array(z.enum(["strong","em"])).default([])})).min(1),
});
export const articleSchema = z.object({
  slug, title: text, excerpt: text, coverImage: image, coverAlt: text, body: z.array(blockSchema).min(1),
  category: slug, author: authorSchema, publishedAt: date, updatedAt: date, reviewedAt: date,
  sources: z.array(sourceSchema).min(1), relatedProducts: z.array(slug), relatedArticles: z.array(slug),
  seoTitle: text, seoDescription: text, canonicalUrl: https.nullish(), noindex: z.boolean(),
});
export const legalSchema = z.object({
  title: text, status: z.enum(["current","proposed"]), effectiveDate: date.nullish(), reviewedAt: date,
  sourceUrl: https, summary: text,
});
export const homepageSchema = z.object({
  heroHeadline: text, heroDescription: text, heroImage: image, heroCta: link,
  featuredProducts: z.array(slug), featuredCategories: z.array(slug), featuredArticles: z.array(slug),
  contentSections: z.array(z.object({title:text, body:text})),
});
export const settingsSchema = z.object({
  brandName: text, announcement: text, logo: image.nullish(), contactEmail: z.email().nullish(),
  socialLinks: z.array(sourceSchema), navigation: z.array(link), footer: z.array(link),
  defaultSeo: z.object({title:text, description:text}), legalDetails: z.string().nullish(),
});
export type Article = z.infer<typeof articleSchema>;
export type Author = z.infer<typeof authorSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Faq = z.infer<typeof faqSchema>;
export type LegalUpdate = z.infer<typeof legalSchema>;
export type Homepage = z.infer<typeof homepageSchema>;
export type SiteSettings = z.infer<typeof settingsSchema>;
