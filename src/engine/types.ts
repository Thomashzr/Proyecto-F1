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

export interface PlayerStats {
  // Habilidades principales (afectan rendimiento en pista)
  velocidad: number;    // 0-100, velocidad en vuelta rápida y pole
  lluvia: number;       // 0-100, destreza en suelo mojado
  ataque: number;       // 0-100, sobrepasos y agresividad medida
  defensa: number;      // 0-100, retención de posición y contención
  gestion: number;      // 0-100, cuidado de neumáticos y combustible
  consistencia: number; // 0-100, ritmo parejo sin errores

  // Atributos secundarios (afectan oportunidades fuera de pista)
  fama: number;         // 0-100, interés de espónsors y academias
  popularidad: number;  // 0-100, cariño del público y afición
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

export interface PlayerState {
  nombre: string;
  nacionalidad: string;
  edad: number; // Arranca en 9 años
  temporada: number;
  categoria: Categoria;
  equipo: string | null;
  equipoKartingId?: string;
  stats: PlayerStats;
  historial: HistorialEntry[];
  finalizado: boolean;
  finalObtenido: string | null;
  eventosVistos: string[];
  seed: string;
  juegoSucioCount: number;
  entrenamientosRealizados: number;
}

export interface Condicion {
  stat: StatKey;
  operador: '>' | '>=' | '<' | '<=' | '==';
  valor: number;
}

export interface OpcionConsecuencia {
  stats: Partial<Record<StatKey, number>>;
  textoResultado: string;
  siguienteEventoId?: string;
  avanzaCategoria?: boolean;
  cambioEquipo?: string | null;
  incrementaJuegoSucio?: boolean;
}

export interface Opcion {
  texto: string;
  consecuencias: OpcionConsecuencia;
}

export interface Evento {
  id: string;
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
