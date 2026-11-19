// ===== Child interface, speech, feedback, parent dashboard =====
const $=s=>document.querySelector(s);
const KID={va:'Picture pairs',vc:'Which ones go together',vs:'Listen and find',qa:'Number pairs',qp:'Balance puzzles',qs:'Bead patterns',nm:'Shape boxes',nf:'Paper folding',nc:'Shape groups'};
const PRAISE=['Great job!','You got it!','Super thinking!','Wonderful!','Yes! Nice work!','Awesome!','You figured it out!','Brilliant!'];
const AGAIN="Let's try that one again!";
// ---------- art for the child interface (no words needed)
const OWL=(cls)=>`<svg class="${cls||''}" viewBox="0 0 120 120"><ellipse cx="60" cy="72" rx="40" ry="42" fill="#8e6bd6" stroke="#2d2a40" stroke-width="4"/><ellipse cx="60" cy="84" rx="26" ry="26" fill="#d9c8f7"/><path d="M26 40 l6 -24 l16 18z M94 40 l-6 -24 l-16 18z" fill="#8e6bd6" stroke="#2d2a40" stroke-width="4" stroke-linejoin="round"/><circle cx="44" cy="54" r="17" fill="#fff" stroke="#2d2a40" stroke-width="4"/><circle cx="76" cy="54" r="17" fill="#fff" stroke="#2d2a40" stroke-width="4"/><circle class="pupil" cx="46" cy="56" r="7" fill="#2d2a40"/><circle class="pupil" cx="74" cy="56" r="7" fill="#2d2a40"/><path d="M54 68 l6 10 l6 -10z" fill="#f2b632" stroke="#2d2a40" stroke-width="3" stroke-linejoin="round"/><path d="M40 112 l-4 6 M48 113 l0 6 M80 113 l0 6 M88 112 l4 6" stroke="#f2b632" stroke-width="4" stroke-linecap="round"/></svg>`;
const ICON={
 play:'<svg viewBox="0 0 100 100"><path d="M34 22 L80 50 L34 78Z" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/></svg>',
 home:'<svg viewBox="0 0 100 100"><path d="M14 50 L50 18 L86 50" fill="none" stroke="#2d2a40" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 46 V84 H74 V46" fill="#ffd23f" stroke="#2d2a40" stroke-width="8" stroke-linejoin="round"/><rect x="42" y="60" width="16" height="24" fill="#2d2a40"/></svg>',
 speaker:'<svg viewBox="0 0 100 100"><path d="M16 38 H34 L56 18 V82 L34 62 H16Z" fill="#2d2a40" stroke="#2d2a40" stroke-width="5" stroke-linejoin="round"/><path class="wave w1" d="M66 36 Q76 50 66 64" fill="none" stroke="#2d2a40" stroke-width="7" stroke-linecap="round"/><path class="wave w2" d="M76 24 Q94 50 76 76" fill="none" stroke="#2d2a40" stroke-width="7" stroke-linecap="round"/></svg>',
 bulb:'<svg viewBox="0 0 100 100"><path d="M50 12 a26 26 0 0 1 16 46 v10 h-32 v-10 a26 26 0 0 1 16 -46z" fill="#ffd23f" stroke="#2d2a40" stroke-width="6" stroke-linejoin="round"/><rect x="36" y="72" width="28" height="8" rx="3" fill="#2d2a40"/><rect x="40" y="84" width="20" height="6" rx="3" fill="#2d2a40"/></svg>',
 eye:'<svg viewBox="0 0 100 100"><path d="M8 50 Q50 10 92 50 Q50 90 8 50Z" fill="#fff" stroke="#2d2a40" stroke-width="7"/><circle cx="50" cy="50" r="15" fill="#3d82c4" stroke="#2d2a40" stroke-width="5"/><circle cx="50" cy="50" r="6" fill="#2d2a40"/></svg>',
 lock:'<svg viewBox="0 0 100 100"><path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke="#5b6077" stroke-width="9"/><rect x="22" y="44" width="56" height="42" rx="8" fill="#9aa0b5" stroke="#5b6077" stroke-width="5"/></svg>',
 trophy:'<svg viewBox="0 0 100 100"><path d="M30 14 H70 V40 a20 20 0 0 1 -40 0Z" fill="#ffd23f" stroke="#2d2a40" stroke-width="6" stroke-linejoin="round"/><path d="M30 22 H16 q0 22 18 24 M70 22 H84 q0 22 -18 24" fill="none" stroke="#2d2a40" stroke-width="6"/><rect x="44" y="58" width="12" height="14" fill="#f2a01e" stroke="#2d2a40" stroke-width="5"/><rect x="30" y="72" width="40" height="14" rx="3" fill="#f2a01e" stroke="#2d2a40" stroke-width="6"/></svg>',
 moon:'<svg viewBox="0 0 100 100"><path d="M62 12 a38 38 0 1 0 26 58 a30 30 0 1 1 -26 -58z" fill="#ffe14d" stroke="#2d2a40" stroke-width="6"/></svg>',
 resume:'<svg viewBox="0 0 100 100"><path d="M24 22 L64 50 L24 78Z" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><rect x="70" y="22" width="12" height="56" rx="4" fill="#fff"/></svg>',
 search:'<svg viewBox="0 0 100 100"><circle cx="42" cy="42" r="24" fill="#bfe3f7" stroke="#2d2a40" stroke-width="8"/><path d="M60 60 L84 84" stroke="#2d2a40" stroke-width="12" stroke-linecap="round"/></svg>',
};
const STAR=(fill,sz)=>`<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><path d="M50 6 L62 37 L95 38 L69 59 L78 92 L50 73 L22 92 L31 59 L5 38 L38 37Z" fill="${fill}" stroke="#2d2a40" stroke-width="5" stroke-linejoin="round"/></svg>`;
const TILE={
 va:`<svg viewBox="0 0 120 70">${'<g transform="translate(0,8) scale(.5)">'+ICONS.bird.s+'</g><text x="52" y="40" font-size="20" fill="#8a8fa8">➜</text><g transform="translate(66,8) scale(.5)">'+ICONS.nest.s+'</g>'}</svg>`,
 vc:`<svg viewBox="0 0 120 70"><g transform="translate(0,14) scale(.4)">${ICONS.apple.s}</g><g transform="translate(40,14) scale(.4)">${ICONS.banana.s}</g><g transform="translate(80,14) scale(.4)">${ICONS.orange.s}</g></svg>`,
 vs:`<svg viewBox="0 0 120 70"><g transform="translate(18,6) scale(.6)">${ICON.speaker.replace(/<\/?svg[^>]*>/g,'')}</g><g transform="translate(66,10) scale(.5)">${ICONS.umbrella.s}</g></svg>`,
 qa:`<svg viewBox="0 0 120 70">${[0,1].map(i=>`<circle cx="${14+i*14}" cy="35" r="6" fill="#3d82c4" stroke="#2d2a40" stroke-width="2"/>`).join('')}<text x="44" y="42" font-size="18" fill="#8a8fa8">➜</text>${[0,1,2,3].map(i=>`<circle cx="${70+(i%2)*14}" cy="${28+Math.floor(i/2)*14}" r="6" fill="#3d82c4" stroke="#2d2a40" stroke-width="2"/>`).join('')}</svg>`,
 qp:`<svg viewBox="0 0 120 70"><rect x="20" y="20" width="80" height="6" rx="3" fill="#8a5a2b"/><path d="M60 26 L72 62 H48Z" fill="#c98b4f" stroke="#2d2a40" stroke-width="2.5"/><circle cx="30" cy="14" r="5" fill="#e4473f"/><circle cx="42" cy="14" r="5" fill="#e4473f"/><circle cx="84" cy="14" r="5" fill="#e4473f"/><circle cx="96" cy="14" r="5" fill="#e4473f"/></svg>`,
 qs:`<svg viewBox="0 0 120 70">${[1,2,3,4].map((v,i)=>`<rect x="${20+i*24}" y="8" width="3" height="56" fill="#8a5a2b"/>`+[...Array(v)].map((_,k)=>`<ellipse cx="${21.5+i*24}" cy="${58-k*10}" rx="9" ry="4.5" fill="#f28c38" stroke="#2d2a40" stroke-width="1.6"/>`).join('')).join('')}</svg>`,
 nm:`<svg viewBox="0 0 120 70"><rect x="30" y="4" width="28" height="28" rx="4" fill="#fff" stroke="#c9cde0" stroke-width="2"/><circle cx="44" cy="18" r="9" fill="#e4473f"/><rect x="62" y="4" width="28" height="28" rx="4" fill="#fff" stroke="#c9cde0" stroke-width="2"/><circle cx="76" cy="18" r="9" fill="none" stroke="#e4473f" stroke-width="3"/><rect x="30" y="36" width="28" height="28" rx="4" fill="#fff" stroke="#c9cde0" stroke-width="2"/><rect x="36" y="42" width="16" height="16" fill="#3d82c4"/><rect x="62" y="36" width="28" height="28" rx="4" fill="#fff8e6" stroke="#f2a01e" stroke-width="2" stroke-dasharray="4 3"/></svg>`,
 nf:`<svg viewBox="0 0 120 70"><rect x="14" y="10" width="44" height="50" fill="#fffdf6" stroke="#2d2a40" stroke-width="2.5"/><path d="M36 8 V62" stroke="#3d82c4" stroke-width="2.5" stroke-dasharray="5 4"/><rect x="70" y="10" width="44" height="50" fill="#fffdf6" stroke="#2d2a40" stroke-width="2.5"/><circle cx="82" cy="28" r="4" fill="#2d2a40"/><circle cx="102" cy="28" r="4" fill="#2d2a40"/></svg>`,
 nc:`<svg viewBox="0 0 120 70"><path d="M20 52 L32 26 L44 52Z" fill="#3aa35b"/><path d="M54 56 L66 18 L78 56Z" fill="none" stroke="#8e5bd6" stroke-width="3.5"/><path d="M88 50 L98 30 L108 50Z" fill="url(#st-orange)" stroke="#f28c38" stroke-width="3"/></svg>`,
};
const BATT_ART={V:`<svg viewBox="0 0 100 100"><path d="M14 20 h72 a8 8 0 0 1 8 8 v36 a8 8 0 0 1 -8 8 h-40 l-18 16 v-16 h-14 a8 8 0 0 1 -8 -8 v-36 a8 8 0 0 1 8 -8z" fill="#fff" stroke="#2d2a40" stroke-width="5"/><circle cx="34" cy="46" r="6" fill="#e86aa6"/><circle cx="50" cy="46" r="6" fill="#e86aa6"/><circle cx="66" cy="46" r="6" fill="#e86aa6"/></svg>`,
 Q:`<svg viewBox="0 0 100 100">${[0,1,2,3,4,5].map(i=>`<circle cx="${26+(i%3)*24}" cy="${36+Math.floor(i/3)*26}" r="10" fill="#fff" stroke="#2d2a40" stroke-width="4"/>`).join('')}</svg>`,
 N:`<svg viewBox="0 0 100 100"><path d="M12 80 L32 40 L52 80Z" fill="#fff" stroke="#2d2a40" stroke-width="5" stroke-linejoin="round"/><rect x="56" y="18" width="30" height="30" fill="#fff" stroke="#2d2a40" stroke-width="5"/><circle cx="72" cy="70" r="14" fill="#fff" stroke="#2d2a40" stroke-width="5"/></svg>`};

