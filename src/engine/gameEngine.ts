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
  ResultadoFecha,
  ResumenCampeonato,
} from './types';
import { createRNG } from './rng';
import { EQUIPOS_KARTING, EquipoKarting } from '../data/equiposKarting';
import { CALENDARIOS_POR_CATEGORIA, FechaCalendario } from '../data/calendarios';

/**
 * Calcula la Media General (OVR) como promedio de las 6 habilidades de pista, redondeado.
 */
export function calcularMediaGeneral(stats: PlayerStats): number {
  const suma =
    stats.velocidad +
    stats.lluvia +
    stats.ataque +
    stats.defensa +
    stats.gestion +
    stats.consistencia;
  return Math.round(suma / 6);
}

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
    eventosUsadosTemporadaActual: [],
    seed: finalSeed,
    juegoSucioCount: 0,
    entrenamientosRealizados: 0,
    historialCampeonatos: [],
    campeonatoActualFechas: [],
  };
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

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
 * Filtra eventos elegibles (excluyendo eventos usados en la temporada actual y únicos vistos).
 */
export function esEventoElegible(evento: Evento, state: PlayerState): boolean {
  if (evento.esUnico && state.eventosVistos.includes(evento.id)) {
    return false;
  }

  if (state.eventosUsadosTemporadaActual.includes(evento.id)) {
    return false;
  }

  if (evento.categoriaMinima) {
    const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);
    const idxMin = CATEGORIAS_ORDEN.indexOf(evento.categoriaMinima);
    if (idxActual < idxMin) return false;
  }

  if (evento.categoriaMaxima) {
    const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);
    const idxMax = CATEGORIAS_ORDEN.indexOf(evento.categoriaMaxima);
    if (idxActual > idxMax) return false;
  }

  if (evento.condiciones && evento.condiciones.length > 0) {
    const cumplenTodas = evento.condiciones.every((cond) =>
      evaluarCondicion(state.stats, cond)
    );
    if (!cumplenTodas) return false;
  }

  return true;
}

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

export function obtenerSiguienteCategoria(catActual: Categoria): Categoria {
  const idx = CATEGORIAS_ORDEN.indexOf(catActual);
  if (idx >= 0 && idx < CATEGORIAS_ORDEN.length - 1) {
    return CATEGORIAS_ORDEN[idx + 1];
  }
  return catActual;
}

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

  const mezcladas = [...habilidadesBase].sort(() => getRandom() - 0.5);
  const seleccion = mezcladas.slice(0, getRandom() > 0.5 ? 4 : 3);

  return seleccion.map((item) => ({
    habilidad: item.key,
    titulo: item.titulo,
    descripcion: item.descripcion,
    incremento: 7,
  }));
}

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
 * Simula el resultado de una fecha del campeonato no jugada.
 */
export function simularFechaCarrera(
  state: PlayerState,
  fecha: FechaCalendario
): ResultadoFecha {
  const ovr = calcularMediaGeneral(state.stats);
  const rngSeed = `${state.seed}_f_${state.temporada}_${fecha.numeroFecha}`;
  const getRandom = createRNG(rngSeed);

  // Ponderar habilidad de lluvia si la fecha es mojada
  let ponderacionEfectiva = ovr;
  if (fecha.esMojado) {
    ponderacionEfectiva = Math.round(ovr * 0.6 + state.stats.lluvia * 0.4);
  }

  // Posición basada en rendimiento (1 a 20)
  const ruido = (getRandom() - 0.5) * 20;
  let score = ponderacionEfectiva + ruido;
  let posicion = Math.max(1, Math.min(20, Math.round(21 - score / 5)));

  const pole = posicion === 1 && getRandom() > 0.4;
  const vueltaRapida = posicion <= 3 && getRandom() > 0.5;
  const abandono = getRandom() < 0.05; // 5% abandono mecánico tenue

  if (abandono) posicion = 20;

  // Puntos F1 / Motorsport estándar
  const tablaPuntos: Record<number, number> = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };
  const puntos = (tablaPuntos[posicion] || 0) + (vueltaRapida && posicion <= 10 ? 1 : 0);

  return {
    numeroFecha: fecha.numeroFecha,
    nombreGranPremio: fecha.nombreGranPremio,
    circuito: fecha.circuito,
    posicion,
    pole,
    vueltaRapida,
    abandono,
    esCarreraClave: fecha.esCarreraClave,
    puntos,
  };
}

/**
 * Simula la temporada completa resolviendo fechas jugadas y no jugadas.
 */
export function simularCarrerasRestantes(state: PlayerState): ResumenCampeonato {
  const calendario = CALENDARIOS_POR_CATEGORIA[state.categoria] || CALENDARIOS_POR_CATEGORIA['Karting Regional'];
  const fechasResultados: ResultadoFecha[] = calendario.map((fecha) =>
    simularFechaCarrera(state, fecha)
  );

  const victorias = fechasResultados.filter((f) => f.posicion === 1).length;
  const podios = fechasResultados.filter((f) => f.posicion <= 3).length;
  const poles = fechasResultados.filter((f) => f.pole).length;
  const vueltasRapidas = fechasResultados.filter((f) => f.vueltaRapida).length;
  const abandonos = fechasResultados.filter((f) => f.abandono).length;
  const puntosTotales = fechasResultados.reduce((acc, f) => acc + f.puntos, 0);

  // Posición estimada en campeonato (1 a 10)
  const posicionFinal = Math.max(1, Math.min(10, Math.round(11 - puntosTotales / 15)));

  return {
    temporada: state.temporada,
    categoria: state.categoria,
    equipo: state.equipo || 'Independiente',
    posicionFinal,
    puntosTotales,
    victorias,
    podios,
    poles,
    vueltasRapidas,
    abandonos,
    fechas: fechasResultados,
    ofertasSiguienteTemporada: [
      `Oferta renovación ${state.equipo}`,
      `Propuesta contrato ${obtenerSiguienteCategoria(state.categoria)}`,
    ],
  };
}

/**
 * Resolución al cierre de temporada (resetea eventos del año, calcula campeonato y evalúa ascensos).
 */
export function resolverFinDeTemporada(state: PlayerState): PlayerState {
  const resumenAño = simularCarrerasRestantes(state);
  const ovr = calcularMediaGeneral(state.stats);

  let nuevaCategoria = state.categoria;
  const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);

  // Progresión no lineal según OVR y podios del campeonato
  if ((ovr >= 52 || resumenAño.posicionFinal <= 3) && idxActual < CATEGORIAS_ORDEN.length - 1) {
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
    eventosUsadosTemporadaActual: [], // Reset estacional
    historialCampeonatos: [...state.historialCampeonatos, resumenAño],
    finalizado,
    finalObtenido,
  };
}

/**
 * Aplica la opción elegida por el jugador y actualiza el estado.
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

  if (consecuencias.stats) {
    (Object.keys(consecuencias.stats) as StatKey[]).forEach((key) => {
      const delta = consecuencias.stats[key];
      if (typeof delta === 'number') {
        nuevasStats[key] = clamp(nuevasStats[key] + delta, 0, 100);
      }
    });
  }

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
    eventosUsadosTemporadaActual: [...state.eventosUsadosTemporadaActual, evento.id],
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

  if (consecuencias.avanzaCategoria || estadoConHistorial.historial.length % 3 === 0) {
    estadoConHistorial = resolverFinDeTemporada(estadoConHistorial);
  }

  return evaluarFinales(estadoConHistorial, finales);
}

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
