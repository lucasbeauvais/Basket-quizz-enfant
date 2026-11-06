'use strict';
/* =========================================================
   ARSENAL DE POCHE — données du jeu (objets, ennemis, icônes)
   Tout est réglable ici : prix, dégâts, cadences, formes.
   ========================================================= */

const RARITY = [
  { name: 'Commun',     color: '#a3b1bf', dark: '#5f6d7b' },
  { name: 'Rare',       color: '#4aa8ff', dark: '#1f5fae' },
  { name: 'Épique',     color: '#be74ff', dark: '#6a2db0' },
  { name: 'Légendaire', color: '#ffbb2e', dark: '#a86400' },
];

// Multiplicateur par étoile (1★, 2★, 3★) selon la famille d'objet
const STAR_MULT = {
  weapon: [1, 2.1, 4.4],
  heal:   [1, 2, 3.6],
  def:    [1, 2, 3.8],
  buff:   [1, 1.6, 2.3],
  eco:    [1, 2, 3.5],
};

const CAT_LABEL = { weapon: 'Arme', heal: 'Soin', def: 'Défense', buff: 'Bonus', eco: 'Économie' };

/* Formes : liste de cases [x, y]. Coûts en billets ($).
   kind = comportement de tir. */
const ITEMS = {
  // ---------- ARMES ----------
  pistol:  { name: 'Pistolet',        cat: 'weapon', rarity: 0, cost: 4,  shape: [[0,0],[1,0]],
             dmg: 11, cd: 0.65, kind: 'bullet', desc: 'Tir simple et fiable sur l\'ennemi le plus proche.' },
  grenade: { name: 'Grenade',         cat: 'weapon', rarity: 0, cost: 3,  shape: [[0,0]],
             dmg: 26, cd: 3.0, aoe: 42, kind: 'lob', desc: 'Lancée en cloche, explose en zone.' },
  shotgun: { name: 'Fusil à pompe',   cat: 'weapon', rarity: 1, cost: 7,  shape: [[0,0],[1,0],[2,0]],
             dmg: 8, pellets: 4, cd: 1.15, range: 190, kind: 'pellets', desc: '4 plombs à courte portée.' },
  smg:     { name: 'Mitraillette',    cat: 'weapon', rarity: 1, cost: 8,  shape: [[0,0],[1,0],[2,0],[1,1]],
             dmg: 5, cd: 0.2, kind: 'bullet', desc: 'Petits dégâts, très grosse cadence.' },
  flamer:  { name: 'Lance-flammes',   cat: 'weapon', rarity: 1, cost: 9,  shape: [[0,0],[1,0],[1,1]],
             dmg: 4, cd: 0.25, range: 125, burn: 3, kind: 'flame', desc: 'Brûle tout ce qui est proche (dégâts sur la durée).' },
  sniper:  { name: 'Sniper',          cat: 'weapon', rarity: 2, cost: 12, shape: [[0,0],[1,0],[2,0],[3,0]],
             dmg: 70, cd: 1.9, pierce: 3, kind: 'rail', desc: 'Gros tir qui transperce 3 ennemis.' },
  rocket:  { name: 'Lance-roquettes', cat: 'weapon', rarity: 2, cost: 14, shape: [[0,0],[1,0],[2,0],[0,1],[1,1]],
             dmg: 48, cd: 2.4, aoe: 58, kind: 'rocket', desc: 'Roquette explosive, large zone.' },
  laser:   { name: 'Rayon laser',     cat: 'weapon', rarity: 3, cost: 20, shape: [[0,0],[1,0],[2,0],[3,0],[1,1],[2,1]],
             dmg: 22, cd: 1.0, kind: 'laser', desc: 'Touche TOUS les ennemis à l\'écran.' },
  minigun: { name: 'Sulfateuse',      cat: 'weapon', rarity: 3, cost: 22, shape: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],
             dmg: 6, cd: 0.085, kind: 'bullet', desc: 'Un déluge de balles.' },

  // ---------- SOIN / DÉFENSE ----------
  bandage: { name: 'Bandage',         cat: 'heal', rarity: 0, cost: 3, shape: [[0,0]],
             regen: 1.2, desc: 'Régénère des PV en continu.' },
  medkit:  { name: 'Trousse de soin', cat: 'heal', rarity: 0, cost: 4, shape: [[0,0],[0,1]],
             heal: 0.08, cd: 5, desc: 'Soigne un % des PV max toutes les 5 s.' },
  plate:   { name: 'Plaque d\'armure', cat: 'def', rarity: 0, cost: 4, shape: [[0,0],[1,0]],
             hp: 25, desc: 'Augmente les PV max.' },
  shield:  { name: 'Bouclier',        cat: 'def', rarity: 1, cost: 9, shape: [[0,0],[1,0],[0,1],[1,1]],
             shield: 35, cd: 7, desc: 'Recharge un bouclier qui absorbe les coups toutes les 7 s.' },
  battery: { name: 'Pile de secours', cat: 'def', rarity: 3, cost: 15, shape: [[0,0],[0,1]],
             revive: 0.4, desc: 'Une fois par vague : te relève quand tu tombes à 0 PV.' },

  // ---------- BONUS (s'appliquent aux ARMES qui touchent l'objet) ----------
  ammo:    { name: 'Caisse de munitions', cat: 'buff', rarity: 0, cost: 5, shape: [[0,0],[1,0]],
             bDmg: 0.2, desc: 'Armes collées : +dégâts.' },
  energy:  { name: 'Boisson énergisante', cat: 'buff', rarity: 1, cost: 6, shape: [[0,0]],
             bRate: 0.25, desc: 'Armes collées : +cadence de tir.' },
  scope:   { name: 'Lunette',         cat: 'buff', rarity: 1, cost: 6, shape: [[0,0]],
             bCrit: 0.12, desc: 'Armes collées : +chance de critique (x2 dégâts).' },
  fang:    { name: 'Crocs vampires',  cat: 'buff', rarity: 2, cost: 10, shape: [[0,0],[0,1]],
             bLeech: 0.04, desc: 'Armes collées : te soignent d\'un % des dégâts infligés.' },

  // ---------- ÉCONOMIE ----------
  piggy:   { name: 'Tirelire',        cat: 'eco', rarity: 1, cost: 6, shape: [[0,0]],
             waveCash: 3, desc: 'Rapporte des billets à la fin de chaque vague.' },
};

