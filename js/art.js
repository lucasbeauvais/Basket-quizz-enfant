/* ============================================================
   DESSINS (SVG, aucune image externe)
   Tous les personnages sont des dessins originaux "inspirés de" :
   aucune photo ni logo officiel.
   ============================================================ */
var VB='0 0 400 230';
function svg(inner){
  return '<svg class="scene" viewBox="'+VB+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">'+inner+'</svg>';
}
function tag(x,y,txt){
  var w=txt.length*6.2+18;
  if(x-w/2<4)x=w/2+4; if(x+w/2>396)x=396-w/2;
  return '<rect x="'+(x-w/2)+'" y="'+(y-11)+'" width="'+w+'" height="19" rx="9.5" fill="#fdb927"/>'+
    '<text x="'+x+'" y="'+(y+2)+'" font-family="Helvetica,Arial" font-size="11" font-weight="800" fill="#1b1733" text-anchor="middle">'+txt+'</text>';
}
/* Salle de match : fond sombre, projecteurs, public */
function arena(){
  var s='<rect width="400" height="230" fill="#141a45"/>'+
    '<path d="M60 0 L0 150 L130 150 Z" fill="#ffffff" opacity=".05"/><path d="M340 0 L270 150 L400 150 Z" fill="#ffffff" opacity=".05"/>';
  var cols=['#e8752a','#fdb927','#6a5acd','#c0392b','#2e9e5b','#ffffff'];
  for(var r=0;r<3;r++){for(var x=8+(r%2)*9;x<400;x+=18){s+='<circle cx="'+x+'" cy="'+(112+r*11)+'" r="4.5" fill="'+cols[(x+r*3)%cols.length]+'" opacity=".35"/>';}}
  s+='<rect y="146" width="400" height="84" fill="#d9a15a"/>';
  for(var k=20;k<400;k+=34){s+='<line x1="'+k+'" y1="146" x2="'+k+'" y2="230" stroke="#c98c45" stroke-width="1"/>';}
  s+='<line x1="0" y1="146" x2="400" y2="146" stroke="#fff" stroke-width="2"/>';
  return s;
}
function ballAt(x,y,r){r=r||8;
  return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#e8752a" stroke="#a84a12" stroke-width="1"/>'+
    '<path d="M'+(x-r)+' '+y+' h'+(2*r)+' M'+x+' '+(y-r)+' v'+(2*r)+'" stroke="#6b2f08" stroke-width="1"/>'+
    '<path d="M'+(x-r*.8)+' '+(y-r*.6)+' Q'+x+' '+y+' '+(x-r*.8)+' '+(y+r*.6)+' M'+(x+r*.8)+' '+(y-r*.6)+' Q'+x+' '+y+' '+(x+r*.8)+' '+(y+r*.6)+'" stroke="#6b2f08" stroke-width=".9" fill="none"/>';
}
/* Maillot geant (c1 = couleur, c2 = bordure, num = numero ou "?") */
function jersey(c1,c2,num){
  return '<path d="M160 40 Q200 62 240 40 L262 50 L258 96 L246 100 L246 196 L154 196 L154 100 L142 96 L138 50 Z" fill="'+c1+'" stroke="'+c2+'" stroke-width="5" stroke-linejoin="round"/>'+
    '<path d="M168 44 Q200 76 232 44" fill="none" stroke="'+c2+'" stroke-width="5"/>'+
    '<text x="200" y="164" font-family="Impact,Arial Black,Helvetica" font-size="'+(String(num).length>1?58:66)+'" font-weight="900" fill="'+c2+'" text-anchor="middle">'+num+'</text>';
}
function sceneImg(key,txt){ return '<div class="scene sceneimg">'+Assets.img(key)+'<span class="scenetag">'+txt+'</span></div>'; }
function sceneJersey(c1,c2,num,txt){ return svg(arena()+jersey(c1,c2,num)+tag(200,216,txt)); }
/* Silhouette mystere dans un projecteur */
function sceneMystery(txt,c){
  if(Assets.has('scenes/mystery'))return sceneImg('scenes/mystery',txt);c=c||'#2a2f66';
  return svg(arena()+'<path d="M200 0 L120 200 L280 200 Z" fill="#fff5c0" opacity=".16"/>'+
    '<circle cx="200" cy="62" r="22" fill="'+c+'"/>'+
    '<path d="M166 92 Q200 82 234 92 L240 178 L160 178 Z" fill="'+c+'"/>'+
    '<text x="200" y="152" font-family="Impact,Arial Black,Helvetica" font-size="48" font-weight="900" fill="#fdb927" text-anchor="middle">?</text>'+
    ballAt(258,168,13)+tag(200,214,txt));
}
/* Trophee dore */
function sceneTrophy(txt){
  if(Assets.has('scenes/trophy'))return sceneImg('scenes/trophy',txt);
  return svg(arena()+'<path d="M200 0 L140 200 L260 200 Z" fill="#fff5c0" opacity=".14"/>'+
    '<rect x="176" y="168" width="48" height="16" rx="3" fill="#8a6420"/>'+
    '<path d="M186 168 L192 120 L208 120 L214 168 Z" fill="#f5c542" stroke="#b58a12" stroke-width="2"/>'+
    '<path d="M168 60 L232 60 L222 118 L178 118 Z" fill="#fdd75a" stroke="#b58a12" stroke-width="2"/>'+
    ballAt(200,44,17)+
    '<g fill="#fff" opacity=".8"><circle cx="150" cy="60" r="2"/><circle cx="256" cy="88" r="2.4"/><circle cx="244" cy="40" r="1.6"/><circle cx="160" cy="104" r="1.6"/></g>'+
    tag(200,214,txt));
}
/* Globe "d'ou vient-il ?" */
function sceneGlobe(txt){
  if(Assets.has('scenes/globe'))return sceneImg('scenes/globe',txt);
  return svg(arena()+'<circle cx="200" cy="88" r="58" fill="#2f7fd1" stroke="#fff" stroke-width="3"/>'+
    '<path d="M160 60 q20 -10 34 6 q10 14 -6 24 q-16 8 -10 26 q-18 -6 -22 -24 q-6 -18 4 -32 Z" fill="#46b36b"/>'+
    '<path d="M214 46 q22 2 30 22 q-12 8 -24 2 q-10 -6 -6 -24 Z M222 100 q18 0 20 18 q-14 12 -26 4 Z" fill="#46b36b"/>'+
    '<text x="200" y="108" font-family="Impact,Arial Black,Helvetica" font-size="52" font-weight="900" fill="#fdb927" text-anchor="middle" stroke="#1b1733" stroke-width="2">?</text>'+
    tag(200,214,txt));
}
/* Tableau d'affichage */
function sceneBoard(big,small,txt){
  return svg(arena()+'<rect x="110" y="24" width="180" height="104" rx="10" fill="#0b0b14" stroke="#fdb927" stroke-width="3"/>'+
    '<text x="200" y="92" font-family="Impact,Arial Black,Helvetica" font-size="56" fill="#ff5a3c" text-anchor="middle">'+big+'</text>'+
    '<text x="200" y="116" font-family="Helvetica,Arial" font-size="12" font-weight="800" fill="#fdb927" text-anchor="middle">'+small+'</text>'+
    ballAt(330,176,14)+tag(200,214,txt));
}
/* Panier vu de cote */
function sceneHoop(txt,withPlayer){
  if(Assets.has('scenes/hoop'))return sceneImg('scenes/hoop',txt);
  var s=arena()+'<rect x="316" y="40" width="7" height="170" fill="#9aa0b8"/>'+
    '<rect x="296" y="28" width="10" height="70" fill="#fff" stroke="#c9c2b0"/>'+
    '<path d="M296 82 L256 82" stroke="#e8752a" stroke-width="4"/>'+
    '<path d="M258 84 L264 110 M268 84 L270 110 M280 84 L278 110 M292 84 L286 110 M262 98 h26" stroke="#eee" stroke-width="1.3" fill="none"/>'+
    '<line x1="40" y1="82" x2="40" y2="200" stroke="#fdb927" stroke-width="2" stroke-dasharray="5 4"/>'+
    '<text x="46" y="140" font-family="Helvetica,Arial" font-size="13" font-weight="800" fill="#fdb927">?</text>';
  if(withPlayer)s+=miniFig(150,200,'#552583','#fdb927','1');
  return svg(s+tag(200,216,txt));
}
/* Chronometre des tirs */
function sceneClock(n,txt){
  return svg(arena()+'<rect x="140" y="26" width="120" height="92" rx="10" fill="#0b0b14" stroke="#9aa0b8" stroke-width="3"/>'+
    '<text x="200" y="98" font-family="Impact,Arial Black,Helvetica" font-size="66" fill="#ff5a3c" text-anchor="middle">'+n+'</text>'+
    miniFig(90,200,'#1d428a','#ffc72c','30')+ballAt(112,186,9)+tag(250,214,txt));
}
/* Deux equipes face a face */
function sceneVersus(c1,c2,txt){
  if(Assets.has('scenes/versus'))return sceneImg('scenes/versus',txt);
  var s=arena();
  for(var i=0;i<5;i++){s+=miniFig(40+i*28,196-(i%2)*6,c1,'#fff',''+(i+1));}
  for(var j=0;j<5;j++){s+=miniFig(248+j*28,196-(j%2)*6,c2,'#fff',''+(j+1));}
  s+='<text x="200" y="80" font-family="Impact,Arial Black,Helvetica" font-size="40" fill="#fdb927" text-anchor="middle">VS</text>';
  return svg(s+tag(200,216,txt));
}
/* Petit joueur debout (pieds en x,y) */
function miniFig(x,y,c1,c2,num){
  return '<ellipse cx="'+x+'" cy="'+(y+2)+'" rx="11" ry="3" fill="#000" opacity=".2"/>'+
    '<line x1="'+(x-4)+'" y1="'+(y-16)+'" x2="'+(x-5)+'" y2="'+y+'" stroke="#5a3a22" stroke-width="4" stroke-linecap="round"/>'+
    '<line x1="'+(x+4)+'" y1="'+(y-16)+'" x2="'+(x+5)+'" y2="'+y+'" stroke="#5a3a22" stroke-width="4" stroke-linecap="round"/>'+
    '<rect x="'+(x-9)+'" y="'+(y-40)+'" width="18" height="26" rx="5" fill="'+c1+'"/>'+
    '<text x="'+x+'" y="'+(y-22)+'" font-family="Helvetica,Arial" font-size="9" font-weight="800" fill="'+c2+'" text-anchor="middle">'+num+'</text>'+
    '<circle cx="'+x+'" cy="'+(y-48)+'" r="8" fill="#8d5a3b"/>';
}
/* Animal mystere (pour les logos d'equipe) */
function sceneAnimal(txt){
  return svg(arena()+'<circle cx="200" cy="84" r="60" fill="#c8102e" stroke="#fff" stroke-width="4"/>'+
    '<text x="200" y="110" font-family="Impact,Arial Black,Helvetica" font-size="70" fill="#fff" text-anchor="middle">?</text>'+
    tag(200,214,txt));
}
/* Echiquier */
function sceneChess(txt){
  if(Assets.has('scenes/chess'))return sceneImg('scenes/chess',txt);
  var s=arena()+'<g transform="translate(140,24)">';
  for(var r=0;r<6;r++)for(var c=0;c<6;c++){s+='<rect x="'+(c*20)+'" y="'+(r*20)+'" width="20" height="20" fill="'+((r+c)%2?'#6b4a2a':'#f1dfc0')+'"/>';}
  s+='<path d="M50 64 q10 -18 20 0 l-3 6 h-14 Z M52 70 h16 v4 h-16 Z" fill="#1b1733"/>'+
    '<path d="M72 44 q8 -14 16 0 l-2 6 h-12 Z M73 50 h14 v4 h-14 Z" fill="#fff" stroke="#1b1733"/></g>';
  return svg(s+miniFig(300,200,'#1b1b1b','#c4ced4','1')+tag(200,214,txt));
}


