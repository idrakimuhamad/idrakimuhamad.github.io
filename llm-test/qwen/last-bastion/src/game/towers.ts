import { GameState } from './state';
import { TOWERS, towerStats, evolvedStats, SELL_REFUND, STATUS } from '../core/defs';
import { applyStatus } from './status';
import { damageEnemy } from './enemies';
import type { Tower, Enemy, TowerKind, TowerVariant } from '../core/types';

// Pick the enemy in range that is closest to the core (furthest along its lane).
function acquireTarget(g: GameState, t: Tower): Enemy | null {
  let best: Enemy | null = null;
  let bestScore = -1;
  for (const e of g.enemies) {
    if (e.dead || e.state === 'spawn' || e.untargetable) continue;
    const dx = e.pos.x - t.pos.x, dz = e.pos.z - t.pos.z;
    const d2 = dx * dx + dz * dz;
    if (d2 > t.range * t.range) continue;
    const score = e.dist - d2 * 0.01; // prefer advanced enemies, tiebreak closer
    if (score > bestScore) { bestScore = score; best = e; }
  }
  return best;
}

export function updateTowers(g: GameState, dt: number): void {
  const overcharged = g.mods.overchargeT > 0;
  for (const t of g.towers) {
    if (t.flash > 0) t.flash -= dt;
    if (t.evolveAnim > 0) t.evolveAnim -= dt;
    if (t.stormCd > 0) { t.stormCd -= dt; continue; } // stunned by boss / hexed
    if (t.anim > 0) t.anim -= dt;
    // bastion aura: towers within 10 of the bastion (origin) fire faster
    const auraTier = g.bastionTier;
    const aura = auraTier > 0 ? (Math.hypot(t.pos.x, t.pos.z) < 10 ? BASTION_AURAS[auraTier] : 0) : 0;
    const rateMul = (overcharged && Math.hypot(t.pos.x - g.player.pos.x, t.pos.z - g.player.pos.z) < 14 ? 1 / 1.8 : 1) * (1 + aura);
    t.cd -= dt * rateMul;

    // tesla capacitor: charge up over time
    if (t.variant === 'tesla_capacitor') {
      t.charge = Math.min(1, t.charge + dt / 4.5);
    }

    if (t.cd > 0) continue;

    const target = acquireTarget(g, t);
    if (!target) { t.cd = 0; continue; }

    // aim head
    const dx = target.pos.x - t.pos.x, dz = target.pos.z - t.pos.z;
    const desired = Math.atan2(dx, dz);
    let diff = desired - t.headAngle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    t.headAngle += diff * Math.min(1, 12 * dt);

    t.cd = t.interval;
    t.anim = 0.25;
    switch (t.kind) {
      case 'arcane': fireArcane(g, t, target); break;
      case 'frost': fireFrost(g, t); break;
      case 'ember': fireEmber(g, t, target); break;
      case 'tesla': fireTesla(g, t, target); break;
    }
  }
}

const BASTION_AURAS = [0, 0.15, 0.25, 0.4];

function fireArcane(g: GameState, t: Tower, target: Enemy): void {
  const p = g.allocProjectile();
  if (!p) return;
  p.active = true;
  p.kind = 'bolt';
  p.pos = { x: t.pos.x, y: 1.5, z: t.pos.z };
  const dx = target.pos.x - p.pos.x, dz = target.pos.z - p.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  const speed = 26;
  p.vel = { x: (dx / d) * speed, y: 0, z: (dz / d) * speed };
  p.life = 1.2;
  p.dmg = t.damage;
  p.radius = 0.28;
  p.from = t.id;
  p.color = 0x4fd8ff;
  p.pierce = t.variant === 'arcane_prism' ? 99 : (t.level >= 3 ? 1 : 0);
  p.bounces = g.mods.arcaneRicochet > 0 ? 1 : 0;
  p.splash = 0;
  p.hit = [];
  p.arcT = 0; p.trailT = 0;
  // status: void lattice marks + shocks
  if (t.variant === 'arcane_void') {
    p.status = 'mark'; p.statusPower = 1; p.mark = true;
    p.color = 0xb06bff;
  } else { p.status = null; p.mark = false; }
  g.pushFx({ type: 'sound', sound: 'arcane' });
}

