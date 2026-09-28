/* ============================================================
   GRANDES ANIMATIONS EN OVERLAY (GSAP + canvas-confetti)
   - shot     : dunk ou tir à 3 points (chaque bonne réponse)
   - foam     : série de 3 -> gants en mousse + explosion
   - fire     : série de 5 -> ballon en feu, points x2
   - wrong    : tampon "RATÉ"
   - flyPoints: le "+3" qui s'envole jusqu'au score
   ============================================================ */
var FX = (function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasConf = typeof window.confetti === 'function';
  var COLORS = ['#fdb927','#552583','#e8752a','#ffffff','#c8102e','#1d428a'];
  var FIRE = ['#fdb927','#ff9f1c','#e8752a','#c8102e','#fff3b0'];

  function stage(cls){
    var el=document.createElement('div'); el.className='fxstage '+(cls||''); document.body.appendChild(el); return el;
  }
  function kill(el){ if(el&&el.parentNode)el.parentNode.removeChild(el); }
  function conf(opts){ if(hasConf&&!reduce)window.confetti(opts); }
  function confAt(x,y,opts){
    opts=opts||{}; opts.origin={x:x/window.innerWidth,y:y/window.innerHeight};
    if(!opts.colors)opts.colors=COLORS; if(!opts.zIndex)opts.zIndex=90; conf(opts);
  }
  /* toucher l'écran = passer l'animation */
  function skippable(el,tl){ el.addEventListener('pointerdown',function(){ tl.progress(1); }); }

  /* ---------- 1. DUNK / TIR À 3 POINTS ---------- */
  function shot(kind,player,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-dim');
    el.innerHTML='<div class="fxpanel">'+(kind==='three'?threeSVG(player):dunkSVG(player,kind==='mega'))+'</div>';
    var panel=el.firstChild, hitAt=(kind==='three')?1.35:0.9;
    var tl=gsap.timeline({onComplete:function(){kill(el);done&&done();}});
    Sfx.whoosh();
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.15})
      .fromTo(panel,{scale:.4,y:80,rotation:-6},{scale:1,y:0,rotation:0,duration:.45,ease:'back.out(1.8)'},0)
      .call(function(){
        var r=panel.getBoundingClientRect();
        confAt(r.left+r.width*0.75, r.top+r.height*0.33,{particleCount:70,spread:80,startVelocity:32,scalar:.9});
        Sfx.swish(); setTimeout(Sfx.cheer,120);
      },null,hitAt)
      .to(panel,{scale:1.06,duration:.12,yoyo:true,repeat:1},hitAt+0.05)
      .to(panel,{scale:.6,y:-60,opacity:0,duration:.3,ease:'power2.in'},hitAt+0.75)
      .to(el,{opacity:0,duration:.2},'-=0.1');
    skippable(el,tl);
  }

  /* ---------- 2. SÉRIE DE 3 : GANTS EN MOUSSE + EXPLOSION ---------- */
  function foam(streakN,color,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-arena');
    el.innerHTML=
      '<div class="fx-flash"></div>'+
      '<div class="fx-boom">'+explosionHTML()+'</div>'+
      '<div class="fx-finger l">'+foamFingerHTML(color)+'</div>'+
      '<div class="fx-finger r">'+foamFingerHTML(color)+'</div>'+
      '<div class="fx-title"><b>SÉRIE x'+streakN+' !</b><span>'+streakN+' bonnes réponses d\'affilée</span></div>';
    var q=function(s){return el.querySelector(s);};
    var tl=gsap.timeline({onComplete:function(){kill(el);done&&done();}});
    Sfx.boom(); setTimeout(Sfx.horn,250); setTimeout(Sfx.cheer,400);
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.12})
      .fromTo(q('.fx-flash'),{opacity:.95},{opacity:0,duration:.5,ease:'power2.out'},0)
      .fromTo(q('.fx-boom'),{scale:0,rotation:-30},{scale:1.15,rotation:20,duration:.55,ease:'back.out(2.2)'},0.05)
      .to(q('.fx-boom'),{rotation:'+=60',scale:1,duration:2.2,ease:'none'},0.6)
      .fromTo(q('.fx-finger.l'),{yPercent:130,rotation:-40},{yPercent:0,rotation:-12,duration:.6,ease:'back.out(1.6)'},0.2)
      .fromTo(q('.fx-finger.r'),{yPercent:130,rotation:40},{yPercent:0,rotation:12,duration:.6,ease:'back.out(1.6)'},0.3)
      .to(q('.fx-finger.l'),{rotation:-26,y:-14,duration:.18,yoyo:true,repeat:7,ease:'sine.inOut'},0.85)
      .to(q('.fx-finger.r'),{rotation:26,y:-14,duration:.18,yoyo:true,repeat:7,ease:'sine.inOut'},0.9)
      .fromTo(q('.fx-title'),{scale:0,rotation:-15},{scale:1,rotation:-4,duration:.8,ease:'elastic.out(1,.45)'},0.35)
      .call(function(){
        confAt(0,window.innerHeight*0.8,{particleCount:120,angle:60,spread:60,startVelocity:70});
        confAt(window.innerWidth,window.innerHeight*0.8,{particleCount:120,angle:120,spread:60,startVelocity:70});
      },null,0.4)
      .call(function(){ confAt(window.innerWidth/2,window.innerHeight*0.42,{particleCount:90,spread:360,startVelocity:38,shapes:['star'],colors:['#fdb927','#fff3b0']}); },null,1.1)
      .to([q('.fx-finger.l'),q('.fx-finger.r')],{yPercent:140,duration:.35,ease:'power2.in'},2.5)
      .to([q('.fx-boom'),q('.fx-title')],{scale:0,opacity:0,duration:.3,ease:'power2.in'},2.55)
      .to(el,{opacity:0,duration:.2},2.8);
    skippable(el,tl);
  }

  /* ---------- 3. SÉRIE DE 5 : EN FEU ---------- */
  function fire(streakN,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-fire');
    el.innerHTML='<div class="fx-flash hot"></div><div class="fx-fireball">'+fireballHTML()+'</div>'+
      '<div class="fx-title fire"><b>EN FEU !</b><span>Série x'+streakN+' : tes points comptent double !</span></div>';
    var q=function(s){return el.querySelector(s);};
    var card=document.querySelector('.card');
    var tl=gsap.timeline({onComplete:function(){kill(el);if(card)gsap.set(card,{x:0});done&&done();}});
    Sfx.boom(); setTimeout(Sfx.cheer,200); setTimeout(Sfx.horn,500);
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.12})
      .fromTo(q('.fx-flash'),{opacity:1},{opacity:0,duration:.6},0)
      .fromTo(q('.fx-fireball'),{scale:.1,y:300,rotation:-200},{scale:1,y:0,rotation:0,duration:.8,ease:'back.out(1.4)'},0)
      .to(q('.fx-fireball'),{scale:1.08,duration:.2,yoyo:true,repeat:7,ease:'sine.inOut'},0.8)
      .fromTo(q('.fx-title'),{scale:3,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power4.in'},0.5)
      .call(function(){ if(card)gsap.fromTo(card,{x:-10},{x:10,duration:.05,repeat:7,yoyo:true,onComplete:function(){gsap.set(card,{x:0});}}); },null,0.9)
      .call(function(){ var n=0,iv=setInterval(function(){ confAt(Math.random()*window.innerWidth,window.innerHeight,{particleCount:40,angle:90,spread:40,startVelocity:55,colors:FIRE,gravity:1.2}); if(++n>5)clearInterval(iv); },180); },null,0.6)
      .to([q('.fx-fireball'),q('.fx-title')],{scale:0,opacity:0,duration:.35,ease:'power2.in'},2.5)
      .to(el,{opacity:0,duration:.2},2.75);
    skippable(el,tl);
  }

  /* ---------- 4. MAUVAISE RÉPONSE ---------- */
  function wrong(){
    Sfx.bad();
    if(reduce||!hasGsap)return;
    var el=stage('fx-pass');
    el.innerHTML='<div class="fx-stamp">RATÉ !</div>';
    var s=el.firstChild;
    gsap.timeline({onComplete:function(){kill(el);}})
      .fromTo(s,{scale:3.5,opacity:0,rotation:-25},{scale:1,opacity:1,rotation:-12,duration:.28,ease:'power4.in'})
      .to(s,{opacity:0,y:-30,duration:.35,delay:.45});
  }

  /* ---------- 5. LE "+3" QUI VOLE JUSQU'AU SCORE ---------- */
  function flyPoints(text,targetEl,onArrive){
    if(reduce||!hasGsap||!targetEl){ onArrive&&onArrive(); return; }
    var el=stage('fx-pass'); el.innerHTML='<div class="fx-pts">'+text+'</div>';
    var p=el.firstChild, t=targetEl.getBoundingClientRect();
    var cx=window.innerWidth/2, cy=window.innerHeight*0.42;
    gsap.set(p,{x:cx,y:cy,xPercent:-50,yPercent:-50});
    Sfx.pop();
    gsap.timeline({onComplete:function(){kill(el);}})
      .fromTo(p,{scale:0,rotation:-20},{scale:1.5,rotation:6,duration:.45,ease:'back.out(3)'})
      .to(p,{x:t.left+t.width/2,y:t.top+t.height/2,scale:.4,rotation:0,duration:.55,ease:'power3.in'},'+=0.15')
      .call(function(){ onArrive&&onArrive(); gsap.fromTo(targetEl,{scale:1.8},{scale:1,duration:.5,ease:'elastic.out(1,.4)'}); confAt(t.left+t.width/2,t.top+t.height/2,{particleCount:25,spread:70,startVelocity:18,scalar:.6}); })
      .to(p,{opacity:0,duration:.1});
  }

  /* ---------- 6. FEU D'ARTIFICE (sans-faute) ---------- */
  function fireworks(ms){
    if(reduce||!hasConf)return;
    var end=Date.now()+(ms||2500);
    (function frame(){
      confAt(Math.random()*window.innerWidth,Math.random()*window.innerHeight*0.5,{particleCount:50,spread:360,startVelocity:28,ticks:70,gravity:.8});
      if(Date.now()<end)setTimeout(frame,260);
    })();
    Sfx.cheer();
  }

  return {shot:shot,foam:foam,fire:fire,wrong:wrong,flyPoints:flyPoints,fireworks:fireworks,confAt:confAt,reduce:reduce};
})();