function starPts(cx,cy,r){var p='';for(var i=0;i<5;i++){var a=-Math.PI/2+i*2*Math.PI/5;var a2=a+Math.PI/5;p+=(cx+Math.cos(a)*r).toFixed(1)+','+(cy+Math.sin(a)*r).toFixed(1)+' '+(cx+Math.cos(a2)*r*0.46).toFixed(1)+','+(cy+Math.sin(a2)*r*0.46).toFixed(1)+' ';}return p;}
/* Tete (centre cx,cy rayon r) avec coiffure */
function headSVG(cx,cy,r,skin,hair){
  var s='';
  if(hair==='curly'){for(var i=-3;i<=3;i++){s+='<circle cx="'+(cx+i*r*0.3)+'" cy="'+(cy-r*0.78+Math.abs(i)*r*0.1)+'" r="'+(r*0.3)+'" fill="#1a1008"/>';}}
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+skin+'"/>';
  if(hair==='short')s+='<path d="M'+(cx-r*0.95)+' '+(cy-r*0.2)+' Q'+cx+' '+(cy-r*1.5)+' '+(cx+r*0.95)+' '+(cy-r*0.2)+' Q'+cx+' '+(cy-r*0.85)+' '+(cx-r*0.95)+' '+(cy-r*0.2)+' Z" fill="#1a1008"/>';
  if(hair==='brown')s+='<path d="M'+(cx-r*0.98)+' '+(cy-r*0.1)+' Q'+cx+' '+(cy-r*1.6)+' '+(cx+r*0.98)+' '+(cy-r*0.1)+' Q'+cx+' '+(cy-r*0.8)+' '+(cx-r*0.98)+' '+(cy-r*0.1)+' Z" fill="#6b4423"/>';
  if(hair==='band')s+='<path d="M'+(cx-r*0.95)+' '+(cy-r*0.2)+' Q'+cx+' '+(cy-r*1.45)+' '+(cx+r*0.95)+' '+(cy-r*0.2)+' Q'+cx+' '+(cy-r*0.85)+' '+(cx-r*0.95)+' '+(cy-r*0.2)+' Z" fill="#1a1008"/>'+
    '<rect x="'+(cx-r)+'" y="'+(cy-r*0.55)+'" width="'+(2*r)+'" height="'+(r*0.26)+'" rx="2" fill="#ffffff"/>';
  s+='<circle cx="'+(cx-r*0.35)+'" cy="'+(cy+r*0.05)+'" r="'+(r*0.12)+'" fill="#1a1008"/><circle cx="'+(cx+r*0.35)+'" cy="'+(cy+r*0.05)+'" r="'+(r*0.12)+'" fill="#1a1008"/>'+
    '<path d="M'+(cx-r*0.35)+' '+(cy+r*0.4)+' Q'+cx+' '+(cy+r*0.72)+' '+(cx+r*0.35)+' '+(cy+r*0.4)+'" stroke="#1a1008" stroke-width="'+Math.max(1.2,r*0.1)+'" fill="none" stroke-linecap="round"/>';
  if(hair==='band')s+='<path d="M'+(cx-r*0.55)+' '+(cy+r*0.45)+' Q'+cx+' '+(cy+r*1.15)+' '+(cx+r*0.55)+' '+(cy+r*0.45)+'" stroke="#1a1008" stroke-width="'+(r*0.14)+'" fill="none"/>';
  return s;
}
function avatarSVG(id,size){size=size||64;var p=playerById(id);
  var inner='<circle cx="32" cy="32" r="31" fill="'+p.c2+'" opacity=".25"/>'+
    '<path d="M10 64 L12 48 Q32 40 52 48 L54 64 Z" fill="'+p.c1+'" stroke="'+p.c2+'" stroke-width="2"/>'+
    '<text x="32" y="61" font-family="Impact,Arial Black,Helvetica" font-size="12" fill="'+p.c2+'" text-anchor="middle">'+p.num+'</text>'+
    '<rect x="28" y="36" width="8" height="8" fill="'+p.skin+'"/>'+
    headSVG(32,27,13,p.skin,p.hair);
  if(p.id==='p8'&&totalStars()>=12)inner+='<path d="M22 12 L25 5 L32 10 L39 5 L42 12 Z" fill="#fdb927" stroke="#b58a12"/>';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><clipPath id="cl'+size+id+'"><circle cx="32" cy="32" r="31"/></clipPath><circle cx="32" cy="32" r="31" fill="#f4ecdc"/><g clip-path="url(#cl'+size+id+')">'+inner+'</g><circle cx="32" cy="32" r="31" fill="none" stroke="'+p.c1+'" stroke-width="2"/></svg>';}
/* Coach Mamba : maillot violet et or 24, sifflet */
function coachSVG(size){size=size||40;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><clipPath id="clc'+size+'"><circle cx="32" cy="32" r="31"/></clipPath><circle cx="32" cy="32" r="31" fill="#1b1733"/><g clip-path="url(#clc'+size+')">'+
    '<path d="M8 64 L11 47 Q32 39 53 47 L56 64 Z" fill="#552583" stroke="#fdb927" stroke-width="2"/>'+
    '<text x="32" y="61" font-family="Impact,Arial Black,Helvetica" font-size="12" fill="#fdb927" text-anchor="middle">24</text>'+
    '<rect x="28" y="35" width="8" height="8" fill="#7a4a2a"/>'+
    headSVG(32,26,13,'#7a4a2a','short')+
    '<path d="M36 41 L44 44" stroke="#c9c9c9" stroke-width="1.2"/><rect x="42" y="42" width="7" height="4" rx="2" fill="#c9c9c9"/>'+
    '</g><circle cx="32" cy="32" r="31" fill="none" stroke="#fdb927" stroke-width="2.5"/></svg>';}
function starSVG(filled,size,pop){size=size||18;var c=filled?'#fdb927':'#e7dcc6',s=filled?'#c99100':'#d2c6ab';return '<svg class="'+(pop?'starpop':'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="'+starPts(12,12,10)+'" fill="'+c+'" stroke="'+s+'" stroke-width="1"/></svg>';}
function starRow(n){var h='';for(var i=0;i<3;i++)h+=starSVG(i<n,15,false);return h;}
function miniBadge(color,sym){var fs=String(sym).length>2?10:(String(sym).length>1?12:15);return '<svg width="38" height="40" viewBox="0 0 38 40" aria-hidden="true"><ellipse cx="19" cy="37" rx="9" ry="2.4" fill="#000" opacity=".12"/><circle cx="19" cy="18" r="16" fill="'+color+'"/><circle cx="19" cy="18" r="16" fill="none" stroke="#fdb927" stroke-width="1.5"/><text x="19" y="'+(18+fs*0.36)+'" font-family="Helvetica,Arial" font-size="'+fs+'" font-weight="900" fill="#fff" text-anchor="middle">'+sym+'</text></svg>';}
function lockSVG(){return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a4a2e" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';}
function decorBanner(){return '<div class="decor"><svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMid slice" width="100%" height="104" xmlns="http://www.w3.org/2000/svg">'+
  '<rect width="400" height="110" fill="#141a45"/>'+
  '<path d="M70 0 L20 80 L120 80 Z" fill="#fff" opacity=".06"/><path d="M330 0 L280 80 L380 80 Z" fill="#fff" opacity=".06"/>'+
  '<rect y="80" width="400" height="30" fill="#d9a15a"/><line x1="0" y1="80" x2="400" y2="80" stroke="#fff" stroke-width="2"/>'+
  '<rect x="42" y="30" width="6" height="50" fill="#9aa0b8"/><rect x="20" y="22" width="28" height="18" rx="2" fill="#fff" stroke="#c9c2b0"/><ellipse cx="34" cy="44" rx="10" ry="3.5" fill="none" stroke="#e8752a" stroke-width="3"/>'+
  '<rect x="352" y="30" width="6" height="50" fill="#9aa0b8"/><rect x="352" y="22" width="28" height="18" rx="2" fill="#fff" stroke="#c9c2b0"/><ellipse cx="366" cy="44" rx="10" ry="3.5" fill="none" stroke="#e8752a" stroke-width="3"/>'+
  '<rect x="150" y="12" width="100" height="30" rx="5" fill="#0b0b14" stroke="#fdb927" stroke-width="2"/><text x="200" y="33" font-family="Impact,Arial Black,Helvetica" font-size="17" fill="#ff5a3c" text-anchor="middle">NBA QUIZ</text>'+
  ballAt(262,66,13)+
  '</svg></div>';}

/* ============================================================
   ANIMATIONS : DUNK ou TIR A 3 POINTS apres une bonne reponse
   ============================================================ */
/* Joueur en pied, pieds a l'origine (0,0) ; bras droit leve (main vers 14,-100) */
function figSVG(p){
  return '<ellipse cx="0" cy="2" rx="16" ry="4" fill="#000" opacity=".25"/>'+
    '<line x1="-6" y1="-34" x2="-8" y2="-2" stroke="'+p.skin+'" stroke-width="7" stroke-linecap="round"/>'+
    '<line x1="6" y1="-34" x2="8" y2="-2" stroke="'+p.skin+'" stroke-width="7" stroke-linecap="round"/>'+
    '<rect x="-13" y="-4" width="11" height="6" rx="2" fill="#fff"/><rect x="2" y="-4" width="11" height="6" rx="2" fill="#fff"/>'+
    '<rect x="-14" y="-44" width="28" height="16" rx="4" fill="'+p.c1+'" stroke="'+p.c2+'" stroke-width="1.5"/>'+
    '<rect x="-14" y="-74" width="28" height="34" rx="7" fill="'+p.c1+'" stroke="'+p.c2+'" stroke-width="1.5"/>'+
    '<text x="0" y="-50" font-family="Impact,Arial Black,Helvetica" font-size="15" fill="'+p.c2+'" text-anchor="middle">'+p.num+'</text>'+
    '<line x1="-12" y1="-68" x2="-24" y2="-48" stroke="'+p.skin+'" stroke-width="6" stroke-linecap="round"/>'+
    '<line x1="11" y1="-70" x2="14" y2="-98" stroke="'+p.skin+'" stroke-width="6" stroke-linecap="round"/>'+
    headSVG(0,-86,11,p.skin,p.hair);
}
function fxCourt(){
  var s='<rect width="400" height="260" fill="#141a45"/>';
  var cols=['#e8752a','#fdb927','#6a5acd','#c0392b','#2e9e5b','#ffffff'];
  for(var r=0;r<4;r++){for(var x=8+(r%2)*9;x<400;x+=18){s+='<circle cx="'+x+'" cy="'+(120+r*11)+'" r="4.5" fill="'+cols[(x+r*5)%cols.length]+'" opacity=".35"/>';}}
  s+='<rect y="168" width="400" height="92" fill="#d9a15a"/>';
  for(var k=20;k<400;k+=34){s+='<line x1="'+k+'" y1="168" x2="'+k+'" y2="260" stroke="#c98c45"/>';}
  s+='<line x1="0" y1="168" x2="400" y2="168" stroke="#fff" stroke-width="2"/>';
  /* poteau, panneau, arceau, filet (arceau entre x=276 et 324, y=80) */
  s+='<rect x="352" y="60" width="8" height="160" fill="#9aa0b8"/>'+
    '<rect x="330" y="20" width="10" height="84" fill="#fff" stroke="#c9c2b0"/><rect x="340" y="60" width="14" height="6" fill="#9aa0b8"/>';
  return s;
}
function fxRimNet(netCls){
  return '<g class="fx-rim"><path d="M276 80 L330 80" stroke="#e8752a" stroke-width="5" stroke-linecap="round"/></g>'+
    '<path class="fx-net '+netCls+'" d="M278 82 L286 114 M290 82 L294 114 M302 82 L302 114 M314 82 L310 114 M326 82 L318 114 M282 96 h42 M286 110 h32" stroke="#f2f2f2" stroke-width="1.6" fill="none"/>';
}
function dunkSVG(p,big){
  return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">'+fxCourt()+
    '<g class="fx-drop">'+ballAt(300,70,11)+'</g>'+
    '<g class="fx-jump"><g transform="translate(90,222)">'+figSVG(p)+'<g class="fx-hand">'+ballAt(14,-106,11)+'</g></g></g>'+
    fxRimNet('d')+
    '<g class="fx-word"><text x="150" y="70" font-family="Impact,Arial Black,Helvetica" font-size="'+(big?44:52)+'" fill="#fdb927" stroke="#1b1733" stroke-width="3" text-anchor="middle" paint-order="stroke">'+(big?'MÉGA DUNK !':'DUNK !')+'</text>'+
    '<text x="150" y="98" font-family="Helvetica,Arial" font-size="18" font-weight="900" fill="#fff" text-anchor="middle">+2 POINTS</text></g>'+
    '</svg>';
}
function threeSVG(p){
  return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">'+fxCourt()+
    '<path d="M0 250 Q180 196 200 168" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>'+
    '<text x="120" y="244" font-family="Helvetica,Arial" font-size="11" font-weight="900" fill="#fff" opacity=".9">LIGNE À 3 POINTS</text>'+
    '<path class="fx-trail" d="M96 112 Q200 -40 300 70" stroke="#fdb927" stroke-width="2.5" fill="none"/>'+
    '<g class="fx-shooter"><g transform="translate(70,232)">'+figSVG(p)+'</g></g>'+
    '<g class="fx-bx"><g class="fx-by"><g class="fx-bd">'+ballAt(94,108,11)+'</g></g></g>'+
    fxRimNet('t')+
    '<g class="fx-word t"><text x="200" y="58" font-family="Impact,Arial Black,Helvetica" font-size="48" fill="#fdb927" stroke="#1b1733" stroke-width="3" text-anchor="middle" paint-order="stroke">SWISH ! +3</text></g>'+
    '</svg>';
}

/* ============================================================
   VERSIONS "IMAGE D'ABORD" : l'image Gemini si elle existe,
   sinon le dessin SVG ci-dessus.
   ============================================================ */
function avatarHTML(id,size){
  if(Assets.has('players/'+id))return '<img class="avimg" src="'+Assets.url('players/'+id)+'" width="'+size+'" height="'+size+'" alt="" draggable="false">';
  return avatarSVG(id,size);
}
/* mood : '' (normal) | 'happy' | 'thinking' | 'cheer' */
function coachHTML(size,mood){
  var k=mood?'coach/coach-'+mood:'coach/coach-mamba';
  if(!Assets.has(k))k='coach/coach-mamba';
  if(Assets.has(k))return '<img class="avimg coachimg" src="'+Assets.url(k)+'" width="'+size+'" height="'+size+'" alt="" draggable="false">';
  return coachSVG(size);
}
function bannerHTML(){
  if(Assets.has('brand/banner'))return '<div class="decor">'+Assets.img('brand/banner','bannerimg')+'</div>';
  return decorBanner();
}
function categoryIcon(lvl){
  var key={1:'legendes',2:'stars',3:'france',4:'nba',all:'mix'}[lvl];
  if(Assets.has('categories/'+key))return '<img class="catimg" src="'+Assets.url('categories/'+key)+'" alt="" draggable="false">';
  if(lvl==='all')return miniBadge('#8a6420','★');
  return miniBadge(LEVELS[lvl].color,LEVELS[lvl].sym);
}

/* --- éléments des grandes animations --- */
function foamFingerHTML(color){
  if(Assets.has('fx/foam-finger'))return Assets.img('fx/foam-finger','fximg');
  color=color||'#552583';
  return '<svg viewBox="0 0 160 260" class="fximg" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="44" y="190" width="72" height="70" rx="10" fill="'+color+'" stroke="#fdb927" stroke-width="5"/>'+
    '<path d="M30 110 Q28 90 46 88 L114 88 Q134 88 132 112 L128 186 Q126 204 106 204 L52 204 Q32 204 32 186 Z" fill="'+color+'" stroke="#fdb927" stroke-width="5"/>'+
    '<path d="M62 92 L62 22 Q62 6 80 6 Q98 6 98 22 L98 92" fill="'+color+'" stroke="#fdb927" stroke-width="5"/>'+
    '<path d="M32 124 Q14 118 16 100 Q20 84 38 92" fill="'+color+'" stroke="#fdb927" stroke-width="5"/>'+
    '<path d="M50 118 h60 M50 140 h60" stroke="#fdb927" stroke-width="3" opacity=".5"/>'+
    '<text x="80" y="182" font-family="Impact,Arial Black,Helvetica" font-size="46" fill="#fdb927" text-anchor="middle">#1</text>'+
    '</svg>';
}
function explosionHTML(){
  if(Assets.has('fx/explosion'))return Assets.img('fx/explosion','fximg');
  function burst(r1,r2,n,fill,rot){var p='';for(var i=0;i<n*2;i++){var a=(i/(n*2))*Math.PI*2+(rot||0),r=(i%2)?r2:r1;p+=(200+Math.cos(a)*r).toFixed(1)+','+(200+Math.sin(a)*r).toFixed(1)+' ';}return '<polygon points="'+p+'" fill="'+fill+'"/>';}
  return '<svg viewBox="0 0 400 400" class="fximg" xmlns="http://www.w3.org/2000/svg">'+
    burst(195,120,14,'#c8102e',0)+burst(160,95,12,'#e8752a',.2)+burst(120,70,10,'#fdb927',.1)+burst(70,45,8,'#fff6c9',.3)+'</svg>';
}
function fireballHTML(){
  if(Assets.has('fx/fireball'))return Assets.img('fx/fireball','fximg');
  return '<svg viewBox="0 0 200 240" class="fximg" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M100 8 Q128 60 150 40 Q176 100 170 150 L30 150 Q24 100 50 44 Q70 72 100 8 Z" fill="#c8102e"/>'+
    '<path d="M100 40 Q118 80 134 66 Q152 110 146 150 L54 150 Q50 110 66 76 Q82 96 100 40 Z" fill="#e8752a"/>'+
    '<path d="M100 76 Q112 104 122 96 Q132 124 128 150 L72 150 Q70 124 80 106 Q90 116 100 76 Z" fill="#fdb927"/>'+
    '<g transform="translate(0,30)">'+ballAt(100,150,56).replace(/stroke-width="1"/g,'stroke-width="3"').replace(/stroke-width=".9"/g,'stroke-width="3"')+'</g>'+
    '</svg>';
}
function trophyHTML(){
  if(Assets.has('fx/trophy'))return Assets.img('fx/trophy','fximg');
  return '<svg viewBox="0 0 200 240" class="fximg" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="60" y="206" width="80" height="26" rx="4" fill="#8a6420"/>'+
    '<path d="M80 206 L88 150 L112 150 L120 206 Z" fill="#f5c542" stroke="#b58a12" stroke-width="3"/>'+
    '<path d="M50 70 L150 70 L136 150 L64 150 Z" fill="#fdd75a" stroke="#b58a12" stroke-width="3"/>'+
    ballAt(100,46,30)+'</svg>';
}
