// ===== Question generation engine =====
// Every generator returns {type, level, concept, surface, dims, say, stem, choices:[{html,key,kind}], answer, sig, hintSay, layout}
// or null when its own validation fails (the caller then tries again).
const R={ri:(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick:a=>a[Math.floor(Math.random()*a.length)],
 shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
 sample(a,n){return R.shuffle(a).slice(0,n)},chance:p=>Math.random()<p};
const QBOX=`<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="6" y="6" width="88" height="88" rx="14" fill="#fff8e6" stroke="#f2a01e" stroke-width="4" stroke-dasharray="10 7"/><text x="50" y="68" text-anchor="middle" font-size="54" font-weight="700" fill="#f2a01e" font-family="Fredoka,Arial,sans-serif">?</text></svg>`;
const NCH=l=>l<=2?3:4; // 3 picture choices at early levels, 4 later (more plausible distractors)

function finalize(q,correct,dists){
  const all=[{...correct,kind:'correct'},...dists];
  const keys=new Set(all.map(c=>c.key));
  if(keys.size!==all.length) return null;           // two choices look the same -> reject
  const sh=R.shuffle(all);
  q.choices=sh; q.answer=sh.findIndex(c=>c.kind==='correct');
  q.sig=q.type+'|'+q.stemKey+'|'+[...keys].sort().join(',');
  return q;
}

// ---------------------------------------------------------------- 1. PICTURE ANALOGIES
const RELS={
 eats:{lvl:1,name:'what an animal eats',pairs:[['dog','bone'],['rabbit','carrot'],['mouse','cheese'],['monkey','banana'],['bird','worm'],['cow','grass']]},
 home:{lvl:1,name:'where an animal lives',pairs:[['bird','nest'],['bee','hive'],['dog','doghouse'],['fish','fishbowl'],['cow','barn'],['frog','pond'],['duck','pond'],['sheep','barn']]},
 weather:{lvl:2,name:'what you need for the weather',pairs:[['sun','sunglasses'],['rain','umbrella'],['snow','mitten'],['snow','hat']]},
 tool:{lvl:2,name:'a tool and what it works on',pairs:[['hammer','nail'],['key','lock'],['pencil','paper'],['toothbrush','tooth'],['saw','log']]},
 part:{lvl:3,name:'a whole and its part',pairs:[['car','wheel'],['bike','wheel'],['bus','wheel'],['tree','leaf'],['house','door']]},
 cut:{lvl:3,name:'whole and cut into pieces',pairs:[['apple','appleslice'],['orange','orangeslice'],['bread','breadslice']]},
 becomes:{lvl:4,name:'what something grows into',pairs:[['egg','chick'],['tadpole','frog'],['caterpillar','butterfly'],['acorn','tree'],['chick','hen']]},
 gives:{lvl:4,name:'what an animal gives us',pairs:[['hen','egg'],['cow','milk'],['bee','honey'],['sheep','yarn']]},
};
function relHolds(rel,rev,a,b){return RELS[rel].pairs.some(p=>rev?(p[1]===a&&p[0]===b):(p[0]===a&&p[1]===b))}
function relsOf(a,b){const out=[];for(const r in RELS){if(relHolds(r,0,a,b))out.push([r,0]);if(relHolds(r,1,a,b))out.push([r,1])}return out}
function genAnalogy(level,opt){
  const allowed=Object.keys(RELS).filter(r=>RELS[r].lvl<=level);
  let rel=opt.concept&&allowed.includes(opt.concept)?opt.concept:R.pick(level>=3?allowed.filter(r=>RELS[r].lvl>=level-2):allowed);
  if(!rel) rel=R.pick(allowed);
  const rev=level>=3&&R.chance(level>=4?0.4:0.25)?1:0;
  const pairs=R.sample(RELS[rel].pairs,2); if(pairs.length<2) return null;
  let [A,B]=pairs[0],[C,D]=pairs[1]; if(rev){[A,B]=[B,A];[C,D]=[D,C]}
  if(new Set([A,B,C,D]).size<4) return null;
  const rAB=relsOf(A,B);
  const valid=x=>rAB.some(([r,rv])=>relHolds(r,rv,C,x));
  // plausible distractors: same kind as the answer, or things linked to C/A in other ways
  const sameKind=RELS[rel].pairs.map(p=>rev?p[0]:p[1]);
  const assocC=[];for(const r in RELS)for(const p of RELS[r].pairs){if(p[0]===C)assocC.push(p[1]);if(p[1]===C)assocC.push(p[0])}
  const used=new Set([A,B,C,D]);
  const ok=x=>!used.has(x)&&!valid(x);
  const nearPool=R.shuffle([...new Set([...assocC,...sameKind])].filter(ok));
  const farPool=R.shuffle(ICON_IDS.filter(x=>ok(x)&&!nearPool.includes(x)&&!assocC.includes(x)));
  const n=NCH(level)-1; const nNear=level===1?0:level===2?1:level===3?2:n;
  const d=[];
  for(const x of nearPool){if(d.length>=nNear)break;d.push({id:x,kind:'near'})}
  for(const x of farPool){if(d.length>=n)break;d.push({id:x,kind:'far'})}
  if(d.length<n) return null;
  const q={type:'va',level,concept:rel,surface:(rev?'rev:':'fwd:')+C,dims:['REL'].concat(nNear>=2?['DIS']:[]),
    say:'Look at the first two pictures. They go together. Which picture goes with this one in the same way?',
    hintSay:'Think about how the first two pictures go together. Then find the one that goes with this picture the same way.',
    stemKey:[A,B,C].join('-'),layout:'pics'};
  q.stem=`<div class="anaRow"><div class="pair hintable"><div class="pic">${iconSVG(A)}</div><div class="arrow">➜</div><div class="pic">${iconSVG(B)}</div></div><div class="sep"></div><div class="pair"><div class="pic">${iconSVG(C)}</div><div class="arrow">➜</div><div class="pic q">${QBOX}</div></div></div>`;
  return finalize(q,{html:iconSVG(D),key:D},d.map(x=>({html:iconSVG(x.id),key:x.id,kind:x.kind})));
}

// ---------------------------------------------------------------- 2. PICTURE CLASSIFICATION
const CLS=[
 {T:['animal'],l:1},{T:['food'],l:1},{T:['vehicle'],l:1},{T:['wear'],l:1},
 {T:['fruit'],l:2},{T:['animalhome'],l:2},{T:['weather'],l:2},{T:['kitchen'],l:2},{T:['animal','flies'],l:2},{T:['animal','water'],l:2},{T:['plant'],l:2},
 {T:['insect'],l:3},{T:['legs4'],l:3},{T:['wheels'],l:3},{T:['cuts'],l:3},{T:['writes'],l:3},{T:['baby'],l:3},{T:['farm'],l:3},{T:['cut'],l:3},{T:['fromanimal'],l:3},
 {T:['flies'],l:4,cross:1},{T:['round'],l:4,cross:1},{T:['hot'],l:4,cross:1},{T:['sharp'],l:4,cross:1},{T:['water'],l:4,cross:1},{T:['wings'],l:4,cross:1},{T:['light'],l:4,cross:1},
 {T:['animal','water','flies'],l:5,conj:1},{T:['vehicle','nomotor'],l:5,conj:1},{T:['food','fromanimal'],l:5,conj:1},{T:['fruit','cut'],l:5,conj:1},{T:['animal','baby'],l:5,conj:1},{T:['wear','warm'],l:5,conj:1},{T:['vehicle','motor','wheels'],l:5,conj:1},{T:['animal','legs4','farm'],l:5,conj:1},{T:['flies','motor'],l:5,conj:1},
];
const CAT_ORDER=['animal','vehicle','food','wear','plant','weather','toy','tool','animalhome'];
const catOf=id=>CAT_ORDER.find(c=>has(id,c))||'other';
const clsName=T=>T.join(' + ');
function defTags(id){return ICONS[id].t}
function genVClass(level,opt){
  let pool=CLS.filter(c=>c.l===level); if(level>=4) pool=pool.concat(CLS.filter(c=>c.l===level-1&&R.chance(.3)));
  let rule=opt.concept?CLS.find(c=>clsName(c.T)===opt.concept&&c.l<=level):null; if(!rule) rule=R.pick(pool);
  const T=rule.T, okT=id=>T.every(t=>has(id,t));
  const members=ICON_IDS.filter(okT);
  const failsT=id=>T.some(t=>!has(id,t)&&!amb(id,t)) && !T.some(t=>amb(id,t));
  if(members.length<3) return null;
  const odd=members.length===3||(level<=3&&R.chance(.35));
  const stems=R.sample(members,odd?3:3);
  if(rule.cross&&new Set(stems.map(catOf)).size<2) return null;
  const S=stems.map(defTags).reduce((a,b)=>a.filter(t=>b.includes(t)));
  const near=id=>{const c=new Set(stems.map(catOf));return c.has(catOf(id))};
  const simScore=id=>S.filter(t=>has(id,t)).length+(near(id)?2:0);
  let nonm=ICON_IDS.filter(id=>!stems.includes(id)&&failsT(id)&&!S.some(t=>amb(id,t)));
  if(rule.conj) nonm=nonm.filter(id=>T.filter(t=>has(id,t)).length===T.length-1).concat(nonm.filter(id=>T.filter(t=>has(id,t)).length<T.length-1&&near(id)));
  if(odd){
    // odd one out: 3 that share the rule + 1 that does not. Exactly one picture may be "clearly odd".
    const oddPool=level===1?nonm.filter(x=>!near(x)):nonm.filter(near);
    if(!oddPool.length) return null;
    const o=R.pick(oddPool); const four=R.shuffle([...stems,o]);
    const clearlyOdd=x=>{const others=four.filter(y=>y!==x);const I=others.map(defTags).reduce((a,b)=>a.filter(t=>b.includes(t)));return I.some(t=>!has(x,t))};
    const oddOnes=four.filter(clearlyOdd); if(oddOnes.length!==1||oddOnes[0]!==o) return null;
    const q={type:'vc',level,concept:clsName(T),surface:'odd:'+T.join('+'),dims:['REL'].concat(level>=2?['DIS']:[]),fmt:'odd',
      say:'One of these pictures does not belong with the others. Which one does not belong?',hintSay:'Three of these are alike in some way. Find the one that is different.',stemKey:'odd'+four.join('-'),layout:'pics'};
    q.stem=`<div class="clsTop hintable"><div class="hand">☝️</div></div>`;
    q.noStem=true;
    // In odd-one-out every picture is a choice; distractor kind is near (they all share the rule)
    return finalize(q,{html:iconSVG(o),key:o},four.filter(x=>x!==o).map(x=>({html:iconSVG(x),key:x,kind:'near'})));
  }
  const corrPool=members.filter(id=>!stems.includes(id)&&S.every(t=>has(id,t)));
  if(!corrPool.length) return null;
  const corr=R.pick(corrPool);
  const n=NCH(level)-1;
  nonm=R.shuffle(nonm).sort((a,b)=>level<=1?simScore(a)-simScore(b):simScore(b)-simScore(a));
  if(level===2) nonm=[nonm[0],...R.shuffle(nonm.slice(1))];
  const ds=nonm.slice(0,n); if(ds.length<n) return null;
  for(const x of ds) if(S.every(t=>has(x,t))) return null; // a distractor that fits the group -> ambiguous
  const q={type:'vc',level,concept:clsName(T),surface:'goes:'+T.join('+')+':'+[...stems].sort().join(''),dims:['REL'].concat(T.length>1&&rule.conj?['WM']:[]).concat(level>=3?['DIS']:[]),
    say:'These three pictures are alike in some way. Which picture below goes with them?',hintSay:'Look at the three pictures at the top. How are they alike? Find the one below that is alike in the same way.',stemKey:stems.slice().sort().join('-'),layout:'pics'};
  q.stem=`<div class="clsTop hintable">${stems.map(s=>`<div class="pic">${iconSVG(s)}</div>`).join('')}</div>`;
  return finalize(q,{html:iconSVG(corr),key:corr},ds.map(x=>({html:iconSVG(x),key:x,kind:simScore(x)>=2?'near':'far'})));
}

// ---------------------------------------------------------------- 3. SENTENCE COMPLETION
const NAMES=['Mia','Sam','Ben','Ana','Leo','Zoe','Max','Lily','Omar','Ivy','Noah','Ruby'];
// ok = pictures that correctly complete the sentence; near = tempting but wrong; no = clearly wrong
const SENT=[
 {l:1,c:'describe',s:'Which one can fly?',ok:['bird','bee','butterfly','plane','kite'],near:['hen','car'],no:['dog','cat','cow','fish','apple','shoe','tree','bus']},
 {l:1,c:'describe',s:'Which one do we eat?',ok:['apple','banana','bread','carrot','cheese','orange'],near:['bone','grass'],no:['shoe','car','key','hammer','ball','hat','cup']},
 {l:1,c:'describe',s:'Which one swims in the water?',ok:['fish','duck','tadpole'],near:['boat','cat'],no:['cow','car','bike','tree','mouse','sheep']},
 {l:1,c:'describe',s:'Which one has wheels?',ok:['car','bike','bus','train'],near:['boat','kite'],no:['dog','tree','shoe','kite','house','apple']},
 {l:1,c:'describe',s:'Which one do you wear on your head?',ok:['hat'],near:['shoe','mitten'],no:['ball','cup','apple','key','bus']},
 {l:1,c:'describe',s:'Which one tells you what time it is?',ok:['clock'],near:['wheel','ball'],no:['cup','drum','orange','shoe','tree']},
 {l:1,c:'describe',s:'Which animal lives on a farm and says moo?',ok:['cow'],near:['sheep','hen'],no:['fish','bird','mouse','frog','bee']},
 {l:1,c:'describe',s:'Which one makes music when you hit it?',ok:['drum'],near:['ball','hammer'],no:['shoe','apple','leaf','hat','cup']},
 {l:2,c:'function',s:'Which one do you use to eat soup?',ok:['spoon'],near:['fork','knife','cup'],no:['hammer','pencil','key','shoe']},
 {l:2,c:'function',s:'Which one do you use to open a lock?',ok:['key'],near:['hammer','door'],no:['spoon','ball','hat','cup','apple']},
 {l:2,c:'function',s:'Which one do you use to clean your teeth?',ok:['toothbrush'],near:['spoon','pencil'],no:['shoe','apple','car','hat','drum']},
 {l:2,c:'function',s:'It is raining hard. Which one will keep you dry?',ok:['umbrella'],near:['sunglasses','mitten'],no:['ball','kite','spoon','apple','drum']},
 {l:2,c:'function',s:'The sun is very bright. Which one will help your eyes?',ok:['sunglasses'],near:['mitten','shoe'],no:['cup','key','ball','drum','bread']},
 {l:2,c:'function',s:'Which one do you use to cut paper?',ok:['scissors'],near:['pencil','crayon','spoon'],no:['spoon','cup','ball','hat']},
 {l:2,c:'function',s:'Which one helps you draw a picture?',ok:['pencil','crayon'],near:['scissors','spoon'],no:['hammer','shoe','apple','car']},
 {l:2,c:'function',s:'Which one do you drink from?',ok:['cup'],near:['fork','key'],no:['hat','ball','key','shoe','tree']},
 {l:2,c:'location',s:'Where does a bee live?',ok:['hive'],near:['nest','doghouse','barn'],no:['car','cup','shoe']},
 {l:2,c:'location',s:'Where would a fish live?',ok:['fishbowl','pond'],near:['nest','hive','doghouse'],no:['car','shoe','tree']},
 {l:2,c:'location',s:'Where does a bird lay its eggs?',ok:['nest'],near:['hive','fishbowl','doghouse'],no:['shoe','car','cup']},
 {l:3,c:'context',s:'{n} mixed flour and water and baked it in the oven. What did {n} make?',ok:['bread'],near:['egg','cheese','milk','apple'],no:['shoe','car','ball']},
 {l:3,c:'context',s:'{n}\'s bike will not roll. Which part needs to be fixed?',ok:['wheel'],near:['door','key'],no:['leaf','shoe','apple','cup']},
 {l:3,c:'source',s:'Which one comes from a cow?',ok:['milk','cheese'],near:['egg','honey','yarn'],no:['apple','shoe','car']},
 {l:3,c:'source',s:'Which one comes from a hen?',ok:['egg'],near:['milk','honey','yarn','cheese'],no:['ball','car']},
 {l:3,c:'source',s:'Which one is made by bees?',ok:['honey'],near:['milk','egg','yarn'],no:['ball','car','shoe']},
 {l:3,c:'growth',s:'Which one will grow up to be a frog?',ok:['tadpole'],near:['fish','caterpillar','chick'],no:['car','shoe','cup']},
 {l:3,c:'growth',s:'Which one will turn into a butterfly?',ok:['caterpillar'],near:['worm','bee','tadpole','chick'],no:['car','cup']},
 {l:3,c:'growth',s:'Which one can grow into a big tree?',ok:['acorn'],near:['leaf','flower','grass','log'],no:['car','cup','shoe']},
 {l:3,c:'context',s:'{n} is going out to play in the snow. What should {n} wear?',ok:['mitten','hat'],near:['umbrella','sunglasses','kite'],no:['spoon','cup','cheese']},
 {l:3,c:'context',s:'Which one would feel hot if you got close to it?',ok:['sun','fire','candle'],near:['snow','milk','mitten'],no:['shoe','key','leaf']},
 {l:3,c:'describe',s:'Which one is smaller than a mouse?',ok:['bee','caterpillar','worm'],near:['cat','dog','rabbit'],no:['cow','bus','house','tree']},
 {l:4,c:'multi',s:'Which one has wings but is not an animal?',ok:['plane'],near:['bird','bee','butterfly','duck','car','train'],no:['shoe','cup']},
 {l:4,c:'multi',s:'Which animal can fly and can also swim?',ok:['duck'],near:['fish','bird','bee','frog','plane','boat'],no:['cup']},
 {l:4,c:'multi',s:'Which one has wheels but no motor?',ok:['bike'],near:['car','bus','train','boat'],no:['shoe','apple']},
 {l:4,c:'multi',s:'Which animal can swim and can also hop on land?',ok:['frog'],near:['fish','tadpole','bird','mouse','cow'],no:['car']},
 {l:4,c:'negation',s:'Which one is a fruit, but is not round?',ok:['banana'],near:['orange','ball','carrot'],no:['shoe','car']},
 {l:4,c:'negation',s:'Which one is round, but is not a toy and is not food?',ok:['wheel','clock','sun'],near:['ball','orange'],no:['shoe','key','banana']},
 {l:4,c:'negation',s:'Which one do you wear, but not on your hands or your head?',ok:['shoe'],near:['mitten','hat'],no:['spoon','car','apple','ball']},
 {l:4,c:'negation',s:'Which bug cannot fly?',ok:['caterpillar'],near:['bee','butterfly','bird','plane'],no:['cup','shoe']},
 {l:4,c:'multi',s:'Which one is sharp and is used in the kitchen?',ok:['knife'],near:['spoon','saw','nail','cup'],no:['ball','hat']},
 {l:4,c:'negation',s:'Which one is not alive?',ok:['car','ball','cup','key','shoe'],near:['tree','flower','bird','fish','dog','frog'],no:[]},
 {l:5,c:'multi',s:'Which one comes from an animal, but we do not eat it?',ok:['yarn'],near:['milk','egg','honey','cheese'],no:['apple','ball']},
 {l:5,c:'multi',s:'Which one is a baby that will grow up to have feathers?',ok:['chick'],near:['tadpole','caterpillar','hen','bird'],no:['ball','cup']},
 {l:5,c:'multi',s:'Which one can go up in the sky, but has no motor and is not alive?',ok:['kite'],near:['plane','bird','bus','boat'],no:['cup','shoe']},
 {l:5,c:'inference',s:'It was so hot outside that {n}\'s ice cream melted. What was up in the sky?',ok:['sun'],near:['rain','snow','umbrella'],no:['shoe','cup']},
 {l:5,c:'inference',s:'{n} cut the bread for sandwiches. Which one shows the bread now?',ok:['breadslice'],near:['bread','appleslice','orangeslice','cheese'],no:['shoe','car']},
 {l:5,c:'inference',s:'{n} needed to cut a big branch off a tree. Which one should {n} use?',ok:['saw'],near:['hammer','pencil','key','spoon'],no:['ball','hat']},
 {l:5,c:'inference',s:'{n}\'s dog was hungry. Which one should {n} give the dog?',ok:['bone'],near:['grass','worm','ball','doghouse'],no:['shoe','car']},
 {l:5,c:'inference',s:'First it was a tiny tadpole. Then it grew legs. What will it be when it grows up?',ok:['frog'],near:['fish','tadpole','mouse','duck'],no:['car','cup']},
 {l:5,c:'negation',s:'Which one is not made by an animal?',ok:['apple','bread'],near:['honey','egg','milk','yarn','nest','hive'],no:[]},
 {l:5,c:'inference',s:'A seed was planted. It got sun and rain. What could grow from it?',ok:['flower','tree','grass'],near:['log','bread','egg'],no:['ball','key','car','cup']},
];
SENT.forEach((s,i)=>s.id='s'+i);
function genSentence(level,opt){
  let pool=SENT.filter(s=>s.l===level||(s.l===level-1&&R.chance(.25)));
  if(opt.concept){const p=SENT.filter(s=>s.c===opt.concept&&s.l<=level);if(p.length)pool=p}
  if(opt.avoidTpl){const p=pool.filter(s=>!opt.avoidTpl.has(s.id));if(p.length)pool=p}
  const t=R.pick(pool); const name=R.pick(NAMES);
  const corr=R.pick(t.ok); const n=NCH(level)-1; const nNear=level<=2?1:level===3?2:n;
  const nearP=R.shuffle(t.near.filter(x=>!t.ok.includes(x))), noP=R.shuffle(t.no.filter(x=>!t.ok.includes(x)));
  const d=[];
  for(const x of nearP){if(d.length>=nNear)break;d.push({id:x,kind:'near'})}
  for(const x of noP){if(d.length>=n)break;d.push({id:x,kind:'far'})}
  for(const x of nearP){if(d.length>=n)break;if(!d.some(y=>y.id===x))d.push({id:x,kind:'near'})}
  if(d.length<n) return null;
  const say=t.s.replace(/\{n\}/g,name);
  const q={type:'vs',level,concept:t.c,surface:t.id,tpl:t.id,dims:['REL'].concat(['multi','negation','inference'].includes(t.c)?['WM']:[]).concat(level>=3?['DIS']:[]),
    say,hintSay:'Listen again carefully. '+say,stemKey:t.id+name,layout:'pics',sentence:true};
  q.stem=`<div class="sentStem hintable"><div class="bigEar">👂</div></div>`;
  return finalize(q,{html:iconSVG(corr),key:corr},d.map(x=>({html:iconSVG(x.id),key:x.id,kind:x.kind})));
}

// ---------------------------------------------------------------- shared counters (quantitative)
const QCOL=['#e4473f','#3d82c4','#3aa35b','#f28c38','#8e5bd6','#e86aa6'];
function counterSVG(shape,x,y,r,c,crossed){
  let s;
  if(shape==='dot') s=`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#2d2a40" stroke-width="1.6"/>`;
  else if(shape==='square') s=`<rect x="${x-r*.9}" y="${y-r*.9}" width="${r*1.8}" height="${r*1.8}" rx="2" fill="${c}" stroke="#2d2a40" stroke-width="1.6"/>`;
  else if(shape==='tri') s=`<path d="M${x} ${y-r} L${x+r} ${y+r*.8} L${x-r} ${y+r*.8}Z" fill="${c}" stroke="#2d2a40" stroke-width="1.6" stroke-linejoin="round"/>`;
  else {let p='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r*1.1;p+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1)}s=`<path d="${p}Z" fill="${c}" stroke="#2d2a40" stroke-width="1.4" stroke-linejoin="round"/>`}
  if(crossed) s=`<g opacity=".45">${s}</g><path d="M${x-r} ${y-r} L${x+r} ${y+r} M${x+r} ${y-r} L${x-r} ${y+r}" stroke="#2d2a40" stroke-width="2.4" stroke-linecap="round"/>`;
  return s;
}
// A group of n counters. layout rows = rows of five (easy to see), scatter = loose (must count/estimate carefully)
function groupSVG(n,st,crossed){
  crossed=crossed||0;let pos=[];
  if(st.layout==='scatter'){
    if(!st.cells) st.cells={};
    const key=n+'/'+crossed; if(!st.cells[key]) st.cells[key]=R.sample([...Array(20).keys()],n).map(i=>[i%5,Math.floor(i/5),R.ri(-1,1)*1.5,R.ri(-1,1)*1.5]);
    pos=st.cells[key].map(([cx,cy,jx,jy])=>[16+cx*22+jx,14+cy*22+jy]);
  } else {
    const rows=Math.ceil(n/5)||1, top=50-(rows-1)*11;
    for(let i=0;i<n;i++) pos.push([16+(i%5)*22,top+Math.floor(i/5)*22]);
  }
  return `<svg viewBox="0 0 120 100" width="100%" height="100%">${pos.map((p,i)=>counterSVG(st.shape,p[0],p[1],9,st.color,i>=n-crossed)).join('')}</svg>`;
}
function qStyle(level){return {shape:R.pick(['dot','star','square','tri']),color:R.pick(QCOL),layout:level>=3&&R.chance(.45)?'scatter':'rows'}}
const styleName=st=>st.shape+'/'+st.layout;

// ---------------------------------------------------------------- 4. NUMBER ANALOGIES
const NRULES={
 add1:x=>x+1,add2:x=>x+2,add3:x=>x+3,add4:x=>x+4,add5:x=>x+5,sub1:x=>x-1,sub2:x=>x-2,sub3:x=>x-3,sub4:x=>x-4,same:x=>x,
 dbl:x=>2*x,half:x=>x%2?NaN:x/2,dblp1:x=>2*x+1,dblm1:x=>2*x-1,halfp1:x=>x%2?NaN:x/2+1,triple:x=>3*x,
};
const NA_LV={1:{r:['add1','sub1','add2'],max:7},2:{r:['add2','sub2','add3','same','sub1'],max:9},3:{r:['dbl','add3','sub3','add4'],max:12},4:{r:['half','dbl','sub4','add5','sub3'],max:14},5:{r:['dblp1','dblm1','halfp1','triple','half'],max:16}};
const NA_NAME={add1:'add one',add2:'add two',add3:'add three',add4:'add four',add5:'add five',sub1:'take away one',sub2:'take away two',sub3:'take away three',sub4:'take away four',same:'stays the same',dbl:'double',half:'half',dblp1:'double and one more',dblm1:'double and one less',halfp1:'half and one more',triple:'three times as many'};
// every rule a child might plausibly see: used to prove the answer is the only one that fits both examples
const UNIVERSE=(()=>{const u=[];for(let k=-10;k<=10;k++)u.push(x=>x+k);u.push(x=>2*x,x=>x%2?NaN:x/2,x=>3*x,x=>2*x+1,x=>2*x-1,x=>x%2?NaN:x/2+1,x=>x%2?NaN:x/2-1,x=>x%3?NaN:x/3);return u})();
function genNumAnalogy(level,opt){
  const L=NA_LV[level]; let rid=opt.concept&&L.r.includes(opt.concept)?opt.concept:R.pick(L.r); const f=NRULES[rid];
  const xs=R.sample([...Array(L.max).keys()].map(i=>i+1).filter(x=>{const y=f(x);return Number.isInteger(y)&&y>=1&&y<=L.max+4}),3);
  if(xs.length<3) return null;
  const [x1,x2,x3]=xs, y1=f(x1),y2=f(x2),ans=f(x3);
  const preds=new Set(UNIVERSE.filter(g=>g(x1)===y1&&g(x2)===y2).map(g=>g(x3)));
  if(preds.size!==1||!preds.has(ans)) return null;
  const n=NCH(level)-1; const cand=[];
  const add=(v,k)=>{if(Number.isInteger(v)&&v>=1&&v<=20&&v!==ans&&!cand.some(c=>c.v===v))cand.push({v,kind:k})};
  add(x3+(y1-x1),'rule');add(x3,'copy');add(ans+1,'near');add(ans-1,'near');add(y2,'copy');add(ans+2,'near');add(ans-2,'near');add(ans+3,'far');
  const d=(level<=2?R.shuffle(cand.slice(0,5)):cand.slice(0,2).concat(R.shuffle(cand.slice(2)))).slice(0,n);
  if(d.length<n) return null;
  const st=qStyle(level);if(Math.max(x1,x2,x3,y1,y2,ans)>10)st.layout='rows';
  const box=(v,cls)=>`<div class="grp ${cls||''}">${groupSVG(v,st)}</div>`;
  const q={type:'qa',level,concept:rid,surface:styleName(st),dims:['NUM','REL'].concat(level>=5?['WM']:[]).concat(level>=3?['DIS']:[]),
    say:'Look how the first group changes into the next group. Which group goes with the last one, changing the same way?',
    hintSay:'Count how the first group changed. Did it get more, or fewer? Make the last one change the same way.',stemKey:[x1,x2,x3,rid].join('-'),layout:'groups',qstyle:st};
  q.stem=`<div class="naGrid"><div class="naRow hintable">${box(x1)}<div class="arrow">➜</div>${box(y1)}</div><div class="naRow hintable">${box(x2)}<div class="arrow">➜</div>${box(y2)}</div><div class="naRow">${box(x3)}<div class="arrow">➜</div><div class="grp q">${QBOX}</div></div></div>`;
  return finalize(q,{html:groupSVG(ans,st),key:'n'+ans},d.map(c=>({html:groupSVG(c.v,st),key:'n'+c.v,kind:c.kind})));
}

// ---------------------------------------------------------------- 5. NUMBER PUZZLES
const SYM=`<svg viewBox="0 0 120 100" width="100%" height="100%"><path d="M60 14 L100 84 L20 84Z" fill="#8e5bd6" stroke="#2d2a40" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="60" r="8" fill="#fff"/></svg>`;
const PZ_FORMS={1:['ab'],2:['sum','ab'],3:['two'],4:['three','take'],5:['sym1','sym2']};
const PZ_NAME={ab:'missing part',sum:'put together',two:'balance two sides',three:'three groups',take:'take away',sym1:'symbol puzzle',sym2:'symbol puzzle (doubles)'};
function genPuzzle(level,opt){
  const forms=PZ_FORMS[level]; const form=opt.concept&&forms.includes(opt.concept)?opt.concept:R.pick(forms);
  const st=qStyle(level); st.layout=level>=4&&R.chance(.3)?'scatter':'rows'; if(st.shape==='tri')st.shape=R.pick(['dot','star','square']);
  const surf=R.pick(['scale','baskets']);
  let L=[],Rr=[],ans,lines=null,extraD=[];
  const G=v=>({v}),Q={q:1};
  if(form==='ab'){const b=R.ri(level===1?3:5,level===1?6:10),a=R.ri(1,b-1);L=[G(a),Q];Rr=[G(b)];ans=b-a;extraD=[b,a]}
  else if(form==='sum'){const a=R.ri(1,6),b=R.ri(1,Math.min(6,10-a));L=[G(a),G(b)];Rr=[Q];ans=a+b;extraD=[a,b]}
  else if(form==='two'){const b=R.ri(1,6),c=R.ri(1,6),a=R.ri(1,b+c-1);L=[G(a),Q];Rr=[G(b),G(c)];ans=b+c-a;extraD=[b+c,a+b+c-1]}
  else if(form==='three'){const c=R.ri(2,7),dd=R.ri(2,7),a=R.ri(1,4),b=R.ri(1,Math.max(1,c+dd-a-1));if(a+b>=c+dd)return null;L=[G(a),G(b),Q];Rr=[G(c),G(dd)];ans=c+dd-a-b;extraD=[c+dd,c+dd-a]}
  else if(form==='take'){const a=R.ri(5,12),k=R.ri(1,a-2);L=[{v:a,x:k}];Rr=[Q];ans=a-k;extraD=[a,k]}
  else if(form==='sym1'){const v=R.ri(2,5),m=v+R.ri(1,5);lines=[[[{s:1},{s:1}],[G(2*v)]],[[{s:1},Q],[G(m)]]];ans=m-v;extraD=[v,m,2*v-m>0?2*v-m:m+1]}
  else {const a=R.ri(1,4),b=R.ri(1,4);lines=[[[{s:1}],[G(a),G(b)]],[[{s:1},{s:1}],[Q]]];ans=2*(a+b);extraD=[a+b,a+b+1,2*(a+b)-1]}
  if(!lines) lines=[[L,Rr]];
  // deterministic check: solve each line in order; the missing amount must come out as a whole number from 1 to 20
  let symV=null,solved=null;
  for(const [l,r] of lines){
    const tot=s=>s.reduce((t,g)=>t+(g.v!=null?g.v-(g.x||0):0),0), cnt=(s,k)=>s.filter(g=>g[k]).length;
    const ls=cnt(l,'s')-cnt(r,'s'), lq=cnt(l,'q')-cnt(r,'q'); let rhs=tot(r)-tot(l);
    if(lq===0){ if(ls===0) return null; symV=rhs/ls; }
    else { if(ls) rhs-=ls*symV; solved=rhs/lq; }
  }
  if(solved!==ans||!Number.isInteger(ans)||ans<1||ans>20) return null;
  if(ans>10||lines.some(([l,r])=>l.concat(r).some(g=>g.v>10))) st.layout='rows';
  if(symV!=null&&(!Number.isInteger(symV)||symV<1)) return null;
  const n=NCH(level)-1; const cand=[];
  const add=(v,k)=>{if(Number.isInteger(v)&&v>=1&&v<=20&&v!==ans&&!cand.some(c=>c.v===v))cand.push({v,kind:k})};
  extraD.forEach(v=>add(v,'rule'));add(ans+1,'near');add(ans-1,'near');add(ans+2,'near');add(ans-2,'far');add(ans+3,'far');
  const d=(level<=2?R.shuffle(cand):[cand[0],...R.shuffle(cand.slice(1))]).slice(0,n); if(d.length<n) return null;
  const g=x=>x.q?`<div class="grp q">${QBOX}</div>`:x.s?`<div class="grp sym">${SYM}</div>`:`<div class="grp">${groupSVG(x.v,st,x.x)}</div>`;
  const side=s=>`<div class="pan ${surf}">${s.map(g).join('')}</div>`;
  const stem=lines.map(([l,r],i)=>`<div class="bal ${surf} ${i<lines.length-1?'hintable':''}">${side(l)}<div class="fulcrum">${surf==='scale'?'<svg viewBox="0 0 60 70" width="54" height="64"><rect x="2" y="2" width="56" height="8" rx="4" fill="#8a5a2b"/><path d="M30 10 L50 66 H10Z" fill="#c98b4f" stroke="#2d2a40" stroke-width="3" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 60 60" width="50" height="50"><path d="M10 22 h40 M10 38 h40" stroke="#2d2a40" stroke-width="7" stroke-linecap="round"/></svg>'}</div>${side(r)}</div>`).join('');
  const say=(form.startsWith('sym')?'The purple triangle always means the same amount. ':'')+(surf==='scale'?'Both sides of the scale have the same amount. ':'Both baskets have the same amount. ')+'Which group goes where the question mark is?';
  const q={type:'qp',level,concept:form,surface:surf+':'+styleName(st),dims:['NUM'].concat(['two','three','sym1','sym2','take'].includes(form)?['WM']:[]).concat(level>=3?['DIS']:[]),
    say,hintSay:form.startsWith('sym')?'First figure out how many the purple triangle is. Then use it in the next line.':'Count everything on the side without the question mark. The other side must have the same amount.',stemKey:form+JSON.stringify(lines),layout:'groups',qstyle:st};
  q.stem=`<div class="pzWrap">${stem}</div>`;
  return finalize(q,{html:groupSVG(ans,st),key:'n'+ans},d.map(c=>({html:groupSVG(c.v,st),key:'n'+c.v,kind:c.kind})));
}

// ---------------------------------------------------------------- 6. NUMBER SERIES
const SMAX=16;
function seriesFits(seq){ // seq with exactly one null. returns set of predicted values from every rule that is over-determined and fits
  const u=seq.indexOf(null), known=seq.map((v,i)=>[i,v]).filter(p=>p[1]!=null), preds=new Set();
  const tryModel=(nParams,fn)=>{ if(known.length<nParams+1) return; const p=fn(); if(p!=null&&Number.isFinite(p)) preds.add(Math.round(p*1000)/1000) };
  // arithmetic
  tryModel(2,()=>{const [i0,v0]=known[0],[i1,v1]=known[1];const d=(v1-v0)/(i1-i0);return known.every(([i,v])=>Math.abs(v0+d*(i-i0)-v)<1e-9)?v0+d*(u-i0):null});
  // repeating with period p
  for(const p of [2,3,4]) tryModel(p,()=>{const cls={};for(const [i,v] of known){const k=i%p;if(k in cls&&cls[k]!==v)return null;cls[k]=v}return (u%p) in cls?cls[u%p]:null});
  // geometric with ratio 2 or 3 (and halving)
  for(const r of [2,3,0.5]) tryModel(1,()=>{const [i0,v0]=known[0];return known.every(([i,v])=>Math.abs(v0*Math.pow(r,i-i0)-v)<1e-9)?v0*Math.pow(r,u-i0):null});
  // alternating differences d0,d1
  tryModel(3,()=>{const full=seq.slice();const diffs={};for(let i=1;i<full.length;i++){if(full[i]!=null&&full[i-1]!=null){const k=i%2,d=full[i]-full[i-1];if(k in diffs&&diffs[k]!==d)return null;diffs[k]=d}}
    if(!(0 in diffs&&1 in diffs))return null;
    if(u>0&&seq[u-1]!=null) {const v=seq[u-1]+diffs[u%2]; if(u+1<seq.length&&seq[u+1]!=null&&v+diffs[(u+1)%2]!==seq[u+1]) return null; return v}
    if(u+1<seq.length&&seq[u+1]!=null) return seq[u+1]-diffs[(u+1)%2]; return null});
  // constant second difference (quadratic)
  tryModel(3,()=>{const [a,b,c]=known.slice(0,3);const den=(a[0]-b[0])*(a[0]-c[0])*(b[0]-c[0]);
    const A=(c[0]*(b[1]-a[1])+b[0]*(a[1]-c[1])+a[0]*(c[1]-b[1]))/den, B=(c[0]*c[0]*(a[1]-b[1])+b[0]*b[0]*(c[1]-a[1])+a[0]*a[0]*(b[1]-c[1]))/den, C0=(b[0]*c[0]*(b[0]-c[0])*a[1]+c[0]*a[0]*(c[0]-a[0])*b[1]+a[0]*b[0]*(a[0]-b[0])*c[1])/den;
    const f=x=>A*x*x+B*x+C0; return known.every(([i,v])=>Math.abs(f(i)-v)<1e-6)?f(u):null});
  // two interleaved arithmetic sequences
  tryModel(4,()=>{const sub=k=>known.filter(([i])=>i%2===k);const pr={};for(const k of [0,1]){const s=sub(k);if(s.length<3)return null;const d=(s[1][1]-s[0][1])/((s[1][0]-s[0][0])/2);if(!s.every(([i,v])=>Math.abs(s[0][1]+d*(i-s[0][0])/2-v)<1e-9))return null;pr[k]=x=>s[0][1]+d*(x-s[0][0])/2}return pr[u%2](u)});
  return preds;
}
const SR_LV={1:['up1','rep2'],2:['down1','up2','rep2'],3:['up3','down2','rep3','up2mid'],4:['alt','grow','down3mid','rep3mid'],5:['dbl','interleave','shrink','alt2']};
const SR_NAME={up1:'count up by one',rep2:'repeat two',down1:'count down by one',up2:'count up by two',up3:'count up by three',down2:'count down by two',rep3:'repeat three',up2mid:'count up by two (middle missing)',alt:'up two, down one',grow:'growing steps',down3mid:'count down by three (middle missing)',rep3mid:'repeat three (middle missing)',dbl:'doubling',interleave:'two mixed patterns',shrink:'shrinking steps',alt2:'up three, down one'};
function genSeries(level,opt){
  const rules=SR_LV[level]; const rid=opt.concept&&rules.includes(opt.concept)?opt.concept:R.pick(rules);
  let seq,len=level>=4?7:6,mid=false;
  const arith=(s,d,n)=>[...Array(n)].map((_,i)=>s+d*i);
  switch(rid){
    case 'up1':seq=arith(R.ri(1,5),1,len);break;
    case 'rep2':{const a=R.ri(1,6),b=R.ri(1,6);if(a===b)return null;seq=[...Array(len)].map((_,i)=>i%2?b:a);break}
    case 'down1':seq=arith(R.ri(7,12),-1,len);break;
    case 'up2':seq=arith(R.ri(1,4),2,len);break;
    case 'up3':seq=arith(R.ri(1,2),3,len);break;
    case 'down2':seq=arith(R.ri(11,14),-2,len);break;
    case 'rep3':case 'rep3mid':{const v=R.sample([1,2,3,4,5,6,7],3);seq=[...Array(len)].map((_,i)=>v[i%3]);mid=rid==='rep3mid';break}
    case 'up2mid':seq=arith(R.ri(1,4),2,len);mid=true;break;
    case 'alt':{const s=R.ri(1,3);seq=[s];for(let i=1;i<len;i++)seq.push(seq[i-1]+(i%2?2:-1));mid=R.chance(.5);break}
    case 'alt2':{const s=R.ri(1,2);seq=[s];for(let i=1;i<len;i++)seq.push(seq[i-1]+(i%2?3:-1));mid=R.chance(.5);break}
    case 'grow':{seq=[R.ri(1,2)];for(let i=1;i<6;i++)seq.push(seq[i-1]+i);len=6;mid=R.chance(.5);break}
    case 'shrink':{seq=[16];for(let i=1;i<6;i++)seq.push(seq[i-1]-(6-i));len=6;mid=R.chance(.5);break}
    case 'down3mid':seq=arith(R.ri(16,16),-3,len-1);len=6;mid=true;break;
    case 'dbl':seq=[1,2,4,8,16];len=5;mid=R.chance(.5);break;
    case 'interleave':{const a=R.ri(1,3),b=R.ri(5,8);seq=[...Array(len)].map((_,i)=>i%2?b+(i-1)/2:a+i/2);mid=false;break}
  }
  seq=seq.slice(0,len);
  if(seq.some(v=>v<1||v>SMAX)) return null;
  const u=mid?R.ri(2,seq.length-2):seq.length-1; const ans=seq[u];
  const shown=seq.map((v,i)=>i===u?null:v);
  const preds=seriesFits(shown);
  if(preds.size!==1||!preds.has(ans)) return null; // another simple rule would give a different answer -> ambiguous
  const n=NCH(level)-1;const cand=[];
  const add=(v,k)=>{if(Number.isInteger(v)&&v>=1&&v<=SMAX&&v!==ans&&!cand.some(c=>c.v===v))cand.push({v,kind:k})};
  if(u>0) add(seq[u-1],'copy'); add(ans+1,'near');add(ans-1,'near'); if(u>0) add(seq[u-1]+1,'rule'); add(ans+2,'near');add(ans-2,'near');add(ans+3,'far');
  const d=(level<=2?R.shuffle(cand.slice(0,4)):cand.slice(0,1).concat(R.shuffle(cand.slice(1)))).slice(0,n);
  if(d.length<n) return null;
  const rep=R.pick(level<=1?['beads','towers']:['beads','towers','cards']);
  const col=R.shuffle(QCOL).slice(0,2);
  const term=v=>termSVG(v,rep,col);
  const q={type:'qs',level,concept:rid,surface:rep,dims:['NUM','REL'].concat(['alt','alt2','grow','shrink','interleave','dbl'].includes(rid)?['WM']:[]).concat(level>=3?['DIS']:[]),
    say:mid?'The '+(rep==='beads'?'beads':rep==='towers'?'towers':'cards')+' follow a pattern. One is missing. Which one goes in the empty spot?':'The '+(rep==='beads'?'beads':rep==='towers'?'towers':'cards')+' follow a pattern. Which one comes next?',
    hintSay:'Look at how each one changes from the one before it. Does it get bigger, smaller, or repeat?',stemKey:rid+shown.join(','),layout:rep==='cards'?'groups':'rods'};
  q.stem=`<div class="srRow hintable">${shown.map(v=>`<div class="term ${v==null?'q':''}">${v==null?QBOX:term(v)}</div>`).join('')}</div>`;
  q.choiceRender=rep;
  return finalize(q,{html:term(ans),key:'n'+ans},d.map(c=>({html:term(c.v),key:'n'+c.v,kind:c.kind})));
}
function termSVG(v,rep,col){
  if(rep==='cards') return groupSVG(v,{shape:'dot',color:col[0],layout:'rows'}).replace('viewBox="0 0 120 100"','viewBox="0 -2 120 104"');
  let s=`<svg viewBox="0 0 50 190" width="100%" height="100%">`;
  if(rep==='beads'){s+=`<rect x="4" y="182" width="42" height="6" rx="3" fill="#8a5a2b"/><rect x="23" y="12" width="4" height="172" fill="#8a5a2b"/>`;
    for(let i=0;i<v;i++){const y=176-i*10.5;s+=`<ellipse cx="25" cy="${y}" rx="16" ry="5.6" fill="${Math.floor(i/5)%2?col[1]:col[0]}" stroke="#2d2a40" stroke-width="1.5"/>`}}
  else {s+=`<rect x="2" y="182" width="46" height="6" rx="2" fill="#5b6077"/>`;for(let i=0;i<v;i++){const y=171-i*10.6;s+=`<rect x="9" y="${y}" width="32" height="10" rx="1.5" fill="${Math.floor(i/5)%2?col[1]:col[0]}" stroke="#2d2a40" stroke-width="1.4"/>`}}
  return s+'</svg>';
}

// ---------------------------------------------------------------- shapes (nonverbal)
function regPoly(n,r,rot){return [...Array(n)].map((_,i)=>{const a=(rot||-Math.PI/2)+i*2*Math.PI/n;return [r*Math.cos(a),r*Math.sin(a)]})}
const SHAPES={
 circle:{pts:regPoly(40,.95),sym:90,sides:0},
 square:{pts:[[-.82,-.82],[.82,-.82],[.82,.82],[-.82,.82]],sym:90,sides:4},
 triangle:{pts:[[0,-1],[.95,.78],[-.95,.78]],sym:360,sides:3,orient:1},
 diamond:{pts:[[0,-1],[1,0],[0,1],[-1,0]],sym:90,sides:4},
 pentagon:{pts:regPoly(5,1),sym:0,sides:5},
 hexagon:{pts:regPoly(6,1,0),sym:0,sides:6},
 star:{pts:[...Array(10)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?.45:1.05;return [r*Math.cos(a),r*Math.sin(a)]}),sym:0,sides:10},
 heart:{pts:[...Array(48)].map((_,i)=>{const t=i/48*2*Math.PI;return [16*Math.pow(Math.sin(t),3)/17,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17+.1]}),sym:360,sides:-1,orient:1},
 arrow:{pts:[[0,-1],[.72,-.15],[.28,-.15],[.28,1],[-.28,1],[-.28,-.15],[-.72,-.15]],sym:360,sides:7,orient:1},
 plus:{pts:[[-.3,-1],[.3,-1],[.3,-.3],[1,-.3],[1,.3],[.3,.3],[.3,1],[-.3,1],[-.3,.3],[-1,.3],[-1,-.3],[-.3,-.3]],sym:90,sides:12},
 dome:{pts:[...Array(25)].map((_,i)=>{const a=Math.PI+i*Math.PI/24;return [Math.cos(a),Math.sin(a)*1.0+.45]}),sym:360,sides:-1,orient:1},
 moon:{pts:[...[...Array(25)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/24;return [Math.cos(a)*.95,Math.sin(a)*.95]}),...[...Array(25)].map((_,i)=>{const a=Math.PI/2-i*Math.PI/24;return [Math.cos(a)*.55+.05,Math.sin(a)*.95]})],sym:360,sides:-1,orient:1},
 rect:{pts:[[-1,-.55],[1,-.55],[1,.55],[-1,.55]],sym:180,sides:4},
 trapezoid:{pts:[[-.5,-.6],[.5,-.6],[1,.6],[-1,.6]],sym:360,sides:4},
 parallelogram:{pts:[[-.55,-.6],[1,-.6],[.55,.6],[-1,.6]],sym:180,sides:4},
 righttri:{pts:[[-.85,-.9],[-.85,.85],[.9,.85]],sym:360,sides:3,orient:1},
 tallTri:{pts:[[0,-1],[.55,.9],[-.55,.9]],sym:360,sides:3,orient:1},
};
const FAMILIES={basic:['circle','square','triangle','diamond','pentagon','hexagon','star','heart','plus'],orient:['triangle','arrow','heart','dome','moon','righttri'],four:['square','rect','diamond','trapezoid','parallelogram'],three:['triangle','righttri','tallTri']};
const NCOL={red:'#e4473f',blue:'#3d82c4',green:'#3aa35b',orange:'#f28c38',purple:'#8e5bd6'};
const FILLS=['empty','solid','striped','dotted'];
function rotKey(shape,rot){const s=SHAPES[shape].sym;if(!s)return 0;return ((rot%s)+s)%s}
function figKey(f){return [f.shape,f.fill,f.color,f.size,SHAPES[f.shape].sym===0?0:rotKey(f.shape,f.rot||0),f.count||1,f.inner||'none',f.dots||0,f.innerShape||''].join('|')}
function shapePath(shape,cx,cy,r,rot){const a=(rot||0)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return 'M'+SHAPES[shape].pts.map(([x,y])=>((cx+r*(x*c-y*s)).toFixed(1)+' '+(cy+r*(x*s+y*c)).toFixed(1))).join('L')+'Z'}
function fillOf(f){return f.fill==='solid'?NCOL[f.color]:f.fill==='striped'?`url(#st-${f.color})`:f.fill==='dotted'?`url(#dt-${f.color})`:'#fff'}
// One figure drawn into a 100x100 cell. slots=true lays out 1-3 copies in fixed slots so size stays comparable between cells.
function figSVG(f,slots){
  const cnt=f.count||1; let out='';
  const centers=slots?(cnt===1?[[50,50]]:cnt===2?[[30,50],[70,50]]:[[18,50],[50,50],[82,50]]):[[50,50]];
  const base=slots?(f.size==='l'?15.5:9.5):(f.size==='l'?38:21);
  for(const [cx,cy] of centers){
    out+=`<path d="${shapePath(f.shape,cx,cy,base,f.rot)}" fill="${fillOf(f)}" stroke="${NCOL[f.color]}" stroke-width="${slots?3:4.5}" stroke-linejoin="round"/>`;
    if(f.inner&&f.inner!=='none'){const r=base*.32;out+=f.inner==='dot'?`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#2d2a40" stroke-width="2.5"/>`:`<rect x="${cx-r}" y="${cy-r}" width="${2*r}" height="${2*r}" fill="#2d2a40"/>`}
    if(f.innerShape){out+=`<path d="${shapePath(f.innerShape,cx,cy,base*.42,0)}" fill="#fff" stroke="#2d2a40" stroke-width="2.5" stroke-linejoin="round"/>`}
    if(f.dots){const pos=[[0,0]].concat(regPoly(Math.max(f.dots-1,1),.42).map(p=>p));const pts=f.dots===1?[[0,0]]:f.dots<=5?regPoly(f.dots,.38):[[0,0],...regPoly(f.dots-1,.45)];
      out+=pts.map(([x,y])=>`<circle cx="${(cx+x*base).toFixed(1)}" cy="${(cy+y*base+ (f.shape==='triangle'?base*.18:0)).toFixed(1)}" r="${base*.11}" fill="#2d2a40"/>`).join('')}
  }
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">${out}</svg>`;
}

