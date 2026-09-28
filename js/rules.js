/* ============================================================
   ÉCRANS DE L'ÉCOLE DES RÈGLES
   Liste des chapitres -> fiches (on glisse ou on clique) -> quiz du
   chapitre (4/5 pour gagner le badge sifflet) -> diplôme d'arbitre
   quand les 8 badges sont gagnés.
   ============================================================ */
var RULES_PASS=4, RULES_Q=5;
function rulesState(){
  if(!profile.rules)profile.rules={};
  var r=profile.rules; if(!r.read)r.read={}; if(!r.badges)r.badges={}; if(!r.best)r.best={};
  return r;
}
function rulesBadgeCount(){var r=rulesState(),n=0;for(var i=0;i<RULE_CHAPTERS.length;i++)if(r.badges[RULE_CHAPTERS[i].id])n++;return n;}
function whistleSVG(size,on){
  size=size||40;
  if(Assets.has('rules/whistle'))return '<img class="whistleimg'+(on?'':' off')+'" src="'+Assets.url('rules/whistle')+'" width="'+size+'" height="'+size+'" alt="" draggable="false">';var c=on?'#fdb927':'#d6ccb8',s=on?'#a86a00':'#b3a78f';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 48 48" aria-hidden="true">'+
    '<circle cx="24" cy="24" r="23" fill="'+(on?'#1b1733':'#efe7d6')+'"/>'+
    '<path d="M10 22 h16 a9 9 0 1 1 -9 9 v-2 h-7 z" fill="'+c+'" stroke="'+s+'" stroke-width="2" stroke-linejoin="round"/>'+
    '<rect x="24" y="17" width="14" height="7" rx="2" fill="'+c+'" stroke="'+s+'" stroke-width="2"/>'+
    '<circle cx="21" cy="31" r="3" fill="'+(on?'#1b1733':'#fff')+'"/>'+
    '<path d="M37 17 q6 -8 -2 -12" fill="none" stroke="'+s+'" stroke-width="1.6"/>'+
    '</svg>';
}
/* Carte sur l'accueil */
function rulesHomeCard(){
  var n=rulesBadgeCount(),N=RULE_CHAPTERS.length;
  return '<button class="rulescard" id="rulesbtn">'+whistleSVG(56,true)+
    '<div class="rc-txt"><b>L\'école des règles FIBA</b><span>Deviens incollable sur les règles, comme un arbitre</span>'+
    '<div class="rc-bar"><i style="width:'+Math.round(n/N*100)+'%"></i></div><small>'+n+' / '+N+' badges d\'arbitre'+(n===N?' &middot; diplôme obtenu !':'')+'</small></div></button>';
}

/* ===== LISTE DES CHAPITRES ===== */
function screenRules(){hideProg();var r=rulesState(),n=rulesBadgeCount(),N=RULE_CHAPTERS.length,list='';
  for(var i=0;i<RULE_CHAPTERS.length;i++){var ch=RULE_CHAPTERS[i],got=!!r.badges[ch.id],read=!!r.read[ch.id];
    var status=got?'<span class="rstat ok">Badge gagné</span>':(read?'<span class="rstat">Quiz à réussir</span>':'<span class="rstat new">À lire</span>');
    list+='<button class="module rch" data-ch="'+i+'">'+miniBadge(ch.color,String(i+1))+
      '<div class="m-txt"><b>'+ch.title+'</b><span>'+ch.sub+' &middot; '+ch.cards.length+' fiches</span>'+status+'</div>'+
      '<div class="rch-badge">'+whistleSVG(34,got)+'</div></button>';}
  view.innerHTML=
    '<div class="rhero">'+whistleSVG(64,true)+'<div><h1 class="h1 left">L\'école des règles</h1><p>Les règles officielles FIBA, expliquées pour les jeunes joueurs. Lis les fiches, puis réussis le quiz ('+RULES_PASS+' bonnes réponses sur '+RULES_Q+') pour gagner le badge sifflet.</p></div></div>'+
    '<div class="coachline">'+coachHTML(44,'thinking')+'<span><b>'+COACH_NAME+'</b> : pour passer au niveau supérieur, il faut connaître les règles aussi bien qu\'un arbitre. Au boulot, champion !</span></div>'+
    '<div class="rprog"><div class="rc-bar big"><i style="width:'+Math.round(n/N*100)+'%"></i></div><span>'+n+' / '+N+' badges</span></div>'+
    (n===N?'<button class="btn big shootbtn" id="diploma">Voir mon diplôme d\'arbitre</button>':'')+
    '<div class="modules">'+list+'</div>'+
    '<button class="mixbtn" id="allrules">Grand quiz des règles (10 questions mélangées)</button>'+
    '<button class="btn ghost big" id="back">Retour au vestiaire</button>'+
    '<p class="footer">Règles officielles FIBA (utilisées par la FFBB en France), simplifiées pour les enfants. Certaines règles du mini-basket changent selon la catégorie et le comité : ton coach a toujours le dernier mot.</p>';
  popIn('.rch');
  var bs=view.querySelectorAll('.rch');for(var k=0;k<bs.length;k++){bs[k].onclick=function(){Sfx.pop();screenCard(parseInt(this.getAttribute('data-ch'),10),0,0);};}
  document.getElementById('back').onclick=screenHome;
  document.getElementById('allrules').onclick=function(){startRound(5);};
  var d=document.getElementById('diploma');if(d)d.onclick=screenDiploma;
  window.scrollTo(0,0);}

