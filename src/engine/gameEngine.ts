import {
  PlayerState,
  PlayerStats,
  Evento,
  Final,
  Categoria,
  CATEGORIAS_ORDEN,
  Condicion,
  StatKey,
  OpcionEntrenamiento,
} from './types';
import { createRNG } from './rng';
import { EQUIPOS_KARTING, EquipoKarting } from '../data/equiposKarting';

/**
 * Estado inicial por defecto para un nuevo piloto de 9 años.
 */
export function createInitialState(
  nombre: string,
  nacionalidad = 'Argentina',
  equipoKartingId?: string,
  seed?: string
): PlayerState {
  const finalSeed = seed || Math.random().toString(36).substring(2, 9);
  
  // Buscar equipo de Karting o tomar por defecto el primero
  const equipoKartingObj: EquipoKarting =
    EQUIPOS_KARTING.find((e) => e.id === equipoKartingId) || EQUIPOS_KARTING[0];

  return {
    nombre,
    nacionalidad,
    edad: 9,
    temporada: 1,
    categoria: 'Karting Regional',
    equipo: equipoKartingObj.nombre,
    equipoKartingId: equipoKartingObj.id,
    stats: {
      velocidad: 45,
      lluvia: 40,
      ataque: 45,
      defensa: 45,
      gestion: 45,
      consistencia: 45,
      fama: equipoKartingObj.presupuestoInicial > 50 ? 40 : 30,
      popularidad: 35,
    },
    historial: [],
    finalizado: false,
    finalObtenido: null,
    eventosVistos: [],
    seed: finalSeed,
    juegoSucioCount: 0,
    entrenamientosRealizados: 0,
  };
}

/**
 * Clampea un valor entre un mínimo y un máximo.
 */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Evalúa si una condición se cumple con las stats actuales del piloto.
 */
export function evaluarCondicion(stats: PlayerStats, condicion: Condicion): boolean {
  const valorActual = stats[condicion.stat];
  switch (condicion.operador) {
    case '>':
      return valorActual > condicion.valor;
    case '>=':
      return valorActual >= condicion.valor;
    case '<':
      return valorActual < condicion.valor;
    case '<=':
      return valorActual <= condicion.valor;
    case '==':
      return valorActual === condicion.valor;
    default:
      return false;
  }
}

/**
 * Revisa si un evento es elegible para el jugador en su estado actual.
 */
export function esEventoElegible(evento: Evento, state: PlayerState): boolean {
  // Si es único y ya ocurrió
  if (evento.esUnico && state.eventosVistos.includes(evento.id)) {
    return false;
  }

  // Filtrar por categoría mínima
  if (evento.categoriaMinima) {
    const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);
    const idxMin = CATEGORIAS_ORDEN.indexOf(evento.categoriaMinima);
    if (idxActual < idxMin) return false;
  }

  // Filtrar por categoría máxima
  if (evento.categoriaMaxima) {
    const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);
    const idxMax = CATEGORIAS_ORDEN.indexOf(evento.categoriaMaxima);
    if (idxActual > idxMax) return false;
  }

  // Filtrar por condiciones de stats
  if (evento.condiciones && evento.condiciones.length > 0) {
    const cumplenTodas = evento.condiciones.every((cond) =>
      evaluarCondicion(state.stats, cond)
    );
    if (!cumplenTodas) return false;
  }

  return true;
}

/**
 * Selecciona un evento aleatorio de la lista elegible ponderando por su peso.
 * Utiliza un PRNG determinista basado en el seed del estado y la longitud del historial.
 */
