import {paymentLink} from './public/payment-links.js';
import http from 'node:http';

import {verifyEntitlement} from './src/entitlements.mjs';
import {readFile} from 'node:fs/promises';
import {resolve,extname,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('./dist/',import.meta.url));
export function isWithinRoot(base,file,pathApi={relative,isAbsolute,sep}) {
 const child=pathApi.relative(base,file);
 return child!=='' && child!=='..' && !child.startsWith('..'+pathApi.sep) && !pathApi.isAbsolute(child);
}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
export const server=http.createServer(async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");res.setHeader('Cache-Control','no-store');const url=new URL(req.url,'http://localhost');if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end('{"status":"ok"}');return;}if(url.pathname==='/api/entitlement'){const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):'';const entitlement=verifyEntitlement(token,process.env.ENTITLEMENT_PUBLIC_KEY);if(entitlement){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({premium:true,status:'verified',message:'Server verified a signed premium entitlement.'}));return;}res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({status:'unavailable',premium:false,message:'Purchase verification is not configured. No purchase or premium entitlement has been granted.'}));return;}if(url.pathname==='/config.json'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({bannerPlaceholder:process.env.SHOW_BANNER_PLACEHOLDER==='true',donationGcashUrl:paymentLink(process.env.DONATION_GCASH_URL,'PHP'),donationUsdUrl:paymentLink(process.env.DONATION_USD_URL,'USD')}));return;}try{const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!isWithinRoot(root,path))throw Error();const data=await readFile(path);if(url.pathname==='/sw.js')res.setHeader('Service-Worker-Allowed','/');res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found. Open ANAIA from the home page.');}});
if(process.env.NODE_ENV!=='test')server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('ANAIA server ready'));
