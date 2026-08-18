import { GameState } from './state';
import { CARDS } from '../core/defs';
import type { CardDef } from '../core/types';

// Pick 3 distinct random cards (weighted: avoid duplicates already taken where possible).
export function rollCards(g: GameState): CardDef[] {
  const taken = new Set(g.acquiredCards);
  const pool = CARDS.filter((c) => !taken.has(c.id));
  const fallback = CARDS;
  const src2 = pool.length >= 3 ? pool : fallback;
  const out: CardDef[] = [];
  const bag = [...src2];
  for (let i = 0; i < 3 && bag.length > 0; i++) {
    const idx = Math.floor(Math.random() * bag.length);
    out.push(bag.splice(idx, 1)[0]);
  }
  return out;
}

export function applyCard(g: GameState, id: string): void {
  const m = g.mods;
  g.acquiredCards.push(id);
  switch (id) {
    case 'atk_speed': m.attackSpeed *= 1.2; break;
    case 'pierce': m.pierce += 1; break;
    case 'crit': m.critChance = Math.min(0.6, m.critChance + 0.15); break;
    case 'crit_essence': m.critEssence = true; break;
    case 'dash_fire': m.dashFire = true; break;
    case 'lance_kb': m.lanceKnockback = true; break;
    case 'vitality':
      m.maxHpBonus += 40;
      g.player.maxHp += 40;
      g.player.hp = g.player.maxHp;
      break;
    case 'swift': m.moveSpeed *= 1.12; break;
    case 'arcane_ricochet': m.arcaneRicochet += 1; break;
    case 'frost_freeze': m.frostFreeze = true; break;
    case 'ember_fire': m.emberFire = true; break;
    case 'tesla_chain': m.teslaChainBonus += 1; break;
    case 'essence_15': m.essenceMult *= 1.15; break;
    case 'early_double': m.earlyBonusMult *= 2; break;
    case 'refund': m.sellRefund = 0.8; break;
    case 'blink': m.blink = true; break;
    case 'overcharge': m.overcharge = true; break;
    case 'conduit': m.conduit = Math.max(m.conduit, 0.35); break;
    case 'resonance': m.resonance = true; break;
    case 'status_boost': m.statusBoost *= 1.4; break;
    case 'vuln': m.vulnBonus += 0.15; break;
  }
}
