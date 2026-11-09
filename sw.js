// v20261110-012535 — network-first, bypasses the HTTP cache so updates show up immediately
const CACHE='app-20261110-012535';
const CORE=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>fetch(u,{cache:'reload'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);
 if(u.pathname.endsWith('/version.json'))return;
 const same=u.origin===self.location.origin;
 const net=same?fetch(q.url,{cache:'no-store',credentials:'same-origin'}):fetch(q);
 e.respondWith(net.then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(q,cp))}return r})
 .catch(()=>caches.match(q,{ignoreSearch:true}).then(m=>m||(q.mode==='navigate'?caches.match('./index.html'):undefined))))});
