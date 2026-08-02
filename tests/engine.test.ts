import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  esEventoElegible,
  calcularMediaGeneral,
  interpolarTexto,
  cantidadCarrerasClave,
} from '../src/engine/gameEngine';
import { createRNG } from '../src/engine/rng';
import { evaluarArquetipoFinal } from '../src/data/arquetiposFinales';
import { Evento } from '../src/engine/types';
import { useGameStore } from '../src/store/useGameStore';

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

describe('Motor de Juego - OVR y Utilidades ALPHA v0.6.0', () => {
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

  it('inicializa un nuevo jugador con valores ALPHA v0.6.0', () => {
    const estado = createInitialState('Franco Colapinto', 'Argentina', 'buenos-aires-racing', 'seed123');
    expect(estado.nombre).toBe('Franco Colapinto');
    expect(estado.nacionalidad).toBe('Argentina');
    expect(estado.edad).toBe(9);
    expect(estado.categoria).toBe('Karting Regional');
    expect(estado.seed).toBe('seed123');
    expect(estado.finalizado).toBe(false);
    expect(estado.tagsHistorial).toBeDefined();
  });
});

describe('Arquetipos de Finales Dinámicos', () => {
  it('evalúa dinámicamente un arquetipo final e interpola el nombre del piloto y equipo', () => {
    const state = createInitialState('Franco Colapinto', 'Argentina', 'buenos-aires-racing', 'seed_test');
    state.categoria = 'Fórmula 1';
    state.equipo = 'Oracle Red Bull Racing';
    state.stats.velocidad = 85;
    state.stats.consistencia = 80;

    const res = evaluarArquetipoFinal(state);
    expect(res.titulo).toBeDefined();
    expect(res.descripcion).toContain('Franco Colapinto');
    expect(res.esExito).toBe(true);
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

describe('Interpolación de Placeholders', () => {
  it('reemplaza correctamente {RIVAL}, {EQUIPO}, {PILOTO}, {EDAD} y Nico Varela', () => {
    const state = createInitialState('Ayrton Senna', 'Brasil', 'buenos-aires-racing', 'seed_interp');
    state.equipo = 'McLaren F1 Team';
    state.edad = 25;
    state.rivalNombre = 'Alain Prost';

    const texto = 'Enfrentamiento entre {PILOTO} y {RIVAL} de {EQUIPO} a los {EDAD} años. Nico Varela se quedó atrás.';
    const res = interpolarTexto(texto, state);
    expect(res).toBe('Enfrentamiento entre Ayrton Senna y Alain Prost de McLaren F1 Team a los 25 años. Alain Prost se quedó atrás.');
    expect(res).not.toContain('{RIVAL}');
    expect(res).not.toContain('{EQUIPO}');
    expect(res).not.toContain('{PILOTO}');
    expect(res).not.toContain('{EDAD}');
    expect(res).not.toContain('Nico Varela');
  });
});

describe('Reglas de Negocio - Eventos por Temporada (Sección 4)', () => {
  it('retorna exactamente 1 evento clave para categorías argentinas y 3 para internacionales', () => {
    expect(cantidadCarrerasClave('Karting Regional')).toBe(1);
    expect(cantidadCarrerasClave('Karting Nacional')).toBe(1);
    expect(cantidadCarrerasClave('Fórmula Nacional')).toBe(1);
    expect(cantidadCarrerasClave('Fórmula 4 Brasil')).toBe(3);
    expect(cantidadCarrerasClave('Fórmula 4 España')).toBe(3);
    expect(cantidadCarrerasClave('Fórmula 4 Italia')).toBe(3);
    expect(cantidadCarrerasClave('Formula Regional Europea')).toBe(3);
    expect(cantidadCarrerasClave('FIA Fórmula 3')).toBe(3);
    expect(cantidadCarrerasClave('FIA Fórmula 2')).toBe(3);
    expect(cantidadCarrerasClave('Fórmula 1')).toBe(3);
  });

  it('valida en partida real que las categorías argentinas ejecutan exactamente 1 evento por temporada e internacionales 3', () => {
    const store = useGameStore.getState();
    store.iniciarJuego('Test Piloto', 'Argentina', 'buenos-aires-racing', 'seed_test_events_count');

    for (let t = 1; t <= 15; t++) {
      const state = useGameStore.getState().playerState;
      if (!state || state.finalizado) break;

      const catActual = state.categoria;
      const expectedCount = cantidadCarrerasClave(catActual);

      if (useGameStore.getState().pantallaActual === 'entrenamiento') {
        const op = useGameStore.getState().opcionesEntrenamiento[0];
        store.elegirEntrenamiento(op.habilidad);
      }

      if (useGameStore.getState().pantallaActual === 'ofertasEquipos') {
        const of = useGameStore.getState().playerState!.ofertasPendientes[0];
        store.elegirOfertaEquipo(of);
      }

      let eventosEnEstaTemp = 0;
      while (useGameStore.getState().pantallaActual === 'juego') {
        eventosEnEstaTemp++;
        store.elegirOpcion(0);
        store.continuarSiguienteEvento();
      }

      expect(eventosEnEstaTemp).toBe(expectedCount);

      if (useGameStore.getState().pantallaActual === 'resumenTemporada') {
        store.avanzarDesdeResumenTemporada();
      }
    }
  });
});

describe('Prevención de Loops y Simulación Continua de Jugador Real (Sección 7)', () => {
  it('juega al menos 15 temporadas seguidas sin loops ni quedar atascado en fases previas', () => {
    const store = useGameStore.getState();
    store.iniciarJuego('Piloto Resistencia', 'Argentina', 'buenos-aires-racing', 'seed_loop_test_15');

    let pasosMaximos = 300;
    let pasosContados = 0;
    let temporadasAlcanzadas = new Set<number>();

    while (pasosContados < pasosMaximos) {
      pasosContados++;
      const currentScreen = useGameStore.getState().pantallaActual;
      const state = useGameStore.getState().playerState;

      if (!state || state.finalizado || currentScreen === 'resultado') break;

      temporadasAlcanzadas.add(state.temporada);

      if (currentScreen === 'entrenamiento') {
        const op = useGameStore.getState().opcionesEntrenamiento[0];
        store.elegirEntrenamiento(op.habilidad);
      } else if (currentScreen === 'ofertasEquipos') {
        const of = useGameStore.getState().playerState!.ofertasPendientes[0];
        store.elegirOfertaEquipo(of);
      } else if (currentScreen === 'juego') {
        store.elegirOpcion(0);
        store.continuarSiguienteEvento();
      } else if (currentScreen === 'resumenTemporada') {
        store.avanzarDesdeResumenTemporada();
      }
    }

    expect(temporadasAlcanzadas.size).toBeGreaterThanOrEqual(15);
    expect(pasosContados).toBeLessThan(pasosMaximos);
  });
});
