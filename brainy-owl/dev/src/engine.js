// ===== Adaptive learning engine: storage, levels, mastery, skills profile, practice planning =====
const KEY='brainyOwl_cogat7_v1';
const DAY=864e5;
const DIMS={REL:'Recognizing the relationship',WM:'Holding several attributes in mind',SPA:'Spatial transformations',NUM:'Number patterns',DIS:'Telling apart look-alike answers'};
const PLAUSIBLE=new Set(['near','partial','colmiss','rule','copy','lastonly','wrongaxis','nounfold','mirror','missing','noflip']);
const SR_INT=[0,1*DAY,3*DAY,7*DAY,21*DAY]; // spaced repetition boxes: again, 1 day, 3 days, 7 days, 3 weeks
let S=null, memOnly=false;
function freshType(){return {level:1,placed:false,hist:[],since:0,queue:[],boxes:{},last:0,retDays:[],dropFrom:0,demo:false,ups:[]}}
function fresh(){const t={};TYPE_IDS.forEach(id=>t[id]=freshType());
  return {v:1,created:Date.now(),settings:{rate:0.9,voice:true,sfx:true,roundLen:6,dailyCap:3,voiceName:''},diag:{V:null,Q:null,N:null},types:t,stars:0,rounds:[],recent:[],recentTpl:[],challenges:[],resume:null}}
function load(){
  try{const raw=localStorage.getItem(KEY);if(raw)S=JSON.parse(raw)}catch(e){memOnly=true}
  if(!S||S.v!==1) S=fresh();
  TYPE_IDS.forEach(id=>{if(!S.types[id])S.types[id]=freshType()});
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){memOnly=true}}
const today=()=>new Date().toISOString().slice(0,10);
const dayOf=ts=>new Date(ts).toISOString().slice(0,10);

// ---------- recording a finished question
// r: 'f' first try, 'r' right on a later try (no hint), 'h' right after a hint, 'x' not found (answer shown)
function record(q,res,mode){
  const T=S.types[q.type], now=Date.now();
  const prevCorrect=T.hist.some(h=>h.c===q.concept&&h.r==='f');
  const seenSurf=T.hist.some(h=>h.c===q.concept&&h.s===q.surface);
  const e={d:now,l:q.level,r:res.r,c:q.concept,s:q.surface,m:mode,ms:res.ms,g:res.ms<1600&&res.r==='f',dims:q.dims,ek:res.firstWrongKind||null,tries:res.tries};
  e.tr=res.r==='f'&&!e.g&&prevCorrect&&!seenSurf;                       // transfer: known idea, brand-new look
  if(T.last&&now-T.last>=20*3600e3&&res.r==='f'&&!e.g&&q.level>=T.level-1){e.ret=true;const dd=dayOf(now);if(!T.retDays.includes(dd))T.retDays.push(dd)}
  T.hist.push(e); if(T.hist.length>600){const cut=T.hist.length-600;T.hist=T.hist.slice(cut);T.since=Math.max(0,T.since-cut)}
  T.last=now;
  // spaced repetition per concept
  const b=T.boxes[q.concept]||{box:0,due:0};
  if(res.r==='f'&&!e.g){b.box=Math.min(4,b.box+1);b.due=now+SR_INT[b.box]}else if(res.r!=='f'){b.box=0;b.due=now+10*60e3;
    if(!T.queue.some(x=>x.c===q.concept)) T.queue.push({c:q.concept,n:R.ri(2,3)})}  // come back to it soon, in a new picture
  T.boxes[q.concept]=b;
  S.recent.push(q.sig);if(S.recent.length>400)S.recent=S.recent.slice(-400);
  if(q.tpl){S.recentTpl.push(q.tpl);if(S.recentTpl.length>14)S.recentTpl=S.recentTpl.slice(-14)}
  if(mode==='p'||mode==='t'||mode==='r') adapt(q.type,q.level);
  save(); return e;
}
function adapt(t,qLevel){
  const T=S.types[t]; if(qLevel!==T.level) return;
  const at=T.hist.slice(T.since).filter(h=>h.l===T.level&&h.m!=='c'&&h.m!=='d');
  const ft=h=>h.r==='f'&&!h.g;
  const last=n=>at.slice(-n);
  const up=()=>{T.level++;T.since=T.hist.length;T.ups.push({d:Date.now(),l:T.level})};
  if(T.dropFrom&&T.level<T.dropFrom&&last(2).length===2&&last(2).every(ft)){T.level=T.dropFrom-1;up();T.dropFrom=0;return}
  if(T.level<5&&at.length>=4&&last(3).every(ft)&&at.filter(ft).length/at.length>=0.7&&new Set(last(3).map(h=>h.s)).size>=2){up();T.dropFrom=0;return}
  const l3=last(3);
  if(T.level>1&&l3.length===3&&l3.filter(h=>h.r!=='f').length>=2&&l3[2].r!=='f'){T.dropFrom=T.level;T.level--;T.since=T.hist.length;T.ups.push({d:Date.now(),l:T.level,down:1})}
}

