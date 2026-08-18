// Run statistics. Port of 2D `ve`.

export class Stats {
  data: StatsData = this.empty();

  empty(): StatsData {
    return {
      enemiesSpawned: 0,
      enemiesDefeated: 0,
      enemiesLeaked: 0,
      towersBuilt: 0,
      towersSold: 0,
      moneyEarned: 0,
      moneySpent: 0,
      totalDamageDealt: 0,
      highestWave: 0,
      score: 0,
    };
  }

  reset(): void {
    this.data = this.empty();
  }

  spawnEnemy(): void { this.data.enemiesSpawned++; }
  defeatEnemy(score: number): void {
    this.data.enemiesDefeated++;
    this.data.score += score;
  }
  leakEnemy(): void { this.data.enemiesLeaked++; }
  buildTower(): void { this.data.towersBuilt++; }
  sellTower(): void { this.data.towersSold++; }
  addMoneyEarned(amount: number): void { this.data.moneyEarned += amount; }
  addMoneySpent(amount: number): void { this.data.moneySpent += amount; }
  addDamage(amount: number): void { this.data.totalDamageDealt += amount; }
  setWave(wave: number): void {
    if (wave > this.data.highestWave) this.data.highestWave = wave;
  }
}

export interface StatsData {
  enemiesSpawned: number;
  enemiesDefeated: number;
  enemiesLeaked: number;
  towersBuilt: number;
  towersSold: number;
  moneyEarned: number;
  moneySpent: number;
  totalDamageDealt: number;
  highestWave: number;
  score: number;
}
