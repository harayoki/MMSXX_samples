// GameNotes grdsSt1 + trial percussion + TR-808 addon, using the official 0.46.0 APIs.
// Rebuilt from the v2.71.30 PLAYER sound definitions; no replacement synthesizer.
import { registerAddon, listAddons } from '../runtime/sound-0.46.0/sound/addon.js';
import { registerAnalogPatch, ANALOG_PATCHES } from '../runtime/sound-0.46.0/sound/analog.js';
import { registerLayer, registerAnalog, WAVEFORMS } from '../runtime/sound-0.46.0/sound/mml.js';

const E={analog:{ANALOG_PATCHES},core:{'mml.js':{WAVEFORMS}},listAddons};
const d = registerAnalogPatch, i = registerLayer;
registerAddon({id:"gamenotes::grdsSt1",version:"1.0.0",desc:"An arcade-game-inspired synthesizer voice set. Detuned and octave-stacked sounds are built into the presets, so no additional tracks are required. The instruments are rebuilt as clean, low-noise synth sounds.",needs:["analog"],engine:">=0.41.0",voices:["gamenotes::grdsSt1::edgeLead","gamenotes::grdsSt1::octaveBass","gamenotes::grdsSt1::arpeggio","gamenotes::grdsSt1::tightBass","gamenotes::grdsSt1::harmony"]},()=>{let l={filter:{kind:"lowpass",cutoff:9e3,resonance:0,drive:0}},o=(r,a,n=.23)=>({attack:.005,hold:r,decay:a,sustain:n,release:.045}),x=[1,.9644,.2595,.5882,.468,.4044,.4943,.3027],m=[.32,.1439,.1619,.9,.112,.066,.063,.311],g=r=>({partials:r.map((a,n)=>({ratio:n+1,level:a,attack:.004,t60:8}))}),s=(r,a,n,S,A,u,v,E={})=>registerAnalogPatch(r,{wave:a,octave:0,osc:n,...l,amp:S,level:A},{role:u,desc:v,...E});s("gamenotes::grdsSt1::edgeLeadSquare","square",{},o(.11,1.3),.185*10/12,"lead","50% square-wave component of edgeLead"),s("gamenotes::grdsSt1::edgeLeadPulse","partials",g(x),o(.11,1),.105*11/12,"lead","8-partial complex-pulse approximation for edgeLead"),registerLayer("gamenotes::grdsSt1::edgeLead",{role:"lead",genre:["arcade"],tags:["approx"],gm:80,desc:"A strong melodic lead combining a 50% square wave and a complex pulse-wave approximation with detuning.",layers:[{wave:"gamenotes::grdsSt1::edgeLeadSquare",gain:1},{wave:"gamenotes::grdsSt1::edgeLeadPulse",gain:1,cents:12}]}),s("gamenotes::grdsSt1::octaveBassSquare","square",{},o(0,.7,.22),.185*10/12,"bass","Square-wave component for octaveBass"),registerLayer("gamenotes::grdsSt1::octaveBass",{role:"bass",genre:["arcade"],tags:["approx"],gm:38,desc:"A thick bass layering two 50% square waves one octave apart.",layers:[{wave:"gamenotes::grdsSt1::octaveBassSquare",gain:1},{wave:"gamenotes::grdsSt1::octaveBassSquare",gain:1,semi:12}]}),s("gamenotes::grdsSt1::arpeggio","partials",g(m),o(0,1.05),.17,"arp","A bright arpeggio made with an eight-partial approximation of the descending pulse wave.",{genre:["arcade"],tags:["approx"],gm:81}),s("gamenotes::grdsSt1::tightBass","square",{},o(0,.6,.22),.185*10/12,"bass","A short, articulate bass using a 50% square wave with a fast decay.",{genre:["arcade"],tags:["approx"],gm:39}),s("gamenotes::grdsSt1::harmonyPulse25","pulse",{width:.25},o(.11,1.05),.185,"counter","25% pulse-wave harmony component"),s("gamenotes::grdsSt1::harmonySquare50","square",{},o(.11,1.45),.185*11/12,"counter","50% square-wave harmony component"),registerLayer("gamenotes::grdsSt1::harmony",{role:"counter",genre:["arcade"],tags:["approx"],gm:80,desc:"Harmony or countermelody combining 25% and 50% square waves one octave apart.",layers:[{wave:"gamenotes::grdsSt1::harmonyPulse25",gain:1},{wave:"gamenotes::grdsSt1::harmonySquare50",gain:1,semi:12}]})});