// ---------- mastery (accuracy, difficulty, independence, retention, transfer)
function wilsonLB(k,n){if(!n)return 0;const z=1.96,p=k/n;return (p+z*z/(2*n)-z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n)))/(1+z*z/n)}
function typeStats(t){
  const T=S.types[t],ALL=T.hist,H=ALL.filter(h=>h.m!=='e'),n=H.length,c=x=>H.filter(x).length;
  const ft=h=>h.r==='f'&&!h.g;
  const last=H.slice(-25),k=last.filter(ft).length,lb=wilsonLB(k,last.length);
  let Lr=0;const rec=H.slice(-60);for(let L=5;L>=1;L--){if(rec.filter(h=>h.l>=L&&ft(h)).length>=3){Lr=L;break}}
  const corr=H.filter(h=>h.r!=='x'),indep=corr.length?corr.filter(h=>h.r!=='h').length/corr.length:0;
  const transfer=new Set(H.filter(h=>h.tr).map(h=>h.c+'@'+h.s)).size;
  const ret=T.retDays.length;
  const high=H.filter(h=>h.l>=4),highConcepts=new Set(high.filter(ft).map(h=>h.c)).size;
  const score=n?Math.round(100*(0.3*lb+0.3*Lr/5+0.1*indep+0.15*Math.min(1,ret/3)+0.15*Math.min(1,transfer/4))):0;
  const checks={accuracy:last.length>=20&&lb>=0.65,difficulty:Lr===5&&high.length>=10,variety:highConcepts>=3,transfer:transfer>=3,retention:ret>=2};
  let status='Not enough data yet';
  if(n>=8){status='Needs practice';if(Lr>=2&&lb>=0.4)status='Developing';if(Lr>=4&&lb>=0.6)status='Strong';if(Object.values(checks).every(Boolean))status='Mastered'}
  return {n,easy:ALL.length-n,ft:n?c(ft)/n:0,retry:n?c(h=>h.r==='r')/n:0,hint:n?c(h=>h.r==='h')/n:0,shown:n?c(h=>h.r==='x')/n:0,quick:c(h=>h.g),
    level:T.level,Lr,lb,indep,transfer,ret,score,status,checks,mastered:status==='Mastered'};
}
// ---------- reasoning-skills profile (what kind of thinking is hard), from every recorded question
function skillProfile(){
  const out={};for(const d in DIMS)out[d]={n:0,ft:0,err:0,plaus:0,unrel:0};
  const all=[];for(const t of TYPE_IDS)for(const h of S.types[t].hist)all.push({...h,t});
  for(const h of all){for(const d of h.dims||[]){const o=out[d];o.n++;if(h.r==='f'&&!h.g)o.ft++;else{o.err++;if(h.ek){if(PLAUSIBLE.has(h.ek))o.plaus++;else o.unrel++}}}}
  // working memory: compare multi-attribute questions with single-rule questions of the same kinds
  const wmTypes=new Set(all.filter(h=>(h.dims||[]).includes('WM')).map(h=>h.t));
  const single=all.filter(h=>wmTypes.has(h.t)&&!(h.dims||[]).includes('WM'));
  out.WM.compare=single.length?single.filter(h=>h.r==='f'&&!h.g).length/single.length:null;out.WM.compareN=single.length;
  const errs=all.filter(h=>h.r!=='f'&&h.ek);
  out._err={n:errs.length,plaus:errs.filter(h=>PLAUSIBLE.has(h.ek)).length,unrel:errs.filter(h=>!PLAUSIBLE.has(h.ek)).length,quick:all.filter(h=>h.g).length,total:all.length};
  return out;
}
function skillNote(d,o){
  if(o.n<5) return 'Too few questions yet to say.';
  const acc=o.ft/o.n, pl=o.err?o.plaus/o.err:0;
  if(d==='WM'&&o.compare!=null&&o.compareN>=5){const drop=o.compare-acc;if(drop>0.2)return `Clearly harder than single-rule questions (${pct(acc)} vs ${pct(o.compare)}). He likely tracks one change but loses the second. Practice: name each change out loud.`;if(drop<0.1)return 'About as easy as single-rule questions. Keeping several things in mind is not the bottleneck.'}
  if(acc>=0.8) return 'A strength right now.';
  if(o.err>=3&&pl>=0.65) return 'Errors are mostly almost-right answers: he seems to see the idea but misses a detail. Encourage checking every choice before tapping.';
  if(o.err>=3&&pl<=0.35) return 'Errors are mostly unrelated answers: the relationship itself is not clicking yet. Short, easier examples and talking through "how do these go together?" help most.';
  return acc>=0.6?'Developing; keep practising.':'A focus area: the practice plan gives this more time.';
}
const pct=x=>Math.round(100*x)+'%';

