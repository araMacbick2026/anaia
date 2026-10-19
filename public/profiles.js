export function localDate(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
export function ageBand(profile, now = new Date()) {
  if (!profile?.birthday) return profile?.ageBand || 'child';
  const birth = new Date(profile.birthday + 'T12:00:00');
  if (!Number.isFinite(birth.getTime()) || profile.birthday > localDate(now)) return profile.ageBand || 'child';
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age < 13 ? 'child' : age < 18 ? 'teen' : 'adult';
}
export function validateProfile(input, now = new Date()) {
  const nickname = String(input.nickname || '').trim();
  if (!nickname || nickname.length > 40) throw Error('Enter a nickname of 1–40 characters.');
  const birthday = String(input.birthday || '');
  if (birthday) {
    const date = new Date(birthday + 'T12:00:00');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || !Number.isFinite(date.getTime()) || localDate(date) !== birthday || birthday > localDate(now) || date.getFullYear() < 1900) throw Error('Choose a valid birthday that is not in the future, or leave it blank.');
  }
  if (!['child','teen','adult'].includes(input.ageBand)) throw Error('Choose an age group.');
  if (!['','female','male','nonbinary','prefer-not'].includes(input.sex)) throw Error('Choose an available option for gender, or leave it blank.');
  if (!['tala','bituin','kiko','maya'].includes(input.companion)) throw Error('Choose a companion.');
  if (!['suggested','feminine','masculine','any'].includes(input.voiceStyle)) throw Error('Choose a voice preference.');
  return {nickname,birthday,sex:input.sex,ageBand:input.ageBand,companion:input.companion,voiceStyle:input.voiceStyle};
}
export function speechPreferences(profile, settings, voices) {
  const band = ageBand(profile);
  const lang = settings.language === 'fil' ? 'fil-PH' : 'en-US';
  const explicit = voices.find(v => v.voiceURI === settings.voice);
  let style = profile?.voiceStyle || 'any';
  if (style === 'suggested') style = profile.sex === 'female' ? 'feminine' : profile.sex === 'male' ? 'masculine' : 'any';
  const local = voices.filter(v => (settings.language==='fil'?/^(fil|tl)(-|$)/i.test(v.lang||''):v.lang?.toLowerCase().startsWith('en')));
  const pattern = style === 'feminine' ? /\b(female|woman|feminine|samantha|zira|victoria|karen|moira|susan)\b/i : style === 'masculine' ? /\b(male|man|masculine|david|daniel|alex|george|mark)\b/i : null;
  const compatible = pattern ? local.filter(v => pattern.test(v.name)) : local;
  const voice = explicit || compatible.find(v => v.localService) || compatible[0] || local.find(v => v.localService) || local[0];
  const adaptive = settings.adaptiveVoice !== false;
  return {voice,lang,pitch:adaptive ? ({child:1.12,teen:1.04,adult:1}[band]) : Math.max(.7,Math.min(1.4,Number(settings.pitch)||1)),rate:Math.max(.5,Math.min(1.5,(Number(settings.rate)||1) * (adaptive && band === 'child' ? .92 : 1)))};
}