export function seleccionarEvento(
  eventos: Evento[],
  state: PlayerState
): Evento | null {
  const elegibles = eventos.filter((e) => esEventoElegible(e, state));
  if (elegibles.length === 0) return null;

  const pesoTotal = elegibles.reduce((acc, e) => acc + e.peso, 0);
  if (pesoTotal <= 0) return null;

  const rngSeed = `${state.seed}_step_${state.historial.length}`;
  const getRandom = createRNG(rngSeed);
  const randomVal = getRandom() * pesoTotal;

  let acumulado = 0;
  for (const evento of elegibles) {
    acumulado += evento.peso;
    if (randomVal <= acumulado) {
      return evento;
    }
  }

  return elegibles[elegibles.length - 1];
}

/**
 * Avanza a la siguiente categoría en la jerarquía.
 */
export function obtenerSiguienteCategoria(catActual: Categoria): Categoria {
  const idx = CATEGORIAS_ORDEN.indexOf(catActual);
  if (idx >= 0 && idx < CATEGORIAS_ORDEN.length - 1) {
    return CATEGORIAS_ORDEN[idx + 1];
  }
  return catActual;
}

/**
 * Genera 3 o 4 opciones de entrenamiento únicas de las 6 habilidades principales.
 */
export function obtenerOpcionesEntrenamiento(state: PlayerState): OpcionEntrenamiento[] {
  const habilidadesBase: Array<{
    key: keyof Pick<PlayerStats, 'velocidad' | 'lluvia' | 'ataque' | 'defensa' | 'gestion' | 'consistencia'>;
    titulo: string;
    descripcion: string;
  }> = [
    {
      key: 'velocidad',
      titulo: 'Telemetría y Vuelta Rápida',
      descripcion: 'Entrenamiento intensivo en simulación de clasificación para rascar décimas.',
    },
    {
      key: 'lluvia',
      titulo: 'Control en Asfalto Mojado',
      descripcion: 'Prácticas sobre pista regada artificialmente afinando la sensibilidad del acelerador.',
    },
    {
      key: 'ataque',
      titulo: 'Tácticas de Sobrepaso',
      descripcion: 'Maniobras al límite en el punto de frenada para ganar posiciones sin tocar chasis.',
    },
    {
      key: 'defensa',
      titulo: 'Cobertura de Trazadas',
      descripcion: 'Entrenamiento de protección de radios de curva para contención de rivales rápidos.',
    },
    {
      key: 'gestion',
      titulo: 'Conservación de Neumáticos',
      descripcion: 'Prácticas de rodaje constante reduciendo el desgaste de goma y combustible.',
    },
    {
      key: 'consistencia',
      titulo: 'Tandas Largas de Carrera',
      descripcion: 'Simulacros de distancia completa de carrera buscando vueltas calcadas.',
    },
  ];

  const rngSeed = `${state.seed}_train_${state.temporada}`;
  const getRandom = createRNG(rngSeed);

  // Mezclar array deterministamente y seleccionar 3 o 4
  const mezcladas = [...habilidadesBase].sort(() => getRandom() - 0.5);
  const seleccion = mezcladas.slice(0, getRandom() > 0.5 ? 4 : 3);

  return seleccion.map((item) => ({
    habilidad: item.key,
    titulo: item.titulo,
    descripcion: item.descripcion,
    incremento: 7,
  }));
}

/**
 * Aplica la opción de entrenamiento elegida antes de arrancar la temporada.
 */
export function aplicarEntrenamiento(
  state: PlayerState,
  habilidadKey: StatKey,
  incremento = 7
): PlayerState {
  const nuevasStats = { ...state.stats };
  nuevasStats[habilidadKey] = clamp(nuevasStats[habilidadKey] + incremento, 0, 100);

  return {
    ...state,
    stats: nuevasStats,
    entrenamientosRealizados: state.entrenamientosRealizados + 1,
  };
}

/**
 * Resolución no lineal al cierre de temporada (evalúa permanencia, cambio de equipo o ascenso).
 */
