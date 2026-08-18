import type { EnemyDef, EnemyKind, TowerDef, TowerKind, CardDef, WaveDef, WaveGroup, Difficulty, TowerVariant, HazardKind } from './types';

// ---------------- Elemental status system ----------------
// Burn: damage over time. Chill: slow. Shock: vulnerability + chain source. Mark: deep vulnerability.
export const STATUS = {
  burn:   { dps: 6,  dur: 3.0, color: '#ff8c42', hex: 0xff8c42 },
  chill:  { amt: 0.45, dur: 2.2, color: '#8fe8ff', hex: 0x8fe8ff },
  shock:  { dur: 2.0, vuln: 0.2, color: '#d8ff4f', hex: 0xd8ff4f },
  mark:   { dur: 4.0, vuln: 0.3, color: '#4fd8ff', hex: 0x4fd8ff },
  // combo multipliers
  meltBurnMult: 1.8,     // burn applied to a chilled enemy
  detonateRadius: 3.2,   // shock on a burning enemy explodes
  detonateDmg: 26,
  detonateChain: 2,
} as const;

// ---------------- Enemies ----------------
export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  crawler: {
    kind: 'crawler', name: 'Crawler', hp: 42, speed: 3.4, radius: 0.55, damage: 6,
    attackRange: 1.6, attackInterval: 1.0, essence: 4, color: 0x8a4fd8,
  },
  wisp: {
    kind: 'wisp', name: 'Wisp', hp: 20, speed: 6.2, radius: 0.42, damage: 3,
    attackRange: 1.4, attackInterval: 0.8, essence: 3, color: 0x54e8ff, aggroPlayer: true, contact: 4, phase: true,
  },
  brute: {
    kind: 'brute', name: 'Brute', hp: 220, speed: 1.9, radius: 0.95, damage: 18,
    attackRange: 2.2, attackInterval: 1.6, essence: 12, color: 0xd84f5e, charge: true,
  },
  bulwark: {
    kind: 'bulwark', name: 'Bulwark', hp: 300, speed: 1.6, radius: 0.85, damage: 14,
    attackRange: 2.0, attackInterval: 1.4, essence: 14, color: 0x9aa7b8, armor: 4, raidTowers: true, shieldFacing: true,
  },
  shaman: {
    kind: 'shaman', name: 'Shaman', hp: 90, speed: 2.6, radius: 0.6, damage: 8,
    attackRange: 1.8, attackInterval: 1.2, essence: 10, color: 0x6dff9e, heal: 14, healRadius: 7, hex: true,
  },
  colossus: {
    kind: 'colossus', name: 'Colossus', hp: 900, speed: 1.5, radius: 1.5, damage: 30,
    attackRange: 2.8, attackInterval: 2.0, essence: 60, color: 0xb44fd8, raidTowers: true, elite: true, slam: true,
  },
  boss: {
    kind: 'boss', name: 'The Rift Behemoth', hp: 5200, speed: 1.15, radius: 2.6, damage: 45,
    attackRange: 4.0, attackInterval: 2.2, essence: 400, color: 0x6b2fd8, raidTowers: true,
  },
};

