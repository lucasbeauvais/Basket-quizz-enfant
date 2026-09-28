# -*- coding: utf-8 -*-
"""Génère assets/PROMPTS-IMAGES.md et prompts-images.html (même contenu).
Lancer : python3 tools/build_prompts.py"""
import html, json, os

STYLE = ("STYLE GUIDE (apply to every image): bright, energetic cartoon illustration for a kids' basketball quiz game "
 "(ages 7-12), in the look of a modern 3D-rendered mobile sports game with stylized, friendly characters "
 "(big expressive eyes, slightly oversized heads, smooth clean shapes). Soft studio lighting with a warm rim light, "
 "saturated colors. Main palette: deep night navy #0e1233, purple #552583, gold #fdb927, basketball orange #e8752a, white accents. "
 "IMPORTANT: no real logos, no NBA logo, no team logos, no brand marks, no watermark. "
 "All characters are ORIGINAL cartoon characters and must NOT look like any real, identifiable person. "
 "No text or letters in the image unless the prompt explicitly asks for it.")

TRANSP = "Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off."
PORTRAIT = ("Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, "
 "on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle.")

COACH = ("'Coach Mamba', an original cartoon basketball coach: athletic man in his 40s, dark brown skin, shaved head, short neat black beard, "
 "confident warm smile, purple and gold team tracksuit jacket with the number 24 on the chest, silver whistle on a lanyard")

