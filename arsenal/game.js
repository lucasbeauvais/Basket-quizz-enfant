'use strict';
/* =========================================================
   ARSENAL DE POCHE — moteur du jeu
   ========================================================= */

const $ = s => document.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function fmt(n) {
  n = Math.round(n);
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1).replace('.', ',') + 'k';
  return String(n);
}
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---------------- sauvegarde ---------------- */
const SAVE_META = 'arsenal.meta.v1', SAVE_RUN = 'arsenal.run.v1';
function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function store(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }

const META_DEFAULT = {
  coins: 0, up: { vit: 0, pow: 0, cash: 0, luck: 0, bag: 0, shop: 0 },
  unlocked: 1, chapter: 1, best: {}, runs: 0, kills: 0, wins: 0, sound: true, speed: 1, seenHelp: false,
};
let meta = Object.assign({}, META_DEFAULT, load(SAVE_META) || {});
meta.up = Object.assign({}, META_DEFAULT.up, meta.up || {});
meta.best = meta.best || {};
function saveMeta() { store(SAVE_META, meta); }

/* ---------------- son (synthé WebAudio, aucun fichier) ---------------- */
let actx = null, noiseBuf = null;
const lastSfx = {};
const SFX_GAP = { shoot: 0.06, hit: 0.05, boom: 0.08, hurt: 0.15, coin: 0.05 };
function tone(f1, f2, dur, type, vol, delay = 0) {
  const t = actx.currentTime + delay;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, vol) {
  if (!noiseBuf) {
    noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.5, actx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = actx.createBufferSource(), g = actx.createGain(), f = actx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 900;
  s.buffer = noiseBuf; g.gain.setValueAtTime(vol, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
  s.connect(f); f.connect(g); g.connect(actx.destination); s.start(); s.stop(actx.currentTime + dur);
}
function sfx(type) {
  if (!meta.sound) return;
  try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  if (actx.state === 'suspended') actx.resume();
  const now = actx.currentTime;
  if (SFX_GAP[type] && lastSfx[type] && now - lastSfx[type] < SFX_GAP[type]) return;
  lastSfx[type] = now;
  switch (type) {
    case 'shoot': tone(700, 200, 0.06, 'square', 0.025); break;
    case 'laser': tone(1400, 300, 0.25, 'sawtooth', 0.03); break;
    case 'hit':   tone(220, 90, 0.05, 'triangle', 0.05); break;
    case 'boom':  noise(0.35, 0.18); tone(140, 40, 0.3, 'sine', 0.12); break;
    case 'hurt':  tone(180, 70, 0.15, 'sawtooth', 0.06); break;
    case 'coin':  tone(900, 1400, 0.08, 'sine', 0.035); break;
    case 'buy':   tone(500, 900, 0.1, 'triangle', 0.08); break;
    case 'sell':  tone(900, 400, 0.12, 'triangle', 0.07); break;
    case 'merge': [523, 659, 784, 1047].forEach((f, i) => tone(f, f * 1.01, 0.12, 'triangle', 0.08, i * 0.07)); break;
    case 'wave':  [392, 523, 659].forEach((f, i) => tone(f, f, 0.15, 'square', 0.04, i * 0.09)); break;
    case 'win':   [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, f, 0.2, 'triangle', 0.09, i * 0.1)); break;
    case 'lose':  [392, 330, 262, 196].forEach((f, i) => tone(f, f * 0.98, 0.25, 'sawtooth', 0.05, i * 0.16)); break;
    case 'click': tone(600, 500, 0.04, 'square', 0.03); break;
    case 'heal':  tone(600, 1100, 0.18, 'sine', 0.05); break;
    case 'bad':   tone(200, 150, 0.12, 'square', 0.05); break;
  }
}

/* ---------------- état de la partie ---------------- */
let run = null;      // partie en cours (sauvegardée)
let state = 'home';  // home | prep | fight | end
let B = null;        // combat en cours
let CELL = 52;
const BENCH_N = 6;

function newRun(chapter) {
  const [gw, gh] = GRID_SIZES[meta.up.bag];
  run = {
    chapter, wave: 1, cash: 10 + meta.up.cash * 2, hpFrac: 1, gw, gh,
    items: [], uidN: 1, shop: [], rerolls: 0, freeReroll: true,
    dmg: {}, kills: 0, bosses: 0, cleared: 0,
  };
  addItem('pistol', 1, { where: 'grid', x: Math.floor(gw / 2) - 1, y: Math.floor(gh / 2) - 1, rot: 0 });
  rollShop();
}
function addItem(id, star, pos) {
  const it = Object.assign({ uid: run.uidN++, id, star, rot: 0 }, pos);
  run.items.push(it);
  return it;
}
function saveRun() { if (run && state !== 'end') store(SAVE_RUN, run); }

/* ---------------- formes & grille ---------------- */
function rotShape(shape, rot) {
  let s = shape.map(c => c.slice());
  for (let r = 0; r < (rot % 4); r++) {
    const h = shapeBox(s)[1];
    s = s.map(([x, y]) => [h - 1 - y, x]);
  }
  return s;
}
const itemShape = (it, rot = it.rot) => rotShape(ITEMS[it.id].shape, rot);
const cellsOf = (it, ax = it.x, ay = it.y, rot = it.rot) => itemShape(it, rot).map(([x, y]) => [ax + x, ay + y]);
function gridMap(ignoreUid) {
  const m = new Map();
  for (const it of run.items) if (it.where === 'grid' && it.uid !== ignoreUid)
    for (const [x, y] of cellsOf(it)) m.set(x + ',' + y, it);
  return m;
}
function fits(it, ax, ay, rot) {
  const m = gridMap(it.uid);
  for (const [x, y] of cellsOf(it, ax, ay, rot)) {
    if (x < 0 || y < 0 || x >= run.gw || y >= run.gh || m.has(x + ',' + y)) return false;
  }
  return true;
}
function findGridSpot(it) {
  for (let r = 0; r < 4; r++) for (let y = 0; y < run.gh; y++) for (let x = 0; x < run.gw; x++)
    if (fits(it, x, y, (it.rot + r) % 4)) return { x, y, rot: (it.rot + r) % 4 };
  return null;
}
const benchAt = i => run.items.find(it => it.where === 'bench' && it.slot === i);
function benchFree() { for (let i = 0; i < BENCH_N; i++) if (!benchAt(i)) return i; return -1; }
const sellValue = it => Math.max(1, Math.floor(ITEMS[it.id].cost * Math.pow(2, it.star - 1) * 0.5));
const canMerge = (a, b) => a && b && a.uid !== b.uid && a.id === b.id && a.star === b.star && a.star < 3;
const starStr = n => '★'.repeat(n);

/* ---------------- calcul de l'équipement ---------------- */
function loadout() {
  const pow = 1 + meta.up.pow * 0.08;
  const hpMul = 1 + meta.up.vit * 0.1;
  const L = { maxHp: 100 * hpMul, regen: 0, healers: [], shields: [], shieldCap: 0, revive: 0, waveCash: 0, weapons: [], links: new Map() };
  const grid = run.items.filter(it => it.where === 'grid');
  const m = gridMap();
  for (const it of grid) {
    const s = new Set();
    for (const [x, y] of cellsOf(it)) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const o = m.get((x + dx) + ',' + (y + dy));
      if (o && o.uid !== it.uid) s.add(o);
    }
    L.links.set(it.uid, s);
  }
  for (const it of grid) {
    const d = ITEMS[it.id], k = STAR_MULT[d.cat][it.star - 1];
    if (d.cat === 'weapon') {
      let bDmg = 0, bRate = 0, bCrit = 0, bLeech = 0;
      for (const o of L.links.get(it.uid)) {
        const od = ITEMS[o.id]; if (od.cat !== 'buff') continue;
        const ok = STAR_MULT.buff[o.star - 1];
        bDmg += (od.bDmg || 0) * ok; bRate += (od.bRate || 0) * ok; bCrit += (od.bCrit || 0) * ok; bLeech += (od.bLeech || 0) * ok;
      }
      const mul = k * pow * (1 + bDmg);
      L.weapons.push({
        uid: it.uid, id: it.id, d, dmg: d.dmg * mul, burn: (d.burn || 0) * mul, cd: d.cd / (1 + bRate),
        crit: Math.min(1, bCrit), leech: bLeech, buffs: { bDmg, bRate, bCrit, bLeech },
      });
    } else if (d.cat === 'heal') {
      if (d.regen) L.regen += d.regen * k * hpMul;
      if (d.heal) L.healers.push({ uid: it.uid, amt: d.heal * k, cd: d.cd });
    } else if (d.cat === 'def') {
      if (d.hp) L.maxHp += d.hp * k * hpMul;
      if (d.shield) { L.shields.push({ uid: it.uid, amt: d.shield * k * hpMul, cd: d.cd }); L.shieldCap += d.shield * k * hpMul; }
      if (d.revive) L.revive = Math.max(L.revive, [0.4, 0.7, 1][it.star - 1]);
    } else if (d.cat === 'eco') {
      L.waveCash += Math.round(d.waveCash * k);
    }
  }
  L.dps = L.weapons.reduce((s, w) => s + weaponDps(w), 0);
  L.critAvg = L.weapons.length ? L.weapons.reduce((s, w) => s + w.crit, 0) / L.weapons.length : 0;
  L.healPs = L.regen + L.healers.reduce((s, h) => s + h.amt * L.maxHp / h.cd, 0);
  return L;
}
function weaponDps(w) {
  const d = w.d;
  let per = w.dmg * (1 + w.crit);
  if (d.pellets) per *= d.pellets * 0.75;
  if (d.kind === 'laser') per *= 3;
  if (d.aoe) per *= 1.8;
  if (d.pierce) per *= 1.6;
  let dps = per / w.cd;
  if (d.kind === 'flame') dps = dps * 1.8 + w.burn * 1.8;
  return dps;
}

/* ---------------- boutique ---------------- */
function rollRarity() {
  const w = run.wave, luck = 1 + meta.up.luck * 0.1;
  const ws = [Math.max(18, 62 - 3 * w), 28 * luck, (6 + 1.4 * w) * luck, w >= 4 ? 0.6 * w * luck : 0];
  let r = Math.random() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < ws.length; i++) { if ((r -= ws[i]) < 0) return i; }
  return 0;
}
function rollShop() {
  const n = 3 + meta.up.shop;
  run.shop = [];
  for (let i = 0; i < n; i++) {
    const r = rollRarity();
    const pool = Object.keys(ITEMS).filter(id => ITEMS[id].rarity === r);
    run.shop.push({ id: pick(pool), sold: false });
  }
}
const rerollCost = () => run.freeReroll ? 0 : 1 + Math.floor(run.wave / 4) + run.rerolls;

