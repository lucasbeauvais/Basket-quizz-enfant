# Prompts pour générer les images du Quiz NBA

Générées avec Gemini ou ChatGPT, puis déposées dans `assets/img/<dossier>/<nom>.png`. Chaque image est **optionnelle** : tant qu'un fichier manque, le jeu garde son dessin actuel.

## Mode d'emploi

1. Colle d'abord le **guide de style** (bloc ci-dessous) au début de la conversation avec Gemini ou ChatGPT, puis envoie les prompts un par un.
2. Pour le Coach et les joueurs, garde **la même conversation** : l'IA garde le même style. Pour les 4 humeurs du coach, joins la 1re image du coach comme référence.
3. **Transparence** : ChatGPT sait faire des PNG à fond transparent. Si Gemini ne le fait pas, demande « plain pure white background » : je détourerai les images.
4. Renomme chaque fichier exactement comme indiqué (ex. `coach-happy.png`) et envoie-les-moi : je les redimensionne, je les compresse et je les mets dans le dépôt.

## Guide de style (à coller en premier)

```
STYLE GUIDE (apply to every image): bright, energetic cartoon illustration for a kids' basketball quiz game (ages 7-12), in the look of a modern 3D-rendered mobile sports game with stylized, friendly characters (big expressive eyes, slightly oversized heads, smooth clean shapes). Soft studio lighting with a warm rim light, saturated colors. Main palette: deep night navy #0e1233, purple #552583, gold #fdb927, basketball orange #e8752a, white accents. IMPORTANT: no real logos, no NBA logo, no team logos, no brand marks, no watermark. All characters are ORIGINAL cartoon characters and must NOT look like any real, identifiable person. No text or letters in the image unless the prompt explicitly asks for it.
```

## 1. Logo et bannière

### `assets/img/brand/logo.png` (1024 x 1024)

```
Round emblem for a kids' basketball game: a shiny basketball wearing a small golden crown, surrounded by a ring of gold stars and a purple ribbon, with motion streaks. No text. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/brand/banner.png` (1600 x 440 (très large))

```
Wide panoramic banner of a basketball arena at night seen from courtside: glossy wooden court in the lower quarter, a hoop on the far left and far right edges, a cheering crowd in the stands as colorful blurred dots, two big spotlights from the ceiling, a big empty jumbotron screen in the top center, a basketball bouncing near the center. Dark navy and purple tones with gold light. No text, no logos. Full background, no transparency.
```

## 2. Coach Mamba (4 humeurs, même personnage)

### `assets/img/coach/coach-mamba.png` (1024 x 1024)

```
'Coach Mamba', an original cartoon basketball coach: athletic man in his 40s, dark brown skin, shaved head, short neat black beard, confident warm smile, purple and gold team tracksuit jacket with the number 24 on the chest, silver whistle on a lanyard, arms crossed, proud and calm expression. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: navy #1b1733 to purple #552583.
```

### `assets/img/coach/coach-happy.png` (1024 x 1024)

```
SAME character as the previous image: 'Coach Mamba', an original cartoon basketball coach: athletic man in his 40s, dark brown skin, shaved head, short neat black beard, confident warm smile, purple and gold team tracksuit jacket with the number 24 on the chest, silver whistle on a lanyard, big smile, giving a thumbs up. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: purple #552583 to gold #fdb927.
```

### `assets/img/coach/coach-thinking.png` (1024 x 1024)

```
SAME character as the previous image: 'Coach Mamba', an original cartoon basketball coach: athletic man in his 40s, dark brown skin, shaved head, short neat black beard, confident warm smile, purple and gold team tracksuit jacket with the number 24 on the chest, silver whistle on a lanyard, one hand on his chin, one eyebrow raised, holding a small tactics clipboard, clever 'I have a secret for you' look. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: navy #1b1733 to purple #552583.
```

### `assets/img/coach/coach-cheer.png` (1024 x 1024)

```
SAME character as the previous image: 'Coach Mamba', an original cartoon basketball coach: athletic man in his 40s, dark brown skin, shaved head, short neat black beard, confident warm smile, purple and gold team tracksuit jacket with the number 24 on the chest, silver whistle on a lanyard, both fists raised, shouting with joy, confetti flying around him. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: gold #fdb927 to orange #e8752a.
```

## 3. Les 8 joueurs (avatars)

