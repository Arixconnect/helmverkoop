# Fatbikehelm Nederland

[Open de deelbare preview op GitHub Pages](https://arixconnect.github.io/helmverkoop/).

Nederlandstalige demonstratiewebshop voor zes fictieve fatbikehelmen. Bezoekers kunnen vergelijken, zoeken, een kleur en maat kiezen en hun winkelmand op dit apparaat bewaren. De preview verwerkt geen bestelling of betaling.

## Lokaal draaien

Gebruik Node.js 24 en pnpm 11.25.0. Installeer zo nodig pnpm met `npm install --global pnpm@11.25.0`. Voer de volgende opdrachten uit in de hoofdmap van deze repository.

```sh
pnpm install --frozen-lockfile
pnpm dev -p 4317
```

Open [de lokale webshop](http://localhost:4317). Er zijn geen accounts of sleutels nodig. Om instellingen te wijzigen, kopieer je `.env.example` naar `.env.local`. Voor de productiepreview gebruik je `pnpm build` gevolgd door `pnpm start -p 4317`.

## Controles

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

De browsertests starten automatisch de productiepreview en gebruiken standaard een geïnstalleerde Google Chrome. Voor gebundelde Chromium gebruik je `pnpm exec playwright install chromium` en vervolgens `PW_CHANNEL=chromium pnpm test:e2e`. Ze testen mobiel en desktop, zoekresultaten, artikelpagina’s, varianten, aantallen, herladen, subtotaal, verwijdering en de geblokkeerde checkout. De desktopcrawler volgt interne links en controleert afbeeldingen en metadata.

## Architectuur

- **Next.js App Router** rendert de pagina’s en metadata. Interactieve React-componenten verzorgen filters, varianten, de winkelmand, zoekresultaten en het mobiele menu. TypeScript staat op strict. De productimport, contentadapter en UI zijn gescheiden.
- **Commerce** in `src/lib/commerce` gebruikt standaard seeddata met bedragen in eurocenten. Elke demohelm heeft de status `isDemo: true` en `verifiedForSale: false`. De gekozen variant-ID bewaart de maat en kleur. Browseropslag bevat uitsluitend aantallen en variant-ID’s. In servermodus leest checkout de gevalideerde variantgegevens opnieuw. [Shopify instellen](docs/shopify.md).
- **Content** in `src/lib/cms` gebruikt vijf lokale artikelen, FAQ’s, redactionele bronnen, datums, navigatie en homepage-inhoud. De optionele adapter valideert Sanity-responses met Zod. De afzonderlijke Studio staat in `sanity/`. [Sanity en redactiepreview](docs/sanity.md).
- **Vormgeving** gebruikt Tailwind CSS, centrale kleur- en typografietokens, lokaal gehoste Inter en Manrope, Radix/shadcn-accordeons, Lucide-iconen en Motion met ondersteuning voor verminderde beweging. Header, knoppen, productkaarten en kruimelpaden worden gedeeld tussen routes. De lokale WebP-beelden zijn met ImageGen gemaakt. [Beeldconcepten en prompts](docs/beeldconcepten.md).
- **SEO** loopt via `src/lib/seo.ts`, routegebonden metadata, sitemap, robots en JSON-LD. De demo vraagt zoekmachines om niet te indexeren. Voor winkelmand en zoeken geldt dit eveneens bij commerciële lancering. [Contentstrategie](docs/seo-strategy.md).
- **Publicatie** via de workflow in `.github/workflows/pages.yml` maakt vanaf main een statische demo met het juiste subpad. Op Pages blijven zoeken en winkelmand in de browser werken. Redactie- en checkout-API’s vereisen de Next.js-server. Vercel kan de standaard Next.js-build uitvoeren met `SITE_URL` op het eigen domein. Gebruik daarvoor geen Pages-exportinstellingen.

## Nog in te vullen

Leverancier, echte voorraad, testrapporten, maatbereik, levering, retouradres, bedrijfsgegevens, contact en sociale kanalen zijn nog open. Juridische pagina’s zijn als concept geschreven. De foto’s tonen een fictieve ambassadeur en ontwerpstudies. Voor verkoop zijn goedgekeurde productfoto’s en een modelgebonden dossier nodig. [Leveranciersvergelijking en verificatie](docs/supplier-checklist.md) · [Livegangchecklist](docs/launch-checklist.md).
