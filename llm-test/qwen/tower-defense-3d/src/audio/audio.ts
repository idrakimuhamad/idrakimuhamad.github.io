// Procedural WebAudio SFX — direct port of 2D `ie`. Same synth, same SFX list,
// same per-SFX throttling. No audio files.

import type { SfxName } from '../core/types';
import type { SettingsStore } from '../core/types';

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private lastPlay: Record<string, number> = {};
  private readonly settings: SettingsStore;

  constructor(settings: SettingsStore) {
    this.settings = settings;
  }

  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    try {
      const Ctor: typeof AudioContext | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.settings.data.volume;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 1;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } catch {
      this.ctx = null;
    }
  }

  setVolume(v: number): void {
    this.settings.set('volume', v);
    if (this.master) this.master.gain.value = v;
  }

  private ready(): boolean {
    return !!this.ctx && !!this.master && this.settings.data.sound;
  }

  private throttle(name: string, ms: number): boolean {
    const now = performance.now();
    if (this.lastPlay[name] && now - this.lastPlay[name] < ms) return false;
    this.lastPlay[name] = now;
    return true;
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, endFreq?: number): void {
    if (!this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, vol: number, freq: number, type: BiquadFilterType = 'lowpass'): void {
    if (!this.ctx || !this.master || !this.noiseBuf) return;
    const t0 = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  play(name: SfxName): void {
    if (!this.ready()) return;
    switch (name) {
      case 'shoot':
        if (!this.throttle('shoot', 40)) return;
        this.tone(320, 0.12, 'square', 0.18, 120);
        this.noise(0.08, 0.1, 1800, 'bandpass');
        break;
      case 'shootFast':
        if (!this.throttle('shootFast', 25)) return;
        this.tone(520, 0.05, 'square', 0.09, 300);
        break;
      case 'shootSniper':
        if (!this.throttle('shootSniper', 60)) return;
        this.tone(900, 0.18, 'sawtooth', 0.16, 200);
        this.noise(0.1, 0.12, 3000, 'highpass');
        break;
      case 'explosion':
        if (!this.throttle('explosion', 60)) return;
        this.noise(0.35, 0.35, 900);
        this.tone(90, 0.3, 'sine', 0.25, 40);
        break;
      case 'bigExplosion':
        if (!this.throttle('bigExplosion', 80)) return;
        this.noise(0.6, 0.5, 600);
        this.tone(60, 0.5, 'sine', 0.4, 30);
        break;
      case 'frost':
        if (!this.throttle('frost', 80)) return;
        this.tone(1200, 0.15, 'sine', 0.08, 1800);
        break;
      case 'death':
        if (!this.throttle('death', 40)) return;
        this.tone(200, 0.15, 'triangle', 0.14, 60);
        break;
      case 'build':
        this.tone(240, 0.1, 'square', 0.15, 360);
        this.tone(360, 0.12, 'square', 0.12, 480);
        break;
      case 'upgrade':
        this.tone(400, 0.08, 'square', 0.14, 600);
        this.tone(600, 0.1, 'square', 0.12, 900);
        break;
      case 'sell':
        this.tone(500, 0.08, 'sine', 0.14, 300);
        break;
      case 'invalid':
        this.tone(160, 0.18, 'sawtooth', 0.16, 100);
        break;
      case 'baseHit':
        this.tone(120, 0.3, 'sawtooth', 0.3, 50);
        this.noise(0.25, 0.25, 500);
        break;
      case 'wave':
        this.tone(300, 0.1, 'square', 0.15, 450);
        this.tone(450, 0.12, 'square', 0.14, 600);
        this.tone(600, 0.16, 'square', 0.12, 800);
        break;
      case 'click':
        this.tone(700, 0.03, 'sine', 0.06);
        break;
      case 'win':
        this.tone(400, 0.15, 'square', 0.18, 500);
        this.tone(500, 0.15, 'square', 0.18, 600);
        this.tone(600, 0.2, 'square', 0.18, 800);
        this.tone(800, 0.3, 'square', 0.18, 1000);
        break;
      case 'lose':
        this.tone(400, 0.3, 'sawtooth', 0.2, 200);
        this.tone(300, 0.4, 'sawtooth', 0.2, 100);
        break;
    }
  }
}
