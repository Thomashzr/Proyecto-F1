import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  esEventoElegible,
  calcularMediaGeneral,
} from '../src/engine/gameEngine';
import { createRNG } from '../src/engine/rng';
import { Evento } from '../src/engine/types';

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
  });
});

describe('Motor de Juego - OVR y Utilidades ALPHA v0.4', () => {
  it('calcula la Media General (OVR) como promedio redondeado de las 6 habilidades de pista', () => {
    const stats = {
      velocidad: 60,
      lluvia: 50,
      ataque: 70,
      defensa: 40,
      gestion: 60,
      consistencia: 50,
      fama: 80,
      popularidad: 90,
    };
    expect(calcularMediaGeneral(stats)).toBe(55);
  });

  it('inicializa un nuevo jugador con valores ALPHA v0.4', () => {
    const estado = createInitialState('Franco Colapinto', 'Argentina', 'buenos-aires-racing', 'seed123');
    expect(estado.nombre).toBe('Franco Colapinto');
    expect(estado.nacionalidad).toBe('Argentina');
    expect(estado.edad).toBe(9);
    expect(estado.categoria).toBe('Karting Regional');
    expect(estado.seed).toBe('seed123');
    expect(estado.finalizado).toBe(false);
  });
});

describe('Motor de Juego - Filtrado de Eventos por Temporada', () => {
  it('excluye eventos ya usados en la temporada actual', () => {
    const state = createInitialState('Piloto Test', 'Argentina', 'buenos-aires-racing', 'seed_test');
    const evento: Evento = {
      id: 'evento_test_temporada',
      tipo: 'deportivo',
      peso: 10,
      titulo: 'Test',
      descripcion: 'Prueba',
      opciones: [],
    };

    expect(esEventoElegible(evento, state)).toBe(true);

    state.eventosUsadosTemporadaActual.push('evento_test_temporada');
    expect(esEventoElegible(evento, state)).toBe(false);
  });
});
