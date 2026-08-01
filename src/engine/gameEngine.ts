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
  OfertaEquipo,
} from './types';
import { createRNG } from './rng';
import { EQUIPOS_KARTING, EquipoKarting } from '../data/equiposKarting';
import { CALENDARIOS_POR_CATEGORIA, FechaCalendario } from '../data/calendarios';
import { generarNombreRival } from '../data/nombresRivales';
import { EQUIPOS_F1 } from '../data/equipos/equiposF1';
import { EQUIPOS_F2 } from '../data/equipos/equiposF2';
import { EQUIPOS_F3, EQUIPOS_FRECA, EQUIPOS_F4, EQUIPOS_FORMULA_NACIONAL } from '../data/equipos/equiposF3';

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

export function createInitialState(
  nombre: string,
  nacionalidad = 'Argentina',
  equipoKartingId?: string,
  seed?: string
): PlayerState {
  const finalSeed = seed || Math.random().toString(36).substring(2, 9);
  const rivalNombre = generarNombreRival(finalSeed);

  const equipoKartingObj: EquipoKarting =
    EQUIPOS_KARTING.find((e) => e.id === equipoKartingId) || EQUIPOS_KARTING[0];

  return {
    nombre,
    nacionalidad,
    rivalNombre,
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
      fama: equipoKartingObj.presupuestoInicial > 50 ? 35 : 25,
      popularidad: 30,
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
    ofertasPendientes: [],
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

export function esEventoElegible(evento: Evento, state: PlayerState): boolean {
  if (evento.esUnico && state.eventosVistos.includes(evento.id)) {
    return false;
  }

  if (state.eventosUsadosTemporadaActual.includes(evento.id)) {
    return false;
  }

  // Regla Bug 1: Categorías Nacionales solo 1 deportivo + max 1 extradeportivo por temporada
  const esCategoriaNacional =
    state.categoria === 'Karting Regional' ||
    state.categoria === 'Karting Nacional' ||
    state.categoria === 'Fórmula Nacional';

  if (esCategoriaNacional) {
    const deportivosUsados = state.historial.filter(
      (h) => h.temporada === state.temporada && h.categoria === state.categoria
    ).length;
    if (evento.tipo === 'deportivo' && deportivosUsados >= 1) return false;
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

  // Reducción de delta de entrenamiento a +4 (Bug 2a)
  return seleccion.map((item) => ({
    habilidad: item.key,
    titulo: item.titulo,
    descripcion: item.descripcion,
    incremento: 4,
  }));
}

export function aplicarEntrenamiento(
  state: PlayerState,
  habilidadKey: StatKey,
  incremento = 4
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
 * Genera 3 ofertas de escudería para la categoría destino (Bug 2b).
 */
export function generarOfertasEscuderias(
  state: PlayerState,
  categoriaDestino: Categoria
): OfertaEquipo[] {
  const rngSeed = `${state.seed}_offers_${state.temporada}_${categoriaDestino}`;
  const getRandom = createRNG(rngSeed);

  let poolEquipos: Array<{ id: string; nombre: string; pais?: string; nivelRendimiento: number }> = [];

  if (categoriaDestino === 'Fórmula 1') {
    poolEquipos = EQUIPOS_F1;
  } else if (categoriaDestino === 'FIA Fórmula 2') {
    poolEquipos = EQUIPOS_F2;
  } else if (categoriaDestino === 'FIA Fórmula 3') {
    poolEquipos = EQUIPOS_F3;
  } else if (categoriaDestino === 'Formula Regional Europea') {
    poolEquipos = EQUIPOS_FRECA;
  } else if (categoriaDestino.includes('Fórmula 4')) {
    poolEquipos = EQUIPOS_F4;
  } else if (categoriaDestino === 'Fórmula Nacional') {
    poolEquipos = EQUIPOS_FORMULA_NACIONAL;
  } else {
    poolEquipos = EQUIPOS_KARTING.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      pais: 'Argentina',
      nivelRendimiento: e.calidadIngenieros,
    }));
  }

  const mezclados = [...poolEquipos].sort(() => getRandom() - 0.5);
  const seleccion = mezclados.slice(0, 3);

  return seleccion.map((eq, idx) => ({
    id: eq.id,
    nombre: eq.nombre,
    categoria: categoriaDestino,
    pais: eq.pais || 'Internacional',
    nivelRendimiento: eq.nivelRendimiento,
    expectativas:
      idx === 0
        ? 'Pelear Podios y Victorias'
        : idx === 1
        ? 'Consistencia y Puntos'
        : 'Desarrollo de Monoplaza',
    prestigioFamaBonus: Math.round(eq.nivelRendimiento / 10),
  }));
}

/**
 * Aplica el declive progresivo de habilidades a partir de los 30 años (Bug 4).
 */
export function aplicarDecliveEdad(state: PlayerState): PlayerStats {
  const stats = { ...state.stats };
  if (state.edad < 30) return stats;

  let decremento = 1;
  if (state.edad >= 32 && state.edad <= 34) decremento = 2;
  if (state.edad >= 35) decremento = 3;

  const coreKeys: StatKey[] = ['velocidad', 'lluvia', 'ataque', 'defensa', 'gestion', 'consistencia'];
  coreKeys.forEach((key) => {
    stats[key] = clamp(stats[key] - decremento, 0, 100);
  });

  return stats;
}

export function simularFechaCarrera(
  state: PlayerState,
  fecha: FechaCalendario
): ResultadoFecha {
  const ovr = calcularMediaGeneral(state.stats);
  const rngSeed = `${state.seed}_f_${state.temporada}_${fecha.numeroFecha}`;
  const getRandom = createRNG(rngSeed);

  let ponderacionEfectiva = ovr;
  if (fecha.esMojado) {
    ponderacionEfectiva = Math.round(ovr * 0.6 + state.stats.lluvia * 0.4);
  }

  const ruido = (getRandom() - 0.5) * 20;
  let score = ponderacionEfectiva + ruido;
  let posicion = Math.max(1, Math.min(20, Math.round(21 - score / 5)));

  const pole = posicion === 1 && getRandom() > 0.4;
  const vueltaRapida = posicion <= 3 && getRandom() > 0.5;
  const abandono = getRandom() < 0.05;

  if (abandono) posicion = 20;

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

  const posicionFinal = Math.max(1, Math.min(10, Math.round(11 - puntosTotales / 15)));
  const siguienteCat = obtenerSiguienteCategoria(state.categoria);
  const ofertasObj = generarOfertasEscuderias(state, siguienteCat);

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
    ofertasSiguienteTemporada: ofertasObj,
  };
}

