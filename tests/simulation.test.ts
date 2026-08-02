import { describe, it, expect } from 'vitest';
import { createInitialState, seleccionarEvento, aplicarOpcion, resolverFinDeTemporada, cantidadCarrerasClave } from '../src/engine/gameEngine';
import { EVENTOS } from '../src/data/eventos';
import { FINALES } from '../src/data/finales';
import { PlayerState } from '../src/engine/types';
import { createRNG } from '../src/engine/rng';
import { evaluarArquetipoFinal } from '../src/data/arquetiposFinales';

describe('Simulación de 1000 Partidas - Prompt 8 Pistero (ALPHA v0.7.0)', () => {
  it('ejecuta 1000 partidas, mide repetición de eventos entre temporadas consecutivas y valida estabilidad', () => {
    const totalPartidas = 1000;
    const conteoArquetipos: Record<string, number> = {};
    let totalEventosJugados = 0;
    let totalTemporadas = 0;
    let totalEdadesRetiro = 0;
    let partidasInconclusas = 0;

    let totalOportunidadesRepeticion = 0;
    let totalEventosRepetidosTempConsecutiva = 0;

    for (let i = 0; i < totalPartidas; i++) {
      const seed = `p8_sim_seed_${i}`;
      let state: PlayerState = createInitialState(`Piloto P8 ${i}`, 'Argentina', 'buenos-aires-racing', seed);
      let pasos = 0;

      while (!state.finalizado && pasos < 250) {
        pasos++;

        const maxEv = cantidadCarrerasClave(state.categoria);
        if (state.edad >= 32 && state.eventosUsadosTemporadaActual.length >= maxEv) {
          const rngRetiro = createRNG(`${state.seed}_sim_retiro_${state.edad}_${pasos}`);
          if (state.edad >= 38 || rngRetiro() < 0.35) {
            state = { ...state, finalizado: true };
            break;
          }
        }

        const evento = seleccionarEvento(EVENTOS, state);
        if (!evento) {
          state = resolverFinDeTemporada(state);
          continue;
        }

        const opcionIdx = Math.floor(
          ((state.stats.velocidad * 7 + pasos * 13 + i) % 100) / 100 * evento.opciones.length
        );

        state = aplicarOpcion(state, evento, opcionIdx, FINALES);
      }

      if (!state.finalizado) {
        partidasInconclusas++;
      } else {
        const arquetipo = evaluarArquetipoFinal(state);
        conteoArquetipos[arquetipo.id] = (conteoArquetipos[arquetipo.id] || 0) + 1;
      }

      // Medición de % de eventos repetidos respecto a la temporada inmediatamente anterior
      const eventosPorTemporada: Record<number, string[]> = {};
      for (const h of state.historial) {
        if (!eventosPorTemporada[h.temporada]) {
          eventosPorTemporada[h.temporada] = [];
        }
        eventosPorTemporada[h.temporada].push(h.eventoId);
      }

      const temporadasOrdenadas = Object.keys(eventosPorTemporada).map(Number).sort((a, b) => a - b);
      for (let tIdx = 1; tIdx < temporadasOrdenadas.length; tIdx++) {
        const tempActual = temporadasOrdenadas[tIdx];
        const tempPrevia = temporadasOrdenadas[tIdx - 1];

        const evsActual = eventosPorTemporada[tempActual];
        const evsPrevia = new Set(eventosPorTemporada[tempPrevia]);

        for (const evId of evsActual) {
          totalOportunidadesRepeticion++;
          if (evsPrevia.has(evId)) {
            totalEventosRepetidosTempConsecutiva++;
          }
        }
      }

      totalEventosJugados += state.historial.length;
      totalTemporadas += state.temporada;
      totalEdadesRetiro += state.edad;
    }

    const promedioEventos = (totalEventosJugados / totalPartidas).toFixed(2);
    const promedioTemporadas = (totalTemporadas / totalPartidas).toFixed(2);
    const promedioEdadRetiro = Number((totalEdadesRetiro / totalPartidas).toFixed(1));
    const diversidadArquetipos = Object.keys(conteoArquetipos).length;
    const pctEventosRepetidos = totalOportunidadesRepeticion > 0
      ? ((totalEventosRepetidosTempConsecutiva / totalOportunidadesRepeticion) * 100).toFixed(2)
      : '0.00';

    console.log('\n================ RESULTADOS DE SIMULACIÓN PROMPT 8 (ALPHA v0.7.0) ================');
    console.log(`Partidas jugadas: ${totalPartidas}`);
    console.log(`Partidas inconclusas (loops): ${partidasInconclusas}`);
    console.log(`Promedio de eventos por partida: ${promedioEventos}`);
    console.log(`Promedio de temporadas por partida: ${promedioTemporadas}`);
    console.log(`Edad promedio de retiro: ${promedioEdadRetiro} años`);
    console.log(`% Eventos repetidos vs temporada anterior: ${pctEventosRepetidos}%`);
    console.log(`Diversidad de arquetipos finales generados: ${diversidadArquetipos} arquetipos distintos`);
    console.log('\nDistribución de Arquetipos Finales:');
    Object.entries(conteoArquetipos)
      .sort(([, a], [, b]) => b - a)
      .forEach(([arqId, count]) => {
        const pct = ((count / totalPartidas) * 100).toFixed(1);
        console.log(`  - ${arqId}: ${count} (${pct}%)`);
      });
    console.log('===================================================================================\n');

    expect(partidasInconclusas).toBe(0);
    expect(diversidadArquetipos).toBeGreaterThanOrEqual(4);
    expect(promedioEdadRetiro).toBeGreaterThanOrEqual(32.0);
    expect(promedioEdadRetiro).toBeLessThanOrEqual(38.0);
  });
});