// ---------- speech
const SP={ok:typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined',voice:null,token:0};
function pickVoice(){if(!SP.ok)return;const vs=speechSynthesis.getVoices();if(!vs.length)return;
  const want=S&&S.settings.voiceName;let v=want&&vs.find(x=>x.name===want);
  if(!v)v=['Samantha','Google US English','Microsoft Aria Online (Natural) - English (United States)','Microsoft Jenny Online (Natural) - English (United States)','Karen','Moira','Microsoft Zira - English (United States)'].map(n=>vs.find(x=>x.name===n)).find(Boolean);
  if(!v)v=vs.find(x=>/^en[-_]US/i.test(x.lang))||vs.find(x=>/^en/i.test(x.lang))||vs[0];SP.voice=v}
function speak(text,cb,rate){
  const tok=++SP.token;const btn=$('#spk');
  const done=()=>{if(tok!==SP.token)return;btn&&btn.classList.remove('talking');cb&&cb()};
  if(!SP.ok||!S.settings.voice){setTimeout(done,Math.min(2500,300+text.length*25));return}
  try{
    const syn=speechSynthesis;
    const go=()=>{if(tok!==SP.token)return;
      const u=new SpeechSynthesisUtterance(text);if(SP.voice)u.voice=SP.voice;u.lang=(SP.voice&&SP.voice.lang)||'en-US';
      u.rate=rate||S.settings.rate;u.pitch=1.08;u.volume=1;
      u.onstart=()=>{SP.works=true;hideSoundFix()};u.onend=done;
      u.onerror=e=>{if(e&&(e.error==='not-allowed'||e.error==='audio-busy'))showSoundFix();done()};
      btn&&btn.classList.add('talking');try{syn.resume()}catch(e){}syn.speak(u);
      // if the browser silently refuses to talk (common on iPad before a tap), offer a big "turn sound on" button
      setTimeout(()=>{if(tok===SP.token&&!SP.works&&!syn.speaking){showSoundFix();done()}},2600);
      setTimeout(()=>{if(tok===SP.token&&!syn.speaking)done()},Math.max(4000,text.length*120));
    };
    // speak right away when nothing is playing, so it happens inside the tap (iPad/iPhone need that);
    // only wait a moment when we first have to stop an older sentence
    if(syn.speaking||syn.pending){syn.cancel();setTimeout(go,120)}else go();
  }catch(e){setTimeout(done,500)}
}
function showSoundFix(){
  if(SP.works||!S.settings.voice||$('#soundFix'))return;
  const b=document.createElement('button');b.id='soundFix';b.className='soundFix';b.setAttribute('aria-label','Turn sound on');
  b.innerHTML=ICON.speaker+'<span class="tapHand">👆</span>';
  b.onclick=()=>{unlockAudio(true);const say=CUR&&CUR.q&&$('#play').classList.contains('on')?CUR.q.say:"Hi! Let's play!";speak(say)};
  document.body.appendChild(b);
}
function hideSoundFix(){const b=$('#soundFix');if(b)b.remove()}
// ---------- sound effects
let AC=null;
function tone(freqs,dur,type){if(!S.settings.sfx)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume();const t0=AC.currentTime;
  freqs.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t0+i*dur);g.gain.exponentialRampToValueAtTime(0.18,t0+i*dur+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t0+i*dur+dur*1.6);o.connect(g);g.connect(AC.destination);o.start(t0+i*dur);o.stop(t0+i*dur+dur*1.8)})}catch(e){}}
