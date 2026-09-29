# Quiz NBA : deviens une légende du basket

Quiz de basket pour enfants : 54 questions sur les légendes (Jordan, Kobe...), les stars d'aujourd'hui (LeBron, Curry, Wembanyama...), les Français en NBA et les règles de la NBA.

## Jouer

Ouvrir `index.html` dans un navigateur (ordinateur, tablette ou téléphone). Aucune installation, ça marche aussi hors-ligne.
Pour y jouer en ligne : GitHub > Settings > Pages > branche `main`, dossier `/`.

## L'école des règles FIBA

Un bloc éducatif pour connaître les règles comme un arbitre (règles officielles FIBA, utilisées par la FFBB, simplifiées pour les enfants) :

- **8 chapitres** : le match et le terrain, marquer des points, bouger avec le ballon, les règles du temps, les contacts et les fautes, spécial mini-basket (U9/U11 et passage en U13), les gestes de l'arbitre, l'esprit du basket.
- **Fiches illustrées** : la règle, « chez les jeunes » (les adaptations du mini-basket), le geste de l'arbitre dessiné, et le truc du coach. On passe d'une fiche à l'autre avec les boutons ou en glissant le doigt.
- **Quiz de chapitre** : 4 bonnes réponses sur 5 pour gagner le badge sifflet. Chaque badge débloque un **ballon de couleur** (Émeraude, Or massif, Bleu éclair, Violet chrono, Rouge feu, Turquoise, Arbitre, Arc-en-ciel), à choisir dans Mon vestiaire : il sert dans le mini-jeu et les animations. Les 8 badges donnent le **diplôme d'arbitre junior** au nom de l'enfant.
- Les 52 questions forment aussi la catégorie « Règles FIBA jeunes » du quiz principal.

## Ce qui rend le jeu dynamique

| Moment | Effet |
|---|---|
| Bonne réponse | Dunk ou tir à 3 points animé, confettis, le « +3 » s'envole jusqu'au score |
| 3 bonnes réponses d'affilée | Gants en mousse « #1 » + explosion + canons à confettis, **1 ballon bonus** et un tir à 3 points bonus tout de suite |
| 5 bonnes réponses d'affilée | EN FEU : ballon en flammes, les réponses valent **+6** tant que la série continue |
| Mauvaise réponse | Tampon « RATÉ ! » |
| Fin du match | **Séance de tirs** : mini-jeu façon Angry Birds (on tire vers l'arrière, une courbe montre la visée, on relâche). +2 ou +3 par panier, +1 si « swish », dernier ballon « money ball » x2. Au hasard, un défenseur surprise essaie de contrer (il saute en rythme ou agite les bras) : il faut choisir le bon moment ou lober, +1 si on passe par-dessus |
| Accueil | Bouton « Entraînement aux tirs » pour jouer au mini-jeu librement |
| Mon vestiaire | Prénom, statistiques, choix du joueur (débloqués avec les étoiles), 9 fonds d'écran débloqués avec les points (50 à 1000 pts), remise à zéro du compte |

Les bruitages sont générés par le navigateur (aucun fichier son) et se coupent avec le bouton haut-parleur.

## Organisation

```
index.html              la page
css/style.css           les styles
js/data.js              questions, catégories, joueurs, secrets du coach  <- pour ajouter des questions
js/rules-data.js        l'école des règles : fiches et quiz par chapitre
js/rules-art.js         schémas de terrain et gestes de l'arbitre
js/rules.js             écrans de l'école des règles et diplôme
js/locker.js            Mon vestiaire : profil, joueurs, fonds d'écran, remise à zéro
js/art.js               dessins SVG (utilisés tant qu'il n'y a pas d'image)
js/assets.js            liste des images optionnelles
js/fx.js                grandes animations (GSAP + canvas-confetti)
js/minigame.js          mini-jeu de tir
js/sound.js             bruitages
js/app.js               écrans et règles du jeu
vendor/                 GSAP 3 et canvas-confetti (copiés pour marcher hors-ligne)
assets/img/             images générées (Gemini / ChatGPT)
prompts-images.html     tous les prompts pour générer les images, avec boutons « Copier »
prompts-images-lot2.html  le 2e lot : défenseur, fonds d'écran, badge sifflet, icône règles
prompts-images-lot3.html  le 3e lot : 8 ballons de style (débloqués avec les étoiles)
```

## Ajouter les images

1. Ouvrir `prompts-images.html` (ou `assets/PROMPTS-IMAGES.md`) et générer les images avec Gemini ou ChatGPT, en PNG, avec les noms indiqués.
2. Lancer `python3 tools/optimize_images.py <dossier des PNG>` : les images sont redimensionnées et converties en WebP dans `assets/img/` (31 images = 660 Ko au lieu de 28 Mo).
3. Le jeu utilise l'image dès qu'elle existe, sinon il garde le dessin SVG.

Pour modifier les prompts : éditer `tools/build_prompts.py` puis lancer `python3 tools/build_prompts.py`.

Jeu familial non officiel, sans lien avec la NBA. Les joueurs sont des personnages inventés ; seul Coach Mamba est inspiré de Kobe Bryant.
