/* ============================================================
   IMAGES DU JEU
   Chaque image est optionnelle : si le fichier existe dans
   assets/img/, il est utilisé ; sinon le jeu garde son dessin SVG.
   Les images sont en WebP (tools/optimize_images.py les prépare).
   La liste complète (et les prompts pour les générer) est dans
   assets/PROMPTS-IMAGES.md
   ============================================================ */
var ASSET_LIST = [
  'brand/logo','brand/banner',
  'coach/coach-mamba','coach/coach-happy','coach/coach-thinking','coach/coach-cheer',
  'players/p1','players/p2','players/p3','players/p4','players/p5','players/p6','players/p7','players/p8',
  'categories/legendes','categories/stars','categories/france','categories/nba','categories/regles','categories/mix',
  'fx/foam-finger','fx/explosion','fx/fireball','fx/trophy','fx/ball',
  'scenes/trophy','scenes/mystery','scenes/globe','scenes/hoop','scenes/versus','scenes/chess',
  'minigame/court','minigame/defender-stand','minigame/defender-jump','minigame/defender-wide',
  'bg/nuit','bg/violet','bg/parquet','bg/street','bg/ocean','bg/feu','bg/galaxie','bg/or',
  'rules/whistle',
  'balls/etoiles','balls/flammes','balls/galaxie','balls/leopard','balls/retro','balls/neon','balls/diamant','balls/glace'
];
var Assets = {
  ok: {},
  base: 'assets/img/',
  /* ASSET_DATA (optionnel) : images intégrées dans la version « page unique » */
  url: function(key){ return (window.ASSET_DATA&&ASSET_DATA[key]) || (this.base + key + '.webp'); },
  has: function(key){ return !!this.ok[key]; },
  /* charge tout en parallèle ; ne bloque jamais plus de 2,5 s */
  load: function(done){
    var self=this, left=ASSET_LIST.length, finished=false;
    function end(){ if(!finished){ finished=true; done(); } }
    setTimeout(end, 2500);
    ASSET_LIST.forEach(function(key){
      var im=new Image();
      im.onload=function(){ self.ok[key]=im; if(--left===0) end(); };
      im.onerror=function(){ if(--left===0) end(); };
      im.src=self.url(key);
    });
  },
  img: function(key, cls, alt){
    return '<img class="'+(cls||'')+'" src="'+this.url(key)+'" alt="'+(alt||'')+'" draggable="false">';
  }
};
