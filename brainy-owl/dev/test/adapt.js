const fs=require('fs'),vm=require('vm');let now=Date.UTC(2026,10,1,15);
const store={};const ctx={console,Math,module:{exports:{}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},Date:class extends Date{static now(){return now}}};
vm.createContext(ctx);
vm.runInContext(['icons','gens','engine'].map(f=>fs.readFileSync('src/'+f+'.js','utf8')).join('\n').replace("if(typeof module!=='undefined')","if(false)")+';this.api={get S(){return S},load,record,typeStats,nextItem,skillProfile,generate,needWeight};',ctx);
const A=ctx.api;A.load();
// child profile: true skill per type (prob. of first-try correct at each level)
const skill={va:5,vc:5,vs:4,qa:3,qp:4,qs:3,nm:2,nf:2,nc:3};
const pCorrect=(t,l)=>l<=skill[t]?0.9:l===skill[t]+1?0.45:0.2;
const visits={};
for(let day=0;day<40;day++){
  now+=86400e3;
  for(let round=0;round<2;round++){
    const ses={mode:'p',len:6,items:[]};
    for(let i=0;i<6;i++){const it=A.nextItem(ses);const q=A.generate(it.t,it.level,{concept:it.concept});
      visits[it.t]=(visits[it.t]||0)+1;
      const ok=Math.random()<pCorrect(it.t,q.level);const res={r:ok?'f':Math.random()<.5?'r':'h',ms:5000,tries:ok?1:2,firstWrongKind:ok?null:'near'};
      A.record(q,res,it.easy?'e':it.review?'r':'p');ses.items.push({t:it.t,level:q.level,res});now+=60e3}
  }
  if(day===9||day===39){console.log('--- day',day+1);for(const t in skill){const s=A.typeStats(t);console.log(t,'true skill L'+skill[t],'| level',s.level,'| Lr',s.Lr,'| n',s.n,'| score',s.score,'|',s.status,'| practice share',visits[t])}}
}