/* =========================================================
   INTERFACE
   ========================================================= */
const el = {
  home: $('#home'), game: $('#game'), grid: $('#grid'), bench: $('#bench'), shop: $('#shop'), stats: $('#stats'),
  cash: $('#cash'), waveNum: $('#waveNum'), waveMax: $('#waveMax'), reroll: $('#btnReroll'), play: $('#btnPlay'),
  sell: $('#sellZone'), sellPrice: $('#sellPrice'), ghost: $('#ghost'), toast: $('#toast'), banner: $('#banner'),
  sheet: $('#sheet'), pause: $('#pauseMenu'), result: $('#result'), help: $('#help'), tip: $('#tip'),
};
const itemEls = new Map();
let cellsEl = null, slotEls = [];

let toastT = null;
function toast(msg, ms = 1600) {
  el.toast.textContent = msg; el.toast.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.toast.hidden = true; }, ms);
}
let bannerT = null;
function banner(title, sub = '', ms = 1400) {
  el.banner.innerHTML = title + (sub ? `<small>${sub}</small>` : '');
  el.banner.hidden = false;
  el.banner.style.animation = 'none'; void el.banner.offsetWidth; el.banner.style.animation = '';
  clearTimeout(bannerT); bannerT = setTimeout(() => { el.banner.hidden = true; }, ms);
}

function layout() {
  const avail = Math.min(window.innerWidth, 480) - 24 - 22;
  CELL = Math.floor(clamp(avail / run.gw, 30, 54));
  document.documentElement.style.setProperty('--cell', CELL + 'px');
}
// si l'écran de préparation déborde, on rétrécit la grille pour que tout tienne
function fitHeight() {
  if (state !== 'prep' || el.game.hidden) return;
  const over = el.game.scrollHeight - window.innerHeight;
  if (over <= 0 || CELL <= 30) return;
  CELL = Math.max(30, CELL - Math.ceil(over / run.gh));
  document.documentElement.style.setProperty('--cell', CELL + 'px');
  renderGrid();
}

function rarityVars(id) {
  const r = RARITY[ITEMS[id].rarity];
  return `--rc:${r.color};--rd:${r.dark};`;
}

// élément visuel d'un objet (forme + icône), taille de case cs
function buildShapeEl(container, it, rot, cs) {
  const shape = itemShape(it, rot);
  const [bw, bh] = shapeBox(shape);
  const [w0, h0] = shapeBox(ITEMS[it.id].shape);
  container.style.cssText += `;width:${bw * cs}px;height:${bh * cs}px;${rarityVars(it.id)}`;
  let html = '';
  for (const [x, y] of shape) html += `<div class="blk" style="left:${x * cs}px;top:${y * cs}px;width:${cs}px;height:${cs}px"></div>`;
  const iw = w0 * cs * 0.94, ih = h0 * cs * 0.94;
  html += `<div class="ico" style="width:${iw}px;height:${ih}px;--r:${rot * 90}deg;transform:translate(-50%,-50%) rotate(${rot * 90}deg)">${iconSVG(it.id)}</div>`;
  if (it.star > 1) {
    const [sx, sy] = shape[0];
    html += `<div class="stars" style="left:${sx * cs + 4}px;top:${sy * cs + 1}px">${starStr(it.star)}</div>`;
  }
  container.innerHTML = html;
}

function renderGrid() {
  el.grid.innerHTML = '';
  itemEls.clear();
  cellsEl = document.createElement('div');
  cellsEl.className = 'cells';
  cellsEl.style.gridTemplateColumns = `repeat(${run.gw}, var(--cell))`;
  for (let y = 0; y < run.gh; y++) for (let x = 0; x < run.gw; x++) {
    const c = document.createElement('div');
    c.className = 'cell'; c.dataset.k = x + ',' + y;
    cellsEl.appendChild(c);
  }
  el.grid.appendChild(cellsEl);
  for (const it of run.items) {
    if (it.where !== 'grid') continue;
    const d = document.createElement('div');
    d.className = 'item';
    d.style.left = (8 + it.x * CELL) + 'px';
    d.style.top = (8 + it.y * CELL) + 'px';
    buildShapeEl(d, it, it.rot, CELL);
    // zone cliquable = seulement les cases de la forme
    d.style.pointerEvents = 'none';
    d.querySelectorAll('.blk').forEach(b => { b.style.pointerEvents = 'auto'; });
    bindDraggable(d, () => ({ type: 'grid', it }));
    el.grid.appendChild(d);
    itemEls.set(it.uid, d);
  }
}

function renderBench() {
  el.bench.innerHTML = '';
  slotEls = [];
  for (let i = 0; i < BENCH_N; i++) {
    const s = document.createElement('div');
    s.className = 'slot';
    const it = benchAt(i);
    if (it) {
      s.innerHTML = `<div class="mini" style="background:${RARITY[ITEMS[it.id].rarity].color}66">${iconSVG(it.id)}</div>` +
        (it.star > 1 ? `<div class="stars">${starStr(it.star)}</div>` : '');
      const svg = s.querySelector('svg'); svg.style.transform = `rotate(${it.rot * 90}deg)`;
      bindDraggable(s, () => ({ type: 'bench', it }));
      itemEls.set(it.uid, s);
    }
    el.bench.appendChild(s);
    slotEls.push(s);
  }
}

function renderShop() {
  el.shop.innerHTML = '';
  el.shop.style.gridTemplateColumns = `repeat(${run.shop.length}, 1fr)`;
  run.shop.forEach((s, i) => {
    const d = ITEMS[s.id];
    const c = document.createElement('div');
    c.className = 'card' + (s.sold ? ' sold' : '') + (run.cash < d.cost ? ' poor' : '');
    c.style.cssText = rarityVars(s.id);
    const canFuse = !s.sold && run.items.some(it => it.id === s.id && it.star === 1);
    c.innerHTML = `<div class="art">${iconSVG(s.id)}</div><div class="nm">${d.name}</div>` +
      `<div class="price"><i class="bill"></i>${d.cost}</div>` + (canFuse ? '<div class="tag">FUSION</div>' : '');
    if (!s.sold) bindDraggable(c, () => ({ type: 'shop', index: i, it: { uid: -1, id: s.id, star: 1, rot: 0 } }));
    el.shop.appendChild(c);
  });
}

function renderStats() {
  const L = loadout();
  const box = (v, l) => `<div class="stat">${v}<small>${l}</small></div>`;
  el.stats.innerHTML =
    box(fmt(L.dps), 'DPS') +
    box(fmt(B ? B.hero.hp : L.maxHp * run.hpFrac) + '<span style="font-size:12px;color:#9aa6bd">/' + fmt(L.maxHp) + '</span>', 'PV') +
    box(Math.round(L.critAvg * 100) + '%', 'Critique') +
    box(L.healPs.toFixed(1), 'Soin /s') +
    box(fmt(L.shieldCap), 'Bouclier');
  idleStack = L.weapons.map(w => ({ uid: w.uid, id: w.id }));
}

function renderHud() {
  el.cash.textContent = run.cash;
  el.waveNum.textContent = run.wave;
  el.waveMax.textContent = WAVES_PER_RUN;
  const rc = rerollCost();
  el.reroll.innerHTML = rc === 0 ? '⟳ GRATUIT' : `⟳ <i class="bill"></i> ${rc}`;
  el.reroll.disabled = run.cash < rc;
}

const TIPS = [
  'Pose un objet sur un objet identique pour le fusionner (★★).',
  'Les bonus (munitions, boisson, lunette, crocs) boostent les armes qu\'ils touchent.',
  'Pendant un déplacement : R ou clic droit pour tourner (2e doigt sur mobile).',
  'Tes PV ne remontent que de 30 % entre les vagues : pense aux soins !',
  'La Tirelire rapporte plus si tu l\'achètes tôt.',
  'Glisse un objet sur la boutique pour le revendre.',
  'Boss aux vagues 5, 10 et 15. Prépare-toi !',
];
function renderAll() {
  layout();
  renderHud(); renderGrid(); renderBench(); renderShop(); renderStats();
  fitHeight();
  if (state === 'prep' && !el.tip.textContent) el.tip.textContent = pick(TIPS);
}

