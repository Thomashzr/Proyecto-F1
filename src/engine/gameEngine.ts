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
  OpcionConsecuencia,
  Contrato,
  SituacionActual,
} from './types';
import { createRNG } from './rng';
import { EQUIPOS_KARTING, EquipoKarting } from '../data/equiposKarting';
import { CALENDARIOS_POR_CATEGORIA, FechaCalendario } from '../data/calendarios';
import { generarNombreRival } from '../data/nombresRivales';
import { EQUIPOS_F1 } from '../data/equipos/equiposF1';
import { EQUIPOS_F2 } from '../data/equipos/equiposF2';
import { EQUIPOS_F3, EQUIPOS_FRECA, EQUIPOS_F4, EQUIPOS_FORMULA_NACIONAL } from '../data/equipos/equiposF3';
import { evaluarArquetipoFinal } from '../data/arquetiposFinales';

export function calcularDuracionContrato(edad: number, ovr: number): number {
  if (edad < 18) {
    return ovr >= 60 ? 2 : 1;
  } else if (edad <= 24) {
    return ovr >= 75 ? 3 : 2;
  } else if (edad <= 32) {
    return ovr >= 85 ? 4 : ovr >= 70 ? 3 : 2;
  } else {
    return ovr >= 75 ? 2 : 1;
  }
}

export function crearContrato(
  equipo: string,
  categoria: Categoria,
  temporadaInicio: number,
  edad: number,
  ovr: number,
  duracionCustom?: number
): Contrato {
  const duracionTotal = duracionCustom || calcularDuracionContrato(edad, ovr);
  return {
    equipo,
    categoria,
    temporadaInicio,
    duracionTotal,
    duracionRestante: duracionTotal,
    temporadaVencimiento: temporadaInicio + duracionTotal,
  };
}

export function crearSituacionActual(
  categoria: Categoria,
  equipo: string,
  temporadaInicio: number,
  edad: number,
  ovr: number,
  duracionCustom?: number
): SituacionActual {
  const contrato = crearContrato(equipo, categoria, temporadaInicio, edad, ovr, duracionCustom);
  return {
    categoria,
    equipo,
    contrato,
  };
}