// ---------------- Tower evolutions (branching, level-3) ----------------
export const EVOLUTIONS: Record<TowerKind, [import('./types').EvolutionDef, import('./types').EvolutionDef]> = {
  arcane: [
    { variant: 'arcane_prism', name: 'Prism Refraction', icon: '◈', cost: 220, color: 0x9ffcff,
      desc: 'Bolts pierce every enemy in a line and gain +range. Shreds straight lines.' },
    { variant: 'arcane_void', name: 'Void Lattice', icon: '✧', cost: 240, color: 0xb06bff,
      desc: 'Bolts Arcane-Mark targets (+30% damage taken) and apply Shock. Slower, devastating.' },
  ],
  frost: [
    { variant: 'frost_aurora', name: 'Aurora Field', icon: '❋', cost: 230, color: 0x6fffe0,
      desc: 'Pulse becomes a wide chill field that slows and damages a large area, stacking chill.' },
    { variant: 'frost_rime', name: 'Rime Crystal', icon: '❆', cost: 250, color: 0xd8f4ff,
      desc: 'Hardens enemies: heavy chill and periodically FREEZES them solid. Crystal shards on hit.' },
  ],
  ember: [
    { variant: 'ember_inferno', name: 'Inferno Bloom', icon: '✺', cost: 240, color: 0xffb042,
      desc: 'Blasts leave a lingering Inferno that burns everything. Burn stacks and spreads.' },
    { variant: 'ember_meteor', name: 'Meteor Call', icon: '☄', cost: 260, color: 0xff6b42,
      desc: 'Calls down meteors that Shock (stun) on impact. Massive splash, telegraphed.' },
  ],
  tesla: [
    { variant: 'tesla_storm', name: 'Storm Front', icon: 'ϟ', cost: 250, color: 0xeaff7a,
      desc: 'Lightning arcs to many more targets and applies Shock. Storms the whole cluster.' },
    { variant: 'tesla_capacitor', name: 'Capacitor Bank', icon: '⚡', cost: 270, color: 0xfff04f,
      desc: 'Charges up; when full it unleashes a Capacitor Nova — a huge chain burst that Resets.' },
  ],
};

// ---------------- Towers ----------------
export const TOWERS: Record<TowerKind, TowerDef> = {
  arcane: {
    kind: 'arcane', name: 'Arcane Turret', icon: '✦', cost: 60, range: 11, interval: 0.42, damage: 11,
    color: 0x4fd8ff, desc: 'Fast single-target bolts. Cheap and reliable.',
    upgrades: [
      { name: 'Overclocked Coils', desc: '+45% damage, +20% fire rate', cost: 70 },
      { name: 'Prism Head', desc: 'Bolts pierce one extra enemy, +2 range', cost: 120 },
    ],
    evolutions: EVOLUTIONS.arcane,
  },
  frost: {
    kind: 'frost', name: 'Frost Obelisk', icon: '❄', cost: 90, range: 9, interval: 1.5, damage: 14,
    color: 0x8fe8ff, desc: 'Slow pulse that damages and chills enemies in an area.',
    upgrades: [
      { name: 'Deep Cold', desc: 'Stronger chill (60% slow), +1 range', cost: 100 },
      { name: 'Glacial Crown', desc: 'Pulse deals 2x damage, +30% slow duration', cost: 150 },
    ],
    evolutions: EVOLUTIONS.frost,
  },
  ember: {
    kind: 'ember', name: 'Ember Spire', icon: '☄', cost: 110, range: 13, interval: 1.9, damage: 26,
    color: 0xff8c42, desc: 'Lobs explosive arcs that splash-damage groups.',
    upgrades: [
      { name: 'Volatile Payload', desc: '+60% damage, +splash radius', cost: 120 },
      { name: 'Molten Core', desc: '-25% cooldown, bigger blast', cost: 170 },
    ],
    evolutions: EVOLUTIONS.ember,
  },
  tesla: {
    kind: 'tesla', name: 'Tesla Pylon', icon: '⚡', cost: 160, range: 10, interval: 1.1, damage: 22,
    color: 0xd8ff4f, desc: 'Lightning arcs that chain between clustered enemies.',
    upgrades: [
      { name: 'Conductive Lattice', desc: 'Chains to 2 extra enemies', cost: 150 },
      { name: 'Storm Engine', desc: '+50% damage, shorter cooldown', cost: 200 },
    ],
    evolutions: EVOLUTIONS.tesla,
  },
};

export const TOWER_ORDER: TowerKind[] = ['arcane', 'frost', 'ember', 'tesla'];

