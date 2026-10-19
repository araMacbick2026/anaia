import {verify} from 'node:crypto';
// Only a server-issued, signed receipt can establish an entitlement. Never trust
// a client boolean, redirect, query string, or local browser storage.
export function verifyEntitlement(token,publicKey,now=Date.now()){
 if(!publicKey||typeof token!=='string'||token.length>8192)return null;
 try{const parts=token.split('.');if(parts.length!==2)return null;const [payload,signature]=parts;
 if(!verify(null,Buffer.from(payload),publicKey,Buffer.from(signature,'base64url')))return null;
 const claim=JSON.parse(Buffer.from(payload,'base64url').toString());
 if(claim.issuer!=='anaia-payments'||claim.audience!=='anaia-web'||claim.product!=='anaia-premium-once'||claim.status!=='paid'||claim.currency!=='PHP'||claim.amountMinor!==49900||typeof claim.subject!=='string'||!claim.subject||typeof claim.transactionId!=='string'||!claim.transactionId||!Number.isFinite(claim.issuedAt)||!Number.isFinite(claim.expiresAt)||claim.issuedAt>now||claim.expiresAt<=now)return null;
 return Object.freeze({subject:claim.subject,transactionId:claim.transactionId,product:claim.product,expiresAt:claim.expiresAt});
 }catch{return null;}
}
