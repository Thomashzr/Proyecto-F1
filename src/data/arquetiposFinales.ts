import { PlayerState } from '../engine/types';

export interface ArquetipoFinal {
  id: string;
  tituloPlantilla: string;
  subtituloPlantilla: string;
  descripcionPlantilla: string;
  esExito: boolean;
  prioridad: number;
  evaluar: (state: PlayerState) => boolean;
}

export interface ResultadoArquetipoFinal {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  esExito: boolean;
}

export const ARQUETIPOS_FINALES: ArquetipoFinal[] = [
  {
    id: 'leyenda-equipo-unico',
    tituloPlantilla: 'Leyenda Eterna de {EQUIPO}',
    subtituloPlantilla: 'Lealtad incondicional a los mismos colores durante toda una vida deportiva.',
    descripcionPlantilla: 'Rechazaste cheques en blanco de otras escuderías para mantenerte fiel a {EQUIPO}. {PILOTO} no solo corrió para la marca, se convirtió en el símbolo eterno de sus victorias.',
    esExito: true,
    prioridad: 100,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      (state.tagsHistorial['lealtadEquipo'] || 0) >= 3 &&
      state.historialCampeonatos.length >= 5,
  },
  {
    id: 'campeon-invicto-f1',
    tituloPlantilla: 'Campeón Invicto de Fórmula 1',
    subtituloPlantilla: 'Dominio absoluto e inalcanzable en la era dorada de {EQUIPO}.',
    descripcionPlantilla: '{PILOTO} impuso una tiranía de velocidad en la F1. Ningún rival pudo hacerle sombra y su nombre quedará esculpido entre las deidades del automovilismo.',
    esExito: true,
    prioridad: 95,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 75 &&
      state.stats.consistencia >= 70,
  },
  {
    id: 'campeon-implacable-polemico',
    tituloPlantilla: 'Campeón Implacable y Polémico',
    subtituloPlantilla: 'La corona de F1 a costa de sobrepasos al límite y guerras psicológicas.',
    descripcionPlantilla: 'Ganaste el título mundial enfrentándote a comisarios, compañeros y al propio {RIVAL}. {PILOTO} demostró que para llegar a lo más alto a veces hay que cruzar la línea.',
    esExito: true,
    prioridad: 90,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      state.juegoSucioCount >= 2 &&
      state.stats.velocidad >= 65,
  },
  {
    id: 'el-rebelde-del-paddock',
    tituloPlantilla: 'El Rebelde del Paddock',
    subtituloPlantilla: 'Declaraciones incendiarias, talento indomable y batallas mediáticas.',
    descripcionPlantilla: 'Ignoraste órdenes de equipo y desataste tormentas en los micrófonos. Los patrocinadores temblaban pero los fanáticos adoraban tu personalidad explosiva.',
    esExito: true,
    prioridad: 85,
    evaluar: (state) => (state.tagsHistorial['escandalosMediaticos'] || 0) >= 2,
  },
  {
    id: 'el-rey-del-agua',
    tituloPlantilla: 'El Maestro del Asfalto Mojado',
    subtituloPlantilla: 'Hazañas memorables bajo temporales que paralizaron al deporte.',
    descripcionPlantilla: 'Cuando caía la lluvia en Spa o Interlagos, {PILOTO} flotaba sobre la pista sacando segundos de ventaja por vuelta. Una sensibilidad sobre el agua que pocos igualarán.',
    esExito: true,
    prioridad: 80,
    evaluar: (state) => state.stats.lluvia >= 75,
  },
  {
    id: 'idolo-popular-multitudes',
    tituloPlantilla: 'Ídolo Popular Incondicional',
    subtituloPlantilla: 'El piloto más amado por los fanáticos en los cinco continentes.',
    descripcionPlantilla: 'Más allá de los trofeos, {PILOTO} conquistó el corazón de la gente. Las tribunas se vestían con tus colores en cada Gran Premio.',
    esExito: true,
    prioridad: 75,
    evaluar: (state) => state.stats.popularidad >= 75,
  },
  {
    id: 'el-fiel-escudero',
    tituloPlantilla: 'El Fiel Escudero de Estrategia',
    subtituloPlantilla: 'Pilar fundamental en los campeonatos de constructores.',
    descripcionPlantilla: 'Aceptaste el trabajo sucio en pista, cubriendo las espaldas de tu equipo y aguantando a los perseguidores. Un profesional impecable respetado por todo el box.',
    esExito: true,
    prioridad: 70,
    evaluar: (state) => (state.tagsHistorial['ordenesAcatadas'] || 0) >= 2,
  },
  {
    id: 'el-rey-sin-corona',
    tituloPlantilla: 'El Eterno Subcampeón Agridulce',
    subtituloPlantilla: 'Peleaste el título al límite hasta el último sector del último GP.',
    descripcionPlantilla: '{PILOTO} tuvo la velocidad de un campeón del mundo, pero la fortuna le fue esquiva en las definiciones de infarto contra {RIVAL}.',
    esExito: true,
    prioridad: 65,
    evaluar: (state) => state.categoria === 'Fórmula 1' && state.stats.velocidad >= 60,
  },
  {
    id: 'veterano-38-anos',
    tituloPlantilla: 'Veterano Inquebrantable de F1',
    subtituloPlantilla: '24 temporadas al máximo nivel compitiendo hasta los 38 años.',
    descripcionPlantilla: 'Corriste desde tu juventud en karting hasta la madurez de los 38 años en F1. Guiaste a las nuevas generaciones y te retiraste con el aplauso de pie del paddock.',
    esExito: true,
    prioridad: 60,
    evaluar: (state) => state.edad >= 38 && state.categoria === 'Fórmula 1',
  },
  {
    id: 'piloto-consolidado-f1',
    tituloPlantilla: 'Piloto Consolidado de F1',
    subtituloPlantilla: 'Una sólida carrera en la elite del automovilismo mundial.',
    descripcionPlantilla: 'Competiste años en la máxima categoría con {EQUIPO}, sumando puntos y podios que llenaron de orgullo a tu país.',
    esExito: true,
    prioridad: 50,
    evaluar: (state) => state.categoria === 'Fórmula 1',
  },
  {
    id: 'estancado-inferiores-zonal',
    tituloPlantilla: 'Gladiador de Categorías Zonales',
    subtituloPlantilla: 'Una carrera apasionada en las pistas nacionales.',
    descripcionPlantilla: 'El salto a la F1 no llegó, pero {PILOTO} se convirtió en un referente indiscutido en los circuitos zonales con peleas memorables contra {RIVAL}.',
    esExito: false,
    prioridad: 40,
    evaluar: (state) => state.categoria !== 'Fórmula 1',
  },
  {
    id: 'retiro-paz-personal',
    tituloPlantilla: 'Retiro Voluntario por Paz Personal',
    subtituloPlantilla: 'Decidiste colgar el casco a los {EDAD} años por tranquilidad.',
    descripcionPlantilla: 'La presión insoportable de los medios y la exigencia constante te llevaron a tomar la decisión consciente de priorizar tu paz personal.',
    esExito: false,
    prioridad: 30,
    evaluar: (state) => state.stats.popularidad <= 15 || state.stats.fama <= 15,
  },
];