/* ---------------- fiche objet ---------------- */
let sheetItem = null;
function statRows(it) {
  const d = ITEMS[it.id], k = STAR_MULT[d.cat][it.star - 1];
  const rows = [];
  const L = it.where === 'grid' ? loadout() : null;
  const hpMul = 1 + meta.up.vit * 0.1;
  if (d.cat === 'weapon') {
    const w = L && L.weapons.find(x => x.uid === it.uid);
    const pow = 1 + meta.up.pow * 0.08;
    const dmg = w ? w.dmg : d.dmg * k * pow;
    const cd = w ? w.cd : d.cd;
    const bonus = w && w.buffs.bDmg ? ` <em>+${Math.round(w.buffs.bDmg * 100)}%</em>` : '';
    rows.push(['Dégâts', fmt(dmg) + (d.pellets ? ` ×${d.pellets}` : '') + bonus]);
    rows.push(['Tirs / seconde', (1 / cd).toFixed(2).replace('.', ',') + (w && w.buffs.bRate ? ` <em>+${Math.round(w.buffs.bRate * 100)}%</em>` : '')]);
    rows.push(['DPS estimé', fmt(weaponDps(w || { d, dmg, cd, crit: 0, burn: (d.burn || 0) * k * pow }))]);
    rows.push(['Critique', Math.round((w ? w.crit : 0) * 100) + ' %']);
    if (d.aoe) rows.push(['Zone', d.aoe + ' px']);
    if (d.pierce) rows.push(['Transperce', d.pierce + ' ennemis']);
    if (d.range) rows.push(['Portée', 'courte']);
    if (d.burn) rows.push(['Brûlure', fmt((w ? w.burn : d.burn * k * pow)) + ' /s']);
    if (w && w.leech) rows.push(['Vol de vie', Math.round(w.leech * 100) + ' %']);
  } else if (d.cat === 'heal') {
    if (d.regen) rows.push(['Régénération', (d.regen * k * hpMul).toFixed(1).replace('.', ',') + ' PV/s']);
    if (d.heal) rows.push(['Soin', Math.round(d.heal * k * 100) + ' % PV max'], ['Toutes les', d.cd + ' s']);
  } else if (d.cat === 'def') {
    if (d.hp) rows.push(['PV max', '+' + fmt(d.hp * k * hpMul)]);
    if (d.shield) rows.push(['Bouclier', fmt(d.shield * k * hpMul)], ['Recharge', d.cd + ' s']);
    if (d.revive) rows.push(['Relève avec', [40, 70, 100][it.star - 1] + ' % PV'], ['Utilisations', '1 / vague']);
  } else if (d.cat === 'buff') {
    if (d.bDmg) rows.push(['Dégâts armes collées', '+' + Math.round(d.bDmg * k * 100) + ' %']);
    if (d.bRate) rows.push(['Cadence armes collées', '+' + Math.round(d.bRate * k * 100) + ' %']);
    if (d.bCrit) rows.push(['Critique armes collées', '+' + Math.round(d.bCrit * k * 100) + ' %']);
    if (d.bLeech) rows.push(['Vol de vie', Math.round(d.bLeech * k * 100) + ' % des dégâts']);
    if (L) rows.push(['Armes boostées', [...L.links.get(it.uid)].filter(o => ITEMS[o.id].cat === 'weapon').length]);
  } else if (d.cat === 'eco') {
    rows.push(['Fin de vague', '+' + Math.round(d.waveCash * k) + ' $']);
  }
  if (it.star < 3) rows.push(['Fusion', `2 × ${starStr(it.star)} → ${starStr(it.star + 1)}`]);
  return rows;
}
function openSheet(src) {
  const it = src.it, d = ITEMS[it.id], r = RARITY[d.rarity];
  sheetItem = src;
  $('#shIcon').innerHTML = iconSVG(it.id);
  $('#shIcon').style.background = r.color;
  $('#shName').innerHTML = d.name + (it.star > 1 ? `<span class="stars">${starStr(it.star)}</span>` : '');
  $('#shSub').innerHTML = `<span style="color:${r.color}">${r.name}</span> · ${CAT_LABEL[d.cat]}`;
  $('#shDesc').textContent = d.desc;
  $('#shStats').innerHTML = statRows(it).map(([a, b]) => `<div>${a}<b>${b}</b></div>`).join('');
  const btns = $('#shBtns');
  btns.innerHTML = '';
  const mk = (label, cls, fn, disabled) => {
    const b = document.createElement('button'); b.className = 'btn ' + cls; b.innerHTML = label; b.disabled = !!disabled;
    b.onclick = fn; btns.appendChild(b);
  };
  if (state === 'prep') {
    if (src.type === 'shop') {
      const twin = run.items.find(o => o.id === it.id && o.star === 1);
      if (twin) mk(`Acheter + fusionner (${d.cost} $)`, 'btn-green', () => { buyShop(src.index, { type: 'merge', target: twin }); closeSheet(); }, run.cash < d.cost);
      mk(`Acheter (${d.cost} $)`, twin ? 'btn-blue' : 'btn-green', () => { buyAuto(src.index); closeSheet(); }, run.cash < d.cost);
    } else {
      mk('⟳ Tourner', 'btn-blue', () => { rotateOwned(it); });
      if (it.where === 'bench') mk('Mettre dans le sac', 'btn-green', () => { autoPlace(it); closeSheet(); });
      mk(`Vendre +${sellValue(it)} $`, 'btn-red', () => { sellItem(it); closeSheet(); });
    }
  }
  mk('Fermer', 'btn-blue', closeSheet);
  // surligner les objets liés (combos)
  if (it.where === 'grid') {
    const L = loadout();
    for (const o of L.links.get(it.uid) || []) {
      const rel = (ITEMS[it.id].cat === 'buff' && ITEMS[o.id].cat === 'weapon') || (ITEMS[it.id].cat === 'weapon' && ITEMS[o.id].cat === 'buff');
      if (rel) itemEls.get(o.uid)?.classList.add('linked');
    }
    itemEls.get(it.uid)?.classList.add('sel');
  }
  el.sheet.hidden = false;
}
function closeSheet() {
  el.sheet.hidden = true; sheetItem = null;
  document.querySelectorAll('.item.linked, .item.sel').forEach(e => e.classList.remove('linked', 'sel'));
}
el.sheet.addEventListener('pointerdown', e => { if (e.target === el.sheet) closeSheet(); });

/* ---------------- actions boutique / objets ---------------- */
function afterChange() { saveRun(); renderAll(); }
function buyShop(index, target) {
  const s = run.shop[index], d = ITEMS[s.id];
  if (s.sold) return false;
  if (run.cash < d.cost) { toast('Pas assez de billets !'); sfx('bad'); return false; }
  if (target.type === 'merge') {
    target.target.star++;
    sfx('merge'); toast(`Fusion ! ${d.name} ${starStr(target.target.star)}`);
  } else if (target.type === 'grid') {
    addItem(s.id, 1, { where: 'grid', x: target.ax, y: target.ay, rot: target.rot });
    sfx('buy');
  } else if (target.type === 'bench') {
    addItem(s.id, 1, { where: 'bench', slot: target.slot, rot: target.rot || 0 });
    sfx('buy');
  } else return false;
  run.cash -= d.cost; s.sold = true;
  afterChange();
  return true;
}
function buyAuto(index) {
  const s = run.shop[index];
  const tmp = { uid: -1, id: s.id, star: 1, rot: 0 };
  const spot = findGridSpot(tmp);
  if (spot) return buyShop(index, { type: 'grid', ax: spot.x, ay: spot.y, rot: spot.rot });
  const f = benchFree();
  if (f >= 0) { toast('Sac plein : rangé dans la réserve'); return buyShop(index, { type: 'bench', slot: f }); }
  toast('Plus de place ! Vends un objet.'); sfx('bad');
  return false;
}
function autoPlace(it) {
  const spot = findGridSpot(it);
  if (!spot) { toast('Pas de place dans le sac'); sfx('bad'); return; }
  Object.assign(it, { where: 'grid', x: spot.x, y: spot.y, rot: spot.rot }); delete it.slot;
  sfx('click'); afterChange();
}
function sellItem(it) {
  run.cash += sellValue(it);
  run.items = run.items.filter(o => o !== it);
  sfx('sell'); afterChange();
}
function rotateOwned(it) {
  const nr = (it.rot + 1) % 4;
  if (it.where === 'bench') { it.rot = nr; sfx('click'); afterChange(); reopenSheet(it); return; }
  for (const [dx, dy] of [[0, 0], [-1, 0], [0, -1], [-1, -1], [1, 0], [0, 1], [-2, 0], [0, -2], [-2, -1], [-1, -2]]) {
    if (fits(it, it.x + dx, it.y + dy, nr)) {
      it.x += dx; it.y += dy; it.rot = nr; sfx('click'); afterChange(); reopenSheet(it); return;
    }
  }
  toast('Pas la place pour tourner ici'); sfx('bad');
}
function reopenSheet(it) { closeSheet(); openSheet({ type: it.where, it }); }
function doReroll() {
  if (state !== 'prep') return;
  const c = rerollCost();
  if (run.cash < c) { toast('Pas assez de billets !'); sfx('bad'); return; }
  run.cash -= c;
  if (run.freeReroll) run.freeReroll = false; else run.rerolls++;
  rollShop(); sfx('click');
  afterChange();
}

