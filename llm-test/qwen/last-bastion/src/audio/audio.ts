// Lightweight WebAudio synth. No external assets.
export class AudioSys {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicNodes: OscillatorNode[] = [];
  sfxVolume = 0.7;
  musicVolume = 0.4;
  private lastPlay: Record<string, number> = {};

  // ---------------- Adaptive layered music ----------------
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private droneTarget = 0.12;
  private musicTimer: number | null = null;
  private step = 0;
  private nextNoteTime = 0;
  private intensity = -1;   // -1 = not started, 0 = ambient, 1 = combat, 2 = boss
  private era = 0;

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.master);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume * 0.35;
    this.musicGain.connect(this.master);
    this.startMusic();
  }

  setVolumes(sfx: number, music: number) {
    this.sfxVolume = sfx;
    this.musicVolume = music;
    if (this.sfxGain) this.sfxGain.gain.value = sfx * 1.25;
    if (this.musicGain) this.musicGain.gain.value = music * 0.35;
  }

  private startMusic() {
    if (!this.ctx || !this.musicGain) return;
    // Ambient drone bed: three detuned oscillators through a slowly-breathing lowpass.
    // Its pitch and brightness shift with the battlefield era (see setMusicMood).
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 260;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.12;
    for (const f of [55, 82.5, 110.3]) {
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = this.ctx.createGain();
      g.gain.value = 1;
      o.connect(g);
      g.connect(droneGain);
      o.start();
      this.musicNodes.push(o);
    }
    droneGain.connect(filter);
    filter.connect(this.musicGain);
    this.musicNodes.push(lfo);
    this.droneFilter = filter;
    this.droneGain = droneGain;
    // Start the lookahead scheduler for the combat layers.
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), 90);
  }

  // Adaptive mood: intensity 0 = prep/ambient, 1 = combat, 2 = boss.
  // Era shifts the drone's pitch root and filter brightness so the whole
  // soundtrack evolves as the battlefield does.
  setMusicMood(intensity: number, era: number) {
    if (intensity === this.intensity && era === this.era) return;
    this.intensity = intensity;
    this.era = era;
    if (!this.ctx || !this.droneFilter || !this.droneGain) return;
    const t = this.ctx.currentTime;
    // era roots: A1 (55Hz) base, each era transposes the drone up a step
    const roots = [55, 61.74, 65.41, 73.42];
    const root = roots[era % roots.length];
    const target = 260 + era * 110 + intensity * 160;
    this.droneFilter.frequency.cancelScheduledValues(t);
    this.droneFilter.frequency.setTargetAtTime(target, t, 1.5);
    this.droneTarget = intensity === 2 ? 0.17 : intensity === 1 ? 0.14 : 0.11;
    this.droneGain.gain.cancelScheduledValues(t);
    this.droneGain.gain.setTargetAtTime(this.droneTarget, t, 1.2);
    // retune the drone oscillators to the new root (they run as 1, 1.5, 2 ratios)
    const ratios = [1, 1.5, 2.005];
    for (let i = 0; i < Math.min(3, this.musicNodes.length); i++) {
      const o = this.musicNodes[i];
      o.frequency.cancelScheduledValues(t);
      o.frequency.setTargetAtTime(root * ratios[i], t, 1.5);
    }
  }

  // ---------------- Layered combat sequencer ----------------
  // 16th-note grid at ~100 BPM. Layers gate on intensity:
  //   pulse  (low thump)      — combat & boss
  //   arpeggio (plucked notes) — combat & boss, denser on boss
  //   stab   (dissonant hit)  — boss only, on downbeats
  private scheduleMusic() {
    if (!this.ctx || !this.musicGain || this.intensity < 0) return;
    const stepDur = 60 / 100 / 4; // 16ths at 100bpm
    while (this.nextNoteTime < this.ctx.currentTime + 0.25) {
      const s = this.step % 16;
      const t = this.nextNoteTime;
      if (this.intensity >= 1 && (s % 4 === 0)) this.musicThump(t, this.intensity === 2 ? 0.30 : 0.20);
      if (this.intensity >= 1 && (s % 2 === 0)) this.musicNote(t, this.arpeggioNote(s), this.intensity === 2 ? 0.10 : 0.07);
      if (this.intensity === 2 && s === 0) this.musicStab(t);
      this.step++;
      this.nextNoteTime += stepDur;
    }
  }

  private arpeggioNote(s: number): number {
    // minor pentatonic over the era root; boss mode adds a tritone accent on beat 3
    const roots = [220, 246.9, 261.6, 293.7];
    const root = roots[this.era % roots.length];
    const scale = [1, 1.2, 1.5, 1.8, 2];
    if (this.intensity === 2 && s === 8) return root * 1.41; // tritone sting
    return root * scale[(s / 2) % scale.length];
  }

  private musicThump(t: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(72, t);
    o.frequency.exponentialRampToValueAtTime(36, t + 0.16);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + 0.2);
  }

  private musicNote(t: number, freq: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const o = this.ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + 0.16);
  }

  private musicStab(t: number) {
    if (!this.ctx || !this.musicGain) return;
    for (const f of [110, 155.6, 220]) {
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const flt = this.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.value = 900;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.09, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(flt); flt.connect(g); g.connect(this.musicGain);
      o.start(t); o.stop(t + 0.45);
    }
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number, delay = 0) {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, filterFreq: number, vol: number, delay = 0, type: BiquadFilterType = 'lowpass') {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.sfxGain);
    src.start(t0);
  }

  play(name: string) {
    if (!this.ctx) return;
    // rate limit identical sounds
    const now = performance.now();
    const last = this.lastPlay[name] ?? 0;
    const minGap = name === 'hit' || name === 'shoot' || name === 'arcane' ? 45 : 70;
    if (now - last < minGap) return;
    this.lastPlay[name] = now;
    switch (name) {
      case 'shoot': this.tone(720, 0.07, 'square', 0.14, 380); break;
      case 'lance': this.tone(300, 0.18, 'sawtooth', 0.14, 90); this.noise(0.12, 1800, 0.08); break;
      case 'lance_hit': this.tone(180, 0.12, 'square', 0.14, 60); this.noise(0.1, 900, 0.1); break;
      case 'hit': this.tone(340, 0.05, 'square', 0.11, 200); break;
      case 'arcane': this.tone(980, 0.06, 'square', 0.11, 620); break;
      case 'frost': this.tone(1400, 0.25, 'triangle', 0.09, 2200); this.tone(1900, 0.3, 'sine', 0.05, 2600, 0.05); break;
      case 'ember': this.noise(0.2, 700, 0.1); this.tone(140, 0.2, 'sine', 0.08, 60); break;
      case 'explode': this.noise(0.4, 500, 0.22); this.tone(90, 0.35, 'sine', 0.18, 40); break;
      case 'tesla': this.noise(0.08, 4000, 0.1, 0, 'highpass'); this.tone(2400, 0.07, 'square', 0.06, 900); break;
      case 'enemy_die': this.tone(500, 0.14, 'triangle', 0.1, 120); this.noise(0.1, 1200, 0.06); break;
      case 'boss_die': this.noise(1.2, 400, 0.3); this.tone(70, 1.0, 'sine', 0.25, 30); break;
      case 'spawn': this.tone(220, 0.3, 'sine', 0.08, 440); break;
      case 'wave_start': this.tone(110, 0.5, 'sawtooth', 0.14); this.tone(165, 0.5, 'sawtooth', 0.1, undefined, 0.05); this.tone(220, 0.6, 'sawtooth', 0.1, undefined, 0.1); break;
      case 'wave_clear': this.tone(440, 0.12, 'triangle', 0.12); this.tone(554, 0.12, 'triangle', 0.12, undefined, 0.1); this.tone(659, 0.2, 'triangle', 0.12, undefined, 0.2); break;
      case 'victory': [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.35, 'triangle', 0.14, undefined, i * 0.18)); break;
      case 'defeat': [330, 262, 196, 131].forEach((f, i) => this.tone(f, 0.5, 'sawtooth', 0.12, undefined, i * 0.25)); break;
      case 'place': this.tone(180, 0.08, 'square', 0.12, 120); this.noise(0.06, 800, 0.08); break;
      case 'upgrade': this.tone(520, 0.1, 'triangle', 0.12); this.tone(780, 0.16, 'triangle', 0.12, undefined, 0.09); break;
      case 'sell': this.tone(600, 0.08, 'triangle', 0.1); this.tone(400, 0.12, 'triangle', 0.1, undefined, 0.07); break;
      case 'tower_hit': this.tone(120, 0.1, 'square', 0.1, 70); break;
      case 'tower_destroy': this.noise(0.5, 600, 0.2); this.tone(100, 0.4, 'sine', 0.16, 45); break;
      case 'bastion_hit': this.tone(70, 0.3, 'sine', 0.2, 40); this.noise(0.15, 400, 0.1); break;
      case 'player_hit': this.tone(240, 0.15, 'sawtooth', 0.14, 90); break;
      case 'dash': this.noise(0.15, 2500, 0.08, 0, 'highpass'); break;
      case 'swing': this.noise(0.09, 2600, 0.07, 0, 'bandpass'); this.tone(240, 0.08, 'triangle', 0.06, 520); break;
      case 'slam': this.noise(0.5, 350, 0.28); this.tone(60, 0.45, 'sine', 0.24, 30); break;
      case 'volley': for (let i = 0; i < 5; i++) this.tone(800 + i * 60, 0.05, 'square', 0.06, 500, i * 0.04); break;
      case 'blink': this.tone(1200, 0.12, 'sine', 0.1, 2400); break;
      case 'overcharge': this.tone(200, 0.6, 'sawtooth', 0.1, 600); break;
      case 'heal': this.tone(880, 0.15, 'sine', 0.06, 1320); break;
      case 'void_bolt': this.tone(160, 0.25, 'sawtooth', 0.1, 60); break;
      case 'boss_warn': this.tone(55, 1.2, 'sawtooth', 0.16); this.tone(58, 1.2, 'sawtooth', 0.12, undefined, 0.05); break;
      case 'boss_spawn': this.noise(1.0, 300, 0.25); this.tone(45, 0.9, 'sine', 0.22, 30); break;
      case 'boss_enrage': this.tone(200, 0.8, 'sawtooth', 0.16, 60); this.noise(0.6, 800, 0.12); break;
      case 'boss_shield': this.tone(1600, 0.4, 'sine', 0.08, 2400); break;
      case 'boss_summon': this.tone(110, 0.5, 'sawtooth', 0.12, 55); break;
      case 'boss_stun': this.noise(0.2, 3000, 0.1, 0, 'highpass'); this.tone(1800, 0.15, 'square', 0.06, 400); break;
    }
  }
}
