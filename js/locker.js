/* ============================================================
   MON VESTIAIRE : profil + joueurs + fonds d'écran + remise à zéro
   Les fonds se débloquent avec les points en carrière.
   ============================================================ */
var BACKGROUNDS=[
  {id:'nuit',   name:'Salle de nuit',  need:0,
   css:'radial-gradient(circle at 15% -10%,#6a2fa3 0%,rgba(106,47,163,0) 45%),radial-gradient(circle at 95% 110%,#c95e14 0%,rgba(201,94,20,0) 40%),#0e1233'},
  {id:'violet', name:'Violet et or',   need:50,
   css:'radial-gradient(circle at 20% 0%,#fdb927 0%,rgba(253,185,39,0) 35%),linear-gradient(160deg,#552583 0%,#2a0f4a 100%)'},
  {id:'parquet',name:'Parquet',        need:120,
   css:'repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 46px),linear-gradient(180deg,#d9a15a 0%,#a8642a 100%)'},
  {id:'street', name:'Playground',     need:200,
   css:'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0 10px,transparent 10px 20px),radial-gradient(circle at 50% 120%,#e8752a 0%,rgba(232,117,42,0) 40%),linear-gradient(180deg,#3a4556 0%,#1d242f 100%)'},
  {id:'ocean',  name:'Océan',          need:300,
   css:'radial-gradient(circle at 80% 0%,#4fd1c5 0%,rgba(79,209,197,0) 40%),linear-gradient(180deg,#0a4d8c 0%,#062347 100%)'},
  {id:'feu',    name:'En feu',         need:420,
   css:'radial-gradient(circle at 50% 115%,#fdb927 0%,#ff9f1c 18%,#c8102e 45%,rgba(200,16,46,0) 70%),linear-gradient(180deg,#2b0505 0%,#5a0b0b 100%)'},
  {id:'galaxie',name:'Galaxie',        need:560,
   css:'radial-gradient(1.5px 1.5px at 20% 30%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 70% 20%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 40% 70%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 85% 60%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 10% 85%,#fff 50%,transparent 51%),radial-gradient(circle at 30% 20%,#6a2fa3 0%,rgba(106,47,163,0) 45%),radial-gradient(circle at 80% 80%,#1d6fd6 0%,rgba(29,111,214,0) 45%),#05061a',
   size:'220px 220px,260px 260px,300px 300px,240px 240px,200px 200px,auto,auto,auto'},
  {id:'salle',  name:'Soir de finale', need:750, img:'minigame/court'},
  {id:'or',     name:'Légende dorée',  need:1000,
   css:'radial-gradient(circle at 30% 10%,#fff3b0 0%,rgba(255,243,176,0) 35%),linear-gradient(160deg,#fdb927 0%,#c99100 55%,#7a5500 100%)'}
];
function bgById(id){for(var i=0;i<BACKGROUNDS.length;i++)if(BACKGROUNDS[i].id===id)return BACKGROUNDS[i];return BACKGROUNDS[0];}
function bgUnlocked(b){return (profile.careerPts||0)>=b.need;}
function bgCss(b){
  if(Assets.has('bg/'+b.id))return 'linear-gradient(rgba(8,10,30,.15),rgba(8,10,30,.15)),url('+"'"+Assets.url('bg/'+b.id)+"'"+') center/cover';
  if(b.img&&Assets.has(b.img))return 'linear-gradient(rgba(8,10,30,.35),rgba(8,10,30,.35)),url('+"'"+Assets.url(b.img)+"'"+') center/cover';
  if(b.img)return BACKGROUNDS[0].css;
  return b.css;
}
function applyBg(){
  var b=bgById(profile&&profile.bg);if(profile&&!bgUnlocked(b))b=BACKGROUNDS[0];
  document.body.style.background=bgCss(b);
  document.body.style.backgroundSize=Assets.has('bg/'+b.id)?'':(b.size||'');
  document.body.style.backgroundAttachment='fixed';
}
/* ============================================================
   BALLONS DE COULEUR : un par badge sifflet de l'école des règles
   ch = id du chapitre qui le débloque (null = dès le début)
   ============================================================ */