/* ===== UNE FICHE ===== */
function screenCard(ci,idx,dir){hideProg();var ch=RULE_CHAPTERS[ci],c=ch.cards[idx],N=ch.cards.length,last=(idx===N-1);
  var dots='';for(var i=0;i<N;i++)dots+='<i class="'+(i===idx?'on':(i<idx?'done':''))+'"></i>';
  var sig=c.sig&&REF_SIGNALS[c.sig]?'<div class="rblock sig">'+refSignalSVG(c.sig,92)+'<div><b>Le geste de l\'arbitre : '+REF_SIGNALS[c.sig].name+'</b><p>'+REF_SIGNALS[c.sig].txt+'</p></div></div>':'';
  view.innerHTML=
    '<div class="rtop"><button class="rback" id="rback">&larr; Chapitres</button><span class="rpos" style="background:'+ch.color+'">Chapitre '+(ci+1)+' &middot; '+(idx+1)+' / '+N+'</span></div>'+
    '<div class="rchname">'+ch.title+'</div>'+
    '<div class="rdots">'+dots+'</div>'+
    '<div class="rcard" id="rcard">'+
      (c.scene?c.scene():'')+
      '<h2 class="rtitle">'+c.t+'</h2>'+
      '<div class="rblock rule"><b>La règle</b><p>'+c.rule+'</p></div>'+
      (c.young?'<div class="rblock young"><b>Chez les jeunes</b><p>'+c.young+'</p></div>':'')+
      sig+
      '<div class="rblock tip">'+coachHTML(40,'happy')+'<p><b>Le truc du coach :</b> '+c.tip+'</p></div>'+
    '</div>'+
    '<div class="rnav"><button class="btn ghost" id="rprev"'+(idx===0?' disabled':'')+'>&larr; Précédente</button>'+
      '<button class="btn'+(last?' shootbtn':'')+'" id="rnext">'+(last?'Quiz du chapitre':'Suivante &rarr;')+'</button></div>'+
    '<p class="hintnote">Astuce : fais glisser la fiche avec ton doigt.</p>';
  if(last){var r=rulesState();if(!r.read[ch.id]){r.read[ch.id]=true;persist();}}
  var card=document.getElementById('rcard');
  if(window.gsap&&!reduceMotion&&dir)gsap.from(card,{x:dir*60,opacity:0,duration:.35,ease:'power2.out'});
  function go(d){var j=idx+d;if(j<0)return;if(j>=N){startChapterQuiz(ci);return;}Sfx.whoosh();screenCard(ci,j,d);window.scrollTo(0,0);}
  document.getElementById('rprev').onclick=function(){go(-1);};
  document.getElementById('rnext').onclick=function(){go(1);};
  document.getElementById('rback').onclick=screenRules;
  /* glisser à gauche / à droite */
  var sx=null,sy=null;
  card.addEventListener('pointerdown',function(e){sx=e.clientX;sy=e.clientY;});
  card.addEventListener('pointerup',function(e){if(sx===null)return;var dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(dx<0?1:-1);});
}

/* ===== QUIZ DU CHAPITRE ===== */
function startChapterQuiz(ci){var ch=RULE_CHAPTERS[ci];
  startRound(5,{questions:shuffle(ch.quiz).slice(0,RULES_Q),label:'Chapitre '+(ci+1)+' : '+ch.title,color:ch.color,
    onEnd:function(){chapterQuizResult(ci);}});}
