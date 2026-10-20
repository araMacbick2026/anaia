export const companions = [
 {id:'tala',name:'Tala',role:'The curious storyteller',description:'Tala uses pictures and words to share her ideas. She loves little discoveries and making space for everyone.',color:'#dcebe3',activity:'communication'},
 {id:'bituin',name:'Bituin',role:'The gentle little star',description:'Bituin notices small wonders. A quiet moment is a good moment, too.',color:'#fbefd2',activity:'stories'},
 {id:'kiko',name:'Kiko',role:'The thoughtful turtle',description:'Kiko likes shapes, familiar things, and going at his own pace. There is never a race.',color:'#e6ebd7',activity:'play'},
 {id:'maya',name:'Maya',role:'The music-loving bird',description:'Maya finds a little song in everyday life. She always checks whether her friends want sound or quiet.',color:'#f4e1da',activity:'play'}
];
export function character(id='tala'){return companions.find(c=>c.id===id)||companions[0];}
export function companionArt(id='tala', className='', decorative=true){const c=character(id);return `<img class="companion-art ${className}" src="/art/${c.id}.svg" alt="${decorative?'':c.name+', '+c.role}">`;}
export function symbol(name,className=''){return `<img class="symbol ${className}" src="/art/${name}.svg" alt="">`;}
