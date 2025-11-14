
class SoundService {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        return null;
      }
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    const context = this.getContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }

  public playComplete() {
    this.playTone(600, 0.1, 'triangle');
    setTimeout(() => this.playTone(800, 0.15, 'triangle'), 100);
  }

  public playStar() {
    this.playTone(1200, 0.2, 'sine');
  }
  
  public playCourseComplete() {
    this.playTone(523.25, 0.15, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 150); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 300); // G5
    setTimeout(() => this.playTone(1046.50, 0.3, 'sine'), 450); // C6
  }
}

export const soundService = new SoundService();
