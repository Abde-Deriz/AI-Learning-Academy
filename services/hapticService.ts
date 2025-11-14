
class HapticService {
  public vibrate(pattern: VibratePattern = 50) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // This can happen if the document is not focused or other reasons.
        console.warn("Haptic feedback failed.", e);
      }
    }
  }

  public success() {
    this.vibrate([100, 30, 100]);
  }

  public click() {
    this.vibrate(20);
  }
}

export const hapticService = new HapticService();
