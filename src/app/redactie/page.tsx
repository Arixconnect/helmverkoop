import {notFound} from "next/navigation";
import {draftMode} from "next/headers";
import {pageMeta} from "@/lib/seo";
import "@/styles/editorial.css";
export const metadata = pageMeta("Redactiepreview","Besloten voorvertoning voor de redactie.","/redactie",{noindex:true});
export default async function PreviewLogin() {
  if (process.env.CMS_MODE !== "SANITY" || !process.env.SANITY_READ_TOKEN || !process.env.SANITY_PREVIEW_SECRET) notFound();
  const {isEnabled} = await draftMode();
  return <div className="wrap ed"><header className="ed-index-head"><h1>Redactiepreview</h1><p>Bekijk concepten in deze browser. Sluit de preview na het controleren van je werk.</p></header>
    <form action="/api/redactie/preview" method="post" className="ed-editor-form">
      <label>Redactiecode<input name="secret" type="password" required autoComplete="current-password"/></label>
      <label>Voorbeeldpad<input name="path" defaultValue="/kenniscentrum" required spellCheck={false}/></label>
      <button className="ed-button" type="submit" name="action" value="open">Open conceptweergave</button>
      {isEnabled && <button type="submit" name="action" value="close">Sluit conceptweergave</button>}
    </form>
  </div>;
}
