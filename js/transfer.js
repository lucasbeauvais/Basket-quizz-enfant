/* ============================================================
   TRANSFÉRER SA PARTIE sur un autre téléphone
   Toute la progression tient dans le lien (après le #, donc rien
   n'est envoyé à un serveur) : …/index.html#partie=CODE
   Sur l'autre téléphone, ouvrir le lien (ou scanner le QR code,
   ou coller le code) récupère la partie.
   ============================================================ */
var Transfer = (function(){
  var LV=[1,2,3,4,5];
  function b64e(str){return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function b64d(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}
  function num(v){v=parseInt(v,10);return isFinite(v)&&v>0?v:0;}

  /* profil -> code compact (tableau JSON en base64) */
  function pack(p){
    var r=p.rules||{},badges=0,read=0,best=[];
    RULE_CHAPTERS.forEach(function(ch,i){if(r.badges&&r.badges[ch.id])badges|=1<<i;if(r.read&&r.read[ch.id])read|=1<<i;best.push((r.best&&r.best[ch.id])||0);});
    var arr=[1,p.name,p.avatar,
      LV.map(function(l){return (p.stars&&p.stars[l])||0;}),
      LV.map(function(l){return (p.best&&p.best[l])||0;}),
      LV.map(function(l){return (p.bestPts&&p.bestPts[l])||0;}).concat([(p.bestPts&&p.bestPts.all)||0]),
      p.careerPts||0,p.played||0,badges,read,best,p.bg||'',p.ballSkin||''];
    return b64e(JSON.stringify(arr));
  }
  /* code -> profil (ou null si le code est abîmé) */
  function unpack(code){
    try{
      var a=JSON.parse(b64d(code));
      if(!a||a[0]!==1||typeof a[1]!=='string'||!a[1].trim())return null;
      var p=blankProfile();
      p.name=a[1].trim().slice(0,14); p.avatar=playerById(a[2]).id;
      LV.forEach(function(l,i){p.stars[l]=Math.min(3,num(a[3][i]));p.best[l]=num(a[4][i]);p.bestPts[l]=num(a[5][i]);});
      p.bestPts.all=num(a[5][5]); p.careerPts=num(a[6]); p.played=num(a[7]);
      RULE_CHAPTERS.forEach(function(ch,i){if(a[8]&(1<<i))p.rules.badges[ch.id]=true;if(a[9]&(1<<i))p.rules.read[ch.id]=true;if(a[10]&&a[10][i])p.rules.best[ch.id]=num(a[10][i]);});
      if(a[11])p.bg=String(a[11]); if(a[12])p.ballSkin=String(a[12]);
      return p;
    }catch(e){return null;}
  }
  function baseUrl(){return location.origin+location.pathname;}
  function link(){return baseUrl()+'#partie='+pack(profile);}
  /* accepte un lien complet ou juste le code */
  function codeFrom(text){text=String(text||'').trim();var m=text.match(/partie=([A-Za-z0-9_-]+)/);return m?m[1]:(/^[A-Za-z0-9_-]{20,}$/.test(text)?text:null);}
  function summary(p){var s=0;LV.forEach(function(l){s+=p.stars[l]||0;});var b=0;for(var k in p.rules.badges)if(p.rules.badges[k])b++;
    return '<b>'+esc(p.name)+'</b> &middot; '+p.careerPts+' points &middot; '+s+' étoiles &middot; '+b+' badge'+(b>1?'s':'');}

  function qrSVG(text){
    if(typeof qrcode!=='function')return '';
    try{var q=qrcode(0,'L');q.addData(text);q.make();return q.createSvgTag({cellSize:4,margin:2,scalable:true});}catch(e){return '';}
  }

  /* fenêtre « Transférer ma partie » (depuis Mon vestiaire) */
  function openShare(){
    var url=link(),el=document.createElement('div');el.className='quitask';
    el.innerHTML='<div class="quitcard tfcard"><b>Continuer sur un autre téléphone</b>'+
      '<p>Scanne ce QR code avec l\'autre téléphone, ou envoie-lui le lien. La partie y sera copiée avec tes points, étoiles, badges, joueur, fonds et ballons.</p>'+
      '<div class="tfqr">'+qrSVG(url)+'</div>'+
      '<textarea class="tflink" id="tflink" readonly rows="3">'+esc(url)+'</textarea>'+
      '<div class="quitrow">'+(navigator.share?'<button class="btn shootbtn" id="tfshare">Envoyer</button>':'')+'<button class="btn" id="tfcopy">Copier le lien</button></div>'+
      '<button class="btn ghost big" id="tfclose" style="margin-top:10px">Fermer</button>'+
      '<p class="tfnote">Le lien est une photo de ta partie maintenant : si tu rejoues ici, crée un nouveau lien.</p></div>';
    document.body.appendChild(el);
    if(window.gsap&&!reduceMotion)gsap.from(el.firstChild,{scale:.85,opacity:0,duration:.25,ease:'back.out(2)'});
    function close(){if(el.parentNode)el.parentNode.removeChild(el);}
    el.onclick=function(e){if(e.target===el)close();};
    el.querySelector('#tfclose').onclick=close;
    var ta=el.querySelector('#tflink'),cp=el.querySelector('#tfcopy');
    cp.onclick=function(){
      function ok(){cp.textContent='Lien copié !';Sfx.pop();setTimeout(function(){cp.textContent='Copier le lien';},1500);}
      function fallback(){ta.focus();ta.select();try{document.execCommand('copy');ok();}catch(x){cp.textContent='Sélectionne le lien';}}
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok,fallback);else fallback();
    };
    var sh=el.querySelector('#tfshare');
    if(sh)sh.onclick=function(){navigator.share({title:'Ma partie de Quiz NBA',text:'Continue la partie de '+profile.name+' au Quiz NBA :',url:url}).catch(function(){});};
  }

  /* fenêtre « J'ai un code de partie » (profil ou vestiaire) */
  function openImport(){
    var el=document.createElement('div');el.className='quitask';
    el.innerHTML='<div class="quitcard tfcard"><b>Récupérer une partie</b>'+
      '<p>Colle ici le lien (ou le code) créé sur l\'autre téléphone, dans Mon vestiaire &gt; Transférer ma partie.</p>'+
      '<textarea class="tflink" id="tfin" rows="3" placeholder="https://…#partie=…"></textarea>'+
      '<p class="tferr" id="tferr"></p>'+
      '<div class="quitrow"><button class="btn ghost" id="tfno">Annuler</button><button class="btn" id="tfok">Récupérer</button></div></div>';
    document.body.appendChild(el);
    function close(){if(el.parentNode)el.parentNode.removeChild(el);}
    el.onclick=function(e){if(e.target===el)close();};
    el.querySelector('#tfno').onclick=close;
    el.querySelector('#tfok').onclick=function(){
      var code=codeFrom(el.querySelector('#tfin').value),p=code&&unpack(code);
      if(!p){el.querySelector('#tferr').textContent='Ce code ne marche pas. Vérifie que tu as copié tout le lien.';return;}
      close();confirmImport(p);
    };
  }

  /* confirmation avant de remplacer la partie de ce téléphone */
  function confirmImport(p,onCancel){
    var here=profile&&profile.name?profile:null;
    var el=document.createElement('div');el.className='quitask';
    el.innerHTML='<div class="quitcard tfcard"><b>Récupérer cette partie ?</b>'+
      '<div class="tfsum">'+avatarHTML(p.avatar,54)+'<span>'+summary(p)+'</span></div>'+
      (here?'<p class="tfwarn">La partie de <b>'+esc(here.name)+'</b> sur ce téléphone ('+(here.careerPts||0)+' points) sera remplacée.</p>':'')+
      '<div class="quitrow"><button class="btn ghost" id="impno">Non</button><button class="btn shootbtn" id="impyes">Oui, je continue !</button></div></div>';
    document.body.appendChild(el);
    if(window.gsap&&!reduceMotion)gsap.from(el.firstChild,{scale:.85,opacity:0,duration:.25,ease:'back.out(2)'});
    function close(){if(el.parentNode)el.parentNode.removeChild(el);}
    el.querySelector('#impno').onclick=function(){close();onCancel&&onCancel();};
    el.querySelector('#impyes').onclick=function(){close();profile=p;persist();applyBg();Sfx.whistle();FX.fireworks(1200);screenHome();window.scrollTo(0,0);};
  }

  /* au démarrage : le lien contient-il une partie ? */
  function fromUrl(onNone){
    var m=location.hash.match(/partie=([A-Za-z0-9_-]+)/);
    if(!m){onNone();return;}
    try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
    var p=unpack(m[1]);
    if(!p){onNone();return;}
    onNone();confirmImport(p);
  }
  return {pack:pack,unpack:unpack,link:link,openShare:openShare,openImport:openImport,fromUrl:fromUrl};
})();
