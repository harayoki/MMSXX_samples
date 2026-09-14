// 打楽器はエンジン標準のnoiseを使用。長い波形メモリは登録しない。


// 再生エンジンは改造しない。音符・反復・エフェクト指定は外部MMLを正本とする。
const E = MMSXX.sound;
E.registerEnvelope("ptHeld", {
	a: 3e-3,
	d: 0,
	s: 1,
	r: 4e-3
});
E.registerEnvelope("ptDecay", {
	a: 3e-3,
	d: 0.1,
	s: 0.32,
	r: 0.04
});
E.registerFM("ptKick", {
	ratio: 1,
	depth: 0,
	attack: 3e-3,
	decay: 0.12,
	sustain: 0,
	drop: 125 / 45 - 1,
	dropTime: 0.12
}, {
	role: "perc"
});
const PT_TONES = {
	"ptLead": {
		"wave": "pulse50",
		"unit": 0.5
	},
	"ptJazzLead": {
		"wave": "pulse50",
		"unit": 0.425
	},
	"ptArp": {
		"wave": "saw",
		"unit": 1
	},
	"ptBass": {
		"wave": "pulse50",
		"unit": 1
	},
	"ptJazzBass": {
		"wave": "triangle",
		"unit": 1.25
	},
	"ptChord": {
		"wave": "pulse50",
		"unit": 0.5
	},
	"ptJazzChord": {
		"wave": "triangle",
		"unit": 0.5
	},
	"ptJazzAnswer": {
		"wave": "triangle",
		"unit": 0.6
	},
	"ptHarmony": {
		"wave": "pulse50",
		"unit": 1
	},
	"ptChipPulse": {
		"wave": "pulse50",
		"unit": 1
	}
};
for (const [name, spec] of Object.entries(PT_TONES)) E.registerTone(name, { wave: spec.wave, env: "ptHeld" });
const ptEnvelopeCache = /* @__PURE__ */ new Map();
function ptEnv(gate, sustain, legacy) {
	const key = [gate, sustain, legacy].join("_");
	if (ptEnvelopeCache.has(key)) return ptEnvelopeCache.get(key);
	const name = "ptEnv" + ptEnvelopeCache.size;
	const spec = legacy ? { a: 2e-3, d: 0.25 * Math.max(0.02, gate), s: 0, r: 0.05 } : sustain ? { a: 3e-3, d: 0, s: 1, r: 4e-3 } : { a: 3e-3, d: Math.max(0, gate * 0.7 - 3e-3), s: 0.32, r: gate * 0.3 };
	E.registerEnvelope(name, {
	...spec,
	note: "Pocket Tunnel envelope",
	noteJa: legacy ? "\u65E7Fusion\u306E\u97F3\u9577\u6BD4\u4F8B\u306E\u6E1B\u8870\u3092\u79D2\u6307\u5B9A\u3078\u5909\u63DB" : sustain ? "3ms\u306E\u7ACB\u3061\u4E0A\u304C\u308A\u30684ms\u306E\u30EA\u30EA\u30FC\u30B9" : "\u65E7\u7248\u306E\u6E1B\u8870\u3092\u65E2\u5B58ADSR\u3067\u8FD1\u4F3C"
});
	ptEnvelopeCache.set(key, name);
	return name;
}
function ptNativeVolume(linear) {
	return 15 * Math.pow(Math.max(0, linear) / 0.14, 1 / 1.8);
}
const PT_COMMENTS={"original":"ノーマル：メニュー画面や始まりの街のBGMをイメージして作りました。","jazz":"おしゃれ：あえてテンション（不協和音）が目立つ感じで入っています。大人なゲームのBGMに。","fusion-v1":"チップチューン：８BITゲームを強調したい場合に最適。"};
const SONGS=[{"id": "original", "title": "ノーマル", "duration": 54, "file": "original.mml"}, {"id": "jazz", "title": "おしゃれアレンジ", "duration": 54.75, "file": "jazz.mml"}, {"id": "fusion-v1", "title": "チップチューン アレンジ", "duration": 56, "file": "fusion-v1.mml"}];
// ページ全体の音量補正。全曲約 -19 LUFS、最大ピーク -1 dBTP以下を目安。
const PT_PLAYBACK_GAIN = {
	original: 10 ** (3.74 / 20),
	jazz: 10 ** (5.42 / 20),
	'fusion-v1': 10 ** (13.10 / 20)
};
function ptPrepare(song,source){
 const legacy=song.id==='fusion-v1';
 const shared=MusicWav.loopMacro(source);
 const tracks=source.split(/\n\s*\/\/ --- channel ---\s*\n/).map((part,ch)=>{
  const t=E.compileMML(/\$LOOP_END\s*=/i.test(part)?part:shared+part);t.ch=ch;
  for(const e of t.events){
   const name=E.WAVEFORMS[e.wave].name,spec=PT_TONES[name];
   if(legacy){
    if(E.ENVELOPES[e.env].name==='percussive'){const env=ptEnv(e.gate,false,true);e.env=E.ENVELOPES.findIndex(x=>x.name===env);e.open=false;}
    if(name==='ptChipPulse')e.vol=ptNativeVolume(Math.pow(e.vol/15,1.8)*.14*.85);
   }else{
    const sustain=E.ENVELOPES[e.env].name==='ptHeld';
    if(['ptHeld','ptDecay'].includes(E.ENVELOPES[e.env].name)){const env=ptEnv(e.gate,sustain,false);e.env=E.ENVELOPES.findIndex(x=>x.name===env);}
    if(name==='ptKick')e.freq=45;
    e.vol=ptNativeVolume(e.vol*(spec?.unit??1)/15*(spec?.wave==='pulse50'?.85:1));
    e.open=false;
   }
  }
  return t;
 });
 return {tracks,length:Math.max(...tracks.map(t=>t.total)),gain:(legacy?1/.45:.24)*PT_PLAYBACK_GAIN[song.id],tune:legacy};
}