export const CURVAS_PROBABILIDAD_FAMA_POPULARIDAD = {
  acertada: { probPositivo: 0.80, probNeutro: 0.15, probNegativo: 0.05 },
  intermedia: { probPositivo: 0.25, probNeutro: 0.50, probNegativo: 0.25 },
  desacertada: { probPositivo: 0.10, probNeutro: 0.20, probNegativo: 0.70 },
};

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

  const situacionInicial = crearSituacionActual(
    'Karting Regional',
    equipoKartingObj.nombre,
    1,
    9,
    45,
    1
  );

  return {
    nombre,
    nacionalidad,
    rivalNombre,
    edad: 9,
    temporada: 1,
    situacionActual: situacionInicial,
    categoria: situacionInicial.categoria,
    equipo: situacionInicial.equipo,
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
    tagsHistorial: {
      lealtadEquipo: 1,
      ordenesAcatadas: 0,
      ordenesIgnoradas: 0,
      escandalosMediaticos: 0,
    },
    superlicenciaObtenida: false,
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

export function cantidadCarrerasClave(categoria: Categoria): number {
  if (
    categoria === 'Karting Regional' ||
    categoria === 'Karting Nacional' ||
    categoria === 'Fórmula Nacional'
  ) {
    return 1;
  }
  return 3;
}

export function haOcurridoEnUltimasTemporadas(
  evento: Evento,
  state: PlayerState,
  cooldownTemporadas: number = 2
): boolean {
  if (evento.personajeRecurrente) {
    return false;
  }

  const apariciones = state.historial.filter((h) => h.eventoId === evento.id);
  if (apariciones.length === 0) return false;

  const ultimaTemporadaAparicion = Math.max(...apariciones.map((h) => h.temporada));
  return state.temporada - ultimaTemporadaAparicion <= cooldownTemporadas;
}

export function esEventoElegible(
  evento: Evento,
  state: PlayerState,
  ignorarCooldown = false
): boolean {
  if (evento.esUnico && state.eventosVistos.includes(evento.id)) {
    return false;
  }

  const catActual = state.situacionActual ? state.situacionActual.categoria : state.categoria;
  const tieneSuperlicencia = state.superlicenciaObtenida || (state.tagsHistorial && state.tagsHistorial['superlicenciaObtenida'] > 0);

  if (evento.id.includes('superlicencia') && (catActual === 'Fórmula 1' || tieneSuperlicencia)) {
    return false;
  }

  if (state.eventosUsadosTemporadaActual.includes(evento.id)) {
    return false;
  }

  const maxEventos = cantidadCarrerasClave(state.categoria);
  if (state.eventosUsadosTemporadaActual.length >= maxEventos) {
    return false;
  }

  if (!ignorarCooldown && haOcurridoEnUltimasTemporadas(evento, state, 2)) {
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

export function interpolarTexto(
  texto: string,
  state: { rivalNombre: string; equipo?: string | null; nombre: string; edad?: number; categoria?: string }
): string {
  if (!texto) return '';
  const equipoNombre = state.equipo || 'tu equipo';
  const rivalNombre = state.rivalNombre || 'tu rival';
  const pilotoNombre = state.nombre || 'Piloto';
  const edadStr = state.edad !== undefined ? state.edad.toString() : '';

  return texto
    .replace(/\{RIVAL\}/gi, rivalNombre)
    .replace(/Nico Varela/g, rivalNombre)
    .replace(/\{EQUIPO\}/gi, equipoNombre)
    .replace(/\{PILOTO\}/gi, pilotoNombre)
    .replace(/\{NOMBRE\}/gi, pilotoNombre)
    .replace(/\{EDAD\}/gi, edadStr);
}

export function interpolarEvento(evento: Evento, state: PlayerState): Evento {
  return {
    ...evento,
    personajeRecurrente: evento.personajeRecurrente
      ? interpolarTexto(evento.personajeRecurrente, state)
      : undefined,
    titulo: interpolarTexto(evento.titulo, state),
    descripcion: interpolarTexto(evento.descripcion, state),
    opciones: evento.opciones.map((opcion) => ({
      ...opcion,
      texto: interpolarTexto(opcion.texto, state),
      consecuencias: {
        ...opcion.consecuencias,
        textoResultado: interpolarTexto(opcion.consecuencias.textoResultado, state),
      },
    })),
  };
}

export function seleccionarEvento(
  eventos: Evento[],
  state: PlayerState
): Evento | null {
  let elegibles = eventos.filter((e) => esEventoElegible(e, state, false));
  if (elegibles.length === 0) {
    elegibles = eventos.filter((e) => esEventoElegible(e, state, true));
  }
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
      return interpolarEvento(evento, state);
    }
  }

  return interpolarEvento(elegibles[elegibles.length - 1], state);
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

export function generarOfertasEscuderias(
  state: PlayerState,
  categoriaDestino: Categoria
): OfertaEquipo[] {
  const ovr = calcularMediaGeneral(state.stats);
  let catEfectiva = categoriaDestino;

  const tieneSuperlicencia =
    state.superlicenciaObtenida || (state.tagsHistorial && state.tagsHistorial['superlicenciaObtenida'] > 0);
  
  const catActual = state.situacionActual ? state.situacionActual.categoria : state.categoria;
  if (tieneSuperlicencia && catActual !== 'Fórmula 1' && (ovr >= 50 || state.stats.velocidad >= 65)) {
    catEfectiva = 'Fórmula 1';
  }

  const rngSeed = `${state.seed}_offers_${state.temporada}_${catEfectiva}`;
  const getRandom = createRNG(rngSeed);

  let poolEquipos: Array<{ id: string; nombre: string; pais?: string; nivelRendimiento: number }> = [];

  if (catEfectiva === 'Fórmula 1') {
    poolEquipos = EQUIPOS_F1;
  } else if (catEfectiva === 'FIA Fórmula 2') {
    poolEquipos = EQUIPOS_F2;
  } else if (catEfectiva === 'FIA Fórmula 3') {
    poolEquipos = EQUIPOS_F3;
  } else if (catEfectiva === 'Formula Regional Europea') {
    poolEquipos = EQUIPOS_FRECA;
  } else if (catEfectiva.includes('Fórmula 4')) {
    poolEquipos = EQUIPOS_F4;
  } else if (catEfectiva === 'Fórmula Nacional') {
    poolEquipos = EQUIPOS_FORMULA_NACIONAL;
  } else {
    poolEquipos = EQUIPOS_KARTING.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      pais: 'Argentina',
      nivelRendimiento: e.calidadIngenieros,
    }));
  }

  const escandalos = state.tagsHistorial['escandalosMediaticos'] || 0;
  if (escandalos >= 2) {
    poolEquipos = poolEquipos.filter((e) => e.nivelRendimiento <= 88);
  }

  const mezclados = [...poolEquipos].sort(() => getRandom() - 0.5);
  const seleccion = mezclados.slice(0, 3);

  const duracionDur = calcularDuracionContrato(state.edad + 1, ovr);

  const ofertasNuevas: OfertaEquipo[] = seleccion.map((eq, idx) => ({
    id: eq.id,
    nombre: eq.nombre,
    categoria: catEfectiva,
    pais: eq.pais || 'Internacional',
    nivelRendimiento: eq.nivelRendimiento,
    expectativas:
      idx === 0
        ? 'Pelear Podios y Victorias'
        : idx === 1
        ? 'Consistencia y Puntos'
        : 'Desarrollo de Monoplaza',
    prestigioFamaBonus: Math.round(eq.nivelRendimiento / 10),
    duracionContrato: duracionDur,
  }));

  const equipoActual = state.situacionActual ? state.situacionActual.equipo : (state.equipo || 'Escudería Actual');
  const ofertasFinales: OfertaEquipo[] = [...ofertasNuevas];

  if (catEfectiva === catActual) {
    const ofertaContinuidad: OfertaEquipo = {
      id: 'continuidad-equipo-actual',
      nombre: equipoActual,
      categoria: catActual,
      pais: 'Actual',
      nivelRendimiento: 80,
      expectativas: 'Consolidación de Contrato',
      prestigioFamaBonus: 5,
      esContinuidad: true,
      duracionContrato: duracionDur,
    };
    ofertasFinales.unshift(ofertaContinuidad);
  }

  return ofertasFinales;
}

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
  fecha: FechaCalendario,
  modificadorScore = 0
): ResultadoFecha {
  const ovr = calcularMediaGeneral(state.stats);
  const rngSeed = `${state.seed}_f_${state.temporada}_${fecha.numeroFecha}`;
  const getRandom = createRNG(rngSeed);

  let ponderacionEfectiva = ovr;
  if (fecha.esMojado) {
    ponderacionEfectiva = Math.round(ovr * 0.6 + state.stats.lluvia * 0.4);
  }

  const ruido = (getRandom() - 0.5) * 20;
  let score = ponderacionEfectiva + ruido + modificadorScore;
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
    esMojado: fecha.esMojado,
    puntos,
  };
}

