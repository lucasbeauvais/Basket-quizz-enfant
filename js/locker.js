/* ============================================================
   MON VESTIAIRE : profil + joueurs + fonds d'écran + remise à zéro
   Les fonds se débloquent avec les points en carrière.
   ============================================================ */
var BACKGROUNDS=[
  {id:'nuit',   name:'Salle de nuit',  need:0,
   css:'radial-gradient(circle at 15% -10%,#6a2fa3 0%,rgba(106,47,163,0) 45%),radial-gradient(circle at 95% 110%,#c95e14 0%,rgba(201,94,20,0) 40%),#0e1233'},
  {id:'violet', name:'Violet et or',   need:100,
   css:'radial-gradient(circle at 20% 0%,#fdb927 0%,rgba(253,185,39,0) 35%),linear-gradient(160deg,#552583 0%,#2a0f4a 100%)'},
  {id:'parquet',name:'Parquet',        need:250,
   css:'repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 46px),linear-gradient(180deg,#d9a15a 0%,#a8642a 100%)'},
  {id:'street', name:'Playground',     need:450,
   css:'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0 10px,transparent 10px 20px),radial-gradient(circle at 50% 120%,#e8752a 0%,rgba(232,117,42,0) 40%),linear-gradient(180deg,#3a4556 0%,#1d242f 100%)'},
  {id:'ocean',  name:'Océan',          need:700,
   css:'radial-gradient(circle at 80% 0%,#4fd1c5 0%,rgba(79,209,197,0) 40%),linear-gradient(180deg,#0a4d8c 0%,#062347 100%)'},
  {id:'feu',    name:'En feu',         need:1000,
   css:'radial-gradient(circle at 50% 115%,#fdb927 0%,#ff9f1c 18%,#c8102e 45%,rgba(200,16,46,0) 70%),linear-gradient(180deg,#2b0505 0%,#5a0b0b 100%)'},
  {id:'galaxie',name:'Galaxie',        need:1500,
   css:'radial-gradient(1.5px 1.5px at 20% 30%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 70% 20%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 40% 70%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 85% 60%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 10% 85%,#fff 50%,transparent 51%),radial-gradient(circle at 30% 20%,#6a2fa3 0%,rgba(106,47,163,0) 45%),radial-gradient(circle at 80% 80%,#1d6fd6 0%,rgba(29,111,214,0) 45%),#05061a',
   size:'220px 220px,260px 260px,300px 300px,240px 240px,200px 200px,auto,auto,auto'},
  {id:'salle',  name:'Soir de finale', need:2200, img:'minigame/court'},
  {id:'or',     name:'Légende dorée',  need:3000,
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
    '<div class="sectitle" style="margin-top:18px">Mon fond d\'écran <small>(se débloquent avec les points)</small></div>'+
    (nextBg?'<p class="hintnote left">Prochain fond : <b>'+nextBg.name+'</b> à '+nextBg.need+' points (encore '+(nextBg.need-pts)+').</p>':'<p class="hintnote left">Tous les fonds sont débloqués, bravo !</p>')+
    '<div class="bggrid">'+bgs+'</div>'+
    '<div class="sectitle" style="margin-top:22px">Recommencer à zéro</div>'+
    '<div class="resetbox"><p>Efface les étoiles, les points, les records, les badges d\'arbitre et le diplôme pour rejouer toutes les questions depuis le début. Ton prénom est gardé.</p>'+
    '<button class="btn ghost dangerline" id="lreset">Réinitialiser mon compte</button></div>';
  popIn('.mascot,.bgopt');
  document.getElementById('lback').onclick=screenHome;
  document.getElementById('lsave').onclick=function(){var el=document.getElementById('lname'),v=(el.value||'').trim();if(!v){el.focus();el.classList.add('shake');setTimeout(function(){el.classList.remove('shake');},450);return;}profile.name=v;persist();Sfx.pop();this.textContent='✓';var t=this;setTimeout(function(){t.textContent='OK';},1200);};
  var ms=view.querySelectorAll('.mascot[data-av]');for(var k=0;k<ms.length;k++){ms[k].onclick=function(){Sfx.pop();profile.avatar=this.getAttribute('data-av');persist();var y=window.scrollY;screenLocker();window.scrollTo(0,y);};}
  var bs=view.querySelectorAll('.bgopt[data-bg]');for(var m=0;m<bs.length;m++){bs[m].onclick=function(){Sfx.pop();profile.bg=this.getAttribute('data-bg');persist();applyBg();var y=window.scrollY;screenLocker();window.scrollTo(0,y);};}
  document.getElementById('lreset').onclick=askReset;
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
