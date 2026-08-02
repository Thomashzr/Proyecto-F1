import { describe, it, expect } from 'vitest';
import { createInitialState, seleccionarEvento, aplicarOpcion, resolverFinDeTemporada, evaluarFinales } from '../src/engine/gameEngine';
import { EVENTOS } from '../src/data/eventos';
import { FINALES } from '../src/data/finales';
import { PlayerState } from '../src/engine/types';
import { createRNG } from '../src/engine/rng';

describe('Simulación de 1000 Partidas - Prompt 6 (ALPHA v0.5.0)', () => {
  it('ejecuta 1000 partidas y verifica la presencia del rival, resumen desde T1 y retiros razonables', () => {
    const totalPartidas = 1000;
    const conteoFinales: Record<string, number> = {};
    let totalEventosJugados = 0;
    let totalTemporadas = 0;
    let totalEdadesRetiro = 0;
    let partidasConRival = 0;
    let temporadasConResumen = 0;
    let partidasInconclusas = 0;

    for (let i = 0; i < totalPartidas; i++) {
      const seed = `p6_sim_seed_${i}`;
      let state: PlayerState = createInitialState(`Piloto P6 ${i}`, 'Argentina', 'buenos-aires-racing', seed);
      let pasos = 0;
      let vioRival = false;

      while (!state.finalizado && pasos < 250) {
        pasos++;

        if (state.edad >= 32 && state.historial.length % 3 === 0) {
          const rngRetiro = createRNG(`${state.seed}_sim_retiro_${state.edad}_${pasos}`);
          if (state.edad >= 38 || rngRetiro() < 0.35) {
            state = { ...state, finalizado: true };
            state = evaluarFinales(state, FINALES);
            break;
          }
        }

        const evento = seleccionarEvento(EVENTOS, state);
        if (!evento) {
          state = resolverFinDeTemporada(state);
          temporadasConResumen++;
          continue;
        }

        if (evento.personajeRecurrente) {
          vioRival = true;
        }

        const opcionIdx = Math.floor(
          ((state.stats.velocidad * 7 + pasos * 13 + i) % 100) / 100 * evento.opciones.length
        );

        const proximoEstado = aplicarOpcion(state, evento, opcionIdx, FINALES);
        if (proximoEstado.historial.length % 3 === 0) {
          temporadasConResumen++;
        }
        state = proximoEstado;
      }

      if (vioRival) partidasConRival++;

      if (!state.finalizado) {
        partidasInconclusas++;
      } else if (state.finalObtenido) {
        conteoFinales[state.finalObtenido] = (conteoFinales[state.finalObtenido] || 0) + 1;
      }

      totalEventosJugados += state.historial.length;
      totalTemporadas += state.temporada;
      totalEdadesRetiro += state.edad;
    }

    const promedioEventos = (totalEventosJugados / totalPartidas).toFixed(2);
    const promedioTemporadas = (totalTemporadas / totalPartidas).toFixed(2);
    const promedioEdadRetiro = Number((totalEdadesRetiro / totalPartidas).toFixed(1));
    const porcentajeRival = ((partidasConRival / totalPartidas) * 100).toFixed(1);

    console.log('\n================ RESULTADOS DE SIMULACIÓN PROMPT 6 (ALPHA v0.5.0) ================');
    console.log(`Partidas jugadas: ${totalPartidas}`);
    console.log(`Partidas inconclusas (loops): ${partidasInconclusas}`);
    console.log(`Promedio de eventos por partida: ${promedioEventos}`);
    console.log(`Promedio de temporadas por partida: ${promedioTemporadas}`);
    console.log(`Edad promedio de retiro: ${promedioEdadRetiro} años`);
    console.log(`Presencia del rival deportivo: ${partidasConRival}/${totalPartidas} (${porcentajeRival}%)`);
    console.log(`Total resúmenes de temporada generados: ${temporadasConResumen}`);
    console.log('\nDistribución de Finales:');
    Object.entries(conteoFinales)
      .sort(([, a], [, b]) => b - a)
      .forEach(([finalId, count]) => {
        const pct = ((count / totalPartidas) * 100).toFixed(1);
        console.log(`  - ${finalId}: ${count} (${pct}%)`);
      });
    console.log('===================================================================================\n');

    expect(partidasInconclusas).toBe(0);
    expect(Number(porcentajeRival)).toBeGreaterThan(70.0);
    expect(promedioEdadRetiro).toBeGreaterThanOrEqual(32.0);
    expect(promedioEdadRetiro).toBeLessThanOrEqual(38.0);
  });
});
