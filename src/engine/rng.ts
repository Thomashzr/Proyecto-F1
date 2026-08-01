/**
 * Genera un hash numérico de 32 bits a partir de una cadena de texto (semilla).
 */
export function stringToSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Algoritmo PRNG Mulberry32: genera un número pseudoaleatorio entre 0 (inclusive) y 1 (exclusive)
 * a partir de un estado de 32 bits. Retorna el nuevo número y la función para la siguiente iteración.
 */
export function createRNG(seed: string | number) {
  let state = typeof seed === 'string' ? stringToSeed(seed) : seed >>> 0;

  return function nextRandom(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