/* ---------- ENNEMIS ---------- */
const ENEMIES = {
  slime:   { name: 'Gloup',      hp: 30,  spd: 26, dmg: 5,  size: 14, cash: 1, cost: 1, from: 1 },
  bat:     { name: 'Chauve-souris', hp: 16, spd: 52, dmg: 4, size: 10, cash: 1, cost: 1, from: 2, fly: true },
  beetle:  { name: 'Scarabée',   hp: 85,  spd: 17, dmg: 10, size: 18, cash: 2, cost: 3, from: 3 },
  spitter: { name: 'Champicrache', hp: 38, spd: 22, dmg: 7, size: 14, cash: 2, cost: 2, from: 4, ranged: 165, atk: 2.4 },
  brute:   { name: 'Cogneur',    hp: 240, spd: 13, dmg: 20, size: 25, cash: 4, cost: 7, from: 7 },
  boss:    { name: 'Roi Gloup',  hp: 900, spd: 9,  dmg: 30, size: 38, cash: 15, cost: 0, from: 99, boss: true },
};

const CHAPTERS = [
  { name: 'Faubourgs',  sky: ['#9fc6e8', '#e9d8c4'], far: '#b9a99c', mid: '#8f7f74', ground: '#7a7068', dark: '#5b524c' },
  { name: 'Marais',     sky: ['#8fb59a', '#d8e3b6'], far: '#7d9a7c', mid: '#5f7a5d', ground: '#56634a', dark: '#3e4836' },
  { name: 'Désert',     sky: ['#f2b26b', '#fbe4b0'], far: '#d99b62', mid: '#c4824b', ground: '#c49a63', dark: '#9b7546' },
  { name: 'Volcan',     sky: ['#5a2a3a', '#d9644a'], far: '#4a2a2e', mid: '#3a2226', ground: '#3d2f2c', dark: '#261c1a' },
  { name: 'Glacier',    sky: ['#9ad2f0', '#eef8ff'], far: '#b8d8ea', mid: '#8fb8cf', ground: '#cfe3ee', dark: '#9cbccd' },
  { name: 'Néon-ville', sky: ['#1b1440', '#5b2a86'], far: '#2a2156', mid: '#211a45', ground: '#2b2a3d', dark: '#1a1928' },
];

const WAVES_PER_RUN = 15;