export function resolverFinDeTemporada(state: PlayerState): PlayerState {
  const resumenAño = simularCarrerasRestantes(state);
  const ovr = calcularMediaGeneral(state.stats);

  // Aplicar declive de edad a partir de los 30 años (Bug 4)
  const nuevasStats = aplicarDecliveEdad(state);

  let nuevaCategoria = state.categoria;
  const idxActual = CATEGORIAS_ORDEN.indexOf(state.categoria);

  // Progresión no lineal según OVR y podios del campeonato
  if ((ovr >= 50 || resumenAño.posicionFinal <= 5) && idxActual < CATEGORIAS_ORDEN.length - 1) {
    nuevaCategoria = CATEGORIAS_ORDEN[idxActual + 1];
  }

  const nuevaEdad = state.edad + 1;
  let finalizado = state.finalizado;
  let finalObtenido = state.finalObtenido;

  // Límite de edad máxima 38 años (Bug 4)
  if (nuevaEdad >= 38) {
    finalizado = true;
    finalObtenido = 'final-estancado-rendimiento-bajo';
  } else if (nuevaEdad >= 26 && nuevaCategoria !== 'Fórmula 1' && ovr < 50) {
    finalizado = true;
    finalObtenido = 'final-estancado-inferiores';
  }

  const ofertasGeneradas = generarOfertasEscuderias(state, nuevaCategoria);

  return {
    ...state,
    stats: nuevasStats,
    categoria: nuevaCategoria,
    temporada: state.temporada + 1,
    edad: nuevaEdad,
    eventosUsadosTemporadaActual: [],
    historialCampeonatos: [...state.historialCampeonatos, resumenAño],
    ofertasPendientes: ofertasGeneradas,
    finalizado,
    finalObtenido,
  };
}

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

  // Aplicar deltas reducidos de evento (Bug 2a)
  if (consecuencias.stats) {
    (Object.keys(consecuencias.stats) as StatKey[]).forEach((key) => {
      const delta = consecuencias.stats[key];
      if (typeof delta === 'number') {
        const deltaAjustado = Math.round(delta * 0.5); // Escalar deltas a valores suaves
        nuevasStats[key] = clamp(nuevasStats[key] + deltaAjustado, 0, 100);
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

  // Reemplazar marcador dinámico {RIVAL} en la narración de resultado
  const textoResultadoConRival = consecuencias.textoResultado.replace(
    /Nico Varela|{RIVAL}/g,
    state.rivalNombre
  );

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
        textoResultado: textoResultadoConRival,
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
