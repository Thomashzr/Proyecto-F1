import { describe, it, expect } from 'vitest';
import { createInitialState, seleccionarEvento, aplicarOpcion, resolverFinDeTemporada, aplicarEntrenamiento } from '../src/engine/gameEngine';
import { generarMinijuegoParaCarrera, resolverMinijuego } from '../src/engine/minijuegos';
import { CALENDARIOS_POR_CATEGORIA } from '../src/data/calendarios';
import { EVENTOS } from '../src/data/eventos';
import { FINALES } from '../src/data/finales';
import { PlayerState, StatKey } from '../src/engine/types';
import { createRNG } from '../src/engine/rng';
import { evaluarArquetipoFinal } from '../src/data/arquetiposFinales';

describe('Simulación de 1000 Partidas - Prompt 9 Recorrección & Minijuegos (ALPHA v0.7.0)', () => {
  it('ejecuta 1000 partidas, mide repetición de eventos, efectividad de minijuegos y valida estabilidad', () => {
    const totalPartidas = 1000;
    const conteoArquetipos: Record<string, number> = {};
    let totalEventosJugados = 0;
    let totalTemporadas = 0;
    let totalEdadesRetiro = 0;
    let partidasInconclusas = 0;

    let totalOportunidadesRepeticion = 0;
    let totalEventosRepetidosTempConsecutiva = 0;

    let totalMinijuegosGenerados = 0;
    let totalMinijuegosGanados = 0;
    let totalMinijuegosPerdidos = 0;

    for (let i = 0; i < totalPartidas; i++) {
      const seed = `p8_sim_seed_${i}`;
      let state: PlayerState = createInitialState(`Piloto P8 ${i}`, 'Argentina', 'buenos-aires-racing', seed);
      let pasos = 0;

      while (!state.finalizado && pasos < 250) {
        pasos++;

        if (state.eventosUsadosTemporadaActual.length === 0) {
          state = aplicarEntrenamiento(state, 'velocidad', 10);
          const profile = i % 4;
          let statToTrain: StatKey = 'velocidad';
          if (profile === 0) statToTrain = 'consistencia';
          else if (profile === 1) statToTrain = 'ataque';
          else if (profile === 2) statToTrain = 'gestion';
          else if (profile === 3) statToTrain = 'lluvia';
          state = aplicarEntrenamiento(state, statToTrain, 10);
        }

        const calendario = CALENDARIOS_POR_CATEGORIA[state.categoria] || [];
        const fechaActual = calendario[state.eventosUsadosTemporadaActual.length];
        if (fechaActual && fechaActual.esCarreraClave) {
          const mg = generarMinijuegoParaCarrera(state, fechaActual);
          if (mg) {
            totalMinijuegosGenerados++;
            const idxOptimo = mg.opciones.findIndex((o) => o.esOptimo);
            const { resultado, nuevoEstado } = resolverMinijuego(mg, idxOptimo, state);
            state = nuevoEstado;
            if (resultado.exito) totalMinijuegosGanados++;
            else totalMinijuegosPerdidos++;
          }
        }

        const evento = seleccionarEvento(EVENTOS, state);
        if (!evento) {
          state = resolverFinDeTemporada(state);

          if (state.edad >= 32) {
            const rngRetiro = createRNG(`${state.seed}_sim_retiro_${state.edad}_${pasos}`);
            if (state.edad >= 38 || rngRetiro() < 0.30) {
              state = { ...state, finalizado: true };
              break;
            }
          }

          if (state.ofertasPendientes.length > 0) {
            const ofertaElegida = state.ofertasPendientes.find((o) => !o.esContinuidad) || state.ofertasPendientes[0];
            state = {
              ...state,
              equipo: ofertaElegida.nombre,
              categoria: ofertaElegida.categoria,
              ofertasPendientes: [],
            };
            if (i === 0) {
              console.log(`[DRIVER 0 SEASON ${state.temporada}] Categoria: ${state.categoria}, Oferta Elegida: ${ofertaElegida.categoria} (${ofertaElegida.nombre})`);
            }
          }
          continue;
        }

        const opcionIdx = Math.floor(
          ((state.stats.velocidad * 7 + pasos * 13 + i) % 100) / 100 * evento.opciones.length
        );

        state = aplicarOpcion(state, evento, opcionIdx, FINALES);

        if (state.ofertasPendientes.length > 0) {
          const ofertaElegida = state.ofertasPendientes.find((o) => !o.esContinuidad) || state.ofertasPendientes[0];
          state = {
            ...state,
            equipo: ofertaElegida.nombre,
            categoria: ofertaElegida.categoria,
            ofertasPendientes: [],
          };
        }
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

    const tasaExitoMinijuegos = totalMinijuegosGenerados > 0
      ? ((totalMinijuegosGanados / totalMinijuegosGenerados) * 100).toFixed(2)
      : '0.00';

    console.log('\n================ RESULTADOS DE SIMULACIÓN PROMPT 9 (ALPHA v0.7.0) ================');
    console.log(`Partidas jugadas: ${totalPartidas}`);
    console.log(`Partidas inconclusas (loops): ${partidasInconclusas}`);
    console.log(`Promedio de eventos por partida: ${promedioEventos}`);
    console.log(`Promedio de temporadas por partida: ${promedioTemporadas}`);
    console.log(`Edad promedio de retiro: ${promedioEdadRetiro} años`);
    console.log(`% Eventos repetidos vs temporada anterior: ${pctEventosRepetidos}%`);
    console.log(`Diversidad de arquetipos finales generados: ${diversidadArquetipos} arquetipos distintos`);
    console.log(`\nMétricas de Minijuegos en Carreras Clave:`);
    console.log(`  - Total minijuegos generados: ${totalMinijuegosGenerados}`);
    console.log(`  - Minijuegos ganados (éxito): ${totalMinijuegosGanados} (${tasaExitoMinijuegos}%)`);
    console.log(`  - Minijuegos no concretados: ${totalMinijuegosPerdidos}`);
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