// Effective per-level tower stats (level 1 = base).
export function towerStats(kind: TowerKind, level: number) {
  const d = TOWERS[kind];
  switch (kind) {
    case 'arcane':
      return level === 1
        ? { range: d.range, interval: d.interval, damage: d.damage }
        : level === 2
          ? { range: d.range, interval: d.interval * 0.8, damage: d.damage * 1.45 }
          : { range: d.range + 2, interval: d.interval * 0.8, damage: d.damage * 1.45 };
    case 'frost':
      return level === 1
        ? { range: d.range, interval: d.interval, damage: d.damage }
        : level === 2
          ? { range: d.range + 1, interval: d.interval, damage: d.damage }
          : { range: d.range + 1, interval: d.interval * 0.85, damage: d.damage * 2 };
    case 'ember':
      return level === 1
        ? { range: d.range, interval: d.interval, damage: d.damage }
        : level === 2
          ? { range: d.range, interval: d.interval, damage: d.damage * 1.6 }
          : { range: d.range + 1, interval: d.interval * 0.75, damage: d.damage * 1.6 };
    case 'tesla':
      return level === 1
        ? { range: d.range, interval: d.interval, damage: d.damage }
        : level === 2
          ? { range: d.range, interval: d.interval, damage: d.damage }
          : { range: d.range + 1, interval: d.interval * 0.7, damage: d.damage * 1.5 };
  }
}

// Evolved (level-3 branch) stats. variant overrides base level-3 numbers.
export function evolvedStats(variant: TowerVariant) {
  switch (variant) {
    case 'arcane_prism':   return { range: 15, interval: 0.34, damage: 15 };
    case 'arcane_void':    return { range: 12, interval: 0.6, damage: 20 };
    case 'frost_aurora':   return { range: 12, interval: 1.2, damage: 18 };
    case 'frost_rime':     return { range: 10, interval: 1.3, damage: 20 };
    case 'ember_inferno':  return { range: 14, interval: 1.6, damage: 34 };
    case 'ember_meteor':   return { range: 16, interval: 2.4, damage: 52 };
    case 'tesla_storm':    return { range: 12, interval: 0.95, damage: 26 };
    case 'tesla_capacitor':return { range: 11, interval: 1.0, damage: 24 };
  }
}

// ---------------- Run upgrade cards ----------------
export const CARDS: CardDef[] = [
  { id: 'atk_speed', name: 'Haste Sigil', icon: '⚔', desc: '+20% attack speed', category: 'guardian' },
  { id: 'pierce', name: 'Piercing Shot', icon: '➹', desc: 'Primary bolts pierce one enemy', category: 'guardian' },
  { id: 'crit', name: 'Rune of Cinders', icon: '✷', desc: '15% chance to deal double damage', category: 'guardian' },
  { id: 'crit_essence', name: 'Essence Leech', icon: '❖', desc: 'Critical hits grant +4 Essence', category: 'economy' },
  { id: 'dash_fire', name: 'Blazing Dash', icon: '🔥', desc: 'Dash leaves burning ground behind', category: 'guardian' },
  { id: 'lance_kb', name: 'Shock Lance', icon: '≋', desc: 'Lance gains knockback', category: 'guardian' },
  { id: 'vitality', name: 'Aegis Plating', icon: '⛨', desc: '+40 max HP and full heal', category: 'guardian' },
  { id: 'swift', name: 'Wind Steps', icon: '🌀', desc: '+12% movement speed', category: 'guardian' },
  { id: 'arcane_ricochet', name: 'Ricochet Prisms', icon: '◇', desc: 'Arcane Turret bolts bounce to one extra target', category: 'tower' },
  { id: 'frost_freeze', name: 'Absolute Zero', icon: '❆', desc: 'Frost Obelisks freeze heavily slowed enemies', category: 'tower' },
  { id: 'ember_fire', name: 'Scorched Earth', icon: '♨', desc: 'Ember Spires leave burning ground on impact', category: 'tower' },
  { id: 'tesla_chain', name: 'Storm Conduit', icon: 'ϟ', desc: 'Tesla Pylons chain to one additional enemy', category: 'tower' },
  { id: 'essence_15', name: 'Essence Attunement', icon: '◈', desc: 'Enemies drop +15% Essence', category: 'economy' },
  { id: 'early_double', name: 'Eager Guardian', icon: '⏵', desc: 'Starting waves early gives double bonus', category: 'economy' },
  { id: 'refund', name: 'Salvage Rites', icon: '♻', desc: 'Selling towers refunds 80% instead of 60%', category: 'economy' },
  { id: 'blink', name: 'Blink Step', icon: '⇢', desc: 'Unlocks Blink: teleport a short distance (F)', category: 'ability' },
  { id: 'overcharge', name: 'Overcharge', icon: '⚛', desc: 'Unlocks Overcharge: nearby towers fire 80% faster for 6s (F)', category: 'ability' },
  // new: player-tower interactions
  { id: 'conduit', name: 'Conduit Blade', icon: '⚔', desc: 'Your melee channels 35% of your best tower\'s damage and its elemental status', category: 'ability' },
  { id: 'resonance', name: 'Resonance', icon: '◉', desc: 'Dashing through an enemy detonates all of its elemental statuses for bonus damage', category: 'ability' },
  { id: 'status_boost', name: 'Elemental Mastery', icon: '✴', desc: 'All elemental statuses (burn, chill, shock, mark) last 40% longer', category: 'tower' },
  { id: 'vuln', name: 'Fracture', icon: '✖', desc: 'Marked and Shocked enemies take 15% more damage than usual', category: 'tower' },
];