/* ---------------- glisser-déposer ---------------- */
let drag = null;
function bindDraggable(node, getSrc) {
  node.addEventListener('pointerdown', e => {
    if (drag || e.button === 2) return;
    if (state !== 'prep' && state !== 'fight') return;
    e.preventDefault();
    drag = { src: getSrc(), x0: e.clientX, y0: e.clientY, started: false, pid: e.pointerId, touch: e.pointerType !== 'mouse' };
  });
}
function startDrag() {
  const d = drag;
  if (state !== 'prep') { drag = null; return; }
  closeSheet();
  d.started = true;
  d.it = d.src.it;
  d.rot = d.it.rot || 0;
  d.owned = d.src.type !== 'shop';
  if (d.owned) itemEls.get(d.it.uid)?.classList.add('dragging');
  if (d.owned) { el.sell.hidden = false; el.sellPrice.textContent = '+' + sellValue(d.it) + ' $'; }
  // surligner les objets fusionnables
  for (const o of run.items) if (canMerge(d.it, o)) itemEls.get(o.uid)?.classList.add('mergeable');
  buildGhost();
}
function buildGhost() {
  const g = el.ghost;
  g.style.width = g.style.height = '';
  g.innerHTML = '';
  g.style.cssText = '';
  buildShapeEl(g, drag.it.uid === -1 ? drag.it : Object.assign({}, drag.it), drag.rot, CELL);
  const [bw, bh] = shapeBox(itemShape(drag.it, drag.rot));
  drag.gw = bw * CELL; drag.gh = bh * CELL;
  g.hidden = false;
}
function rotateDrag() {
  if (!drag || !drag.started) return;
  drag.rot = (drag.rot + 1) % 4;
  buildGhost(); sfx('click');
  moveDrag(drag.px, drag.py);
}
const inRect = (r, x, y) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
function computeDrop(px, py, gx, gy) {
  const d = drag;
  if (d.owned && !el.sell.hidden && inRect(el.sell.getBoundingClientRect(), px, py)) return { type: 'sell' };
  for (let i = 0; i < slotEls.length; i++) {
    if (!inRect(slotEls[i].getBoundingClientRect(), px, py)) continue;
    const occ = benchAt(i);
    if (!occ || occ.uid === d.it.uid) return { type: 'bench', slot: i, ok: true, rot: d.rot };
    if (canMerge(d.it, occ)) return { type: 'merge', target: occ };
    if (d.src.type === 'bench') return { type: 'swap', slot: i, other: occ, ok: true };
    return { type: 'bench', slot: i, ok: false };
  }
  const gr = cellsEl.getBoundingClientRect();
  const cx = gx + d.gw / 2, cy = gy + d.gh / 2;
  if (cx > gr.left - CELL * 0.6 && cx < gr.right + CELL * 0.6 && cy > gr.top - CELL * 0.6 && cy < gr.bottom + CELL * 0.6) {
    const ax = Math.round((gx - gr.left) / CELL), ay = Math.round((gy - gr.top) / CELL);
    // fusion : la forme recouvre un objet identique
    const m = gridMap(d.it.uid);
    const over = new Set();
    for (const [x, y] of cellsOf(d.it, ax, ay, d.rot)) { const o = m.get(x + ',' + y); if (o) over.add(o); }
    if (over.size === 1) { const o = [...over][0]; if (canMerge(d.it, o)) return { type: 'merge', target: o }; }
    return { type: 'grid', ax, ay, rot: d.rot, ok: fits(d.it, ax, ay, d.rot) };
  }
  return null;
}
function clearPreview() {
  cellsEl?.querySelectorAll('.ok,.bad,.merge').forEach(c => c.classList.remove('ok', 'bad', 'merge'));
  slotEls.forEach(s => s.classList.remove('over', 'bad'));
  el.sell.classList.remove('over');
}
function moveDrag(px, py) {
  const d = drag;
  d.px = px; d.py = py;
  const gx = px - d.gw / 2, gy = py - d.gh / 2 - (d.touch ? 46 : 0);
  el.ghost.style.transform = `translate(${gx}px, ${gy}px)`;
  const t = computeDrop(px, py, gx, gy);
  d.target = t;
  clearPreview();
  if (!t) return;
  if (t.type === 'sell') el.sell.classList.add('over');
  else if (t.type === 'bench' || t.type === 'swap') slotEls[t.slot].classList.add(t.ok ? 'over' : 'bad');
  else if (t.type === 'merge') {
    if (t.target.where === 'grid') for (const [x, y] of cellsOf(t.target)) cellsEl.querySelector(`[data-k="${x},${y}"]`)?.classList.add('merge');
    else slotEls[t.target.slot].classList.add('over');
  } else if (t.type === 'grid') {
    for (const [x, y] of cellsOf(d.it, t.ax, t.ay, t.rot)) cellsEl.querySelector(`[data-k="${x},${y}"]`)?.classList.add(t.ok ? 'ok' : 'bad');
  }
}
function endDrag(d) {
  clearPreview();
  el.ghost.hidden = true; el.sell.hidden = true;
  document.querySelectorAll('.item.mergeable,.item.dragging').forEach(e => e.classList.remove('mergeable', 'dragging'));
  const t = d.target;
  if (!t || t.ok === false) { if (t) { sfx('bad'); } renderAll(); return; }
  if (d.src.type === 'shop') {
    if (t.type === 'sell') { renderAll(); return; }
    if (t.type === 'grid') { buyShop(d.src.index, { type: 'grid', ax: t.ax, ay: t.ay, rot: t.rot }); return; }
    if (t.type === 'bench') { buyShop(d.src.index, { type: 'bench', slot: t.slot, rot: t.rot }); return; }
    if (t.type === 'merge') { buyShop(d.src.index, t); return; }
    renderAll(); return;
  }
  const it = d.it;
  if (t.type === 'sell') { sellItem(it); return; }
  if (t.type === 'merge') {
    run.items = run.items.filter(o => o !== it);
    t.target.star++;
    sfx('merge'); toast(`Fusion ! ${ITEMS[it.id].name} ${starStr(t.target.star)}`);
  } else if (t.type === 'grid') {
    Object.assign(it, { where: 'grid', x: t.ax, y: t.ay, rot: t.rot }); delete it.slot; sfx('click');
  } else if (t.type === 'bench') {
    Object.assign(it, { where: 'bench', slot: t.slot, rot: t.rot }); delete it.x; delete it.y; sfx('click');
  } else if (t.type === 'swap') {
    const s = it.slot; it.slot = t.slot; t.other.slot = s; it.rot = d.rot; sfx('click');
  }
  afterChange();
}
window.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.pid) return;
  if (!drag.started) {
    if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 7) return;
    startDrag();
    if (!drag) return;
  }
  e.preventDefault();
  moveDrag(e.clientX, e.clientY);
}, { passive: false });
window.addEventListener('pointerup', e => {
  if (!drag || e.pointerId !== drag.pid) return;
  const d = drag; drag = null;
  if (!d.started) openSheet(d.src); else endDrag(d);
});
window.addEventListener('pointercancel', e => {
  if (!drag || e.pointerId !== drag.pid) return;
  const d = drag; drag = null;
  if (d.started) { d.target = null; endDrag(d); }
});
// 2e doigt = tourner (mobile)
window.addEventListener('pointerdown', e => { if (drag && drag.started && e.pointerId !== drag.pid) { e.preventDefault(); rotateDrag(); } }, true);
window.addEventListener('contextmenu', e => { if (drag && drag.started) { e.preventDefault(); rotateDrag(); } else if (state === 'prep' || state === 'fight') e.preventDefault(); });
window.addEventListener('keydown', e => {
  if ((e.key === 'r' || e.key === 'R') && drag && drag.started) rotateDrag();
  if (e.key === 'Escape') { if (!el.sheet.hidden) closeSheet(); else if (!el.help.hidden) el.help.hidden = true; }
});

/* =========================================================
   COMBAT
   ========================================================= */
const W = 400, H = 230, GROUND = 176, HERO_X = 46;
const cv = $('#battle'), ctx = cv.getContext('2d');
const bgCanvas = document.createElement('canvas');
let SC = 1, bgKey = '';
let idleStack = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const w = cv.clientWidth || 380;
  cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr * H / W);
  SC = cv.width / W;
  bgKey = '';
}
function buildBg() {
  const key = run.chapter + ':' + cv.width;
  if (key === bgKey) return;
  bgKey = key;
  const pal = CHAPTERS[(run.chapter - 1) % CHAPTERS.length];
  bgCanvas.width = cv.width; bgCanvas.height = cv.height;
  const g = bgCanvas.getContext('2d');
  g.setTransform(SC, 0, 0, SC, 0, 0);
  const sky = g.createLinearGradient(0, 0, 0, GROUND);
  sky.addColorStop(0, pal.sky[0]); sky.addColorStop(1, pal.sky[1]);
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  const rnd = mulberry32(run.chapter * 977 + 13);
  // couche lointaine : immeubles en ruine
  for (const [col, base, hMin, hVar, alpha] of [[pal.far, GROUND - 22, 60, 90, 1], [pal.mid, GROUND - 18, 25, 55, 1]]) {
    let x = -10 - rnd() * 20;
    while (x < W + 10) {
      const w = 26 + rnd() * 46, h = hMin + rnd() * hVar;
      g.globalAlpha = alpha;
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(x, base); g.lineTo(x, base - h);
      const steps = 3 + Math.floor(rnd() * 3);
      for (let i = 1; i <= steps; i++) g.lineTo(x + (w * i) / steps, base - h + (rnd() - 0.3) * 14);
      g.lineTo(x + w, base); g.closePath(); g.fill();
      g.fillStyle = 'rgba(0,0,0,.13)';
      for (let wy = base - h + 14; wy < base - 12; wy += 16) for (let wx = x + 6; wx < x + w - 10; wx += 13) if (rnd() > 0.3) g.fillRect(wx, wy, 6, 8);
      x += w + rnd() * 14;
    }
  }
  g.globalAlpha = 1;
  // sol
  g.fillStyle = pal.ground; g.fillRect(0, GROUND - 22, W, H);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, GROUND - 22, W, 3);
  g.fillStyle = 'rgba(255,255,255,.12)';
  for (let x = 10; x < W; x += 46) g.fillRect(x, GROUND + 6, 22, 3);
  g.fillStyle = pal.dark; g.fillRect(0, GROUND + 26, W, H);
  g.strokeStyle = '#14171d'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, GROUND + 26);
  for (let x = 0; x <= W; x += 20) g.quadraticCurveTo(x + 10, GROUND + 23 + rnd() * 6, x + 20, GROUND + 26);
  g.stroke();
  for (let i = 0; i < 14; i++) { g.fillStyle = 'rgba(0,0,0,.15)'; g.beginPath(); g.ellipse(rnd() * W, GROUND - 14 + rnd() * 36, 2 + rnd() * 3, 1.5, 0, 0, 7); g.fill(); }
}

function buildWave(w, c) {
  const hpM = (1 + 0.22 * (w - 1) + 0.012 * (w - 1) ** 2) * Math.pow(2.2, c - 1);
  const dmM = (1 + 0.07 * (w - 1)) * Math.pow(1.6, c - 1);
  let budget = 7 + 3.2 * w;
  const weight = { slime: 5, bat: 3, beetle: 2.5, spitter: 2, brute: 1.2 };
  const list = [];
  while (budget > 0) {
    const opts = Object.keys(weight).filter(k => ENEMIES[k].from <= w && ENEMIES[k].cost <= budget + 0.5);
    if (!opts.length) break;
    let r = Math.random() * opts.reduce((s, k) => s + weight[k], 0), k = opts[0];
    for (const o of opts) { if ((r -= weight[o]) < 0) { k = o; break; } }
    list.push(k); budget -= ENEMIES[k].cost;
  }
  const dur = 5 + list.length * 0.55;
  const q = list.map(type => ({ t: 0.3 + Math.random() * dur, type, hpM, dmM }));
  if (w % 5 === 0) q.push({ t: dur * 0.35, type: 'boss', hpM: hpM * (1 + 0.45 * (w / 5 - 1)), dmM });
  return q.sort((a, b) => a.t - b.t);
}

function startWave() {
  if (state !== 'prep') return;
  if (!run.items.some(it => it.where === 'grid' && ITEMS[it.id].cat === 'weapon')) {
    toast('Installe au moins une arme dans ton sac !'); sfx('bad'); return;
  }
  closeSheet();
  saveRun();
  const L = loadout();
  B = {
    L, t: 0, queue: buildWave(run.wave, run.chapter), enemies: [], projs: [], parts: [], pops: [], beams: [],
    hero: { hp: Math.max(1, run.hpFrac * L.maxHp), max: L.maxHp, shield: L.shieldCap, recoil: 0, hurt: 0 },
    weapons: L.weapons.map((w, i) => Object.assign({}, w, { timer: 0.25 + Math.random() * Math.min(w.cd, 0.8), slot: i })),
    healers: L.healers.map(h => Object.assign({}, h, { t: h.cd })),
    shields: L.shields.map(s => Object.assign({}, s, { t: s.cd })),
    revive: L.revive, revived: false, endT: null, shake: 0, cashW: 0, fireAnim: {}, total: 0,
  };
  B.total = B.queue.length;
  state = 'fight';
  el.game.classList.add('fighting');
  el.tip.textContent = '';
  renderAll();
  banner(`Vague ${run.wave}`, run.wave % 5 === 0 ? '⚠ BOSS ⚠' : 'Tiens bon !', 1200);
  sfx('wave');
  renderStats();
}

