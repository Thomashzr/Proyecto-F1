import { createRNG } from '../engine/rng';

export const NOMBRES_RIVALES = [
  'Nico', 'Enzo', 'Lucas', 'Oliver', 'Liam', 'Gabriel', 'Maxime', 'Matteo',
  'Alexander', 'Arthur', 'Sebastian', 'Felipe', 'Kimi', 'Lando', 'Oscar',
  'Charles', 'Carlos', 'George', 'Esteban', 'Pierre', 'Jack', 'Dennis',
  'Frederik', 'Zane', 'Théo'
];

export const APELLIDOS_RIVALES = [
  'Varela', 'Rossi', 'Weber', 'Martins', 'Novak', 'Silva', 'Moreau', 'Sartori',
  'Lindblad', 'Aron', 'Hauger', 'Bearman', 'Hadjar', 'Maini', 'Verschoor',
  'Crawford', 'Stanek', 'Miyata', 'Dunne', 'Fittipaldi', 'Collet', 'Bortoleto',
  'Mini', 'Goethe', 'Antonelli'
];

/**
 * Genera deterministamente el nombre completo del rival principal basado en la semilla del jugador.
 */
export function generarNombreRival(seed: string): string {
  const rng = createRNG(`${seed}_rival_name`);
  const nombreIdx = Math.floor(rng() * NOMBRES_RIVALES.length);
  const apellidoIdx = Math.floor(rng() * APELLIDOS_RIVALES.length);
  return `${NOMBRES_RIVALES[nombreIdx]} ${APELLIDOS_RIVALES[apellidoIdx]}`;
}