const sfxRight=()=>tone([523,659,784,1047],0.09,'triangle'), sfxSoft=()=>tone([330,294],0.12,'sine');
function confetti(n){const box=$('#fx');const cols=['#e4473f','#ffd23f','#3aa35b','#3d82c4','#8e5bd6','#f28cc6'];
  for(let i=0;i<(n||40);i++){const d=document.createElement('i');d.className='cf';d.style.left=(30+Math.random()*40)+'vw';d.style.background=cols[i%cols.length];
    d.style.setProperty('--dx',(Math.random()*80-40)+'vw');d.style.setProperty('--r',(Math.random()*720)+'deg');d.style.animationDelay=(Math.random()*.15)+'s';box.appendChild(d);setTimeout(()=>d.remove(),1800)}}
function starBurst(){const s=document.createElement('div');s.className='burst';s.innerHTML=STAR('#ffd23f','100%');$('#fx').appendChild(s);setTimeout(()=>s.remove(),1300)}

// ---------- screens
function show(id){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('on',e.id===id));window.scrollTo(0,0)}
function levelStars(l,crown){return `<span class="lstars">${crown?'<span class="crown">👑</span>':''}${[1,2,3,4,5].map(i=>STAR(i<=l?'#ffd23f':'#eef0f7','16')).join('')}</span>`}
function jarHTML(){const s=Math.floor(S.stars),per=30,full=Math.floor(s/per),part=s%per;
  return `<div class="jars" title="Stars earned (parents: ${s})">${[...Array(Math.min(full,8))].map(()=>`<div class="jar full">${STAR('#ffd23f','70%')}</div>`).join('')}<div class="jar"><div class="jarfill" style="height:${Math.round(100*part/per)}%"></div>${STAR(part?'#ffd23f':'#eef0f7','60%')}</div></div>`}