export function simularCarrerasRestantes(
  state: PlayerState,
  modificadoresMinijuegos: Record<number, number> = {}
): ResumenCampeonato {
  const catActual = state.situacionActual ? state.situacionActual.categoria : state.categoria;
  const equipoActual = state.situacionActual ? state.situacionActual.equipo : (state.equipo || 'Independiente');
  const calendario = CALENDARIOS_POR_CATEGORIA[catActual] || CALENDARIOS_POR_CATEGORIA['Karting Regional'];
  const fechasResultados: ResultadoFecha[] = calendario.map((fecha) =>
    simularFechaCarrera(state, fecha, modificadoresMinijuegos[fecha.numeroFecha] || 0)
  );

  const victorias = fechasResultados.filter((f) => f.posicion === 1).length;
  const podios = fechasResultados.filter((f) => f.posicion <= 3).length;
  const poles = fechasResultados.filter((f) => f.pole).length;
  const vueltasRapidas = fechasResultados.filter((f) => f.vueltaRapida).length;
  const abandonos = fechasResultados.filter((f) => f.abandono).length;
  const puntosTotales = fechasResultados.reduce((acc, f) => acc + f.puntos, 0);

  const posicionFinal = Math.max(1, Math.min(10, Math.round(11 - puntosTotales / 15)));
  const siguienteCat = obtenerSiguienteCategoria(catActual);
  const ofertasObj = generarOfertasEscuderias(state, siguienteCat);

  return {
    temporada: state.temporada,
    categoria: catActual,
    equipo: equipoActual,
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

export function resolverFinDeTemporada(
  state: PlayerState,
  modificadoresMinijuegos: Record<number, number> = {}
): PlayerState {
  const resumenAño = simularCarrerasRestantes(state, modificadoresMinijuegos);
  const ovr = calcularMediaGeneral(state.stats);
  const nuevasStats = aplicarDecliveEdad(state);

  const catActual = state.situacionActual ? state.situacionActual.categoria : state.categoria;
  const equipoActual = state.situacionActual ? state.situacionActual.equipo : (state.equipo || 'Independiente');

  let nuevaCategoria = catActual;
  const idxActual = CATEGORIAS_ORDEN.indexOf(catActual);

  if ((ovr >= 50 || resumenAño.posicionFinal <= 5) && idxActual < CATEGORIAS_ORDEN.length - 1) {
    nuevaCategoria = CATEGORIAS_ORDEN[idxActual + 1];
  }

  const nuevaEdad = state.edad + 1;
  const nuevaTemporada = state.temporada + 1;
  let finalizado = state.finalizado;
  let finalObtenido = state.finalObtenido;

  if (nuevaEdad >= 38) {
    finalizado = true;
  } else if (nuevaEdad >= 28 && nuevaCategoria !== 'Fórmula 1' && ovr < 45) {
    finalizado = true;
    finalObtenido = 'final-estancado-inferiores';
  }

  const contratoActual = state.situacionActual ? state.situacionActual.contrato : crearContrato(equipoActual, catActual, state.temporada, state.edad, ovr, 1);
  const duracionRestanteNueva = contratoActual.temporadaVencimiento - nuevaTemporada;
  const contratoVencido = duracionRestanteNueva <= 0;
  const cambioCategoria = nuevaCategoria !== catActual;
  const tieneSuperlicenciaF1 = (state.superlicenciaObtenida || (state.tagsHistorial && state.tagsHistorial['superlicenciaObtenida'] > 0)) && catActual !== 'Fórmula 1' && ovr >= 50;

  let ofertasGeneradas: OfertaEquipo[] = [];
  let situacionSiguiente: SituacionActual = state.situacionActual;

  if (contratoVencido || cambioCategoria || tieneSuperlicenciaF1) {
    ofertasGeneradas = generarOfertasEscuderias(state, nuevaCategoria);
  } else {
    const contratoActualizado: Contrato = {
      ...contratoActual,
      duracionRestante: duracionRestanteNueva,
    };
    situacionSiguiente = {
      categoria: catActual,
      equipo: equipoActual,
      contrato: contratoActualizado,
    };
  }

  return {
    ...state,
    stats: nuevasStats,
    situacionActual: situacionSiguiente,
    categoria: situacionSiguiente.categoria,
    equipo: situacionSiguiente.equipo,
    temporada: nuevaTemporada,
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

  let consecuencias: OpcionConsecuencia = opcion.consecuencias;

  // Resolución de consecuencias probabilísticas (B.3)
  if (consecuencias.resultadosProbabilisticos && consecuencias.resultadosProbabilisticos.length > 0) {
    const rngSeed = `${state.seed}_prob_${state.historial.length}`;
    const getRandom = createRNG(rngSeed);
    const roll = getRandom();
    let acumulado = 0;
    for (const item of consecuencias.resultadosProbabilisticos) {
      acumulado += item.probabilidad;
      if (roll <= acumulado) {
        consecuencias = item.consecuencia;
        break;
      }
    }
  }

  // Rediseño de resolución probabilística en 3 niveles para eventos de Fama/Popularidad (Parte E.2)
  if (
    evento.categoriaEvento === 'prensa' ||
    evento.categoriaEvento === 'mercado' ||
    (opcion.consecuencias.stats && (opcion.consecuencias.stats.fama !== undefined || opcion.consecuencias.stats.popularidad !== undefined))
  ) {
    const rngSeed = `${state.seed}_fama_${state.historial.length}_${evento.id}`;
    const getRandom = createRNG(rngSeed);
    
    let nivelRespuesta: 'acertada' | 'intermedia' | 'desacertada' = 'intermedia';
    const numOpciones = evento.opciones.length;
    if (numOpciones === 2) {
      const esOpcion0Acertada = getRandom() < 0.5;
      if (opcionIndex === 0) {
        nivelRespuesta = esOpcion0Acertada ? 'acertada' : 'desacertada';
      } else {
        nivelRespuesta = esOpcion0Acertada ? 'desacertada' : 'acertada';
      }
    } else {
      const niveles: Array<'acertada' | 'intermedia' | 'desacertada'> = ['acertada', 'intermedia', 'desacertada'];
      const idxAsignado = Math.floor(getRandom() * 3);
      nivelRespuesta = niveles[(opcionIndex + idxAsignado) % 3];
    }

    const curva = CURVAS_PROBABILIDAD_FAMA_POPULARIDAD[nivelRespuesta];
    const rollResultado = getRandom();

    let factorMultiplicador = 1;
    if (rollResultado < curva.probPositivo) {
      factorMultiplicador = 1;
    } else if (rollResultado < curva.probPositivo + curva.probNeutro) {
      factorMultiplicador = 0;
    } else {
      factorMultiplicador = -1;
    }

    if (consecuencias.stats) {
      const statsObj = { ...consecuencias.stats };
      if (statsObj.fama !== undefined) {
        statsObj.fama = factorMultiplicador === 0 ? 0 : Math.abs(statsObj.fama) * factorMultiplicador;
      }
      if (statsObj.popularidad !== undefined) {
        statsObj.popularidad = factorMultiplicador === 0 ? 0 : Math.abs(statsObj.popularidad) * factorMultiplicador;
      }
      consecuencias = {
        ...consecuencias,
        stats: statsObj,
      };
    }
  }

  const nuevasStats: PlayerStats = { ...state.stats };

  if (consecuencias.stats) {
    const statsObj = consecuencias.stats;
    (Object.keys(statsObj) as StatKey[]).forEach((key) => {
      const delta = statsObj[key];
      if (typeof delta === 'number') {
        const deltaAjustado = Math.round(delta * 0.5);
        nuevasStats[key] = clamp(nuevasStats[key] + deltaAjustado, 0, 100);
      }
    });
  }

  const catActual = state.situacionActual ? state.situacionActual.categoria : state.categoria;
  let nuevaCategoria = catActual;
  if (consecuencias.avanzaCategoria) {
    nuevaCategoria = obtenerSiguienteCategoria(catActual);
  }

  const equipoActual = state.situacionActual ? state.situacionActual.equipo : (state.equipo || 'Independiente');
  const nuevoEquipo =
    consecuencias.cambioEquipo !== undefined
      ? (consecuencias.cambioEquipo || 'Independiente')
      : equipoActual;

  const ovrActual = calcularMediaGeneral(nuevasStats);
  let nuevaSituacion: SituacionActual = state.situacionActual;
  if (nuevaCategoria !== catActual || nuevoEquipo !== equipoActual) {
    nuevaSituacion = crearSituacionActual(nuevaCategoria, nuevoEquipo, state.temporada, state.edad, ovrActual);
  }

  const nuevoJuegoSucioCount =
    state.juegoSucioCount + (consecuencias.incrementaJuegoSucio ? 1 : 0);

  const nuevosTags = { ...state.tagsHistorial };
  if (consecuencias.tagHistorial) {
    nuevosTags[consecuencias.tagHistorial] = (nuevosTags[consecuencias.tagHistorial] || 0) + 1;
  }
  if (consecuencias.cambioEquipo === equipoActual) {
    nuevosTags['lealtadEquipo'] = (nuevosTags['lealtadEquipo'] || 0) + 1;
  }

  let superlicenciaObtenida = state.superlicenciaObtenida || false;
  if (consecuencias.tagHistorial === 'superlicenciaObtenida' || evento.id.includes('superlicencia')) {
    superlicenciaObtenida = true;
  }

  const textoResultadoConRival = interpolarTexto(consecuencias.textoResultado, state);

  let estadoConHistorial: PlayerState = {
    ...state,
    stats: nuevasStats,
    situacionActual: nuevaSituacion,
    categoria: nuevaSituacion.categoria,
    equipo: nuevaSituacion.equipo,
    tagsHistorial: nuevosTags,
    superlicenciaObtenida,
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
        categoria: nuevaSituacion.categoria,
        temporada: state.temporada,
      },
    ],
  };

  const maxEventos = cantidadCarrerasClave(nuevaSituacion.categoria);
  const temporadaCompletada = estadoConHistorial.eventosUsadosTemporadaActual.length >= maxEventos;

  if (consecuencias.avanzaCategoria || temporadaCompletada) {
    estadoConHistorial = resolverFinDeTemporada(estadoConHistorial);
  }

  return evaluarFinales(estadoConHistorial, finales);
}

export function evaluarFinales(state: PlayerState, finales: Final[]): PlayerState {
  if (state.finalizado) {
    const resArquetipo = evaluarArquetipoFinal(state);
    return {
      ...state,
      finalObtenido: resArquetipo.id,
    };
  }

  for (const finalObj of finales) {
    if (finalObj.evaluar(state)) {
      const resArquetipo = evaluarArquetipoFinal(state);
      return {
        ...state,
        finalizado: true,
        finalObtenido: resArquetipo.id,
      };
    }
  }
  return state;
}