### `assets/img/players/p1.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'Cosmo': an extremely tall and slender young man, very long arms, short curly dark hair, brown skin, calm friendly smile, black and silver jersey with the number 1, a few small glowing stars and planets floating around him. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: black to silver-grey.
```

### `assets/img/players/p2.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'King Rebound': a powerful athletic man, dark brown skin, short dark hair, trimmed beard, white headband, purple and gold jersey with the number 23, a small golden crown floating just above his head. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: purple #552583 to gold #fdb927.
```

### `assets/img/players/p3.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'Jet': an athletic man, dark brown skin, shaved head, huge happy smile, red and black jersey with the number 23, white air-swirl wing shapes behind his shoulders as if he could fly. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: red #ce1141 to black.
```

### `assets/img/players/p4.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'Chef Swish': a slim guard, light brown skin, short dark hair, cheeky boyish smile, royal blue and yellow jersey with the number 30, wearing a tiny white chef's hat, spinning a basketball on one finger. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: royal blue #1d428a to yellow #ffc72c.
```

### `assets/img/players/p5.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'Olympus': a very tall muscular man with very long arms, dark brown skin, short dark hair, big determined smile, dark green and cream jersey with the number 34, a golden laurel wreath floating behind his head. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: green #00471b to cream #eee1c6.
```

### `assets/img/players/p6.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'The Magician': a big tall man, light skin, short brown hair, relaxed playful grin, navy and gold jersey with the number 15, holding a playing card with a jester picture (no letters) between two fingers. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: navy #0e2240 to gold #fec524.
```

### `assets/img/players/p7.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'Lightning': a quick point guard, light brown skin, short dark hair, smiling, silver and black jersey with the number 9, small blue-white-red French flag pin on the jersey, speed lines behind him. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: silver #c4ced4 to black.
```

### `assets/img/players/p8.png` (1024 x 1024)

```
Original cartoon basketball player nicknamed 'Dunkman': a huge and very strong center, dark brown skin, shaved head, joyful laugh, blue and white jersey with the number 32, holding a basketball in one giant hand, a few glass shards flying behind him like he just broke a backboard. Square 1:1 bust portrait (head and shoulders, head in the upper-middle), facing the viewer with a slight 3/4 turn, on a smooth radial-gradient background in the colors given. Leave some space around the head: the image will be cropped into a circle. Background: blue #0077c0 to white.
```

## 4. Icônes des catégories

### `assets/img/categories/legendes.png` (512 x 512)

```
Game icon: a golden trophy with a basketball on top, purple ribbon, sparkling stars, 'hall of fame' feeling. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/categories/stars.png` (512 x 512)

```
Game icon: a basketball with a bright blue and yellow lightning bolt striking through it, electric sparks. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/categories/france.png` (512 x 512)

```
Game icon: a basketball with a blue-white-red swoosh around it and a tiny Eiffel Tower silhouette next to it. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/categories/nba.png` (512 x 512)

```
Game icon: a basketball hoop with backboard and net, in red, white and blue colors, with a whistle. Generic, NOT the NBA logo. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/categories/regles.png` (512 x 512)

```
Game icon: a shiny referee whistle in gold with a small striped black-and-white referee shirt pattern behind it and a basketball. No text. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/categories/mix.png` (512 x 512)

```
Game icon: a golden 'all-star' basketball covered in small stars, with a rainbow sparkle trail. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

## 5. Effets des grandes animations

### `assets/img/fx/foam-finger.png` (800 x 1300 (vertical))

```
A giant purple foam finger like fans wave in basketball arenas: the hand points the index finger straight up, the big '#1' written in gold on the palm, gold outline, seen from the front, slightly tilted. Only the text '#1'. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/fx/explosion.png` (1024 x 1024)

```
Comic-book style explosion burst: layered spiky starburst in red, orange, gold and white-hot center, with small sparks and stars flying out. No text. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/fx/fireball.png` (1000 x 1200 (vertical))

```
A basketball engulfed in big cartoon flames (red, orange, yellow), flames rising above it, 'on fire' video game power-up feeling. No text. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/fx/trophy.png` (800 x 960 (vertical))

```
A shiny golden championship trophy: a basketball sitting on top of a golden net-and-hoop shape on a dark wooden base, sparkles. Generic design, no text. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

### `assets/img/fx/ball.png` (512 x 512)

```
A single basketball seen perfectly from the front, perfectly round, filling the whole image edge to edge, classic orange with black lines, soft shading, no shadow on the ground. Transparent background (PNG with alpha channel), subject centered with a small margin, nothing cut off.
```

## 6. Illustrations des questions (fond d'écran des questions)

### `assets/img/scenes/trophy.png` (1600 x 920 (paysage))

```
A golden basketball trophy on a pedestal in the middle of a dark arena under a single spotlight, sparkles, crowd blurred in the background. Keep the bottom 15% simple (a caption will be placed there). No text. Full background.
```

### `assets/img/scenes/mystery.png` (1600 x 920 (paysage))

```
A mysterious basketball player shown only as a dark silhouette under a spotlight in an arena, a big glowing gold question mark floating next to him. Keep the bottom 15% simple. Full background.
```

### `assets/img/scenes/globe.png` (1600 x 920 (paysage))

```
A cartoon planet Earth with a basketball orbiting around it like a moon, stars in a navy sky, a hint of an arena at the bottom. Keep the bottom 15% simple. No text. Full background.
```

### `assets/img/scenes/hoop.png` (1600 x 920 (paysage))

```
Low-angle view of a basketball hoop, backboard and swinging white net in a bright arena, a ball just going through the net, confetti. Keep the bottom 15% simple. No text. Full background.
```

### `assets/img/scenes/versus.png` (1600 x 920 (paysage))

```
Two cartoon basketball teams facing each other at center court before tip-off, a green team on the left and a purple-and-gold team on the right, electric energy between them, packed arena. Original characters, no logos. Keep the bottom 15% simple. No text. Full background.
```

### `assets/img/scenes/chess.png` (1600 x 920 (paysage))

```
A chessboard on a basketball court, the chess pieces are shaped like little basketball players and basketballs, the king piece is very tall. Keep the bottom 15% simple. No text. Full background.
```

## 7. Décor du mini-jeu de tir

### `assets/img/minigame/court.png` (1080 x 1800 (vertical, format téléphone))

```
Vertical phone-screen background of a basketball arena at night: dark navy upper part with two spotlights coming from the top-left, a cheering crowd as colorful blurred dots in the middle band, and a glossy wooden court floor occupying the bottom 19% of the image (the floor edge is a horizontal line at 81% of the height). IMPORTANT: NO hoop, NO backboard, NO pole, NO ball, NO players (the game draws them itself). The right third of the image should stay calm and uncluttered. No text. Full background.
```