function diagDone(){return S.diag.V&&S.diag.Q&&S.diag.N}
function renderHome(){
  const playIcon=S.resume?ICON.resume:ICON.play;
  const needDiag=!diagDone();
  let h=`<div class="homeTop"><div class="owlWrap">${OWL('owl bob')}</div>${jarHTML()}<button class="ibtn small lockBtn" id="parentBtn" aria-label="Grown-ups">${ICON.lock}</button></div>
  <div class="playRow"><button class="playBig ${needDiag?'diag':''}" id="playBtn" aria-label="Play">${playIcon}${needDiag&&!S.resume?`<span class="badge">${ICON.search}</span>`:''}</button>
  <button class="ibtn chal" id="chalBtn" aria-label="Challenge">${ICON.trophy}</button></div><div class="batts">`;
  for(const b of ['V','Q','N']){
    h+=`<div class="batt b${b}"><div class="bhead"><div class="bart">${BATT_ART[b]}</div><span class="plabel">${{V:'Verbal',Q:'Quantitative',N:'Nonverbal'}[b]}</span></div><div class="tiles">`;
    for(const t of BATT[b]){const st=typeStats(t);h+=`<button class="tile" data-t="${t}" aria-label="${TYPES[t].name}"><div class="ticon">${TILE[t]}</div>${levelStars(S.types[t].level,st.mastered)}<span class="plabel">${TYPES[t].name}</span></button>`}
    h+=`</div></div>`;
  }
  h+=`</div><div class="foot plabel">${memOnly?'⚠ This browser is not saving progress (private mode?). ':''}${SP.ok?'':'🔇 Spoken instructions are not supported in this browser. A grown-up can read the instructions shown under each question. '}Parents: tap the lock for reports.</div>`;
  $('#home').innerHTML=h;
  $('#playBtn').onclick=()=>{unlockAudio();if(S.resume)return resumeRound();if(needDiag)return startDiag();if(roundsToday()>=S.settings.dailyCap&&S.settings.dailyCap<99)return restScreen();startRound({mode:'p'})};
  $('#chalBtn').onclick=()=>{unlockAudio();speak('Challenge time! One puzzle of every kind.');startRound({mode:'c'})};
  $('#parentBtn').onclick=parentGate;
  document.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{unlockAudio();const t=b.dataset.t;startRound({mode:'t',type:t})});
  show('home');
}
function unlockAudio(force){
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume();const b=AC.createBuffer(1,1,22050),src=AC.createBufferSource();src.buffer=b;src.connect(AC.destination);src.start(0)}catch(e){}
  try{if(SP.ok&&(force||!SP.unlocked)){SP.unlocked=1;if(!speechSynthesis.speaking){const u=new SpeechSynthesisUtterance('hi');u.volume=0.01;u.rate=2;speechSynthesis.speak(u)}}}catch(e){}
}
document.addEventListener('pointerdown',()=>unlockAudio(),{capture:true,once:true});
document.addEventListener('touchend',()=>unlockAudio(),{capture:true,once:true});
function restScreen(){
  $('#end').innerHTML=`<div class="endCard">${OWL('owl sleepy')}<div class="bigIcon">${ICON.moon}</div><div class="row"><button class="ibtn big" id="restHome">${ICON.home}</button><button class="ibtn small ghost" id="oneMore">${ICON.play}</button></div></div>`;
  show('end');speak("Wow, you did so much thinking today! Your brain grows while you rest. Let's play again tomorrow!");
  $('#restHome').onclick=renderHome;$('#oneMore').onclick=()=>startRound({mode:'p'});
}

