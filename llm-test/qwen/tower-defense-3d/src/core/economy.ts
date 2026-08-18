// Economy: money, rewards, bonuses. Port of 2D `Q`.

import { DIFFICULTY, ENEMIES } from './defs';
import type { Difficulty, EnemyKind } from './types';

export class Economy {
  money: number;
  killMult: number;
  earlyBonusMult: number;
  totalEarned = 0;
  totalSpent = 0;

  constructor(difficulty: Difficulty) {
    const d = DIFFICULTY[difficulty] ?? DIFFICULTY.normal;
    this.money = d.moneyStart;
    this.killMult = d.killMult;
    this.earlyBonusMult = d.earlyBonusMult;
  }

  canAfford(amount: number): boolean {
    return this.money >= amount;
  }

  spend(amount: number): boolean {
    if (this.money < amount) return false;
    this.money -= amount;
    this.totalSpent += amount;
    return true;
  }

  earn(amount: number): void {
    this.money += amount;
    this.totalEarned += amount;
  }

  killReward(kind: EnemyKind): number {
    return Math.round(ENEMIES[kind].reward * this.killMult);
  }

  /** Early-start bonus for skipping `countdown` seconds. */
  earlyBonus(countdown: number): number {
    return Math.round(countdown * 1.6 * this.earlyBonusMult);
  }
}