// 初期譜面のFM音色・エンベロープをロード時に登録。
const ptInitial=new Map();
(() => {
const root=document.getElementById('pocket-tunnel'),$=id=>root.querySelector('#pt-'+id);
const drafts=new Map();
let current=SONGS.find(s=>s.id===new URLSearchParams(location.search).get('mix'))||SONGS[0],ctx,engine,master,nodes=[],timer,base=0,cursor=0,prepared=null,running=false,generation=0;
const wavDownload=MusicWav.attach({source:$('src'),button:$('wav'),status:$('wav-status'),key:()=>current.id,basename:()=>current.id==='original'?'pocket_tunnel':'pocket_tunnel_'+current.id.replaceAll('-','_'),render:async (snapshot,job)=>{
 const song=SONGS.find(s=>s.id===snapshot.key),program=ptPrepare(song,snapshot.source);
 const renderer=new E.ChipTuneSound(null,{psgTune:program.tune,spatial:'mono'});
 renderer.psgTune=program.tune;
 renderer.volume=.45*program.gain;
 renderer.bgmDefs.set('download',program.tracks);
 return MusicWav.render(renderer,'download',{loops:1,tail:1,sampleRate:48000,channels:1},job);
}});
function warmAudio(programs){
 ctx ||= new (window.AudioContext||window.webkitAudioContext)({sampleRate:48000});
 engine ||= new E.ChipTuneSound(ctx,{psgTune:false,spatial:'mono'});
  // 再生用の周期波形もロード時に準備。編集後に増えた音色だけ追加する。
  const warm=new Set();function warmWave(id){if(warm.has(id))return;warm.add(id);const w=E.WAVEFORMS[id];if(w.kind==='layer'){for(const l of w.layers)warmWave(l.wave);}else if(w.kind==='wave')engine._periodicWave(w);}
  for(const p of programs)for(const t of p.tracks)for(const e of t.events)warmWave(e.wave);
  if(!engine.noiseBuffer){const b=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),d=b.getChannelData(0);let seed=1;for(let i=0;i<d.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;d[i]=(seed>>>0)/2147483648-1;}engine.noiseBuffer=b;}
}
// 音を出さずに準備。AudioContextの再開はPlay操作時だけ。

function stop(reset=true){generation++;running=false;clearInterval(timer);for(const n of nodes){try{n.stop(0);}catch{}try{n.disconnect();}catch{}}nodes=[];if(master)master.disconnect();master=null;$('play').disabled=!ready;if(reset){$('status').textContent='停止';}}
let ready=false;
function select(song){const restart=ready&&song.id!==current.id&&(running||$('play').disabled);if(!ready)return;drafts.set(current.id,$('src').value);current=song;wavDownload.update();$('comment').textContent=PT_COMMENTS[song.id];$('src').value=drafts.get(song.id)||song.source;for(const b of $('mixes').children){const active=b.dataset.mix===song.id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active)$('editor-body').setAttribute('aria-labelledby',b.id);}if(!running&&!$('play').disabled)$('status').textContent=song.title+' · '+song.duration+'秒';if(restart)$('play').onclick();}
for(const song of SONGS){const b=document.createElement('button');b.type='button';b.className='btn';b.dataset.mix=song.id;b.id='pt-tab-'+song.id;b.setAttribute('role','tab');b.setAttribute('aria-controls','pt-editor-body');b.textContent=song.title;b.onclick=()=>select(song);$('mixes').append(b);}
$('mixes').onkeydown=event=>{const tabs=[...$('mixes').children],i=tabs.indexOf(document.activeElement);if(i<0)return;let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].click();tabs[next].focus();};
$('play').disabled=true;$('src').disabled=true;$('status').textContent='MML読み込み中…';
$('stop').onclick=()=>stop();
$('play').onclick=async()=>{
 if(!ready)return;
 stop();const playingSong=current;const token=generation;$('play').disabled=true;$('status').textContent='準備中…';
 try{
  ctx ||= new (window.AudioContext||window.webkitAudioContext)({sampleRate:48000});
  const resumed=ctx.resume();engine ||= new E.ChipTuneSound(ctx,{psgTune:false,spatial:'mono'});
  prepared=$('src').value===current.source?ptInitial.get(current.id):ptPrepare(current,$('src').value);engine.psgTune=prepared.tune;
  warmAudio([prepared]);
  await resumed;if(token!==generation)return;
  if(ctx.state!=='running')throw Error('音声を開始できませんでした。もう一度再生を押してください。');
  master=ctx.createGain();master.gain.value=.45*prepared.gain;master.connect(ctx.destination);
  base=ctx.currentTime+.08;cursor=0;running=true;
  const tick=()=>{if(!running)return;const now=ctx.currentTime,t=Math.max(0,now-base),to=Math.min(prepared.length,Math.max(0,now+.35-base));
   nodes=nodes.filter(n=>n.__endTime>now);
   if(to>cursor){for(const track of prepared.tracks)engine._scheduleTrack(track,base,master,nodes,cursor,to);cursor=to;}
   $('status').textContent=playingSong.title+' · '+Math.min(t,prepared.length).toFixed(1)+' / '+prepared.length+'秒';
   if(t>=prepared.length+.1){stop(false);$('status').textContent='再生完了';}
  };tick();timer=setInterval(tick,40);
 }catch(error){stop();$('status').textContent='再生エラー：'+error.message;console.error(error);}
};
async function loadSongs(){
 try{
  const sources=await Promise.all(SONGS.map(async song=>{
   const response=await fetch(MusicAssets.song(song.file));
   if(!response.ok)throw Error(song.file+' (HTTP '+response.status+')');
   return await response.text();
  }));
  SONGS.forEach((song,i)=>{song.source=sources[i];ptInitial.set(song.id,ptPrepare(song,song.source));});
  try{warmAudio([...ptInitial.values()]);}catch{}
  ready=true;$('src').disabled=false;$('play').disabled=false;
  $('src').value=current.source;select(current);
 }catch(error){$('status').textContent='MML読み込みエラー：'+error.message;$('play').disabled=true;}
}
loadSongs();
window.addEventListener('pagehide',()=>stop());
// ページ動作の確認用。
window.PocketTunnel={select:id=>select(SONGS.find(s=>s.id===id)),stop,get state(){return{song:current.id,running,time:running?Math.max(0,ctx.currentTime-base):0,engineVersion:E.SOUND_VERSION};}};
})();
