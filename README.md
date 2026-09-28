# Quiz NBA : deviens une légende du basket

Quiz de basket pour enfants : 54 questions sur les légendes (Jordan, Kobe...), les stars d'aujourd'hui (LeBron, Curry, Wembanyama...), les Français en NBA et les règles de la NBA.

## Jouer

Ouvrir `index.html` dans un navigateur (ordinateur, tablette ou téléphone). Aucune installation, ça marche aussi hors-ligne.
Pour y jouer en ligne : GitHub > Settings > Pages > branche `main`, dossier `/`.

## Ce qui rend le jeu dynamique

| Moment | Effet |
|---|---|
| Bonne réponse | Dunk ou tir à 3 points animé, confettis, le « +3 » s'envole jusqu'au score |
| 3 bonnes réponses d'affilée | Gants en mousse « #1 » + explosion + canons à confettis, **1 ballon bonus** et un tir à 3 points bonus tout de suite |
| 5 bonnes réponses d'affilée | EN FEU : ballon en flammes, les réponses valent **+6** tant que la série continue |
| Mauvaise réponse | Tampon « RATÉ ! » |
| Fin du match | **Séance de tirs** : mini-jeu façon Angry Birds (on tire vers l'arrière, une courbe montre la visée, on relâche). +2 ou +3 par panier, +1 si « swish », dernier ballon « money ball » x2 |
| Accueil | Bouton « Entraînement aux tirs » pour jouer au mini-jeu librement |

Les bruitages sont générés par le navigateur (aucun fichier son) et se coupent avec le bouton haut-parleur.

## Organisation

```
index.html              la page
css/style.css           les styles
js/data.js              questions, catégories, joueurs, secrets du coach  <- pour ajouter des questions
js/art.js               dessins SVG (utilisés tant qu'il n'y a pas d'image)
js/assets.js            liste des images optionnelles
js/fx.js                grandes animations (GSAP + canvas-confetti)
js/minigame.js          mini-jeu de tir
js/sound.js             bruitages
js/app.js               écrans et règles du jeu
vendor/                 GSAP 3 et canvas-confetti (copiés pour marcher hors-ligne)
assets/img/             images générées (Gemini / ChatGPT)
prompts-images.html     les prompts pour générer les images, avec boutons « Copier »
```

## Ajouter les images

1. Ouvrir `prompts-images.html` (ou `assets/PROMPTS-IMAGES.md`) et générer les images avec Gemini ou ChatGPT.
2. Déposer chaque PNG dans `assets/img/<dossier>/<nom>.png` avec le nom exact.
3. C'est tout : le jeu utilise l'image dès qu'elle existe, sinon il garde le dessin.

Pour modifier les prompts : éditer `tools/build_prompts.py` puis lancer `python3 tools/build_prompts.py`.

Jeu familial non officiel, sans lien avec la NBA. Les personnages sont des dessins originaux inspirés de vrais joueurs.
