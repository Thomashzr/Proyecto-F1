import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  clamp,
  evaluarCondicion,
  esEventoElegible,
  aplicarOpcion,
} from '../src/engine/gameEngine';
import { createRNG } from '../src/engine/rng';
import { EVENTOS } from '../src/data/eventos';
import { FINALES } from '../src/data/finales';
import { Evento, PlayerState } from '../src/engine/types';

describe('RNG & Seed System', () => {
  it('genera secuencias aleatorias reproducibles dado el mismo seed', () => {
    const rng1 = createRNG('mi_seed_secret');
    const rng2 = createRNG('mi_seed_secret');

    const val1_a = rng1();
    const val1_b = rng1();
    const val2_a = rng2();
    const val2_b = rng2();

    expect(val1_a).toEqual(val2_a);
    expect(val1_b).toEqual(val2_b);
    expect(val1_a).toBeGreaterThanOrEqual(0);
    expect(val1_a).toBeLessThan(1);
  });
});

describe('Motor de Juego - Utilidades y Clamps', () => {
  it('inicializa un nuevo jugador con valores correctos del Prompt 3', () => {
    const estado = createInitialState('Franco Colapinto', 'Argentina', 'buenos-aires-racing', 'seed123');
    expect(estado.nombre).toBe('Franco Colapinto');
    expect(estado.nacionalidad).toBe('Argentina');
    expect(estado.edad).toBe(9);
    expect(estado.categoria).toBe('Karting Regional');
    expect(estado.seed).toBe('seed123');
    expect(estado.stats.velocidad).toBe(45);
    expect(estado.finalizado).toBe(false);
    expect(estado.finalObtenido).toBeNull();
  });

  it('clampea correctamente números entre 0 y 100', () => {
    expect(clamp(150)).toBe(100);
    expect(clamp(-25)).toBe(0);
    expect(clamp(50)).toBe(50);
  });

  it('evalúa condiciones de habilidades de forma precisa', () => {
    const stats = {
      velocidad: 70,
      lluvia: 40,
      ataque: 50,
      defensa: 30,
      gestion: 80,
      consistencia: 60,
      fama: 40,
      popularidad: 50,
    };

    expect(evaluarCondicion(stats, { stat: 'velocidad', operador: '>', valor: 65 })).toBe(true);
    expect(evaluarCondicion(stats, { stat: 'velocidad', operador: '>=', valor: 70 })).toBe(true);
    expect(evaluarCondicion(stats, { stat: 'lluvia', operador: '<', valor: 50 })).toBe(true);
  });
});

describe('Motor de Juego - Selección y Elegibilidad de Eventos', () => {
  it('filtra eventos por categoría mínima y máxima', () => {
    const stateKarting = createInitialState('Piloto 1', 'Argentina', 'buenos-aires-racing', 'seed_test');
    const eventoF4: Evento = {
      id: 'evento_f4_only',
      categoriaMinima: 'Fórmula 4 Italia',
      peso: 10,
      titulo: 'Test F4',
      descripcion: 'Prueba',
      opciones: [],
    };

    expect(esEventoElegible(eventoF4, stateKarting)).toBe(false);

    const stateF4: PlayerState = { ...stateKarting, categoria: 'Fórmula 4 Italia' };
    expect(esEventoElegible(eventoF4, stateF4)).toBe(true);
  });
});

describe('Motor de Juego - Aplicación de Consecuencias y Finales', () => {
  it('aplica deltas de habilidades y limita los valores entre 0 y 100', () => {
    let state = createInitialState('Piloto Delta', 'Argentina', 'buenos-aires-racing', 'seed_test');
    state.stats.velocidad = 98;

    const evento = EVENTOS[0];
    state = aplicarOpcion(state, evento, 0, FINALES);

    expect(state.stats.velocidad).toBe(100);
    expect(state.historial.length).toBe(1);
  });
});
