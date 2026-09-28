/* ============================================================
   L'ÉCOLE DES RÈGLES : règles FIBA adaptées aux jeunes
   Chaque chapitre = des fiches (à lire) + un quiz (à réussir pour
   gagner le badge). Les questions servent aussi à la catégorie
   "Règles FIBA" du quiz principal (level 5).
   Fiche : t (titre), scene (dessin), rule (la règle), young (chez
   les jeunes, optionnel), sig (geste de l'arbitre, optionnel),
   tip (le truc du coach)
   ============================================================ */
var RULE_CHAPTERS = [

  /* -------------------------------------------------- 1 */
  { id:'match', title:"Le match et le terrain", sub:"Équipes, durée, entre-deux, sorties", color:"#2e9e5b",
    cards:[
      { t:"Le but du jeu", scene:function(){return RA.sceneAttack();},
        rule:"Deux équipes s'affrontent. Chaque équipe attaque un panier et défend l'autre. À la mi-temps, on change de côté.",
        tip:"Avant le match, regarde bien de quel côté ton équipe attaque. Ça évite de marquer chez soi !" },
      { t:"Combien de joueurs ?", scene:function(){return RA.sceneTeam();},
        rule:"En FIBA, chaque équipe a 5 joueurs sur le terrain. Les autres attendent sur le banc et peuvent remplacer un coéquipier quand le jeu est arrêté.",
        young:"Chez les plus jeunes, on joue souvent à 3 contre 3 ou 4 contre 4 : chacun touche plus le ballon.",
        sig:'sub',
        tip:"Pour entrer, attends que l'arbitre te fasse signe avec le geste du remplacement." },
      { t:"La durée du match", scene:function(){return RA.sceneClock('10','Un quart-temps FIBA');},
        rule:"En FIBA, un match dure 4 quarts-temps de 10 minutes. Le chrono s'arrête à chaque coup de sifflet, donc un match dure bien plus longtemps en vrai !",
        young:"En mini-basket, les périodes sont plus courtes. Ton club et ton comité fixent la durée exacte.",
        sig:'timeout',
        tip:"Chaque coach peut demander des temps-morts pour parler à son équipe. Écoute bien pendant ce moment-là." },
      { t:"L'entre-deux et la flèche", scene:function(){return RA.sceneJump();},
        rule:"Le match commence par un entre-deux au milieu du terrain : l'arbitre lance le ballon entre deux joueurs qui sautent pour le taper. Ensuite, quand personne ne peut avoir le ballon (ballon tenu par exemple), c'est une flèche sur la table de marque qui décide. Elle change de sens à chaque fois : c'est la possession alternée.",
        tip:"Pendant l'entre-deux, on tape le ballon vers un coéquipier, on ne l'attrape pas." },
      { t:"Dedans ou dehors ?", scene:function(){return RA.sceneSideline();},
        rule:"Les lignes qui entourent le terrain font partie du dehors. Si le ballon ou le joueur qui l'a touche la ligne, le ballon est sorti. Il est rendu à l'équipe qui ne l'a pas touché en dernier, avec une remise en jeu.",
        sig:'direction',
        tip:"Près de la ligne, regarde tes pieds ! Même un orteil sur la ligne, c'est dehors." }
    ],
    quiz:[
      { q:"Au basket FIBA, combien de joueurs par équipe sont sur le terrain ?", choices:["5","4","6","11"], correct:0,
        hint:"Autant que les doigts d'une main.", explain:"5 joueurs par équipe. Chez les plus jeunes, on joue souvent à 3 contre 3 ou 4 contre 4.", scene:function(){return RA.sceneTeam();} },
      { q:"Un match FIBA, c'est 4 quarts-temps de combien de minutes ?", choices:["10 minutes","12 minutes","20 minutes","45 minutes"], correct:0,
        hint:"C'est moins qu'en NBA, où c'est 12.", explain:"4 fois 10 minutes en FIBA (en NBA, c'est 4 fois 12). Le chrono s'arrête à chaque coup de sifflet.", scene:function(){return RA.sceneClock('10','Un quart-temps');} },
      { q:"Un joueur a le pied SUR la ligne de touche avec le ballon. Le ballon est...", choices:["Dehors","Encore dedans","Ça dépend de l'arbitre","À rejouer"], correct:0,
        hint:"La ligne ne fait pas partie du terrain.", explain:"La ligne, c'est déjà dehors. L'autre équipe fait une remise en jeu.", scene:function(){return RA.sceneSideline();} },
      { q:"Ton adversaire touche le ballon en dernier avant qu'il sorte. Qui fait la remise en jeu ?", choices:["Ton équipe","L'adversaire","On fait un entre-deux","Personne"], correct:0,
        hint:"Celui qui touche en dernier « donne » le ballon à l'autre.", explain:"Le ballon va à l'équipe qui ne l'a pas touché en dernier : ici, c'est ton équipe.", scene:function(){return RA.sceneInbound();} },
      { q:"Deux adversaires tiennent le ballon très fort en même temps. Que décide l'arbitre ?", choices:["Ballon tenu : c'est la flèche qui décide","Le plus fort garde le ballon","1 point pour chacun","On recommence le match"], correct:0,
        hint:"Il y a une flèche sur la table de marque.", explain:"C'est un ballon tenu. La flèche de possession alternée donne le ballon à une équipe, puis elle change de sens.", scene:function(){return RA.sceneHeld();} },
      { q:"Que fait l'arbitre pour montrer qu'un joueur peut entrer en remplacement ?", choices:["Il croise les avant-bras devant sa poitrine","Il lève le poing","Il tape sur son épaule","Il met les mains sur les hanches"], correct:0,
        hint:"Les bras forment une croix.", explain:"Avant-bras croisés = remplacement. Le joueur attend ce signe pour entrer.", scene:function(){return sceneSignal('sub');} }
    ]},

  /* -------------------------------------------------- 2 */
  { id:'points', title:"Marquer des points", sub:"1, 2 ou 3 points, fautes sur tir", color:"#e8752a",
    cards:[
      { t:"Le panier à 2 points", scene:function(){return RA.sceneShoot();},
        rule:"Un panier marqué pendant le jeu vaut 2 points.",
        sig:'p2',
        tip:"Sous le panier, vise le petit carré dessiné sur le panneau : le ballon rebondit dedans." },
      { t:"Le tir à 3 points", scene:function(){return RA.sceneThree();},
        rule:"Un tir réussi de derrière la grande ligne courbe (à 6,75 m du panier en FIBA) vaut 3 points. Tes deux pieds doivent être derrière la ligne quand tu tires. Si tu marches sur la ligne, ça ne vaut que 2 points.",
        young:"En mini-basket (U9, U11), il n'y a pas de tir à 3 points : tous les paniers valent 2 points. Le 3 points arrive en U13.",
        sig:'p3',
        tip:"Avant de tirer de loin, jette un œil à tes pieds : un pied sur la ligne, et tu perds 1 point !" },
      { t:"Le lancer franc", scene:function(){return RA.sceneFreeThrow();},
        rule:"Un lancer franc réussi vaut 1 point. On le tire tout seul depuis la ligne, personne ne peut te gêner. Tu as 5 secondes pour tirer, et tu ne dois pas marcher sur la ligne avant que le ballon touche l'anneau.",
        sig:'p1',
        tip:"Fais toujours le même petit rituel avant de tirer (trois dribbles, une respiration). Ça aide à viser." },
      { t:"La faute sur un tireur", scene:function(){return RA.sceneShootFoul();},
        rule:"Si un défenseur fait faute pendant que tu tires : si le panier rentre, il compte ET tu tires 1 lancer franc en plus. S'il ne rentre pas, tu tires 2 lancers francs (ou 3 si c'était un tir à 3 points).",
        tip:"Même si on te fait faute, termine ton tir ! Si ça rentre, tu gagnes un lancer franc en plus." },
      { t:"Le ballon qui redescend", scene:function(){return RA.sceneGoaltend('desc');},
        rule:"Quand le ballon redescend vers le panier, au-dessus de l'anneau, personne n'a le droit de le toucher. Si un défenseur le tape à ce moment-là, le panier est accordé quand même. C'est le « goaltending ».",
        tip:"Pour contrer, saute tôt, quand le ballon monte encore." },
      { t:"Panier dans son propre camp", scene:function(){return RA.sceneWrongBasket();},
        rule:"Si un joueur marque par erreur dans le panier de sa propre équipe, les 2 points vont à l'équipe adverse.",
        tip:"Encore une raison de bien savoir de quel côté tu attaques !" }
    ],
    quiz:[
      { q:"Un lancer franc réussi, ça vaut combien de points ?", choices:["1 point","2 points","3 points","0 point"], correct:0,
        hint:"C'est le tir tout seul, sans défenseur.", explain:"Un lancer franc vaut 1 point.", scene:function(){return RA.sceneFreeThrow();} },
      { q:"En FIBA, tu tires de derrière la grande ligne courbe et ça rentre. Combien de points ?", choices:["3 points","2 points","1 point","4 points"], correct:0,
        hint:"Plus on tire de loin, plus ça rapporte.", explain:"3 points ! Attention : en U9 et U11, il n'y a pas encore de tir à 3 points.", scene:function(){return RA.sceneThree();} },
      { q:"En mini-basket (U9, U11), un tir de très loin réussi vaut...", choices:["2 points, comme tous les paniers","3 points","5 points","0 point"], correct:0,
        hint:"Le 3 points, c'est pour plus tard.", explain:"En mini-basket, tous les paniers du jeu valent 2 points. Le tir à 3 points arrive en U13.", scene:function(){return RA.sceneThree();} },
      { q:"On te fait faute pendant ton tir à 2 points, mais ça rentre quand même. Que se passe-t-il ?", choices:["Le panier compte et tu tires 1 lancer franc en plus","Le panier est annulé","Tu tires 2 lancers francs sans le panier","Rien"], correct:0,
        hint:"On garde le panier et on ajoute un cadeau.", explain:"Le panier compte (2 points) et tu tires 1 lancer franc en plus : 3 points possibles sur l'action !", scene:function(){return RA.sceneShootFoul();} },
      { q:"On te fait faute pendant ton tir à 3 points, et ça ne rentre pas. Combien de lancers francs ?", choices:["3","2","1","0"], correct:0,
        hint:"Autant de lancers que ce que valait ton tir.", explain:"Tir à 3 points raté avec faute = 3 lancers francs. Tir à 2 points raté = 2 lancers francs.", scene:function(){return RA.sceneThreeFoul();} },
      { q:"Un défenseur tape le ballon qui redescend déjà vers le panier, au-dessus de l'anneau. L'arbitre...", choices:["Accorde le panier à l'attaquant","Refuse le panier","Siffle un ballon tenu","Ne dit rien"], correct:0,
        hint:"On ne touche pas un ballon qui redescend vers le cercle.", explain:"C'est du goaltending : le panier est accordé à l'attaquant.", scene:function(){return RA.sceneGoaltend('desc');} },
      { q:"L'arbitre lève les deux bras avec 3 doigts à chaque main. Ça veut dire...", choices:["Tir à 3 points réussi","3 secondes","3 fautes","Temps-mort"], correct:0,
        hint:"C'est le plus beau geste pour un shooteur.", explain:"Les deux bras levés avec 3 doigts : le tir à 3 points est rentré !", scene:function(){return sceneSignal('p3');} }
    ]},

  /* -------------------------------------------------- 3 */
  { id:'ball', title:"Bouger avec le ballon", sub:"Dribble, marcher, pas zéro, pivot", color:"#1f6feb",
    cards:[
      { t:"Le dribble", scene:function(){return RA.sceneDribble();},
        rule:"Pour avancer avec le ballon, tu dois dribbler : faire rebondir le ballon au sol avec une seule main à la fois. Courir en tenant le ballon dans les mains, c'est interdit.",
        tip:"Dribble avec le bout des doigts, pas avec la paume, et garde la tête haute." },
      { t:"Le marcher", scene:function(){return RA.sceneSteps([[150,150,'1'],[170,143,'2']],'Après le dribble : 2 pas');},
        rule:"Quand tu attrapes le ballon en bougeant, tu as droit à 2 appuis (2 pas) pour t'arrêter, tirer ou passer. Un pas de plus, et c'est un « marcher » : le ballon va à l'adversaire.",
        sig:'travel',
        tip:"Entraîne-toi au double-pas : droite, gauche, et on monte au panier !" },
      { t:"Le pas zéro", scene:function(){return RA.sceneSteps([[150,150,'0'],[170,143,'1'],[189,150,'2']],'Le pas zéro');},
        rule:"Le pied qui touche le sol au moment où tu attrapes le ballon en fin de dribble ne compte pas : c'est le « pas zéro ». Ensuite tu as tes 2 pas. C'est une règle FIBA depuis 2018.",
        tip:"Le pas zéro, ce n'est pas une astuce pour tricher : l'arbitre regarde bien quand tu attrapes le ballon." },
      { t:"Le pied de pivot", scene:function(){return RA.scenePivot();},
        rule:"Quand tu es arrêté avec le ballon, tu peux tourner sur un pied qui reste collé au sol : c'est le pied de pivot. L'autre pied bouge autant que tu veux. Si tu décolles le pied de pivot avant de dribbler, c'est un marcher.",
        tip:"Le pivot, c'est ta meilleure arme pour protéger le ballon et trouver un coéquipier." },
      { t:"La reprise de dribble", scene:function(){return RA.sceneHold();},
        rule:"Quand tu arrêtes de dribbler et que tu tiens le ballon à deux mains, ton dribble est fini. Tu dois passer ou tirer. Si tu redribbles, c'est une reprise de dribble (on dit aussi « double dribble »).",
        sig:'dribble',
        tip:"Ne t'arrête de dribbler que quand tu sais à qui tu vas passer." },
      { t:"Le ballon au pied", scene:function(){return RA.sceneSteal();},
        rule:"Le basket se joue avec les mains. Taper ou bloquer le ballon exprès avec le pied ou la jambe, c'est une violation. Si le ballon touche ton pied par accident, l'arbitre laisse jouer.",
        tip:"Pour prendre le ballon, vise le ballon avec la main, jamais le bras de l'adversaire." }
    ],
    quiz:[
      { q:"Tu attrapes le ballon après ton dribble. Combien de pas as-tu le droit de faire ?", choices:["2 pas","Aucun","5 pas","Autant que je veux"], correct:0,
        hint:"Le même nombre que tes deux pieds.", explain:"2 appuis, pour t'arrêter, tirer ou passer. Au-delà, c'est un marcher.", scene:function(){return RA.sceneSteps([[150,150,'1'],[170,143,'2']],'Après le dribble');} },
      { q:"Comment s'appelle l'appui qui ne compte pas, au moment où tu attrapes le ballon en fin de dribble ?", choices:["Le pas zéro","Le pas de géant","Le pas interdit","Le triple pas"], correct:0,
        hint:"C'est le pas numéro... avant le 1 !", explain:"Le pas zéro ne compte pas. Ensuite tu as tes 2 pas.", scene:function(){return RA.sceneSteps([[150,150,'0'],[170,143,'1'],[189,150,'2']],'?');} },
      { q:"Tu dribbles, tu prends le ballon à deux mains, puis tu redribbles. C'est...", choices:["Une reprise de dribble, interdit","Autorisé","Autorisé si tu changes de main","Un lancer franc"], correct:0,
        hint:"Une fois le ballon tenu, le dribble est fini.", explain:"C'est une reprise de dribble : le ballon va à l'autre équipe.", scene:function(){return RA.sceneHold();} },
      { q:"Tu es arrêté avec le ballon. Que peux-tu faire avec tes pieds ?", choices:["Tourner sur un pied qui reste collé au sol","Bouger les deux pieds librement","Faire 3 pas","Sauter à cloche-pied"], correct:0,
        hint:"Un pied reste « collé » au sol.", explain:"C'est le pied de pivot : il reste au sol, l'autre pied tourne autour.", scene:function(){return RA.scenePivot();} },
      { q:"L'arbitre fait tourner ses poings l'un autour de l'autre. Il siffle...", choices:["Un marcher","Une faute","Un temps-mort","3 points"], correct:0,
        hint:"Ça ressemble à des jambes qui courent trop.", explain:"Les poings qui tournent = marcher. Trop de pas avec le ballon !", scene:function(){return sceneSignal('travel');} },
      { q:"L'arbitre fait le geste de dribbler avec ses deux mains, l'une après l'autre. Il siffle...", choices:["Une reprise de dribble","Un marcher","Une faute","Un panier"], correct:0,
        hint:"Il imite un dribble... mais avec les deux mains.", explain:"C'est le geste de la reprise de dribble (double dribble).", scene:function(){return sceneSignal('dribble');} }
    ]},

  /* -------------------------------------------------- 4 */
  { id:'clock', title:"Les règles du temps", sub:"3, 5, 8, 14 et 24 secondes", color:"#8b5cf6",
    cards:[
      { t:"Les 3 secondes", scene:function(){return RA.sceneKey();},
        rule:"En attaque, tu ne peux pas rester plus de 3 secondes dans la raquette de l'adversaire (la zone peinte sous son panier). Sinon, le ballon va à l'autre équipe.",
        sig:'three',
        tip:"Compte dans ta tête : « un, deux »... et sors ! Tu pourras revenir juste après." },
      { t:"Les 5 secondes", scene:function(){return RA.sceneProtect();},
        rule:"Si tu tiens le ballon sans dribbler et qu'un défenseur te colle, tu as 5 secondes pour passer, tirer ou dribbler. Tu as aussi 5 secondes pour faire une remise en jeu et 5 secondes pour tirer un lancer franc.",
        tip:"Ne garde pas le ballon trop longtemps : le basket, c'est un jeu de passes." },
      { t:"Les 8 secondes", scene:function(){return RA.sceneBackcourt('8','8 secondes pour franchir');},
        rule:"Quand ton équipe récupère le ballon dans sa moitié de terrain, elle a 8 secondes pour passer la ligne du milieu.",
        tip:"Après un panier adverse, remonte vite le ballon : chaque seconde compte." },
      { t:"Les 24 secondes", scene:function(){return RA.sceneClock('24','24 secondes pour tirer');},
        rule:"Ton équipe a 24 secondes pour tirer, et le ballon doit au moins toucher l'anneau. Un chrono spécial au-dessus du panneau compte ce temps. Si le temps est écoulé, le ballon va à l'adversaire.",
        young:"En mini-basket, le temps pour tirer peut être différent, ou pas compté du tout : ça dépend de ta catégorie. Ton coach te dira.",
        sig:'shotclock',
        tip:"Regarde le chrono au-dessus du panneau : quand il reste 5 secondes, il faut tirer !" },
      { t:"Les 14 secondes", scene:function(){return RA.sceneClock('14','Après un rebond offensif');},
        rule:"Si ton tir touche l'anneau et que ton équipe reprend le rebond, le chrono ne repart pas à 24 mais à 14 secondes.",
        tip:"Sur un rebond offensif, on peut souvent retirer tout de suite, tout près du panier." },
      { t:"Le retour en zone", scene:function(){return RA.sceneBackcourt(null,'Retour en zone ?');},
        rule:"Une fois que ton équipe a amené le ballon dans la moitié d'attaque, elle ne peut plus le ramener dans sa propre moitié. Sinon c'est un retour en zone, et le ballon va à l'adversaire.",
        tip:"Près de la ligne du milieu, fais attention à tes pieds et à tes passes en arrière." }
    ],
    quiz:[
      { q:"En attaque, combien de temps peux-tu rester dans la raquette adverse ?", choices:["3 secondes","8 secondes","Tant que je veux","24 secondes"], correct:0,
        hint:"Très court : on ne campe pas sous le panier.", explain:"3 secondes maximum, sinon le ballon va à l'autre équipe.", scene:function(){return RA.sceneKey();} },
      { q:"Combien de temps a ton équipe pour passer la ligne du milieu ?", choices:["8 secondes","3 secondes","24 secondes","Pas de limite"], correct:0,
        hint:"Un tiers de 24.", explain:"8 secondes pour amener le ballon dans la moitié d'attaque.", scene:function(){return RA.sceneBackcourt('8','?');} },
      { q:"Combien de temps a ton équipe pour tirer au panier ?", choices:["24 secondes","10 secondes","1 minute","Aucune limite"], correct:0,
        hint:"Il y a un chrono au-dessus du panneau.", explain:"24 secondes, et le ballon doit toucher l'anneau.", scene:function(){return RA.sceneClock('??','Le chrono des tirs');} },
      { q:"Ton tir touche l'anneau et ton équipe prend le rebond. Le chrono repart à...", choices:["14 secondes","24 secondes","8 secondes","0"], correct:0,
        hint:"Pas les 24 complètes.", explain:"Après un rebond offensif, le chrono repart à 14 secondes.", scene:function(){return RA.sceneClock('14','Rebond offensif');} },
      { q:"Pour une remise en jeu, en combien de temps dois-tu lâcher le ballon ?", choices:["5 secondes","1 seconde","10 secondes","Pas de limite"], correct:0,
        hint:"Autant que les doigts d'une main.", explain:"5 secondes pour passer le ballon, sinon l'autre équipe récupère la remise en jeu.", scene:function(){return RA.sceneInbound('5');} },
      { q:"Ton équipe est en attaque. Tu fais une passe en arrière à un copain resté dans votre moitié de terrain. C'est...", choices:["Un retour en zone, interdit","Autorisé","Un lancer franc","Une faute technique"], correct:0,
        hint:"Une fois la ligne du milieu passée, pas de marche arrière.", explain:"C'est un retour en zone : le ballon va à l'adversaire.", scene:function(){return RA.sceneBackcourt(null,'Retour en zone ?');} },
      { q:"L'arbitre tend le bras sur le côté en montrant 3 doigts. Il siffle...", choices:["Les 3 secondes","Un tir à 3 points","3 fautes","3 lancers francs"], correct:0,
        hint:"Il parle de temps, pas de points.", explain:"Bras tendu sur le côté avec 3 doigts : un attaquant est resté plus de 3 secondes dans la raquette.", scene:function(){return sceneSignal('three');} }
    ]},

  /* -------------------------------------------------- 5 */
  { id:'fouls', title:"Les contacts et les fautes", sub:"Cylindre, passage en force, 5 fautes", color:"#c81d25",
    cards:[
      { t:"Le cylindre", scene:function(){return RA.sceneStance();},
        rule:"Chaque joueur a droit à son espace : un cylindre imaginaire autour de lui, du sol jusqu'au plafond. En défense, tu peux sauter bras levés tout droit dans ton cylindre. Entrer dans le cylindre d'un autre et le toucher, c'est une faute.",
        tip:"Pour défendre sans faute : genoux pliés, bras levés bien droits, et on bouge avec les pieds." },
      { t:"La faute personnelle", scene:function(){return RA.sceneContact('Contact interdit');},
        rule:"Pousser, tenir, taper ou accrocher un adversaire, c'est une faute personnelle. Si le joueur ne tirait pas, son équipe fait une remise en jeu (ou tire des lancers francs si l'équipe fautive a déjà trop de fautes).",
        sig:'foul',
        tip:"Quand tu fais une faute, lève la main : c'est fair-play et ça aide la table de marque." },
      { t:"Le passage en force", scene:function(){return RA.sceneCharge();},
        rule:"Si l'attaquant fonce dans un défenseur qui était déjà bien placé et immobile, c'est l'attaquant qui fait faute : un passage en force.",
        sig:'charge',
        tip:"En attaque, regarde devant toi : contourne le défenseur au lieu de foncer dedans." },
      { t:"L'obstruction", scene:function(){return RA.sceneContact('Obstruction');},
        rule:"Si le défenseur se jette devant l'attaquant au dernier moment, ou le bloque en bougeant, c'est le défenseur qui fait faute : une obstruction.",
        sig:'block',
        tip:"En défense, place-toi tôt. Arriver en retard, c'est souvent une faute." },
      { t:"5 fautes et on sort", scene:function(){return RA.sceneContact('5 fautes = sortie');},
        rule:"En FIBA, un joueur qui a fait 5 fautes doit quitter le match et ne peut plus revenir. (En NBA, c'est à 6 fautes.)",
        tip:"Avec 3 ou 4 fautes, défends avec les pieds, pas avec les mains." },
      { t:"Les fautes d'équipe", scene:function(){return RA.sceneContact("Fautes d'équipe");},
        rule:"La table de marque compte aussi les fautes de toute l'équipe à chaque quart-temps. À partir de la 5e faute d'équipe dans un quart-temps, chaque nouvelle faute donne 2 lancers francs à l'adversaire. Le compteur repart à zéro au quart-temps suivant.",
        tip:"Quand ton équipe a déjà 4 fautes, chaque contact coûte cher : concentration !" },
      { t:"La faute technique", scene:function(){return RA.sceneTech();},
        rule:"Râler contre l'arbitre, se moquer ou faire un geste pas sympa, c'est une faute technique, même sans contact. L'adversaire tire 1 lancer franc. À la 2e faute technique, le joueur est exclu.",
        sig:'tech',
        tip:"L'arbitre a toujours le dernier mot. Respire, et concentre-toi sur la prochaine action." },
      { t:"La faute antisportive", scene:function(){return RA.sceneContact('Faute antisportive');},
        rule:"Un contact fait exprès, sans chercher à jouer le ballon, ou un contact trop violent, c'est une faute antisportive. L'adversaire tire des lancers francs ET garde le ballon.",
        sig:'unsport',
        tip:"On joue le ballon, jamais le joueur." }
    ],
    quiz:[
      { q:"Tu pousses un adversaire avec les mains pour lui prendre le ballon. C'est...", choices:["Une faute personnelle","Autorisé","Un marcher","Un entre-deux"], correct:0,
        hint:"Contact interdit = coup de sifflet.", explain:"Pousser, tenir ou taper, c'est une faute personnelle.", scene:function(){return RA.sceneContact('Contact interdit');} },
      { q:"L'attaquant fonce dans un défenseur qui était immobile et bien placé. Qui fait faute ?", choices:["L'attaquant : passage en force","Le défenseur : obstruction","Personne","Les deux"], correct:0,
        hint:"Le défenseur était là en premier.", explain:"C'est un passage en force : la faute est pour l'attaquant.", scene:function(){return RA.sceneCharge();} },
      { q:"En FIBA, au bout de combien de fautes un joueur doit-il sortir du match ?", choices:["5","6","3","10"], correct:0,
        hint:"Une de moins qu'en NBA.", explain:"5 fautes en FIBA (6 en NBA). Le joueur ne peut plus revenir.", scene:function(){return RA.sceneContact('5 fautes = sortie');} },
      { q:"À partir de combien de fautes d'équipe dans un quart-temps chaque faute donne 2 lancers francs ?", choices:["La 5e","La 1re","La 10e","Jamais"], correct:0,
        hint:"L'équipe a droit à 4 fautes sans lancers francs.", explain:"À partir de la 5e faute d'équipe du quart-temps, chaque faute donne 2 lancers francs.", scene:function(){return RA.sceneContact("Fautes d'équipe");} },
      { q:"Un joueur râle méchamment contre l'arbitre. L'arbitre peut siffler...", choices:["Une faute technique","Rien du tout","Un marcher","Un entre-deux"], correct:0,
        hint:"Une faute de comportement, sans contact.", explain:"Faute technique : l'adversaire tire 1 lancer franc. À la 2e, le joueur est exclu.", scene:function(){return RA.sceneTech();} },
      { q:"En défense, tu sautes bras levés bien droits au-dessus de toi, et l'attaquant te rentre dedans. C'est...", choices:["Normal : tu restes dans ton cylindre","Forcément une faute du défenseur","Un marcher","Une faute technique"], correct:0,
        hint:"Chaque joueur a droit à son espace, tout droit au-dessus de lui.", explain:"Tu as le droit de sauter tout droit dans ton cylindre. C'est une très bonne défense !", scene:function(){return RA.sceneStance();} },
      { q:"L'arbitre tape son poing dans sa main ouverte. Il siffle...", choices:["Un passage en force","Un temps-mort","Un panier à 2 points","Une reprise de dribble"], correct:0,
        hint:"Le poing « fonce » dans la main.", explain:"Poing dans la paume = passage en force de l'attaquant.", scene:function(){return sceneSignal('charge');} },
      { q:"L'arbitre met ses deux mains sur les hanches. Il siffle...", choices:["Une obstruction","Un marcher","Un remplacement","Une sortie"], correct:0,
        hint:"Il « bloque » le passage avec ses bras.", explain:"Mains sur les hanches = obstruction du défenseur.", scene:function(){return sceneSignal('block');} }
    ]},

  /* -------------------------------------------------- 6 */
  { id:'mini', title:"Spécial mini-basket", sub:"Les règles adaptées aux U9 et U11", color:"#0ea5a4",
    cards:[
      { t:"Un panier à ta taille", scene:function(){return RA.sceneHoopHeight('low');},
        rule:"En U9 et U11, le panier est à 2,60 m au lieu de 3,05 m. Tu marques plus facilement, avec un geste de tir propre.",
        young:"En U13, le panier monte à 3,05 m, la vraie hauteur des grands.",
        tip:"Ne force pas avec les bras : pousse avec les jambes pour tirer loin." },
      { t:"Un ballon à ta taille", scene:function(){return RA.sceneBallSize('t5');},
        rule:"En mini-basket, on joue avec un ballon taille 5, plus petit et plus léger. En U13, on passe au taille 6. Les adultes jouent en taille 7 (hommes) ou taille 6 (femmes).",
        tip:"Avec un petit ballon, tu peux apprendre à dribbler des deux mains. Profites-en !" },
      { t:"Défense individuelle obligatoire", scene:function(){return RA.sceneDefIndiv();},
        rule:"En mini-basket, chaque défenseur s'occupe d'un attaquant : c'est la défense individuelle. Se regrouper tous sous le panier (la défense de zone) est interdit.",
        tip:"Reste toujours entre ton joueur et ton panier." },
      { t:"La remise en jeu protégée", scene:function(){return RA.sceneInboundMini();},
        rule:"Dans beaucoup de rencontres de mini-basket, le défenseur qui est devant celui qui remet le ballon en jeu garde les mains dans le dos jusqu'à ce que le ballon soit passé.",
        young:"Cette règle dépend de ta catégorie et de ton comité : demande à ton coach.",
        tip:"Quand c'est toi qui remets en jeu, tes coéquipiers doivent bouger pour se démarquer." },
      { t:"Tout le monde joue", scene:function(){return RA.sceneCheer();},
        rule:"En mini-basket, chaque enfant de l'équipe doit jouer un bon moment du match. Le but est de progresser et de s'amuser, pas de gagner à tout prix.",
        tip:"Sur le banc, encourage tes copains : l'équipe joue aussi depuis le banc." },
      { t:"J.A.P. : Je Joue, j'Arbitre, je Participe", scene:function(){return RA.sceneJAP();},
        rule:"En mini-basket, on apprend aussi à arbitrer et à tenir la table de marque. Connaître les règles, c'est ce qui permet d'arbitrer ses copains !",
        tip:"Chaque fiche de cette école te prépare à arbitrer un vrai match de mini-basket." },
      { t:"Passer en U13 : ce qui change", scene:function(){return RA.sceneHoopHeight('high');},
        rule:"En U13, tu passes sur le grand terrain : panier à 3,05 m, ballon taille 6, tir à 3 points, et des règles de temps plus proches de celles des grands (8 secondes, 24 secondes).",
        tip:"Toutes les règles de cette école, tu les utiliseras vraiment en U13. Un peu d'avance, c'est un vrai plus !" }
    ],
    quiz:[
      { q:"En U9 et U11, à quelle hauteur est le panier ?", choices:["2,60 m","3,05 m","2 m","4 m"], correct:0,
        hint:"Plus bas que chez les grands.", explain:"2,60 m en mini-basket. Il monte à 3,05 m en U13.", scene:function(){return RA.sceneHoopHeight('low');} },
      { q:"Avec quel ballon joue-t-on en mini-basket ?", choices:["Taille 5","Taille 7","Taille 3","Un ballon de foot"], correct:0,
        hint:"Plus petit que celui des pros.", explain:"Taille 5 en mini-basket, taille 6 en U13, taille 7 pour les hommes adultes.", scene:function(){return RA.sceneBallSize('t5');} },
      { q:"En mini-basket, quelle défense est obligatoire ?", choices:["Chacun défend sur un adversaire (individuelle)","Tous sous le panier (zone)","Pas de défense","Deux défenseurs sur le meilleur"], correct:0,
        hint:"Chacun s'occupe de son joueur.", explain:"La défense individuelle. La zone est interdite en mini-basket.", scene:function(){return RA.sceneDefIndiv();} },
      { q:"En mini-basket, qui joue pendant le match ?", choices:["Tous les enfants de l'équipe","Seulement les meilleurs","Les plus grands","Ceux que le coach préfère"], correct:0,
        hint:"Personne ne reste sur le banc tout le match.", explain:"Chaque enfant joue un bon moment : on est là pour progresser.", scene:function(){return RA.sceneCheer();} },
      { q:"Que veut dire J.A.P. ?", choices:["Je Joue, j'Arbitre, je Participe","Je Joue Au Panier","Jamais À Perdre","Joue Après la Passe"], correct:0,
        hint:"J comme Joue, A comme Arbitre...", explain:"Je Joue, j'Arbitre, je Participe : au mini-basket, on apprend tous les rôles.", scene:function(){return RA.sceneJAP();} },
      { q:"Qu'est-ce qui change quand on passe en U13 ?", choices:["Panier à 3,05 m, ballon taille 6 et tir à 3 points","Rien du tout","On joue sans arbitre","Le panier descend"], correct:0,
        hint:"On passe sur le grand terrain.", explain:"En U13 : panier à 3,05 m, ballon taille 6, tir à 3 points. Un vrai cap !", scene:function(){return RA.sceneHoopHeight('high');} }
    ]},

  /* -------------------------------------------------- 7 */
  { id:'signals', title:"Les gestes de l'arbitre", sub:"Mime-les pour les retenir", color:"#374151",
    cards:[
      { t:"Faute personnelle", scene:function(){return sceneSignal('foul');}, rule:REF_SIGNALS.foul.txt, tip:"Lève le poing toi aussi : c'est le premier geste que tout arbitre apprend." },
      { t:"Marcher", scene:function(){return sceneSignal('travel');}, rule:REF_SIGNALS.travel.txt, tip:"Mime-le : fais tourner tes poings devant ton ventre." },
      { t:"Reprise de dribble", scene:function(){return sceneSignal('dribble');}, rule:REF_SIGNALS.dribble.txt, tip:"Mime-le : tapote l'air avec une main, puis l'autre." },
      { t:"3 secondes", scene:function(){return sceneSignal('three');}, rule:REF_SIGNALS.three.txt, tip:"Bras tendu sur le côté, 3 doigts. À ne pas confondre avec le tir à 3 points, bras en l'air !" },
      { t:"24 secondes", scene:function(){return sceneSignal('shotclock');}, rule:REF_SIGNALS.shotclock.txt, tip:"Les doigts sur l'épaule, comme pour dire « le temps est passé »." },
      { t:"Passage en force", scene:function(){return sceneSignal('charge');}, rule:REF_SIGNALS.charge.txt, tip:"Le poing, c'est l'attaquant ; la main ouverte, c'est le défenseur." },
      { t:"Obstruction", scene:function(){return sceneSignal('block');}, rule:REF_SIGNALS.block.txt, tip:"Les mains sur les hanches, comme un mur qui bloque le passage." },
      { t:"Temps-mort", scene:function(){return sceneSignal('timeout');}, rule:REF_SIGNALS.timeout.txt, tip:"T comme... Temps-mort !" },
      { t:"Remplacement", scene:function(){return sceneSignal('sub');}, rule:REF_SIGNALS.sub.txt, tip:"Attends ce geste avant d'entrer sur le terrain." },
      { t:"Panier refusé", scene:function(){return sceneSignal('cancel');}, rule:REF_SIGNALS.cancel.txt, tip:"Par exemple quand le sifflet a retenti avant le tir." },
      { t:"1, 2 ou 3 points", scene:function(){return sceneSignal('p2');}, rule:"Un doigt levé = 1 point (lancer franc), deux doigts = 2 points. Pour un tir à 3 points réussi, les deux bras montent avec 3 doigts.", tip:"La table de marque regarde ces gestes pour écrire le score." }
    ],
    quiz:[
      { q:"L'arbitre lève le poing fermé. Ça veut dire...", choices:["Faute","Panier","Temps-mort","Marcher"], correct:0, hint:"Le premier geste de tout arbitre.", explain:"Poing fermé levé = faute. Le jeu s'arrête.", scene:function(){return sceneSignal('foul');} },
      { q:"Que veut dire ce geste ?", choices:["Marcher","Reprise de dribble","Remplacement","Faute technique"], correct:0, hint:"Les poings tournent comme un moulin.", explain:"C'est le marcher : trop de pas avec le ballon.", scene:function(){return sceneSignal('travel');} },
      { q:"Que veut dire ce geste ?", choices:["24 secondes","Faute","3 secondes","Temps-mort"], correct:0, hint:"Les doigts touchent l'épaule.", explain:"Doigts sur l'épaule = les 24 secondes sont écoulées.", scene:function(){return sceneSignal('shotclock');} },
      { q:"Que veut dire ce geste ?", choices:["Temps-mort","Remplacement","Obstruction","Panier refusé"], correct:0, hint:"Les mains forment une lettre.", explain:"Un T avec les mains = temps-mort.", scene:function(){return sceneSignal('timeout');} },
      { q:"Que veut dire ce geste ?", choices:["Remplacement","Marcher","Passage en force","Faute antisportive"], correct:0, hint:"Les avant-bras font une croix.", explain:"Avant-bras croisés = remplacement.", scene:function(){return sceneSignal('sub');} },
      { q:"Que veut dire ce geste ?", choices:["Panier refusé","3 points réussi","Direction du jeu","Obstruction"], correct:0, hint:"Comme des ciseaux qui coupent.", explain:"Bras qui se croisent devant soi = le panier ne compte pas.", scene:function(){return sceneSignal('cancel');} },
      { q:"Que veut dire ce geste ?", choices:["Faute antisportive","Faute personnelle","Temps-mort","Passage en force"], correct:0, hint:"Il tient son poignet au-dessus de sa tête.", explain:"Poignet tenu au-dessus de la tête = faute antisportive.", scene:function(){return sceneSignal('unsport');} }
    ]},

  /* -------------------------------------------------- 8 */
  { id:'spirit', title:"L'esprit du basket", sub:"Respect, fair-play, esprit d'équipe", color:"#e04b6a",
    cards:[
      { t:"Respecter l'arbitre", scene:function(){return RA.sceneRef();},
        rule:"On accepte toujours les décisions de l'arbitre, sans discuter ni faire de gestes. Souvent, en mini-basket, l'arbitre est un jeune comme toi qui apprend.",
        tip:"Seul le capitaine peut poser calmement une question à l'arbitre quand le jeu est arrêté." },
      { t:"Respecter l'adversaire", scene:function(){return RA.sceneHandshake();},
        rule:"L'adversaire n'est pas un ennemi : sans lui, pas de match. À la fin, gagnant ou perdant, on serre la main des adversaires et de l'arbitre.",
        tip:"Un « bien joué » à un adversaire, ça ne coûte rien et ça fait grandir." },
      { t:"L'esprit d'équipe", scene:function(){return RA.sceneCheer();},
        rule:"On encourage ses coéquipiers, surtout quand ils ratent. Se moquer casse l'équipe ; encourager donne confiance à tout le monde.",
        tip:"Après un raté, dis « la prochaine ! » et tape dans la main de ton copain." },
      { t:"Être honnête", scene:function(){return RA.sceneRef();},
        rule:"Le ballon est sorti sur toi mais l'arbitre ne l'a pas vu ? Le vrai fair-play, c'est de le dire. On ne triche pas pour gagner.",
        tip:"Lever la main quand on fait une faute, c'est aussi de l'honnêteté." },
      { t:"On aide celui qui tombe", scene:function(){return RA.sceneHelp();},
        rule:"Si un joueur, même adverse, tombe ou se fait mal, on s'arrête et on l'aide à se relever. La santé passe avant le score.",
        tip:"Tendre la main à un adversaire à terre, c'est un geste de champion." }
    ],
    quiz:[
      { q:"L'arbitre siffle une faute contre toi et tu n'es pas d'accord. Que fais-tu ?", choices:["J'accepte et je continue","Je crie sur l'arbitre","Je jette le ballon","Je quitte le terrain"], correct:0,
        hint:"L'arbitre a toujours le dernier mot.", explain:"On accepte la décision. Râler peut même coûter une faute technique !", scene:function(){return RA.sceneRef();} },
      { q:"Le match est fini et ton équipe a perdu. Que fais-tu ?", choices:["Je serre la main des adversaires et de l'arbitre","Je pars sans rien dire","Je boude","Je râle contre eux"], correct:0,
        hint:"Gagnant ou perdant, on se salue.", explain:"On se serre toujours la main à la fin : c'est le respect.", scene:function(){return RA.sceneHandshake();} },
      { q:"Un copain rate un tir facile. Que fais-tu ?", choices:["Je l'encourage : « la prochaine ! »","Je me moque","Je crie sur lui","Je ne lui passe plus le ballon"], correct:0,
        hint:"Une équipe se soutient aussi dans les ratés.", explain:"On encourage : ça donne confiance à toute l'équipe.", scene:function(){return RA.sceneCheer();} },
      { q:"Un adversaire tombe et se fait mal. Que fais-tu ?", choices:["Je m'arrête et je vérifie qu'il va bien","Je continue et je marque","Je me moque","Je prends le ballon"], correct:0,
        hint:"La santé passe avant le jeu.", explain:"On s'arrête et on aide. Le respect passe avant le score.", scene:function(){return RA.sceneHelp();} },
      { q:"Le ballon est sorti sur toi, mais l'arbitre ne l'a pas vu. Que fais-tu ?", choices:["Je le dis honnêtement","Je fais semblant de rien","Je cache le ballon","Je crie que c'est à moi"], correct:0,
        hint:"Le fair-play, c'est aussi quand personne ne voit.", explain:"Être honnête, c'est plus fort qu'un ballon gagné.", scene:function(){return RA.sceneRef();} }
    ]}
];

/* Toutes les questions de l'école deviennent la catégorie 5 du quiz principal */
(function(){
  for(var i=0;i<RULE_CHAPTERS.length;i++){var ch=RULE_CHAPTERS[i];
    for(var j=0;j<ch.quiz.length;j++){var q=ch.quiz[j];q.level=5;q.chapter=ch.id;q.theme=ch.title;q.rule='Règles FIBA';BANK.push(q);}}
})();
LEVELS[5]={name:"Règles FIBA jeunes", sub:"Tout le règlement du jeune basketteur", color:"#0b7a3e", sym:"FIBA"};
LEVEL_ORDER.push(5);
