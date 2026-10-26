// Loads the game's <script> from ../index.html into Node with a fake browser (no real drawing),
// so game logic can be tested without opening a page. Usage: const run=require('./harness'); run(`...code using game globals...`)
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
const ctx=new Proxy({},{get:(o,k)=>k==='getTransform'?(()=>({a:1,b:0,c:0,d:1,e:0,f:0})):k==='measureText'?(()=>({width:100})):k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):(o[k]!==undefined?o[k]:()=>{}),set:(o,k,v)=>{o[k]=v;return true}});
const el=()=>new Proxy({style:{},classList:{toggle(){},add(){},remove(){},contains(){return false}},dataset:{},querySelectorAll:()=>[],querySelector:()=>null,appendChild(){},append(){},addEventListener(){},setAttribute(){},getContext:()=>ctx,focus(){},blur(){}},{get:(o,k)=>k in o?o[k]:undefined,set:(o,k,v)=>{o[k]=v;return true}});
const els={};global.document={addEventListener(){},getElementById:id=>els[id]||(els[id]=el()),querySelectorAll:()=>[],createElement:()=>el(),createTextNode:()=>el(),body:el()};
global.localStorage={getItem:()=>null,setItem(){}};global.addEventListener=()=>{};global.matchMedia=()=>({matches:false});global.requestAnimationFrame=()=>{};global.window={devicePixelRatio:1};
module.exports=code=>eval(src+';\n'+code);
