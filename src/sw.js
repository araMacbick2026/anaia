const CACHE='anaia-shell-__VERSION__';
const ASSETS=__ASSETS__;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS).catch(async error=>{await caches.delete(CACHE);throw error;})));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const previous=(await caches.keys()).filter(name=>name.startsWith('anaia-shell-')&&name!==CACHE);for(const name of previous.slice(0,-1))await caches.delete(name);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.search||url.pathname.startsWith('/api/')||!ASSETS.includes(url.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(url.pathname);return cached||fetch(event.request);})());});
self.addEventListener('message',event=>{if(event.data?.type==='CHECK_CACHE')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const matches=await Promise.all(ASSETS.map(path=>cache.match(path)));if(matches.every(Boolean))event.ports[0]?.postMessage({type:'CACHE_READY'});})());});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')event.waitUntil(self.skipWaiting());if(event.data?.type==='GET_VERSION')event.ports[0]?.postMessage({version:CACHE.slice('anaia-shell-'.length)});});

// A waiting worker checks every open app window before automatic activation.
const updateChecks=new Map();
self.addEventListener('message',event=>{
 const data=event.data;
 if(data?.type==='UPDATE_SAFETY_REPLY'){const check=updateChecks.get(data.requestId);if(check&&check.answers.has(event.source?.id))check.answers.set(event.source.id,data.ready===true);return;}
 if(data?.type!=='REQUEST_SAFE_ACTIVATION'||!event.source?.id)return;
 event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});const requestId=crypto.randomUUID();const answers=new Map(windows.map(client=>[client.id,false]));updateChecks.set(requestId,{answers});for(const client of windows)client.postMessage({type:'UPDATE_SAFETY_CHECK',requestId,version:CACHE.slice('anaia-shell-'.length)});await new Promise(resolve=>setTimeout(resolve,2200));const current=await self.clients.matchAll({type:'window',includeUncontrolled:true});const activated=current.length>0&&current.every(client=>answers.get(client.id)===true);updateChecks.delete(requestId);event.ports[0]?.postMessage({type:'UPDATE_ACTIVATION_RESULT',activated});if(activated)await self.skipWaiting();})());
});
