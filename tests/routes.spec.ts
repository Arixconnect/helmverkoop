import {expect,test} from '@playwright/test';

test('interne routes, beelden, metadata en checkoutblokkade',async({page,request,baseURL})=>{
  const prefix=process.env.TEST_PATH || '';
  test.setTimeout(150000);
  const sitemap=await request.get(prefix+'/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml=await sitemap.text();
  const queue=new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname.replace(/\/$/,'') || '/'));
  expect(queue.size).toBeGreaterThan(25);
  const images=new Set<string>();
  const titles=new Set<string>();
  for(const path of queue){
    const response=await page.goto(path,{waitUntil:'domcontentloaded'});
    expect(response?.status(),path).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('meta[name=description]')).toHaveAttribute('content',/.+/);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',new RegExp(path.replace(/\/$/,'')+'/?$'));
    const title=await page.title();
    expect(titles.has(title),'Dubbele paginatitel: '+title).toBe(false);
    titles.add(title);
    const refs=await page.locator('a[href]').evaluateAll(as=>as.map(a=>(a as HTMLAnchorElement).href));
    for(const href of refs){const url=new URL(href);if(url.origin===new URL(baseURL!).origin && url.pathname.startsWith(prefix+'/'))queue.add(url.pathname.replace(/\/$/,'') || '/');}
    for(const img of await page.locator('img').evaluateAll(imgs=>imgs.map(i=>(i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src)))if(img)images.add(img);
  }
  for(const url of images){const res=await request.get(url);expect(res.ok(),url).toBe(true);expect(res.headers()['content-type']).toMatch(/^image\//);}
  expect((await request.get(prefix+'/bestaat-hier-niet')).status()).toBe(404);
  const blocked=await request.post(prefix+'/api/checkout',{data:[{variantId:'demo',quantity:1}]});
  expect(prefix ? [404,405,501] : [403]).toContain(blocked.status());
  expect(await (await request.get(prefix+'/robots.txt')).text()).toContain('Disallow: /');
  console.log('Gecontroleerd:',queue.size,'pagina’s,',images.size,'beeld-URL’s');
});
