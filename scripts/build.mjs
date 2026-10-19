import {cp,mkdir,readFile,writeFile,rm,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
const assets=['/','/index.html','/app.js','/profiles.js','/characters.js','/stories.js','/world.js','/boot.js','/data.js','/storage.js','/styles.css','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png'];
assets.push(...(await readdir('public/art')).filter(name=>name.endsWith('.svg')).map(name=>'/art/'+name));
const hash=createHash('sha256');for(const asset of assets)hash.update(await readFile('dist'+(asset==='/'?'/index.html':asset)));
const version=hash.digest('hex').slice(0,12);let sw=await readFile('src/sw.js','utf8');sw=sw.replace('__VERSION__',version).replace('__ASSETS__',JSON.stringify(assets));await writeFile('dist/sw.js',sw);console.log(`Built ANAIA ${version}: ${assets.length} offline shell assets.`);
