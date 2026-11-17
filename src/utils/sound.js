/**
 * Web Audio API synthesizer for clean, zero-dependency sound effects.
 */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration = 0.15, type = 'sine', gainVal = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy safety
    }
  }

  playComplete() {
    // Joyful upward arpeggio
    this.playTone(523.25, 0.12, 'sine', 0.15); // C5
    setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.15), 90); // E5
    setTimeout(() => this.playTone(783.99, 0.14, 'sine', 0.15), 180); // G5
    setTimeout(() => this.playTone(1046.50, 0.35, 'sine', 0.2), 270); // C6
  }

  playTimerAlert() {
    // Gentle ringing alert
    [0, 150, 300, 450].forEach((delay, idx) => {
      setTimeout(() => {
        this.playTone(880, 0.2, 'triangle', 0.2 - idx * 0.03);
      }, delay);
    });
  }

  playClick() {
    this.playTone(400, 0.04, 'triangle', 0.05);
  }
}

export const sound = new SoundManager();
