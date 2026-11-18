// Stress test: every generator, every level. Run: node test/stress.js
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={console,Math,module:{exports:{}}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/icons.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'../src/gens.js'),'utf8'),ctx);
const G=ctx.module.exports;
const N=+process.argv[2]||600;let fail=0;
const report=[];
// sentence templates reference real pictures only
for(const s of G.SENT) for(const id of [...s.ok,...s.near,...s.no]) if(!G.ICONS[id]){console.log('missing icon',id,s.s);fail++}
for(const s of G.SENT) for(const id of s.ok) if(s.near.includes(id)||s.no.includes(id)){console.log('ok also wrong',id);fail++}
for(const r in G.RELS) for(const p of G.RELS[r].pairs) for(const id of p) if(!G.ICONS[id]){console.log('missing',id);fail++}
for(const t of G.TYPE_IDS){
  for(let L=1;L<=5;L++){
    let nulls=0,pos={},sigs=new Set(),concepts=new Set(),surf=new Set(),nch={};
    const t0=Date.now();
    for(let i=0;i<N;i++){
      const q=G.generate(t,L,{});
      if(!q){nulls++;continue}
      if(q.answer<0||q.answer>=q.choices.length){console.log('bad answer idx',t,L);fail++}
      if(new Set(q.choices.map(c=>c.key)).size!==q.choices.length){console.log('dup choice',t,L);fail++}
      if(q.choices.filter(c=>c.kind==='correct').length!==1){fail++;console.log('correct count',t,L)}
      if(/\d/.test(q.say)){console.log('digit in speech',q.say);fail++}
      // no numerals in any child-facing text element
      const txt=(q.stem+q.choices.map(c=>c.html).join('')).match(/<text[^>]*>([^<]*)</g)||[];
      for(const m of txt){if(/\d/.test(m.replace(/<text[^>]*>/,''))){console.log('numeral shown',t,m);fail++}}
      pos[q.answer]=(pos[q.answer]||0)+1;sigs.add(q.sig);concepts.add(q.concept);surf.add(q.surface);nch[q.choices.length]=(nch[q.choices.length]||0)+1;
      if(t==='nf') fail+=checkFold(q,G);
    }
    const ms=((Date.now()-t0)/N).toFixed(1);
    report.push(`${t} L${L}: fail-to-generate ${nulls}/${N}, unique ${sigs.size}, concepts ${concepts.size}, surfaces ${surf.size}, choices ${JSON.stringify(nch)}, answer pos ${JSON.stringify(pos)}, ${ms}ms/q`);
    if(nulls>0) fail++;
  }
}
// independent check of paper folding: fold every grid point forward through the folds; it should have a hole iff it lands on a punched hole
function checkFold(q,G){
  const corr=q.choices[q.answer].key; let bad=0;
  const pts=[];for(let i=0;i<8;i++)for(let j=0;j<8;j++)pts.push([(2*i+1)/16,(2*j+1)/16]);
  const holesAt=new Set();
  for(const p of pts){let x=p;for(const f of q.folds){if(G.onFlap(x,f))x=G.reflectPt(x,f)}
    if(q.punched.some(h=>Math.hypot(h.c[0]-x[0],h.c[1]-x[1])<1e-6)) holesAt.add(p.map(v=>v.toFixed(3)).join(','))}
  const fromKey=new Set(corr.split('|').map(s=>s.split(':')[0]));
  if(holesAt.size!==fromKey.size||[...holesAt].some(k=>!fromKey.has(k))){bad=1;console.log('FOLD MISMATCH',q.surface,[...holesAt],[...fromKey])}
  // triangle holes: orientation must be mirrored per layer (forward-map each hole's points back to punched shape)
  return bad;
}
console.log(report.join('\n'));
console.log(fail?`FAILURES: ${fail}`:'ALL CHECKS PASSED');
process.exit(fail?1:0);
