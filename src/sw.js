const CACHE='anaia-shell-__VERSION__';
const ASSETS=__ASSETS__;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('anaia-shell-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.search||url.pathname.startsWith('/api/')||!ASSETS.includes(url.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(url.pathname);return cached||fetch(event.request);})());});
self.addEventListener('message',event=>{if(event.data?.type==='CHECK_CACHE')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const matches=await Promise.all(ASSETS.map(path=>cache.match(path)));if(matches.every(Boolean))event.ports[0]?.postMessage({type:'CACHE_READY'});})());});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')event.waitUntil(self.skipWaiting());if(event.data?.type==='GET_VERSION')event.ports[0]?.postMessage({version:CACHE.slice('anaia-shell-'.length)});});
