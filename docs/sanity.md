# Redactie en Sanity Studio

De webshop start met `CMS_MODE=LOCAL`. Vijf redactionele artikelen, vier categorieën, vijf veelgestelde vragen en drie regelgevingsupdates staan in `src/data/editorial.ts`. De vijf artikelen hebben een inhoudelijk verantwoordelijke redactie, bronlinks, een samenvatting, controledatum en verwijzingen naar vervolgonderwerpen.

## Studio koppelen

1. Maak een Sanity-project en dataset aan. Geef redacteuren toegang tot de Studio. Gebruik afzonderlijke datasets voor acceptatie en productie.
2. Ga naar `sanity/`, kopieer `.env.example` naar `.env.local` en vul project-ID en dataset in. Alleen deze twee openbare waarden worden in de Studio gebundeld.
3. Voer met Node 22.13 of hoger en pnpm 11.25.0 achtereenvolgens `pnpm install --frozen-lockfile`, `pnpm run typecheck` en `pnpm run dev` uit. Stel in Sanity Manage de exacte Studio-origin in onder API/CORS en sta credentials toe voor die origin. Een Studio-productiebundel maak je met `pnpm run build`.
4. Open in de redactieomgeving eerst **Website-instellingen** en **Homepage**. Vul de verplichte velden en publiceer beide documenten. De vaste document-ID's zijn `siteSettings` en `homepage`.
5. Voeg ten minste een auteur en categorie met beeld toe. Schrijf vervolgens artikelen met Portable Text, een beelddescriptie, de publicatie-, wijzigings- en controledatum, primaire bronnen en metadata. Publiceer de documentreferenties vóór het artikel. Afbeeldingen worden vanuit Sanity's beeld-CDN opgevraagd.
6. Vul in de **webshopomgeving** `CMS_MODE=SANITY`, `SANITY_PROJECT_ID` en `SANITY_DATASET` in. Gebruik `SANITY_READ_TOKEN` als de dataset privé is. Gebruik uitsluitend een server-side leestoken. Herstart of herbouw de webshop na een configuratiewijziging.
7. Controleer de publicatie op een acceptatieomgeving. Verwijzingen naar producten en collecties moeten overeenkomen met bestaande catalogusslugs. Artikelverwijzingen in Sanity zijn documentreferenties. In de lokale data staan de uiteindelijke slugs.

De winkel gebruikt de Sanity HTTP Query API en de expliciete `published`-weergave. De adapter controleert project-ID, dataset, documentvorm, slugs, linkprotocollen, afbeeldingen en Portable Text-blokken. De query voor artikelen selecteert de verstreken publicatiedatums. Gepubliceerde CMS-data heeft een cachetermijn van vijf minuten. Een uitval of een ontbrekend verplicht document in de geconfigureerde Sanity-omgeving geeft een inhoudsfout. Schakel bewust terug naar `CMS_MODE=LOCAL` voor de lokale collectie.

## Besloten conceptweergave

Configureer op de server een sterk willekeurig `SANITY_PREVIEW_SECRET` en een minimaal geprivilegieerd `SANITY_READ_TOKEN` met leesrechten voor concepten. Alleen project-ID en dataset horen in de Studio-omgeving. Gebruik HTTPS op je acceptatieomgeving.

Open `/redactie`, voer de redactiecode en een intern voorbeeldpad in en kies **Open conceptweergave**. De code gaat in een POST-body. Na de redirect gebruikt Next.js de Draft Mode-cookie en vraagt de CMS-adapter concepten op via de `drafts`-weergave zonder gedeelde cache. Een artikelconcept is zichtbaar zodra de verplichte velden zijn ingevuld en de publicatiedatum bereikt is. Keer terug naar `/redactie`, voer de code in en kies **Sluit conceptweergave** om naar de gepubliceerde inhoud terug te gaan. In lokale modus is dit formulier uitgeschakeld.

## Broncontrole

Werk eerst de update op de centrale helmplichtpagina bij. Controleer daarna de gerelateerde nieuwsduiding en FAQ. Leg bron en datum vast en vermeld bij een nog onbevestigde ingangsdatum letterlijk `[ONZEKER]`. Laat het veld met de bevestigde ingangsdatum dan leeg. De regelgevingspagina toont afzonderlijke secties voor geldende regels en voorstellen.

De lokale inhoud is op 19 november 2026 gecontroleerd tegen de Rijksoverheid, de EU-verordening voor persoonlijke beschermingsmiddelen, de keuzehulp van de Fietsersbond en de eigen helmadviezen van ANWB. Alle gebruikte bronlinks staan bij het artikel of de regel. De volgende controle hoort bij livegang en bij een nieuwe officiële mededeling over de voorhang van 13 november 2026.

De Studio is met tijdelijke lokale buildconfiguratie gebouwd. Er is geen echt project gekoppeld. Leesrechten, redactionele publicatie, conceptcookies en inhoud uit een echte dataset moeten in de beoogde omgeving worden geaccepteerd.

[Sanity Query API](https://www.sanity.io/docs/http-reference/query) · [Sanity Perspectives](https://www.sanity.io/docs/content-lake/perspectives)