// ---------------------------------------------------------------- 7. FIGURE MATRICES
const MX_ATTRS={1:['fill','size','color','shape'],2:['rot','count','fill','shape','size','color'],3:['rot','count','fill','shape','size','color'],4:['rot','count','fill','shape','size','color','inner'],5:['rot','count','fill','shape','size','color','inner']};
const VALS={fill:FILLS,size:['s','l'],color:Object.keys(NCOL),rot:[0,90,180,270],count:[1,2,3],inner:['none','dot','sq']};
function genMatrix(level,opt){
  const plan={1:[1,1],2:[1,1],3:[2,1],4:[2,2],5:[3,R.pick([1,2])]}[level];
  let attrs=MX_ATTRS[level].slice();
  let rowA=R.sample(attrs,plan[0]);
  if(opt.concept&&attrs.includes(opt.concept)&&!rowA.includes(opt.concept)) rowA[0]=opt.concept;
  if(level===5&&!rowA.includes('inner')&&R.chance(.5)) rowA[rowA.length-1]='inner';
  const colA=R.sample(attrs.filter(a=>!rowA.includes(a)),plan[1]);
  const usesRot=rowA.includes('rot')||colA.includes('rot');
  const fam=usesRot?'orient':R.pick(['basic','basic','orient']);
  const shapes=FAMILIES[fam];
  const A={shape:R.pick(shapes),fill:R.pick(FILLS),color:R.pick(Object.keys(NCOL)),size:R.pick(['s','l']),rot:usesRot?R.pick(VALS.rot):0,count:1,inner:'none'};
  if(!SHAPES[A.shape].orient) A.rot=0;
  if(level>=4&&R.chance(.3)&&!rowA.includes('inner')&&!colA.includes('inner')) A.inner=R.pick(['dot','sq']);
  if(A.inner!=='none'&&A.fill!=='solid'&&R.chance(.6)) A.fill='solid';
  const change=(f,a)=>{const g={...f};let tries=0;do{g[a]=a==='shape'?R.pick(shapes):R.pick(VALS[a]);tries++}while((figKey(g)===figKey(f))&&tries<30);return g};
  let B={...A};for(const a of rowA)B=change(B,a);
  let C={...A};for(const a of colA)C=change(C,a);
  const D={...C};for(const a of rowA)D[a]=B[a];
  const all=[A,B,C,D];
  if(usesRot&&all.some(f=>!SHAPES[f.shape].orient)) return null;
  if(all.some(f=>f.inner!=='none'&&f.fill!=='solid'&&f.fill!=='empty')) { /* inner marks stay visible on any fill */ }
  if(new Set(all.map(figKey)).size<4) return null;
  // every changed attribute must be visible (e.g. rotating a symmetric shape shows nothing)
  for(const a of rowA){const t={...A};t[a]=B[a];if(figKey(t)===figKey(A))return null}
  for(const a of colA){const t={...A};t[a]=C[a];if(figKey(t)===figKey(A))return null}
  const slots=all.some(f=>(f.count||1)>1);
  const cand=[];const add=(f,k)=>{if(f&&figKey(f)!==figKey(D)&&!cand.some(c=>figKey(c.f)===figKey(f))&&(!usesRot||SHAPES[f.shape].orient))cand.push({f,kind:k})};
  for(const a of R.shuffle(rowA)){const t={...D};t[a]=C[a];add(t,'partial')}
  for(const a of R.shuffle(colA)){const t={...D};t[a]=B[a];add(t,'colmiss')}
  add(C,'copy');
  for(const a of R.shuffle(MX_ATTRS[level].filter(x=>!rowA.includes(x)&&!colA.includes(x)&&x!=='count'))) add(change(D,a),'near');
  add(B,'copy');
  const n=NCH(level)-1;
  let d=level<=2?[cand.find(c=>c.kind==='partial'),...R.shuffle(cand.filter(c=>c.kind!=='partial'))].filter(Boolean).slice(0,n):cand.slice(0,n);
  if(d.length<n) return null;
  const cell=(f,cls)=>`<div class="mcell ${cls||''}">${figSVG(f,slots)}</div>`;
  const q={type:'nm',level,concept:rowA.slice().sort().join('+'),surface:fam+':'+rowA.concat(colA).sort().join('+'),dims:['REL'].concat(rowA.length+colA.length>=3?['WM']:[]).concat(usesRot?['SPA']:[]).concat(level>=3?['DIS']:[]),
    say:'Look at how the picture changes in the top row. Which picture goes in the empty box, so the bottom row changes the same way?',
    hintSay:'Look at the top two boxes. What changed? Make the bottom row change the same way.',stemKey:[A,B,C].map(figKey).join('/'),layout:'figs'};
  q.stem=`<div class="matrix"><div class="mrow hintable">${cell(A)}<div class="arrow small">➜</div>${cell(B)}</div><div class="mrow">${cell(C)}<div class="arrow small">➜</div><div class="mcell q">${QBOX}</div></div></div>`;
  return finalize(q,{html:figSVG(D,slots),key:figKey(D)},d.map(c=>({html:figSVG(c.f,slots),key:figKey(c.f),kind:c.kind})));
}

