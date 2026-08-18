// Shared types for Last Bastion. Game logic is three.js-free; rendering reads these structures.

export interface Vec3 { x: number; y: number; z: number }

export type EnemyKind = 'crawler' | 'wisp' | 'brute' | 'bulwark' | 'shaman' | 'colossus' | 'boss';
export type TowerKind = 'arcane' | 'frost' | 'ember' | 'tesla';
export type Phase = 'menu' | 'prep' | 'combat' | 'upgrade' | 'paused' | 'gameover' | 'victory';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type AbilityKey = 'Q' | 'E' | 'R' | 'F';

// ---------------- Elemental status system ----------------
export type StatusKind = 'burn' | 'chill' | 'shock' | 'mark';

export interface EnemyStatus {
  burnT: number;      // seconds of burn remaining
  burnDps: number;    // damage per second while burning
  chillT: number;     // seconds of chill (slow) remaining
  chillAmt: number;   // 0..1 slow strength
  shockT: number;     // seconds of shock (vulnerability + chain source) remaining
  markT: number;      // seconds of arcane mark (vulnerability) remaining
  burnSrc: number;    // tower id that applied burn (for combo attribution)
  chillSrc: number;
  shockSrc: number;
}

export interface EnemyDef {
  kind: EnemyKind;
  name: string;
  hp: number;
  speed: number;
  radius: number;
  damage: number;          // damage per hit to bastion / towers / player
  attackRange: number;
  attackInterval: number;
  essence: number;
  color: number;
  armor?: number;          // flat reduction per hit (resists rapid low-damage attacks)
  raidTowers?: boolean;    // will stop and attack towers in its way
  aggroPlayer?: boolean;   // will attack the player if close
  contact?: number;        // contact damage to player
  heal?: number;           // shaman: hp/s healed to allies in radius
  healRadius?: number;
  elite?: boolean;
  // disruptive behaviour flags
  shieldFacing?: boolean;  // bulwark: takes reduced damage from the front
  phase?: boolean;         // wisp: periodically becomes untargetable
  charge?: boolean;        // brute: telegraphed charge
  hex?: boolean;           // shaman: curses a tower (slows its fire rate)
  slam?: boolean;          // colossus: AoE slam
}

export interface TowerUpgradeDef { name: string; desc: string; cost: number }

// Branching evolution: each tower kind has two level-3 evolutions.
export type TowerVariant =
  | 'arcane_prism' | 'arcane_void'
  | 'frost_aurora' | 'frost_rime'
  | 'ember_inferno' | 'ember_meteor'
  | 'tesla_storm' | 'tesla_capacitor';

export interface EvolutionDef {
  variant: TowerVariant;
  name: string;
  icon: string;
  cost: number;
  desc: string;
  color: number;
}

export interface TowerDef {
  kind: TowerKind;
  name: string;
  icon: string;
  cost: number;
  range: number;
  interval: number;
  damage: number;
  color: number;
  desc: string;
  upgrades: [TowerUpgradeDef, TowerUpgradeDef];
  evolutions: [EvolutionDef, EvolutionDef];
}

export interface CardDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: 'guardian' | 'tower' | 'economy' | 'ability';
}

export interface Enemy {
  id: number;
  kind: EnemyKind;
  pos: Vec3;
  hp: number;
  maxHp: number;
  speed: number;
  radius: number;
  lane: number;        // lane index
  dist: number;        // distance travelled along lane
  lateral: number;     // smoothed lateral offset from path center
  lateralTarget: number;
  state: 'spawn' | 'walk' | 'attack' | 'frozen';
  spawnT: number;
  attackCd: number;
  target: 'bastion' | 'tower' | 'player' | null;
  targetId: number;
  slow: number;        // 0..1 speed reduction
  slowT: number;
  freezeT: number;
  buffT: number;       // shaman speed buff
  flash: number;
  dead: boolean;
  elite: boolean;
  status: EnemyStatus; // elemental status stack
  // shaman
  healTick: number;
  hexCd: number;       // shaman: time until next tower hex
  // boss
  summonCd: number;
  boltCd: number;
  shieldCd: number;
  shieldT: number;
  enraged: boolean;
  phase: number;       // boss phase 1..3
  // disruptive behaviours
  phaseT: number;      // wisp: untargetable timer
  phaseCd: number;     // wisp: time until next phase
  untargetable: boolean;
  chargeState: 'idle' | 'windup' | 'charge';
  chargeT: number;
  chargeDir: Vec3;
  chargeCd: number;
  hexTargetId: number; // shaman: tower id currently cursed
  slamCd: number;      // colossus
  slamTelegraph: number;
  active?: boolean;
  facing?: number;
  kbX?: number;
  kbZ?: number;
}

