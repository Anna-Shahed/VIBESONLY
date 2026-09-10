"use client";

export class PreviewEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private active: OscillatorNode[] = []; 
  
  start(seed: number) {
    this.stop();
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    void this.ctx.resume();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.09;
    this.master.connect(this.ctx.destination);

    const rootSemis = [0, 3, 5, 7, 10, 12][seed % 6];
    const chord = [0, 3, 7, 10, 14].map((o) => rootSemis + o);

    const schedule = () => {
      if (!this.ctx || !this.master) return;
      const t = this.ctx.currentTime + 0.05;
      for (const c of chord) {
        const f = 130.81 * Math.pow(2, c / 12);
        for (const detune of [-6, 4]) {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = f;
          osc.detune.value = detune;
          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.08, t + 1.2);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
          osc.connect(g);
          g.connect(this.master);
          osc.start(t);
          osc.stop(t + 3.8);
          this.active.push(osc);
        }
      }
    };
    schedule();
    this.timer = window.setInterval(schedule, 2400);
  }

  pause() { if (this.ctx) void this.ctx.suspend(); }
  resume() { if (this.ctx) void this.ctx.resume(); }

  stop() {
    if (this.timer !== null) { clearInterval(this.timer); this.timer = null; }
    for (const osc of this.active) { try { osc.stop(); } catch { /* already stopped */ } }
    this.active = [];
    if (this.ctx) { void this.ctx.close(); this.ctx = null; }
  }
}

export const previewEngine = new PreviewEngine();
