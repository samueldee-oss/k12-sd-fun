// Real-browser check (needs: npm i playwright; npx playwright install chromium).
// Plays every level with random keys and draws every frame, reporting any error. Run: node fuzz-browser.js
const {chromium}=require('playwright'),path=require('path');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:900,height:700}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto('file://'+path.join(__dirname,'..','index.html'));await pg.waitForTimeout(400);
 const r=await pg.evaluate(()=>{window.requestAnimationFrame=()=>0;const out=[];startRun('solo');document.getElementById('ov').hidden=true;Object.keys(SKINS).forEach(k=>skinSet.add(k));powers=new Set(['double','triple','dash','glide','pound','spring','wall']);
  for(let i=0;i<LEVELS.length;i++){try{loadLevel(i);state='play';banner=0;runBeaten.add(i);const K=PK[0];let seed=i*7+1;const R=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    for(let f=0;f<420;f++){if(f%9===0){K.right=R()<.75?1:0;K.left=K.right?0:(R()<.3?1:0);K.down=R()<.12?1:0}if(R()<.12){K.jp=.1;K.jump=1}if(R()<.08)K.jump=0;if(R()<.02)K.dp=.1;if(R()<.02)K.pp=.1;
      update(1/60);x.setTransform(RES,0,0,RES,0,0);draw();if(state==='talk'||state==='ring')K.jp=.1;if(state==='clear'||state==='final')state='play'}}catch(e){out.push(i+' '+LEVELS[i].name+': '+e.message)}}return out});
 console.log(r.length?r.join('\n'):'no errors in any level');console.log('page errors:',errs.length?errs:'none');await b.close()})();
