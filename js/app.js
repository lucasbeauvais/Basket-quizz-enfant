/* ============================================================
   MOTEUR DU QUIZ
   Points : chaque bonne réponse = tir à 3 points (+3).
   Série de 3  -> gants en mousse + 1 ballon bonus (tir tout de suite possible).
   Série de 5  -> EN FEU : les réponses valent +6 tant que la série continue.
   Fin du match -> séance de tirs (mini-jeu) avec les ballons gagnés.
   ============================================================ */
var reduceMotion=FX.reduce;
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function shuffle(a){var arr=a.slice();for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}
var bonusQ=null,lastBonus=null;
function pickBonus(){if(!BONUS.length)return null;if(BONUS.length===1)return BONUS[0];var b;do{b=shuffle(BONUS)[0];}while(b===lastBonus);lastBonus=b;return b;}
function doShake(){if(reduceMotion)return;var c=document.querySelector('.card');if(c){c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');}}

/* ===== SAUVEGARDE ===== */
var SAVE_KEY='quiz_nba_legendes_v1';
var profile=null;
function blankProfile(){return {name:'',avatar:'p1',stars:{1:0,2:0,3:0,4:0,5:0,6:0},best:{1:0,2:0,3:0,4:0,5:0,6:0},bestPts:{1:0,2:0,3:0,4:0,5:0,6:0,all:0},rules:{read:{},badges:{},best:{}},careerPts:0,played:0};}
function loadSave(){try{var s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(profile));}catch(e){}}
function maxStars(){return LEVEL_ORDER.length*3;}
function totalStars(){var t=0;for(var i=0;i<LEVEL_ORDER.length;i++)t+=(profile.stars[LEVEL_ORDER[i]]||0);return t;}
function rankName(){var t=totalStars();if(t>=12)return'Légende (GOAT)';if(t>=9)return'MVP';if(t>=6)return'All-Star';if(t>=3)return'Titulaire';return'Rookie';}
function playerById(id){for(var i=0;i<PLAYERS.length;i++)if(PLAYERS[i].id===id)return PLAYERS[i];return PLAYERS[0];}
function playerUnlocked(p){return totalStars()>=p.need;}

/* ===== DOM + état ===== */
var view=document.getElementById('view');
var progWrap=document.getElementById('prog');
var progTxt=document.getElementById('progtxt');
var progBar=document.getElementById('progbar');
function hideProg(){progWrap.style.display='none';seeBg(false);}
function showProg(){progWrap.style.display='block';}
var order=[],current=0,points=0,correct=0,results=[],answered=false,curLevel=1,ROUND=10,TARGET=10,streak=0,maxStreak=0,bonusBalls=0,shotPts=0,shotCount=0;
/* le Match des étoiles mélange tout sauf le Niveau Pro */
function poolFor(level){if(level==='all')return BANK.filter(function(q){return q.level!==6;});var p=[];for(var i=0;i<BANK.length;i++)if(BANK[i].level===level)p.push(BANK[i]);return p;}
function buildRound(level){return shuffle(poolFor(level)).slice(0,TARGET);}
function onFire(){return streak>=5;}

/* ===== BOUTON SON ===== */
var muteBtn=document.getElementById('mute');
function paintMute(){muteBtn.innerHTML=Sfx.isMuted()?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m23 9-6 6M17 9l6 6"/></svg>':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';muteBtn.setAttribute('aria-label',Sfx.isMuted()?'Activer le son':'Couper le son');}
muteBtn.onclick=function(){Sfx.toggle();paintMute();};paintMute();

/* ===== GRILLE DES JOUEURS ===== */
function playerGrid(selId){var grid='';for(var i=0;i<PLAYERS.length;i++){var p=PLAYERS[i],sel=(p.id===selId);
  if(playerUnlocked(p)){grid+='<button class="mascot'+(sel?' sel':'')+'" data-av="'+p.id+'">'+avatarHTML(p.id,50)+'<div class="mtx"><b>'+p.name+'</b><span>'+p.tag+'</span></div></button>';}
  else{grid+='<div class="mascot locked">'+avatarHTML(p.id,50)+'<div class="mtx"><b>'+p.name+'</b><span>'+p.tag+'</span></div><div class="mlock">'+lockSVG()+' '+p.need+' ★</div></div>';}}
  return '<div class="mascotgrid">'+grid+'</div>';}
function popIn(sel){if(!window.gsap||reduceMotion)return;gsap.from(view.querySelectorAll(sel),{y:24,opacity:0,duration:.4,stagger:.05,ease:'back.out(1.6)',clearProps:'transform,opacity'});}

/* ===== ÉCRAN PROFIL ===== */
var pendingAvatar='p1';
function screenProfile(){hideProg();pendingAvatar=profile.avatar||'p1';
  view.innerHTML=bannerHTML()+
    '<h1 class="h1">Crée ton joueur</h1>'+
    '<div class="coachline">'+coachHTML(46,'happy')+'<span><b>'+COACH_NAME+'</b> : bienvenue dans la ligue, champion ! Choisis ton joueur préféré.</span></div>'+
    '<label class="lbl">Ton prénom</label>'+
    '<input id="pname" class="nameinput" maxlength="14" placeholder="Écris ton prénom" value="'+esc(profile.name)+'">'+
    '<label class="lbl">Choisis ton joueur</label>'+
    playerGrid(pendingAvatar)+
    '<p class="hintnote">D\'autres joueurs se débloquent en gagnant des étoiles !</p>'+
    '<button class="btn big" id="go">C\'est parti !</button>'+
    '<button class="linkbtn" id="haveold">J\'ai déjà une partie sur un autre téléphone</button>';
  popIn('.mascot');
  var opts=view.querySelectorAll('.mascot[data-av]');for(var k=0;k<opts.length;k++){opts[k].onclick=function(){Sfx.pop();pendingAvatar=this.getAttribute('data-av');var all=view.querySelectorAll('.mascot');for(var j=0;j<all.length;j++)all[j].classList.remove('sel');this.classList.add('sel');if(window.gsap)gsap.fromTo(this,{scale:.9},{scale:1,duration:.4,ease:'elastic.out(1,.4)'});};}
  document.getElementById('haveold').onclick=Transfer.openImport;
  document.getElementById('go').onclick=function(){var v=(document.getElementById('pname').value||'').trim();if(!v){var el=document.getElementById('pname');el.focus();el.classList.add('shake');setTimeout(function(){el.classList.remove('shake');},450);return;}profile.name=v;profile.avatar=pendingAvatar;persist();Sfx.whistle();screenHome();};}

/* ===== ÉCRAN ACCUEIL ===== */
var secretIdx=Math.floor(Math.random()*SECRETS.length);
function secretBox(){return '<div class="secret">'+coachHTML(54)+'<div class="s-txt"><b>Le secret de '+COACH_NAME+'</b><span id="secrettxt">'+SECRETS[secretIdx]+'</span><br><button id="nextsecret">Un autre secret</button></div></div>';}
function screenHome(){hideProg();var mods='';for(var i=0;i<LEVEL_ORDER.length;i++){var f=LEVEL_ORDER[i],L=LEVELS[f];var rec=profile.bestPts[f]?(' &middot; record '+profile.bestPts[f]+' pts'):'';mods+='<button class="module'+(L.pro?' pro':'')+'" data-lvl="'+f+'">'+categoryIcon(f)+'<div class="m-txt"><b>'+L.name+'</b><span>'+L.sub+rec+'</span></div><div class="m-stars">'+starRow(profile.stars[f]||0)+'</div></button>';}
  var p=playerById(profile.avatar);
  view.innerHTML=
    '<button class="playercard pc-wall" id="pcard" style="'+bgStyle(null,.2)+'"><div class="pc-av">'+avatarHTML(profile.avatar,64)+'</div><div class="pc-txt"><b>'+esc(profile.name)+'</b><span>'+p.name+' &middot; '+rankName()+'</span><span class="pc-pts">'+(profile.careerPts||0)+' points en carrière</span></div><div class="pc-stars">'+starSVG(true,18)+' '+totalStars()+'/'+maxStars()+'</div><span class="pc-bgname">Fond : '+currentBg().name+' &middot; changer</span></button>'+
    secretBox()+rulesHomeCard()+
    '<div class="sectitle">Choisis ta conférence</div>'+
    '<div class="modules">'+mods+'</div>'+
    '<button class="module mix" id="mix">'+categoryIcon('all')+'<div class="m-txt"><b>Match des étoiles</b><span>Toutes les questions mélangées'+(profile.bestPts.all?' &middot; record '+profile.bestPts.all+' pts':'')+'</span></div></button>'+
    '<div class="homebtns"><button class="btn big shootbtn" id="train">🏀 Entraînement aux tirs</button><button class="btn ghost big" id="coll">Mon vestiaire : joueur, fond d\'écran, profil</button></div>';
  popIn('.module,.secret,.playercard');
  var ms=view.querySelectorAll('.module[data-lvl]');for(var k=0;k<ms.length;k++){ms[k].onclick=function(){startRound(parseInt(this.getAttribute('data-lvl'),10));};}
  document.getElementById('nextsecret').onclick=function(){secretIdx=(secretIdx+1)%SECRETS.length;var t=document.getElementById('secrettxt');t.textContent=SECRETS[secretIdx];Sfx.pop();if(window.gsap)gsap.from(t,{opacity:0,y:8,duration:.3});};
  document.getElementById('mix').onclick=function(){startRound('all');};
  document.getElementById('rulesbtn').onclick=function(){Sfx.whistle();screenRules();};
  document.getElementById('train').onclick=function(){MiniGame.open({title:'Entraînement',shots:withDefenders([{spot:'two'},{spot:'three'},{spot:'two'},{spot:'three'},{spot:'three',money:true}],0.4),onDone:function(){screenHome();}});};
  document.getElementById('coll').onclick=screenLocker;
  document.getElementById('pcard').onclick=screenLocker;}

/* ===== ÉCRAN JOUEURS ===== */
function screenCollection(){screenLocker();}
/* ===== JEU ===== */
var quizMode=null;
function startRound(level,custom){quizMode=custom||null;curLevel=level;order=custom?custom.questions:buildRound(level);ROUND=order.length;current=0;points=0;correct=0;results=[];streak=0;maxStreak=0;bonusBalls=0;shotPts=0;bonusQ=custom?null:pickBonus();showProg();Sfx.whistle();renderQuestion();}
function playHeader(){return '<button class="quitbtn" id="quitbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'+(quizMode?'École des règles':'Vestiaire')+'</button><div class="playbar"><div class="pb-av">'+avatarHTML(profile.avatar,32)+'</div><div class="pb-name">'+esc(profile.name)+'</div>'+
  '<div class="pb-balls" id="pbballs" title="Ballons bonus">'+(bonusBalls?'🏀 x'+bonusBalls:'')+'</div>'+
  '<div class="pb-streak'+(onFire()?' fire':'')+'" id="pbstreak"'+(streak>=2?'':' style="display:none"')+'>'+(onFire()?'🔥 ':'')+'Série x'+streak+'</div>'+
  '<div class="pb-score" id="pbscore">'+points+' pts</div></div>';}
function refreshBar(){var s=document.getElementById('pbscore');if(s)s.textContent=points+' pts';var st=document.getElementById('pbstreak');if(st){st.style.display=streak>=2?'':'none';st.className='pb-streak'+(onFire()?' fire':'');st.textContent=(onFire()?'🔥 ':'')+'Série x'+streak;}var b=document.getElementById('pbballs');if(b)b.textContent=bonusBalls?'🏀 x'+bonusBalls:'';}
function catBadge(){if(quizMode)return '<span class="leveldot"><i style="background:'+quizMode.color+'"></i>'+quizMode.label+'</span>';if(curLevel==='all')return '<span class="leveldot"><i style="background:linear-gradient(90deg,#552583,#1d428a,#0055a4,#c8102e)"></i>Match des étoiles</span>';var L=LEVELS[curLevel];return '<span class="leveldot"><i style="background:'+L.color+'"></i>'+L.name+'</span>';}
function choicesHTML(qd){var idx=shuffle([0,1,2,3].slice(0,qd.choices.length)),letters=['A','B','C','D'],ch='';for(var i=0;i<idx.length;i++){var oi=idx[i];ch+='<button class="choice" data-oi="'+oi+'"><span class="letter">'+letters[i]+'</span><span>'+qd.choices[oi]+'</span></button>';}return ch;}
function markChoices(qd,clicked){var btns=view.querySelectorAll('.choice');for(var i=0;i<btns.length;i++){var oi=parseInt(btns[i].getAttribute('data-oi'),10);btns[i].setAttribute('disabled','disabled');if(oi===qd.correct)btns[i].className='choice correct';else if(btns[i]===clicked)btns[i].className='choice wrong';}}
/* Quitter le match : confirmation dans la page (les fenêtres confirm() sont bloquées sur certains navigateurs) */
function bindQuit(){var b=document.getElementById('quitbtn');if(b)b.onclick=askQuit;}
function askQuit(){
  if(document.querySelector('.quitask'))return;
  var el=document.createElement('div');el.className='quitask';
  el.innerHTML='<div class="quitcard"><b>Quitter le match ?</b><p>Les points de ce match ne seront pas gardés.</p>'+
    '<div class="quitrow"><button class="btn ghost" id="qno">Continuer</button><button class="btn" id="qyes">Quitter</button></div></div>';
  document.body.appendChild(el);
  if(window.gsap&&!reduceMotion)gsap.from(el.firstChild,{scale:.8,opacity:0,duration:.25,ease:'back.out(2)'});
  function close(){if(el.parentNode)el.parentNode.removeChild(el);}
  el.onclick=function(e){if(e.target===el)close();};
  el.querySelector('#qno').onclick=close;
  el.querySelector('#qyes').onclick=function(){close();hideProg();var m=quizMode;quizMode=null;streak=0;if(m)screenRules();else screenHome();window.scrollTo(0,0);};
}
function renderQuestion(){seeBg(false);answered=false;var qd=order[current];progTxt.textContent='Question '+(current+1)+' / '+ROUND;progBar.style.width=(current/ROUND*100)+'%';
  view.innerHTML=playHeader()+
    '<div class="meta"><span class="badge theme">'+qd.theme+'</span><span class="badge ref">'+qd.rule+'</span>'+catBadge()+'</div>'+
    (qd.scene?qd.scene():'')+
    '<div class="qtext">'+qd.q+'</div>'+
    '<div class="choices">'+choicesHTML(qd)+'</div>'+
    '<div class="tools"><button class="hintbtn" id="hintbtn">'+coachHTML(30,'thinking')+(qd.level===6?'Indice du coach (-'+PRO_HINT_COST+' pts)':'Le secret du coach')+'</button></div>'+
    '<div class="hint" id="hint"><b>'+COACH_NAME+' :</b> '+qd.hint+'</div>'+
    '<div class="explain" id="explain"><b id="verdict"></b><span id="exptxt"></span></div>'+
    '<div class="nextrow" id="nextrow"></div>';
  if(window.gsap&&!reduceMotion){gsap.from('.scene',{scale:.92,opacity:0,duration:.4,ease:'back.out(1.7)'});gsap.from('.choice',{x:40,opacity:0,duration:.35,stagger:.06,ease:'power2.out',delay:.1});}
  var btns=view.querySelectorAll('.choice');for(var b=0;b<btns.length;b++)btns[b].onclick=onAnswer;
  bindQuit();
  document.getElementById('hintbtn').onclick=function(){if(this.dataset.used)return;this.dataset.used='1';Sfx.pop();var h=document.getElementById('hint');h.classList.add('show');this.style.opacity='.5';
    if(qd.level===6){points=Math.max(0,points-PRO_HINT_COST);refreshBar();}if(window.gsap)gsap.from(h,{y:-10,opacity:0,duration:.3});};}

/* Enchaîne : dunk/3 pts -> (gants en mousse | en feu) -> "+3" qui vole jusqu'au score */
function celebrateGood(pts,milestone,done){
  var p=playerById(profile.avatar);
  var kind=(streak>=3&&!milestone)?'mega':((shotCount++%2===0)?'three':'dunk');
  FX.shot(kind,p,function(){
    var next=function(){FX.flyPoints('+'+pts,document.getElementById('pbscore'),function(){refreshBar();});done&&done();};
    if(milestone==='fire')FX.fire(streak,next);
    else if(milestone==='foam')FX.foam(streak,p.c1,next);
    else next();
  });
  return kind;
}
function onAnswer(){if(answered)return;answered=true;var qd=order[current];var chosen=parseInt(this.getAttribute('data-oi'),10);var good=(chosen===qd.correct);results.push({ok:good,theme:qd.theme+' : '+qd.rule});markChoices(qd,this);
  var exp=document.getElementById('explain');exp.className='explain show '+(good?'good':'bad');var vtxt,milestone=null,pts=0;
  if(good){
    streak++;correct++;if(streak>maxStreak)maxStreak=streak;
    var base=(qd.level===6)?PRO_POINTS:3;pts=onFire()?base*2:base;points+=pts;
    if(streak%5===0)milestone='fire';else if(streak%3===0)milestone='foam';
    if(streak%3===0)bonusBalls++;
    Sfx.good();
    var kind=celebrateGood(pts,milestone);
    vtxt={dunk:'DUNK, +'+pts+' ! ',mega:'MÉGA DUNK, +'+pts+' ! ',three:'SWISH, +'+pts+' ! '}[kind]+pick(GOOD);
    if(onFire())vtxt='EN FEU, +'+pts+' ! '+pick(GOOD);
    if(reduceMotion)refreshBar();
  }else{streak=0;doShake();FX.wrong();vtxt=pick(BAD);refreshBar();}
  document.getElementById('verdict').innerHTML=vtxt;document.getElementById('exptxt').textContent=qd.explain;
  var last=(current+1>=ROUND);
  var row=document.getElementById('nextrow');
  row.innerHTML=(good&&streak%3===0?'<button class="btn shootbtn" id="bonusshot">🏀 Tir bonus à 3 points !</button>':'')+
    '<button class="btn" id="nextbtn">'+(last?(quizMode?'Voir mon badge':(bonusQ?'Question bonus':'Séance de tirs')):'Question suivante')+'</button>';
  row.classList.add('show');
  var bs=document.getElementById('bonusshot');
  if(bs)bs.onclick=function(){bonusBalls=Math.max(0,bonusBalls-1);MiniGame.open({title:'Tir bonus',shots:withDefenders([{spot:'three'}],0.5),onDone:function(p){shotPts+=p;points+=p;refreshBar();bs.parentNode.removeChild(bs);}});};
  document.getElementById('nextbtn').onclick=function(){if(!last){current++;renderQuestion();window.scrollTo(0,0);}else if(quizMode){quizMode.onEnd();}else if(bonusQ){renderBonus();}else{screenShootout();}};}
function renderBonus(){seeBg(false);var qd=bonusQ;progTxt.textContent='Bonus';progBar.style.width='100%';
  view.innerHTML=playHeader()+
    '<div class="meta"><span class="badge theme" style="background:#8a6420">Bonus culture</span><span class="badge ref">Basket</span><span class="leveldot"><i style="background:#fdb927"></i>Pour la gloire</span></div>'+
    '<div class="coachline">'+coachHTML(40,'happy')+'<span><b>'+COACH_NAME+'</b> : celle-là, c\'est pour le plaisir... mais si tu trouves, tu gagnes un ballon en plus !</span></div>'+
    '<div class="qtext">'+qd.q+'</div>'+
    '<div class="choices">'+choicesHTML(qd)+'</div>'+
    '<div class="explain" id="explain"><b id="verdict"></b><span id="exptxt"></span></div>'+
    '<div class="nextrow" id="nextrow"><button class="btn" id="nextbtn">Séance de tirs</button></div>';
  var btns=view.querySelectorAll('.choice');for(var b=0;b<btns.length;b++)btns[b].onclick=onBonusAnswer;
  document.getElementById('nextbtn').onclick=screenShootout;bindQuit();}
function onBonusAnswer(){var qd=bonusQ;var good=(parseInt(this.getAttribute('data-oi'),10)===qd.correct);markChoices(qd,this);
  var exp=document.getElementById('explain');exp.className='explain show '+(good?'good':'bad');
  if(good){bonusBalls++;refreshBar();Sfx.good();FX.shot('dunk',playerById(profile.avatar));}else{doShake();FX.wrong();}
  document.getElementById('verdict').textContent=good?'Bravo ! +1 ballon pour la séance de tirs !':'Pas grave, c\'était juste pour le fun.';document.getElementById('exptxt').textContent=qd.explain;document.getElementById('nextrow').classList.add('show');}

/* ===== SÉANCE DE TIRS (fin de match) ===== */
function shootoutShots(){
  var n=Math.min(8,2+bonusBalls+(correct===ROUND?1:0)),s=[];
  for(var i=0;i<n;i++)s.push({spot:(i%2===0)?'two':'three'});
  s[n-1]={spot:'three',money:true};
  for(var j=1;j<n;j++){var d=randomDefender(0.4);if(d)s[j].defender=d;}
  return s;}
/* défenseur au hasard : soit personne, soit un défenseur (qui saute ou qui lève les bras) */
function randomDefender(chance){return Math.random()<chance?(Math.random()<0.5?'jump':'arms'):null;}
function withDefenders(shots,chance){for(var i=0;i<shots.length;i++){var d=randomDefender(chance);if(d)shots[i].defender=d;}return shots;}
function screenShootout(){seeBg(true);progTxt.textContent='Séance de tirs';progBar.style.width='100%';
  var shots=shootoutShots();
  view.innerHTML='<div class="shootintro">'+coachHTML(96,'cheer')+
    '<h2 class="h1">Séance de tirs !</h2>'+
    '<p>'+COACH_NAME+' : tu as gagné <b>'+shots.length+' ballons</b>. Chaque panier rapporte des points en plus. Le dernier ballon, c\'est le <b>money ball</b> : il compte double ! Attention : sur les ballons marqués d\'une main, un défenseur surprise essaie de contrer !</p>'+
    '<div class="balls">'+shots.map(function(s){return '<span class="ballchip'+(s.money?' money':'')+(s.defender?' def':'')+'">'+(s.spot==='three'?'+3':'+2')+'</span>';}).join('')+'</div>'+
    '<button class="btn big shootbtn" id="goshoot">🏀 Aller shooter !</button>'+
    '<button class="btn ghost big" id="skipshoot" style="margin-top:10px">Voir mon résultat</button></div>';
  if(window.gsap&&!reduceMotion){gsap.from('.shootintro > *',{y:30,opacity:0,stagger:.08,duration:.4,ease:'back.out(1.7)'});gsap.from('.ballchip',{scale:0,stagger:.08,delay:.4,duration:.4,ease:'back.out(3)'});}
  Sfx.horn();
  document.getElementById('goshoot').onclick=function(){MiniGame.open({title:'Séance de tirs',shots:shots,onDone:function(p){shotPts+=p;points+=p;resultScreen();}});};
  document.getElementById('skipshoot').onclick=resultScreen;}

/* ===== RÉSULTAT + ÉTOILES ===== */
function starsFromScore(s,total){if(s>=total)return 3;if(s>=total-1)return 2;if(s>=Math.ceil(total*0.6))return 1;return 0;}
function resultScreen(){hideProg();var earned=starsFromScore(correct,ROUND);var unlockMsg='',record=false;
  var ptsBefore=profile.careerPts||0;profile.played=(profile.played||0)+1;profile.careerPts=ptsBefore+points;var newBgs=bgsUnlockedBetween(ptsBefore,profile.careerPts);
  var key=curLevel;if(points>(profile.bestPts[key]||0)){profile.bestPts[key]=points;record=true;}
  var newStyleBalls=[];
  if(curLevel!=='all'){var before=totalStars();if(correct>(profile.best[curLevel]||0))profile.best[curLevel]=correct;if(earned>(profile.stars[curLevel]||0))profile.stars[curLevel]=earned;var after=totalStars();newStyleBalls=ballsUnlockedByStars(before,after);for(var i=0;i<PLAYERS.length;i++){if(PLAYERS[i].need>before&&PLAYERS[i].need<=after){unlockMsg='Nouveau joueur débloqué : '+PLAYERS[i].name+' !';}}}
  persist();
  var starsHtml='';for(var s=0;s<3;s++)starsHtml+=starSVG(s<earned,40,false);
  var msg,sub;
  if(correct===ROUND){msg='Légende NBA !';sub='Sans faute ! '+COACH_NAME+' te donne son maillot n°24.';}
  else if(earned===2){msg='All-Star !';sub='Très solide, encore un petit effort et c\'est le sans-faute.';}
  else if(earned===1){msg='Beau match !';sub='Bien joué ! Rejoue pour viser les 3 étoiles.';}
  else{msg='Retour à l\'entraînement';sub='Pas de panique : même Jordan a raté des tirs. Relance un match !';}
  var rows='';for(var r=0;r<results.length;r++){rows+='<div class="row"><div class="n">'+(r+1)+'</div><div class="t">'+results[r].theme+'</div><div class="m '+(results[r].ok?'y':'x')+'">'+(results[r].ok?'✓':'✗')+'</div></div>';}
  var lvl=(curLevel==='all')?'Match des étoiles':LEVELS[curLevel].name;
  view.innerHTML='<div class="result">'+(correct===ROUND?'<div class="trophy">'+trophyHTML()+'</div>':'')+'<h2>'+msg+'</h2>'+
    (curLevel!=='all'?'<div class="starsbig">'+starsHtml+'</div>':'')+
    '<div class="scorebig"><span id="ptscount">0</span><small> pts</small></div>'+
    (record?'<div class="recordtag">NOUVEAU RECORD !</div>':'')+
    '<div class="breakdown"><span>'+correct+'/'+ROUND+' bonnes réponses</span><span>Tirs : +'+shotPts+' pts</span>'+(maxStreak>=2?'<span>Meilleure série : '+maxStreak+'</span>':'')+'</div>'+
    '<div class="verdict">'+lvl+' &middot; '+sub+'</div>'+
    (unlockMsg?'<div class="unlock">'+starSVG(true,18)+unlockMsg+'</div>':'')+
    (newStyleBalls.length?'<div class="unlock">'+ballIcon(newStyleBalls[newStyleBalls.length-1],22)+'Nouveau ballon de style : '+newStyleBalls.map(function(b){return b.name;}).join(', ')+' !</div>':'')+
    (newBgs.length?'<div class="unlock">'+starSVG(true,18)+'Nouveau fond d\'écran : '+bgNames(newBgs)+' ! (dans Mon vestiaire)</div>':'')+
    '<div class="scorecard">'+rows+'</div>'+
    '<button class="btn big" id="again">Rejouer</button>'+
    '<button class="btn ghost big" id="home" style="margin-top:10px">Retour au vestiaire</button>'+
    '<div class="footer">Jeu familial non officiel, sans lien avec la NBA. Les joueurs sont des personnages inventés ; '+COACH_NAME+' est un dessin inspiré de Kobe Bryant.</div></div>';
  /* compteur de points qui défile + étoiles qui tombent une par une */
  var el=document.getElementById('ptscount');
  if(window.gsap&&!reduceMotion){
    var o={v:0};gsap.to(o,{v:points,duration:1.4,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(o.v);}});
    gsap.from('.starsbig svg',{scale:0,rotation:-180,stagger:.25,duration:.6,ease:'back.out(2.5)',delay:.3,onStart:Sfx.pop});
    gsap.from('.trophy',{y:-200,rotation:-20,duration:.9,ease:'bounce.out'});
    gsap.from('.recordtag',{scale:0,duration:.6,delay:1.4,ease:'elastic.out(1,.4)'});
  }else el.textContent=points;
  if(correct===ROUND)FX.fireworks(3500);else if(earned>=2)FX.fireworks(1200);
  Sfx.buzzer();
  seeBg(true);
  if(newStyleBalls.length||newBgs.length)setTimeout(function(){showBallUnlock(newStyleBalls[newStyleBalls.length-1],function(){showBgUnlock(newBgs,function(){seeBg(true);});});},1800);
  document.getElementById('again').onclick=function(){startRound(curLevel);};
  document.getElementById('home').onclick=screenHome;}

/* ===== BOOT ===== */
function applyBrand(){if(!Assets.has('brand/logo'))return;var ic=document.querySelector('.topbar > svg');if(ic)ic.outerHTML='<img class="brandlogo" src="'+Assets.url('brand/logo')+'" alt="">';var l=document.createElement('link');l.rel='icon';l.href=Assets.url('brand/logo');document.head.appendChild(l);}
function boot(){applyBrand();var s=loadSave();var b=blankProfile();
  if(s&&s.name){profile=s;for(var k in b){if(profile[k]===undefined)profile[k]=b[k];}}else profile=b;
  applyBg();
  /* lien de transfert (#partie=…) : on affiche l'écran normal puis on propose de récupérer la partie */
  Transfer.fromUrl(function(){if(profile.name)screenHome();else screenProfile();});}
Assets.load(boot);