// ---------------- Waves (with eras, hazards, warnings) ----------------
const g = (kind: EnemyKind, count: number, interval: number, delay = 0, elite = false): WaveGroup =>
  ({ kind, count, interval, delay, elite });

export const WAVES: WaveDef[] = [
  { label: 'First Stirrings', era: 0, groups: [g('crawler', 8, 1.1)] },
  { label: 'The Swarm Gathers', era: 0, groups: [g('crawler', 12, 0.9), g('wisp', 3, 1.4, 4)] },
  { label: 'Hunters in the Dark', era: 0, groups: [g('wisp', 8, 0.8), g('crawler', 10, 0.9, 2)] },
  { label: 'Heavy Footfalls', era: 1, groups: [g('brute', 3, 3.0), g('crawler', 12, 0.8, 2), g('wisp', 4, 1.0, 6)] },
  { label: 'The Colossus Stirs', era: 1, groups: [g('colossus', 1, 1), g('crawler', 10, 0.8, 3), g('wisp', 6, 0.9, 5)] },
  { label: 'Every Gate Opens', era: 1, hazard: 'rift_storm',
    warning: { msg: 'RIFT STORM INBOUND', sub: 'Void lightning will crack the field — keep your towers scattered', color: '#b44fd8' },
    groups: [g('crawler', 14, 0.7), g('wisp', 8, 0.8, 3), g('brute', 3, 2.6, 6)] },
  { label: 'Iron Procession', era: 2, groups: [g('bulwark', 4, 2.4), g('crawler', 14, 0.7, 2), g('wisp', 6, 0.9, 8)] },
  { label: 'Whispers of the Void', era: 2, hazard: 'ember_tide',
    warning: { msg: 'EMBER TIDE', sub: 'Waves of fire will sweep across the arena — position to dodge the burns', color: '#ff8c42' },
    groups: [g('shaman', 3, 3.0), g('bulwark', 3, 2.6, 4), g('wisp', 10, 0.7, 6), g('crawler', 10, 0.8, 10)] },
  { label: 'The Great Assault', era: 2, groups: [g('brute', 5, 2.2), g('bulwark', 4, 2.2, 3), g('shaman', 3, 3.0, 6), g('crawler', 18, 0.6, 2), g('wisp', 10, 0.7, 8)] },
  { label: 'Elite Vanguard', era: 3, hazard: 'frost_nova',
    warning: { msg: 'FROST NOVA', sub: 'Icy shockwaves will freeze the field — burn and shock melt through it', color: '#8fe8ff' },
    groups: [g('colossus', 2, 6.0), g('bulwark', 5, 2.0, 4), g('shaman', 4, 2.6, 8), g('wisp', 14, 0.6, 10), g('crawler', 16, 0.6, 12)] },
  { label: 'The Rift Behemoth', era: 3, groups: [g('boss', 1, 1, 2)] },
];

export const UPGRADE_AFTER_WAVES = [3, 6, 9]; // present a choice after these waves complete

