/* ============================================================
   SCHÉMAS DE TERRAIN POUR L'ÉCOLE DES RÈGLES
   Repris du quiz "Coup de sifflet v3" (dessins SVG, sans image).
   Tout est rangé dans RA.* pour ne pas se mélanger avec art.js.
   ============================================================ */
var RA=(function(){
var VB = '0 0 400 230';
function svg(inner){
  return '<svg class="scene" viewBox="'+VB+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">'+
    '<defs>'+
    '<marker id="ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#c81d25"/></marker>'+
    '<marker id="ad" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#20140a"/></marker>'+
    '</defs>'+inner+'</svg>';
}
function parquet(){
  var s='<rect x="0" y="0" width="400" height="230" fill="#e4b678"/>';
  for(var x=32;x<400;x+=34){ s+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="230" stroke="#d5a458" stroke-width="1"/>'; }
  return s;
}
function hoopTop(cx){
  return '<rect x="'+(cx-26)+'" y="16" width="52" height="5" rx="1.5" fill="#ffffff" stroke="#c9c2b0"/>'+
    '<line x1="'+cx+'" y1="21" x2="'+cx+'" y2="28" stroke="#8a8a80" stroke-width="2"/>'+
    '<ellipse cx="'+cx+'" cy="31" rx="9" ry="4" fill="none" stroke="#e8873a" stroke-width="2.5"/>';
}
function hcLines(){
  return '<rect x="18" y="14" width="364" height="202" fill="none" stroke="#ffffff" stroke-width="2.5"/>'+
    '<rect x="162" y="14" width="76" height="96" fill="#d89a48" stroke="#ffffff" stroke-width="2"/>'+
    '<path d="M166,110 A34,34 0 0 1 234,110" fill="none" stroke="#ffffff" stroke-width="2"/>'+
    '<path d="M166,110 A34,34 0 0 0 234,110" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="5 4"/>'+
    '<path d="M46,14 L46,80 Q200,196 354,80 L354,14" fill="none" stroke="#ffffff" stroke-width="2"/>'+
    '<path d="M170,216 A30,30 0 0 0 230,216" fill="none" stroke="#ffffff" stroke-width="2"/>'+
    hoopTop(200);
}
function hc(inner){ return svg(parquet()+hcLines()+(inner||'')); }
function fc(inner){
  return svg(parquet()+
    '<rect x="14" y="26" width="372" height="178" fill="none" stroke="#ffffff" stroke-width="2.5"/>'+
    '<line x1="200" y1="26" x2="200" y2="204" stroke="#ffffff" stroke-width="2"/>'+
    '<circle cx="200" cy="115" r="26" fill="none" stroke="#ffffff" stroke-width="2"/>'+
    '<rect x="14" y="90" width="52" height="50" fill="#d89a48" stroke="#ffffff" stroke-width="1.5"/>'+
    '<rect x="334" y="90" width="52" height="50" fill="#d89a48" stroke="#ffffff" stroke-width="1.5"/>'+
    '<rect x="10" y="98" width="5" height="34" rx="1.5" fill="#ffffff" stroke="#c9c2b0"/>'+
    '<ellipse cx="24" cy="115" rx="4" ry="9" fill="none" stroke="#e8873a" stroke-width="2.5"/>'+
    '<rect x="385" y="98" width="5" height="34" rx="1.5" fill="#ffffff" stroke="#c9c2b0"/>'+
    '<ellipse cx="376" cy="115" rx="4" ry="9" fill="none" stroke="#e8873a" stroke-width="2.5"/>'+
    (inner||''));
}
function fair(inner){ return svg(parquet()+'<rect x="0" y="0" width="400" height="230" fill="#f2ddb8" opacity=".28"/>'+(inner||'')); }

function ball(x,y){
  var r=8;
  return '<ellipse cx="'+x+'" cy="'+(y+r-1)+'" rx="'+(r-1)+'" ry="3" fill="#000000" opacity=".16"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#e07d2e" stroke="#b5601c" stroke-width="1"/>'+
    '<path d="M'+(x-r)+' '+y+' h'+(2*r)+' M'+x+' '+(y-r)+' v'+(2*r)+'" stroke="#7a3f10" stroke-width="1"/>'+
    '<path d="M'+(x-r)+' '+(y-2.5)+' q'+r+' 3.5 '+(2*r)+' 0 M'+(x-r)+' '+(y+2.5)+' q'+r+' -3.5 '+(2*r)+' 0" stroke="#7a3f10" stroke-width=".8" fill="none"/>';
}
function player(x,y,color,letter){
  return '<ellipse cx="'+x+'" cy="'+(y+13)+'" rx="10" ry="3" fill="#000000" opacity=".14"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="12" fill="'+color+'" stroke="#ffffff" stroke-width="2"/>'+
    '<text x="'+x+'" y="'+(y+4)+'" font-family="Helvetica,Arial" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">'+letter+'</text>';
}
function smallTok(x,y,c){ return '<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+c+'" stroke="#ffffff" stroke-width="1.5"/>'; }
function tag(x,y,txt){
  var w=txt.length*6.0+16;
  if(x-w/2<4)x=w/2+4; if(x+w/2>396)x=396-w/2;
  return '<rect x="'+(x-w/2)+'" y="'+(y-11)+'" width="'+w+'" height="18" rx="9" fill="#20140a" opacity=".85"/>'+
    '<text x="'+x+'" y="'+(y+1.5)+'" font-family="Helvetica,Arial" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">'+txt+'</text>';
}
function foot(x,y,n){
  return '<ellipse cx="'+x+'" cy="'+y+'" rx="5" ry="8" fill="#3a2a1a" opacity=".55"/>'+
    (n!==undefined?'<text x="'+x+'" y="'+(y-11)+'" font-family="Helvetica,Arial" font-size="11" font-weight="700" fill="#20140a" text-anchor="middle">'+n+'</text>':'');
}
function bounce(x,y){
  return '<path d="M'+(x-3)+' '+(y+11)+' q6 7 12 0" fill="none" stroke="#7a3f10" stroke-width="1.5"/>'+
    '<path d="M'+(x-9)+' '+(y+15)+' q9 9 18 0" fill="none" stroke="#7a3f10" stroke-width="1.2" opacity=".55"/>';
}
function bump(x,y){
  return '<g stroke="#c81d25" stroke-width="2.5" stroke-linecap="round">'+
    '<line x1="'+(x-9)+'" y1="'+y+'" x2="'+(x-3)+'" y2="'+y+'"/>'+
    '<line x1="'+(x+3)+'" y1="'+y+'" x2="'+(x+9)+'" y2="'+y+'"/>'+
    '<line x1="'+x+'" y1="'+(y-9)+'" x2="'+x+'" y2="'+(y-3)+'"/>'+
    '<line x1="'+x+'" y1="'+(y+3)+'" x2="'+x+'" y2="'+(y+9)+'"/>'+
    '</g>';
}
function shotClock(x,y,n){
  return '<rect x="'+(x-17)+'" y="'+(y-14)+'" width="34" height="28" rx="4" fill="#161616" stroke="#000000"/>'+
    '<text x="'+x+'" y="'+(y+6)+'" font-family="Helvetica,Arial" font-size="16" font-weight="800" fill="#ff5a3c" text-anchor="middle">'+n+'</text>';
}
function hand(x,y){
  return '<rect x="'+(x-3)+'" y="'+y+'" width="6" height="18" rx="3" fill="#e8c49a" stroke="#b98d5f"/>'+
    '<ellipse cx="'+x+'" cy="'+y+'" rx="8" ry="7" fill="#e8c49a" stroke="#b98d5f"/>';
}
function ref(x,y){
  return '<circle cx="'+x+'" cy="'+(y-16)+'" r="7" fill="#e8c49a" stroke="#b98d5f"/>'+
    '<rect x="'+(x-9)+'" y="'+(y-9)+'" width="18" height="26" rx="4" fill="#fafafa"/>'+
    '<line x1="'+(x-9)+'" y1="'+(y-2)+'" x2="'+(x+9)+'" y2="'+(y-2)+'" stroke="#222" stroke-width="2"/>'+
    '<line x1="'+(x-9)+'" y1="'+(y+4)+'" x2="'+(x+9)+'" y2="'+(y+4)+'" stroke="#222" stroke-width="2"/>'+
    '<line x1="'+(x-9)+'" y1="'+(y+10)+'" x2="'+(x+9)+'" y2="'+(y+10)+'" stroke="#222" stroke-width="2"/>';
}
function arrowR(x1,y1,x2,y2){ return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#c81d25" stroke-width="2.5" marker-end="url(#ah)"/>'; }
function arrowD(x1,y1,x2,y2){ return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#20140a" stroke-width="2.5" marker-end="url(#ad)"/>'; }

/* --- personnages "enfant" pour scenes fair-play --- */
function kid(x,y,jersey,pose){
  pose=pose||'stand';
  var skin='#f0c8a0';
  var head='<circle cx="'+x+'" cy="'+(y-20)+'" r="9" fill="'+skin+'" stroke="#c99a6a"/>';
  var torso='<rect x="'+(x-9)+'" y="'+(y-11)+'" width="18" height="24" rx="7" fill="'+jersey+'"/>';
  var legs='<line x1="'+(x-5)+'" y1="'+(y+13)+'" x2="'+(x-6)+'" y2="'+(y+28)+'" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>'+
           '<line x1="'+(x+5)+'" y1="'+(y+13)+'" x2="'+(x+6)+'" y2="'+(y+28)+'" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>';
  var arms='<line x1="'+(x-8)+'" y1="'+(y-6)+'" x2="'+(x-13)+'" y2="'+(y+8)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/>'+
           '<line x1="'+(x+8)+'" y1="'+(y-6)+'" x2="'+(x+13)+'" y2="'+(y+8)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/>';
  if(pose==='armsup'){ arms='<line x1="'+(x-8)+'" y1="'+(y-6)+'" x2="'+(x-18)+'" y2="'+(y-20)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/><line x1="'+(x+8)+'" y1="'+(y-6)+'" x2="'+(x+18)+'" y2="'+(y-20)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/>'; }
  else if(pose==='handout'){ arms='<line x1="'+(x-8)+'" y1="'+(y-4)+'" x2="'+(x-14)+'" y2="'+(y+6)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/><line x1="'+(x+8)+'" y1="'+(y-4)+'" x2="'+(x+22)+'" y2="'+(y-2)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/>'; }
  else if(pose==='defense'){
    arms='<line x1="'+(x-8)+'" y1="'+(y-6)+'" x2="'+(x-22)+'" y2="'+(y-2)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/><line x1="'+(x+8)+'" y1="'+(y-6)+'" x2="'+(x+22)+'" y2="'+(y-2)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/>';
    legs='<line x1="'+(x-6)+'" y1="'+(y+13)+'" x2="'+(x-13)+'" y2="'+(y+28)+'" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/><line x1="'+(x+6)+'" y1="'+(y+13)+'" x2="'+(x+13)+'" y2="'+(y+28)+'" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>'; }
  else if(pose==='fallen'){
    head='<circle cx="'+(x-16)+'" cy="'+(y+8)+'" r="9" fill="'+skin+'" stroke="#c99a6a"/>';
    torso='<rect x="'+(x-12)+'" y="'+(y+4)+'" width="26" height="13" rx="6" fill="'+jersey+'"/>';
    legs='<line x1="'+(x+12)+'" y1="'+(y+11)+'" x2="'+(x+28)+'" y2="'+(y+9)+'" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>';
    arms='<line x1="'+(x-4)+'" y1="'+(y+6)+'" x2="'+(x-12)+'" y2="'+(y-4)+'" stroke="'+skin+'" stroke-width="4" stroke-linecap="round"/>'; }
  return '<ellipse cx="'+x+'" cy="'+(y+30)+'" rx="15" ry="4" fill="#000000" opacity=".12"/>'+arms+torso+head+legs;
}
function heart(x,y,s){ s=s||1; return '<path d="M'+x+' '+(y+4*s)+' C'+(x-6*s)+' '+(y-4*s)+' '+(x-9*s)+' '+(y+3*s)+' '+x+' '+(y+9*s)+' C'+(x+9*s)+' '+(y+3*s)+' '+(x+6*s)+' '+(y-4*s)+' '+x+' '+(y+4*s)+' Z" fill="#e04b6a"/>'; }
function cone(x,y){ return '<path d="M'+(x-8)+' '+y+' L'+x+' '+(y-16)+' L'+(x+8)+' '+y+' Z" fill="#e8873a" stroke="#b5601c"/>'; }
function coach(x,y){ return kid(x,y,'#2b6b3a','stand')+'<rect x="'+(x+11)+'" y="'+(y-4)+'" width="12" height="16" rx="1" fill="#fff" stroke="#888"/>'; }

/* --- scenes de jeu --- */
function sceneShoot(){ return hc(player(168,92,'#2f6fed','A')+ball(200,66)+tag(300,150,'Panier : 2 points')); }
function sceneThree(){ return hc('<path d="M46,14 L46,80 Q200,196 354,80 L354,14" fill="none" stroke="#e8873a" stroke-width="4" opacity=".8"/>'+player(300,124,'#2f6fed','A')+ball(300,142)+tag(200,206,"Derrière l'arc")); }
function sceneFreeThrow(){ return hc(smallTok(160,55,'#c81d25')+smallTok(240,55,'#2f6fed')+smallTok(160,84,'#2f6fed')+smallTok(240,84,'#c81d25')+player(200,120,'#2f6fed','A')+ball(200,138)+tag(305,178,'Lancer franc')); }
function sceneTeam(){
  var s=''; var blue=[[70,72],[140,60],[120,150],[62,120],[182,110]]; var red=[[330,72],[262,60],[280,150],[338,120],[220,110]];
  for(var i=0;i<5;i++){ s+=player(blue[i][0],blue[i][1],'#2f6fed',(i+1)); }
  for(var j=0;j<5;j++){ s+=player(red[j][0],red[j][1],'#c81d25',(j+1)); }
  return fc(s+tag(200,220,'5 contre 5'));
}
function sceneDribble(){ return hc(player(200,138,'#2f6fed','A')+ball(216,160)+bounce(216,160)+tag(200,206,'Le dribble')); }
function sceneHold(){ return hc(player(200,145,'#2f6fed','A')+ball(200,131)+tag(200,206,'Ballon tenu à deux mains')); }
function sceneSteps(labs,tagtxt){ var s=player(150,150,'#2f6fed','A')+ball(136,168); for(var i=0;i<labs.length;i++){ s+=foot(labs[i][0],labs[i][1],labs[i][2]); } return hc(s+tag(290,200,tagtxt)); }
function scenePivot(){ return hc(player(200,150,'#2f6fed','A')+'<circle cx="192" cy="170" r="7" fill="none" stroke="#c81d25" stroke-width="2.5"/>'+'<path d="M212,166 a15,15 0 1 1 -7,-12" fill="none" stroke="#20140a" stroke-width="2" marker-end="url(#ad)"/>'+tag(200,206,'Pied de pivot fixe')); }
function sceneSideline(){ return hc('<line x1="382" y1="14" x2="382" y2="216" stroke="#e8873a" stroke-width="4" opacity=".7"/>'+player(360,120,'#2f6fed','A')+ball(378,120)+tag(224,206,'Sur la ligne = dehors')); }
function sceneInbound(clock){ return hc(ball(392,120)+player(370,120,'#2f6fed','A')+arrowR(388,120,352,120)+(clock?shotClock(120,55,clock):'')+tag(224,206,'Remise en jeu')); }
function sceneInboundMini(){ return hc(ball(392,120)+player(370,120,'#2f6fed','A')+player(340,120,'#c81d25','D')+'<path d="M340 132 q-10 4 0 8 q10 -4 0 -8" fill="none" stroke="#20140a" stroke-width="2"/>'+tag(210,206,'Défenseur : mains dans le dos')); }
function sceneJump(){ return fc(player(178,115,'#2f6fed','A')+player(222,115,'#c81d25','D')+ball(200,70)+arrowD(200,84,200,60)+tag(200,220,'Entre-deux au centre')); }
function sceneKey(){ return hc('<rect x="162" y="14" width="76" height="96" fill="#e8873a" opacity=".38"/>'+player(200,70,'#2f6fed','A')+shotClock(310,58,'3')+tag(200,150,'La raquette')); }
function sceneContact(tagtxt){ return hc(player(188,140,'#2f6fed','A')+player(214,140,'#c81d25','D')+bump(201,140)+ball(178,158)+tag(200,206,tagtxt)); }
function sceneCharge(){ return hc(player(200,172,'#2f6fed','A')+ball(200,188)+player(200,118,'#c81d25','D')+bump(200,146)+arrowR(200,159,200,133)+tag(300,204,"L'attaquant fonce")); }
function sceneHeld(){ return hc(player(186,145,'#2f6fed','A')+player(214,145,'#c81d25','D')+ball(200,131)+tag(200,206,'Ballon tenu')); }
function sceneSteal(){ return hc(player(186,145,'#2f6fed','A')+player(214,145,'#c81d25','D')+ball(200,140)+hand(212,126)+tag(200,206,'Prendre le ballon proprement')); }
function sceneShootFoul(){ return hc(player(180,95,'#2f6fed','A')+player(206,95,'#c81d25','D')+bump(193,95)+ball(200,66)+tag(200,150,'Panier + faute')); }
function sceneThreeFoul(){ return hc('<path d="M46,14 L46,80 Q200,196 354,80 L354,14" fill="none" stroke="#e8873a" stroke-width="4" opacity=".7"/>'+player(292,118,'#2f6fed','A')+player(302,140,'#c81d25','D')+bump(298,130)+ball(292,136)+tag(200,206,'Faute sur tir à 3 pts')); }
function sceneBackcourt(clock,tagtxt){ return fc('<line x1="200" y1="26" x2="200" y2="204" stroke="#e8873a" stroke-width="4" opacity=".6"/>'+player(242,115,'#2f6fed','A')+ball(226,132)+arrowR(216,120,150,120)+(clock?shotClock(305,55,clock):'')+tag(200,220,tagtxt)); }
function sceneClock(n,tagtxt){ return hc(player(210,150,'#2f6fed','A')+ball(226,168)+shotClock(322,50,n)+tag(200,206,tagtxt)); }
function sceneAttack(){ return fc(player(196,115,'#2f6fed','A')+ball(212,132)+arrowR(228,120,330,120)+tag(200,220,'Tu attaques ce panier')); }
function sceneTech(){ return hc(player(150,140,'#c81d25','A')+'<line x1="150" y1="128" x2="139" y2="112" stroke="#c81d25" stroke-width="2.5"/><line x1="150" y1="128" x2="161" y2="112" stroke="#c81d25" stroke-width="2.5"/>'+ref(262,138)+tag(200,206,'Faute technique')); }
function sceneGoaltend(mode){
  var s='<rect x="150" y="40" width="100" height="8" rx="2" fill="#ffffff" stroke="#c9c2b0"/>'+
    '<rect x="192" y="48" width="16" height="12" fill="#ffffff" stroke="#c9c2b0"/>'+
    '<line x1="200" y1="60" x2="200" y2="70" stroke="#8a8a80" stroke-width="3"/>'+
    '<ellipse cx="200" cy="80" rx="26" ry="9" fill="none" stroke="#e8873a" stroke-width="4"/>'+
    '<path d="M178 82 L182 100 M200 84 L200 104 M222 82 L218 100 M186 92 h28" stroke="#dddddd" stroke-width="1" fill="none"/>';
  if(mode==='rim'){ s+=ball(200,72)+hand(244,96)+tag(200,178,"Ballon sur l'anneau"); }
  else { s+=ball(200,44)+arrowD(200,54,200,72)+hand(240,90)+tag(200,178,'Ballon qui redescend'); }
  return svg(parquet()+'<rect x="14" y="14" width="372" height="202" fill="none" stroke="#ffffff" stroke-width="2.5"/>'+s);
}
function sceneWrongBasket(){ return fc(player(72,140,'#2f6fed','A')+ball(40,115)+arrowR(56,120,26,116)+tag(200,220,'Panier dans son propre camp')); }

/* --- scenes categorie / mini-basket --- */
function sceneHoopHeight(mode){
  var high=(mode==='high'); var y= high?58:92;
  var lbl= high?'3,05 m (les grands)':'2,60 m (mini-basket)';
  return svg(parquet()+
    '<rect x="70" y="'+y+'" width="6" height="'+(196-y)+'" fill="#bcbcb2" stroke="#999"/>'+
    '<rect x="40" y="'+(y-16)+'" width="34" height="26" rx="2" fill="#fff" stroke="#c9c2b0"/>'+
    '<ellipse cx="52" cy="'+(y+4)+'" rx="12" ry="4" fill="none" stroke="#e8873a" stroke-width="3"/>'+
    '<line x1="24" y1="196" x2="24" y2="'+(y+4)+'" stroke="#c81d25" stroke-width="1.5" stroke-dasharray="4 3"/>'+
    kid(240,168,'#2f6fed','armsup')+ball(268,150)+
    '<line x1="14" y1="196" x2="386" y2="196" stroke="#7a3f10" stroke-width="2"/>'+
    tag(200,214,lbl));
}
function sceneBallSize(mode){
  function b(x,y,r,txt,hi){ return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#e07d2e" stroke="'+(hi?'#c81d25':'#b5601c')+'" stroke-width="'+(hi?3.5:1.5)+'"/>'+'<path d="M'+(x-r)+' '+y+' h'+(2*r)+' M'+x+' '+(y-r)+' v'+(2*r)+'" stroke="#7a3f10" stroke-width="1.2"/>'+'<path d="M'+(x-r)+' '+(y-3)+' q'+r+' 4 '+(2*r)+' 0 M'+(x-r)+' '+(y+3)+' q'+r+' -4 '+(2*r)+' 0" stroke="#7a3f10" stroke-width=".8" fill="none"/>'+tag(x,y+r+16,txt); }
  return svg(parquet()+
    b(95,100,19,'Taille 5',mode!=='t6'&&mode!=='t7')+
    b(205,100,26,'Taille 6',mode==='t6')+
    b(325,100,32,'Taille 7',mode==='t7')+
    tag(200,205,'On grandit, le ballon grandit'));
}
function sceneStance(){ return fair(kid(200,150,'#2f6fed','defense')+tag(200,205,'Genoux pliés, bras écartés, prêt à bouger')); }
function sceneDefIndiv(){ return fair(kid(115,150,'#c81d25','defense')+kid(148,150,'#2f6fed','stand')+ball(148,150)+kid(252,150,'#c81d25','defense')+kid(285,150,'#2f6fed','stand')+ball(285,150)+tag(200,205,'Un défenseur par attaquant')); }
function sceneProtect(){ return fair(kid(180,150,'#2f6fed','stand')+ball(160,158)+kid(232,150,'#c81d25','handout')+tag(200,205,'Je protège le ballon avec mon corps')); }
function sceneLook(){ return fair(kid(150,150,'#2f6fed','stand')+ball(131,168)+smallTok(300,95,'#2f6fed')+smallTok(315,180,'#2f6fed')+'<line x1="162" y1="132" x2="292" y2="98" stroke="#20140a" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="162" y1="136" x2="307" y2="176" stroke="#20140a" stroke-width="1.2" stroke-dasharray="4 3"/>'+tag(150,205,'Je lève la tête et je regarde')); }

/* --- scenes fair-play --- */
function sceneJAP(){ return fair('<rect x="118" y="132" width="164" height="15" fill="#5a3a22"/><rect x="128" y="147" width="10" height="40" fill="#5a3a22"/><rect x="262" y="147" width="10" height="40" fill="#5a3a22"/>'+kid(200,124,'#e8952e','stand')+'<circle cx="223" cy="120" r="5" fill="#161616"/><line x1="223" y1="120" x2="231" y2="114" stroke="#161616" stroke-width="2"/>'+tag(200,205,"J.A.P. : Je Joue, j'Arbitre, je Participe")); }
function sceneHandshake(){ return fair(kid(158,150,'#2f6fed','handout')+kid(242,150,'#c81d25','stand')+'<line x1="234" y1="146" x2="196" y2="150" stroke="#f0c8a0" stroke-width="4" stroke-linecap="round"/>'+heart(200,116,1.3)+tag(200,205,'On se serre la main à la fin')); }
function sceneCheer(){ return fair(kid(200,150,'#2f6fed','armsup')+heart(150,102,1.5)+heart(258,92,1.1)+heart(300,124,1.25)+tag(200,205,"J'encourage mes coéquipiers")); }
function sceneListen(){ return fair(coach(135,150)+kid(238,155,'#2f6fed','stand')+kid(292,155,'#e8952e','stand')+tag(135,116,'Coach')+tag(255,208,"J'écoute les consignes")); }
function sceneTidy(){ return fair(kid(150,150,'#2f6fed','handout')+cone(238,182)+cone(262,182)+cone(286,182)+ball(250,150)+tag(190,205,"J'aide à ranger le matériel")); }
function sceneRef(){ return fair(ref(150,150)+kid(255,155,'#2f6fed','stand')+tag(150,116,'Arbitre')+tag(250,208,'On respecte ses décisions')); }
function sceneHelp(){ return fair(kid(158,140,'#2f6fed','handout')+kid(252,150,'#c81d25','fallen')+tag(200,205,'On aide celui qui tombe')); }
function scenePlay(){ return fair(kid(150,150,'#2f6fed','armsup')+kid(250,150,'#e8952e','armsup')+ball(200,120)+heart(200,90,1.2)+tag(200,205,'Le jeu et pas l\'enjeu')); }
return {sceneShoot:sceneShoot,sceneThree:sceneThree,sceneFreeThrow:sceneFreeThrow,sceneTeam:sceneTeam,sceneDribble:sceneDribble,sceneHold:sceneHold,sceneSteps:sceneSteps,scenePivot:scenePivot,sceneSideline:sceneSideline,sceneInbound:sceneInbound,sceneInboundMini:sceneInboundMini,sceneJump:sceneJump,sceneKey:sceneKey,sceneContact:sceneContact,sceneCharge:sceneCharge,sceneHeld:sceneHeld,sceneSteal:sceneSteal,sceneShootFoul:sceneShootFoul,sceneThreeFoul:sceneThreeFoul,sceneBackcourt:sceneBackcourt,sceneClock:sceneClock,sceneAttack:sceneAttack,sceneTech:sceneTech,sceneGoaltend:sceneGoaltend,sceneWrongBasket:sceneWrongBasket,sceneHoopHeight:sceneHoopHeight,sceneBallSize:sceneBallSize,sceneStance:sceneStance,sceneDefIndiv:sceneDefIndiv,sceneProtect:sceneProtect,sceneLook:sceneLook,sceneJAP:sceneJAP,sceneHandshake:sceneHandshake,sceneCheer:sceneCheer,sceneListen:sceneListen,sceneTidy:sceneTidy,sceneRef:sceneRef,sceneHelp:sceneHelp,scenePlay:scenePlay,svg:svg,hc:hc,fc:fc,fair:fair,ball:ball,player:player,tag:tag,shotClock:shotClock,kid:kid,ref:ref,bump:bump};
})();

/* ============================================================
   GESTES DE L'ARBITRE (FIBA) : petit arbitre en maillot rayé
   refSignalSVG('foul') ... chaque geste = position des 2 bras
   ============================================================ */
var REF_SIGNALS={
  foul:    {name:'Faute personnelle', txt:"Le poing fermé, bras levé : l'arbitre arrête le jeu parce qu'il y a une faute."},
  p1:      {name:'1 point',           txt:"Un doigt levé : le lancer franc est réussi, 1 point."},
  p2:      {name:'2 points',          txt:"Deux doigts levés : panier à 2 points."},
  p3:      {name:'3 points réussi',   txt:"Les deux bras levés avec 3 doigts : le tir à 3 points est rentré !"},
  travel:  {name:'Marcher',           txt:"Il fait tourner ses poings l'un autour de l'autre, comme un moulin : trop de pas avec le ballon."},
  dribble: {name:'Reprise de dribble',txt:"Il fait le geste de dribbler avec les deux mains, l'une après l'autre : dribble interdit."},
  three:   {name:'3 secondes',        txt:"Bras tendu sur le côté avec 3 doigts : un attaquant est resté trop longtemps dans la raquette."},
  shotclock:{name:'24 secondes',      txt:"Il touche son épaule avec les doigts : l'équipe n'a pas tiré à temps."},
  timeout: {name:'Temps-mort',        txt:"Les mains forment un T : un coach a demandé une minute de pause."},
  sub:     {name:'Remplacement',      txt:"Les avant-bras croisés devant la poitrine : un joueur peut entrer sur le terrain."},
  charge:  {name:'Passage en force',  txt:"Il tape son poing dans sa main ouverte : l'attaquant a foncé dans un défenseur bien placé."},
  block:   {name:'Obstruction',       txt:"Les deux mains sur les hanches : le défenseur a bloqué le passage en bougeant."},
  cancel:  {name:'Panier refusé',     txt:"Il croise et décroise les bras devant lui, comme des ciseaux : le panier ne compte pas."},
  direction:{name:'Direction du jeu', txt:"Le bras tendu montre le panier d'attaque de l'équipe qui récupère le ballon."},
  tech:    {name:'Faute technique',   txt:"Un T avec les paumes des mains : faute de comportement (râler, se moquer...)."},
  unsport: {name:'Faute antisportive',txt:"Il tient son poignet au-dessus de sa tête : faute exprès, sans chercher à jouer le ballon."}
};
function refSignalSVG(key,w){
  w=w||150;
  var SK='#e8c49a',SKD='#b98d5f';
  function arm(pts){return '<polyline points="'+pts.join(' ')+'" fill="none" stroke="#f4f4f4" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#1b1b1b" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>';}
  function fist(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="6.5" fill="'+SK+'" stroke="'+SKD+'" stroke-width="1.5"/>';}
  function palm(x,y,rot){return '<ellipse cx="'+x+'" cy="'+y+'" rx="4.5" ry="8" fill="'+SK+'" stroke="'+SKD+'" stroke-width="1.5" transform="rotate('+(rot||0)+' '+x+' '+y+')"/>';}
  function num(x,y,t){return '<circle cx="'+x+'" cy="'+y+'" r="10" fill="#fdb927" stroke="#1b1733" stroke-width="1.5"/><text x="'+x+'" y="'+(y+4.5)+'" font-family="Helvetica,Arial" font-size="'+(t.length>1?10:13)+'" font-weight="900" fill="#1b1733" text-anchor="middle">'+t+'</text>';}
  function arrow(d){return '<path d="'+d+'" fill="none" stroke="#c81d25" stroke-width="2.5" stroke-linecap="round" marker-end="url(#rsa)"/>';}
  var SR='56,58', SL='84,58', DOWN_R=arm([SR,'50,80','48,100'])+palm(48,104), DOWN_L=arm([SL,'90,80','92,100'])+palm(92,104);
  var s='';
  switch(key){
    case 'foul': s=DOWN_R+arm([SL,'92,36','96,14'])+fist(96,10); break;
    case 'p1': s=DOWN_R+arm([SL,'92,36','96,16'])+palm(96,10)+num(116,12,'1'); break;
    case 'p2': s=DOWN_R+arm([SL,'92,36','96,16'])+palm(96,10)+num(116,12,'2'); break;
    case 'p3': s=arm([SR,'48,36','44,16'])+palm(44,10)+arm([SL,'92,36','96,16'])+palm(96,10)+num(24,12,'3')+num(116,12,'3'); break;
    case 'travel': s=arm([SR,'46,78','62,82'])+arm([SL,'94,74','78,72'])+fist(64,82)+fist(76,72)+'<ellipse cx="70" cy="77" rx="24" ry="17" fill="none" stroke="#c81d25" stroke-width="2.2" stroke-dasharray="5 4"/>'+arrow('M94 70 q4 8 -2 14'); break;
    case 'dribble': s=arm([SR,'44,80','46,96'])+palm(46,100,90)+arm([SL,'96,76','94,88'])+palm(94,92,90)+arrow('M30 84 v18')+arrow('M112 100 v-18'); break;
    case 'three': s=DOWN_R+arm([SL,'106,58','126,58'])+palm(130,58,90)+num(126,38,'3'); break;
    case 'shotclock': s=DOWN_R+arm([SL,'104,72','90,52'])+palm(88,49,40)+num(114,36,'24'); break;
    case 'timeout':
    case 'tech': s=arm([SR,'40,72','50,66'])+arm([SL,'100,86','74,94'])+'<line x1="48" y1="66" x2="92" y2="66" stroke="'+SK+'" stroke-width="8" stroke-linecap="round" stroke-opacity=".95"/><line x1="70" y1="69" x2="70" y2="96" stroke="'+SK+'" stroke-width="8" stroke-linecap="round"/><path d="M48 66 h44 M70 69 v27" stroke="'+SKD+'" stroke-width="1.2" fill="none" opacity=".6"/>'+(key==='tech'?num(116,40,'T'):''); break;
    case 'sub': s=arm([SR,'48,84','86,64'])+arm([SL,'92,84','54,64'])+palm(88,62,60)+palm(52,62,-60); break;
    case 'charge': s=arm([SR,'44,76','60,70'])+palm(63,68,0)+arm([SL,'100,78','74,70'])+fist(71,70)+'<path d="M58 54 l-6 -6 M64 52 v-8 M52 64 h-8" stroke="#c81d25" stroke-width="2.2" stroke-linecap="round"/>'; break;
    case 'block': s=arm([SR,'38,76','54,98'])+palm(55,100)+arm([SL,'102,76','86,98'])+palm(85,100); break;
    case 'cancel': s=arm([SR,'64,74','104,74'])+palm(108,74,90)+arm([SL,'76,84','36,84'])+palm(32,84,90)+arrow('M104 62 h18')+arrow('M36 96 h-18'); break;
    case 'direction': s=DOWN_R+arm([SL,'106,56','128,54'])+palm(132,54,90)+arrow('M96 36 h34'); break;
    case 'unsport': s=arm([SR,'48,34','64,14'])+arm([SL,'92,34','76,16'])+fist(66,12)+'<rect x="68" y="8" width="12" height="10" rx="4" fill="'+SK+'" stroke="'+SKD+'" stroke-width="1.5"/>'; break;
    default: s=DOWN_R+DOWN_L;
  }
  var body='<ellipse cx="70" cy="164" rx="30" ry="5" fill="#000" opacity=".18"/>'+
    '<line x1="62" y1="104" x2="58" y2="158" stroke="#1b1b1b" stroke-width="10" stroke-linecap="round"/><line x1="78" y1="104" x2="82" y2="158" stroke="#1b1b1b" stroke-width="10" stroke-linecap="round"/>'+
    '<rect x="52" y="48" width="36" height="60" rx="10" fill="#f4f4f4" stroke="#1b1b1b" stroke-width="1.5"/>'+
    '<path d="M60 50 v56 M70 50 v58 M80 50 v56" stroke="#1b1b1b" stroke-width="3.5"/>'+
    '<circle cx="70" cy="34" r="13" fill="'+SK+'" stroke="'+SKD+'" stroke-width="1.5"/>'+
    '<path d="M57 30 q13 -14 26 0" fill="#3a2a1a"/>'+
    '<circle cx="65" cy="35" r="1.6" fill="#1b1733"/><circle cx="75" cy="35" r="1.6" fill="#1b1733"/>'+
    '<rect x="67" y="41" width="6" height="3" rx="1.5" fill="#c9c9c9"/>';
  return '<svg class="refsig" width="'+w+'" viewBox="0 0 140 172" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+(REF_SIGNALS[key]?REF_SIGNALS[key].name:'')+'">'+
    '<defs><marker id="rsa" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c81d25"/></marker></defs>'+
    body+s+'</svg>';
}
/* grande scène "geste de l'arbitre" pour les quiz */
function sceneSignal(key){
  return '<div class="scene sigscene">'+refSignalSVG(key,170)+'</div>';
}