// ---------- what to practise next (weak areas get most of the time; strong areas only come back for spaced review)
function accAtLevel(t){const T=S.types[t];const h=T.hist.filter(x=>x.m!=='e'&&x.l===T.level).slice(-8);return h.length>=3?h.filter(x=>x.r==='f'&&!x.g).length/h.length:0.5}
function needWeight(t){
  const st=typeStats(t),T=S.types[t];
  if(st.mastered) return {w:dueConcepts(t).length?0.25:0.05,why:'review only'};
  let w=0.15+0.8*(5-T.level)/4+0.6*(1-accAtLevel(t)); let why=[];
  if(T.level<=2) why.push('still at an early level');
  if(accAtLevel(t)<0.6) why.push('missing often at its current level');
  if(!T.hist.length){w+=0.4;why.push('not tried yet')}
  const prof=skillProfile();
  for(const d in DIMS){const o=prof[d];if(o.n>=5&&o.ft/o.n<0.6&&typeHasDim(t,d)){w+=0.25;why.push('builds a weak skill: '+DIMS[d].toLowerCase())}}
  if(dueConcepts(t).length){w+=0.2;why.push('ideas due for review')}
  return {w,why:why.join('; ')||'below mastery'};
}
function typeHasDim(t,d){return ({REL:['va','vc','vs','qa','qs','nm','nc'],WM:['vc','vs','qp','qs','nm','nf','nc','qa'],SPA:['nf','nm','nc'],NUM:['qa','qp','qs'],DIS:TYPE_IDS})[d].includes(t)}
function dueConcepts(t){const T=S.types[t],now=Date.now();return Object.entries(T.boxes).filter(([c,b])=>b.box>0&&b.due<=now).map(([c])=>c)}
function pickConcept(t){
  const T=S.types[t];
  for(const it of T.queue){it.n--}
  const ready=T.queue.find(x=>x.n<=0);if(ready){T.queue=T.queue.filter(x=>x!==ready);return {c:ready.c,why:'again'}}
  const due=dueConcepts(t);if(due.length&&R.chance(.5))return {c:R.pick(due),why:'review'};
  return {c:null};
}
function strongTypes(){return TYPE_IDS.filter(t=>S.types[t].hist.length).sort((a,b)=>recentAcc(b)-recentAcc(a))}
function recentAcc(t){const h=S.types[t].hist.slice(-8);return h.length?h.filter(x=>x.r==='f').length/h.length:0}
// Decide the next question of a round
function nextItem(ses){
  const i=ses.items.length,len=ses.len,res=ses.items.map(x=>x.res&&x.res.r);
  const missed2=i>=2&&res[i-1]&&res[i-2]&&res[i-1]!=='f'&&res[i-2]!=='f';
  const easy=(t,tag)=>({t,level:Math.max(1,S.types[t].level-1),tag,easy:true});
  if(ses.mode==='t'){
    const T=S.types[ses.type];
    if((i===0||i===len-1||missed2)&&T.level>1&&T.hist.length) return easy(ses.type,i===0?'warm-up':missed2?'confidence':'finish on a win');
    const pc=pickConcept(ses.type);return {t:ses.type,level:T.level,concept:pc.c,tag:pc.why||'practice'};
  }
  if(ses.mode==='c'){const t=ses.order[i];return {t,level:Math.min(5,S.types[t].level+(typeStats(t).Lr>=S.types[t].level?1:0)),tag:'challenge'}}
  // mixed adaptive "Play"
  const counts={};ses.items.forEach(x=>counts[x.t]=(counts[x.t]||0)+1);
  // warm-up, confidence and last questions are easier versions of FOCUS areas: success without spending time on strengths
  const focus=TYPE_IDS.filter(t=>!(counts[t]>=2)&&!typeStats(t).mastered).map(t=>({t,w:needWeight(t).w})).sort((a,b)=>b.w-a.w).slice(0,3).map(x=>x.t);
  const pool=focus.length?focus:strongTypes();
  if((i===0||i===len-1||missed2)&&pool.length) return easy(R.pick(pool),i===0?'warm-up':missed2?'confidence':'finish on a win');
  const ws=TYPE_IDS.filter(t=>(counts[t]||0)<2).map(t=>({t,...needWeight(t)}));
  let tot=ws.reduce((a,b)=>a+b.w,0),r=Math.random()*tot,ch=ws[0];for(const x of ws){r-=x.w;if(r<=0){ch=x;break}}
  const st=typeStats(ch.t),pc=pickConcept(ch.t);
  return {t:ch.t,level:S.types[ch.t].level,concept:pc.c,tag:st.mastered?'spaced review':(pc.why==='review'?'spaced review':'focus: '+ch.why),review:st.mastered||pc.why==='review'};
}
function roundsToday(){return S.rounds.filter(r=>r.day===today()).length}
// ---------- diagnostic: per battery, each type gets a single-rule item, then a harder multi-attribute item (or an easier one)
const BATT={V:['va','vc','vs'],Q:['qa','qp','qs'],N:['nm','nf','nc']};
function diagNext(ses){
  const done=ses.items.length,ts=BATT[ses.batt];if(done>=6) return null;
  const t=ts[Math.floor(done/2)];
  if(done%2===0) return {t,level:2,tag:'diagnostic: one rule'};
  const prev=ses.items[done-1];return {t,level:prev.res.r==='f'?3:1,tag:prev.res.r==='f'?'diagnostic: several attributes':'diagnostic: easier check'};
}
function diagPlace(ses){
  const ts=BATT[ses.batt],out={};
  ts.forEach((t,k)=>{const a=ses.items[2*k],b=ses.items[2*k+1];const fa=a.res.r==='f',fb=b.res.r==='f';
    const lvl=fa&&fb?3:fa?2:fb?1:1;const T=S.types[t];if(!T.placed||T.level<lvl){T.level=lvl;T.since=T.hist.length}T.placed=true;
    out[t]={a:a.res.r,b:b.res.r,bLevel:b.level,ek:[a.res.firstWrongKind,b.res.firstWrongKind],dimsB:b.dims,level:lvl}});
  S.diag[ses.batt]={d:Date.now(),types:out};save();
}