/**
 * Evalúa dinámicamente el mejor arquetipo final e interpola variables narrativas a medida (B.5).
 */
export function evaluarArquetipoFinal(state: PlayerState): ResultadoArquetipoFinal {
  const candidato = ARQUETIPOS_FINALES
    .filter((a) => a.evaluar(state))
    .sort((a, b) => b.prioridad - a.prioridad)[0] || ARQUETIPOS_FINALES[ARQUETIPOS_FINALES.length - 1];

  const equipoNombre = state.equipo || 'tu equipo';
  const rivalNombre = state.rivalNombre || 'tu rival';

  const titulo = candidato.tituloPlantilla
    .replace(/{EQUIPO}/g, equipoNombre)
    .replace(/{PILOTO}/g, state.nombre)
    .replace(/{RIVAL}/g, rivalNombre);

  const subtitulo = candidato.subtituloPlantilla
    .replace(/{EDAD}/g, state.edad.toString())
    .replace(/{EQUIPO}/g, equipoNombre);

  const descripcion = candidato.descripcionPlantilla
    .replace(/{EQUIPO}/g, equipoNombre)
    .replace(/{PILOTO}/g, state.nombre)
    .replace(/{RIVAL}/g, rivalNombre)
    .replace(/{EDAD}/g, state.edad.toString());

  return {
    id: candidato.id,
    titulo,
    subtitulo,
    descripcion,
    esExito: candidato.esExito,
  };
}