export interface Tower {
  id: number;
  kind: TowerKind;
  level: number;       // 1..3
  variant: TowerVariant | null; // set once evolved (level 3 branch)
  pos: Vec3;
  padId: number;
  range: number;
  interval: number;
  damage: number;
  cd: number;
  hp: number;
  maxHp: number;
  headAngle: number;
  invested: number;
  flash: number;
  dead: boolean;
  stormCd: number;     // shaman hex: fire-rate penalty timer
  stormCdMax: number;
  anim: number;        // generic animation timer
  evolveAnim: number;  // evolution transformation animation timer
  charge: number;      // tesla capacitor: 0..1 charge
}

export interface PlayerState {
  pos: Vec3;
  aim: Vec3;
  hp: number;
  maxHp: number;
  speed: number;
  fireCd: number;
  lanceCd: number;
  dashCd: number;
  dashT: number;
  dashDir: Vec3;
  invulnT: number;
  hurtT: number;
  facing: number;
  dead: boolean;
  // auto basic attack (melee)
  meleeCd: number;
  meleeAnim: number;
  meleeAngle: number;
  // conduit: channel a % of the best tower's damage + status
  conduitTowerId: number;
}

export interface Projectile {
  active: boolean;
  kind: 'bolt' | 'lance' | 'ember' | 'void' | 'beam';
  pos: Vec3;
  vel: Vec3;
  life: number;
  dmg: number;
  radius: number;
  from: number;        // -1 player, -2 boss, tower id otherwise
  pierce: number;
  bounces: number;
  splash: number;      // 0 = no splash
  color: number;
  hit: number[];       // enemy ids already hit
  // ember arc
  arcT: number;
  arcFrom: Vec3;
  arcTo: Vec3;
  arcDur: number;
  arcH: number;
  trailT: number;
  // status carried by the projectile (applied on hit)
  status: StatusKind | null;
  statusPower: number;
  mark: boolean;       // applies arcane mark
}

export interface FirePatch { pos: Vec3; radius: number; life: number; maxLife: number; dps: number; tick: number }

export type HazardKind = 'rift_storm' | 'ember_tide' | 'frost_nova';

export interface WaveGroup { kind: EnemyKind; count: number; interval: number; delay: number; elite?: boolean }
export interface WaveDef {
  groups: WaveGroup[];
  label: string;
  era: number;         // battlefield era (drives environmental evolution)
  hazard?: HazardKind; // environmental hazard active during this wave
  warning?: { msg: string; sub: string; color: string }; // pre-wave warning banner
}

export interface HazardState {
  kind: HazardKind;
  active: boolean;
  t: number;           // phase timer
  interval: number;    // seconds between strikes
  pos: Vec3;           // current strike / sweep position
  pos2: Vec3;
  radius: number;
  telegraph: number;   // seconds of telegraph before it lands
  struck: boolean;     // whether the current telegraph point has been picked
}

export interface RunMods {
  attackSpeed: number;   // multiplier
  pierce: number;
  critChance: number;
  critEssence: boolean;
  dashFire: boolean;
  lanceKnockback: boolean;
  maxHpBonus: number;
  moveSpeed: number;     // multiplier
  arcaneRicochet: number;
  frostFreeze: boolean;
  emberFire: boolean;
  teslaChainBonus: number;
  essenceMult: number;
  earlyBonusMult: number;
  sellRefund: number;
  blink: boolean;
  overcharge: boolean;
  overchargeT: number;   // active duration remaining
  overchargeCd: number;
  // new player-tower interactions
  conduit: number;       // 0..1: melee channels % of best tower damage + its status
  resonance: boolean;    // dashing through an enemy detonates its statuses
  statusBoost: number;   // multiplier on status durations
  vulnBonus: number;     // extra vulnerability from Fracture (added to shock/mark)
}

export interface Ultimate {
  charge: number;   // 0..max
  max: number;
  active: boolean;
  activeT: number;  // seconds of the unleash remaining
  cd: number;
}

export interface Cinematic {
  slowMo: number;    // time-scale target (1 = normal)
  slowMoT: number;   // seconds to hold slow-mo
  shake: number;     // camera shake amount
  flash: number;     // 0..1 white flash
  flashColor: string;
  zoom: number;      // camera zoom factor (1 = normal)
  zoomT: number;
}

export interface GameStats { kills: number; essenceEarned: number; towersBuilt: number; damageDealt: number; time: number }

export interface SaveData {
  settings: { music: number; sfx: number; quality: 'low' | 'medium' | 'high' };
  difficulty: Difficulty;
  bestWave: number;
  discovered: string[];
}