// ---------- rounds
let SES=null,CUR=null;
function startRound(o){
  SES={mode:o.mode,type:o.type,batt:o.batt,len:o.mode==='c'?9:o.mode==='d'?6:S.settings.roundLen,items:[],order:o.mode==='c'?R.shuffle(TYPE_IDS):null,start:Date.now()};
  persistSes();nextQ();
}
function startDiag(){const b=['V','Q','N'].find(x=>!S.diag[x]);
  $('#end').innerHTML=`<div class="endCard">${OWL('owl bob')}<div class="bigIcon">${ICON.search}</div><button class="playBig" id="goDiag">${ICON.play}</button></div>`;show('end');
  speak("Let's find out which puzzles you like! Some will be easy and some will be tricky. Just try your best.");
  $('#goDiag').onclick=()=>startRound({mode:'d',batt:b});
}
function persistSes(){S.resume=SES&&SES.items.length<SES.len?{mode:SES.mode,type:SES.type,batt:SES.batt,len:SES.len,order:SES.order,items:SES.items.map(x=>({t:x.t,level:x.level,dims:x.dims,res:x.res})),start:SES.start}:null;save()}
function resumeRound(){const r=S.resume;SES={...r,items:r.items.slice()};speak("Welcome back! Let's keep going.");setTimeout(nextQ,400)}
function nextQ(){
  if(SES.items.length>=SES.len) return endRound();
  const it=SES.mode==='d'?diagNext(SES):nextItem(SES);
  if(!it) return endRound();
  const opt={concept:it.concept,avoid:new Set(S.recent),avoidTpl:new Set(S.recentTpl)};
  const q=generate(it.t,it.level,opt); if(!q){SES.items.push({t:it.t,level:it.level,res:{r:'skip'}});return nextQ()}
  CUR={q,it,tries:0,hint:false,revealed:false,firstWrongKind:null,t0:0,locked:false};
  const T=S.types[it.t];
  if(!T.demo&&SES.mode!=='c'&&S.settings.demos!==false) return runDemo(it.t,()=>{T.demo=true;save();present()});
  present();
}
function dotsHTML(){let h='';for(let i=0;i<SES.len;i++){const x=SES.items[i];h+=`<span class="dot ${x?(x.res.r==='f'?'gold':x.res.r==='x'?'tried':'silver'):i===SES.items.length?'now':''}"></span>`}return h}
function renderQ(q,demo){
  const sp=SP.ok&&S.settings.voice;
  $('#play').innerHTML=`<div class="bar"><button class="ibtn" id="homeBtn" aria-label="Home">${ICON.home}</button><div class="dots">${dotsHTML()}</div>
   <button class="ibtn spk" id="spk" aria-label="Say it again">${ICON.speaker}</button>${SES.mode==='c'||demo?'':`<button class="ibtn" id="hintBtn" aria-label="Clue">${ICON.bulb}</button>`}<button class="ibtn small" id="demoBtn" aria-label="Show me how">${ICON.eye}</button></div>
   ${demo?`<div class="demoBanner"><div class="teach">${OWL('owl')}</div><div class="watch">${ICON.eye}</div><button class="playBig myTurn" id="skipDemo" aria-label="My turn">${ICON.play}</button></div>`:''}
   <div class="stem L-${q.layout} ${q.noStem?'nostem':''}" id="stem">${q.noStem?`<div class="oddArt">${OWL('owl small')}<div class="mag">${ICON.search}</div></div>`:q.stem}</div>
   <div class="choices L-${q.layout} ${q.choiceRender==='beads'||q.choiceRender==='towers'?'rods':''}" id="choices">${q.choices.map((c,i)=>`<button class="choice" data-i="${i}" aria-label="choice">${c.html}</button>`).join('')}</div>
   <div class="ptext ${sp?'':'on'}">${q.say}</div>`;
  if(q.sentence&&$('#stem .bigEar')) $('#stem .bigEar').innerHTML=`<button class="earBtn" id="earBtn">${ICON.speaker}</button>`;
  $('#homeBtn').onclick=()=>{document.querySelectorAll('.hand').forEach(h=>h.remove());$('#play').classList.remove('demoMode');if(CUR&&CUR.demo)CUR=null;SP.token++;try{speechSynthesis.cancel()}catch(e){}persistSes();renderHome()};
  $('#spk').onclick=()=>speak(CUR.q.say);
  if($('#earBtn')) $('#earBtn').onclick=()=>speak(CUR.q.say);
  if($('#hintBtn')) $('#hintBtn').onclick=()=>giveHint();
  $('#demoBtn').onclick=()=>{if(demo)return;const keep=CUR;runDemo(CUR.q.type,()=>{CUR=keep;present(true)})};
  show('play');
}
function present(again){
  const q=CUR.q;renderQ(q);CUR.t0=Date.now();CUR.locked=false;
  document.querySelectorAll('#choices .choice').forEach(b=>b.onclick=()=>choose(+b.dataset.i,b));
  speak(q.say);
}
function choose(i,btn){
  if(!CUR||CUR.demo||CUR.locked||btn.classList.contains('gone'))return;
  const q=CUR.q;CUR.tries++;
  if(CUR.tries===1) CUR.ms=Date.now()-CUR.t0;
  if(i===q.answer){
    CUR.locked=true;btn.classList.add('right');
    const r=CUR.revealed?'x':CUR.tries===1&&!CUR.hint?'f':CUR.hint?'h':'r';
    if(r!=='x'){sfxRight();starBurst();confetti(r==='f'?46:22);speak(R.pick(PRAISE))}else speak('That is the one. Good looking!');
    S.stars+=r==='f'?1:r==='x'?0:0.5;
    const res={r,ms:CUR.ms,tries:CUR.tries,firstWrongKind:CUR.firstWrongKind};
    const mode=SES.mode==='d'?'d':SES.mode==='c'?'c':CUR.it.easy?'e':SES.mode==='t'?'t':(CUR.it.review?'r':'p');
    record(q,res,mode);
    SES.items.push({t:q.type,level:q.level,dims:q.dims,res});persistSes();
    setTimeout(nextQ,r==='f'?1700:1500);
    return;
  }
  if(CUR.tries===1) CUR.firstWrongKind=q.choices[i].kind;
  btn.classList.add('shake');setTimeout(()=>btn.classList.add('gone'),380);sfxSoft();
  const left=[...document.querySelectorAll('#choices .choice')].filter((b,k)=>k!==i&&!b.classList.contains('gone'));
  if(left.length<=1||CUR.tries>=3) return reveal();
  if(CUR.tries===2&&SES.mode!=='c'&&!CUR.hint){giveHint(true);return}
  if(CUR.tries===2&&SES.mode==='c') return reveal();
  speak(AGAIN);
}
function giveHint(auto){
  if(CUR.locked||CUR.hint&&!auto)return; const q=CUR.q;CUR.hint=true;
  $('#stem').classList.add('hint-on');
  const bs=[...document.querySelectorAll('#choices .choice')];const live=bs.filter((b,k)=>k!==q.answer&&!b.classList.contains('gone'));
  if(live.length>=2&&bs.filter(b=>!b.classList.contains('gone')).length>=3) R.pick(live).classList.add('gone');
  speak((auto?AGAIN+' Here is a clue. ':'')+q.hintSay,null,q.sentence?0.8:undefined);
  if($('#hintBtn'))$('#hintBtn').classList.add('used');
}
function reveal(){
  CUR.revealed=true;const b=document.querySelectorAll('#choices .choice')[CUR.q.answer];b.classList.add('reveal');
  speak("Here it is! This is the one that fits. Tap it.");
}
function runDemo(t,cb){
  const q=generate(t,1,{});if(!q)return cb();
  const realCur=CUR;CUR={q,demo:true,locked:true};renderQ(q,true);
  $('#play').classList.add('demoMode');
  const hand=document.createElement('div');hand.className='hand';hand.innerHTML='👆';document.body.appendChild(hand);
  let gone=false;const cleanup=()=>{if(gone)return;gone=true;hand.remove();$('#play').classList.remove('demoMode')};
  const finish=()=>{cleanup();CUR=realCur;cb()};
  $('#skipDemo').onclick=finish;
  speak('Let me show you how this game works. '+q.say,()=>{
    if(gone)return;const target=document.querySelectorAll('#choices .choice')[q.answer];if(!target){return finish()}
    const r=target.getBoundingClientRect();hand.style.left=(r.left+r.width/2-20)+'px';hand.style.top=(r.top+r.height/2)+'px';hand.classList.add('go');
    setTimeout(()=>{if(gone)return;target.classList.add('right');starBurst();sfxRight();
      setTimeout(()=>{hand.remove();if(gone)return;
        // wait for HIM to tap "my turn": the demo never runs into his own question
        const go=$('#skipDemo');go.classList.add('ready');
        speak("That's how you play. Now it's your turn! Tap the green button.")},900)},1400);
  });
}
function endRound(){
  const items=SES.items.filter(x=>x.res.r!=='skip');
  if(SES.mode==='d') diagPlace(SES);
  if(SES.mode==='c') S.challenges.push({d:Date.now(),res:Object.fromEntries(SES.items.map(x=>[x.t,{r:x.res.r,l:x.level}]))});
  S.rounds.push({day:today(),d:Date.now(),mode:SES.mode,n:items.length,f:items.filter(x=>x.res.r==='f').length});
  if(S.rounds.length>500)S.rounds=S.rounds.slice(-500);
  S.resume=null;save();
  const stars=items.map(x=>STAR(x.res.r==='f'?'#ffd23f':x.res.r==='x'?'#fff':'#d6dbe6','56')).join('');
  const nextDiag=SES.mode==='d'&&!diagDone();
  $('#end').innerHTML=`<div class="endCard">${OWL('owl jump')}<div class="starsRow">${stars}</div>${SES.mode==='c'?`<div class="bigIcon">${ICON.trophy}</div>`:''}<div class="row"><button class="ibtn big" id="endHome">${ICON.home}</button><button class="playBig" id="endAgain">${ICON.play}</button></div></div>`;
  show('end');confetti(70);tone([523,659,784,659,1047],0.12,'triangle');
  speak(SES.mode==='c'?'You finished the challenge! You should be proud of your thinking!':nextDiag?'Great work! Ready for more puzzles?':'You did it! Great thinking!');
  const last=SES;
  $('#endHome').onclick=renderHome;
  $('#endAgain').onclick=()=>{if(nextDiag)return startDiag();if(last.mode==='t')return startRound({mode:'t',type:last.type});if(!diagDone())return startDiag();if(roundsToday()>=S.settings.dailyCap)return restScreen();startRound({mode:'p'})};
}