export function resolverFinDeTemporada(state: PlayerState): PlayerState {
  const rendimientoPromedio =
    (state.stats.velocidad +
      state.stats.consistencia +
      state.stats.ataque +
      state.stats.defensa +
      state.stats.lluvia +
      state.stats.gestion) /
    6;

  let nuevaCategoria = state.categoria;
  const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);

  // Progresión no lineal: si el rendimiento es suficiente o pasaron 2 temporadas en la misma categoría
  if ((rendimientoPromedio >= 50 || state.temporada % 2 === 0) && idxActual < CATEGORIAS_ORDEN.length - 1) {
    nuevaCategoria = CATEGORIAS_ORDEN[idxActual + 1];
  }

  const nuevaEdad = state.edad + 1;
  let finalizado = state.finalizado;
  let finalObtenido = state.finalObtenido;

  if (nuevaEdad >= 26 && nuevaCategoria !== 'Fórmula 1') {
    finalizado = true;
    finalObtenido = 'final-estancado-inferiores';
  }

  return {
    ...state,
    categoria: nuevaCategoria,
    temporada: state.temporada + 1,
    edad: nuevaEdad,
    finalizado,
    finalObtenido,
  };
}

/**
 * Aplica la opción elegida por el jugador y retorna el nuevo PlayerState.
 */
export function aplicarOpcion(
  state: PlayerState,
  evento: Evento,
  opcionIndex: number,
  finales: Final[] = []
): PlayerState {
  if (state.finalizado) return state;

  const opcion = evento.opciones[opcionIndex];
  if (!opcion) {
    throw new Error(`La opción ${opcionIndex} no existe en el evento ${evento.id}`);
  }

  const consecuencias = opcion.consecuencias;
  const nuevasStats: PlayerStats = { ...state.stats };

  // Aplicar deltas con clamp [0, 100]
  if (consecuencias.stats) {
    (Object.keys(consecuencias.stats) as StatKey[]).forEach((key) => {
      const delta = consecuencias.stats[key];
      if (typeof delta === 'number') {
        nuevasStats[key] = clamp(nuevasStats[key] + delta, 0, 100);
      }
    });
  }

  // Actualizar categoría y equipo si la opción lo indica
  let nuevaCategoria = state.categoria;
  if (consecuencias.avanzaCategoria) {
    nuevaCategoria = obtenerSiguienteCategoria(state.categoria);
  }

  const nuevoEquipo =
    consecuencias.cambioEquipo !== undefined
      ? consecuencias.cambioEquipo
      : state.equipo;

  const nuevoJuegoSucioCount =
    state.juegoSucioCount + (consecuencias.incrementaJuegoSucio ? 1 : 0);

  let estadoConHistorial: PlayerState = {
    ...state,
    stats: nuevasStats,
    categoria: nuevaCategoria,
    equipo: nuevoEquipo,
    eventosVistos: [...state.eventosVistos, evento.id],
    juegoSucioCount: nuevoJuegoSucioCount,
    historial: [
      ...state.historial,
      {
        eventoId: evento.id,
        eventoTitulo: evento.titulo,
        opcionTexto: opcion.texto,
        textoResultado: consecuencias.textoResultado,
        statsDeltas: consecuencias.stats || {},
        categoria: state.categoria,
        temporada: state.temporada,
      },
    ],
  };

  // Cada 3 eventos jugados o si avanza categoría explícitamente, resolver avance de temporada/edad
  if (consecuencias.avanzaCategoria || estadoConHistorial.historial.length % 3 === 0) {
    estadoConHistorial = resolverFinDeTemporada(estadoConHistorial);
  }

  // Evaluar finales
  return evaluarFinales(estadoConHistorial, finales);
}

/**
 * Comprueba si se cumplen condiciones de algún final.
 */
export function evaluarFinales(state: PlayerState, finales: Final[]): PlayerState {
  for (const finalObj of finales) {
    if (finalObj.evaluar(state)) {
      return {
        ...state,
        finalizado: true,
        finalObtenido: finalObj.id,
      };
    }
  }
  return state;
}
