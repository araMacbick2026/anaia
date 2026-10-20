import {spawnSync} from 'node:child_process';
const files=['server.mjs','src/entitlements.mjs','src/openai-speech.mjs','src/voice-preview.mjs','public/ai-preview.js','scripts/build.mjs','public/app.js','public/updates.js','public/communication.js','public/donations.js','public/payment-links.js','public/navigation.js','public/together.js','public/update.js','public/profiles.js','public/characters.js','public/stories.js','public/world.js','public/boot.js','public/data.js','public/storage.js','dist/sw.js'];
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status)process.exit(result.status);}
console.log('JavaScript syntax checks passed. This dependency-free MVP uses JavaScript; a TypeScript semantic check is not configured.');