function fireFrost(g: GameState, t: Tower): void {
  let hitAny = false;
  const isAurora = t.variant === 'frost_aurora';
  const isRime = t.variant === 'frost_rime';
  const range = isAurora ? t.range + 2 : t.range;
  for (const e of g.enemies) {
    if (e.dead || e.state === 'spawn' || e.untargetable) continue;
    const dx = e.pos.x - t.pos.x, dz = e.pos.z - t.pos.z;
    const d2 = dx * dx + dz * dz;
    if (d2 > range * range) continue;
    hitAny = true;
    const slowAmt = isRime ? 0.7 : isAurora ? 0.55 : (t.level >= 2 ? 0.6 : 0.45);
    const slowDur = t.level >= 3 ? 2.6 : 1.8;
    e.slow = Math.max(e.slow, slowAmt);
    e.slowT = Math.max(e.slowT, slowDur);
    if (g.mods.frostFreeze && e.slow >= 0.6) e.freezeT = Math.max(e.freezeT, 1.2);
    if (isRime && Math.random() < 0.35) e.freezeT = Math.max(e.freezeT, 1.0);
    // status chill
    applyStatus(g, e, 'chill', t.id, isAurora ? 1.2 : 1);
    const dir = { x: (e.pos.x - t.pos.x) / (Math.hypot(dx, dz) || 1), y: 0, z: (e.pos.z - t.pos.z) / (Math.hypot(dx, dz) || 1) };
    damageEnemy(g, e, t.damage, { fromDir: dir });
  }
  if (hitAny) {
    g.pushFx({ type: 'sound', sound: 'frost' });
    if (isAurora) g.pushFx({ type: 'burst', pos: { x: t.pos.x, y: 1, z: t.pos.z }, color: '#6fffe0', value: 12, size: 0.2, speed: 2 });
  }
}

function fireEmber(g: GameState, t: Tower, target: Enemy): void {
  const p = g.allocProjectile();
  if (!p) return;
  p.active = true;
  p.kind = 'ember';
  p.pos = { x: t.pos.x, y: 1.8, z: t.pos.z };
  p.arcFrom = { x: p.pos.x, y: 1.8, z: p.pos.z };
  // lead the target slightly
  p.arcTo = { x: target.pos.x + (target.kbX ?? 0) * 0.1, y: 0, z: target.pos.z + (target.kbZ ?? 0) * 0.1 };
  const d = Math.hypot(p.arcTo.x - p.arcFrom.x, p.arcTo.z - p.arcFrom.z);
  p.arcDur = Math.max(0.5, d / 18);
  p.arcT = 0;
  p.arcH = 3 + d * 0.12;
  p.life = p.arcDur + 0.1;
  p.dmg = t.damage;
  p.radius = 0.4;
  p.from = t.id;
  p.color = t.variant === 'ember_meteor' ? 0xff6b42 : 0xff8c42;
  p.pierce = 0; p.bounces = 0;
  p.splash = t.variant === 'ember_meteor' ? 5.5 : (t.level >= 2 ? 3.4 : 2.6);
  p.hit = [];
  p.trailT = 0;
  // status burn
  p.status = 'burn';
  p.statusPower = t.variant === 'ember_inferno' ? 1.5 : 1;
  g.pushFx({ type: 'sound', sound: 'ember' });
}

function fireTesla(g: GameState, t: Tower, target: Enemy): void {
  const isStorm = t.variant === 'tesla_storm';
  const isCap = t.variant === 'tesla_capacitor';
  // capacitor: only fires when fully charged (nova)
  if (isCap && t.charge < 1) return;
  const chains = isStorm ? 8 : 3 + (t.level >= 2 ? 1 : 0) + g.mods.teslaChainBonus;
  const hitIds = new Set<number>();
  let cur: Enemy | null = target;
  let dmg = t.damage * (isCap ? 2.2 : 1);
  let lastX = t.pos.x, lastY = 1.6, lastZ = t.pos.z;
  g.pushFx({ type: 'sound', sound: isCap ? 'explode' : 'tesla' });
  if (isCap) {
    t.charge = 0;
    g.pushFx({ type: 'shake', amount: 5 });
    g.pushFx({ type: 'burst', pos: { x: t.pos.x, y: 1.6, z: t.pos.z }, color: '#fff04f', value: 30, size: 0.25, speed: 6 });
    g.pushFx({ type: 'text', msg: 'CAPACITOR NOVA', pos: { x: t.pos.x, y: 2.6, z: t.pos.z }, color: '#fff04f' });
  }
  while (cur && hitIds.size < chains) {
    hitIds.add(cur.id);
    const dir = { x: (cur.pos.x - lastX) / (Math.hypot(cur.pos.x - lastX, cur.pos.z - lastZ) || 1), y: 0, z: (cur.pos.z - lastZ) / (Math.hypot(cur.pos.x - lastX, cur.pos.z - lastZ) || 1) };
    const killed = damageEnemy(g, cur, dmg, { fromDir: dir });
    // status shock (storm applies to all, base tesla applies shock too)
    applyStatus(g, cur, 'shock', t.id, isStorm ? 1.2 : 0.8);
    g.pushFx({ type: 'beam', pos: { x: lastX, y: lastY, z: lastZ }, pos2: { x: cur.pos.x, y: 1.2, z: cur.pos.z }, color: isCap ? '#fff04f' : '#d8ff4f' });
    lastX = cur.pos.x; lastY = 1.2; lastZ = cur.pos.z;
    dmg *= 0.75;
    // find next chain target
    let next: Enemy | null = null;
    let bestD = 6.5 * 6.5;
    for (const e of g.enemies) {
      if (e.dead || e.state === 'spawn' || e.untargetable || hitIds.has(e.id)) continue;
      const dx = e.pos.x - cur.pos.x, dz = e.pos.z - cur.pos.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < bestD) { bestD = d2; next = e; }
    }
    cur = next;
    if (killed) { /* continue chain to next */ }
  }
}

