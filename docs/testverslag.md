# Testverslag van de demoversie

Op 20 november 2026 zijn de dependencies vanuit het lockfile geïnstalleerd. De productiebuild van Next.js en de aparte statische GitHub Pages-export zijn geslaagd. De unit-tests controleren dat de catalogus uitsluitend conceptmodellen bevat en dat varianten, bedragen, aantallen, ongeldige opslag en gecombineerde filters correct worden verwerkt.

De volledige statische preview is op het subpad /helmverkoop/ getest. Zeven Playwright-scenario’s slaagden. De controle omvatte 34 interne pagina’s en elf unieke WebP-URL’s. De browsertests gebruikten desktop-Chrome en een geëmuleerde mobiele Pixel-viewport. Ze openden een artikel via zoeken, gebruikten het mobiele menu, testten de lege en gevulde winkelmand en controleerden het subtotaal na herladen en verwijderen. Een checkoutverzoek kan in de demo geen bestelling aanmaken.

Shopify en Sanity zijn niet met productieaccounts beproefd. De koppelingen staan beschreven in de afzonderlijke integratiehandleidingen. De testset is geen WCAG-audit. Lighthouse-doelen zijn streefwaarden; een scoremeting en veldgegevens voor Core Web Vitals maken geen deel uit van deze functionele acceptatie.