// ---------------------------------------------------------------- 8. PAPER FOLDING (simulated geometry)
// Paper is the unit square; y grows downward. A fold keeps one half; the other half is reflected onto it.
function applyFoldRegion(reg,fold){
  const {x0,y0,x1,y1}=reg, cx=(x0+x1)/2, cy=(y0+y1)/2;
  switch(fold.k){
    case 'L': return {f:{...fold,line:cx},reg:{x0:cx,y0,x1,y1}};      // left flap folded over onto right
    case 'R': return {f:{...fold,line:cx},reg:{x0,y0,x1:cx,y1}};
    case 'T': return {f:{...fold,line:cy},reg:{x0,y0:cy,x1,y1}};      // top flap folded down
    case 'B': return {f:{...fold,line:cy},reg:{x0,y0,x1,y1:cy}};
    case 'D': return {f:{...fold,sq:{x0,y0,x1,y1}},reg:{x0,y0,x1,y1,tri:'D'}}; // top-right corner folded down onto bottom-left
    case 'A': return {f:{...fold,sq:{x0,y0,x1,y1}},reg:{x0,y0,x1,y1,tri:'A'}}; // top-left corner folded down onto bottom-right
  }
}
function reflectPt([x,y],f){
  if(f.k==='L'||f.k==='R') return [2*f.line-x,y];
  if(f.k==='T'||f.k==='B') return [x,2*f.line-y];
  const s=f.sq;
  if(f.k==='D') return [s.x0+(y-s.y0),s.y0+(x-s.x0)];
  return [s.x0+(s.y1-y),s.y0+(s.x1-x)];
}
function onFlap([x,y],f){ // is the point on the part that gets folded over (before folding)?
  if(f.k==='L')return x<f.line; if(f.k==='R')return x>f.line; if(f.k==='T')return y<f.line; if(f.k==='B')return y>f.line;
  const s=f.sq; if(f.k==='D') return (y-s.y0)<(x-s.x0); return (y-s.y0)<(s.x1-x);
}
const reflHole=(h,f)=>({...h,pts:h.pts.map(p=>reflectPt(p,f)),c:reflectPt(h.c,f)});
function unfoldHoles(holes,folds,skip){let hs=holes.slice();for(let i=folds.length-1;i>=0;i--){if(skip&&skip.has(i))continue;hs=hs.concat(hs.map(h=>reflHole(h,folds[i])))}return hs}
function holeKey(hs){return hs.map(h=>h.c.map(v=>v.toFixed(3)).join(',')+':'+h.pts.map(p=>[(p[0]-h.c[0]).toFixed(2),(p[1]-h.c[1]).toFixed(2)].join(',')).join(';')).sort().join('|')}
function inRegion([x,y],reg,m){
  if(x<reg.x0+m||x>reg.x1-m||y<reg.y0+m||y>reg.y1-m) return false;
  if(reg.tri==='D') return (y-reg.y0)-(x-reg.x0)>m*1.42;
  if(reg.tri==='A') return (y-reg.y0)-(reg.x1-x)>m*1.42;
  return true;
}
function makeHole(c,kind,dir){
  const r=.05; if(kind==='circle') return {kind,c,pts:regPoly(16,r).map(([x,y])=>[c[0]+x,c[1]+y])};
  const base=[[0,-1.2],[1,.8],[-1,.8]].map(([x,y])=>[x*r*1.1,y*r*1.1]);   // small triangle hole, points one way
  const a=dir*Math.PI/2;return {kind,c,pts:base.map(([x,y])=>[c[0]+x*Math.cos(a)-y*Math.sin(a),c[1]+x*Math.sin(a)+y*Math.cos(a)])};
}
const PF_NAME={one:'one fold',oneTwo:'one fold, two holes',two:'two folds',twoTwo:'two folds, two holes',diag:'corner (diagonal) fold',three:'three folds',shape:'shaped hole'};
const PF_LV={1:['one'],2:['one','oneTwo'],3:['two'],4:['twoTwo','diag'],5:['three','shape']};
function genFolding(level,opt){
  const forms=PF_LV[level];const form=opt.concept&&forms.includes(opt.concept)?opt.concept:R.pick(forms);
  const V=()=>R.pick(['L','R']),H=()=>R.pick(['T','B']);
  let seq;
  if(form==='one'||form==='oneTwo') seq=[R.chance(.5)?V():H()];
  else if(form==='two'||form==='twoTwo'||form==='shape') seq=R.chance(.5)?[V(),H()]:[H(),V()];
  else if(form==='diag') seq=[R.pick(['D','A'])];
  else seq=R.chance(.5)?[V(),H(),R.pick(['D','A'])]:[H(),V(),R.pick(['D','A'])];
  let reg={x0:0,y0:0,x1:1,y1:1};const folds=[],regs=[reg];
  for(const k of seq){const r=applyFoldRegion(reg,{k});folds.push(r.f);reg=r.reg;regs.push(reg)}
  const grid=[];for(let i=0;i<8;i++)for(let j=0;j<8;j++)grid.push([(2*i+1)/16,(2*j+1)/16]);
  const cands=grid.filter(p=>inRegion(p,reg,folds.length===1&&!reg.tri?.09:.055));
  const nh=form==='oneTwo'||form==='twoTwo'?2:1;
  if(cands.length<nh) return null;
  const kind=form==='shape'?'tri':'circle', dir=R.ri(0,3);
  const punched=R.sample(cands,nh).map(c=>makeHole(c,kind,dir));
  const correct=unfoldHoles(punched,folds);
  // holes must not overlap once opened
  for(let i=0;i<correct.length;i++)for(let j=i+1;j<correct.length;j++)if(Math.hypot(correct[i].c[0]-correct[j].c[0],correct[i].c[1]-correct[j].c[1])<.1)return null;
  const ck=holeKey(correct);
  const cand=[];const add=(hs,k)=>{const key=holeKey(hs);if(key!==ck&&!cand.some(c=>c.key===key)&&hs.every(h=>h.c[0]>0&&h.c[0]<1&&h.c[1]>0&&h.c[1]<1))cand.push({hs,key,kind:k})};
  // wrong axis: treat one fold as if it were the other direction
  for(let i=0;i<folds.length;i++){const alt=folds.slice();const f=folds[i];
    if('LR'.includes(f.k)) alt[i]={k:'T',line:f.line}; else if('TB'.includes(f.k)) alt[i]={k:'L',line:f.line}; else alt[i]={...f,k:f.k==='D'?'A':'D'};
    add(unfoldHoles(punched,alt),'wrongaxis')}
  if(folds.length>1) add(unfoldHoles(punched,folds,new Set([0])),'lastonly');
  add(punched,'nounfold');
  add(correct.map(h=>({...h,c:[1-h.c[0],h.c[1]],pts:h.pts.map(p=>[1-p[0],p[1]])})),'mirror');
  add(correct.map(h=>({...h,c:[h.c[0],1-h.c[1]],pts:h.pts.map(p=>[p[0],1-p[1]])})),'mirror');
  if(correct.length>=4) add(correct.slice(1),'missing');
  if(kind==='tri') add(correct.map(h=>makeHole(h.c,'tri',dir)),'noflip');
  const n=NCH(level)-1;
  const pri=['noflip','wrongaxis','lastonly','nounfold','missing','mirror'];
  const d=R.shuffle(cand).sort((a,b)=>pri.indexOf(a.kind)-pri.indexOf(b.kind)).slice(0,n);
  if(d.length<n) return null;
  const q={type:'nf',level,concept:form,surface:seq.join('')+':'+kind,dims:['SPA'].concat(folds.length>=2||nh>1?['WM']:[]).concat(level>=4?['DIS']:[]),
    say:'Watch the paper. It gets folded, and then a hole is punched. What will the paper look like when it is opened up?',
    hintSay:'When you open a fold, the hole gets a twin on the other side of the fold line, like a mirror.',stemKey:seq.join('')+holeKey(punched),layout:'paper'};
  q.stem=`<div class="pfRow hintable">${foldPanels(folds,regs,punched)}</div>`;
  q.folds=folds;q.punched=punched;
  return finalize(q,{html:paperSVG(correct),key:ck},d.map(c=>({html:paperSVG(c.hs),key:c.key,kind:c.kind})));
}
const PX=v=>(10+v*100).toFixed(1);
function holesSVG(hs){return hs.map(h=>h.kind==='circle'?`<circle cx="${PX(h.c[0])}" cy="${PX(h.c[1])}" r="5.2" fill="#2d2a40"/>`:`<path d="M${h.pts.map(p=>PX(p[0])+' '+PX(p[1])).join('L')}Z" fill="#2d2a40" stroke="#2d2a40" stroke-width="1" stroke-linejoin="round"/>`).join('')}
function regionPath(r){if(!r.tri)return `M${PX(r.x0)} ${PX(r.y0)}H${PX(r.x1)}V${PX(r.y1)}H${PX(r.x0)}Z`;if(r.tri==='D')return `M${PX(r.x0)} ${PX(r.y0)}L${PX(r.x1)} ${PX(r.y1)}H${PX(r.x0)}Z`;return `M${PX(r.x1)} ${PX(r.y0)}L${PX(r.x1)} ${PX(r.y1)}H${PX(r.x0)}Z`}
function paperSVG(hs){return `<svg viewBox="0 0 120 120" width="100%" height="100%"><rect x="10" y="10" width="100" height="100" rx="2" fill="#fffdf6" stroke="#2d2a40" stroke-width="2.5"/>${holesSVG(hs)}</svg>`}
function foldPanels(folds,regs,punched){
  let out='';
  for(let i=0;i<folds.length;i++){
    const f=folds[i],r=regs[i];let line,arrow;
    const mx=(r.x0+r.x1)/2,my=(r.y0+r.y1)/2;
    if('LR'.includes(f.k)){line=`M${PX(f.line)} ${PX(r.y0)-4}V${+PX(r.y1)+4}`;const s=f.k==='L'?(r.x0+f.line)/2:(f.line+r.x1)/2,e=2*f.line-s;arrow=[s,my-.08,e,my-.08,(s+e)/2,my-.3]}
    else if('TB'.includes(f.k)){line=`M${PX(r.x0)-4} ${PX(f.line)}H${+PX(r.x1)+4}`;const s=f.k==='T'?(r.y0+f.line)/2:(f.line+r.y1)/2,e=2*f.line-s;arrow=[mx+.08,s,mx+.08,e,mx+.3,(s+e)/2]}
    else if(f.k==='D'){line=`M${PX(r.x0)} ${PX(r.y0)}L${PX(r.x1)} ${PX(r.y1)}`;const s=[r.x0+(r.x1-r.x0)*.75,r.y0+(r.y1-r.y0)*.25],e=reflectPt(s,f);arrow=[s[0],s[1],e[0],e[1],r.x1-(r.x1-r.x0)*.1,r.y1-(r.y1-r.y0)*.1]}
    else {line=`M${PX(r.x1)} ${PX(r.y0)}L${PX(r.x0)} ${PX(r.y1)}`;const s=[r.x0+(r.x1-r.x0)*.25,r.y0+(r.y1-r.y0)*.25],e=reflectPt(s,f);arrow=[s[0],s[1],e[0],e[1],r.x0+(r.x1-r.x0)*.1,r.y1-(r.y1-r.y0)*.1]}
    const [sx,sy,ex,ey,qx,qy]=arrow;
    out+=`<div class="pf"><svg viewBox="0 0 120 120" width="100%" height="100%"><rect x="10" y="10" width="100" height="100" fill="none" stroke="#c9cde0" stroke-width="1.5" stroke-dasharray="4 4"/><path d="${regionPath(r)}" fill="#fffdf6" stroke="#2d2a40" stroke-width="2.5" stroke-linejoin="round"/><path d="${line}" stroke="#3d82c4" stroke-width="2.6" stroke-dasharray="6 5"/><path d="M${PX(sx)} ${PX(sy)}Q${PX(qx)} ${PX(qy)} ${PX(ex)} ${PX(ey)}" fill="none" stroke="#e4473f" stroke-width="3.2" marker-end="url(#ah)"/></svg></div><div class="arrow small">➜</div>`;
  }
  const last=regs[regs.length-1];
  out+=`<div class="pf"><svg viewBox="0 0 120 120" width="100%" height="100%"><rect x="10" y="10" width="100" height="100" fill="none" stroke="#c9cde0" stroke-width="1.5" stroke-dasharray="4 4"/><path d="${regionPath(last)}" fill="#fffdf6" stroke="#2d2a40" stroke-width="2.5" stroke-linejoin="round"/>${holesSVG(punched)}</svg></div>`;
  return out;
}