var BALLS=[
  {id:'classic', name:'Classique',     c:'#e8752a', l:'#6b2f08', ch:null},
  {id:'match',   name:'Émeraude',      c:'#2e9e5b', l:'#0b3d22', ch:'match'},
  {id:'points',  name:'Or massif',     c:'#fdb927', l:'#8a6420', ch:'points'},
  {id:'ball',    name:'Bleu éclair',   c:'#1f6feb', l:'#ffffff', ch:'ball'},
  {id:'clock',   name:'Violet chrono', c:'#8b5cf6', l:'#2a0f4a', ch:'clock'},
  {id:'fouls',   name:'Rouge feu',     c:'#c8102e', l:'#fdb927', ch:'fouls'},
  {id:'mini',    name:'Turquoise',     c:'#0ea5a4', l:'#ffffff', ch:'mini'},
  {id:'signals', name:'Arbitre',       c:'#f4f4f4', l:'#1b1b1b', ch:'signals'},
  {id:'spirit',  name:'Arc-en-ciel',   c:'rainbow', l:'#ffffff', ch:'spirit'},
  /* ballons de STYLE (images assets/img/balls/<id>.webp), débloqués avec les étoiles des quiz.
     Tant que l'image n'existe pas, le ballon n'apparaît pas. */
  {id:'etoiles', name:'Étoiles',  img:'balls/etoiles', stars:2},
  {id:'flammes', name:'Flammes',  img:'balls/flammes', stars:4},
  {id:'galaxie', name:'Galaxie',  img:'balls/galaxie', stars:6},
  {id:'leopard', name:'Léopard',  img:'balls/leopard', stars:8},
  {id:'retro',   name:'Rétro',    img:'balls/retro',   stars:10},
  {id:'neon',    name:'Néon',     img:'balls/neon',    stars:12},
  {id:'diamant', name:'Diamant',  img:'balls/diamant', stars:14},
  {id:'glace',   name:'Glace',    img:'balls/glace',   stars:15}
];
function ballById(id){for(var i=0;i<BALLS.length;i++)if(BALLS[i].id===id)return BALLS[i];return BALLS[0];}
function ballForChapter(chId){for(var i=0;i<BALLS.length;i++)if(BALLS[i].ch===chId)return BALLS[i];return null;}
function ballAvailable(b){return !b.img||Assets.has(b.img);}
function ballUnlocked(b){
  if(!ballAvailable(b))return false;
  if(b.stars)return !!profile&&totalStars()>=b.stars;
  return !b.ch||!!(profile&&profile.rules&&profile.rules.badges&&profile.rules.badges[b.ch]);}