/* ---------- PROGRESSION PERMANENTE (atelier) ---------- */
const UPGRADES = [
  { id: 'vit',   name: 'Vitalité',  max: 25, base: 20,  grow: 1.32, eff: l => `+${l * 10}% PV`,           icon: '❤' },
  { id: 'pow',   name: 'Puissance', max: 25, base: 25,  grow: 1.32, eff: l => `+${l * 8}% dégâts`,        icon: '✸' },
  { id: 'cash',  name: 'Fortune',   max: 10, base: 30,  grow: 1.45, eff: l => `+${l * 2} $ au départ`,    icon: '$' },
  { id: 'luck',  name: 'Chance',    max: 10, base: 40,  grow: 1.5,  eff: l => `+${l * 10}% objets rares`, icon: '♣' },
  { id: 'bag',   name: 'Sac à dos', max: 3,  costs: [80, 220, 500], eff: l => GRID_SIZES[l].join(' × ') + ' cases', icon: '▦' },
  { id: 'shop',  name: 'Marchand',  max: 1,  costs: [150], eff: l => `${3 + l} objets en boutique`, icon: '⌂' },
];
const GRID_SIZES = [[5, 4], [6, 4], [6, 5], [7, 5]];

/* ---------- ICÔNES (SVG maison) ----------
   viewBox = (largeur forme × 40) × (hauteur forme × 40) */
