import {notFound} from "next/navigation";
import {Journal} from "@/components/content/Editorial";
import {getCategories, getArticles} from "@/lib/cms";
import {pageMeta} from "@/lib/seo";
type Props = {params:Promise<{slug:string}>};
async function category({params}:Props) {
  const {slug} = await params;
  const result = (await getCategories()).find(c=>c.slug===slug);
  if (!result) notFound();
  return result;
}
export async function generateMetadata(props:Props) {
  const c = await category(props);
  const noindex = !(await getArticles()).some(a=>a.category===c.slug);
  return pageMeta(c.name+" | Kenniscentrum",c.description,"/kenniscentrum/categorie/"+c.slug,{noindex,image:c.image});
}
export default async function Page(props:Props) {return <Journal active={(await category(props)).slug}/>;}

export async function generateStaticParams() {
  return process.env.CMS_MODE === "SANITY" ? [] : (await getCategories()).map(({slug})=>({slug}));
}
