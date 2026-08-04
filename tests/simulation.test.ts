import { describe, it, expect } from 'vitest';
import { createInitialState, seleccionarEvento, aplicarOpcion, resolverFinDeTemporada, aplicarEntrenamiento, crearSituacionActual, calcularMediaGeneral } from '../src/engine/gameEngine';
import { generarMinijuegoParaCarrera, resolverMinijuego } from '../src/engine/minijuegos';
import { CALENDARIOS_POR_CATEGORIA } from '../src/data/calendarios';
import { EVENTOS } from '../src/data/eventos';
import { FINALES } from '../src/data/finales';
import { PlayerState, StatKey } from '../src/engine/types';
import { createRNG } from '../src/engine/rng';
import { evaluarArquetipoFinal } from '../src/data/arquetiposFinales';

describe('Simulación de 1000 Partidas - Prompt 10 Contratos, Minijuegos e Impacto (VERSIÓN ALPHA v0.9.0)', () => {
  it('ejecuta 1000 partidas, mide sincronización atómica, frecuencia e impacto real de minijuegos y valida estabilidad', () => {
    const totalPartidas = 1000;
    const conteoArquetipos: Record<string, number> = {};
    let totalEventosJugados = 0;
    let totalTemporadas = 0;
    let totalEdadesRetiro = 0;
    let partidasInconclusas = 0;
    let desincronizacionesEstado = 0;

    let totalOportunidadesRepeticion = 0;
    let totalEventosRepetidosTempConsecutiva = 0;

    let totalMinijuegosGenerados = 0;
    let totalMinijuegosGanados = 0;
    let totalMinijuegosPerdidos = 0;

    // Métricas de Impacto de Minijuegos en Carreras Clave (Parte C.2)
    let victoriasConMinijuegoExito = 0;
    let podiosConMinijuegoExito = 0;
    let carrerasClaveConMinijuegoExito = 0;

    let victoriasSinMinijuegoOExito = 0;
    let podiosSinMinijuegoOExito = 0;
    let carrerasClaveSinMinijuegoOExito = 0;

    for (let i = 0; i < totalPartidas; i++) {
      const seed = `p10_sim_seed_${i}`;
      let state: PlayerState = createInitialState(`Piloto P10 ${i}`, 'Argentina', 'buenos-aires-racing', seed);
      let pasos = 0;
      let modificadoresTemp: Record<number, number> = {};

      while (!state.finalizado && pasos < 250) {
        pasos++;

        // Verificación estructural de sincronización B.2
        if (
          state.situacionActual.categoria !== state.categoria ||
          state.situacionActual.equipo !== state.equipo ||
          state.situacionActual.contrato.categoria !== state.situacionActual.categoria ||
          state.situacionActual.contrato.equipo !== state.situacionActual.equipo
        ) {
          desincronizacionesEstado++;
        }

        if (state.eventosUsadosTemporadaActual.length === 0) {
          modificadoresTemp = {};
          state = aplicarEntrenamiento(state, 'velocidad', 10);
          const profile = i % 4;
          let statToTrain: StatKey = 'velocidad';
          if (profile === 0) statToTrain = 'consistencia';
          else if (profile === 1) statToTrain = 'ataque';
          else if (profile === 2) statToTrain = 'gestion';
          else if (profile === 3) statToTrain = 'lluvia';
          state = aplicarEntrenamiento(state, statToTrain, 10);
        }

        const calendario = CALENDARIOS_POR_CATEGORIA[state.situacionActual.categoria] || [];
        const fechaActual = calendario[state.eventosUsadosTemporadaActual.length];

        if (fechaActual && fechaActual.esCarreraClave) {
          const mg = generarMinijuegoParaCarrera(state, fechaActual);
          if (mg) {
            totalMinijuegosGenerados++;
            const idxOptimo = mg.opciones.findIndex((o) => o.esOptimo);
            const { resultado, nuevoEstado } = resolverMinijuego(mg, idxOptimo, state);
            state = nuevoEstado;
            modificadoresTemp[fechaActual.numeroFecha] = resultado.bonoModificadorScore;

            if (resultado.exito) {
              totalMinijuegosGanados++;
            } else {
              totalMinijuegosPerdidos++;
            }
          }
        }

        const evento = seleccionarEvento(EVENTOS, state);
        if (!evento) {
          const estadoPrevioTemp = state.historialCampeonatos.length;
          state = resolverFinDeTemporada(state, modificadoresTemp);

          if (state.historialCampeonatos.length > estadoPrevioTemp) {
            const ultCamp = state.historialCampeonatos[state.historialCampeonatos.length - 1];
            for (const f of ultCamp.fechas) {
              if (f.esCarreraClave) {
                const bono = modificadoresTemp[f.numeroFecha] || 0;
                if (bono > 0) {
                  carrerasClaveConMinijuegoExito++;
                  if (f.posicion === 1) victoriasConMinijuegoExito++;
                  if (f.posicion <= 3) podiosConMinijuegoExito++;
                } else {
                  carrerasClaveSinMinijuegoOExito++;
                  if (f.posicion === 1) victoriasSinMinijuegoOExito++;
                  if (f.posicion <= 3) podiosSinMinijuegoOExito++;
                }
              }
            }
          }

          if (state.edad >= 32) {
            const rngRetiro = createRNG(`${state.seed}_sim_retiro_${state.edad}_${pasos}`);
            if (state.edad >= 38 || rngRetiro() < 0.25) {
              state = { ...state, finalizado: true };
              break;
            }
          }

          if (state.ofertasPendientes.length > 0) {
            const ofertaElegida = state.ofertasPendientes.find((o) => !o.esContinuidad) || state.ofertasPendientes[0];
            const ovr = calcularMediaGeneral(state.stats);
            const nuevaSituacion = crearSituacionActual(
              ofertaElegida.categoria,
              ofertaElegida.nombre,
              state.temporada,
              state.edad,
              ovr,
              ofertaElegida.duracionContrato
            );
            state = {
              ...state,
              situacionActual: nuevaSituacion,
              equipo: nuevaSituacion.equipo,
              categoria: nuevaSituacion.categoria,
              ofertasPendientes: [],
            };
          }
          continue;
        }

        const opcionIdx = Math.floor(
          ((state.stats.velocidad * 7 + pasos * 13 + i) % 100) / 100 * evento.opciones.length
        );

        const estadoPrevioTemp = state.historialCampeonatos.length;
        state = aplicarOpcion(state, evento, opcionIdx, FINALES);

        if (state.historialCampeonatos.length > estadoPrevioTemp) {
          const ultCamp = state.historialCampeonatos[state.historialCampeonatos.length - 1];
          for (const f of ultCamp.fechas) {
            if (f.esCarreraClave) {
              const bono = modificadoresTemp[f.numeroFecha] || 0;
              if (bono > 0) {
                carrerasClaveConMinijuegoExito++;
                if (f.posicion === 1) victoriasConMinijuegoExito++;
                if (f.posicion <= 3) podiosConMinijuegoExito++;
              } else {
                carrerasClaveSinMinijuegoOExito++;
                if (f.posicion === 1) victoriasSinMinijuegoOExito++;
                if (f.posicion <= 3) podiosSinMinijuegoOExito++;
              }
            }
          }
        }

        if (state.ofertasPendientes.length > 0) {
          const ofertaElegida = state.ofertasPendientes.find((o) => !o.esContinuidad) || state.ofertasPendientes[0];
          const ovr = calcularMediaGeneral(state.stats);
          const nuevaSituacion = crearSituacionActual(
            ofertaElegida.categoria,
            ofertaElegida.nombre,
            state.temporada,
            state.edad,
            ovr,
            ofertaElegida.duracionContrato
          );
          state = {
            ...state,
            situacionActual: nuevaSituacion,
            equipo: nuevaSituacion.equipo,
            categoria: nuevaSituacion.categoria,
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

    const pctPodiosExito = carrerasClaveConMinijuegoExito > 0 ? ((podiosConMinijuegoExito / carrerasClaveConMinijuegoExito) * 100).toFixed(1) : '0';
    const pctPodiosSinExito = carrerasClaveSinMinijuegoOExito > 0 ? ((podiosSinMinijuegoOExito / carrerasClaveSinMinijuegoOExito) * 100).toFixed(1) : '0';
    const pctVictoriasExito = carrerasClaveConMinijuegoExito > 0 ? ((victoriasConMinijuegoExito / carrerasClaveConMinijuegoExito) * 100).toFixed(1) : '0';
    const pctVictoriasSinExito = carrerasClaveSinMinijuegoOExito > 0 ? ((victoriasSinMinijuegoOExito / carrerasClaveSinMinijuegoOExito) * 100).toFixed(1) : '0';

    console.log('\n================ RESULTADOS DE SIMULACIÓN PROMPT 10 (ALPHA v0.9.0) ================');
    console.log(`Partidas jugadas: ${totalPartidas}`);
    console.log(`Partidas inconclusas (loops): ${partidasInconclusas}`);
    console.log(`Desincronizaciones de Categoría/Equipo/Contrato (B.2): ${desincronizacionesEstado} (0%)`);
    console.log(`Promedio de eventos por partida: ${promedioEventos}`);
    console.log(`Promedio de temporadas por partida: ${promedioTemporadas}`);
    console.log(`Edad promedio de retiro: ${promedioEdadRetiro} años`);
    console.log(`Diversidad de arquetipos finales generados: ${diversidadArquetipos} arquetipos distintos`);
    console.log(`\nMétricas de Minijuegos y Frecuencia:`);
    console.log(`  - Total minijuegos generados: ${totalMinijuegosGenerados}`);
    console.log(`  - Minijuegos ganados (éxito): ${totalMinijuegosGanados}`);
    console.log(`  - Minijuegos no concretados: ${totalMinijuegosPerdidos}`);
    console.log(`\nMétricas de Impacto en Carreras Clave (Parte C.2):`);
    console.log(`  - Tasa de Podios CON Minijuego Exitoso: ${pctPodiosExito}% (${podiosConMinijuegoExito}/${carrerasClaveConMinijuegoExito})`);
    console.log(`  - Tasa de Podios SIN Minijuego o Fallido: ${pctPodiosSinExito}% (${podiosSinMinijuegoOExito}/${carrerasClaveSinMinijuegoOExito})`);
    console.log(`  - Tasa de Victorias CON Minijuego Exitoso: ${pctVictoriasExito}% (${victoriasConMinijuegoExito}/${carrerasClaveConMinijuegoExito})`);
    console.log(`  - Tasa de Victorias SIN Minijuego o Fallido: ${pctVictoriasSinExito}% (${victoriasSinMinijuegoOExito}/${carrerasClaveSinMinijuegoOExito})`);
    console.log('\nDistribución de Arquetipos Finales:');
    Object.entries(conteoArquetipos)
      .sort(([, a], [, b]) => b - a)
      .forEach(([arqId, count]) => {
        const pct = ((count / totalPartidas) * 100).toFixed(1);
        console.log(`  - ${arqId}: ${count} (${pct}%)`);
      });
    console.log('===================================================================================\n');

    expect(desincronizacionesEstado).toBe(0);
    expect(partidasInconclusas).toBe(0);
    expect(diversidadArquetipos).toBeGreaterThanOrEqual(4);
    expect(promedioEdadRetiro).toBeGreaterThanOrEqual(32.0);
    expect(promedioEdadRetiro).toBeLessThanOrEqual(38.0);
  });
});