function chapterQuizResult(ci){hideProg();var ch=RULE_CHAPTERS[ci],r=rulesState(),passed=correct>=Math.min(RULES_PASS,ROUND),already=!!r.badges[ch.id];
  if(correct>(r.best[ch.id]||0))r.best[ch.id]=correct;
  if(passed)r.badges[ch.id]=true;
  var ptsBefore=profile.careerPts||0;profile.careerPts=ptsBefore+points;persist();var newBgs=bgsUnlockedBetween(ptsBefore,profile.careerPts);
  var n=rulesBadgeCount(),N=RULE_CHAPTERS.length,allDone=(n===N);
  var next=RULE_CHAPTERS[ci+1];
  view.innerHTML='<div class="result">'+
    '<div class="bigbadge">'+whistleSVG(120,passed)+'</div>'+
    '<h2>'+(passed?(already?'Badge confirmé !':'Badge gagné !'):'Presque !')+'</h2>'+
    '<div class="scorebig">'+correct+'<small>/'+ROUND+'</small></div>'+
    '<div class="verdict">'+(passed?('Tu connais le chapitre « '+ch.title+' » comme un arbitre.'):('Il faut '+RULES_PASS+' bonnes réponses. Relis les fiches et retente ta chance !'))+'</div>'+
    '<div class="breakdown"><span>'+n+' / '+N+' badges</span><span>+'+points+' pts</span></div>'+
    (allDone&&passed&&!already?'<div class="unlock">'+starSVG(true,18)+'Tous les badges ! Ton diplôme d\'arbitre est prêt.</div>':'')+
    (newBgs.length?'<div class="unlock">'+starSVG(true,18)+'Nouveau fond d\'écran : '+newBgs.join(', ')+' !</div>':'')+
    (allDone?'<button class="btn big shootbtn" id="dip">Voir mon diplôme</button>':'')+
    (passed&&next?'<button class="btn big" id="nextch">Chapitre suivant : '+next.title+'</button>':'')+
    (!passed?'<button class="btn big" id="reread">Relire les fiches</button><button class="btn ghost big" id="retry" style="margin-top:10px">Retenter le quiz</button>':'')+
    '<button class="btn ghost big" id="tolist" style="margin-top:10px">Tous les chapitres</button></div>';
  if(passed){FX.fireworks(already?800:2200);Sfx.horn();if(window.gsap&&!reduceMotion)gsap.from('.bigbadge',{scale:0,rotation:-200,duration:.9,ease:'back.out(1.8)'});}
  else Sfx.bad();
  function on(id,fn){var e=document.getElementById(id);if(e)e.onclick=fn;}
  on('dip',screenDiploma);on('nextch',function(){screenCard(ci+1,0,1);});on('reread',function(){screenCard(ci,0,0);});
  on('retry',function(){startChapterQuiz(ci);});on('tolist',screenRules);
  window.scrollTo(0,0);}

/* ===== DIPLÔME ===== */
function screenDiploma(){hideProg();var d=new Date(),mois=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  var badges='';for(var i=0;i<RULE_CHAPTERS.length;i++)badges+='<div class="dbadge">'+whistleSVG(34,true)+'<span>'+RULE_CHAPTERS[i].title+'</span></div>';
  view.innerHTML='<div class="diploma">'+
    '<div class="d-top">'+whistleSVG(58,true)+'</div>'+
    '<div class="d-kicker">École des règles FIBA</div>'+
    '<h2 class="d-title">Diplôme d\'arbitre junior</h2>'+
    '<p class="d-txt">décerné à</p><div class="d-name">'+esc(profile.name)+'</div>'+
    '<p class="d-txt">pour avoir réussi les '+RULE_CHAPTERS.length+' chapitres des règles du basket : le terrain, les points, le dribble, le temps, les fautes, le mini-basket, les gestes de l\'arbitre et l\'esprit du jeu.</p>'+
    '<div class="d-badges">'+badges+'</div>'+
    '<div class="d-sign"><div>'+coachHTML(46,'cheer')+'</div><div><b>'+COACH_NAME+'</b><span>le '+d.getDate()+' '+mois[d.getMonth()]+' '+d.getFullYear()+'</span></div></div>'+
    '</div>'+
    '<button class="btn ghost big" id="back" style="margin-top:14px">Retour à l\'école des règles</button>';
  FX.fireworks(3000);Sfx.cheer();
  if(window.gsap&&!reduceMotion){gsap.from('.diploma',{scale:.7,rotation:-4,opacity:0,duration:.7,ease:'back.out(1.6)'});gsap.from('.dbadge',{scale:0,stagger:.08,delay:.5,duration:.4,ease:'back.out(3)'});}
  document.getElementById('back').onclick=screenRules;
  window.scrollTo(0,0);}
