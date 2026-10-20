import test from 'node:test';import assert from 'node:assert/strict';
import {ageBand,validateProfile,speechPreferences} from '../public/profiles.js';
import {stories} from '../public/stories.js';import {companions} from '../public/characters.js';import {readFile} from 'node:fs/promises';
const profile={nickname:'Star',birthday:'',ageBand:'child',sex:'female',companion:'tala',voiceStyle:'suggested'};
test('optional birthdays, valid calendar dates, and exact age transitions',()=>{
 const now=new Date(2026,9,20,9,0);
 assert.equal(ageBand({...profile,birthday:'2013-10-20'},now),'child');
 assert.equal(ageBand({...profile,birthday:'2012-10-20'},now),'teen');
 assert.equal(ageBand({...profile,birthday:'2013-10-21'},now),'child');
 assert.equal(ageBand({...profile,birthday:'2008-10-20'},now),'adult');
 assert.equal(ageBand({...profile,birthday:'2026-10-20',ageBand:'adult'},now),'child');
 assert.equal(ageBand({...profile,ageBand:'adult'},now),'adult');
 assert.equal(validateProfile(profile,now).birthday,'');
 for(const birthday of ['2027-01-01','2025-02-30','bad','1899-10-10'])assert.throws(()=>validateProfile({...profile,birthday},now));
 assert.throws(()=>validateProfile({...profile,nickname:' '}));
});
test('voice recommendations allow caregiver override and do not confuse female and male',()=>{
 const voices=[{name:'English Female',voiceURI:'f',lang:'en-US',localService:true},{name:'English Male',voiceURI:'m',lang:'en-US',localService:true}];
 assert.equal(speechPreferences(profile,{language:'en',rate:1},voices).voice.voiceURI,'f');
 assert.equal(speechPreferences({...profile,sex:'male'},{language:'en',rate:1},voices).voice.voiceURI,'m');
 assert.equal(speechPreferences({...profile,sex:'male'},{language:'en',voice:'f',rate:1},voices).voice.voiceURI,'f');
 assert.equal(speechPreferences({...profile,ageBand:'adult'},{rate:1},[]).pitch,1);
 assert.equal(speechPreferences(profile,{rate:1,adaptiveVoice:false,pitch:.8},[]).pitch,.8);
 assert(speechPreferences(profile,{rate:1},[]).rate<1);const kidVoice={name:'English Girl Child',voiceURI:'kid',lang:'en-US',localService:true};assert.equal(speechPreferences(profile,{rate:1},[...voices,kidVoice]).voice.voiceURI,'kid');assert.equal(speechPreferences(profile,{rate:1},[...voices,kidVoice]).pitch,1);assert.equal(speechPreferences(profile,{rate:1,voice:'m'},[...voices,kidVoice]).voice.voiceURI,'m');assert.equal(speechPreferences(profile,{language:'fil',rate:1},[{voiceURI:'tl',name:'Filipino voice',lang:'tl-PH',localService:true}]).voice.voiceURI,'tl');
});
test('three complete bilingual original stories reference local companions',async()=>{
 assert.equal(stories.length,3);assert.equal(companions.length,4);
 for(const story of stories){assert.equal(story.pages.length,5);for(const page of story.pages){assert(page.en&&page.fil);assert((await readFile(`public/art/scene-${page.scene}.svg`,'utf8')).startsWith('<svg'));assert(page.cast.every(id=>companions.some(c=>c.id===id)));assert((page.choices||[]).every(c=>c.length===3&&c.every(Boolean)));}}
 for(const friend of companions){const svg=await readFile(`public/art/${friend.id}.svg`,'utf8');assert(svg.startsWith('<svg'));assert(!/(?:href|src)="https?:|<script/.test(svg));}
});
