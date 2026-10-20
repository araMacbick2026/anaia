import assert from 'node:assert/strict';import http from 'node:http';import {browser} from './cdp.mjs';
process.env.NODE_ENV='test';const {server:app}=await import('../server.mjs');let modern=false;const paths=[];
const legacy=`const CACHE='anaia-legacy-update-test';self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/']))));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(new URL(e.request.url).pathname==='/')e.respondWith(caches.open(CACHE).then(c=>c.match('/')));});`;
const host=http.createServer((req,res)=>{paths.push(req.url);if(!modern&&req.url==='/sw.js'){res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});res.end(legacy);}else if(!modern&&req.url==='/'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><h1 id="legacy">OLD ANAIA</h1>');}else app.emit('request',req,res);});
await new Promise(r=>host.listen(3012,'127.0.0.1',r));const b=await browser('http://127.0.0.1:3012');let second;
try{
 await b.call('Storage.clearDataForOrigin',{origin:b.origin,storageTypes:'all'});await b.call('Page.navigate',{url:b.origin+'/'});await b.until(`!!document.querySelector('#legacy')`);await b.js(`navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready)`);await b.until(`!!navigator.serviceWorker.controller`);
 const stored={settings:{nickname:'Saved child',language:'en'},entries:[{id:'private-entry',time:'2026-10-20T10:00',notes:'Keep this private observation'}],profiles:[{id:'default',nickname:'Saved child',birthday:'2018-04-03',sex:'female',ageBand:'child',companion:'tala',voiceStyle:'suggested'}]};
 await b.js(`import('/storage.js').then(async m=>{for(const [key,value]of Object.entries(${JSON.stringify(stored)}))await m.write(key,value)})`);
 second=(await b.call('Target.createTarget',{url:b.origin+'/'})).targetId;await b.delay(200);modern=true;
 await b.call('Page.navigate',{url:b.origin+'/update.html'});await b.until(`!!document.querySelector('#update-button')`);await b.click('#update-button');await b.until(`location.hash==='#home' && !!document.querySelector('.destination-cards')`);
 const actual=await b.js(`import('/storage.js').then(async m=>Object.fromEntries(await Promise.all(['settings','entries','profiles'].map(async k=>[k,await m.read(k)]))))`);assert.deepEqual(actual,stored);
 assert(paths.every(path=>!path.includes('Saved')&&!path.includes('private-entry')&&!path.includes('2018-04-03')));
 console.log('PASS new worker explicitly activates with another old tab open; latest app opens and private IndexedDB records remain unchanged');
}finally{if(second)await b.call('Target.closeTarget',{targetId:second});b.close();host.closeAllConnections();await new Promise(r=>host.close(r));}
