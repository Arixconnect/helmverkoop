import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {schemaTypes} from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error("Vul SANITY_STUDIO_PROJECT_ID en SANITY_STUDIO_DATASET in.");

const singletons = [{id:"homepage",label:"Homepage"},{id:"siteSettings",label:"Website-instellingen"}];
export default defineConfig({
  name:"redactie",title:"Fatbikehelm Nederland · Redactie",projectId,dataset,
  plugins:[structureTool({structure:S=>S.list().title("Redactie").items([
    ...singletons.map(({id,label})=>S.listItem().title(label).id(id).child(S.document().schemaType(id).documentId(id))),
    S.divider(),...S.documentTypeListItems().filter(item=>!singletons.some(s=>s.id===item.getId())),
  ])})],
  document:{
    newDocumentOptions:(templates)=>templates.filter(t=>!singletons.some(s=>s.id===t.templateId)),
    actions:(actions,context)=>singletons.some(s=>s.id===context.schemaType)?actions.filter(a=>a.action!=="duplicate" && a.action!=="delete"):actions,
  },
  schema:{types:schemaTypes},
});
