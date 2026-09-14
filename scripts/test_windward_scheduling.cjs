// Requires Playwright and Chromium. Runs without external network requests.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'../docs/music');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.MUSIC_TEST_CHROMIUM||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-software-rasterizer']});
 try {
 for(const published of [false])for(const folder of ['03_Windward-Crossing']) {
  const page=await browser.newPage({acceptDownloads:true}),errors=[],requests=[];
  const prefix=published?'https://harayoki.github.io/MMSXX_samples/music/':'http://localhost:8080/dev/music/';
  const media='https://media.githubusercontent.com/media/harayoki/MMSXX_samples/refs/heads/main/docs/music/';
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=route.request().url();requests.push(url);
   const base=url.startsWith(prefix)?prefix:url.startsWith(media)?media:null;
   if(!base)return route.abort();
   let file=decodeURIComponent(url.slice(base.length).split('?')[0]);
   if(file.endsWith('/'))file+='index.html';
   const target=path.join(root,file);
   if(!fs.existsSync(target))return route.fulfill({status:404,body:'missing'});
   await route.fulfill({body:fs.readFileSync(target),contentType:file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':file.endsWith('.png')?'image/png':file.endsWith('.jpg')?'image/jpeg':'text/plain'});
  });
  const id=folder.startsWith('01')?'mmsxx':folder.startsWith('02')?'pt':'wc';
  await page.goto(prefix+folder+'/');
  assert.equal(await page.locator('#'+id+'-src').getAttribute('placeholder'),'LOADING');
  await page.locator('#'+id+'-wav:not([disabled])').waitFor();
  const image=folder.startsWith('01')?'vol_par_crt_256.png':folder.startsWith('02')?'pocket-tunnel.png':'windward-crossing.png';
  assert.equal(await page.locator('[data-music-image]').getAttribute('href'),(published?media:prefix)+folder+'/'+image);
  assert(requests.includes(prefix+'sound-engine.js'));
  assert(requests.includes(prefix+'wav-download.js'));
  assert(requests.includes(prefix+folder+'/player.js'));
  assert(requests.some(url=>url.startsWith(prefix+folder+'/')&&url.endsWith('.mml')));
  if(!published)assert(!requests.some(url=>url.startsWith(media)));
  await page.evaluate(()=>{window.measure=[];window.playCalls=0;const P=MMSXX.sound.ChipTuneSound.prototype,original=P._scheduleTrack;const play=P.playBGM;P.playBGM=function(...args){playCalls++;window.playEngine=this;return play.apply(this,args);};P._scheduleTrack=function(...args){const t=performance.now();const r=original.apply(this,args);measure.push({ms:performance.now()-t,nodes:args[3].length,from:args[4],to:args[5],ch:args[0].ch,notes:args[0].events.filter(e=>e.t>=args[4]&&e.t<args[5]).map(e=>e.t)});return r;};});
  await page.locator('#'+id+'-play').click();
  await page.waitForFunction(id=>id==='pt'?PocketTunnel.state.running:id==='wc'?document.getElementById('wc-status').textContent.includes(' / '):document.getElementById('mmsxx-status').textContent.startsWith('Playing'),id);
  await page.waitForTimeout(4000);
  assert.equal(await page.evaluate(()=>playCalls),1);
  const measures=await page.evaluate(()=>measure);
  assert(measures.length>15);
  assert(Math.max(...measures.map(m=>m.nodes))<100);
  for(const ch of [0,1,2]){
   const windows=measures.filter(m=>m.ch===ch);
   assert.equal(windows[0].from,0);
   for(let i=1;i<windows.length;i++)assert.equal(windows[i].from,windows[i-1].to);
   assert(windows.every(w=>w.to-w.from<.8));
  }
  console.log('PASS bounded nodes and contiguous scheduling windows',Math.max(...measures.map(m=>m.nodes)));

  await page.locator('#'+id+'-stop').click();
  assert.equal(await page.evaluate(()=>playEngine.bgmState),null);
  const stopped=await page.evaluate(()=>measure.length);
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>measure.length),stopped);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