GROUPS = [
 ("1. Logo et bannière", "brand", [
  ("logo","1024 x 1024", "Round emblem for a kids' basketball game: a shiny basketball wearing a small golden crown, surrounded by a ring of gold stars and a purple ribbon, "
   "with motion streaks. No text. "+TRANSP),
  ("banner","1600 x 440 (très large)", "Wide panoramic banner of a basketball arena at night seen from courtside: glossy wooden court in the lower quarter, "
   "a hoop on the far left and far right edges, a cheering crowd in the stands as colorful blurred dots, two big spotlights from the ceiling, "
   "a big empty jumbotron screen in the top center, a basketball bouncing near the center. Dark navy and purple tones with gold light. No text, no logos. Full background, no transparency."),
 ]),
 ("2. Coach Mamba (4 humeurs, même personnage)", "coach", [
  ("coach-mamba","1024 x 1024", COACH+", arms crossed, proud and calm expression. "+PORTRAIT+" Background: navy #1b1733 to purple #552583."),
  ("coach-happy","1024 x 1024", "SAME character as the previous image: "+COACH+", big smile, giving a thumbs up. "+PORTRAIT+" Background: purple #552583 to gold #fdb927."),
  ("coach-thinking","1024 x 1024", "SAME character as the previous image: "+COACH+", one hand on his chin, one eyebrow raised, holding a small tactics clipboard, clever 'I have a secret for you' look. "+PORTRAIT+" Background: navy #1b1733 to purple #552583."),
  ("coach-cheer","1024 x 1024", "SAME character as the previous image: "+COACH+", both fists raised, shouting with joy, confetti flying around him. "+PORTRAIT+" Background: gold #fdb927 to orange #e8752a."),
 ]),
 ("3. Les 8 joueurs (avatars)", "players", [
  ("p1","1024 x 1024", "Original cartoon basketball player nicknamed 'The Alien': an extremely tall and slender young man, very long arms, short curly dark hair, brown skin, "
   "calm friendly smile, black and silver jersey with the number 1, a few small glowing stars and planets floating around him. "+PORTRAIT+" Background: black to silver-grey."),
  ("p2","1024 x 1024", "Original cartoon basketball player nicknamed 'The King': a powerful athletic man, dark brown skin, short dark hair, trimmed beard, white headband, "
   "purple and gold jersey with the number 23, a small golden crown floating just above his head. "+PORTRAIT+" Background: purple #552583 to gold #fdb927."),
  ("p3","1024 x 1024", "Original cartoon basketball player nicknamed 'Air': an athletic man, dark brown skin, shaved head, huge happy smile, red and black jersey with the number 23, "
   "white air-swirl wing shapes behind his shoulders as if he could fly. "+PORTRAIT+" Background: red #ce1141 to black."),
  ("p4","1024 x 1024", "Original cartoon basketball player nicknamed 'Chef': a slim guard, light brown skin, short dark hair, cheeky boyish smile, royal blue and yellow jersey with the number 30, "
   "wearing a tiny white chef's hat, spinning a basketball on one finger. "+PORTRAIT+" Background: royal blue #1d428a to yellow #ffc72c."),
  ("p5","1024 x 1024", "Original cartoon basketball player nicknamed 'Greek Freak': a very tall muscular man with very long arms, dark brown skin, short dark hair, big determined smile, "
   "dark green and cream jersey with the number 34, a golden laurel wreath floating behind his head. "+PORTRAIT+" Background: green #00471b to cream #eee1c6."),
  ("p6","1024 x 1024", "Original cartoon basketball player nicknamed 'The Joker': a big tall man, light skin, short brown hair, relaxed playful grin, navy and gold jersey with the number 15, "
   "holding a playing card with a jester picture (no letters) between two fingers. "+PORTRAIT+" Background: navy #0e2240 to gold #fec524."),
  ("p7","1024 x 1024", "Original cartoon basketball player nicknamed 'TP': a quick point guard, light brown skin, short dark hair, smiling, silver and black jersey with the number 9, "
   "small blue-white-red French flag pin on the jersey, speed lines behind him. "+PORTRAIT+" Background: silver #c4ced4 to black."),
  ("p8","1024 x 1024", "Original cartoon basketball player nicknamed 'The Big': a huge and very strong center, dark brown skin, shaved head, joyful laugh, blue and white jersey with the number 32, "
   "holding a basketball in one giant hand, a few glass shards flying behind him like he just broke a backboard. "+PORTRAIT+" Background: blue #0077c0 to white."),
 ]),
 ("4. Icônes des catégories", "categories", [
  ("legendes","512 x 512", "Game icon: a golden trophy with a basketball on top, purple ribbon, sparkling stars, 'hall of fame' feeling. "+TRANSP),
  ("stars","512 x 512", "Game icon: a basketball with a bright blue and yellow lightning bolt striking through it, electric sparks. "+TRANSP),
  ("france","512 x 512", "Game icon: a basketball with a blue-white-red swoosh around it and a tiny Eiffel Tower silhouette next to it. "+TRANSP),
  ("nba","512 x 512", "Game icon: a basketball hoop with backboard and net, in red, white and blue colors, with a whistle. Generic, NOT the NBA logo. "+TRANSP),
  ("mix","512 x 512", "Game icon: a golden 'all-star' basketball covered in small stars, with a rainbow sparkle trail. "+TRANSP),
 ]),
 ("5. Effets des grandes animations", "fx", [
  ("foam-finger","800 x 1300 (vertical)", "A giant purple foam finger like fans wave in basketball arenas: the hand points the index finger straight up, the big '#1' written in gold on the palm, "
   "gold outline, seen from the front, slightly tilted. Only the text '#1'. "+TRANSP),
  ("explosion","1024 x 1024", "Comic-book style explosion burst: layered spiky starburst in red, orange, gold and white-hot center, with small sparks and stars flying out. No text. "+TRANSP),
  ("fireball","1000 x 1200 (vertical)", "A basketball engulfed in big cartoon flames (red, orange, yellow), flames rising above it, 'on fire' video game power-up feeling. No text. "+TRANSP),
  ("trophy","800 x 960 (vertical)", "A shiny golden championship trophy: a basketball sitting on top of a golden net-and-hoop shape on a dark wooden base, sparkles. Generic design, no text. "+TRANSP),
  ("ball","512 x 512", "A single basketball seen perfectly from the front, perfectly round, filling the whole image edge to edge, classic orange with black lines, soft shading, no shadow on the ground. "+TRANSP),
 ]),
 ("6. Illustrations des questions (fond d'écran des questions)", "scenes", [
  ("trophy","1600 x 920 (paysage)", "A golden basketball trophy on a pedestal in the middle of a dark arena under a single spotlight, sparkles, crowd blurred in the background. Keep the bottom 15% simple (a caption will be placed there). No text. Full background."),
  ("mystery","1600 x 920 (paysage)", "A mysterious basketball player shown only as a dark silhouette under a spotlight in an arena, a big glowing gold question mark floating next to him. Keep the bottom 15% simple. Full background."),
  ("globe","1600 x 920 (paysage)", "A cartoon planet Earth with a basketball orbiting around it like a moon, stars in a navy sky, a hint of an arena at the bottom. Keep the bottom 15% simple. No text. Full background."),
  ("hoop","1600 x 920 (paysage)", "Low-angle view of a basketball hoop, backboard and swinging white net in a bright arena, a ball just going through the net, confetti. Keep the bottom 15% simple. No text. Full background."),
  ("versus","1600 x 920 (paysage)", "Two cartoon basketball teams facing each other at center court before tip-off, a green team on the left and a purple-and-gold team on the right, "
   "electric energy between them, packed arena. Original characters, no logos. Keep the bottom 15% simple. No text. Full background."),
  ("chess","1600 x 920 (paysage)", "A chessboard on a basketball court, the chess pieces are shaped like little basketball players and basketballs, the king piece is very tall. Keep the bottom 15% simple. No text. Full background."),
 ]),
 ("7. Décor du mini-jeu de tir", "minigame", [
  ("court","1080 x 1800 (vertical, format téléphone)", "Vertical phone-screen background of a basketball arena at night: dark navy upper part with two spotlights coming from the top-left, "
   "a cheering crowd as colorful blurred dots in the middle band, and a glossy wooden court floor occupying the bottom 19% of the image (the floor edge is a horizontal line at 81% of the height). "
   "IMPORTANT: NO hoop, NO backboard, NO pole, NO ball, NO players (the game draws them itself). The right third of the image should stay calm and uncluttered. No text. Full background."),
 ]),
]

