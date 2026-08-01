import { describe, it, expect } from 'vitest';
import { createInitialState, seleccionarEvento, aplicarOpcion, resolverFinDeTemporada } from '../src/engine/gameEngine';
import { EVENTOS } from '../src/data/eventos';
import { FINALES } from '../src/data/finales';
import { PlayerState } from '../src/engine/types';

describe('Simulación de 1000 Partidas - Prompt 3 Motor Actualizado', () => {
  it('ejecuta 1000 partidas deterministas y reporta la distribución de finales', () => {
    const totalPartidas = 1000;
    const conteoFinales: Record<string, number> = {};
    let totalEventosJugados = 0;
    let totalTemporadas = 0;
    let partidasInconclusas = 0;

    for (let i = 0; i < totalPartidas; i++) {
      const seed = `p3_sim_seed_${i}`;
      let state: PlayerState = createInitialState(`Piloto P3 ${i}`, 'Argentina', 'buenos-aires-racing', seed);
      let pasos = 0;
      const maxPasos = 60;

      while (!state.finalizado && pasos < maxPasos) {
        pasos++;
        const evento = seleccionarEvento(EVENTOS, state);
        if (!evento) {
          state = resolverFinDeTemporada(state);
          if (state.edad >= 26 && state.categoria !== 'Fórmula 1') {
            state.finalizado = true;
            state.finalObtenido = 'final-estancado-inferiores';
          }
          continue;
        }

        const opcionIdx = Math.floor(
          ((state.stats.velocidad * 7 + pasos * 13 + i) % 100) / 100 * evento.opciones.length
        );

        state = aplicarOpcion(state, evento, opcionIdx, FINALES);
      }

      if (!state.finalizado) {
        partidasInconclusas++;
      } else if (state.finalObtenido) {
        conteoFinales[state.finalObtenido] = (conteoFinales[state.finalObtenido] || 0) + 1;
      }

      totalEventosJugados += state.historial.length;
      totalTemporadas += state.temporada;
    }

    const promedioEventos = (totalEventosJugados / totalPartidas).toFixed(2);
    const promedioTemporadas = (totalTemporadas / totalPartidas).toFixed(2);

    console.log('\n================ RESULTADOS DE SIMULACIÓN PROMPT 3 (1000 PARTIDAS) ================');
    console.log(`Partidas jugadas: ${totalPartidas}`);
    console.log(`Partidas inconclusas (loops): ${partidasInconclusas}`);
    console.log(`Promedio de eventos por partida: ${promedioEventos}`);
    console.log(`Promedio de temporadas por partida: ${promedioTemporadas}`);
    console.log('\nDistribución de Finales (Prompt 3):');
    Object.entries(conteoFinales)
      .sort(([, a], [, b]) => b - a)
      .forEach(([finalId, count]) => {
        const pct = ((count / totalPartidas) * 100).toFixed(1);
        console.log(`  - ${finalId}: ${count} (${pct}%)`);
      });
    console.log('===================================================================================\n');

    expect(partidasInconclusas).toBe(0);
    expect(Number(promedioEventos)).toBeGreaterThan(3);
  });
});