/* ballons de style débloqués entre deux totaux d'étoiles (pour l'écran de résultat) */
function ballsUnlockedByStars(before,after){var l=[];for(var i=0;i<BALLS.length;i++){var b=BALLS[i];if(b.stars&&ballAvailable(b)&&b.stars>before&&b.stars<=after)l.push(b);}return l;}
/* ballon utilisé partout (animations, mini-jeu, illustrations) */
function ballSkin(){if(!profile)return BALLS[0];var b=ballById(profile.ballSkin);return ballUnlocked(b)?b:BALLS[0];}
function ballIcon(b,size){size=size||44;var r=size/2-2;return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" aria-hidden="true">'+ballAt(size/2,size/2,r,b)+'</svg>';}
function chapterNumber(chId){for(var i=0;i<RULE_CHAPTERS.length;i++)if(RULE_CHAPTERS[i].id===chId)return i+1;return 0;}
function ballGrid(){var cur=ballSkin().id,h='',styles='';
  for(var i=0;i<BALLS.length;i++){var b=BALLS[i];if(!ballAvailable(b))continue;var u=ballUnlocked(b),sel=(b.id===cur);
    var cell=u?'<button class="ballopt'+(sel?' sel':'')+'" data-ball="'+b.id+'">'+ballIcon(b,46)+'<b>'+b.name+'</b>'+(sel?'<small>Choisi</small>':'')+'</button>'
        :'<div class="ballopt locked">'+ballIcon(b,46)+'<b>'+b.name+'</b><small class="bglock">'+lockSVG()+' '+(b.stars?b.stars+' ★':'Chapitre '+chapterNumber(b.ch))+'</small></div>';
    if(b.stars)styles+=cell;else h+=cell;}
  return '<div class="ballgrid">'+h+'</div>'+
    (styles?'<div class="sectitle" style="margin-top:14px">Ballons de style <small>(se débloquent avec les étoiles des quiz)</small></div><div class="ballgrid">'+styles+'</div>':'');}
/* révélation d'un nouveau ballon (après un badge sifflet) */
function showBallUnlock(b,after){
  if(!b){after&&after();return;}
  var el=document.createElement('div');el.className='bgreveal ballreveal';
  el.setAttribute('style',bgStyle(null,.55));
  el.innerHTML='<div class="br-ball">'+ballIcon(b,180)+'</div><div class="bgr-box"><div class="bgr-kicker">'+(b.stars?'Tes étoiles débloquent un nouveau ballon !':'Badge sifflet = nouveau ballon !')+'</div><div class="bgr-name">'+b.name+'</div>'+
    '<button class="btn big shootbtn" id="ballequip">Je l\'utilise !</button><button class="btn ghost big bgr-later" id="balllater">Plus tard</button></div>';
  document.body.appendChild(el);Sfx.horn();FX.fireworks(1500);
  if(window.gsap&&!reduceMotion){gsap.from(el,{opacity:0,duration:.35});gsap.fromTo(el.querySelector('.br-ball'),{scale:0,rotation:-540},{scale:1,rotation:0,duration:1.1,ease:'back.out(1.6)'});gsap.to(el.querySelector('.br-ball'),{y:-18,duration:.45,yoyo:true,repeat:-1,ease:'sine.inOut',delay:1.1});gsap.from(el.querySelector('.bgr-box'),{y:60,opacity:0,duration:.5,delay:.5,ease:'back.out(1.8)'});}
  function close(){if(window.gsap)gsap.killTweensOf(el.querySelector('.br-ball'));if(el.parentNode)el.parentNode.removeChild(el);after&&after();}
  el.querySelector('#ballequip').onclick=function(){profile.ballSkin=b.id;persist();Sfx.pop();close();};
  el.querySelector('#balllater').onclick=close;
}

/* fond actuel, pour habiller un élément (carte joueur, mini-jeu, révélation) */
function currentBg(){var b=bgById(profile&&profile.bg);if(profile&&!bgUnlocked(b))b=BACKGROUNDS[0];return b;}
function bgStyle(b,shade){b=b||currentBg();var s=bgCss(b);
  if(shade)s='linear-gradient(rgba(8,10,30,'+shade+'),rgba(8,10,30,'+shade+')),'+s;
  /* cadré sur le bas de l'image : c'est là que les fonds ont leurs détails (flammes, ballon, trophées) */
  return 'background:'+s+';'+(b.size&&!Assets.has('bg/'+b.id)?'background-size:'+b.size+';':'')+(Assets.has('bg/'+b.id)?'background-position:center 85%;':'');}
/* écrans de fête : la carte devient plus transparente pour montrer le fond */
function seeBg(on){var c=document.querySelector('.card');if(c)c.classList.toggle('see-bg',!!on);}
/* fonds débloqués entre deux totaux de points (pour l'écran de résultat) */
function bgsUnlockedBetween(before,after){var l=[];for(var i=0;i<BACKGROUNDS.length;i++){var n=BACKGROUNDS[i].need;if(n>before&&n<=after)l.push(BACKGROUNDS[i]);}return l;}
function bgNames(list){return list.map(function(b){return b.name;}).join(', ');}
/* révélation plein écran d'un nouveau fond, avec bouton pour l'équiper tout de suite */
function showBgUnlock(list,after){
  if(!list||!list.length){after&&after();return;}
  var b=list[list.length-1],el=document.createElement('div');el.className='bgreveal';
  el.setAttribute('style',bgStyle(b,.15));
  el.innerHTML='<div class="bgr-box"><div class="bgr-kicker">Nouveau fond d\'écran débloqué !</div><div class="bgr-name">'+b.name+'</div>'+
    '<button class="btn big shootbtn" id="bgequip">Je l\'équipe !</button><button class="btn ghost big bgr-later" id="bglater">Plus tard</button></div>';
  document.body.appendChild(el);Sfx.horn();FX.fireworks(1500);
  if(window.gsap&&!reduceMotion){gsap.from(el,{opacity:0,duration:.4});gsap.from(el.querySelector('.bgr-box'),{y:60,scale:.8,opacity:0,duration:.6,delay:.3,ease:'back.out(1.8)'});}
  function close(){if(el.parentNode)el.parentNode.removeChild(el);after&&after();}
  el.querySelector('#bgequip').onclick=function(){profile.bg=b.id;persist();applyBg();Sfx.pop();close();};
  el.querySelector('#bglater').onclick=close;
}

/* ===== ÉCRAN MON VESTIAIRE ===== */
function screenLocker(){hideProg();
  var p=playerById(profile.avatar),pts=profile.careerPts||0;
  var bgs='';for(var i=0;i<BACKGROUNDS.length;i++){var b=BACKGROUNDS[i],u=bgUnlocked(b),sel=(b.id===(profile.bg||'nuit'));
    var sw='<span class="bgsw" style="background:'+bgCss(b).replace(/"/g,'&quot;')+(b.size&&!Assets.has('bg/'+b.id)?';background-size:'+b.size:'')+'"></span>';
    bgs+=u?'<button class="bgopt'+(sel?' sel':'')+'" data-bg="'+b.id+'">'+sw+'<b>'+b.name+'</b>'+(sel?'<small>Choisi</small>':'')+'</button>'
          :'<div class="bgopt locked">'+sw+'<b>'+b.name+'</b><small class="bglock">'+lockSVG()+' '+b.need+' pts</small></div>';}
  var nextBg=null;for(var j=0;j<BACKGROUNDS.length;j++)if(!bgUnlocked(BACKGROUNDS[j])){nextBg=BACKGROUNDS[j];break;}
  view.innerHTML=
    '<button class="quitbtn" id="lback"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Accueil</button>'+
    '<h1 class="h1">Mon vestiaire</h1>'+
    '<div class="lockercard">'+avatarHTML(profile.avatar,84)+
      '<div class="lk-id"><label class="lbl" for="lname">Mon prénom</label>'+
      '<div class="lk-namerow"><input id="lname" class="nameinput" maxlength="14" value="'+esc(profile.name)+'"><button class="btn" id="lsave">OK</button></div>'+
      '<span class="lk-rank">'+p.name+' &middot; '+rankName()+'</span></div></div>'+
    '<div class="lk-stats">'+
      '<div><b>'+pts+'</b><span>points en carrière</span></div>'+
      '<div><b>'+totalStars()+'/'+maxStars()+'</b><span>étoiles</span></div>'+
      '<div><b>'+rulesBadgeCount()+'/'+RULE_CHAPTERS.length+'</b><span>badges d\'arbitre</span></div>'+
      '<div><b>'+(profile.played||0)+'</b><span>matchs joués</span></div></div>'+
    '<div class="sectitle">Mon joueur <small>(se débloquent avec les étoiles)</small></div>'+
    playerGrid(profile.avatar)+
    '<div class="sectitle" style="margin-top:18px">Mon ballon <small>(1 ballon par badge sifflet de l\'école des règles)</small></div>'+
    ballGrid()+
    '<div class="sectitle" style="margin-top:18px">Mon fond d\'écran <small>(se débloquent avec les points)</small></div>'+
    (nextBg?'<p class="hintnote left">Prochain fond : <b>'+nextBg.name+'</b> à '+nextBg.need+' points (encore '+(nextBg.need-pts)+').</p>':'<p class="hintnote left">Tous les fonds sont débloqués, bravo !</p>')+
    '<div class="bggrid">'+bgs+'</div>'+
    '<div class="sectitle" style="margin-top:22px">Continuer sur un autre téléphone</div>'+
    '<div class="tfbox"><p>Tu joues sur le téléphone de papa et tu veux continuer sur celui de maman ? Crée un lien ou un QR code : ta partie y sera copiée.</p>'+
    '<button class="btn big shootbtn" id="ltransfer">Transférer ma partie</button>'+
    '<button class="linkbtn" id="limport">J\'ai un lien de partie à récupérer</button></div>'+
    '<div class="sectitle" style="margin-top:22px">Recommencer à zéro</div>'+
    '<div class="resetbox"><p>Efface les étoiles, les points, les records, les badges d\'arbitre et le diplôme pour rejouer toutes les questions depuis le début. Ton prénom est gardé.</p>'+
    '<button class="btn ghost dangerline" id="lreset">Réinitialiser mon compte</button></div>';
  popIn('.mascot,.bgopt');
  document.getElementById('lback').onclick=screenHome;
  document.getElementById('lsave').onclick=function(){var el=document.getElementById('lname'),v=(el.value||'').trim();if(!v){el.focus();el.classList.add('shake');setTimeout(function(){el.classList.remove('shake');},450);return;}profile.name=v;persist();Sfx.pop();this.textContent='✓';var t=this;setTimeout(function(){t.textContent='OK';},1200);};
  var ms=view.querySelectorAll('.mascot[data-av]');for(var k=0;k<ms.length;k++){ms[k].onclick=function(){Sfx.pop();profile.avatar=this.getAttribute('data-av');persist();var y=window.scrollY;screenLocker();window.scrollTo(0,y);};}
  var bs=view.querySelectorAll('.bgopt[data-bg]');for(var m=0;m<bs.length;m++){bs[m].onclick=function(){Sfx.pop();profile.bg=this.getAttribute('data-bg');persist();applyBg();var y=window.scrollY;screenLocker();window.scrollTo(0,y);};}
  var bl=view.querySelectorAll('.ballopt[data-ball]');for(var q=0;q<bl.length;q++){bl[q].onclick=function(){Sfx.pop();profile.ballSkin=this.getAttribute('data-ball');persist();var y=window.scrollY;screenLocker();window.scrollTo(0,y);};}
  document.getElementById('lreset').onclick=askReset;
  document.getElementById('ltransfer').onclick=Transfer.openShare;
  document.getElementById('limport').onclick=Transfer.openImport;
}
function askReset(){
  if(document.querySelector('.quitask'))return;
  var el=document.createElement('div');el.className='quitask';
  el.innerHTML='<div class="quitcard"><b>Tout effacer ?</b><p>Étoiles, points, records, badges et diplôme seront remis à zéro. On ne pourra pas revenir en arrière.</p>'+
    '<div class="quitrow"><button class="btn ghost" id="rno">Annuler</button><button class="btn danger" id="ryes">Tout effacer</button></div></div>';
  document.body.appendChild(el);
  if(window.gsap&&!reduceMotion)gsap.from(el.firstChild,{scale:.8,opacity:0,duration:.25,ease:'back.out(2)'});
  function close(){if(el.parentNode)el.parentNode.removeChild(el);}
  el.onclick=function(e){if(e.target===el)close();};
  el.querySelector('#rno').onclick=close;
  el.querySelector('#ryes').onclick=function(){
    var keep=profile.name,av=playerById(profile.avatar);close();
    profile=blankProfile();profile.name=keep;if(av.need===0)profile.avatar=av.id;persist();applyBg();Sfx.whistle();
    screenLocker();window.scrollTo(0,0);
  };
}
