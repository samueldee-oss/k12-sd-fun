// Checks the special mechanics one by one. Every line should end in "true" / "OK".
require('./harness')(`startRun('solo');const K=PK[0];let p;const clr=()=>{K.left=K.right=K.down=K.jump=0;K.jp=0};const check=(n,v)=>console.log((v?'OK  ':'FAIL')+' '+n);
const Lv=n=>LEVELS.findIndex(l=>l.name===n),go=i=>{loadLevel(i);state='play';banner=0;p=players[0];clr()};
// lobby clock tower: climb every ledge and ring the bell
go(LOBBYI());const c0=TOWER.c,offs=[0,4,8,4];const stand=(col,row)=>{placeCat(p,{x:col*T+3,y:row*T-p.cat.h-1});p.cat.vx=0;for(let f=0;f<15;f++)update(1/60)};
const hop=dir=>{K.jp=.1;K.jump=1;for(let f=0;f<90;f++){K.right=dir>0&&f>2?1:0;K.left=dir<0&&f>2?1:0;if(f===20)K.jump=0;update(1/60);if(p.cat.ground&&f>8)break}clr();p.cat.vx=0;for(let f=0;f<10;f++)update(1/60);return Math.round((p.cat.y+p.cat.h)/T)};
let okT=true;stand(c0-1,LEX+10);okT=hop(1)===LEX+8;for(let i=1;i<10&&okT;i++){const a=offs[i%4],pa=offs[(i-1)%4],dir=a>pa?1:-1;stand(c0+(dir>0?pa+2:pa),LEX+8-(i-1)*2);okT=hop(dir)===LEX+8-i*2}
stand(c0+5,LEX+8-18);check('lobby clock tower climb + bell',okT&&bellT>0);
// lasers: 2 shields absorb one hit, 1 shield does not
go(Lv('Laser Corridor'));const bl=lasers.find(q=>q.type==='beam');const zap=sh=>{go(Lv('Laser Corridor'));placeCat(p,{x:bl.c*T+3,y:10*T-17});p.cat.shield=sh;p.cat.inv=0;laserT=-bl.ph+.2;update(1/60);return !p.dead};
check('Laser Corridor has 10 lasers',lasers.length===10);check('lasers: 2 shields survive, 1 shield does not',zap(2)&&!zap(1));
// redwood ladders
go(LEVELS.findIndex(l=>l.w===40));let lc=-1;for(let c=0;c<cols;c++)if(tile(c,9)==='H'){lc=c;break}placeCat(p,{x:lc*T+3,y:10*T-16});for(let f=0;f<10;f++)update(1/60);K.jump=1;for(let f=0;f<150;f++)update(1/60);K.jump=0;for(let f=0;f<30;f++)update(1/60);
check('ladder: climb up and hang at the top',Math.round(p.cat.y+p.cat.h)===4*T);K.right=1;for(let f=0;f<40;f++)update(1/60);clr();for(let f=0;f<20;f++)update(1/60);check('ladder: step off onto a branch',p.cat.ground&&Math.round((p.cat.y+p.cat.h)/T)===4);
// foam
go(LEVELS.findIndex(l=>l.w===46));let fc=-1,ft=0;for(let c=8;c<cols&&fc<0;c++)for(let r=3;r<11;r++)if(tile(c,r)==='O'&&tile(c,r-1)!=='O'){fc=c;ft=r;break}
placeCat(p,{x:fc*T+3,y:ft*T-30});for(let f=0;f<40;f++)update(1/60);check('foam: stand on top',p.cat.ground&&Math.round((p.cat.y+p.cat.h)/T)===ft);K.down=1;for(let f=0;f<60;f++)update(1/60);K.down=0;check('foam: hold down to dive in and swim',!!p.cat.swim);
for(let s=0;s<8;s++){K.jp=.1;update(1/60);for(let f=0;f<14;f++)update(1/60)}check('foam: swim back out',!p.cat.swim&&!p.dead);
// taxis
go(Lv('Taxi Rush'));check('taxis drive on Taxi Rush',cars.length>0);const car=cars[0];car.sp=0;placeCat(p,{x:car.x+12,y:10*T-70});p.cat.inv=0;let b=false;for(let f=0;f<50;f++){update(1/60);if(p.cat.vy<-300)b=true}check('bounce on a taxi roof',b&&!p.dead);
// rafts cannot be jumped
go(Lv('Penguin Rafts'));check('Penguin Rafts turns off air jumps',!!LEVELS[lvl].noAir);
// unlocks
skinSet.delete('deer');go(LEVELS.findIndex(l=>l.w===38&&l.n===2));placeCat(p,{x:fishX-4,y:fishY});for(let f=0;f<5;f++)update(1/60);check('deer unlocks in Yellowstone',skinSet.has('deer'));
skinSet.delete('icesheep');mode='story';runOn=true;loadLevel(LEVELS.findIndex(l=>l.w===49&&l.n===0));check('Icelandic sheep unlocks on arriving in Iceland',skinSet.has('icesheep'));
accSet=new Set();save.beaten=LEVELS.map((l,i)=>i);loadLevel(0);check('accessories granted for beaten worlds',Object.keys(ACCW).filter(w=>+w>=1).every(w=>accSet.has(ACCW[w])));
// knighting
accSet.delete('beefeater');go(Lv('The White Tower'));placeCat(p,{x:fishX-4,y:fishY});update(1/60);const seq=[state];for(let f=0;f<60*8&&state!=='clear';f++){update(1/60);if(seq[seq.length-1]!==state)seq.push(state)}
check('knighting scene then Beefeater Hat',seq.join('>')==='knight>win>clear'&&accSet.has('beefeater'));`);
