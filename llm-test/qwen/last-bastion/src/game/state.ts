import type {
  Enemy, EnemyKind, Tower, TowerKind, Projectile, FirePatch, Phase, Difficulty,
  RunMods, GameStats, PlayerState, Vec3, EnemyStatus, Ultimate, Cinematic, HazardState, HazardKind,
} from '../core/types';
import { buildArena, type Arena } from '../core/arena';
import { START_ESSENCE, BASTION_HP, PLAYER_HP, HAZARDS, BASTION_TIERS, ULTIMATE } from '../core/defs';
import { ParticleSystem } from './effects';

export interface FxEvent {
  type: 'sound' | 'shake' | 'announce' | 'dmg' | 'text' | 'burst' | 'beam' | 'ultimate' | 'hazard' | 'evolve' | 'cinematic';
  sound?: string;
  amount?: number;
  msg?: string;
  sub?: string;
  pos?: Vec3;
  pos2?: Vec3;
  value?: number;      // burst: particle count; dmg: damage number
  color?: string;
  size?: number;       // burst: base size
  speed?: number;      // burst: speed
  // cinematic
  slowMo?: number;
  slowMoT?: number;
  flash?: number;
  flashColor?: string;
  zoom?: number;
  zoomT?: number;
  shake?: number;
  // hazard
  hazard?: HazardKind;
}

const MAX_ENEMIES = 260;
const MAX_PROJECTILES = 220;
const MAX_TOWERS = 64;
const MAX_PATCHES = 40;

export class GameState {
  arena: Arena = buildArena();

  phase: Phase = 'menu';
  paused = false;
  difficulty: Difficulty = 'normal';

  essence = START_ESSENCE;
  bastionHp = BASTION_HP;
  bastionMaxHp = BASTION_HP;
  bastionFlash = 0;
  bastionTier = 0;      // index into BASTION_TIERS
  bastionAuraT = 0;     // radiant pulse timer
  bastionReflect = false;

  wave = 0;
  prepTime = 0;
  prepTotal = 25;
  spawnPaused = false;
  spawnQueue: { kind: EnemyKind; t: number; elite: boolean; lane: number }[] = [];
  spawnTimer = 0;
  enemiesAlive = 0;
  era = 0;              // current battlefield era (0..3)
  eraBlend = 1;         // 0..1 transition progress toward current era

  enemies: Enemy[] = [];
  towers: Tower[] = [];
  projectiles: Projectile[] = [];
  patches: FirePatch[] = [];
  nextId = 1;

  player: PlayerState = makePlayer();
  mods: RunMods = makeMods();
  stats: GameStats = { kills: 0, essenceEarned: 0, towersBuilt: 0, damageDealt: 0, time: 0 };

  gameSpeed = 1;
  time = 0;

  fx: FxEvent[] = [];
  bossRef: Enemy | null = null;
  particles = new ParticleSystem();

  ultimate: Ultimate = { charge: 0, max: ULTIMATE.max, active: false, activeT: 0, cd: 0 };
  cinematic: Cinematic = { slowMo: 1, slowMoT: 0, shake: 0, flash: 0, flashColor: '#ffffff', zoom: 1, zoomT: 0 };
  hazard: HazardState | null = null;

  buildMode = false;
  buildSelection: TowerKind | null = null;
  selectedTowerId = -1;
  acquiredCards: string[] = [];
  pendingCards: { id: string; name: string; icon: string; desc: string; category: string }[] = [];

  debug = { showPaths: false, showRanges: false, spawnPaused: false };

  enemyPool: Enemy[] = [];
  projectilePool: Projectile[] = [];

  constructor() {
    for (let i = 0; i < MAX_ENEMIES; i++) this.enemyPool.push(makeEnemyShell());
    for (let i = 0; i < MAX_PROJECTILES; i++) this.projectilePool.push(makeProjectileShell());
  }

  pushFx(e: FxEvent) { this.fx.push(e); }
  drainFx(): FxEvent[] { const f = this.fx; this.fx = []; return f; }

  addEssence(n: number) {
    this.essence += n;
    this.stats.essenceEarned += Math.max(0, n);
  }

  // Ultimate charge helpers
  addUltimateCharge(n: number) {
    const u = this.ultimate;
    if (u.active) return;
    u.charge = Math.min(u.max, u.charge + n);
  }

  spawnEnemy(kind: EnemyKind, lane: number, elite = false): Enemy | null {
    const e = this.enemyPool.find((x) => !x.active);
    if (!e) return null;
    const a = this.arena.lanes[lane];
    const p = a.points[0];
    e.active = true;
    e.id = this.nextId++;
    e.kind = kind;
    e.elite = elite;
    e.pos = { x: p.x, y: 0, z: p.z };
    e.lane = lane;
    e.dist = 0;
    e.lateral = 0;
    e.lateralTarget = (Math.random() - 0.5) * 4;
    e.state = 'spawn';
    e.spawnT = 0.4;
    e.attackCd = 0;
    e.target = null;
    e.targetId = -1;
    e.slow = 0;
    e.slowT = 0;
    e.freezeT = 0;
    e.buffT = 0;
    e.flash = 0;
    e.dead = false;
    e.healTick = 0;
    e.hexCd = 3 + Math.random() * 3;
    e.status = makeStatus();
    // boss
    e.summonCd = 4;
    e.boltCd = 3;
    e.shieldCd = 8;
    e.shieldT = 0;
    e.enraged = false;
    e.phase = 1;
    // disruptive
    e.phaseT = 0;
    e.phaseCd = 2 + Math.random() * 2;
    e.untargetable = false;
    e.chargeState = 'idle';
    e.chargeT = 0;
    e.chargeDir = { x: 0, y: 0, z: 0 };
    e.chargeCd = 3 + Math.random() * 3;
    e.hexTargetId = -1;
    e.slamCd = 4;
    e.slamTelegraph = 0;
    this.enemies.push(e);
    this.enemiesAlive++;
    return e;
  }