// ---------- parent area
function parentGate(){
  const a=R.ri(6,9),b=R.ri(6,9);let val='';
  const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="gate"><div class="gq">Grown-ups only<br><b>${a} × ${b} = ?</b></div><div class="gin" id="gin">&nbsp;</div><div class="pad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'OK'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div><button class="gclose" id="gclose">✕</button></div>`;
  document.body.appendChild(m);
  m.querySelectorAll('.pad button').forEach(btn=>btn.onclick=()=>{const k=btn.dataset.k;if(k==='⌫')val=val.slice(0,-1);else if(k==='OK'){if(+val===a*b){m.remove();renderParent()}else{val='';m.querySelector('.gate').classList.add('shake');setTimeout(()=>m.querySelector('.gate').classList.remove('shake'),400)}}else if(val.length<3)val+=k;if(m.isConnected)$('#gin').innerHTML=val||'&nbsp;'});
  $('#gclose').onclick=()=>m.remove();
}
function bar(p,col){return `<div class="pbar"><div style="width:${Math.round(100*p)}%;background:${col||'#3d82c4'}"></div></div>`}
function fmtDate(d){return new Date(d).toLocaleDateString(undefined,{month:'short',day:'numeric'})}
function renderParent(){
  const prof=skillProfile();const E=prof._err;const totalQ=TYPE_IDS.reduce((a,t)=>a+S.types[t].hist.length,0);
  let h=`<div class="pwrap max-w-5xl mx-auto p-4"><div class="flex items-center justify-between gap-2 flex-wrap"><h1 class="text-2xl font-bold">Parent dashboard</h1><button class="pbtn" id="pBack">← Back to the game</button></div>
  <p class="pnote">Total questions answered: <b>${totalQ}</b> · Practice rounds today: <b>${roundsToday()}</b> · Diagnostic: ${['V','Q','N'].map(b=>`${{V:'Verbal',Q:'Quantitative',N:'Nonverbal'}[b]} ${S.diag[b]?'✓ '+fmtDate(S.diag[b].d):'not yet'}`).join(' · ')}</p>
  <p class="pnote small">"Mastery" here means consistent, independent performance in this game, at the hardest level, on new-looking problems, and again on later days. It is a practice measure; it does <b>not</b> predict a CogAT percentile, stanine, or score. Levels are the game's own learning stages, not official score bands.</p>`;
  // skills profile
  h+=`<h2>Reasoning skills profile</h2><p class="pnote small">Built from every question (diagnostic and practice). First-try accuracy on questions that need each skill, plus what kind of wrong answer he picks.</p><div class="ptable"><table><tr><th>Skill</th><th>Questions</th><th>First-try</th><th>Wrong picks: almost-right / unrelated</th><th>What it suggests</th></tr>`;
  for(const d in DIMS){const o=prof[d];h+=`<tr><td><b>${DIMS[d]}</b></td><td>${o.n}</td><td>${o.n?pct(o.ft/o.n)+bar(o.ft/o.n,o.ft/o.n>=.75?'#3aa35b':o.ft/o.n>=.5?'#f2a01e':'#e4473f'):'–'}</td><td>${o.err?`${o.plaus} / ${o.unrel}`:'–'}</td><td>${skillNote(d,o)}</td></tr>`}
  h+=`</table></div><p class="pnote small">Error pattern overall: ${E.n?`${pct(E.plaus/E.n)} of first wrong picks were almost-right answers (he sees the idea but misses a detail) and ${pct(E.unrel/E.n)} were unrelated (the relationship was not recognized yet).`:'no errors recorded yet.'} ${E.quick?`Very fast taps (under 1.6 s, before the question was heard): ${E.quick} of ${E.total}; these never count toward levelling up.`:''}</p>`;
  // per type table
  h+=`<h2>Question types</h2><div class="ptable"><table class="wide"><tr><th>Type</th><th>Done <span class="tiny">(+ easy)</span></th><th>First-try</th><th>Right after retry</th><th>Right after hint</th><th>Answer shown</th><th>Level now</th><th>Highest solid level</th><th>New-look wins</th><th>Kept on later days</th><th>Mastery score</th><th>Status</th></tr>`;
  for(const b of ['V','Q','N'])for(const t of BATT[b]){const st=typeStats(t);
    const ck=Object.entries(st.checks).map(([k,v])=>`<span class="ck">${v?'✓':'○'} ${k}</span>`).join('');
    h+=`<tr><td><b>${TYPES[t].name}</b><div class="tiny">${{V:'Verbal',Q:'Quantitative',N:'Nonverbal'}[b]}</div></td><td>${st.n}${st.easy?` <span class="tiny">+${st.easy}</span>`:''}</td><td>${st.n?pct(st.ft):'–'}</td><td>${st.n?pct(st.retry):'–'}</td><td>${st.n?pct(st.hint):'–'}</td><td>${st.n?pct(st.shown):'–'}</td><td>${S.types[t].level} / 5</td><td>${st.Lr||'–'}</td><td>${st.transfer}</td><td>${st.ret} day${st.ret===1?'':'s'}</td><td>${st.n?st.score:'–'}${st.n?bar(st.score/100,'#8e5bd6'):''}</td><td><b>${st.status}</b><div class="tiny">${ck}</div>${st.n&&st.n<20?'<div class="tiny warn">small sample: treat with caution</div>':''}</td></tr>`}
  h+=`</table></div><p class="pnote small">Mastered needs all five: accuracy (Wilson lower bound ≥ 65% over the last 20+), difficulty (solid at level 5, 10+ hard questions), variety (3+ different ideas at levels 4–5), transfer (3+ first-try wins on known ideas shown in a new way), retention (right again on 2+ later days).</p>`;
  // trouble concepts
  const trouble=[];for(const t of TYPE_IDS){const by={};for(const e of S.types[t].hist){const k=e.c;by[k]=by[k]||{n:0,f:0,pl:0,un:0};by[k].n++;if(e.r==='f'&&!e.g)by[k].f++;else if(e.ek){PLAUSIBLE.has(e.ek)?by[k].pl++:by[k].un++}}
    for(const k in by){const o=by[k];if(o.n>=3&&o.f/o.n<0.6)trouble.push({t,k,...o})}}
  trouble.sort((a,b)=>a.f/a.n-b.f/b.n);
  h+=`<h2>Ideas that keep causing difficulty</h2>${trouble.length?`<div class="ptable"><table><tr><th>Type</th><th>Idea</th><th>Tries</th><th>First-try</th><th>Wrong picks (almost / unrelated)</th></tr>${trouble.slice(0,10).map(o=>`<tr><td>${TYPES[o.t].name}</td><td>${TYPES[o.t].cname(o.k)}</td><td>${o.n}</td><td>${pct(o.f/o.n)}</td><td>${o.pl} / ${o.un}</td></tr>`).join('')}</table></div><p class="pnote small">These ideas are automatically brought back a few questions later in a new picture, and scheduled for spaced review.</p>`:'<p class="pnote">None yet (an idea is listed after 3+ tries with under 60% first-try).</p>'}`;
  // plan
  const plan=TYPE_IDS.map(t=>({t,...needWeight(t)})).sort((a,b)=>b.w-a.w);const tot=plan.reduce((a,b)=>a+b.w,0);
  h+=`<h2>What “Play” will focus on next</h2><p class="pnote small">Each round starts with a warm-up and ends on an easier “win”. The middle questions are shared out like this (weak and unmastered areas get most of the time; mastered areas only return for spaced review). After two misses in a row the next question is easier.</p><div class="ptable"><table><tr><th>Type</th><th>Share of focus questions</th><th>Why</th></tr>${plan.map(p=>`<tr><td>${TYPES[p.t].name}</td><td>${pct(p.w/tot)}${bar(p.w/tot,'#f2a01e')}</td><td>${p.why}</td></tr>`).join('')}</table></div>`;
  // progress over time
  h+=`<h2>Progress over time</h2>${progressChart()}<div class="ptable"><table><tr><th>Type</th><th>Level changes</th></tr>${TYPE_IDS.map(t=>`<tr><td>${TYPES[t].name}</td><td>${S.types[t].ups.length?S.types[t].ups.slice(-8).map(u=>`${u.down?'↓':'↑'} L${u.l} <span class="tiny">${fmtDate(u.d)}</span>`).join(' · '):'<span class="tiny">no changes yet</span>'}</td></tr>`).join('')}</table></div>`;
  // diagnostic snapshot
  h+=`<h2>Diagnostic snapshot</h2>`;
  if(['V','Q','N'].some(b=>S.diag[b])){h+=`<div class="ptable"><table><tr><th>Type</th><th>One-rule question (level 2)</th><th>Follow-up</th><th>Starting level</th><th>First wrong pick</th></tr>`;
    for(const b of ['V','Q','N'])if(S.diag[b])for(const t in S.diag[b].types){const o=S.diag[b].types[t];const R2={f:'✓ first try',r:'✓ on retry',h:'✓ with clue',x:'✗ shown'};
      h+=`<tr><td>${TYPES[t].name}</td><td>${R2[o.a]}</td><td>${R2[o.b]} <span class="tiny">(level ${o.bLevel}${o.bLevel>=3?', several attributes / look-alike answers':', easier check'})</span></td><td>${o.level}</td><td class="tiny">${o.ek.map(k=>k?(PLAUSIBLE.has(k)?'almost-right ('+k+')':'unrelated'):'–').join(' · ')}</td></tr>`}
    h+=`</table></div>`}else h+='<p class="pnote">Not taken yet. “Play” starts it automatically (three short parts, one per battery, 6 questions each).</p>';
  if(S.challenges.length){h+=`<h2>Challenge results</h2><div class="ptable"><table><tr><th>Date</th>${TYPE_IDS.map(t=>`<th class="tiny">${TYPES[t].name}</th>`).join('')}</tr>${S.challenges.slice(-8).reverse().map(c=>`<tr><td>${fmtDate(c.d)}</td>${TYPE_IDS.map(t=>{const x=c.res[t];return `<td>${x?(x.r==='f'?'✓':'○')+' <span class="tiny">L'+x.l+'</span>':''}</td>`}).join('')}</tr>`).join('')}</table></div><p class="pnote small">Challenge: one question per type at a stretch level, no clue button. ✓ = first try.</p>`}
  // settings
  const vs=SP.ok?speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)):[];
  h+=`<h2>Settings</h2><div class="pset">
   <label>Questions per round <select id="sLen">${[4,5,6,8,10].map(n=>`<option ${S.settings.roundLen==n?'selected':''}>${n}</option>`).join('')}</select></label>
   <label>Rounds per day before a rest suggestion <select id="sCap">${[[2,'2'],[3,'3'],[4,'4'],[6,'6'],[99,'no limit']].map(([v,l])=>`<option value="${v}" ${S.settings.dailyCap==v?'selected':''}>${l}</option>`).join('')}</select></label>
   <label>Voice speed <input type="range" id="sRate" min="0.7" max="1.15" step="0.05" value="${S.settings.rate}"></label>
   <label><input type="checkbox" id="sVoice" ${S.settings.voice?'checked':''}> Spoken instructions</label>
   <label><input type="checkbox" id="sSfx" ${S.settings.sfx?'checked':''}> Sound effects</label>
   <label><input type="checkbox" id="sDemo" ${S.settings.demos!==false?'checked':''}> Show a "watch me" demo the first time he meets each puzzle type</label>
   ${vs.length?`<label>Voice <select id="sVoiceName"><option value="">Automatic</option>${vs.map(v=>`<option ${S.settings.voiceName===v.name?'selected':''}>${v.name}</option>`).join('')}</select></label>`:''}
   <button class="pbtn" id="sTest">Test voice</button></div>
   ${SP.ok?'':'<p class="pnote warn">This browser has no speech synthesis. The instruction text is shown under each question so you can read it aloud.</p>'}
  <h2>Saving</h2><p class="pnote">This game has <b>one player</b>, so there is nothing to choose or log in to. Progress saves automatically after every question${S.lastSaved?` (last saved ${new Date(S.lastSaved).toLocaleString()})`:''}.${memOnly?' <b class="warn">Right now this browser is blocking saving (private browsing?), so progress will be lost when the page closes.</b>':''}</p>
  <p class="pnote small">The save lives inside the browser on this device. To keep one continuous record: <b>always open the game the same way on the same device</b> (for example, always from the K12 Games dashboard in Safari, or always from the Home Screen icon). On iPad and iPhone, the Home Screen app and Safari keep <i>separate</i> saves, and Safari may clear the saves of sites not opened for about a week, so using the Home Screen icon is the safest choice. To move to another device, use Export there and Import here.${persistNote()}</p>
  ${backupNag()}
  <h2>Data</h2><div class="pset"><button class="pbtn" id="dExport">Export progress (backup file)</button><label class="pbtn">Import progress<input type="file" id="dImport" accept=".json" hidden></label><button class="pbtn" id="dDiag">Run the diagnostic again</button><button class="pbtn danger" id="dReset">Reset all progress</button></div>
  <p class="pnote small">Progress is saved only in this browser on this device (no account, no server). Use Export/Import to move it.</p></div>`;
  $('#parent').innerHTML=h;show('parent');
  $('#pBack').onclick=renderHome;
  const set=(k,v)=>{S.settings[k]=v;save()};
  $('#sLen').onchange=e=>set('roundLen',+e.target.value);$('#sCap').onchange=e=>set('dailyCap',+e.target.value);$('#sRate').oninput=e=>set('rate',+e.target.value);
  $('#sVoice').onchange=e=>set('voice',e.target.checked);$('#sDemo').onchange=e=>set('demos',e.target.checked);$('#sSfx').onchange=e=>set('sfx',e.target.checked);
  if($('#sVoiceName'))$('#sVoiceName').onchange=e=>{set('voiceName',e.target.value);pickVoice()};
  $('#sTest').onclick=()=>speak('Look at the first two pictures. They go together.');
  $('#dExport').onclick=()=>{S.lastExport=Date.now();save();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='brainy-owl-progress-'+today()+'.json';a.click()};
  $('#dImport').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const o=JSON.parse(t);if(o.v!==1||!o.types)throw 0;S=o;TYPE_IDS.forEach(id=>{if(!S.types[id])S.types[id]=freshType()});save();renderParent()}catch(err){alert('That file is not a Brainy Owl progress file.')}})};
  $('#dDiag').onclick=()=>{if(confirm('Run the three short diagnostic parts again next time Play is pressed? (Progress is kept.)')){S.diag={V:null,Q:null,N:null};save();renderParent()}};
  $('#dReset').onclick=()=>{if(confirm('Erase ALL progress, history and settings on this device?')&&confirm('Are you sure? This cannot be undone.')){localStorage.removeItem(KEY);S=fresh();save();renderHome()}};
}
function persistNote(){return SP.persisted===true?' This browser has agreed to keep the save permanently.':''}
function backupNag(){const n=TYPE_IDS.reduce((a,t)=>a+S.types[t].hist.length,0);if(n<40)return '';const last=S.lastExport||0;
  if(Date.now()-last<14*DAY)return `<p class="pnote small">Last backup: ${fmtDate(last)}.</p>`;
  return `<p class="pnote warn">${last?'Last backup was '+fmtDate(last)+'.':'No backup yet.'} Tap “Export progress” below to save a copy of ${n} answered questions, in case this browser's data is ever cleared.</p>`}
