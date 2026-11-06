# Quiz NBA : deviens une légende du basket

Quiz de basket pour enfants : 54 questions sur les légendes (Jordan, Kobe...), les stars d'aujourd'hui (LeBron, Curry, Wembanyama...), les Français en NBA et les règles de la NBA.

## Jouer

Adresse : **https://basketquiz.lucasbeauvais.com/** (Cloudflare Pages).
Ouvrir `index.html` marche aussi en local, sans installation, même hors-ligne.

### Hébergement Cloudflare Pages

1. Cloudflare > Workers & Pages > Create > Pages > Connect to Git > dépôt `Basket-quizz-enfant`.
2. Production branch : `claude/quiz-basket-nba-wqk51l` ; Framework : None ; Build command : vide ; Build output directory : `/`.
3. Custom domains > `basketquiz.lucasbeauvais.com`.

Chaque push sur la branche redéploie le site. `_headers` règle le cache (images et bibliothèques gardées 7 jours).

### Déménagement depuis GitHub Pages

L'ancienne adresse (`lucasbeauvais.github.io/Basket-quizz-enfant`) redirige vers la nouvelle **dès que celle-ci répond**, en emportant la partie du téléphone (une seule fois). Réglage : `NEW_HOME` dans `js/transfer.js`.

## Le Niveau Pro

20 questions plus difficiles : combinaisons (pick and roll, passe et va, alley-oop, backdoor, box-out), concours de dunks (Jordan 1988, Vince Carter 2000, Spud Webb, Nate Robinson, LaVine / Gordon) et règles avancées (faute disqualifiante, antisportives, prolongation, temps-morts, zone de non-charge...).
**+5 points** par bonne réponse (+10 en série « En feu »), l'indice du coach **coûte 2 points**, et ces questions sont **hors du Match des étoiles**.

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
| Transférer sa partie | Dans Mon vestiaire : lien + QR code qui contient toute la progression (après le #, rien n'est envoyé à un serveur). Ouvert sur un autre téléphone, il propose de récupérer la partie |

Les bruitages sont générés par le navigateur (aucun fichier son) et se coupent avec le bouton haut-parleur.

## Organisation

```
index.html              la page
css/style.css           les styles
js/data.js              questions, catégories, joueurs, secrets du coach  <- pour ajouter des questions
js/pro-data.js          les questions du Niveau Pro
js/rules-data.js        l'école des règles : fiches et quiz par chapitre
js/rules-art.js         schémas de terrain et gestes de l'arbitre
js/rules.js             écrans de l'école des règles et diplôme
js/locker.js            Mon vestiaire : profil, joueurs, fonds d'écran, remise à zéro
js/transfer.js          transfert de partie vers un autre téléphone (lien, QR code, code à coller)
js/art.js               dessins SVG (utilisés tant qu'il n'y a pas d'image)
js/assets.js            liste des images optionnelles
js/fx.js                grandes animations (GSAP + canvas-confetti)
js/minigame.js          mini-jeu de tir
js/sound.js             bruitages
js/app.js               écrans et règles du jeu
vendor/                 GSAP 3, canvas-confetti et qrcode-generator (copiés pour marcher hors-ligne)
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

---

# Arsenal de Poche (jeu bonus, dossier `arsenal/`)

Jeu de survie par vagues, gratuit et **sans pub** : remplis ton sac d'armes et de soins, fusionne-les, tiens 15 vagues.
Indépendant du quiz : tout est dans `arsenal/` (HTML/CSS/JS pur, aucune dépendance, marche hors-ligne).

- **Jouer** : `/arsenal/` sur le site déployé (ex. `https://basketquiz.lucasbeauvais.com/arsenal/` une fois la branche fusionnée dans la branche de production), ou ouvrir `arsenal/index.html` en local.
- **Installer comme une appli** : sur mobile, menu du navigateur > « Ajouter à l'écran d'accueil » (manifest + service worker = plein écran et hors-ligne).
- **Sauvegarde** : dans le navigateur (localStorage), la partie en cours reprend là où tu l'as laissée entre deux vagues.

## Mécaniques
- **Sac (grille)** : seuls les objets posés dans le sac sont actifs. La réserve (6 cases) stocke.
- **Boutique** : 3 objets tirés au sort par vague (rareté Commun → Légendaire, meilleure au fil des vagues). 1 relance gratuite par vague, puis payante.
- **Fusion** : 2 objets identiques de même niveau → 1 objet ★ supérieur (max ★★★).
- **Combos d'adjacence** : Munitions (+dégâts), Boisson (+cadence), Lunette (+critique), Crocs (vol de vie) boostent les armes qu'ils touchent.
- **Soins / défense** : Bandage, Trousse, Plaque, Bouclier, Pile de secours (relève une fois par vague). Les PV ne remontent que de 30 % entre les vagues.
- **Boss** aux vagues 5, 10, 15. Gagner un chapitre débloque le suivant (ennemis ×2,2 PV), sans fin.
- **Atelier** : les pièces gagnées achètent des améliorations permanentes (PV, dégâts, argent de départ, chance, sac plus grand, boutique plus grande).

## Équilibrage
Tout se règle dans `arsenal/data.js` (objets, ennemis, améliorations) et `buildWave()` dans `arsenal/game.js` (difficulté des vagues).
En console : `ARSENAL.run`, `ARSENAL.meta`, `ARSENAL.tick(dt)` pour simuler.
