import {spawnSync} from 'node:child_process';
const files=['server.mjs','src/entitlements.mjs','scripts/build.mjs','public/app.js','public/boot.js','public/data.js','public/storage.js','dist/sw.js'];
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status)process.exit(result.status);}
console.log('JavaScript syntax checks passed. This dependency-free MVP uses JavaScript; a TypeScript semantic check is not configured.');