  killEnemy(e: Enemy) {
    if (e.dead) return;
    e.dead = true;
    e.active = false;
    this.enemiesAlive--;
    this.stats.kills++;
    const idx = this.enemies.indexOf(e);
    if (idx >= 0) this.enemies.splice(idx, 1);
    this.enemyPool.push(e);
    if (this.bossRef === e) this.bossRef = null;
  }

  spawnTower(kind: TowerKind, padId: number): Tower | null {
    if (this.towers.length >= MAX_TOWERS) return null;
    const pad = this.arena.pads[padId];
    const t: Tower = {
      id: this.nextId++, kind, level: 1, variant: null,
      pos: { x: pad.pos.x, y: 0, z: pad.pos.z },
      padId, range: 0, interval: 0, damage: 0, cd: 0,
      hp: 140, maxHp: 140, headAngle: 0, invested: 0, flash: 0, dead: false, stormCd: 0, stormCdMax: 0,
      anim: 0, evolveAnim: 0, charge: 0,
    };
    this.towers.push(t);
    this.stats.towersBuilt++;
    return t;
  }

  removeTower(t: Tower) {
    t.dead = true;
    const idx = this.towers.indexOf(t);
    if (idx >= 0) this.towers.splice(idx, 1);
    if (this.selectedTowerId === t.id) this.selectedTowerId = -1;
  }

  allocProjectile(): Projectile | null {
    return this.projectilePool.find((x) => !x.active) ?? null;
  }

  addPatch(pos: Vec3, radius: number, life: number, dps: number) {
    if (this.patches.length >= MAX_PATCHES) this.patches.shift();
    const p: FirePatch = { pos: { x: pos.x, y: pos.y, z: pos.z }, radius, life, maxLife: life, dps, tick: 0 };
    this.patches.push(p);
  }

  // Environmental hazard for the current wave
  setHazard(kind: HazardKind | undefined) {
    if (!kind) { this.hazard = null; return; }
    const h = HAZARDS[kind];
    this.hazard = {
      kind, active: true, t: h.interval, interval: h.interval,
      pos: { x: 0, y: 0, z: 0 }, pos2: { x: 0, y: 0, z: 0 },
      radius: h.radius, telegraph: h.telegraph, struck: false,
    };
  }
}

function makeStatus(): EnemyStatus {
  return { burnT: 0, burnDps: 0, chillT: 0, chillAmt: 0, shockT: 0, markT: 0, burnSrc: -1, chillSrc: -1, shockSrc: -1 };
}

function makePlayer(): PlayerState {
  return {
    pos: { x: 0, y: 0, z: 8 }, aim: { x: 0, y: 0, z: 0 },
    hp: PLAYER_HP, maxHp: PLAYER_HP, speed: 8.5,
    fireCd: 0, lanceCd: 0, dashCd: 0, dashT: 0, dashDir: { x: 0, y: 0, z: 0 },
    invulnT: 0, hurtT: 0, facing: 0, dead: false,
    meleeCd: 0, meleeAnim: 0, meleeAngle: 0,
    conduitTowerId: -1,
  };
}

function makeMods(): RunMods {
  return {
    attackSpeed: 1, pierce: 0, critChance: 0, critEssence: false, dashFire: false,
    lanceKnockback: false, maxHpBonus: 0, moveSpeed: 1,
    arcaneRicochet: 0, frostFreeze: false, emberFire: false, teslaChainBonus: 0,
    essenceMult: 1, earlyBonusMult: 1, sellRefund: 0.6,
    blink: false, overcharge: false, overchargeT: 0, overchargeCd: 0,
    conduit: 0, resonance: false, statusBoost: 1, vulnBonus: 0,
  };
}

function makeEnemyShell(): Enemy {
  return {
    id: 0, kind: 'crawler', pos: { x: 0, y: 0, z: 0 }, hp: 0, maxHp: 0, speed: 0, radius: 0.5,
    lane: 0, dist: 0, lateral: 0, lateralTarget: 0, state: 'spawn', spawnT: 0, attackCd: 0,
    target: null, targetId: -1, slow: 0, slowT: 0, freezeT: 0, buffT: 0, flash: 0, dead: false,
    elite: false, status: makeStatus(), healTick: 0, hexCd: 0,
    summonCd: 0, boltCd: 0, shieldCd: 0, shieldT: 0, enraged: false, phase: 1,
    phaseT: 0, phaseCd: 0, untargetable: false, chargeState: 'idle', chargeT: 0,
    chargeDir: { x: 0, y: 0, z: 0 }, chargeCd: 0, hexTargetId: -1, slamCd: 0, slamTelegraph: 0,
    active: false, facing: 0,
  } as Enemy;
}

function makeProjectileShell(): Projectile {
  return {
    active: false, kind: 'bolt', pos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 },
    life: 0, dmg: 0, radius: 0.3, from: -1, pierce: 0, bounces: 0, splash: 0, color: 0xffffff,
    hit: [], arcT: 0, arcFrom: { x: 0, y: 0, z: 0 }, arcTo: { x: 0, y: 0, z: 0 }, arcDur: 0, arcH: 0, trailT: 0,
    status: null, statusPower: 0, mark: false,
  };
}
