// Loads every level in solo, co-op and battle mode, runs a jumping bot for ~8 s each, and counts errors.
// Expect: "levels 240 errors 0". Run: node smoke.js
require('./harness')(`let errs=0,wins=0;
for(const pm of ['solo','coop','battle']){startRun(pm);
 ['double','wall','pound','dash','phase','bell','lives','lives2','moon','feather','reflex','bouncy'].forEach(p=>powers.add(p));
 for(let i=0;i<LEVELS.length;i+=(pm==='solo'?1:7)){try{mode='story';loadLevel(i);state='play';banner=0;for(const K of PK)K.right=1;
  for(let f=0;f<500;f++){for(const K of PK){if(f%20==0){K.jp=.1}K.jump=f%40<10;if(f%50==25)K.dp=.1;if(f%60==30)K.pp=.1}update(1/60);draw();if(state==='win'){wins++;break}}}
  catch(e){errs++;console.log(pm,'level',i,LEVELS[i]&&LEVELS[i].name,e.stack.split('\\n').slice(0,3).join(' | '))}}}
console.log('levels',LEVELS.length,'errors',errs,'bot wins',wins);`);