function spawn(q) {
  const d = ENEMIES[q.type];
  const hp = d.hp * q.hpM;
  B.enemies.push({
    type: q.type, d, x: W + d.size + rand(0, 15),
    y: d.fly ? GROUND - 52 - rand(0, 28) : GROUND + rand(-12, 12),
    hp, max: hp, spd: d.spd * rand(0.88, 1.12), dmg: d.dmg * q.dmM,
    atkT: 0.4, burnDps: 0, burnT: 0, burnW: null, flash: 0, anim: rand(0, 10), dead: false, deadT: 0, lunge: 0,
    stopX: d.ranged ? HERO_X + d.ranged + rand(-15, 15) : HERO_X + 14 + d.size * 0.9 + rand(0, 12),
  });
}

function heroStackPos(slot, id) {
  const n = Math.min(B ? B.weapons.length : idleStack.length, 7);
  const i = slot % 7;
  const [w0, h0] = shapeBox(ITEMS[id].shape);
  const s = n <= 2 ? 15 : n <= 4 ? 13 : 11;
  const w = w0 * s, h = h0 * s;
  const y = GROUND - 22 - i * (n <= 2 ? 13 : n <= 4 ? 11 : 8) - h / 2;
  return { x: HERO_X + 2, y, w, h, mx: HERO_X + 2 + w, my: y + h * 0.32 };
}

function aliveEnemies() { return B.enemies.filter(e => !e.dead && e.x < W - 2); }
function nearestAlive(x) {
  let best = null, bd = 1e9;
  for (const e of B.enemies) if (!e.dead && e.x < W - 2 && Math.abs(e.x - x) < bd) { bd = Math.abs(e.x - x); best = e; }
  return best;
}
const ecy = e => e.y - e.d.size * 0.7;

function fire(w) {
  const d = w.d;
  const range = d.range || 999;
  const inRange = aliveEnemies().filter(e => e.x - HERO_X <= range).sort((a, b) => a.x - b.x);
  if (!inRange.length) return false;
  const tgt = inRange[0];
  const p = heroStackPos(w.slot, w.id);
  B.hero.recoil = 0.08;
  switch (d.kind) {
    case 'bullet':
      B.projs.push({ k: 'bullet', x: p.mx, y: p.my, t: tgt, spd: 720, dmg: w.dmg, w });
      muzzle(p.mx, p.my); sfx('shoot'); break;
    case 'pellets':
      for (let i = 0; i < d.pellets; i++) {
        const t = inRange[Math.floor(Math.random() * Math.min(3, inRange.length))];
        B.projs.push({ k: 'bullet', x: p.mx, y: p.my + rand(-3, 3), t, spd: 620 + rand(0, 120), dmg: w.dmg, w });
      }
      muzzle(p.mx, p.my, 1.5); sfx('shoot'); break;
    case 'lob': {
      const tx = Math.max(tgt.stopX, tgt.x - tgt.spd * 0.7);
      B.projs.push({ k: 'lob', x0: p.mx, y0: p.my, x: p.mx, y: p.my, tx, ty: tgt.d.fly ? ecy(tgt) : tgt.y - 4, p: 0, dur: 0.7, dmg: w.dmg, w, id: w.id });
      break;
    }
    case 'rocket':
      B.projs.push({ k: 'rocket', x: p.mx, y: p.my, t: tgt, spd: 330, dmg: w.dmg, w });
      muzzle(p.mx, p.my, 1.3); sfx('shoot'); break;
    case 'rail': {
      const hits = inRange.slice(0, d.pierce);
      hits.forEach(e => applyDmg(e, w.dmg, w));
      const last = hits[hits.length - 1];
      B.beams.push({ x1: p.mx, y1: p.my, x2: last.x + 20, y2: ecy(last), col: '#fff6b0', wd: 3, life: 0.15, max: 0.15 });
      muzzle(p.mx, p.my, 1.5); sfx('shoot'); break;
    }
    case 'laser':
      aliveEnemies().forEach(e => applyDmg(e, w.dmg, w));
      B.beams.push({ x1: p.mx, y1: p.my, x2: W, y2: p.my, col: '#4ff0ff', wd: 6, life: 0.25, max: 0.25, laser: true });
      sfx('laser'); break;
    case 'flame':
      for (const e of inRange) {
        applyDmg(e, w.dmg, w, { quiet: true });
        e.burnDps = Math.max(e.burnDps, w.burn); e.burnT = 2; e.burnW = w;
      }
      for (let i = 0; i < 5; i++) B.parts.push({ x: p.mx, y: p.my, vx: rand(140, 260), vy: rand(-40, 30), life: rand(0.25, 0.45), max: 0.45, col: pick(['#ffb02e', '#ff6a2e', '#ffe14d']), sz: rand(3, 6), g: -40 });
      break;
  }
  const now = performance.now();
  if (!B.fireAnim[w.uid] || now - B.fireAnim[w.uid] > 140) {
    B.fireAnim[w.uid] = now;
    const ie = itemEls.get(w.uid);
    if (ie) { ie.classList.remove('fire'); void ie.offsetWidth; ie.classList.add('fire'); }
  }
  return true;
}
function muzzle(x, y, s = 1) {
  B.parts.push({ x: x + 3, y, vx: 0, vy: 0, life: 0.06, max: 0.06, col: '#fff3a0', sz: 5 * s, flash: true });
}
function pop(x, y, txt, col, size = 1) {
  if (B.pops.length > 50) B.pops.shift();
  B.pops.push({ x: x + rand(-6, 6), y, txt, col, size, life: 0.8, max: 0.8 });
}
function applyDmg(e, amount, w, opts = {}) {
  if (e.dead) return;
  const crit = !opts.noCrit && Math.random() < w.crit;
  const dm = amount * (crit ? 2 : 1);
  e.hp -= dm; e.flash = 0.08;
  run.dmg[w.id] = (run.dmg[w.id] || 0) + dm;
  if (w.leech) healHero(dm * w.leech, false);
  if (!opts.silent && (!opts.quiet || Math.random() < 0.25)) pop(e.x, e.y - e.d.size * 1.9 - 6, fmt(dm), crit ? '#ffd84a' : '#ffffff', crit ? 1.35 : 1);
  if (e.hp <= 0) kill(e);
}
function kill(e) {
  e.dead = true; e.deadT = 0.35;
  run.cash += e.d.cash; B.cashW += e.d.cash; run.kills++;
  if (e.d.boss) { run.bosses++; B.shake = 8; sfx('boom'); }
  pop(e.x, e.y - e.d.size - 4, '+' + e.d.cash + '$', '#8be35a', 0.9);
  for (let i = 0; i < 8 + e.d.size / 2; i++) B.parts.push({ x: e.x, y: ecy(e), vx: rand(-90, 90), vy: rand(-140, -20), life: rand(0.3, 0.6), max: 0.6, col: enemyColor(e.type), sz: rand(2, 4), g: 400 });
  el.cash.textContent = run.cash;
  sfx('coin');
}
function explode(x, y, r, dmg, w) {
  for (const e of B.enemies) {
    if (e.dead) continue;
    if (Math.hypot(e.x - x, (ecy(e) - y) * 0.6) <= r + e.d.size * 0.6) applyDmg(e, dmg, w);
  }
  B.beams.push({ boom: true, x1: x, y1: y, r, life: 0.3, max: 0.3 });
  for (let i = 0; i < 14; i++) B.parts.push({ x, y, vx: rand(-150, 150), vy: rand(-170, 10), life: rand(0.3, 0.6), max: 0.6, col: pick(['#ffb02e', '#ff6a2e', '#ffe14d', '#555']), sz: rand(2, 5), g: 300 });
  B.shake = Math.max(B.shake, 3);
  sfx('boom');
}
function healHero(v, show) {
  const h = B.hero;
  const before = h.hp;
  h.hp = Math.min(h.max, h.hp + v);
  if (show && h.hp - before >= 1) { pop(HERO_X, GROUND - 58, '+' + fmt(h.hp - before), '#5dff8a', 1.1); sfx('heal'); }
}
function hurtHero(dm) {
  const h = B.hero;
  if (h.shield > 0) { const a = Math.min(h.shield, dm); h.shield -= a; dm -= a; }
  if (dm <= 0) { pop(HERO_X + 10, GROUND - 50, 'bloqué', '#8fd0ff', 0.8); return; }
  h.hp -= dm; h.hurt = 0.18;
  pop(HERO_X + 8, GROUND - 52, '-' + fmt(dm), '#ff5a4f', 1);
  B.shake = Math.max(B.shake, 2);
  sfx('hurt');
}

