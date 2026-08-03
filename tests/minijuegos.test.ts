import { describe, it, expect } from 'vitest';
import { createInitialState, simularFechaCarrera, simularCarrerasRestantes } from '../src/engine/gameEngine';
import { generarMinijuegoParaCarrera, resolverMinijuego, PROBABILIDAD_APARICION_MINIJUEGO } from '../src/engine/minijuegos';
import { FechaCalendario } from '../src/data/calendarios';

describe('Parte B: Sistema de Minijuegos en Carreras Clave (B.1 - B.7)', () => {
  it('B.1 / B.7: no genera minijuego si la fecha no es carrera clave', () => {
    const state = createInitialState('Piloto Test', 'Argentina', 'karting-cadetes-ba', 'mg_seed_1');
    const fechaNoClave: FechaCalendario = {
      numeroFecha: 1,
      nombreGranPremio: 'GP No Clave',
      circuito: 'Buenos Aires',
      pais: 'Argentina',
      esCarreraClave: false,
      esMojado: false,
    };

    const mg = generarMinijuegoParaCarrera(state, fechaNoClave);
    expect(mg).toBeNull();
  });

  it('B.1 / B.7: respeta la probabilidad de aparicion (~50%) en carreras clave', () => {
    let generados = 0;
    const total = 500;

    for (let i = 0; i < total; i++) {
      const state = createInitialState('Piloto Test', 'Argentina', 'karting-cadetes-ba', `mg_prob_seed_${i}`);
      const fechaClave: FechaCalendario = {
        numeroFecha: 2,
        nombreGranPremio: 'GP Clave Test',
        circuito: 'San Juan',
        pais: 'Argentina',
        esCarreraClave: true,
        esMojado: false,
      };

      const mg = generarMinijuegoParaCarrera(state, fechaClave);
      if (mg) generados++;
    }

    const porcentaje = generados / total;
    expect(porcentaje).toBeGreaterThanOrEqual(0.40);
    expect(porcentaje).toBeLessThanOrEqual(0.60);
    expect(PROBABILIDAD_APARICION_MINIJUEGO).toBe(0.50);
  });

  it('B.3 - B.5: genera los 3 tipos de minijuegos con estructuras y opciones validas', () => {
    const tiposEncontrados = new Set<string>();

    for (let i = 0; i < 200; i++) {
      const state = createInitialState('Piloto Test', 'Argentina', 'karting-cadetes-ba', `mg_type_seed_${i}`);
      const fechaClave: FechaCalendario = {
        numeroFecha: 3,
        nombreGranPremio: 'GP Clave Tipos',
        circuito: 'Termas',
        pais: 'Argentina',
        esCarreraClave: true,
        esMojado: i % 2 === 0,
      };

      const mg = generarMinijuegoParaCarrera(state, fechaClave);
      if (mg) {
        tiposEncontrados.add(mg.tipo);
        expect(mg.opciones.length).toBeGreaterThanOrEqual(2);
        expect(mg.opciones.some((o) => o.esOptimo)).toBe(true);
        expect(['victoria', 'podio', 'puntos']).toContain(mg.objetivo);
        expect(['ataque', 'gestion', 'consistencia']).toContain(mg.habilidadRecompensada);
      }
    }

    expect(tiposEncontrados.has('adelantamiento')).toBe(true);
    expect(tiposEncontrados.has('estrategia-boxes')).toBe(true);
    expect(tiposEncontrados.has('eleccion-neumaticos')).toBe(true);
  });

  it('B.2 / B.3 - B.5: exito en opcion optima otorga +20 score y +1 stat sin restar en fallo', () => {
    const state = createInitialState('Piloto Test', 'Argentina', 'karting-cadetes-ba', 'mg_res_seed_10');
    const fechaClave: FechaCalendario = {
      numeroFecha: 1,
      nombreGranPremio: 'GP Test Res',
      circuito: 'Monza',
      pais: 'Italia',
      esCarreraClave: true,
      esMojado: false,
    };

    let mgContext = generarMinijuegoParaCarrera(state, fechaClave);
    let iter = 0;
    while (!mgContext && iter < 100) {
      iter++;
      const s = createInitialState('Piloto Test', 'Argentina', 'karting-cadetes-ba', `mg_res_find_${iter}`);
      mgContext = generarMinijuegoParaCarrera(s, fechaClave);
    }

    expect(mgContext).not.toBeNull();

    if (mgContext) {
      const idxOptimo = mgContext.opciones.findIndex((o) => o.esOptimo);
      expect(idxOptimo).toBeGreaterThanOrEqual(0);

      const { resultado, nuevoEstado } = resolverMinijuego(mgContext, idxOptimo, state);

      if (resultado.exito) {
        expect(resultado.bonoModificadorScore).toBe(20);
        expect(resultado.statBonus).toBeDefined();
        const statKey = resultado.statBonus!.stat;
        expect(nuevoEstado.stats[statKey]).toBe(state.stats[statKey] + 1);
      } else {
        expect(resultado.bonoModificadorScore).toBe(0);
        expect(resultado.statBonus).toBeUndefined();
        // Verificar que NUNCA reduce estadisticas
        (Object.keys(state.stats) as Array<keyof typeof state.stats>).forEach((key) => {
          expect(nuevoEstado.stats[key]).toBeGreaterThanOrEqual(state.stats[key]);
        });
      }
    }
  });

  it('B.6: integracion de modificadorScore en simularFechaCarrera y simularCarrerasRestantes', () => {
    const state = createInitialState('Piloto Test', 'Argentina', 'karting-cadetes-ba', 'mg_sim_score');
    const fecha: FechaCalendario = {
      numeroFecha: 1,
      nombreGranPremio: 'GP Monza',
      circuito: 'Monza',
      pais: 'Italia',
      esCarreraClave: true,
      esMojado: false,
    };

    const resSinBono = simularFechaCarrera(state, fecha, 0);
    const resConBono = simularFechaCarrera(state, fecha, 20);

    // El bono de score (+20) debe mejorar o igualar la posicion de carrera (posicion 1 es mejor que 5)
    expect(resConBono.posicion).toBeLessThanOrEqual(resSinBono.posicion);

    // Probar simularCarrerasRestantes con modificadores
    const resumen = simularCarrerasRestantes(state, { 1: 20 });
    expect(resumen.fechas.length).toBeGreaterThan(0);
  });
});