// ---------------------------------------------------------------- 9. FIGURE CLASSIFICATION
const DIRSH=['triangle','arrow','tallTri'];
const FC_LV={1:['shape'],2:['fill','count'],3:['sides','dir'],4:['fill+size','count+shape','dir+fill','sides+fill'],5:['dotsEqSides','innerSame','sides+count']};
function figFeatures(f){
  const S=SHAPES[f.shape],fs=['shape:'+f.shape,'fill:'+f.fill,'size:'+f.size,'count:'+(f.count||1)];
  if(S.sides>0) fs.push('sides:'+S.sides);
  if(S.orient) fs.push('dir:'+(f.rot%360));
  if(f.dots&&S.sides===f.dots) fs.push('dotsEqSides');
  if(f.innerShape) fs.push(f.innerShape===f.shape?'innerSame':'innerDiff');
  return fs;
}
function genFigClass(level,opt){
  const rules=FC_LV[level];const rule=opt.concept&&rules.includes(opt.concept)?opt.concept:R.pick(rules);
  const parts=rule.split('+');
  const usesCount=parts.includes('count'), usesDots=rule==='dotsEqSides', usesInner=rule==='innerSame';
  const shapeFam=parts.includes('dir')?DIRSH:parts.includes('sides')?FAMILIES.four.concat(FAMILIES.three):usesDots?['triangle','square','pentagon','hexagon','righttri','diamond','rect']:usesInner?['circle','square','triangle','diamond','star','heart']:FAMILIES.basic;
  const rnd=()=>{const f={shape:R.pick(shapeFam),fill:R.pick(FILLS),color:R.pick(Object.keys(NCOL)),size:R.pick(['s','l']),rot:0,count:1};
    if(SHAPES[f.shape].orient) f.rot=R.pick([0,90,180,270]);
    if(usesCount) f.count=R.ri(1,3);
    if(usesDots){f.size='l';f.fill='empty';f.dots=R.ri(3,6)}
    if(usesInner){f.size='l';f.fill=R.pick(['solid','striped']);f.innerShape=R.pick(shapeFam)}
    if(level===1){f.fill=R.pick(['solid','empty'])}
    return f};
  // target value(s)
  const tgt={};
  const T=()=>{
    if(parts.includes('shape')) tgt.shape=R.pick(shapeFam);
    if(parts.includes('fill')) tgt.fill=R.pick(FILLS);
    if(parts.includes('count')) tgt.count=R.ri(1,3);
    if(parts.includes('size')) tgt.size=R.pick(['s','l']);
    if(parts.includes('sides')) tgt.sides=R.pick([3,4]);
    if(parts.includes('dir')) tgt.rot=R.pick([0,90,180,270]);
  };T();
  const fam=parts.includes('sides')?(tgt.sides===3?FAMILIES.three:FAMILIES.four):null;
  const conform=f=>{const g={...f};if('shape' in tgt)g.shape=tgt.shape;if('fill' in tgt)g.fill=tgt.fill;if('count' in tgt)g.count=tgt.count;if('size' in tgt)g.size=tgt.size;
    if(fam&&!fam.includes(g.shape))g.shape=R.pick(fam);if('rot' in tgt){if(!DIRSH.includes(g.shape))g.shape=R.pick(DIRSH);g.rot=tgt.rot}
    if(usesDots){g.dots=SHAPES[g.shape].sides} if(usesInner){g.innerShape=g.shape}
    if('sides' in tgt&&!fam.includes(g.shape))return null; if(SHAPES[g.shape].orient&&!('rot' in tgt)&&usesCount===false&&level<3)g.rot=0; return g};
  const targetFeats=f=>{const fs=figFeatures(f),out=[];
    if('shape' in tgt)out.push(fs.includes('shape:'+tgt.shape));if('fill' in tgt)out.push(fs.includes('fill:'+tgt.fill));if('count' in tgt)out.push(fs.includes('count:'+tgt.count));
    if('size' in tgt)out.push(fs.includes('size:'+tgt.size));if('sides' in tgt)out.push(fs.includes('sides:'+tgt.sides));if('rot' in tgt)out.push(fs.includes('dir:'+tgt.rot));
    if(usesDots)out.push(fs.includes('dotsEqSides'));if(usesInner)out.push(fs.includes('innerSame'));return out};
  const stems=[];for(let i=0;i<20&&stems.length<3;i++){const f=conform(rnd());if(f&&!stems.some(s=>figKey(s)===figKey(f)))stems.push(f)}
  if(stems.length<3) return null;
  if(new Set(stems.map(s=>s.color)).size<2) stems[0].color=Object.keys(NCOL).find(c=>c!==stems[1].color);
  // the varying attributes must really vary, so the target is the only thing they share
  const S=stems.map(figFeatures).reduce((a,b)=>a.filter(t=>b.includes(t)));
  let corr=null;for(let i=0;i<40&&!corr;i++){const f=conform(rnd());if(f&&!stems.some(s=>figKey(s)===figKey(f))&&S.every(t=>figFeatures(f).includes(t)))corr=f}
  if(!corr) return null;
  const n=NCH(level)-1;const ds=[];
  for(let i=0;i<80&&ds.length<n;i++){
    let f=conform(rnd());if(!f)continue;
    // break exactly one target attribute (near miss) or, at low levels, more
    const breakers=[];
    if('shape' in tgt)breakers.push(g=>{g.shape=R.pick(shapeFam.filter(s=>s!==tgt.shape))});
    if('fill' in tgt)breakers.push(g=>{g.fill=R.pick(FILLS.filter(x=>x!==tgt.fill))});
    if('count' in tgt)breakers.push(g=>{g.count=R.pick([1,2,3].filter(x=>x!==tgt.count))});
    if('size' in tgt)breakers.push(g=>{g.size=tgt.size==='s'?'l':'s'});
    if('sides' in tgt)breakers.push(g=>{g.shape=R.pick((tgt.sides===3?FAMILIES.four:FAMILIES.three).concat(['pentagon','circle']))});
    if('rot' in tgt)breakers.push(g=>{g.rot=R.pick([0,90,180,270].filter(x=>x!==tgt.rot))});
    if(usesDots)breakers.push(g=>{g.dots=SHAPES[g.shape].sides+R.pick([-1,1])});
    if(usesInner)breakers.push(g=>{g.innerShape=R.pick(shapeFam.filter(s=>s!==g.shape))});
    R.pick(breakers)(f);
    const tf=targetFeats(f);
    if(tf.every(Boolean)) continue;
    if(S.every(t=>figFeatures(f).includes(t))) continue;
    if(ds.some(x=>figKey(x.f)===figKey(f))||figKey(f)===figKey(corr)) continue;
    ds.push({f,kind:tf.filter(Boolean).length>=tf.length-1&&tf.length>1?'near':'far'});
  }
  if(ds.length<n) return null;
  const slots=usesCount;
  const q={type:'nc',level,concept:rule,surface:rule+':'+[...new Set(stems.map(s=>s.shape))].sort().join(','),
    dims:['REL'].concat(parts.length>1||usesDots||usesInner?['WM']:[]).concat(parts.includes('dir')?['SPA']:[]).concat(level>=3?['DIS']:[]),
    say:'These three shapes are alike in some way. Which shape below goes with them?',hintSay:'Look closely at the three shapes at the top. Do not just look at the colors. What else is the same about them?',stemKey:stems.map(figKey).join('/'),layout:'figs'};
  q.stem=`<div class="clsTop hintable">${stems.map(s=>`<div class="mcell">${figSVG(s,slots)}</div>`).join('')}</div>`;
  return finalize(q,{html:figSVG(corr,slots),key:figKey(corr)},ds.map(x=>({html:figSVG(x.f,slots),key:figKey(x.f),kind:x.kind})));
}