function update(dt) {
  B.t += dt;
  while (B.queue.length && B.queue[0].t <= B.t) spawn(B.queue.shift());
  const h = B.hero;
  if (B.L.regen) healHero(B.L.regen * dt, false);
  for (const hl of B.healers) { hl.t -= dt; if (hl.t <= 0) { hl.t += hl.cd; if (h.hp < h.max) healHero(hl.amt * h.max, true); } }
  for (const s of B.shields) { s.t -= dt; if (s.t <= 0) { s.t += s.cd; h.shield = Math.min(B.L.shieldCap, h.shield + s.amt); } }
  for (const w of B.weapons) {
    w.timer -= dt;
    if (w.timer <= 0) { if (fire(w)) w.timer += w.cd; else w.timer = 0; }
  }
  for (const e of B.enemies) {
    if (e.dead) { e.deadT -= dt; continue; }
    e.anim += dt;
    if (e.flash > 0) e.flash -= dt;
    if (e.lunge > 0) e.lunge -= dt;
    if (e.burnT > 0) {
      e.burnT -= dt; applyDmg(e, e.burnDps * dt, e.burnW, { silent: true, noCrit: true });
      if (Math.random() < dt * 10) B.parts.push({ x: e.x + rand(-6, 6), y: ecy(e), vx: 0, vy: -40, life: 0.3, max: 0.3, col: '#ff9a2e', sz: 3, g: 0 });
      if (e.dead) continue;
    }
    if (e.x > e.stopX) e.x -= e.spd * dt;
    else {
      e.atkT -= dt;
      if (e.atkT <= 0) {
        e.atkT = e.d.atk || 1;
        if (e.d.ranged) B.projs.push({ k: 'spit', x: e.x - 8, y: ecy(e), spd: 170, dmg: e.dmg });
        else { hurtHero(e.dmg); e.lunge = 0.15; }
      }
    }
  }
  B.enemies = B.enemies.filter(e => !e.dead || e.deadT > 0);
  for (const p of B.projs) {
    if (p.k === 'bullet' || p.k === 'rocket') {
      if (p.t.dead) { p.t = nearestAlive(p.x); if (!p.t) { p.dead = true; continue; } }
      const tx = p.t.x, ty = ecy(p.t);
      const dx = tx - p.x, dy = ty - p.y, dist = Math.hypot(dx, dy);
      const step = p.spd * dt;
      if (p.k === 'rocket' && Math.random() < 0.6) B.parts.push({ x: p.x, y: p.y, vx: rand(-20, 0), vy: rand(-10, 10), life: 0.3, max: 0.3, col: '#bbb', sz: 3, g: -20 });
      if (dist <= step + p.t.d.size * 0.5) {
        p.dead = true;
        if (p.k === 'rocket') explode(tx, ty, p.w.d.aoe, p.dmg, p.w);
        else { applyDmg(p.t, p.dmg, p.w); sfx('hit'); }
      } else { p.x += dx / dist * step; p.y += dy / dist * step; p.ang = Math.atan2(dy, dx); }
    } else if (p.k === 'lob') {
      p.p += dt / p.dur;
      const q = Math.min(1, p.p);
      p.x = p.x0 + (p.tx - p.x0) * q;
      p.y = p.y0 + (p.ty - p.y0) * q - Math.sin(q * Math.PI) * 60;
      if (p.p >= 1) { p.dead = true; explode(p.tx, p.ty - 6, p.w.d.aoe, p.dmg, p.w); }
    } else if (p.k === 'spit') {
      const tx = HERO_X, ty = GROUND - 22;
      const dx = tx - p.x, dy = ty - p.y, dist = Math.hypot(dx, dy), step = p.spd * dt;
      if (dist <= step + 6) { p.dead = true; hurtHero(p.dmg); }
      else { p.x += dx / dist * step; p.y += dy / dist * step; }
    }
  }
  B.projs = B.projs.filter(p => !p.dead);
  for (const p of B.parts) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.g || 0) * dt; }
  B.parts = B.parts.filter(p => p.life > 0);
  if (B.parts.length > 400) B.parts.splice(0, B.parts.length - 400);
  for (const p of B.pops) { p.life -= dt; p.y -= 28 * dt; }
  B.pops = B.pops.filter(p => p.life > 0);
  for (const b of B.beams) b.life -= dt;
  B.beams = B.beams.filter(b => b.life > 0);
  if (h.recoil > 0) h.recoil -= dt;
  if (h.hurt > 0) h.hurt -= dt;
  if (B.shake > 0) B.shake = Math.max(0, B.shake - dt * 30);

  if (h.hp <= 0) {
    if (B.revive && !B.revived) {
      B.revived = true; h.hp = h.max * B.revive;
      banner('Relevé !', 'Pile de secours', 1000); sfx('heal');
      for (let i = 0; i < 20; i++) B.parts.push({ x: HERO_X, y: GROUND - 20, vx: rand(-80, 80), vy: rand(-160, -40), life: 0.7, max: 0.7, col: '#ffe14d', sz: 3, g: 100 });
    } else { h.hp = 0; loseRun(); return; }
  }
  if (!B.queue.length && !B.enemies.some(e => !e.dead) && B.endT == null) B.endT = 0.9;
  if (B.endT != null) { B.endT -= dt; if (B.endT <= 0) waveWon(); }
}

