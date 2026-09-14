// Copyright 2026 harayoki. All rights reserved.

(()=>{
const E=MMSXX.sound;
// Shared instrument set for both battle states. No sampled PCM or custom wave tables.
E.registerEnvelope('wcLeadEnv', { a: .004, d: .09, s: .68, r: .012 });
E.registerEnvelope('wcPluckEnv', { a: .003, d: .08, s: .18, r: .008 });
E.registerEnvelope('wcDrumEnv', { a: .001, d: .045, s: 0, r: .004 });
E.registerTone('wcFieldLead', { wave: 'triangle', env: 'wcLeadEnv' });
E.registerTone('wcBattleLead', { wave: 'pulse25', env: 'wcLeadEnv' });
E.registerEnvelope('wcBattleBassEnv', { a: .003, d: .055, s: .65, r: .01 });
E.registerTone('wcBattleBass', { wave: 'pulse50', env: 'wcBattleBassEnv' });
E.registerTone('wcBass', { wave: 'triangle', env: 'wcPluckEnv' });
E.registerTone('wcArp', { wave: 'pulse50', env: 'wcPluckEnv' });
E.registerFM('wcKick', { ratio: 1, depth: 0, attack: .002, decay: .085, sustain: 0, drop: 1.8, dropTime: .075 }, { role: 'perc' });

const $=id=>document.getElementById('wc-'+id);
let ctx,engine,timer,generation=0;
const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function stop(){generation++;clearInterval(timer);engine?.stopBGM();$('play').disabled=!$('src').value;$('status').textContent='Stopped';}
$('stop').onclick=stop;
function compile(source){
 const parts=source.split(/^\/\/ @channel[^\n]*$/m),shared=parts.shift();
 // Standard MML definitions before the first channel are shared verbatim.
 // No macro expansion or MML syntax conversion is performed by the page.
 const tracks=parts.map((part,ch)=>({...E.compileMML(shared+'\n'+part),ch}));
 if(tracks.length!==3)throw Error('Three MML channels are required.');
 if(!tracks.some(t=>t.events.length))throw Error('再生する曲がありません。冒頭の回数を1以上にしてください。');
 return tracks;
}
$('play').onclick=async()=>{
 stop();const token=generation;$('play').disabled=true;
 try{
  const tracks=compile($('src').value);if(tracks.length!==3)throw Error('Three MML channels are required.');
  ctx ||= new AudioContext();await ctx.resume();if(token!==generation)return;
  engine ||= new E.ChipTuneSound(ctx,{psgTune:false,spatial:'mono'});
  engine.unlock();engine.volume=2.25;
  engine.bgmDefs.set('suite',tracks);
  engine.playBGM('suite',false,true);
  const total=Math.max(...tracks.map(t=>t.total)),start=engine.bgmState.base;
  const infinite=tracks.some(t=>t.loop);
  // This timer updates the display only. The engine owns all audio scheduling.
  timer=setInterval(()=>{
   if(token!==generation)return;
   const elapsed=Math.max(0,ctx.currentTime-start);
   $('status').textContent=clock(Math.min(elapsed,total))+' / '+clock(total);
   if(!infinite&&elapsed>=total+1){stop();$('status').textContent='Finished';}
  },100);
 }catch(e){stop();$('status').textContent='Playback error: '+e.message;}
};
fetch(MusicAssets.song('windward-crossing.mml')).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.text();}).then(source=>{$('src').value=source;$('src').disabled=false;$('play').disabled=false;$('status').textContent='Ready';}).catch(e=>{$('status').textContent='MML load failed: '+e.message+' — Please use an HTTP server.';});
MusicWav.attach({source:$('src'),button:$('wav'),status:$('wav-status'),
 key:()=> 'suite',basename:()=> 'windward_crossing',render:async(snapshot,job)=>{
  const tracks=compile(snapshot.source);
  if(tracks.length!==3)throw Error('Three MML channels are required.');
  const renderer=new E.ChipTuneSound(null,{psgTune:false,spatial:'mono'});
  renderer.volume=2.25;
  renderer.bgmDefs.set('download',tracks);
  return MusicWav.render(renderer,'download',{loops:1,tail:1,sampleRate:48000,channels:1},job);
 }});
window.addEventListener('pagehide',stop);
})();
