// Requires Playwright and Chromium. Exercises the actual player and bundled engine.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'../docs/music');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.MUSIC_TEST_CHROMIUM||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-software-rasterizer']});
 try {
  const page=await browser.newPage({acceptDownloads:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{
   const file=new URL(route.request().url()).pathname.replace(/^\//,'');
   const target=path.join(root,file.endsWith('/')?file+'index.html':file);
   return fs.existsSync(target)?route.fulfill({body:fs.readFileSync(target),contentType:file.endsWith('.js')?'application/javascript':file.endsWith('/')?'text/html':'text/plain'}):route.fulfill({status:404,body:'missing'});
  });
  await page.goto('http://localhost/03_Windward-Crossing/');
  await page.locator('#wc-wav:not([disabled])').waitFor();
  await page.evaluate(()=>{
   window.originalSource=document.getElementById('wc-src').value;
   const E=MMSXX.sound,p=E.ChipTuneSound.prototype,play=p.playBGM,render=p.renderBGM;
   p.playBGM=function(name,...args){window.played=this.bgmDefs.get(name);return play.call(this,name,...args);};
   p.renderBGM=function(name,...args){window.rendered=this.bgmDefs.get(name);return render.call(this,name,...args);};
   window.selectCounts=counts=>originalSource.replace(/\$(\w+_COUNT) = \{ [^}]+ \}/g,(_,name)=>'$'+name+' = { '+(counts[name]??0)+' }');
   window.fingerprint=t=>({total:Math.round(t.total*1e8)/1e8,events:t.events.map(e=>({...e,t:Math.round(e.t*1e8)/1e8}))});
  });
  const counts=[['INTRO',2,112],['FIELD',8,112],['ENCOUNTER',2,152],['GOOD',16,152],['BAD',8,152],['CRISIS',8,152],['WIN',4,132],['FIELD_SHORT',4,112],['LOSE',4,96]];
  for(const [name,bars,bpm] of counts){
   const source=await page.evaluate(name=>selectCounts({[name+'_COUNT']:1}),name);
   await page.locator('#wc-src').fill(source);await page.locator('#wc-play').click();
   await page.waitForFunction(()=>document.getElementById('wc-status').textContent.includes(' / '));
   const values=await page.evaluate(()=>played.map(t=>({total:t.total,loop:t.loop,events:t.events.length})));
   for(const t of values){assert(Math.abs(t.total-bars*4*60/bpm)<1e-7,name+' duration');assert(!t.loop);assert(t.events>0);}
   if(name==='GOOD')await page.evaluate(()=>window.goodOnce=played.map(fingerprint));
   await page.locator('#wc-stop').click();
  }
  const twice=await page.evaluate(()=>selectCounts({GOOD_COUNT:2}));
  await page.locator('#wc-src').fill(twice);await page.locator('#wc-play').click();
  await page.waitForFunction(()=>document.getElementById('wc-status').textContent.includes(' / '));
  assert(await page.evaluate(()=>played.every((t,i)=>Math.abs(t.total-goodOnce[i].total*2)<1e-7&&t.events.length===goodOnce[i].events.length*2)));
  await page.locator('#wc-stop').click();
  // A preceding macro changes all persistent settings without adding time.
  const dirty=await page.evaluate(()=>selectCounts({INTRO_COUNT:1,GOOD_COUNT:1}).replace(/\$intro = \{[\s\S]*?\n\}/g,'$intro = { o8 l32 t42 v1 q1 p0 @{noise} @e0 @d70 @v9 @s9 @o2 }'));
  await page.locator('#wc-src').fill(dirty);await page.locator('#wc-play').click();
  await page.waitForFunction(()=>document.getElementById('wc-status').textContent.includes(' / '));
  assert(await page.evaluate(()=>JSON.stringify(played.map(fingerprint))===JSON.stringify(goodOnce)),'reset restores solo sound');
  await page.locator('#wc-stop').click();
  const infinite=await page.evaluate(()=>selectCounts({GOOD_COUNT:'*'}));
  await page.locator('#wc-src').fill(infinite);await page.locator('#wc-play').click();
  await page.waitForFunction(()=>document.getElementById('wc-status').textContent.includes(' / '));
  assert(await page.evaluate(()=>played.every(t=>!!t.loop)));
  await page.locator('#wc-stop').click();
  const zero=await page.evaluate(()=>selectCounts({}));
  await page.locator('#wc-src').fill(zero);await page.locator('#wc-play').click();
  assert((await page.locator('#wc-status').textContent()).includes('再生する曲がありません'));
  await page.locator('#wc-wav').click();
  await page.waitForFunction(()=>document.getElementById('wc-wav-status').textContent.includes('再生する曲がありません'));
  // Actual WAV export uses the same selection and edited notes as playback.
  const edited=await page.evaluate(()=>selectCounts({GOOD_COUNT:1}).replace('$sound2 = {','$sound2 = { @d5 '));
  await page.locator('#wc-src').fill(edited);await page.locator('#wc-play').click();
  await page.waitForFunction(()=>document.getElementById('wc-status').textContent.includes(' / '));
  await page.locator('#wc-stop').click();
  const download=page.waitForEvent('download');await page.locator('#wc-wav').click();const wav=await download;
  assert.equal(wav.suggestedFilename(),'windward_crossing_arranged.wav');
  const data=fs.readFileSync(await wav.path());assert.equal(data.toString('ascii',0,4),'RIFF');
  assert(await page.evaluate(()=>JSON.stringify(rendered)===JSON.stringify(played)));
  assert.deepEqual(errors,[]);
  console.log('PASS all nine solo sections, shared counts, two repeats, state reset, infinite, all-zero, edited WAV');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
