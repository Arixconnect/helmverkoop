import {defineArrayMember, defineField, defineType} from "sanity";

const line = (name: string, title: string) => defineField({name,title,type:"string",validation:r=>r.required()});
const prose = (name: string, title: string) => defineField({name,title,type:"text",rows:3,validation:r=>r.required()});
const date = (name: string, title: string) => defineField({name,title,type:"datetime",validation:r=>r.required()});
const slug = (source: string) => defineField({name:"slug",title:"Webadres",type:"slug",options:{source},validation:r=>r.required().custom(value=>!value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) || "Gebruik kleine letters, cijfers en koppeltekens.")});
const picture = (name:string,title:string,required = true) => defineField({
  name,title,type:"image",options:{hotspot:true},fields:[line("alt","Beeldbeschrijving")],
  validation:r=>required?r.required():r,
});
const reference = (name:string,title:string,to:string) => defineField({name,title,type:"reference",to:[{type:to}],validation:r=>r.required()});
const refs = (name:string,title:string,to:string) => defineField({name,title,type:"array",of:[defineArrayMember({type:"reference",to:[{type:to}]})],validation:r=>r.unique()});
const handles = (name:string,title:string) => defineField({
  name,title,type:"array",of:[defineArrayMember({type:"string",validation:r=>r.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)})],
  description:"Gebruik de slug uit de winkelcatalogus.",validation:r=>r.unique(),
});
const url = (name:string,title:string) => defineField({name,title,type:"url",validation:r=>r.required().uri({scheme:["https"]})});
const internalLink = defineType({name:"internalLink",title:"Interne link",type:"object",fields:[
  line("label","Tekst"),defineField({name:"href",title:"Pad binnen de website",type:"string",validation:r=>r.required().regex(/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/)}),
]});
const source = defineType({name:"source",title:"Bron of externe link",type:"object",fields:[line("label","Naam van de bron"),url("href","Bronadres")]});
const article = defineType({
  name:"article",title:"Artikelen",type:"document",groups:[{name:"story",title:"Artikel",default:true},{name:"review",title:"Broncontrole"},{name:"search",title:"Vindbaarheid"}],
  fields:[
    {...line("title","Titel"),group:"story"},{...slug("title"),group:"story"},{...prose("excerpt","Direct antwoord / intro"),group:"story"},
    {...picture("coverImage","Omslagbeeld"),group:"story"},
    defineField({name:"body",title:"Artikeltekst",group:"story",type:"array",validation:r=>r.required().min(1),
      of:[defineArrayMember({type:"block",styles:[{title:"Alinea",value:"normal"},{title:"Tussenkop",value:"h2"},{title:"Subkop",value:"h3"}],lists:[],marks:{decorators:[{title:"Vet",value:"strong"},{title:"Cursief",value:"em"}],annotations:[]}})]}),
    {...reference("category","Categorie","category"),group:"story"},{...reference("author","Auteur","author"),group:"story"},
    {...date("publishedAt","Publicatiedatum"),group:"review"},{...date("updatedAt","Bijgewerkt op"),group:"review"},{...date("reviewedAt","Inhoud gecontroleerd op"),group:"review"},
    defineField({name:"sources",title:"Bronvermeldingen",type:"array",group:"review",of:[{type:"source"}],validation:r=>r.required().min(1)}),
    {...handles("relatedProducts","Gerelateerde producten"),group:"story"},{...refs("relatedArticles","Verder lezen","article"),group:"story"},
    {...line("seoTitle","SEO-titel"),group:"search"},{...prose("seoDescription","Metaomschrijving"),group:"search"},
    defineField({name:"canonicalUrl",title:"Afwijkende canonical (optioneel)",type:"url",group:"search",validation:r=>r.uri({scheme:["https"]})}),
    defineField({name:"noindex",title:"Uitsluiten van zoekmachines",type:"boolean",group:"search",initialValue:false}),
  ],
  preview:{select:{title:"title",subtitle:"author.name",media:"coverImage"}},
});
export const schemaTypes = [
  internalLink,source,article,
  defineType({name:"category",title:"Artikelcategorieën",type:"document",fields:[line("name","Naam"),slug("name"),prose("description","Omschrijving"),picture("image","Categoriebeeld")]}),
  defineType({name:"author",title:"Auteurs",type:"document",fields:[line("name","Naam"),slug("name"),picture("photo","Foto",false),prose("biography","Over deze auteur"),defineField({name:"credentials",title:"Aantoonbare kwalificaties",type:"text"})]}),
  defineType({name:"faq",title:"Veelgestelde vragen",type:"document",fields:[line("question","Vraag"),prose("answer","Antwoord"),line("category","Onderwerp")],preview:{select:{title:"question",subtitle:"category"}}}),
  defineType({name:"siteSettings",title:"Website-instellingen",type:"document",fields:[
    line("brandName","Merknaam"),picture("logo","Logo",false),defineField({name:"contactEmail",title:"Openbaar contactadres",type:"email"}),
    defineField({name:"socialLinks",title:"Sociale media",type:"array",of:[{type:"source"}]}),
    defineField({name:"navigation",title:"Hoofdnavigatie",type:"array",of:[{type:"internalLink"}],validation:r=>r.required().min(1)}),
    defineField({name:"footer",title:"Extra footerlinks",type:"array",of:[{type:"internalLink"}]}),
    line("announcement","Tekst aankondigingsbalk"),defineField({name:"defaultSeo",title:"Standaardmetadata",type:"object",validation:r=>r.required(),fields:[line("title","Titel"),prose("description","Omschrijving")]}),
    defineField({name:"legalDetails",title:"Gecontroleerde bedrijfsgegevens",type:"text"}),
  ]}),
  defineType({name:"homepage",title:"Homepage",type:"document",fields:[
    line("heroHeadline","Hoofdkop"),prose("heroDescription","Intro"),picture("heroImage","Openingsbeeld"),defineField({name:"heroCta",title:"Primaire knop",type:"internalLink",validation:r=>r.required()}),
    handles("featuredProducts","Uitgelichte product-slugs"),handles("featuredCategories","Uitgelichte collectie-slugs"),refs("featuredArticles","Uitgelichte artikelen","article"),
    defineField({name:"contentSections",title:"Extra tekstblokken",type:"array",of:[{type:"object",fields:[line("title","Titel"),prose("body","Tekst")]}]}),
  ]}),
  defineType({name:"legalUpdate",title:"Regelgevingsupdates",type:"document",fields:[
    line("title","Titel"),defineField({name:"status",title:"Status",type:"string",options:{list:[{title:"Geldende regel",value:"current"},{title:"Voorstel",value:"proposed"}]},validation:r=>r.required()}),
    defineField({name:"effectiveDate",title:"Bevestigde ingangsdatum",type:"date",description:"Leeg laten als de datum onzeker is."}),date("reviewedAt","Bron gecontroleerd op"),url("sourceUrl","Officiële bron"),
    {...prose("summary","Toelichting"),description:"Markeer onbevestigde juridische informatie met [ONZEKER]."},
  ],preview:{select:{title:"title",subtitle:"status"}}}),
];