const ICON_BODY = {
  pistol: `<rect x="8" y="9" width="58" height="12" rx="3" fill="#56606e"/><rect x="62" y="11" width="13" height="7" fill="#3b424d"/><path d="M13 20h15l-4 15h-12z" fill="#8a552f"/><rect x="29" y="20" width="9" height="7" rx="2" fill="none" stroke="#3b424d" stroke-width="2.5"/>`,
  grenade: `<ellipse cx="20" cy="25" rx="12" ry="12.5" fill="#55752f"/><rect x="15" y="8" width="10" height="7" rx="1" fill="#d1a62b"/><circle cx="29" cy="9" r="4" fill="none" stroke="#a3acb6" stroke-width="2.4"/><path d="M11 22h18M11 28h18" stroke="#3c5520" stroke-width="2"/>`,
  shotgun: `<path d="M4 14l26-4v18l-26 6z" fill="#8f5c32"/><rect x="28" y="10" width="60" height="13" rx="3" fill="#4f5866"/><rect x="86" y="12" width="30" height="8" fill="#363c46"/><rect x="54" y="22" width="26" height="8" rx="3" fill="#8f5c32"/>`,
  smg: `<rect x="8" y="12" width="96" height="17" rx="4" fill="#424b59"/><rect x="100" y="16" width="16" height="8" fill="#2b313b"/><rect x="62" y="28" width="12" height="40" rx="3" fill="#2b313b"/><path d="M44 28h14l-4 22h-12z" fill="#2b313b"/><rect x="14" y="6" width="32" height="8" rx="2" fill="#5f6a7b"/>`,
  flamer: `<rect x="4" y="12" width="70" height="14" rx="4" fill="#b8402e"/><path d="M70 9l8-2v22l-8-2z" fill="#3b3b3b"/><rect x="46" y="30" width="26" height="42" rx="10" fill="#e6702f"/><rect x="54" y="25" width="10" height="7" fill="#3b3b3b"/><path d="M12 25h13l-4 11h-10z" fill="#3b3b3b"/>`,
  sniper: `<path d="M4 14l30-4v20l-30 4z" fill="#5a7032"/><rect x="32" y="16" width="70" height="12" rx="3" fill="#424e37"/><rect x="100" y="19" width="56" height="5" fill="#2c3426"/><rect x="48" y="4" width="38" height="9" rx="4" fill="#20262f"/><path d="M44 27h12l-4 10h-10z" fill="#424e37"/>`,
  rocket: `<rect x="6" y="10" width="104" height="24" rx="6" fill="#537f3c"/><path d="M110 8l8 4v20l-8 4z" fill="#30502a"/><ellipse cx="111" cy="22" rx="4" ry="9" fill="#ec5f3d"/><rect x="44" y="33" width="12" height="34" rx="3" fill="#30502a"/><rect x="16" y="33" width="12" height="22" rx="3" fill="#30502a"/><rect x="58" y="4" width="18" height="8" rx="2" fill="#20262f"/>`,
  laser: `<rect x="6" y="10" width="140" height="22" rx="10" fill="#e8ebf2"/><rect x="140" y="15" width="16" height="12" rx="3" fill="#00d1ff"/><rect x="48" y="30" width="64" height="40" rx="8" fill="#9ca9c6"/><circle cx="80" cy="50" r="11" fill="#00d1ff"/><rect x="20" y="17" width="100" height="5" rx="2" fill="#00d1ff" stroke="none" opacity=".7"/>`,
  minigun: `<rect x="40" y="14" width="74" height="7" fill="#2b3039"/><rect x="40" y="24" width="74" height="7" fill="#2b3039"/><rect x="40" y="34" width="74" height="7" fill="#2b3039"/><rect x="6" y="8" width="44" height="42" rx="9" fill="#6e7684"/><rect x="18" y="48" width="34" height="26" rx="5" fill="#a76a12"/><rect x="104" y="10" width="11" height="36" rx="3" fill="#4f5866"/>`,
  bandage: `<g transform="rotate(-35 20 20)"><rect x="3" y="13" width="34" height="14" rx="7" fill="#f3d6b4"/><rect x="14" y="14" width="12" height="12" rx="2" fill="#e5b588"/></g>`,
  medkit: `<rect x="4" y="12" width="32" height="60" rx="6" fill="#f4f4f4"/><rect x="12" y="5" width="16" height="9" rx="3" fill="#b9b9b9"/><rect x="16" y="28" width="8" height="28" fill="#e23b3b" stroke="none"/><rect x="7" y="38" width="26" height="8" fill="#e23b3b" stroke="none"/>`,
  plate: `<path d="M6 8h68l-4 22c-10 6-50 6-60 0z" fill="#7d8d9c"/><path d="M20 13h40" stroke="#cfd8e0" stroke-width="3"/><circle cx="14" cy="14" r="2" fill="#333"/><circle cx="66" cy="14" r="2" fill="#333"/>`,
  shield: `<path d="M40 6l30 10v22c0 18-14 30-30 36c-16-6-30-18-30-36v-22z" fill="#3b82f6"/><path d="M40 16l20 7v15c0 12-9 20-20 25z" fill="#93c5fd" stroke="none"/>`,
  battery: `<rect x="7" y="12" width="26" height="62" rx="5" fill="#facc15"/><rect x="14" y="5" width="12" height="8" rx="2" fill="#555"/><path d="M22 24l-9 20h8l-4 18 13-24h-8z" fill="#fff"/>`,
  ammo: `<rect x="4" y="13" width="72" height="23" rx="3" fill="#6d803b"/><rect x="4" y="13" width="72" height="7" fill="#566631"/><g fill="#d8a51a"><rect x="14" y="3" width="7" height="13" rx="3"/><rect x="26" y="3" width="7" height="13" rx="3"/><rect x="38" y="3" width="7" height="13" rx="3"/></g><path d="M52 25h16" stroke="#e9e3c0" stroke-width="3"/>`,
  energy: `<rect x="10" y="7" width="20" height="29" rx="4" fill="#22c55e"/><rect x="12" y="3" width="16" height="6" rx="2" fill="#bdbdbd"/><path d="M22 12l-6 11h5l-3 9 8-12h-5z" fill="#fde047"/>`,
  scope: `<circle cx="20" cy="20" r="14" fill="#20262f"/><circle cx="20" cy="20" r="9" fill="#60a5fa"/><path d="M20 10v20M10 20h20" stroke="#e11d48" stroke-width="1.6"/>`,
  fang: `<path d="M8 10q12-6 24 0l-6 48q-6 16-12 0z" fill="#f5f5f5"/><path d="M14 52q6 18 12 0" fill="#dc2626"/>`,
  piggy: `<ellipse cx="20" cy="23" rx="15" ry="11" fill="#f9a8d4"/><circle cx="33" cy="22" r="4" fill="#f472b6"/><rect x="15" y="10" width="10" height="3" rx="1" fill="#333" stroke="none"/><circle cx="25" cy="20" r="1.6" fill="#222" stroke="none"/><rect x="10" y="31" width="5" height="6" fill="#f472b6"/><rect x="24" y="31" width="5" height="6" fill="#f472b6"/>`,
};

function shapeBox(shape) {
  let w = 0, h = 0;
  for (const [x, y] of shape) { if (x + 1 > w) w = x + 1; if (y + 1 > h) h = y + 1; }
  return [w, h];
}

function iconSVG(id) {
  const [w, h] = shapeBox(ITEMS[id].shape);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w * 40} ${h * 40}" preserveAspectRatio="xMidYMid meet"><g stroke="#14171d" stroke-width="2.2" stroke-linejoin="round">${ICON_BODY[id]}</g></svg>`;
}

// Images des icônes pour le canvas (armes portées par le héros)
const ICON_IMG = {};
for (const id in ITEMS) {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG(id));
  ICON_IMG[id] = img;
}
