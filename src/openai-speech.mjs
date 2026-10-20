// Server-only preview adapter. Never import this module into a browser bundle.
// This preview deliberately sends fixed public text, not a child's selections or profile.
export const previewVoices=['coral','sage','shimmer','echo'];
const previewText='Hello! This is ANAIA. Let’s communicate, play, and share a story together.';
export async function createVoicePreview({voice='coral',delivery='gentle',apiKey=process.env.OPENAI_API_KEY,fetchImpl=globalThis.fetch}={}){
 if(!apiKey)throw Error('OpenAI speech is not configured. Device speech remains available.');
 if(!previewVoices.includes(voice)||!['gentle','bright','calm'].includes(delivery))throw Error('Choose an available preview voice and delivery.');
 const instructions={gentle:'Speak gently and warmly, with clear pronunciation and an unhurried pace. Keep the delivery natural.',bright:'Speak with a light, friendly, upbeat tone, clear pronunciation and moderate energy. Avoid shouting or exaggerated performance.',calm:'Speak calmly and reassuringly, with clear pronunciation and comfortable pauses.'}[delivery];
 let response;
 try{response=await fetchImpl('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini-tts',voice,input:previewText,instructions,response_format:'mp3'}),signal:AbortSignal.timeout(15000)});}catch{throw Error('The online voice preview could not connect. Device speech remains available.');}
 if(!response.ok)throw Error(`The online voice preview is unavailable (provider HTTP ${Number(response.status)||0}). Check the server configuration and API account.`);
 const audio=Buffer.from(await response.arrayBuffer());const type=response.headers?.get('content-type')||'';const mp3=audio.toString('ascii',0,3)==='ID3'||(audio[0]===255&&(audio[1]&224)===224);if(audio.length<16||audio.length>4*1024*1024||!type.startsWith('audio/')||!mp3)throw Error('The voice preview returned an invalid audio response.');
 return {audio,contentType:'audio/mpeg',disclosure:'This voice is AI-generated. It is not guaranteed to sound like a child.'};
}
