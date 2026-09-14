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
let ctx,engine,output,timer,nodes=[],generation=0;
const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function stop(){generation++;clearInterval(timer);for(const n of nodes){try{n.stop();}catch{}try{n.disconnect();}catch{}}nodes=[];if(output)output.disconnect();$('play').disabled=!$('src').value;$('status').textContent='Stopped';}
$('stop').onclick=stop;
function compile(source){return source.split(/^\/\/ @channel[^\n]*$/m).slice(1).map((s,ch)=>({...E.compileMML(s),ch}));}
$('play').onclick=async()=>{
 stop();const token=generation;$('play').disabled=true;
 try{
  const tracks=compile($('src').value);if(tracks.length!==3)throw Error('Three MML channels are required.');
  ctx ||= new AudioContext();await ctx.resume();if(token!==generation)return;
  engine=new E.ChipTuneSound(ctx,{psgTune:false,spatial:'mono'});engine.psgTune=false;
  output=ctx.createGain();output.gain.value=2.25;output.connect(ctx.destination);
  const start=ctx.currentTime+.09,total=Math.max(...tracks.map(t=>t.total));
  // Reserve only a short window; constructing the whole suite at once creates
  // thousands of Web Audio nodes and can overrun the playback start time.
  let cursor=0;
  const tick=()=>{
   if(token!==generation)return;
   const now=ctx.currentTime,elapsed=Math.max(0,now-start);
   const to=Math.min(total,Math.max(0,now+.75-start));
   nodes=nodes.filter(n=>n.__endTime>now);
   if(to>cursor){
    tracks.forEach(t=>engine._scheduleTrack(t,start,output,nodes,cursor,to));
    cursor=to;
   }
   $('status').textContent=clock(Math.min(elapsed,total))+' / '+clock(total);
   if(elapsed>=total+1){stop();$('status').textContent='Finished';}
  };
  tick();timer=setInterval(tick,40);
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