// ---------------------------------------------------------------- registry
const TYPES={
 va:{b:'V',name:'Picture Analogies',gen:genAnalogy,concepts:Object.keys(RELS),cname:k=>RELS[k]?RELS[k].name:k},
 vc:{b:'V',name:'Picture Classification',gen:genVClass,concepts:CLS.map(c=>clsName(c.T)),cname:k=>'groups by: '+k},
 vs:{b:'V',name:'Sentence Completion',gen:genSentence,concepts:['describe','function','location','context','source','growth','multi','negation','inference'],cname:k=>({describe:'describing words',function:'what things are used for',location:'where things live/belong',context:'everyday situations',source:'where things come from',growth:'what things grow into',multi:'two clues at once',negation:'"not" sentences',inference:'figuring out from clues'})[k]||k},
 qa:{b:'Q',name:'Number Analogies',gen:genNumAnalogy,concepts:Object.keys(NA_NAME),cname:k=>NA_NAME[k]||k},
 qp:{b:'Q',name:'Number Puzzles',gen:genPuzzle,concepts:Object.keys(PZ_NAME),cname:k=>PZ_NAME[k]||k},
 qs:{b:'Q',name:'Number Series',gen:genSeries,concepts:Object.keys(SR_NAME),cname:k=>SR_NAME[k]||k},
 nm:{b:'N',name:'Figure Matrices',gen:genMatrix,concepts:[],cname:k=>'changes in '+k.replace(/rot/g,'turning').replace(/\+/g,' & ')},
 nf:{b:'N',name:'Paper Folding',gen:genFolding,concepts:Object.keys(PF_NAME),cname:k=>PF_NAME[k]||k},
 nc:{b:'N',name:'Figure Classification',gen:genFigClass,concepts:[],cname:k=>({shape:'same shape',fill:'same pattern',count:'same number',sides:'same number of sides',dir:'pointing the same way','fill+size':'pattern and size','count+shape':'number and shape','dir+fill':'direction and pattern','sides+fill':'sides and pattern',dotsEqSides:'dots match the sides',innerSame:'inside matches outside','sides+count':'sides and number'})[k]||k},
};
const TYPE_IDS=Object.keys(TYPES);
function generate(type,level,opt){
  opt=opt||{};level=Math.max(1,Math.min(5,level));
  for(let i=0;i<200;i++){
    let q=null;try{q=TYPES[type].gen(level,{...opt,concept:i<60?opt.concept:null})}catch(e){if(typeof console!=='undefined'&&i===0)console.warn(type,e)}
    if(!q) continue;
    if(opt.avoid&&opt.avoid.has(q.sig)&&i<150) continue;
    return q;
  }
  return null;
}
if(typeof module!=='undefined') module.exports={ICONS,ICON_IDS,TYPES,TYPE_IDS,generate,SENT,RELS,CLS,seriesFits,unfoldHoles,reflectPt,onFlap,holeKey,applyFoldRegion,figFeatures,figKey,SHAPES};