def md():
    out=["# Prompts pour générer les images du Quiz NBA\n",
     "Générées avec Gemini ou ChatGPT, puis déposées dans `assets/img/<dossier>/<nom>.png`. "
     "Chaque image est **optionnelle** : tant qu'un fichier manque, le jeu garde son dessin actuel.\n",
     "## Mode d'emploi\n",
     "1. Colle d'abord le **guide de style** (bloc ci-dessous) au début de la conversation avec Gemini ou ChatGPT, puis envoie les prompts un par un.",
     "2. Pour le Coach et les joueurs, garde **la même conversation** : l'IA garde le même style. Pour les 4 humeurs du coach, joins la 1re image du coach comme référence.",
     "3. **Transparence** : ChatGPT sait faire des PNG à fond transparent. Si Gemini ne le fait pas, demande « plain pure white background » : je détourerai les images.",
     "4. Renomme chaque fichier exactement comme indiqué (ex. `coach-happy.png`) et envoie-les-moi : je les redimensionne, je les compresse et je les mets dans le dépôt.\n",
     "## Guide de style (à coller en premier)\n", "```", STYLE, "```\n"]
    for title,folder,items in GROUPS:
        out.append("## "+title+"\n")
        for name,size,prompt in items:
            out.append("### `assets/img/%s/%s.png` (%s)\n"%(folder,name,size))
            out.append("```\n"+prompt+"\n```\n")
    return "\n".join(out)