// ---------------- placement / upgrade / evolve / sell ----------------
export function canPlace(g: GameState, padId: number, kind: TowerKind): boolean {
  const def = TOWERS[kind];
  if (g.essence < def.cost) return false;
  if (g.towers.some((t) => t.padId === padId && !t.dead)) return false;
  return true;
}

export function placeTower(g: GameState, padId: number, kind: TowerKind): boolean {
  if (!canPlace(g, padId, kind)) return false;
  const def = TOWERS[kind];
  g.addEssence(-def.cost);
  const t = g.spawnTower(kind, padId);
  if (!t) return false;
  const s = towerStats(kind, 1);
  t.range = s.range; t.interval = s.interval; t.damage = s.damage;
  t.invested = def.cost;
  g.pushFx({ type: 'sound', sound: 'place' });
  g.pushFx({ type: 'shake', amount: 1 });
  return true;
}

export function upgradeTower(g: GameState, t: Tower): boolean {
  if (t.level >= 3) return false;
  const def = TOWERS[t.kind];
  const up = def.upgrades[t.level - 1];
  if (g.essence < up.cost) return false;
  g.addEssence(-up.cost);
  t.level++;
  t.invested += up.cost;
  t.hp = t.maxHp;
  const s = towerStats(t.kind, t.level);
  t.range = s.range; t.interval = s.interval; t.damage = s.damage;
  g.pushFx({ type: 'sound', sound: 'upgrade' });
  g.pushFx({ type: 'announce', msg: def.name.toUpperCase() + ' LV' + t.level, sub: up.name, color: '#7dffb0' });
  return true;
}

// Branching evolution: pick one of two level-3 branches.
export function canEvolve(g: GameState, t: Tower, variant: TowerVariant): boolean {
  if (t.level < 3 || t.variant) return false;
  const evo = TOWERS[t.kind].evolutions.find((e) => e.variant === variant);
  if (!evo) return false;
  return g.essence >= evo.cost;
}

export function evolveTower(g: GameState, t: Tower, variant: TowerVariant): boolean {
  if (!canEvolve(g, t, variant)) return false;
  const evo = TOWERS[t.kind].evolutions.find((e) => e.variant === variant)!;
  g.addEssence(-evo.cost);
  t.variant = variant;
  t.invested += evo.cost;
  t.hp = t.maxHp;
  t.evolveAnim = 0.6;
  const s = evolvedStats(variant);
  t.range = s.range; t.interval = s.interval; t.damage = s.damage;
  g.pushFx({ type: 'sound', sound: 'evolve' });
  g.pushFx({ type: 'evolve', pos: { x: t.pos.x, y: 1.5, z: t.pos.z }, color: '#' + evo.color.toString(16).padStart(6, '0') });
  g.pushFx({ type: 'announce', msg: 'EVOLVED', sub: evo.name, color: '#' + evo.color.toString(16).padStart(6, '0') });
  g.pushFx({ type: 'shake', amount: 4 });
  g.pushFx({ type: 'burst', pos: { x: t.pos.x, y: 1.5, z: t.pos.z }, color: '#' + evo.color.toString(16).padStart(6, '0'), value: 40, size: 0.3, speed: 6 });
  g.addUltimateCharge(10);
  return true;
}

export function sellTower(g: GameState, t: Tower): number {
  const refund = Math.round(t.invested * (g.mods.sellRefund > 0 ? g.mods.sellRefund : SELL_REFUND));
  g.addEssence(refund);
  g.removeTower(t);
  g.pushFx({ type: 'sound', sound: 'sell' });
  return refund;
}
