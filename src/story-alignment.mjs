// Align public script tokens to measured word timestamps, never reading-time estimates.
const tokens=text=>(String(text).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
export function alignStoryPages(pages,language,transcript){
 if(!Array.isArray(transcript?.words)||transcript.words.length>5000)throw Error('Missing word timestamps');
 const script=pages.map(page=>tokens(page[language]));const expected=script.flat();const heard=transcript.words.flatMap(word=>{if(!Number.isFinite(word.start)||!Number.isFinite(word.end)||word.start<0||word.end<word.start)throw Error('Invalid word timestamps');return tokens(word.word).map(token=>({token,start:word.start,end:word.end}));});
 if(!expected.length||expected.length>2500||!heard.length||heard.length>3000)throw Error('Invalid alignment size');
 const width=heard.length+1,table=Array.from({length:expected.length+1},()=>new Uint16Array(width));
 for(let i=expected.length-1;i>=0;i--)for(let j=heard.length-1;j>=0;j--)table[i][j]=expected[i]===heard[j].token?1+table[i+1][j+1]:Math.max(table[i+1][j],table[i][j+1]);
 const matches=new Map();let i=0,j=0;while(i<expected.length&&j<heard.length){if(expected[i]===heard[j].token){matches.set(i,j);i++;j++;}else if(table[i+1][j]>=table[i][j+1])i++;else j++;}
 let offset=0;const bounds=script.map(words=>{const first=offset,last=offset+words.length-1;offset+=words.length;const count=words.reduce((n,word,index)=>n+Number(matches.has(first+index)),0);if(count/words.length<.88||!matches.has(first)||!matches.has(last)||!matches.has(last-1))throw Error('Script alignment needs review');return {start:heard[matches.get(first)].start,end:heard[matches.get(last)].end};});
 const starts=[0];for(let n=0;n<bounds.length-1;n++){const end=bounds[n].end,next=bounds[n+1].start;if(next<end-.1||end<=starts.at(-1))throw Error('Ambiguous page boundary');starts.push(Math.max(end,Math.min(end+.2,next)));}
 if(!Number.isFinite(transcript.duration)||transcript.duration<bounds.at(-1).end-.2)throw Error('Incomplete narration timing');return {starts,ends:bounds.map(b=>b.end),duration:transcript.duration};
}
export async function transcribePublicNarration(audio,language,{apiKey=process.env.OPENAI_API_KEY,fetchImpl=globalThis.fetch}={}){
 if(!apiKey||!['en','fil'].includes(language))throw Error('Alignment not configured');const form=new FormData();form.append('file',new Blob([audio],{type:'audio/mpeg'}),'public-story.mp3');form.append('model','whisper-1');form.append('response_format','verbose_json');form.append('timestamp_granularities[]','word');form.append('language',language==='fil'?'tl':'en');form.append('prompt','Tala, Bituin, Kiko, Maya.');
 let response;try{response=await fetchImpl('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`},body:form,signal:AbortSignal.timeout(90000)});}catch{throw Error('Timing connection unavailable');}if(!response.ok)throw Error(`Timing provider HTTP ${Number(response.status)||0}`);return response.json();
}