// ---------------- Environmental eras (battlefield evolution) ----------------
// Each era shifts the arena's palette, fog, and ambient light to show the run progressing.
export const ERAS = [
  { name: 'The Shattered Vale',   fog: 0x0a0e1a, fogDensity: 0.020, ambient: 0x2a3550, ambientI: 0.5,  sun: 0x88aaff, sunI: 0.7,  ground: 0x141a2a },
  { name: 'The Ashen March',      fog: 0x140e12, fogDensity: 0.024, ambient: 0x4a3530, ambientI: 0.45, sun: 0xff9966, sunI: 0.6,  ground: 0x1a1418 },
  { name: 'The Burning Reach',    fog: 0x1a0e0a, fogDensity: 0.028, ambient: 0x5a3520, ambientI: 0.5,  sun: 0xffbb55, sunI: 0.85, ground: 0x20140e },
  { name: 'The Void Threshold',   fog: 0x100a1e, fogDensity: 0.032, ambient: 0x3a2a5a, ambientI: 0.55, sun: 0xbb66ff, sunI: 0.9,  ground: 0x160e24 },
];

// ---------------- Environmental hazards ----------------
export const HAZARDS: Record<HazardKind, { interval: number; radius: number; telegraph: number; dps: number; color: number }> = {
  rift_storm: { interval: 6.5, radius: 4.5, telegraph: 1.6, dps: 0, color: 0xb44fd8 },   // stuns towers briefly
  ember_tide: { interval: 8.0, radius: 5.5, telegraph: 1.8, dps: 14, color: 0xff8c42 },   // burns player + enemies
  frost_nova: { interval: 7.5, radius: 6.0, telegraph: 1.6, dps: 0, color: 0x8fe8ff },    // slows + freezes nearby
};

// ---------------- Bastion tiers (upgradeable/evolving) ----------------
export interface BastionTier { name: string; icon: string; color: number; desc: string; hpBonus: number; aura: number }
export const BASTION_TIERS: BastionTier[] = [
  { name: 'Last Bastion', icon: '⛨', color: 0x4fd8ff, desc: 'The final wall.', hpBonus: 0, aura: 0 },
  { name: 'Warded Bastion', icon: '⛨', color: 0x6dff9e, desc: 'Warded: nearby towers fire 15% faster.', hpBonus: 200, aura: 0.15 },
  { name: 'Aegis Bastion', icon: '⛨', color: 0xffd84f, desc: 'Aegis: reflects 20% damage to attackers, +aura.', hpBonus: 400, aura: 0.25 },
  { name: 'Radiant Bastion', icon: '⛨', color: 0xff8cff, desc: 'Radiant: pulses light that burns nearby, +aura.', hpBonus: 700, aura: 0.4 },
];

// ---------------- Ultimate (chargeable) ----------------
export const ULTIMATE = {
  max: 100,
  gainKill: 1.4,        // charge per enemy killed
  gainBastion: 6,       // charge when bastion takes a hit
  gainPlayer: 3,        // charge when player lands a hit
  duration: 5.0,        // seconds of the unleash
  cd: 20,               // cooldown after unleashing
  radius: 14,           // nova radius (world units)
  damage: 120,          // damage dealt to each enemy in radius
  healBastion: 120,     // bastion HP restored on unleash
  color: '#ffd84f',
} as const;

// ---------------- Difficulty ----------------
export interface DiffMods {
  hp: number; speed: number; count: number; essence: number; prep: number;
  bossHp: number; bossSpeed: number; label: string;
}
export const DIFFICULTY: Record<Difficulty, DiffMods> = {
  easy: { hp: 0.8, speed: 0.92, count: 0.8, essence: 1.25, prep: 35, bossHp: 0.8, bossSpeed: 0.95, label: 'Easy' },
  normal: { hp: 1.0, speed: 1.0, count: 1.0, essence: 1.0, prep: 25, bossHp: 1.0, bossSpeed: 1.0, label: 'Normal' },
  hard: { hp: 1.35, speed: 1.1, count: 1.25, essence: 0.85, prep: 20, bossHp: 1.4, bossSpeed: 1.12, label: 'Hard' },
};

export const START_ESSENCE = 140;
export const BASTION_HP = 1000;
export const PLAYER_HP = 120;
export const SELL_REFUND = 0.6;
export const EARLY_BONUS_PER_SEC = 2; // essence per second of prep remaining