/* ---------------- dessin ---------------- */
function rr(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else { g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
}
const OUT = '#14171d';
function enemyColor(t) { return { slime: '#7bd35b', bat: '#8a5cd6', beetle: '#a8713c', spitter: '#e0516b', brute: '#8d8fa8', boss: '#a259e0' }[t]; }

function drawHero(g, x, y, t, opts = {}) {
  const bob = Math.sin(t * 5) * 1.2;
  const rec = opts.recoil > 0 ? -2 : 0;
  g.save();
  g.translate(rec, 0);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(x, y + 2, 17, 4, 0, 0, 7); g.fill();
  g.lineWidth = 2.2; g.strokeStyle = OUT; g.lineJoin = 'round';
  // jambes
  g.fillStyle = '#5a6578';
  rr(g, x - 9, y - 11, 6, 12, 2); g.fill(); g.stroke();
  rr(g, x + 3, y - 11, 6, 12, 2); g.fill(); g.stroke();
  // corps
  g.fillStyle = opts.hurt > 0 ? '#ffb3ad' : '#f4f1e8';
  rr(g, x - 14, y - 40 + bob, 28, 31, 8); g.fill(); g.stroke();
  // bandeau
  g.fillStyle = '#e2483d';
  g.fillRect(x - 14, y - 36 + bob, 28, 5);
  g.beginPath(); g.moveTo(x - 14, y - 34 + bob); g.lineTo(x - 22, y - 30 + bob + Math.sin(t * 9) * 2); g.lineTo(x - 21, y - 36 + bob); g.closePath(); g.fill(); g.stroke();
  // visière
  g.fillStyle = '#28323f';
  rr(g, x - 6, y - 29 + bob, 19, 10, 4); g.fill(); g.stroke();
  g.fillStyle = '#7cf3ff';
  g.beginPath(); g.arc(x + 7, y - 24 + bob, 2.4, 0, 7); g.fill();
  g.beginPath(); g.arc(x + 1, y - 24 + bob, 2.4, 0, 7); g.fill();
  // antenne
  g.beginPath(); g.moveTo(x - 4, y - 40 + bob); g.lineTo(x - 7, y - 48 + bob); g.stroke();
  g.fillStyle = '#ffcc33'; g.beginPath(); g.arc(x - 7, y - 49 + bob, 3, 0, 7); g.fill(); g.stroke();
  g.restore();
}

function drawEnemy(g, e) {
  const s = e.d.size, t = e.anim;
  let x = e.x - (e.lunge > 0 ? 5 : 0), y = e.y;
  g.save();
  if (e.dead) { const k = Math.max(0, e.deadT / 0.35); g.globalAlpha = k; g.translate(x, y); g.scale(1, k); g.translate(-x, -y); }
  g.lineWidth = 2; g.strokeStyle = OUT; g.lineJoin = 'round';
  const col = e.flash > 0 ? '#ffffff' : (e.burnT > 0 ? '#ff9a4a' : enemyColor(e.type));
  if (!e.d.fly) { g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(x, y + 1, s * 1.1, s * 0.25, 0, 0, 7); g.fill(); }
  else { g.fillStyle = 'rgba(0,0,0,.15)'; g.beginPath(); g.ellipse(x, GROUND + 6, s, s * 0.22, 0, 0, 7); g.fill(); }
  const eyes = (ex, ey, r, angry = true) => {
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(ex, ey, r, 0, 7); g.fill(); g.stroke();
    g.beginPath(); g.arc(ex + r * 1.9, ey, r, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OUT;
    g.beginPath(); g.arc(ex - r * 0.35, ey + r * 0.15, r * 0.5, 0, 7); g.fill();
    g.beginPath(); g.arc(ex + r * 1.55, ey + r * 0.15, r * 0.5, 0, 7); g.fill();
    if (angry) { g.beginPath(); g.moveTo(ex - r, ey - r * 1.3); g.lineTo(ex + r * 0.8, ey - r * 0.7); g.moveTo(ex + r * 2.9, ey - r * 1.3); g.lineTo(ex + r * 1.1, ey - r * 0.7); g.stroke(); }
  };
  switch (e.type) {
    case 'slime': case 'boss': {
      const sq = Math.sin(t * 7) * 0.08;
      g.fillStyle = col;
      g.beginPath(); g.ellipse(x, y - s * 0.75, s * 1.15 * (1 + sq), s * 0.85 * (1 - sq), 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x + s * 0.4, y - s * 1.15, s * 0.28, s * 0.16, -0.4, 0, 7); g.fill();
      eyes(x - s * 0.6, y - s * 0.85, s * 0.22);
      g.beginPath(); g.moveTo(x - s * 0.5, y - s * 0.35); g.quadraticCurveTo(x - s * 0.25, y - s * 0.5, x, y - s * 0.35); g.stroke();
      if (e.type === 'boss') {
        g.fillStyle = '#ffcc33';
        g.beginPath(); const cy = y - s * 1.5;
        g.moveTo(x - s * 0.5, cy + 6); g.lineTo(x - s * 0.55, cy - 10); g.lineTo(x - s * 0.25, cy - 2); g.lineTo(x, cy - 14); g.lineTo(x + s * 0.25, cy - 2); g.lineTo(x + s * 0.55, cy - 10); g.lineTo(x + s * 0.5, cy + 6); g.closePath();
        g.fill(); g.stroke();
      }
      break;
    }
    case 'bat': {
      const f = Math.sin(t * 22) * 7;
      g.fillStyle = col;
      g.beginPath(); g.moveTo(x - 3, y - s); g.lineTo(x - s * 2, y - s - 4 - f); g.lineTo(x - s * 1.2, y - s + 4); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x + 3, y - s); g.lineTo(x + s * 2, y - s - 4 - f); g.lineTo(x + s * 1.2, y - s + 4); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.arc(x, y - s, s, 0, 7); g.fill(); g.stroke();
      g.fillStyle = '#ff4d4d'; g.beginPath(); g.arc(x - 4, y - s - 1, 2, 0, 7); g.arc(x + 2, y - s - 1, 2, 0, 7); g.fill();
      break;
    }
    case 'beetle': {
      g.strokeStyle = OUT;
      for (let i = 0; i < 3; i++) { const lx = x - s * 0.6 + i * s * 0.6, k = Math.sin(t * 12 + i) * 3; g.beginPath(); g.moveTo(lx, y - s * 0.4); g.lineTo(lx + k, y); g.stroke(); }
      g.fillStyle = '#3b2b1f'; g.beginPath(); g.arc(x - s * 1.05, y - s * 0.55, s * 0.4, 0, 7); g.fill(); g.stroke();
      g.fillStyle = col; g.beginPath(); g.ellipse(x, y - s * 0.65, s * 1.1, s * 0.6, 0, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x, y - s * 1.25); g.lineTo(x, y - s * 0.65); g.stroke();
      g.fillStyle = '#ffde59'; g.beginPath(); g.arc(x - s * 1.15, y - s * 0.65, 1.8, 0, 7); g.fill();
      break;
    }
    case 'spitter': {
      g.fillStyle = '#f0e2c8';
      rr(g, x - s * 0.4, y - s * 1.0, s * 0.8, s, 3); g.fill(); g.stroke();
      const b = Math.sin(t * 4) * 1.5;
      g.fillStyle = col; g.beginPath(); g.ellipse(x, y - s * 1.0 + b, s * 1.1, s * 0.75, 0, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#fff'; [[-0.5, -1.35], [0.3, -1.5], [0.6, -1.15]].forEach(([a, c]) => { g.beginPath(); g.arc(x + a * s, y + c * s + b, s * 0.15, 0, 7); g.fill(); });
      g.fillStyle = OUT; g.beginPath(); g.arc(x - s * 0.25, y - s * 0.65, s * 0.12, 0, 7); g.arc(x + s * 0.15, y - s * 0.65, s * 0.12, 0, 7); g.fill();
      g.beginPath(); g.ellipse(x - s * 0.4, y - s * 0.35, s * 0.18, s * 0.12, 0, 0, 7); g.fill();
      break;
    }
    case 'brute': {
      g.fillStyle = col;
      rr(g, x - s * 0.9, y - s * 1.7, s * 1.8, s * 1.7, 8); g.fill(); g.stroke();
      g.fillStyle = '#6e6f86'; rr(g, x - s * 1.25, y - s * 0.9 + Math.sin(t * 6) * 2, s * 0.6, s * 0.6, 5); g.fill(); g.stroke();
      g.fillStyle = '#ff5a4f'; g.beginPath(); g.arc(x - s * 0.45, y - s * 1.25, 2.6, 0, 7); g.arc(x + s * 0.05, y - s * 1.25, 2.6, 0, 7); g.fill();
      g.strokeStyle = OUT; g.beginPath(); g.moveTo(x - s * 0.6, y - s * 0.85); g.lineTo(x + s * 0.1, y - s * 0.85); g.stroke();
      g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(x + s * 0.3, y - s * 1.5, 4, s * 1.2);
      break;
    }
  }
  g.restore();
  // barre de vie
  if (!e.dead) {
    const bw = Math.max(22, s * 2.2), bx = e.x - bw / 2, by = e.y - s * (e.type === 'brute' ? 1.95 : 1.85) - (e.type === 'boss' ? 22 : 10) - (e.d.fly ? s * 0.4 : 0);
    g.fillStyle = '#14171d'; rr(g, bx - 1, by - 1, bw + 2, (e.d.boss ? 9 : 6) + 2, 3); g.fill();
    g.fillStyle = e.d.boss ? '#ff5a4f' : '#74d93f'; rr(g, bx, by, bw * clamp(e.hp / e.max, 0, 1), e.d.boss ? 9 : 6, 3); g.fill();
    if (e.d.boss || e.type === 'brute') {
      g.font = '9px "Lilita One", sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff';
      g.fillText(fmt(Math.max(0, e.hp)), e.x, by + (e.d.boss ? 8 : 6));
    }
  }
}

function drawStack(g, list, t) {
  list.slice(0, 7).forEach((w, i) => {
    const p = heroStackPos(i, w.id);
    const img = ICON_IMG[w.id];
    const rec = B && B.fireAnim[w.uid] && performance.now() - B.fireAnim[w.uid] < 70 ? -2 : 0;
    if (img.complete && img.naturalWidth) g.drawImage(img, p.x + rec, p.y + Math.sin(t * 5) * 1.2, p.w, p.h);
  });
}

let lastT = performance.now(), clock = 0;
function frame(now) {
  const real = Math.min(0.05, (now - lastT) / 1000);
  lastT = now; clock += real;
  if (state === 'home') drawHome(clock);
  else if (!el.game.hidden) {
    const paused = !el.pause.hidden || !el.sheet.hidden || !el.result.hidden || !el.help.hidden;
    if (state === 'fight' && B && !paused) {
      let left = real * meta.speed;
      while (left > 0 && state === 'fight') { const st = Math.min(left, 1 / 60); update(st); left -= st; }
    }
    drawBattle(clock);
  }
  requestAnimationFrame(frame);
}

function drawBattle(t) {
  if (!run) return;
  if (!cv.width) resizeCanvas();
  buildBg();
  const g = ctx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(bgCanvas, 0, 0);
  const sh = B && B.shake > 0 ? B.shake : 0;
  g.setTransform(SC, 0, 0, SC, rand(-sh, sh) * SC, rand(-sh, sh) * SC);
  const h = B ? B.hero : null;
  // entités triées par profondeur
  const ents = B ? B.enemies.slice() : [];
  ents.sort((a, b) => a.y - b.y);
  let heroDrawn = false;
  const drawH = () => {
    drawHero(g, HERO_X, GROUND, t, { recoil: h ? h.recoil : 0, hurt: h ? h.hurt : 0 });
    drawStack(g, B ? B.weapons : idleStack, t);
    if (h && h.shield > 0) {
      g.strokeStyle = 'rgba(110,190,255,.75)'; g.lineWidth = 2.5;
      g.beginPath(); g.ellipse(HERO_X + 4, GROUND - 26, 30, 34, 0, 0, 7); g.stroke();
    }
    heroDrawn = true;
  };
  for (const e of ents) {
    if (!heroDrawn && e.y > GROUND) drawH();
    drawEnemy(g, e);
  }
  if (!heroDrawn) drawH();
  if (B) {
    for (const p of B.projs) {
      if (p.k === 'bullet') { g.strokeStyle = '#ffe680'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - Math.cos(p.ang || 0) * 8, p.y - Math.sin(p.ang || 0) * 8); g.stroke(); }
      else if (p.k === 'rocket') { g.save(); g.translate(p.x, p.y); g.rotate(p.ang || 0); g.fillStyle = '#537f3c'; g.strokeStyle = OUT; g.lineWidth = 1.5; rr(g, -8, -3, 14, 6, 3); g.fill(); g.stroke(); g.fillStyle = '#ec5f3d'; g.beginPath(); g.arc(6, 0, 3, 0, 7); g.fill(); g.restore(); }
      else if (p.k === 'lob') { const img = ICON_IMG[p.id]; g.save(); g.translate(p.x, p.y); g.rotate(p.p * 10); if (img.complete) g.drawImage(img, -6, -6, 12, 12); g.restore(); }
      else if (p.k === 'spit') { g.fillStyle = '#b4f05a'; g.strokeStyle = OUT; g.lineWidth = 1.5; g.beginPath(); g.arc(p.x, p.y, 4, 0, 7); g.fill(); g.stroke(); }
    }
    for (const b of B.beams) {
      const k = b.life / b.max;
      if (b.boom) {
        g.fillStyle = `rgba(255,190,60,${0.5 * k})`; g.beginPath(); g.arc(b.x1, b.y1, b.r * (1.2 - k * 0.4), 0, 7); g.fill();
        g.strokeStyle = `rgba(255,255,255,${0.8 * k})`; g.lineWidth = 3; g.stroke();
      } else {
        g.strokeStyle = b.col; g.globalAlpha = k; g.lineWidth = b.wd * k + 1; g.lineCap = 'round';
        g.beginPath(); g.moveTo(b.x1, b.y1); g.lineTo(b.x2, b.y2); g.stroke();
        if (b.laser) { g.strokeStyle = '#fff'; g.lineWidth = 2 * k; g.stroke(); }
        g.globalAlpha = 1; g.lineCap = 'butt';
      }
    }
    for (const p of B.parts) {
      g.globalAlpha = clamp(p.life / p.max, 0, 1);
      g.fillStyle = p.col;
      if (p.flash) { g.beginPath(); g.arc(p.x, p.y, p.sz, 0, 7); g.fill(); }
      else g.fillRect(p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
    }
    g.globalAlpha = 1;
    g.textAlign = 'center'; g.lineJoin = 'round';
    for (const p of B.pops) {
      g.globalAlpha = clamp(p.life / p.max * 1.6, 0, 1);
      g.font = `${Math.round(11 * p.size)}px "Lilita One", sans-serif`;
      g.strokeStyle = OUT; g.lineWidth = 3; g.strokeText(p.txt, p.x, p.y);
      g.fillStyle = p.col; g.fillText(p.txt, p.x, p.y);
    }
    g.globalAlpha = 1;
  }
  // HUD canvas : PV + bouclier + ennemis restants
  g.setTransform(SC, 0, 0, SC, 0, 0);
  const hp = h ? h.hp : null, max = h ? h.max : null;
  if (h) {
    g.fillStyle = OUT; rr(g, 7, 7, 132, 16, 6); g.fill();
    g.fillStyle = '#3a1f22'; rr(g, 9, 9, 128, 12, 5); g.fill();
    const k = clamp(hp / max, 0, 1);
    g.fillStyle = k > 0.3 ? '#74d93f' : '#ff5a4f'; rr(g, 9, 9, Math.max(0, 128 * k), 12, 5); g.fill();
    g.font = '10px "Lilita One", sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff';
    g.strokeStyle = OUT; g.lineWidth = 2.5; g.strokeText(`${fmt(hp)} / ${fmt(max)}`, 73, 19); g.fillText(`${fmt(hp)} / ${fmt(max)}`, 73, 19);
    if (B.L.shieldCap > 0) {
      g.fillStyle = OUT; rr(g, 7, 24, 90, 7, 3); g.fill();
      g.fillStyle = '#6ebeff'; rr(g, 8, 25, 88 * clamp(h.shield / B.L.shieldCap, 0, 1), 5, 2); g.fill();
    }
    const left = B.queue.length + B.enemies.filter(e => !e.dead).length;
    g.textAlign = 'right'; g.font = '12px "Lilita One", sans-serif';
    const txt = `Ennemis : ${left}`;
    g.strokeText(txt, W - 8, 19); g.fillText(txt, W - 8, 19);
  } else if (state === 'prep') {
    g.font = '12px "Lilita One", sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.strokeStyle = OUT; g.lineWidth = 3;
    const pal = CHAPTERS[(run.chapter - 1) % CHAPTERS.length];
    const txt = `Chapitre ${run.chapter} · ${pal.name} — PV ${Math.round(run.hpFrac * 100)} %`;
    g.strokeText(txt, W / 2, 18); g.fillText(txt, W / 2, 18);
  }
}

/* ---------------- fin de vague / fin de partie ---------------- */
function waveWon() {
  const bonus = 4 + run.wave + B.L.waveCash;
  run.cash += bonus;
  run.cleared = run.wave;
  run.hpFrac = clamp(B.hero.hp / B.hero.max + 0.3, 0.05, 1);
  if (run.wave >= WAVES_PER_RUN) { endRun(true); return; }
  run.wave++;
  run.rerolls = 0; run.freeReroll = true;
  rollShop();
  B = null;
  state = 'prep';
  el.game.classList.remove('fighting');
  el.tip.textContent = pick(TIPS);
  banner('Vague terminée !', `+${bonus} $ de bonus · PV +30 %`, 1600);
  sfx('win');
  saveRun();
  renderAll();
}
function loseRun() { endRun(false); }
function endRun(win) {
  state = 'end';
  const c = run.chapter, cm = 1 + 0.6 * (c - 1);
  let coins = 0;
  for (let w = 1; w <= run.cleared; w++) coins += 2 + w;
  coins = Math.round(coins * cm + run.bosses * 8 * cm + (win ? 50 * c : 0));
  meta.coins += coins; meta.runs++; meta.kills += run.kills;
  if (win) meta.wins = (meta.wins || 0) + 1;
  meta.best[c] = Math.max(meta.best[c] || 0, run.cleared);
  if (win && meta.unlocked <= c) { meta.unlocked = c + 1; meta.chapter = c + 1; }
  saveMeta();
  store(SAVE_RUN, null);
  sfx(win ? 'win' : 'lose');
  // écran de résultat
  $('#resEmblem').textContent = win ? '🏆' : '💀';
  const title = $('#resTitle');
  title.textContent = win ? 'Chapitre gagné !' : 'Bataille perdue';
  title.classList.toggle('win', win);
  $('#resWaves').textContent = `Vagues complétées ${run.cleared}/${WAVES_PER_RUN}`;
  const entries = Object.entries(run.dmg).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, e) => s + e[1], 0);
  $('#resDmg').textContent = fmt(total);
  const top = entries[0] ? entries[0][1] : 1;
  $('#resBreak').innerHTML = entries.slice(0, 8).map(([id, v]) =>
    `<div class="brk"><div class="ic" style="background:${RARITY[ITEMS[id].rarity].color}">${iconSVG(id)}</div>` +
    `<div class="bar"><i style="width:${Math.max(3, v / top * 100)}%"></i><span>${ITEMS[id].name}</span></div><b>${fmt(v)}</b></div>`).join('');
  $('#resRewards').innerHTML =
    `<div class="rew"><i class="coin"></i>${coins}<small>pièces</small></div>` +
    `<div class="rew pink">${run.kills}<small>ennemis</small></div>` +
    `<div class="rew blue">${run.bosses}<small>boss</small></div>`;
  el.pause.hidden = true;
  el.result.hidden = false;
}

