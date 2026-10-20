import test from 'node:test';import assert from 'node:assert/strict';
process.env.NODE_ENV='test';const {server}=await import('../server.mjs');
function request(url,method='GET',headers={}){return new Promise(resolve=>{const result={headers:{},body:''};const res={setHeader(k,v){result.headers[k]=v;},writeHead(status,heads={}){result.status=status;Object.assign(result.headers,heads);},end(body){result.body=body?.toString()||'';resolve(result);}};server.emit('request',{url,method,headers},res);});}
test('production server public routes and fail-closed payments',async()=>{for(const url of ['/','/app.js','/sw.js','/manifest.webmanifest','/icons/icon-192.png'])assert.equal((await request(url)).status,200);assert.equal((await request('/health')).status,200);assert.equal((await request('/art/tala.svg')).headers['Content-Type'],'image/svg+xml');assert.equal((await request('/api/entitlement?premium=true','GET',{authorization:'Bearer premium=true'})).status,503);assert.equal((await request('/api/entitlement')).headers['Cache-Control'],'no-store');assert.equal((await request('/api/checkout','POST')).status,405);assert.equal((await request('/.env')).status,404);assert.equal(JSON.parse((await request('/config.json')).body).bannerPlaceholder,false);process.env.SHOW_BANNER_PLACEHOLDER='true';assert.equal(JSON.parse((await request('/config.json')).body).bannerPlaceholder,true);delete process.env.SHOW_BANNER_PLACEHOLDER;assert.equal((await request('/sw.js')).headers['Service-Worker-Allowed'],'/');});

test('static containment accepts Windows and POSIX paths and rejects escapes',async()=>{
 const {isWithinRoot}=await import('../server.mjs');const {win32,posix}=await import('node:path');
 for(const pathApi of [win32,posix]){
  const base=pathApi.resolve('/anaia/dist');
  assert.equal(isWithinRoot(base,pathApi.join(base,'index.html'),pathApi),true);
  assert.equal(isWithinRoot(base,pathApi.join(base,'icons','icon-192.png'),pathApi),true);
  assert.equal(isWithinRoot(base,pathApi.resolve(base,'../server.mjs'),pathApi),false);
  assert.equal(isWithinRoot(base,pathApi.resolve(base,'../dist-other/index.html'),pathApi),false);
  assert.equal(isWithinRoot(base,base,pathApi),false);
 }
 assert.equal(isWithinRoot('C:\\anaia\\dist','D:\\private.txt',win32),false);
});

 test('donation configuration exposes only validated public provider links',async()=>{process.env.DONATION_GCASH_URL='https://gcash.com.evil.test/pay';process.env.DONATION_USD_URL='https://paypal.me/anaia-test-fixture';let config=JSON.parse((await request('/config.json')).body);assert.equal(config.donationGcashUrl,'');assert.equal(config.donationUsdUrl,'https://paypal.me/anaia-test-fixture');process.env.DONATION_GCASH_URL='https://pay.gcash.com/anaia-test-fixture';config=JSON.parse((await request('/config.json')).body);assert.equal(config.donationGcashUrl,process.env.DONATION_GCASH_URL);assert.equal((await request('/config.json')).headers['Cache-Control'],'no-store');delete process.env.DONATION_GCASH_URL;delete process.env.DONATION_USD_URL;});

 test('supplied QR originals are public uncached JPEGs and advertised only as PHP methods',async()=>{const c=JSON.parse((await request('/config.json')).body);assert.deepEqual(c.donationQrs,[{id:'gcash',src:'/donations/gcash.jpg'},{id:'bpi',src:'/donations/bpi.jpg'}]);for(const id of ['gcash','bpi']){const r=await request('/donations/'+id+'.jpg');assert.equal(r.status,200);assert.equal(r.headers['Content-Type'],'image/jpeg');assert.equal(r.headers['Cache-Control'],'no-store');}});
