# Shopify Storefront

De standaardwaarde van `COMMERCE_MODE` is `DEMO_MODE`. Elke andere waarde dan exact `SHOPIFY_MODE` houdt checkout gesloten. Demo- en Shopify-winkelmanden hebben verschillende sleutels in lokale browseropslag.

## Configuratie voor een latere winkel

1. Configureer het Headless-verkoopkanaal, publiceer de goedgekeurde producten en activeer Nederland met EUR. Maak een **publieke Storefront API-token** met productleesrechten en cart-/checkoutrechten. Deze adapter bewaart ook die publieke token uitsluitend op de server.
2. Stel `SHOPIFY_STORE_DOMAIN` in op het exacte myshopify.com-domein, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` op de token en `SHOPIFY_API_VERSION` op een ondersteunde versie (geïmplementeerd tegen 2026-10). Controleer het schema bij iedere versie-upgrade. Geef `SHOPIFY_CHECKOUT_HOST` op als Shopify een eigen checkoutdomein gebruikt.
3. Laat een bevoegde medewerker de leverancier, EU-verantwoordelijke, documenten, voertuigcategorie, maattabel, afbeeldingen en verkoopinformatie controleren. Publiceer verkoopbare helmen met onderscheidende opties **Maat/Size** en **Kleur/Color/Colour**. Gebruik foto's op cdn.shopify.com. De adapter accepteert maximaal 250 varianten en 16 foto's per product.
4. Definieer op het product het JSON-metaveld `compliance.sales_review` en maak het leesbaar voor de Storefront API. Dit veld bevat alleen de voor publieke weergave geschikte verwijzingen. Bewaar interne dossiers afzonderlijk. De inhoud moet onderstaande sleutels bevatten.

| Sleutel | Waarde na controle |
|---|---|
| verifiedForSale, supplierVerified | true |
| complianceStatus | verified |
| intendedUse | conventional-e-bike-nl |
| reviewedAt | ISO-8601-datumtijd van de afgeronde controle |
| supplierId, supplierCountry | Interne referentie en tweeletterige landcode |
| complianceDocuments | Minimaal één gecontroleerde publieke HTTPS-documentlink |
| category | urban-minimal, everyday-essentials of premium-street |
| shippingEstimate | Bevestigde leverindicatie in het Nederlands |

5. Activeer expliciet `COMMERCE_MODE=SHOPIFY_MODE` op een stagingomgeving en bouw opnieuw. Producten zonder volledig dossier worden overgeslagen. Herhaal artikel-, prijs-, voorraad- en checkoutcontroles met een Shopify-testwinkel. Verwijder demo-aanduidingen uit overige redactionele sitecontent en rond de livegangchecklist af.

## Checkout

De browser bewaart uitsluitend variant-ID en aantal. Bij checkout stuurt hij de regels naar de eigen server. Die leest de actuele catalogus, controleert de documentstatus en beschikbaarheid opnieuw, maakt via `cartCreate` een officiële cart en geeft Shopify's HTTPS-checkout-URL terug. Een gewijzigde hoeveelheid of een Shopify-waarschuwing onderbreekt het doorsturen. De definitieve prijzen en voorraad worden bij Shopify vastgesteld. Geen externe API-calls in demomodus.

[Shopify Storefront Product](https://shopify.dev/docs/api/storefront/2026-10/objects/Product) · [Shopify cartCreate](https://shopify.dev/docs/api/storefront/2026-10/mutations/cartCreate) · [Werken met Storefront-carts](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)
