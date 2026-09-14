// Requires Playwright and a Chromium installation. See docs/music/WAV_EXPORT.md.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const base=path.resolve(__dirname,'../docs');
const server=http.createServer((req,res)=>{const p=path.join(base,decodeURIComponent(req.url.split('?')[0]),req.url.split('?')[0].endsWith('/')?'index.html':'');try{res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.html')?'text/html':p.endsWith('.mml')?'text/plain':'application/octet-stream');res.end(fs.readFileSync(p));}catch{res.writeHead(404);res.end();}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.MUSIC_TEST_CHROMIUM || undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-software-rasterizer'],headless:true});
 const page=await browser.newPage({acceptDownloads:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://media.githubusercontent.com/**',route=>{const basename=route.request().url().split('/').at(-1);for(const f of ['01_Volcano-parade','02_Pocket-Tunnel']){const p=path.join(base,'music',f,basename);if(fs.existsSync(p))return route.fulfill({body:fs.readFileSync(p),contentType:basename.endsWith('.png')?'image/png':'image/jpeg'});}return route.abort();});
 const host='http://127.0.0.1:'+server.address().port;
 async function download(prefix){
  const pending=page.waitForEvent('download',{timeout:120000});await page.locator('#'+prefix+'-wav').click();
  assert(await page.locator('dialog').isVisible());
  await page.waitForFunction(()=>document.querySelector('dialog progress').value>0);
  assert(await page.evaluate(()=>document.querySelector('dialog').matches(':modal')));
  const item=await pending;await page.waitForFunction(()=>!document.querySelector('dialog').open);assert.equal(await page.locator('#'+prefix+'-wav-status').textContent(),'');assert.equal(await item.failure(),null);const data=fs.readFileSync(await item.path());
  assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.readUInt32LE(24),48000);assert.equal(data.readUInt16LE(34),16);
  let peak=0,square=0,clipped=0;for(let i=44;i<data.length;i+=2){let x=data.readInt16LE(i);peak=Math.max(peak,Math.abs(x));square+=x*x;if(Math.abs(x)>=32767)clipped++;}
  assert(square>0);assert.equal(clipped,0);const duration=(data.length-44)/96000;
  console.log(item.suggestedFilename(),duration,'sec','peak',peak/32768);return {name:item.suggestedFilename(),data,duration};
 }
 await page.goto(host+'/music/02_Pocket-Tunnel/');await page.locator('#pt-wav:not([disabled])').waitFor();
 // Cancel after real render progress; the modal must release the page without a download.
 let cancelledDownloads=0;const onDownload=()=>cancelledDownloads++;page.on('download',onDownload);
 await page.locator('#pt-wav').click();
 await page.waitForFunction(()=>document.querySelector('dialog progress').value>0);
 await page.locator('dialog button').click();
 await page.waitForFunction(()=>!document.querySelector('dialog').open);
 assert.equal(cancelledDownloads,0);page.off('download',onDownload);
 assert(await page.locator('#pt-wav').isEnabled());
 for(const id of ['original','jazz','fusion-v1']){
  await page.locator('#pt-tab-'+id).click();assert(await page.locator('#pt-src').isVisible());
  await page.locator('#pt-play').click();await page.waitForFunction(()=>PocketTunnel.state.running);
  const file=await download('pt');assert(await page.evaluate(()=>PocketTunnel.state.running));
  assert(Math.abs(file.duration-({original:55,jazz:55.75,'fusion-v1':57})[id])<=1/48000+1e-8);
  await page.locator('#pt-stop').click();
 }
 await page.locator('#pt-tab-original').click();const original=await page.locator('#pt-src').inputValue();
 await page.locator('#pt-src').fill(original.replace('$LOOP_END = { ]1 }','$LOOP_END = { ]2 }'));
 const loops=await download('pt');assert.equal(loops.name,'pocket_tunnel_arranged.wav');assert(Math.abs(loops.duration-103)<=1/48000+1e-8);
 await page.locator('#pt-src').fill(original);assert.equal(await page.locator('#pt-wav-filename').count(),0);
 await page.locator('#pt-tab-jazz').click();assert.equal(await page.locator('#pt-wav-filename').count(),0);
 await page.locator('#pt-tab-original').click();assert.equal(await page.locator('#pt-wav-filename').count(),0);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(require('os').tmpdir(),'pocket-wav-mobile.png'),fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.goto(host+'/music/01_Volcano-parade/');await page.locator('#mmsxx-wav:not([disabled])').waitFor();
 await page.locator('#mmsxx-play').click();
 await page.waitForFunction(()=>document.getElementById('mmsxx-status').textContent.startsWith('Playing'));
 const volcano=await download('mmsxx');
 assert((await page.locator('#mmsxx-status').textContent()).startsWith('Playing'));
 await page.locator('#mmsxx-stop').click();const vp=await page.locator('#mmsxx-src').inputValue();
 await page.locator('#mmsxx-src').fill(vp.replace('$LOOP_END = { ]2 }','$LOOP_END = { ]1 }'));
 const vpLoops=await download('mmsxx');assert.equal(vpLoops.name,'volcano_parade_arranged.wav');assert(vpLoops.duration<volcano.duration);
 await page.screenshot({path:path.join(require('os').tmpdir(),'volcano-wav-mobile.png'),fullPage:true});
 assert(await page.locator('#mmsxx-src').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);await browser.close();server.close();console.log('PASS browser WAV export, playback continuity, all arrangements, loop edits, filenames, mobile layout');
})().catch(e=>{console.error(e);server.close();process.exit(1)});
