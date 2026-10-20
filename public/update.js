const button=document.querySelector('#update-button'),status=document.querySelector('#update-status');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function workerVersion(worker){return new Promise(resolve=>{if(!worker)return resolve(null);const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();resolve(null);},600);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data?.version||null);};worker.postMessage({type:'GET_VERSION'},[channel.port2]);});}
button.addEventListener('click',async()=>{
 button.disabled=true;
 try{
  if(!navigator.onLine)throw Error('You are offline. Reconnect to update. Your saved data is unchanged.');
  if(!('serviceWorker'in navigator))throw Error('This browser cannot manage offline updates. Try a current Chrome, Edge, or Safari browser.');
  const response=await fetch('/version.json',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('The latest version could not be checked. Try again shortly.');
  const target=await response.json();status.textContent='Downloading the latest application files…';
  const registration=await navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'});await registration.update();
  const deadline=Date.now()+45000;let activated=false;
  while(Date.now()<deadline){
   const waiting=registration.waiting;
   if(waiting&&!activated){status.textContent='Applying the update. Keeping your saved records…';waiting.postMessage({type:'ACTIVATE_UPDATE'});activated=true;}
   const controller=navigator.serviceWorker.controller;
   if(await workerVersion(controller)===target.version){status.textContent='ANAIA is up to date. Opening the app…';location.replace('/#home');return;}
   if(!registration.installing&&!registration.waiting&&!registration.active)throw Error('The update did not install. Please retry while connected.');
   await delay(250);
  }
  throw Error('The update did not finish in time. Check your connection and try again. No saved records were cleared.');
 }catch(error){status.textContent=error.message||'The update could not complete. Please try again.';button.disabled=false;}
});
