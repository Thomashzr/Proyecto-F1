import { PlayerState, ContextoMinijuego, ResultadoMinijuego, TipoMinijuego } from './types';
import { FechaCalendario } from '../data/calendarios';
import { createRNG } from './rng';
import { clamp } from './gameEngine';

export const PROBABILIDAD_APARICION_ARGENTINA = 0.95; // 95% en categorías argentinas
export const PROBABILIDAD_APARICION_INTERNACIONAL = 0.85; // 85% en internacionales
export const PROBABILIDAD_APARICION_MINIJUEGO = 0.85;

export function generarMinijuegoParaCarrera(
  state: PlayerState,
  fecha: FechaCalendario
): ContextoMinijuego | null {
  if (!fecha.esCarreraClave) return null;

  const seedStr = `${state.seed}_mg_gen_${state.temporada}_${fecha.numeroFecha}`;
  const getRandom = createRNG(seedStr);

  const catActual = state.situacionActual ? state.situacionActual.categoria : state.categoria;
  const probAparicion =
    catActual === 'Karting Regional' ||
    catActual === 'Karting Nacional' ||
    catActual === 'Fórmula Nacional'
      ? PROBABILIDAD_APARICION_ARGENTINA
      : PROBABILIDAD_APARICION_INTERNACIONAL;

  if (getRandom() > probAparicion) {
    return null;
  }

  const tipos: TipoMinijuego[] = ['adelantamiento', 'estrategia-boxes', 'eleccion-neumaticos'];
  const tipoSeleccionado = tipos[Math.floor(getRandom() * tipos.length)];

  const objetivos: Array<'victoria' | 'podio' | 'puntos'> = ['victoria', 'podio', 'puntos'];
  const objetivo = objetivos[Math.floor(getRandom() * objetivos.length)];

  const rivalStr = state.rivalNombre || 'tu rival';

  if (tipoSeleccionado === 'adelantamiento') {
    const optimoIdx = Math.floor(getRandom() * 3);
    return {
      tipo: 'adelantamiento',
      titulo: `Carrera Clave: Oportunidad de Adelantamiento en ${fecha.circuito}`,
      descripcion: `Alcanzás la rueda trasera de ${rivalStr} luchando por ${
        objetivo === 'victoria' ? 'la Victoria' : objetivo === 'podio' ? 'un puesto de Podio' : 'entrar en los Puntos'
      }. Elegí cómo ejecutar la maniobra:`,
      objetivo,
      habilidadRecompensada: 'ataque',
      opciones: [
        {
          id: 'ad-adentro',
          texto: 'Tijera por la trazada interna en el vértice',
          descripcion: 'Estirar la frenada buscando el radio interno al límite del bloqueo.',
          esOptimo: optimoIdx === 0,
        },
        {
          id: 'ad-afuera',
          texto: 'Maniobra por afuera aguantando la aceleración',
          descripcion: 'Cargar velocidad en la parte sucia apoyando el chasis en la salida.',
          esOptimo: optimoIdx === 1,
        },
        {
          id: 'ad-recta',
          texto: 'Aprovechar la succión y superar en la recta opuesta',
          descripcion: 'Esperar la zona de DRS/recta principal para pasar con velocidad pura.',
          esOptimo: optimoIdx === 2,
        },
      ],
    };
  }

  if (tipoSeleccionado === 'estrategia-boxes') {
    const optimoIdx = Math.floor(getRandom() * 2);
    return {
      tipo: 'estrategia-boxes',
      titulo: `Carrera Clave: Decisiones de Box en ${fecha.nombreGranPremio}`,
      descripcion: `Tu ingeniero comunica por radio que ${rivalStr} está ralentizando su ritmo. Tenés dos alternativas de parada:`,
      objetivo,
      habilidadRecompensada: 'gestion',
      opciones: [
        {
          id: 'box-undercut',
          texto: 'Undercut: Entrar inmediatamente a boxes',
          descripcion: 'Parar una vuelta antes buscando marcar sectores en récord con goma fresca.',
          esOptimo: optimoIdx === 0,
        },
        {
          id: 'box-overcut',
          texto: 'Overcut: Estirar la tanda con aire limpio',
          descripcion: 'Permanecer 2 vueltas más en pista aprovechando que el circuito quedó despejado.',
          esOptimo: optimoIdx === 1,
        },
      ],
    };
  }

  const optimoIdx = Math.floor(getRandom() * 3);
  return {
    tipo: 'eleccion-neumaticos',
    titulo: `Carrera Clave: Elección de Compuesto en ${fecha.circuito}`,
    descripcion: `Temperatura en pista variable (${fecha.esMojado ? 'humedad alta' : 'asfalto caliente'}). Elegí el compuesto para la tanda decisiva:`,
    objetivo,
    habilidadRecompensada: 'consistencia',
    opciones: [
      {
        id: 'neum-blando',
        texto: 'Compuesto Blando (Agarre máximo inmediato)',
        descripcion: 'Ataque fuerte en las primeras vueltas sacrificando vida útil.',
        esOptimo: optimoIdx === 0,
      },
      {
        id: 'neum-medio',
        texto: 'Compuesto Medio (Equilibrio de ritmo y duración)',
        descripcion: 'Estrategia estándar de rendimiento constante.',
        esOptimo: optimoIdx === 1,
      },
      {
        id: 'neum-duro',
        texto: 'Compuesto Duro (Durabilidad extrema sin ampolleo)',
        descripcion: 'Tanda extendida buscando ritmo al final del stint.',
        esOptimo: optimoIdx === 2,
      },
    ],
  };
}

export function resolverMinijuego(
  contexto: ContextoMinijuego,
  opcionIdx: number,
  state: PlayerState
): { resultado: ResultadoMinijuego; nuevoEstado: PlayerState } {
  const opcion = contexto.opciones[opcionIdx] || contexto.opciones[0];
  const seedStr = `${state.seed}_mg_res_${state.historial.length}_${contexto.tipo}`;
  const getRandom = createRNG(seedStr);

  const probExito = opcion.esOptimo ? 0.80 : 0.30;
  const exito = getRandom() < probExito;

  const bonoModificadorScore = exito ? 45 : 0;
  const statBonus = exito ? { stat: contexto.habilidadRecompensada, cantidad: 1 } : undefined;

  let nuevasStats = { ...state.stats };
  if (statBonus) {
    nuevasStats[statBonus.stat] = clamp(nuevasStats[statBonus.stat] + statBonus.cantidad, 0, 100);
  }

  let mensaje = '';
  if (exito) {
    mensaje = `¡Decisión brillante! Ganaste una gran ventaja táctica para disputar ${
      contexto.objetivo === 'victoria' ? 'la Victoria' : contexto.objetivo === 'podio' ? 'el Podio' : 'los Puntos'
    } (+1 a ${contexto.habilidadRecompensada.toUpperCase()}).`;
  } else {
    mensaje = `La maniobra no resultó ideal pero mantuviste el monoplaza en pista sin daños ni penalizaciones.`;
  }

  const resultado: ResultadoMinijuego = {
    exito,
    objetivo: contexto.objetivo,
    bonoModificadorScore,
    statBonus,
    mensaje,
  };

  const nuevoEstado: PlayerState = {
    ...state,
    stats: nuevasStats,
  };

  return { resultado, nuevoEstado };
}
