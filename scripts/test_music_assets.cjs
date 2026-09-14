// Requires Playwright and Chromium. Runs without external network requests.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'../docs/music');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.MUSIC_TEST_CHROMIUM||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-software-rasterizer']});
 try {
 for(const published of [false,true])for(const folder of ['01_Volcano-parade','02_Pocket-Tunnel','03_Windward-Crossing']) {
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
  const macroCheck=await page.evaluate(()=>{
    const E=MMSXX.sound;
    const numeric='$LOOP_END = { 2 }\n t120 [c4 ]$LOOP_END';
    const legacy='$LOOP_END = { ]2 }\n t120 [c4 $LOOP_END';
    const a=E.compileMML(numeric);
    const b=E.compileMML(legacy);
    let rejected=false;try{MusicWav.loopMacro('$LOOP_END = { 0 }');}catch{rejected=true;}
    const joined=E.compileMML('$len={ 4 } a$len');
    const literal=E.compileMML('a4');
    if(JSON.stringify(joined)!==JSON.stringify(literal))throw Error('Macro concatenation changed');
    return {equal:JSON.stringify(a)===JSON.stringify(b),events:a.events.length,rejected};
  });assert.deepEqual(macroCheck,{equal:true,events:2,rejected:true});
  await page.locator('#'+id+'-play').click();
  await page.waitForFunction(id=>id==='pt'?PocketTunnel.state.running:id==='wc'?document.getElementById('wc-status').textContent.includes(' / '):document.getElementById('mmsxx-status').textContent.startsWith('Playing'),id);
  await page.locator('#'+id+'-stop').click();
  // Short edited MML exercises the entire export path without rendering full songs four times.
  await page.locator('#'+id+'-src').fill(id==='wc'?'// @channel 1\nt120 o4 v10 c4\n// @channel 2\nt120 o3 v8 c4\n// @channel 3\nt120 o2 v6 c4':'t120 o4 v10 c4');
  const download=page.waitForEvent('download');
  await page.locator('#'+id+'-wav').click();
  const result=await download;
  assert(result.suggestedFilename().endsWith('_arranged.wav'));
  assert.equal(fs.readFileSync(await result.path()).toString('ascii',0,4),'RIFF');
  await page.waitForFunction(()=>!document.querySelector('dialog').open);
  assert.deepEqual(errors,[]);
  console.log('PASS',published?'published':'local',folder,'assets, MML, playback, edited WAV');
  await page.close();
 }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