/* =========================================================
   BASE (menu)
   ========================================================= */
const homeCv = $('#homeHero'), hctx = homeCv.getContext('2d');
function upgCost(u, lvl) { return u.costs ? u.costs[lvl] : Math.round(u.base * Math.pow(u.grow, lvl)); }
function renderHome() {
  $('#homeCoins').textContent = fmt(meta.coins);
  meta.chapter = clamp(meta.chapter, 1, meta.unlocked);
  $('#chNum').textContent = meta.chapter;
  const pal = CHAPTERS[(meta.chapter - 1) % CHAPTERS.length];
  $('#chName').textContent = pal.name + (meta.chapter > CHAPTERS.length ? ' +' : '');
  $('#chPrev').disabled = meta.chapter <= 1;
  $('#chNext').disabled = meta.chapter >= meta.unlocked;
  $('#btnResume').hidden = !load(SAVE_RUN);
  const best = meta.best[meta.chapter] || 0;
  $('#records').innerHTML =
    `<span>Record ch. ${meta.chapter} : <b>${best}/${WAVES_PER_RUN}</b></span><span>Parties : <b>${meta.runs}</b></span>` +
    `<span>Victoires : <b>${meta.wins || 0}</b></span><span>Ennemis vaincus : <b>${fmt(meta.kills)}</b></span>`;
  const box = $('#upgrades');
  box.innerHTML = '';
  for (const u of UPGRADES) {
    const lvl = meta.up[u.id] || 0, maxed = lvl >= u.max, cost = maxed ? 0 : upgCost(u, lvl);
    const row = document.createElement('div');
    row.className = 'upg';
    row.innerHTML = `<div class="upg-ico">${u.icon}</div><div class="upg-txt"><b>${u.name}</b> <small>Niv. ${lvl}/${u.max} · ${u.eff(lvl)}${maxed ? '' : ' → ' + u.eff(lvl + 1)}</small></div>`;
    const b = document.createElement('button');
    b.className = 'btn ' + (maxed ? 'btn-blue' : 'btn-green');
    b.innerHTML = maxed ? 'MAX' : `<i class="coin"></i>${fmt(cost)}`;
    b.disabled = maxed || meta.coins < cost;
    b.onclick = () => {
      if (meta.coins < cost || maxed) return;
      meta.coins -= cost; meta.up[u.id] = lvl + 1; saveMeta(); sfx('merge'); renderHome();
    };
    row.appendChild(b);
    box.appendChild(row);
  }
  $('#btnSound').textContent = meta.sound ? '🔊' : '🔇';
}
function drawHome(t) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (homeCv.width !== 240 * dpr) { homeCv.width = 240 * dpr; homeCv.height = 170 * dpr; }
  const g = hctx;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, homeCv.width, homeCv.height);
  g.setTransform(dpr * 2.1, 0, 0, dpr * 2.1, 0, 0);
  g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.ellipse(57, 74, 40, 8, 0, 0, 7); g.fill();
  drawHero(g, 52, 74, t, {});
  const img = ICON_IMG.pistol;
  if (img.complete && img.naturalWidth) g.drawImage(img, 56, 40 + Math.sin(t * 5) * 1.2, 22, 11);
}
function showHome() {
  state = 'home'; B = null;
  el.game.hidden = true; el.home.hidden = false;
  el.result.hidden = true; el.pause.hidden = true; closeSheet();
  renderHome();
  window.scrollTo(0, 0);
}
function enterGame() {
  el.home.hidden = true; el.game.hidden = false;
  el.game.classList.remove('fighting');
  state = 'prep'; B = null;
  el.tip.textContent = pick(TIPS);
  resizeCanvas();
  renderAll();
  window.scrollTo(0, 0);
  if (!meta.seenHelp) { meta.seenHelp = true; saveMeta(); el.help.hidden = false; }
}

/* ---------------- branchements ---------------- */
$('#btnStart').onclick = () => {
  if (load(SAVE_RUN) && !confirm('Une partie est en cours. L\'abandonner et en commencer une nouvelle ?')) return;
  store(SAVE_RUN, null);
  sfx('click');
  newRun(meta.chapter);
  saveRun();
  enterGame();
};
$('#btnResume').onclick = () => {
  const r = load(SAVE_RUN);
  if (!r) return;
  run = r; sfx('click'); enterGame();
};
$('#chPrev').onclick = () => { meta.chapter--; saveMeta(); renderHome(); sfx('click'); };
$('#chNext').onclick = () => { meta.chapter++; saveMeta(); renderHome(); sfx('click'); };
$('#btnSound').onclick = () => { meta.sound = !meta.sound; saveMeta(); renderHome(); sfx('click'); };
$('#btnHelp').onclick = () => { el.help.hidden = false; };
$('#btnHelpOk').onclick = () => { el.help.hidden = true; sfx('click'); };
$('#btnReset').onclick = () => {
  if (!confirm('Effacer toute ta progression (pièces, améliorations, chapitres) ?')) return;
  store(SAVE_META, null); store(SAVE_RUN, null);
  meta = JSON.parse(JSON.stringify(META_DEFAULT));
  renderHome();
};
el.reroll.onclick = doReroll;
el.play.onclick = startWave;
$('#btnPause').onclick = () => {
  $('#btnSound2').textContent = 'Son : ' + (meta.sound ? 'oui' : 'non');
  el.pause.hidden = false;
};
$('#btnContinue').onclick = () => { el.pause.hidden = true; lastT = performance.now(); };
$('#btnSound2').onclick = () => { meta.sound = !meta.sound; saveMeta(); $('#btnSound2').textContent = 'Son : ' + (meta.sound ? 'oui' : 'non'); };
$('#btnQuit').onclick = () => {
  if (!confirm('Abandonner ? Tu gardes les pièces des vagues déjà gagnées.')) return;
  el.pause.hidden = true;
  endRun(false);
};
$('#btnBack').onclick = () => { showHome(); sfx('click'); };
const speedBtn = $('#btnSpeed');
function renderSpeed() { speedBtn.textContent = `x${meta.speed} ${'▶'.repeat(meta.speed)}`; }
speedBtn.onclick = () => { meta.speed = meta.speed % 3 + 1; saveMeta(); renderSpeed(); sfx('click'); };
renderSpeed();
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state === 'fight') el.pause.hidden = false;
});
let resizeT = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => { if (run && !el.game.hidden) { resizeCanvas(); renderAll(); } }, 120);
});

showHome();
requestAnimationFrame(frame);

// accès console pour tester / équilibrer
window.ARSENAL = {
  get run() { return run; }, get meta() { return meta; }, get B() { return B; }, get state() { return state; },
  startWave, loadout, buyAuto, buyShop, doReroll,
  tick(dt) { if (state === 'fight' && B) update(dt); },
};
