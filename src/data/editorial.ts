import type { Article, Author, Category, Faq, Homepage, LegalUpdate, SiteSettings } from "@/lib/cms/types";

const reviewed = "2026-11-19";
export const sources = {
  rules: {label:"Rijksoverheid · Regels voor elektrische fietsen en fatbikes",href:"https://www.rijksoverheid.nl/themas/verkeer-en-vervoer/voertuigen-op-de-weg/vraag-en-antwoord/fiets/welke-regels-gelden-voor-mijn-elektrische-fiets-e-bike"},
  proposal: {label:"Rijksoverheid · Voorhang helmplicht jongeren, 13 november 2026",href:"https://www.rijksoverheid.nl/actueel/nieuws/2026/11/13/helmplicht-voor-jongeren-op-fatbikes-en-andere-e-bikes-gaat-naar-tweede-kamer"},
  speed: {label:"Rijksoverheid · Helmplicht voor brommer, snorfiets en speedpedelec",href:"https://www.rijksoverheid.nl/themas/verkeer-en-vervoer/verkeersveiligheid/vraag-en-antwoord/verkeersveiligheid/helmplicht-brommer-snorfiets-speedpedelec"},
  choose: {label:"Fietsersbond · Keuzehulp fietshelm",href:"https://www.fietsersbond.nl/veilig-fietsen/waar-moet-je-op-letten-als-je-een-fietshelm-koopt/"},
  wear: {label:"ANWB · Zo draag je een fietshelm",href:"https://www.anwb.nl/fiets/accessoires-uitrusting/fietshelm/fietshelm-dragen"},
  size: {label:"ANWB · Zo bepaal je de maat van een fietshelm",href:"https://www.anwb.nl/webwinkel/de-beste-fietshelm-voor-jouw-avontuur"},
  replace: {label:"ANWB · Levensduur van een fietshelm",href:"https://www.anwb.nl/fiets/accessoires-uitrusting/fietshelm/levensduur-fietshelm"},
  ppe: {label:"EUR-Lex · Verordening (EU) 2016/425 over persoonlijke beschermingsmiddelen",href:"https://eur-lex.europa.eu/eli/reg/2016/425/oj"},
};
export const legalUpdates: LegalUpdate[] = [
  {title:"Een fatbike met gewone trapondersteuning",status:"current",reviewedAt:reviewed,sourceUrl:sources.rules.href,summary:"Valt je fatbike onder de regels voor een gewone elektrische fiets? Volgens de Rijksoverheid geldt daarvoor geen algemene helmplicht. De motor ondersteunt tot 25 km/u, heeft een vermogen van maximaal 250 watt en je trapt zelf mee."},
  {title:"Een speedpedelec",status:"current",reviewedAt:reviewed,sourceUrl:sources.speed.href,summary:"Op een speedpedelec is een goedgekeurde speedpedelec- of bromfietshelm verplicht. Ook voor de passagier. Controleer de voertuigcategorie en de helmgoedkeuring voordat je op pad gaat."},
  {title:"Voorstel voor jongeren tot 18 jaar",status:"proposed",reviewedAt:reviewed,sourceUrl:sources.proposal.href,summary:"Op 13 november 2026 ging het ontwerp voor een helmplicht voor jonge bestuurders en passagiers van onder meer e-bikes en fatbikes naar het parlement. [ONZEKER] Het kabinet streeft naar 1 september 2027. De definitieve ingangsdatum staat nog niet vast."},
];
const author: Author = {name:"Redactie Fatbikehelm Nederland",slug:"redactie",biography:"De redactie maakt deze kennisgids voor de preview. Elk artikel vermeldt de geraadpleegde bronnen en de datum van de laatste inhoudelijke controle."};
export const categories: Category[] = [
  {slug:"helmplicht",name:"Helmplicht",description:"Actuele regels, voertuigcategorieën en voorstellen voor jongeren.",image:"/images/urban.webp"},
  {slug:"helm-kiezen",name:"Helm kiezen",description:"Van de eerste meting tot het vergelijken van de pasvorm.",image:"/images/lifestyle.webp"},
  {slug:"stijl-en-lifestyle",name:"Stijl en lifestyle",description:"Vorm, kleur en dagelijks gebruik in de stad.",image:"/images/hero.webp"},
  {slug:"onderhoud-en-veiligheid",name:"Onderhoud en veiligheid",description:"Je helm afstellen, controleren en op tijd vervangen.",image:"/images/closeup.webp"},
];
export const faqs: Faq[] = [
  {question:"Is een helm verplicht op mijn fatbike?",answer:"Dat hangt af van de voertuigcategorie. De pagina over helmplicht geeft de actuele uitleg per type en de stand van het voorstel voor jongeren.",category:"Helmplicht"},
  {question:"Hoe kies ik mijn helmmaat?",answer:"Meet de omtrek van je hoofd boven je wenkbrauwen en oren. Vergelijk de uitkomst met de maattabel van het specifieke model en pas de helm. De maatwijzer loopt alle stappen met je door.",category:"Pasvorm"},
  {question:"Kan ik een helm bestellen?",answer:"Je kunt een concepthelm en maat kiezen en de demo-winkelmand uitproberen. De preview verwerkt geen bestellingen of betalingen.",category:"Preview"},
  {question:"Wat doe ik na een harde klap op mijn helm?",answer:"Vervang de helm na een val waarbij hij een klap heeft opgevangen. Schade aan de binnenkant kan onzichtbaar blijven. Raadpleeg de instructies van de fabrikant.",category:"Onderhoud"},
  {question:"Zijn de getoonde helmen getest?",answer:"De zes modellen zijn fictieve ontwerpen. Er zijn geen productspecifieke testresultaten of conformiteitsdocumenten voor deze concepten.",category:"Preview"},
];
const press = "fatbike-helmplicht-actuele-stand";
const choice = "welke-helm-is-geschikt-voor-een-fatbike";
const measure = "juiste-fietshelmmaat-bepalen";
const safe = "waar-let-je-op-bij-een-veilige-fietshelm";
const mistakes = "vijf-fouten-bij-het-dragen-van-een-fietshelm";
type Seed = Omit<Article,"body"|"author"|"publishedAt"|"updatedAt"|"reviewedAt"|"seoTitle"|"seoDescription"|"noindex"|"relatedProducts"> & {sections:[string,string][]};
function article({sections,...data}: Seed): Article {
  const body = sections.flatMap(([heading,paragraph]) => ([
    {style:"h2" as const, copy:heading}, {style:"normal" as const, copy:paragraph},
  ]).map(({style,copy})=>({_type:"block" as const,style,children:[{_type:"span" as const,text:copy,marks:[]}]})));
  return {...data, body, author, publishedAt:reviewed, updatedAt:reviewed, reviewedAt:reviewed, relatedProducts:[], seoTitle:data.title, seoDescription:data.excerpt, noindex:false};
}
export const articles: Article[] = [
  article({slug:press,title:"Fatbike helmplicht: wat is de actuele stand van zaken?",excerpt:"Voor een reguliere elektrische fatbike geldt volgens de Rijksoverheid geen algemene helmplicht. Voor jongeren ligt er een voorstel. Dit is wat er nu op tafel ligt.",coverImage:"/images/urban.webp",coverAlt:"Conceptbeeld van een fietser in een Nederlandse stad",category:"helmplicht",sources:[sources.rules,sources.proposal,sources.speed],relatedArticles:[choice],sections:[
    ["Wat is er op 13 november gebeurd?","Het kabinet heeft een ontwerpbesluit aan het parlement voorgelegd. Die stap heet de voorhang. In het ontwerp staat een helmplicht voor jongeren onder de 18 op onder meer elektrische fietsen. Het voorstel gaat over wie zelf rijdt én wie meerijdt, bijvoorbeeld op de bagagedrager."],
    ["Wanneer verandert er iets?","[ONZEKER] De beoogde start is 1 september 2027. Een streefdatum kan verschuiven. Zoek bij een bericht over een nieuwe regel steeds naar de officiële publicatie en de daarin vastgestelde ingangsdatum."],
    ["Waarom de voertuigcategorie telt","Dikke banden zijn een ontwerpkeuze. De technische eigenschappen en de eventuele voertuiggoedkeuring bepalen welke regels van toepassing zijn. Een speedpedelec valt onder de bromfietsregels. Lees bij twijfel de voertuigdocumenten en bekijk het overzicht per categorie op onze helmplichtpagina."],
  ]}),
  article({slug:choice,title:"Welke helm is geschikt voor een fatbike?",excerpt:"Begin bij je voertuigcategorie. Vergelijk daarna alleen helmen voor dat gebruik en pas meerdere modellen. De vorm van je hoofd telt even zwaar mee als de gemeten omtrek.",coverImage:"/images/lifestyle.webp",coverAlt:"Conceptbeeld van een helm in een stedelijke omgeving",category:"helm-kiezen",sources:[sources.choose,sources.rules,sources.speed],relatedArticles:[measure,safe],sections:[
    ["Begin bij je fiets","Kijk in de documentatie of je een gewone e-bike of een speedpedelec hebt. Voor een gewone e-bike kun je kijken naar een fietshelm die door de fabrikant voor fietsen is bedoeld. Vraag naar de norm waarop de fabrikant zijn verklaring baseert. EN 1078 is een gebruikelijke fietshelmnorm."],
    ["Probeer het model op je dagelijkse rit","Draag je een bril? Neem die mee tijdens het passen. Kijk links en rechts alsof je een kruising oversteekt en voel waar helm, bril en riempjes elkaar raken. Test of je de sluiting gemakkelijk bereikt en of het bandje onder je kaak ligt."],
    ["Vergelijk twee pasvormen","Helmen met hetzelfde maatbereik kunnen verschillen in breedte en diepte. Draag elk model enkele minuten. Noteer waar het drukt of verschuift. Pas als de vorm goed aansluit, heeft het zin om kleur, ventilatieopeningen en afwerking te vergelijken."],
  ]}),
  article({slug:measure,title:"Hoe bepaal je de juiste fietshelmmaat?",excerpt:"Meet je hoofdomtrek in centimeters en zoek die waarde op in de tabel van het model dat je wilt passen. De lettermaat kan per merk en model verschillen.",coverImage:"/images/closeup.webp",coverAlt:"Conceptbeeld van een gedragen fietshelm in close-up",category:"helm-kiezen",sources:[sources.size,sources.choose],relatedArticles:[choice,mistakes],sections:[
    ["Leg een soepel meetlint klaar","Ga voor een spiegel staan. Leg het lint horizontaal rond het breedste deel van je hoofd, net boven de oren en een paar centimeter boven je wenkbrauwen. Laat het aansluiten zonder het strak te trekken. Vraag iemand mee te kijken als het lint achterop wegzakt."],
    ["Meet twee keer","Lees de omtrek af en haal het lint weg. Leg het opnieuw aan en vergelijk de uitkomsten. Verschillen ze? Controleer vooral de hoogte aan de achterzijde. Schrijf je waarde in centimeters op, ook als je je gebruikelijke lettermaat al kent."],
    ["Controleer het maatbereik","Een aanduiding als M is alleen bruikbaar naast de centimeterwaarden van de fabrikant. Valt je meting tussen twee overlappende maatbereiken, probeer dan beide. De helm hoort stabiel te zitten en gelijkmatig aan te sluiten, zonder knellende plekken bij de slapen."],
  ]}),
  article({slug:safe,title:"Waar moet je op letten bij een veilige fietshelm?",excerpt:"Zoek naar het bedoelde gebruik, het exacte model en de EU-conformiteitsverklaring. Controleer daarna de staat en pasvorm van de helm die je in handen hebt.",coverImage:"/images/lifestyle.webp",coverAlt:"Redactioneel conceptbeeld bij de gids voor het kiezen van een fietshelm",category:"onderhoud-en-veiligheid",sources:[sources.ppe,sources.choose,sources.speed],relatedArticles:[choice,mistakes],sections:[
    ["Lees de modelinformatie","Bekijk de naam van de fabrikant en de identificatie van het model op helm, verpakking en handleiding. Een productfoto geeft te weinig informatie om te beoordelen voor welk gebruik een helm is ontwikkeld. Vraag de verkoper om opheldering als de gegevens verschillen."],
    ["Zoek de verklaring op","Fietshelmen vallen onder de Europese regels voor persoonlijke beschermingsmiddelen. Bij het product hoort een EU-conformiteitsverklaring of een verwijzing in de gebruiksaanwijzing naar de online verklaring. Controleer voor welk model en welke voorschriften die verklaring is afgegeven."],
    ["Bekijk de helm zelf","Lees de aanwijzingen voor afstellen, reinigen, bewaren en vervangen. Controleer of de sluiting werkt en inspecteer schaal en bandjes. Bij een helm met onbekende gebruiksgeschiedenis kun je eerdere klappen moeilijk beoordelen. De fictieve modellen in deze webshop hebben geen gecontroleerd productdossier."],
  ]}),
  article({slug:mistakes,title:"Vijf veelgemaakte fouten bij het dragen van een fietshelm",excerpt:"Een helm hoort recht te staan, goed aan te sluiten en met gesloten kinband op zijn plek te blijven. Loop deze vijf punten langs voordat je vertrekt.",coverImage:"/images/closeup.webp",coverAlt:"Redactioneel conceptbeeld van een helm met gesloten kinband",category:"onderhoud-en-veiligheid",sources:[sources.wear,sources.replace],relatedArticles:[measure,safe],sections:[
    ["1. De helm achterover kantelen","Zet hem horizontaal en kijk in de spiegel of ook je voorhoofd bedekt is. Controleer of je nog vrij vooruit en opzij kunt kijken."],
    ["2. Alle speling met de draaiknop oplossen","Kies eerst de passende schaalmaat. Volg de handleiding bij het verstellen. Een pijnlijke plek of een helm die blijft kantelen is reden om opnieuw te passen."],
    ["3. Vertrekken met een losse kinband","Sluit de gesp onder je kaak en controleer of de bandjes vlak langs je oren lopen. Trek even aan de gesloten gesp en stel de lengte volgens de instructies af."],
    ["4. Een dikke muts of haarclip eronder dragen","Wat je onder de helm draagt verandert de pasvorm. Controleer welke accessoires de fabrikant toestaat. Probeer de combinatie vooraf en let op of de helm daardoor hoger op je hoofd staat."],
    ["5. Na een klap alleen naar de buitenkant kijken","Heeft je helm bij een val een harde klap opgevangen, vervang hem dan. Zelfs met een gave buitenschaal kan materiaal binnenin beschadigd zijn. Raadpleeg de fabrikant voor de verdere afhandeling."],
  ]}),
];
export const homepage: Homepage = {
  heroHeadline:"Ride smart. Look good.",heroDescription:"Stijlvolle fietshelmen voor de nieuwe generatie fatbikers.",heroImage:"/images/hero.webp",heroCta:{label:"Ontdek onze helmen",href:"/fatbike-helmen"},
  featuredProducts:["urban-one","city-flow","streetline","metro-air"],featuredCategories:["urban-minimal","everyday-essentials","premium-street"],featuredArticles:[press,choice,measure],contentSections:[],
};
export const settings: SiteSettings = {
  brandName:"Fatbikehelm Nederland",announcement:"Stijlvolle fietshelmen voor iedere rit.",socialLinks:[],footer:[],
  navigation:[{label:"Shop helmen",href:"/fatbike-helmen"},{label:"Collecties",href:"/collecties"},{label:"Helmplicht",href:"/helmplicht-fatbike"},{label:"Kenniscentrum",href:"/kenniscentrum"},{label:"Over ons",href:"/over-ons"}],
  defaultSeo:{title:"Fatbikehelm Nederland",description:"Ontdek concepthelmen voor de stad en lees over pasvorm, helmkeuze en de Nederlandse verkeersregels."},
};
