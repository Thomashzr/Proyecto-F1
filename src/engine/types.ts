export type Categoria =
  | 'Karting Regional'
  | 'Karting Nacional'
  | 'Fórmula Nacional'
  | 'Fórmula 4 Brasil'
  | 'Fórmula 4 España'
  | 'Fórmula 4 Italia'
  | 'Formula Regional Europea'
  | 'FIA Fórmula 3'
  | 'FIA Fórmula 2'
  | 'Fórmula 1';

export type RegionCategoria = 'Argentina' | 'Sudamérica' | 'Europa';

export const CATEGORIAS_ORDEN: Categoria[] = [
  'Karting Regional',
  'Karting Nacional',
  'Fórmula Nacional',
  'Fórmula 4 Brasil',
  'Fórmula 4 España',
  'Fórmula 4 Italia',
  'Formula Regional Europea',
  'FIA Fórmula 3',
  'FIA Fórmula 2',
  'Fórmula 1',
];

export const REGIONES_CATEGORIA: Record<Categoria, RegionCategoria> = {
  'Karting Regional': 'Argentina',
  'Karting Nacional': 'Argentina',
  'Fórmula Nacional': 'Argentina',
  'Fórmula 4 Brasil': 'Sudamérica',
  'Fórmula 4 España': 'Europa',
  'Fórmula 4 Italia': 'Europa',
  'Formula Regional Europea': 'Europa',
  'FIA Fórmula 3': 'Europa',
  'FIA Fórmula 2': 'Europa',
  'Fórmula 1': 'Europa',
};

export interface PlayerStats {
  velocidad: number;    // 0-100
  lluvia: number;       // 0-100
  ataque: number;       // 0-100
  defensa: number;      // 0-100
  gestion: number;      // 0-100
  consistencia: number; // 0-100
  fama: number;         // 0-100
  popularidad: number;  // 0-100
}

export type StatKey = keyof PlayerStats;

export interface HistorialEntry {
  eventoId: string;
  eventoTitulo: string;
  opcionTexto: string;
  textoResultado: string;
  statsDeltas: Partial<PlayerStats>;
  categoria: Categoria;
  temporada: number;
}

export interface ResultadoFecha {
  numeroFecha: number;
  nombreGranPremio: string;
  circuito: string;
  posicion: number;
  pole: boolean;
  vueltaRapida: boolean;
  abandono: boolean;
  esCarreraClave: boolean;
  puntos: number;
}

export interface OfertaEquipo {
  id: string;
  nombre: string;
  categoria: Categoria;
  pais: string;
  nivelRendimiento: number;
  expectativas: string;
  prestigioFamaBonus: number;
  esContinuidad?: boolean;
}

export interface ResumenCampeonato {
  temporada: number;
  categoria: Categoria;
  equipo: string;
  posicionFinal: number;
  puntosTotales: number;
  victorias: number;
  podios: number;
  poles: number;
  vueltasRapidas: number;
  abandonos: number;
  fechas: ResultadoFecha[];
  ofertasSiguienteTemporada: OfertaEquipo[];
}

export interface PlayerState {
  nombre: string;
  nacionalidad: string;
  rivalNombre: string;
  edad: number;
  temporada: number;
  categoria: Categoria;
  equipo: string | null;
  equipoKartingId?: string;
  stats: PlayerStats;
  historial: HistorialEntry[];
  finalizado: boolean;
  finalObtenido: string | null;
  eventosVistos: string[];
  eventosUsadosTemporadaActual: string[];
  seed: string;
  juegoSucioCount: number;
  entrenamientosRealizados: number;
  historialCampeonatos: ResumenCampeonato[];
  campeonatoActualFechas: ResultadoFecha[];
  ofertasPendientes: OfertaEquipo[];
  tagsHistorial: Record<string, number>;
}

export interface Condicion {
  stat: StatKey;
  operador: '>' | '>=' | '<' | '<=' | '==';
  valor: number;
}

export interface OpcionConsecuencia {
  stats?: Partial<Record<StatKey, number>>;
  textoResultado: string;
  siguienteEventoId?: string;
  avanzaCategoria?: boolean;
  cambioEquipo?: string | null;
  incrementaJuegoSucio?: boolean;
  tagHistorial?: string;
  resultadosProbabilisticos?: Array<{ probabilidad: number; consecuencia: OpcionConsecuencia }>;
}

export interface Opcion {
  texto: string;
  consecuencias: OpcionConsecuencia;
}

export interface Evento {
  id: string;
  tipo: 'deportivo' | 'extradeportivo';
  categoriaEvento?: 'deportivo' | 'equipo' | 'prensa' | 'mercado' | 'raro';
  categoriaMinima?: Categoria;
  categoriaMaxima?: Categoria;
  condiciones?: Condicion[];
  peso: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  personajeRecurrente?: string;
  opciones: Opcion[];
  esUnico?: boolean;
}

export interface Final {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  esExito: boolean;
  evaluar: (state: PlayerState) => boolean;
}

export interface OpcionEntrenamiento {
  habilidad: keyof Pick<PlayerStats, 'velocidad' | 'lluvia' | 'ataque' | 'defensa' | 'gestion' | 'consistencia'>;
  titulo: string;
  descripcion: string;
  incremento: number;
}

export type TipoMinijuego = 'adelantamiento' | 'estrategia-boxes' | 'eleccion-neumaticos';

export interface OpcionMinijuego {
  id: string;
  texto: string;
  descripcion: string;
  esOptimo: boolean;
}

export interface ContextoMinijuego {
  tipo: TipoMinijuego;
  titulo: string;
  descripcion: string;
  objetivo: 'victoria' | 'podio' | 'puntos';
  opciones: OpcionMinijuego[];
  habilidadRecompensada: 'ataque' | 'gestion' | 'consistencia';
}

export interface ResultadoMinijuego {
  exito: boolean;
  objetivo: 'victoria' | 'podio' | 'puntos';
  bonoModificadorScore: number;
  statBonus?: { stat: StatKey; cantidad: number };
  mensaje: string;
}
