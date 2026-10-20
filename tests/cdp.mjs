export async function browser(origin='http://127.0.0.1:3010',targetId){
 const pages=await(await fetch('http://127.0.0.1:9222/json')).json();
 const socket=new WebSocket(pages.find(p=>targetId?p.id===targetId:p.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.onopen=r);let sequence=0;const pending=new Map(),errors=[];
 socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
 function call(method,params={}){return new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
 async function js(expression){const result=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;}
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 async function until(expression){for(let i=0;i<100;i++){if(await js(expression))return;await delay(100);}throw Error('Timeout: '+expression);}
 async function click(selector){await js(`document.querySelector(${JSON.stringify(selector)}).click()`);await delay(150);}
 async function fill(selector,value){await js(`document.querySelector(${JSON.stringify(selector)}).value=${JSON.stringify(value)}`);}
 async function go(route){await js(`location.hash=${JSON.stringify(route)}`);await delay(150);}
 await call('Runtime.enable');await call('Network.enable');await call('Page.enable');
 return {call,js,delay,until,click,fill,go,origin,errors,close:()=>socket.close()};
}