{
  const add=(name,patch,desc)=>{
    ANALOG_PATCHES[name]=patch;
    registerAnalog(name,{patch:name},{role:'perc',desc});
  };
  // 柔らかいシェイカー。シャープなノイズアタックを抑え、空気の成分だけを薄く残す。
  add('trial::jazzSoftShaker',{
    wave:'noise',octave:0,level:0.72,
    filter:{kind:'highpass',cutoff:4500,resonance:0.06,drive:0},
    amp:{attack:0.008,decay:0.09,sustain:0,release:0.03}
  },'Very soft analog shaker, lightly brushed noise');
  // ジャズのブラシ風。ノイズを弱めて少し丸める（PCMなし）。
  add('trial::brushTap',{
    wave:'noise',octave:0,level:0.65,
    filter:{kind:'bandpass',cutoff:2700,resonance:0.10,drive:0},
    amp:{attack:0.006,decay:0.10,sustain:0,release:0.035}
  },'Soft brushed snare-like noise tap');
  // 低く柔らかいタム。連打部分も主張しすぎない音量にする。
  add('trial::mutedTom',{
    wave:'sine',octave:-1,level:0.64,
    filter:{kind:'lowpass',cutoff:680,resonance:0.01,drive:0},
    amp:{attack:0.006,decay:0.13,sustain:0,release:0.045}
  },'Muted low analog tom for soft jazz accents');

}

