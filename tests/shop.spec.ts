import {test,expect} from '@playwright/test';

const prefix=process.env.TEST_PATH || '';

test('collectie, filters en demo-winkelmand van keuze tot verwijderen',async({page})=>{
  await page.goto(prefix+'/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Ride smart.');
  await page.getByRole('link',{name:'Ontdek onze helmen',exact:true}).first().click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.getByLabel('Kleur',{exact:true}).selectOption('Sand Beige');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText('City Flow');
  await page.getByRole('button',{name:'Wis filters'}).click();
  await page.getByLabel('Sorteren',{exact:true}).selectOption('price-desc');
  await expect(page.locator('.product-card').first()).toContainText('Signature One');
  await page.locator('.product-card').filter({hasText:'Urban One Helmet'}).click();
  await page.getByRole('button',{name:'Toevoegen aan winkelmand'}).click();
  await expect(page.getByText('Kies eerst je maat.')).toBeVisible();
  await page.getByRole('button',{name:'Stone Grey',exact:true}).click();
  await page.getByRole('button',{name:'M',exact:true}).click();
  await page.getByRole('button',{name:'Toevoegen aan winkelmand'}).click();
  await page.getByRole('link',{name:'Bekijk winkelmand'}).click();
  await expect(page.getByText('Stone Grey · Maat M')).toBeVisible();
  await page.getByRole('button',{name:/Aantal verhogen/}).click();
  await page.reload();
  await expect(page.locator('.sub-total')).toContainText('99,90');
  await expect(page.getByText('Dit is een demonstratiewebshop. Bestellen is nog niet mogelijk.')).toBeVisible();
  await page.getByRole('button',{name:/Aantal verlagen/}).click();
  await expect(page.locator('.sub-total')).toContainText('49,95');
  await page.getByRole('button',{name:'Urban One Helmet verwijderen'}).click();
  await expect(page.getByRole('heading',{name:'Je winkelmand is leeg.'})).toBeVisible();
});

test('navigatie, categorie en artikel zoeken',async({page,isMobile})=>{
  await page.goto(prefix+'/');
  if (isMobile) {
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.getByRole('navigation',{name:'Mobiele navigatie'}).getByText('Kenniscentrum').click();
  } else {
    await page.getByRole('navigation',{name:'Hoofdnavigatie'}).getByText('Kenniscentrum').click();
  }
  await expect(page).toHaveURL(/kenniscentrum\/?$/);
  await page.locator('main a[href*="/kenniscentrum/categorie/"]').first().click();
  await expect(page).toHaveURL(/\/categorie\//);
  await page.getByRole('link',{name:'Zoeken',exact:true}).click();
  await page.getByRole('searchbox').fill('fietshelmmaat');
  await page.getByRole('button',{name:'Zoek',exact:true}).click();
  await page.locator('main a[href*="/kenniscentrum/"]').first().click();
  await expect(page.locator('article h1')).toContainText('fietshelmmaat');
});

test('hoofdschermen passen binnen de viewport',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/fatbike-helmen','/fatbike-helmen/urban-one','/kenniscentrum','/winkelwagen']) {
    const response=await page.goto(prefix+path);
    expect(response?.status()).toBe(200);
    await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),path).toBe(true);
  }
  expect(errors).toEqual([]);
});
