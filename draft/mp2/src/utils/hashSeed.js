// Create a deterministic seed from a URL for consistent "random" generation
// This ensures the same URL always produces the same audit results

export const createSeedFromURL = (url) => {
  let hash = 0;
  const cleanURL = url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

  for (let i = 0; i < cleanURL.length; i++) {
    const char = cleanURL.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash);
};

// Seeded random number generator
export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  // Generate a random number between 0 and 1
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Generate a random integer between min and max (inclusive)
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Generate a random number within a range
  nextRange(min, max) {
    return this.next() * (max - min) + min;
  }

  // Pick a random element from an array
  pick(array) {
    return array[this.nextInt(0, array.length - 1)];
  }

  // Shuffle an array
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Pick multiple random elements from an array
  pickMultiple(array, count) {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
  }
}
