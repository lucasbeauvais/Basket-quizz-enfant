/* ============================================================
   MINI-JEU DE TIR (façon Angry Birds)
   On pose le doigt n'importe où, on tire vers l'arrière (vers le
   bas et la gauche), une courbe montre la trajectoire, on relâche !
   MiniGame.open({title, intro, shots:[{spot:'three'|'two', money:true, defender:'jump'|'arms'}], onDone:function(points, made){}})
   defender : un joueur adverse se place devant le tireur et essaie de
   contrer. 'jump' = il saute en rythme (il s'accroupit juste avant),
   'arms' = il agite les bras. Passer par-dessus rapporte +1.
   ============================================================ */
var MiniGame = (function(){
  var W=360, H=600, FLOOR=548, G=1150, VMAX=1250, PULLMAX=150, R=13;
  var RIM_Y=225, RIM_F=266, RIM_B=322, BOARD_X=326;
  var SPOTS={ three:{x:66,y:470,pts:3,label:'+3'}, two:{x:146,y:470,pts:2,label:'+2'} };

  function open(cfg){
    var shots=cfg.shots||[{spot:'three'}], idx=0, total=0, made=0;
    var root=document.createElement('div'); root.className='mg';
    root.innerHTML=
      '<div class="mg-top"><div class="mg-title">'+(cfg.title||'Séance de tirs')+'</div><button class="mg-skip">Passer</button></div>'+
      '<div class="mg-wrap"><canvas class="mg-canvas"></canvas><div class="mg-help">Pose ton doigt, tire vers l\'arrière, relâche !</div></div>'+
      '<div class="mg-end" style="display:none"></div>';
    document.body.appendChild(root);
    var canvas=root.querySelector('canvas'), ctx=canvas.getContext('2d'), help=root.querySelector('.mg-help');
    var scale=1, dpr=Math.min(window.devicePixelRatio||1,2), raf=0, closed=false;

    function resize(){
      var maxW=Math.min(window.innerWidth-16,460), maxH=window.innerHeight-70;
      var w=maxW, h=w*H/W; if(h>maxH){h=maxH;w=h*W/H;}
      canvas.style.width=w+'px'; canvas.style.height=h+'px';
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); scale=w/W;
    }
    resize(); window.addEventListener('resize',resize);

    /* ---- état du tir ---- */
    var ball, state, drag=null, net=0, floatTxt=[], resultTimer=0, shotTime=0, touchedRim=false, scored=false, bounces=0;
    var def=null, defT=0, blocked=false, DEF_FEET=522;
    function spot(){ return SPOTS[shots[idx].spot]||SPOTS.three; }
    function setupShot(){
      var s=spot(); ball={x:s.x,y:s.y,vx:0,vy:0,rot:0}; state='aim'; drag=null;
      touchedRim=false; scored=false; bounces=0; shotTime=0; resultTimer=0; blocked=false;
      var m=shots[idx].defender; def=m?{mode:m,x:(shots[idx].spot==='two'?204:132)}:null; defT=Math.random()*1.7;
      if(def){ help.textContent=m==='jump'?'Un défenseur saute pour contrer : tire quand il retombe !':'Un défenseur lève les bras : passe par-dessus !'; help.style.opacity=1; }
    }
    setupShot();

    /* ---- entrées tactiles / souris ---- */
    function pt(e){ var r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*W, y:(e.clientY-r.top)/r.height*H}; }
    function launchVec(){
      if(!drag)return null;
      var dx=drag.sx-drag.x, dy=drag.sy-drag.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<1)return {vx:0,vy:0,p:0};
      var p=Math.min(d,PULLMAX)/PULLMAX, v=p*VMAX;
      return {vx:dx/d*v, vy:dy/d*v, p:p};
    }
    canvas.addEventListener('pointerdown',function(e){
      if(state!=='aim')return; e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      var p=pt(e); drag={sx:p.x,sy:p.y,x:p.x,y:p.y}; help.style.opacity=0;
    });
    canvas.addEventListener('pointermove',function(e){ if(!drag)return; var p=pt(e); drag.x=p.x; drag.y=p.y; });
    function release(){
      if(!drag||state!=='aim')return; var v=launchVec(); drag=null;
      if(!v||v.p<0.12)return;
      ball.vx=v.vx; ball.vy=v.vy; state='fly'; Sfx.whoosh();
    }
    canvas.addEventListener('pointerup',release);
    canvas.addEventListener('pointercancel',function(){drag=null;});

    /* ---- physique ---- */
    function hitPoint(px,py){
      var dx=ball.x-px, dy=ball.y-py, d=Math.sqrt(dx*dx+dy*dy), min=R+4;
      if(d<min&&d>0){
        var nx=dx/d, ny=dy/d; ball.x=px+nx*min; ball.y=py+ny*min;
        var vn=ball.vx*nx+ball.vy*ny;
        if(vn<0){ ball.vx-=1.55*vn*nx; ball.vy-=1.55*vn*ny; ball.vx*=0.92; ball.vy*=0.92; if(Math.abs(vn)>120)Sfx.rim(); }
        touchedRim=true;
      }
    }
    /* position du défenseur : pieds, épaules, mains (selon le temps) */
    function defPose(){
      var sh=DEF_FEET-82, off=0, crouch=0, hy, hx=12;
      if(def.mode==='jump'){
        var ph=defT%1.7;
        if(ph>=0.95){ off=150*Math.sin(Math.PI*(ph-0.95)/0.75); }
        else if(ph>0.7){ crouch=10*Math.sin(Math.PI*(ph-0.7)/0.25); }
        hy=sh-48;
      }else{
        var a=(Math.sin(defT*Math.PI*2/1.3)+1)/2; hy=sh+2-a*60; hx=36-a*24;
      }
      var P={x:def.x, feet:DEF_FEET-off, sh:sh-off+crouch, hy:hy-off+crouch, hx:hx, off:off, wide:(def.mode==='arms'&&hx>24)};
      /* avec les images : on place l'image pour que ses mains tombent sur P.hy, et les mains
         (zone qui contre) suivent exactement l'image. Mesures faites sur les images rognées. */
      var key='minigame/defender-'+(P.off>4?'jump':(P.wide?'wide':'stand'));
      if(!Assets.has(key))key='minigame/defender-stand';
      if(Assets.has(key)){
        var im=Assets.ok[key], fr=(key.slice(-4)==='wide')?{hy:0.24,hx:0.45}:{hy:0.06,hx:0.30};
        var h=(P.feet-P.hy)/(1-fr.hy), w=h*im.width/im.height;
        P.img={im:im,top:P.hy-fr.hy*h,h:h,w:w}; P.hx=fr.hx*w;
      }
      return P;
    }
    function hitDefender(){
      if(!def||blocked||ball.vx<=0)return;
      var P=defPose(), hit=false;
      for(var s=-1;s<=1;s+=2){ var dx=ball.x-(P.x+s*P.hx), dy=ball.y-P.hy; if(dx*dx+dy*dy<(R+10)*(R+10))hit=true; }
      var cx=Math.max(P.x-15,Math.min(ball.x,P.x+15)), cy=Math.max(P.sh-30,Math.min(ball.y,P.feet));
      if((ball.x-cx)*(ball.x-cx)+(ball.y-cy)*(ball.y-cy)<R*R)hit=true;
      if(hit){
        blocked=true; ball.vx=-Math.abs(ball.vx)*0.3-40; ball.vy=Math.max(160,Math.abs(ball.vy)*0.3);
        floatTxt.push({x:P.x+30,y:P.hy-10,t:0,txt:'CONTRÉ !'}); Sfx.rim(); Sfx.bad();
      }
    }
    function step(dt){
      var py=ball.y;
      hitDefender();
      ball.vy+=G*dt; ball.x+=ball.vx*dt; ball.y+=ball.vy*dt; ball.rot+=ball.vx*dt*0.05;
      hitPoint(RIM_F,RIM_Y); hitPoint(RIM_B,RIM_Y);
      /* panneau */
      if(ball.x+R>BOARD_X&&ball.x<BOARD_X+8&&ball.y>148&&ball.y<RIM_Y+12&&ball.vx>0){ ball.x=BOARD_X-R; ball.vx=-ball.vx*0.6; Sfx.rim(); touchedRim=true; }
      /* panier ! */
      if(!scored&&py<RIM_Y&&ball.y>=RIM_Y&&ball.vy>0&&ball.x>RIM_F+4&&ball.x<RIM_B-4){
        scored=true; net=1; onScore();
        ball.vx*=0.35;
      }
      /* sol */
      if(ball.y+R>FLOOR){ ball.y=FLOOR-R; if(Math.abs(ball.vy)>140){Sfx.bounce();bounces++;} ball.vy=-ball.vy*0.55; ball.vx*=0.8; }
      if(ball.x<R&&ball.vx<0){ ball.x=R; ball.vx=-ball.vx*0.6; }
    }
    function onScore(){
      var s=spot(), money=!!shots[idx].money, pts=s.pts*(money?2:1)+(touchedRim?0:1)+(def?1:0);
      total+=pts; made++;
      floatTxt.push({x:296,y:RIM_Y-30,t:0,txt:'+'+pts+(def?' PAR-DESSUS !':(touchedRim?'':' SWISH !'))});
      Sfx.swish(); setTimeout(Sfx.cheer,100);
      var r=canvas.getBoundingClientRect();
      FX.confAt(r.left+296*scale, r.top+RIM_Y*scale,{particleCount:money?140:80,spread:90,startVelocity:30,colors:money?['#fdb927','#fff3b0','#ffffff']:undefined});
    }

    /* ---- dessin ---- */
    function drawBall(x,y,rot,gold){
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
      if(Assets.has('fx/ball')){ ctx.drawImage(Assets.ok['fx/ball'],-R,-R,R*2,R*2); }
      else{
        ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fillStyle=gold?'#fdb927':'#e8752a'; ctx.fill();
        ctx.lineWidth=1.3; ctx.strokeStyle='#6b2f08'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-R,0); ctx.lineTo(R,0); ctx.moveTo(0,-R); ctx.lineTo(0,R);
        ctx.moveTo(-R*.75,-R*.65); ctx.quadraticCurveTo(0,0,-R*.75,R*.65); ctx.moveTo(R*.75,-R*.65); ctx.quadraticCurveTo(0,0,R*.75,R*.65); ctx.stroke();
      }
      ctx.restore();
    }
    function drawBg(){
      if(Assets.has('minigame/court')){
        var im=Assets.ok['minigame/court'], k=Math.max(W/im.width,H/im.height), iw=im.width*k, ih=im.height*k;
        ctx.drawImage(im,(W-iw)/2,(H-ih)/2,iw,ih);
      }else{
        var g=ctx.createLinearGradient(0,0,0,FLOOR); g.addColorStop(0,'#0b0f2e'); g.addColorStop(1,'#232a6b'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        var cols=['#e8752a','#fdb927','#6a5acd','#c0392b','#2e9e5b','#ffffff'];
        for(var r=0;r<6;r++)for(var x=6+(r%2)*8;x<W;x+=16){ ctx.globalAlpha=.3; ctx.fillStyle=cols[(x+r*5)%cols.length]; ctx.beginPath(); ctx.arc(x,330+r*12,4.5,0,Math.PI*2); ctx.fill(); }
        ctx.globalAlpha=1;
        ctx.fillStyle='rgba(255,255,255,.05)'; ctx.beginPath(); ctx.moveTo(60,0); ctx.lineTo(0,300); ctx.lineTo(140,300); ctx.fill();
        ctx.fillStyle='#d9a15a'; ctx.fillRect(0,FLOOR-60,W,H-FLOOR+60);
        ctx.strokeStyle='#c98c45'; ctx.lineWidth=1; for(var k2=16;k2<W;k2+=30){ctx.beginPath();ctx.moveTo(k2,FLOOR-60);ctx.lineTo(k2,H);ctx.stroke();}
        ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,FLOOR-60); ctx.lineTo(W,FLOOR-60); ctx.stroke();
      }
      /* ligne à 3 points */
      ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.setLineDash([8,6]); ctx.beginPath(); ctx.moveTo(122,FLOOR-58); ctx.lineTo(112,H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#fff'; ctx.font='800 10px Helvetica,Arial'; ctx.textAlign='center'; ctx.fillText('LIGNE À 3 PTS',120,FLOOR-66);
    }
    function drawHoop(){
      ctx.fillStyle='#9aa0b8'; ctx.fillRect(342,150,8,FLOOR-150); ctx.fillRect(332,186,12,6);
      ctx.fillStyle='#fff'; ctx.fillRect(BOARD_X,140,8,100); ctx.strokeStyle='#c9c2b0'; ctx.strokeRect(BOARD_X,140,8,100);
      /* filet */
      var st=1+net*0.45, nb=RIM_Y+38*st;
      ctx.strokeStyle='rgba(255,255,255,.9)'; ctx.lineWidth=1.4; ctx.beginPath();
      for(var i=0;i<=5;i++){ var tx=RIM_F+i*(RIM_B-RIM_F)/5, bx=RIM_F+10+i*(RIM_B-RIM_F-20)/5; ctx.moveTo(tx,RIM_Y); ctx.lineTo(bx,nb); }
      for(var j=1;j<=3;j++){ var yy=RIM_Y+(nb-RIM_Y)*j/3, inset=10*j/3; ctx.moveTo(RIM_F+inset,yy); ctx.lineTo(RIM_B-inset,yy); }
      ctx.stroke();
    }
    function drawDefender(){
      if(!def)return; var P=defPose(), x=P.x, SK='#8a5a3a', J='#c8102e';
      /* image du défenseur si elle existe (saute / bras levés / bras écartés) */
      if(P.img){
        ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x,DEF_FEET+2,18-P.off*0.06,4,0,0,Math.PI*2); ctx.fill();
        ctx.drawImage(P.img.im,x-P.img.w/2,P.img.top,P.img.w,P.img.h); return;
      }
      ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x,DEF_FEET+2,18-P.off*0.06,4,0,0,Math.PI*2); ctx.fill();
      ctx.lineCap='round';
      ctx.strokeStyle='#1b1733'; ctx.lineWidth=7;
      ctx.beginPath(); ctx.moveTo(x-6,P.sh+44); ctx.lineTo(x-9,P.feet); ctx.moveTo(x+6,P.sh+44); ctx.lineTo(x+9,P.feet); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.fillRect(x-14,P.feet-4,11,5); ctx.fillRect(x+3,P.feet-4,11,5);
      ctx.fillStyle=J; ctx.beginPath(); ctx.roundRect?ctx.roundRect(x-15,P.sh,30,48,7):ctx.rect(x-15,P.sh,30,48); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='900 13px Impact,Arial Black,Helvetica'; ctx.textAlign='center'; ctx.fillText('0',x,P.sh+26);
      ctx.strokeStyle=SK; ctx.lineWidth=6;
      ctx.beginPath(); ctx.moveTo(x-12,P.sh+5); ctx.lineTo(x-P.hx,P.hy); ctx.moveTo(x+12,P.sh+5); ctx.lineTo(x+P.hx,P.hy); ctx.stroke();
      ctx.fillStyle=SK; ctx.beginPath(); ctx.arc(x-P.hx,P.hy,6,0,Math.PI*2); ctx.arc(x+P.hx,P.hy,6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x,P.sh-14,12,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a1008'; ctx.beginPath(); ctx.arc(x,P.sh-19,11,Math.PI,0); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+4,P.sh-13,2.2,0,Math.PI*2); ctx.fill();
      ctx.lineCap='butt';
    }
    function drawRim(){ ctx.strokeStyle='#e8752a'; ctx.lineWidth=6; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(RIM_F,RIM_Y); ctx.lineTo(BOARD_X,RIM_Y); ctx.stroke(); ctx.lineCap='butt'; }
    function drawAim(){
      var v=launchVec(); if(!v||v.p<0.05)return;
      /* élastique */
      ctx.strokeStyle='rgba(253,185,39,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ball.x,ball.y); ctx.lineTo(ball.x-(v.vx/VMAX)*PULLMAX*.5,ball.y-(v.vy/VMAX)*PULLMAX*.5); ctx.stroke();
      /* courbe de visée */
      var x=ball.x,y=ball.y,vx=v.vx,vy=v.vy,dt=0.025;
      for(var i=0;i<22;i++){ vy+=G*dt; x+=vx*dt; y+=vy*dt; if(i%2)continue; ctx.globalAlpha=1-i/24; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,3.2-i*0.08,0,Math.PI*2); ctx.fill(); }
      ctx.globalAlpha=1;
      /* jauge de puissance */
      ctx.fillStyle='rgba(0,0,0,.4)'; ctx.fillRect(ball.x-24,ball.y+22,48,6);
      ctx.fillStyle=v.p>0.9?'#c8102e':'#fdb927'; ctx.fillRect(ball.x-24,ball.y+22,48*v.p,6);
    }
    function drawHUD(){
      ctx.fillStyle='rgba(11,11,20,.75)'; ctx.fillRect(10,10,W-20,40);
      ctx.strokeStyle='#fdb927'; ctx.lineWidth=2; ctx.strokeRect(10,10,W-20,40);
      ctx.textAlign='left'; ctx.fillStyle='#fff'; ctx.font='800 14px Helvetica,Arial';
      ctx.fillText('Ballon '+Math.min(idx+1,shots.length)+' / '+shots.length,22,35);
      ctx.textAlign='right'; ctx.fillStyle='#fdb927'; ctx.font='900 18px Impact,Arial Black,Helvetica';
      ctx.fillText('+'+total+' PTS',W-22,37);
      if(state==='aim'){
        var s=spot(), money=shots[idx].money;
        ctx.textAlign='center'; ctx.font='900 16px Impact,Arial Black,Helvetica'; ctx.fillStyle=money?'#fdb927':'#fff';
        ctx.fillText(money?'MONEY BALL x2 ('+s.label+')':s.label+' POINTS',ball.x+(s.x<100?40:0),ball.y-26);
      }
    }
    function drawFloat(dt){
      for(var i=floatTxt.length-1;i>=0;i--){
        var f=floatTxt[i]; f.t+=dt; if(f.t>1.2){floatTxt.splice(i,1);continue;}
        ctx.globalAlpha=1-f.t/1.2; ctx.textAlign='center'; ctx.font='900 '+(24+f.t*10)+'px Impact,Arial Black,Helvetica';
        ctx.lineWidth=4; ctx.strokeStyle='#1b1733'; ctx.strokeText(f.txt,f.x-30,f.y-f.t*50); ctx.fillStyle='#fdb927'; ctx.fillText(f.txt,f.x-30,f.y-f.t*50);
      }
      ctx.globalAlpha=1;
    }

    /* ---- boucle ---- */
    var last=performance.now();
    function frame(now){
      if(closed)return;
      var dt=Math.min(0.033,(now-last)/1000); last=now;
      if(state==='fly'){
        var n=4; for(var i=0;i<n;i++)step(dt/n);
        shotTime+=dt;
        var out=ball.x>W+40||ball.x<-40;
        if(scored&&shotTime>0.1){ resultTimer+=dt; }
        if(out||shotTime>3.2||(scored&&resultTimer>1.1)||(!scored&&bounces>=2)){ state='result'; resultTimer=0; if(!scored){ floatTxt.push({x:200,y:300,t:0,txt:'RATÉ !'}); } }
      }else if(state==='result'){
        resultTimer+=dt;
        if(resultTimer>0.7){ idx++; if(idx>=shots.length){ finish(); return; } setupShot(); }
      }
      net=Math.max(0,net-dt*1.6);
      ctx.setTransform(scale*dpr,0,0,scale*dpr,0,0);
      if(def)defT+=dt;
      drawBg(); drawHoop(); drawDefender();
      if(state==='aim')drawAim();
      drawBall(ball.x,ball.y,ball.rot,shots[Math.min(idx,shots.length-1)].money);
      drawRim(); drawHUD(); drawFloat(dt);
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);

    function finish(){
      cancelAnimationFrame(raf); var end=root.querySelector('.mg-end');
      var msg=made===shots.length?'Parfait, tout est rentré !':(made?'Bien visé !':'Pas de chance cette fois...');
      end.innerHTML='<div class="mg-endcard"><div class="mg-endtitle">'+msg+'</div>'+
        '<div class="mg-endscore">+'+total+'<small> pts</small></div>'+
        '<div class="mg-endsub">'+made+' panier'+(made>1?'s':'')+' sur '+shots.length+'</div>'+
        '<button class="btn big" id="mgok">Continuer</button></div>';
      end.style.display='flex';
      if(made)FX.fireworks(made===shots.length?2500:1000);
      if(window.gsap)gsap.fromTo(end.firstChild,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(2)'});
      end.querySelector('#mgok').onclick=close;
    }
    function close(){
      if(closed)return; closed=true; cancelAnimationFrame(raf); window.removeEventListener('resize',resize);
      if(root.parentNode)root.parentNode.removeChild(root);
      cfg.onDone&&cfg.onDone(total,made);
    }
    root.querySelector('.mg-skip').onclick=function(){ if(state!=='done'){ closed=false; finish(); } };
  }
  return {open:open};
})();