def page():
    data=[{"title":t,"folder":f,"items":[{"name":n,"size":s,"prompt":p} for n,s,p in it]} for t,f,it in GROUPS]
    return """<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prompts images Quiz NBA</title>
<style>
:root{--bg:#f6f2ea;--card:#fff;--ink:#1b1733;--mut:#6b5f86;--line:#e2d8c6;--acc:#552583;--gold:#fdb927;--code:#f3eefb}
@media (prefers-color-scheme:dark){:root{--bg:#0e1233;--card:#171c47;--ink:#f3f0ff;--mut:#b5acd6;--line:#2c3270;--acc:#c9a8ff;--code:#1f2560}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px 16px 60px}
main{max-width:860px;margin:0 auto}h1{font-size:26px;margin:0 0 6px}h2{font-size:18px;margin:34px 0 10px;color:var(--acc)}
p.lead{color:var(--mut);margin:0 0 18px}.steps{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 18px}
.item{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:10px 0}
.head{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.file{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;font-size:13.5px;word-break:break-all}
.size{font-size:12px;color:var(--mut);background:var(--code);padding:2px 8px;border-radius:99px}
button{margin-left:auto;border:0;background:var(--acc);color:#fff;font:inherit;font-size:13px;font-weight:700;padding:6px 12px;border-radius:8px;cursor:pointer}
button.done{background:#2e8b57}
pre{white-space:pre-wrap;background:var(--code);border-radius:8px;padding:10px 12px;margin:10px 0 0;font-size:13px;line-height:1.5;font-family:ui-monospace,Menlo,Consolas,monospace}
.style pre{border-left:4px solid var(--gold)}
</style></head><body><main>
<h1>Prompts images : Quiz NBA</h1>
<p class="lead">Un bouton « Copier » par image. Chaque image est optionnelle : tant qu'elle manque, le jeu garde son dessin actuel.</p>
<div class="steps"><ol>
<li>Colle d'abord le <b>guide de style</b> dans Gemini ou ChatGPT, puis les prompts un par un.</li>
<li>Coach et joueurs : reste dans <b>la même conversation</b> ; pour les humeurs du coach, joins la 1re image du coach comme référence.</li>
<li>Fond transparent : ChatGPT le fait. Sinon demande « plain pure white background » : je détourerai.</li>
<li>Renomme chaque fichier exactement comme indiqué et envoie-les-moi.</li></ol></div>
<h2>Guide de style (à coller en premier)</h2>
<div class="item style"><div class="head"><span class="file">Guide de style</span><button data-t="style">Copier</button></div><pre id="style"></pre></div>
<div id="list"></div>
<script>
var STYLE=""" + json.dumps(STYLE) + """;var DATA=""" + json.dumps(data, ensure_ascii=False) + """;
document.getElementById('style').textContent=STYLE;
var L=document.getElementById('list'),T={style:STYLE},n=0;
DATA.forEach(function(g){var h=document.createElement('h2');h.textContent=g.title;L.appendChild(h);
 g.items.forEach(function(it){var id='p'+(n++);T[id]=it.prompt;var d=document.createElement('div');d.className='item';
  d.innerHTML='<div class="head"><span class="file"></span><span class="size"></span><button data-t="'+id+'">Copier</button></div><pre></pre>';
  d.querySelector('.file').textContent='assets/img/'+g.folder+'/'+it.name+'.png';d.querySelector('.size').textContent=it.size;d.querySelector('pre').textContent=it.prompt;L.appendChild(d);});});
document.addEventListener('click',function(e){var b=e.target.closest('button[data-t]');if(!b)return;var t=T[b.getAttribute('data-t')];
 function ok(){b.textContent='Copié !';b.classList.add('done');setTimeout(function(){b.textContent='Copier';b.classList.remove('done');},1500);}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){fallback();});else fallback();
 function fallback(){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok();}catch(x){}document.body.removeChild(ta);}});
</script></main></body></html>"""

root=os.path.join(os.path.dirname(__file__),'..')
open(os.path.join(root,'assets','PROMPTS-IMAGES.md'),'w',encoding='utf-8').write(md())
open(os.path.join(root,'prompts-images.html'),'w',encoding='utf-8').write(page())
print(sum(len(g[2]) for g in GROUPS),'prompts')