{
  const META={dev:['wip'],tags:['approx']};
  const SUBBASS={dev:['wip'],tags:['approx','subbass']};
  function drum(name,parts,level,desc,extra={},knobs=null){
    registerAnalogPatch(name,{
      wave:'partials',octave:0,
      osc:{partials:parts.map(([ratio,lv,t60])=>({ratio,level:lv,attack:0.0005,t60}))},
      filter:{kind:'lowpass',cutoff:20000,resonance:0,drive:0},
      amp:{attack:0.0005,decay:4,sustain:1,release:0.03},
      level,...extra
    },{role:'perc',desc,genre:['drum'],...META,...(knobs?{knobs}:{})});
  }
  function noise(name,filter,amp,level,desc,role='perc',knobs=null){
    registerAnalogPatch(name,{
      wave:'noise',octave:0,
      filter:{resonance:0,drive:0,...filter},
      amp:{attack:0.0005,sustain:0,release:0.02,...amp},level
    },{role,desc,genre:['drum'],...META,...(knobs?{knobs}:{})});
  }
  function metal(name,filter,amp,level,knobs=null){
    registerAnalogPatch(name,{
      wave:'square',octave:0,
      filter:{resonance:0,drive:0,...filter},
      amp:{attack:0.0005,sustain:0,release:0.02,...amp},level
    },{role:'perc',desc:'One square wave of a metal stack. Use the stacked voices instead.',genre:['drum'],...META,...(knobs?{knobs}:{})});
  }
  const SIX=[205.3,304.4,369.6,522.7,540,800].map(f=>12*Math.log2(f/205.3));
  function stack(name,layers,desc,meta=META,knobs=null){
    registerLayer(name,{
      role:'perc',genre:['drum'],desc,...meta,...(knobs?{knobs}:{}),
      layers:layers.map(([wave,gain,semi])=>{
        const s=Math.round(semi||0);
        return {wave,gain,semi:s,cents:Math.round(((semi||0)-s)*100)};
      })
    });
  }
  const K={
    bdTone:{min:0,max:1,default:0.3,desc:'Brightness and loudness of the click at the front. 0 is a soft thud; 1 is a sharp, bright click.'},
    bdDecay:{min:0.1,max:4,default:0.9,unit:'s',desc:'Seconds for the low boom to fade by 60 dB. Short is a tight kick; 3 or more is the long 808 boom used as a sub bass.'},
    sdTone:{min:0,max:1,default:0.5,desc:'Balance of the two pitched shell tones. 0 leans on the low one, 1 on the high one.'},
    sdSnappy:{min:0,max:1,default:0.5,desc:'How much of the wire noise comes in. 1 is twice the default noise'},
    cyTone:{min:0,max:1,default:0.25,desc:'Where the metal is cut off below. 0 keeps more of the low clang; 1 leaves only a thin, high sizzle.'},
    cyDecay:{min:0.2,max:4,default:0.8,unit:'s',desc:'Seconds for the cymbal to fade by 60 dB.'},
    ohDecay:{min:0.05,max:1,default:0.4,unit:'s',desc:'Seconds for the open hi-hat to fade.'}
  };
  const spec=(...names)=>Object.fromEntries(names.map(([k,key])=>[k,K[key]]));
  const VOICES=[
    'tr808::bassDrum','tr808::bassDrumLong','tr808::snareDrum','tr808::snareDrumSnappy',
    'tr808::lowTom','tr808::midTom','tr808::hiTom',
    'tr808::lowConga','tr808::midConga','tr808::hiConga',
    'tr808::claves','tr808::rimShot','tr808::maracas','tr808::handclap','tr808::cowbell',
    'tr808::cymbal','tr808::cymbalLong','tr808::openHihat','tr808::closedHihat'
  ];
  // Bundled browser distribution doesn't expose the native registerAnalogPreset
  // helper. Register its equivalent, retaining all knob defaults and layer voices.
  function analogPreset(name,of,values,meta){
    // Use official patch registration with the same base patch/knobs and new defaults.
    const base=E.analog.ANALOG_PATCHES[of];
    const patch=structuredClone(base);
    const knobMap=of==='tr808::bassDrum'?spec(['tone','bdTone'],['decay','bdDecay']):spec(['tone','sdTone'],['snappy','sdSnappy']);
    const knobs=Object.fromEntries(Object.entries(knobMap).map(([key,k])=>[key,{...k,default:values[key]??k.default}]));
    // The base knobs' apply handlers are stored in registerAnalogPatch's internal map;
    // redeclare exactly the respective official handlers below.
    if(of==='tr808::bassDrum'){
      knobs.tone.apply=(p,v)=>{p.filter.cutoff=800+v*7200;p.level*=v/0.3;return p;};
      knobs.decay.apply=(p,v)=>{p.osc.partials[0].t60=v;return p;};
    }else{
      knobs.tone.apply=(p,v)=>{p.osc.partials[0].level=1.3-0.6*v;p.osc.partials[1].level=0.3+0.6*v;return p;};
      knobs.snappy.apply=(p,v)=>{p.level*=v/0.5;return p;};
    }
    // These presets are layers, not raw patch copies. Register as a clone of
    // original 2-layer voice with adjusted knob defaults instead.
    const wf=E.core['mml.js'].WAVEFORMS.find(x=>x.name===of);
    if(!wf?.layers)throw Error('TR-808 preset base missing '+of);
    registerLayer(name,{
      role:'perc',genre:['drum'],...meta,
      layers:wf.layers.map(m=>({wave:E.core['mml.js'].WAVEFORMS[m.wave].name,gain:m.gain,semi:m.semi,cents:m.cents,delay:m.delay,follow:m.follow,env:m.env})),
      knobs:Object.fromEntries(Object.entries(spec(...(of==='tr808::bassDrum'?[['tone','bdTone'],['decay','bdDecay']]:[['tone','sdTone'],['snappy','sdSnappy']]))).map(([k,x])=>[k,{...x,default:values[k]??x.default}]))
    });
  }
  registerAddon({
    id:'tr808',version:'0.2.0',
    desc:'Analog drum machine voices in the manner of the TR-808: sine resonators for the drums,'+
      ' filtered noise for the snare and shakers, stacked squares for the cowbell and the metal.'+
      ' The drums follow the written note, which stands in for the tuning knob; tone, decay and'+
      ' snappy are knobs passed when the voice is called, with presets for common settings.'+
      ' Set by ear and from descriptions, not measured from a machine.',
    needs:['analog'],engine:'>=0.41.0',voices:VOICES
  },()=>{
    drum('tr808::bassDrumBody',[[1,1,0.9],[1.5,0.35,0.03]],0.442,
      'Bass drum body on its own. Use bassDrum.',{},
      {decay:{...K.bdDecay,apply:(p,v)=>{p.osc.partials[0].t60=v;return p;}}});
    noise('tr808::bassDrumClick',{kind:'lowpass',cutoff:3000},{decay:0.004},0.442,
      'Bass drum click on its own. Use bassDrum.','perc',
      {tone:{...K.bdTone,apply:(p,v)=>{p.filter.cutoff=800+v*7200;p.level*=v/0.3;return p;}}});
    stack('tr808::bassDrum',[['tr808::bassDrumBody',1],['tr808::bassDrumClick',0.3]],
      'Bass drum. A low sine that dies away with a soft click on the front. The pitch follows the note; around o1 a sounds like the original.',
      SUBBASS,spec(['tone','bdTone'],['decay','bdDecay']));
    analogPreset('tr808::bassDrumLong','tr808::bassDrum',{decay:3},{desc:'Preset: Bass drum, decay 3s.',...SUBBASS});
    drum('tr808::snareBody',[[1,1,0.12],[1.8,0.6,0.08]],0.285,
      'Snare body on its own. Use snareDrum.',{},
      {tone:{...K.sdTone,apply:(p,v)=>{p.osc.partials[0].level=1.3-0.6*v;p.osc.partials[1].level=0.3+0.6*v;return p;}}});
    noise('tr808::snareNoise',{kind:'highpass',cutoff:1800},{decay:0.12},0.285,
      'Snare wires on their own. Use snareDrum.','perc',
      {snappy:{...K.sdSnappy,apply:(p,v)=>{p.level*=v/0.5;return p;}}});
    stack('tr808::snareDrum',[['tr808::snareBody',1],['tr808::snareNoise',0.5]],
      'Snare drum. Two short sines for the shell under a hiss of high noise for the wires. Around o3 f.',
      META,spec(['tone','sdTone'],['snappy','sdSnappy']));
    analogPreset('tr808::snareDrumSnappy','tr808::snareDrum',{snappy:1},{desc:'Preset: snare drum snappy 1'});
    for(const [n,d,t,note,cnote,tl,cl] of [
      ['low','Low',0.5,'o2 a','o3 a',0.531,0.519],
      ['mid','Mid',0.42,'o3 d','o4 d',0.519,0.55],
      ['hi','High',0.35,'o3 g','o4 g',0.507,0.543]
    ]){
      drum(`tr808::${n}Tom`,[[1,1,t],[2.4,0.1,0.05]],tl,
        `${d} tom. A sine that rings for a while with a faint overtone. The pitch follows the note; around ${note}.`);
      drum(`tr808::${n}Conga`,[[1,1,t*0.45]],cl,
        `${d} conga. A short, clean sine. The pitch follows the note; around ${cnote}.`);
    }
    drum('tr808::claves',[[1,1,0.05]],0.589,'Claves. A very short, high sine like two sticks of wood. Around o7 d.');
    drum('tr808::rimBody',[[1,1,0.025],[2.2,0.5,0.02]],0.38,'Rim shot body on its own. Use rimShot.');
    noise('tr808::rimClick',{kind:'highpass',cutoff:4000},{decay:0.006},0.38,'Rim shot click on its own. Use rimShot.');
    stack('tr808::rimShot',[['tr808::rimBody',1],['tr808::rimClick',0.5]],
      'Rim shot. A very short knock with a crack on top. Around o6 a.');
    noise('tr808::maracas',{kind:'highpass',cutoff:5000},{attack:0.003,decay:0.03},0.501,
      'Maracas. A short shake of high noise.');
    registerAnalogPatch('tr808::handclap',{
      wave:'noise',octave:0,
      filter:{kind:'bandpass',cutoff:1100,resonance:0.35,drive:0},
      amp:{attack:0.0005,decay:0.006,sustain:0,release:0.08,repeat:4,gap:0.011,tail:0.3,tailDecay:0.15},
      level:1.259
    },{role:'perc',desc:'Hand clap. Band-passed noise struck four times about 11 ms apart, as if a few people clapped a little out of step, then a short tail like the ring of a room.',genre:['drum'],...META});
    metal('tr808::cowbellSquare',{kind:'bandpass',cutoff:2600,resonance:0.2},{decay:0.12},0.437);
    stack('tr808::cowbell',[['tr808::cowbellSquare',1],['tr808::cowbellSquare',1,SIX[5]-SIX[4]]],
      'Cowbell. Two square waves a fifth or so apart, band-passed. Around o5 c+ sounds like the original.');
    metal('tr808::cymbalSquare',{kind:'highpass',cutoff:3500,resonance:0.3},{decay:0.8},0.447,{
      tone:{...K.cyTone,apply:(p,v)=>{p.filter.cutoff=2000+v*6000;return p;}},
      decay:{...K.cyDecay,apply:(p,v)=>{p.amp.decay=v;return p;}}
    });
    metal('tr808::hatSquare',{kind:'highpass',cutoff:7000,resonance:0.3},{decay:0.05},1.202);
    metal('tr808::hatSquareOpen',{kind:'highpass',cutoff:7000,resonance:0.3},{decay:0.4},0.902,{
      decay:{...K.ohDecay,apply:(p,v)=>{p.amp.decay=v;return p;}}
    });
    const six=square=>SIX.map(semi=>[square,1,semi]);
    stack('tr808::cymbal',six('tr808::cymbalSquare'),
      'Cymbal. Six square waves at clashing pitches, only the highs let through. Around o3 g+.',
      META,spec(['tone','cyTone'],['decay','cyDecay']));
    // Native registerAnalogPreset for layers, equivalent clone with decay default.
    const wf=E.core['mml.js'].WAVEFORMS.find(x=>x.name==='tr808::cymbal');
    registerLayer('tr808::cymbalLong',{
      role:'perc',genre:['drum'],dev:['wip'],tags:['approx'],desc:'Preset: cymbal decay 2.5s.',
      layers:wf.layers.map(m=>({wave:E.core['mml.js'].WAVEFORMS[m.wave].name,gain:m.gain,semi:m.semi,cents:m.cents,delay:m.delay,follow:m.follow,env:m.env})),
      knobs:{tone:{...K.cyTone},decay:{...K.cyDecay,default:2.5}}
    });
    stack('tr808::openHihat',six('tr808::hatSquareOpen'),
      'Open hi-hat. The same six squares as the cymbal, higher and shorter. Around o3 g+.',
      META,spec(['decay','ohDecay']));
    stack('tr808::closedHihat',six('tr808::hatSquare'),
      'Closed hi-hat. The six squares cut very short. Around o3 g+.');
  });
  const addon=E.listAddons?.().find(x=>x.id==='tr808');
  window.TR808_ADDON_READY=Boolean(addon&&VOICES.every(x=>addon.voices?.includes(x)));
  window.TR808_HANDCLAP_READY=window.TR808_ADDON_READY;
  if(!window.TR808_ADDON_READY)throw Error('TR-808 v0.2.0: complete voice set not registered');
}