function progressChart(){
  const days=[...Array(14)].map((_,i)=>dayOf(Date.now()-(13-i)*DAY));const by={};days.forEach(d=>by[d]={n:0,f:0});
  for(const t of TYPE_IDS)for(const e of S.types[t].hist){const d=dayOf(e.d);if(by[d]){by[d].n++;if(e.r==='f'&&!e.g)by[d].f++}}
  const mx=Math.max(10,...days.map(d=>by[d].n)),W=640,H=190,bw=W/14;
  let s=`<svg viewBox="0 0 ${W} ${H+34}" class="chart"><line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="#c9cde0"/>`;
  days.forEach((d,i)=>{const o=by[d],bh=o.n/mx*(H-20);s+=`<rect x="${i*bw+6}" y="${H-bh}" width="${bw-12}" height="${bh}" rx="4" fill="#bfe3f7"><title>${d}: ${o.n} questions</title></rect>`;if(o.n)s+=`<text x="${i*bw+bw/2}" y="${H-bh-4}" font-size="11" text-anchor="middle" fill="#5b6077">${o.n}</text>`;s+=`<text x="${i*bw+bw/2}" y="${H+16}" font-size="10" text-anchor="middle" fill="#8a8fa8">${d.slice(5)}</text>`});
  const pts=days.map((d,i)=>by[d].n?[i*bw+bw/2,H-(by[d].f/by[d].n)*(H-20)]:null).filter(Boolean);
  if(pts.length)s+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#8e5bd6" stroke-width="3"/>`+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#8e5bd6"/>`).join('');
  return s+`<text x="4" y="${H+32}" font-size="11" fill="#5b6077">Blue bars: questions per day. Purple line: first-try accuracy (top = 100%).</text></svg>`;
}
function init(){
  load();
  let defs='<marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e4473f"/></marker>';
  for(const [k,c] of Object.entries(NCOL)) defs+=`<pattern id="st-${k}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fff"/><rect width="3.2" height="7" fill="${c}"/></pattern><pattern id="dt-${k}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><circle cx="3.5" cy="3.5" r="1.9" fill="${c}"/></pattern>`;
  $('#defs').innerHTML=`<defs>${defs}</defs>`;
  if(SP.ok){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().then(v=>SP.persisted=v)}catch(e){}
  renderHome();
}
window.addEventListener('DOMContentLoaded',init);
