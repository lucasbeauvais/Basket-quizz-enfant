/* ============================================================
   BRUITAGES synthétisés (Web Audio) : aucun fichier son à télécharger.
   Sfx.muted est mémorisé dans le navigateur.
   ============================================================ */
var Sfx = (function(){
  var ctx=null, muted=false;
  try{ muted = localStorage.getItem('quiz_nba_muted')==='1'; }catch(e){}
  function ac(){
    if(muted)return null;
    if(!ctx){ var C=window.AudioContext||window.webkitAudioContext; if(!C)return null; ctx=new C(); }
    if(ctx.state==='suspended')ctx.resume();
    return ctx;
  }
  function tone(freq,dur,type,vol,slideTo,delay){
    var c=ac(); if(!c)return;
    var t=c.currentTime+(delay||0), o=c.createOscillator(), g=c.createGain();
    o.type=type||'sine'; o.frequency.setValueAtTime(freq,t);
    if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||0.2,t+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.05);
  }
  function noise(dur,vol,filterFreq,type,delay,q){
    var c=ac(); if(!c)return;
    var t=c.currentTime+(delay||0), len=Math.floor(c.sampleRate*dur), buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<len;i++)d[i]=Math.random()*2-1;
    var src=c.createBufferSource(); src.buffer=buf;
    var f=c.createBiquadFilter(); f.type=type||'bandpass'; f.frequency.value=filterFreq||1000; f.Q.value=q||1;
    var g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||0.2,t+dur*0.25); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(t); src.stop(t+dur+0.05);
  }
  return {
    isMuted:function(){return muted;},
    toggle:function(){ muted=!muted; try{localStorage.setItem('quiz_nba_muted',muted?'1':'0');}catch(e){} return muted; },
    swish:function(){ noise(0.35,0.35,3200,'highpass',0,0.7); },
    rim:function(){ tone(520,0.18,'triangle',0.18,380); },
    bounce:function(){ tone(110,0.12,'sine',0.35,60); },
    pop:function(){ tone(660,0.09,'square',0.08,990); },
    good:function(){ tone(523,0.12,'triangle',0.2); tone(659,0.12,'triangle',0.2,null,0.1); tone(784,0.22,'triangle',0.22,null,0.2); },
    bad:function(){ tone(196,0.35,'sawtooth',0.12,140); },
    buzzer:function(){ tone(140,0.6,'sawtooth',0.16); tone(147,0.6,'square',0.08); },
    whistle:function(){ tone(2600,0.25,'sine',0.12,2900); tone(2600,0.2,'sine',0.1,2900,0.3); },
    cheer:function(){ noise(1.6,0.22,900,'bandpass',0,0.6); noise(1.2,0.12,2200,'bandpass',0.15,0.8); },
    boom:function(){ tone(90,0.6,'sine',0.5,35); noise(0.5,0.35,400,'lowpass'); },
    horn:function(){ tone(233,0.5,'sawtooth',0.12); tone(294,0.5,'sawtooth',0.1); tone(349,0.7,'sawtooth',0.1,null,0.05); },
    whoosh:function(){ noise(0.3,0.15,700,'bandpass',0,0.5); }
  };
})();
