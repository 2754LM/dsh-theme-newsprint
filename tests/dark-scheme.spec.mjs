import { spawn } from 'node:child_process'
import http from 'node:http'
import fs from 'node:fs'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; const PORT=9444;
const chrome=spawn(CHROME,['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,'--no-first-run','--user-data-dir=/tmp/chrome-final','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const getJSON=p=>new Promise((res,rej)=>{http.get({host:'127.0.0.1',port:PORT,path:p},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej)});

(async()=>{
  let ver,t=0; while(t++<40){try{ver=await getJSON('/json/version');break}catch{await sleep(250)}}
  // `ws` ships inside the harness checkout's pnpm store, not beside this
  // plugin. Prefer a local install, then the store copy keyed by DSH_ROOT.
  const { createRequire } = await import('node:module')
  const { readdirSync } = await import('node:fs')
  const dshRoot = process.env.DSH_ROOT ?? '/Users/dul27/Desktop/DSH'
  async function loadWs() {
    try { return (await import('ws')).default } catch { /* not installed beside the plugin */ }
    const store = dshRoot + '/node_modules/.pnpm'
    const dir = readdirSync(store).find((d) => /^ws@/.test(d))
    if (!dir) throw new Error(`no ws in ${store}; set DSH_ROOT to a checkout that has one`)
    return createRequire(`${store}/${dir}/node_modules/ws/package.json`)('ws')
  }
  const WebSocket = await loadWs()
  const ws=new WebSocket(ver.webSocketDebuggerUrl,{perMessageDeflate:false});
  let id=0; const pending=new Map();
  ws.on('message',m=>{const g=JSON.parse(m); if(g.id&&pending.has(g.id)){pending.get(g.id)(g);pending.delete(g.id)}});
  await new Promise(r=>ws.on('open',r));
  const send=(method,params,sessionId)=>new Promise(res=>{const i=++id;pending.set(i,res);ws.send(JSON.stringify({id:i,method,params,sessionId}))});

  // Read the EXACT file the running profile serves.
  const SRC = new URL('../lib/client.js', import.meta.url).pathname
  const src=fs.readFileSync(SRC,'utf8');
  const s=src.indexOf('function alpha'), e=src.indexOf('/* —— Stable element id');
  const {THEME_CSS,PATCHES_CSS}=new Function(src.slice(s,e)+'; return {THEME_CSS,PATCHES_CSS};')();

  // Approximate dsh's real sheets + a markdown body so typography can be checked.
  const page=`<!doctype html><html><head><style>
body { --dsw-alias-bg-base: rgb(255,255,255); --dsw-alias-label-primary: rgb(0,0,0); --dsw-alias-link:#00f; }
body[data-ds-dark-theme]{ --dsw-alias-bg-base: rgb(21,21,23); --dsw-alias-label-primary: rgb(245,245,245); --dsw-alias-link:#6cf; }
</style><style id="dsh-theme-newsprint-styles">${THEME_CSS}${PATCHES_CSS}</style></head>
<body><div data-dsh-part="message-body" id="md"><h1>Head</h1><blockquote id="q">quote</blockquote>
<pre id="pre">code</pre><table><thead><tr><th id="th">h</th></tr></thead><tbody><tr><td>a</td></tr><tr id="row2"><td>b</td></tr></tbody></table></div></body></html>`;
  fs.writeFileSync('/tmp/final.html',page);

  const {result:{targetId}}=await send('Target.createTarget',{url:'file:///tmp/final.html'});
  const {result:{sessionId}}=await send('Target.attachToTarget',{targetId,flatten:true});
  await sleep(700);
  const ev=async x=>(await send('Runtime.evaluate',{expression:x,returnByValue:true},sessionId)).result.result.value;
  await ev(`document.documentElement.classList.add('dsh-newsprint-active')`);

  const read=`(()=>{const g=(el,p)=>getComputedStyle(document.querySelector(el)).getPropertyValue(p).trim();
    return {bg:getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim(),
      fg:getComputedStyle(document.body).getPropertyValue('--dsw-alias-label-primary').trim(),
      rule:getComputedStyle(document.body).getPropertyValue('--newsprint-rule').trim(),
      quoteBorder:g('#q','border-left-color'), quoteText:g('#q','color'), quoteStyle:g('#q','font-style'),
      preBg:getComputedStyle(document.querySelector('#pre')).backgroundColor,
      rowAlt:getComputedStyle(document.querySelector('#row2')).backgroundColor,
      thBg:getComputedStyle(document.querySelector('thead')).backgroundColor,
      thTransform:g('#th','text-transform'),
      font:g('#md','font-family')};})()`;

  await ev(`document.body.removeAttribute('data-ds-dark-theme')`);
  const L=await ev(read);
  await ev(`document.body.setAttribute('data-ds-dark-theme','')`);
  const D=await ev(read);

  console.log('=== LIGHT ==='); console.log(JSON.stringify(L,null,1));
  console.log('=== DARK  ==='); console.log(JSON.stringify(D,null,1));

  const checks=[
    ['light bg is paper',        L.bg==='#f5f3ed'],
    ['dark bg is warm dark',     D.bg==='#1a1815'],
    ['dark != light (bug fixed)',D.bg!==L.bg],
    ['text contrasts',           L.fg==='#1f0909' && D.fg==='#ece7dd'],
    ['private rule token flips', L.rule!==D.rule],
    ['quote border flips',       L.quoteBorder!==D.quoteBorder],
    ['quote italic kept',        L.quoteStyle==='italic' && D.quoteStyle==='italic'],
    ['thead uppercase kept',     L.thTransform==='uppercase' && D.thTransform==='uppercase'],
    ['zebra row differs in dark',D.rowAlt!==L.rowAlt],
    ['th bg differs in dark',    D.thBg!==L.thBg],
    ['serif applied',            /Georgia/i.test(L.font) && /Georgia/i.test(D.font)],
    ['no light hex leaks to dark', !JSON.stringify(D).includes('#f5f3ed') && !JSON.stringify(D).includes('#fdfdfa')],
  ];
  console.log('\n=== CHECKS ===');
  let bad=0; for(const[n,ok] of checks){ if(!ok)bad++; console.log((ok?'  PASS  ':'  FAIL  ')+n); }
  console.log('\n'+(bad?bad+' FAILED':'ALL '+checks.length+' CHECKS PASSED'));
  process.exitCode=bad?1:0;
  ws.close(); chrome.kill();
})().catch(e=>{console.error('ERROR:',e.message);chrome.kill();process.exitCode=2});
