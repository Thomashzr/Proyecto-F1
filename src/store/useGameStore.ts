import { create } from 'zustand';
import { PlayerState, PlayerStats, Evento, Final, StatKey, OpcionEntrenamiento } from '../engine/types';
import {
  createInitialState,
  seleccionarEvento,
  aplicarOpcion,
  obtenerOpcionesEntrenamiento,
  aplicarEntrenamiento,
} from '../engine/gameEngine';
import { EVENTOS } from '../data/eventos';
import { FINALES } from '../data/finales';

interface GameStore {
  playerState: PlayerState | null;
  eventoActual: Evento | null;
  finalActual: Final | null;
  feedbackResultado: {
    textoResultado: string;
    statsDeltas: Partial<PlayerStats>;
    opcionTexto: string;
  } | null;
  opcionesEntrenamiento: OpcionEntrenamiento[];
  pantallaActual: 'inicio' | 'entrenamiento' | 'juego' | 'resumenTemporada' | 'resultado';

  // Acciones
  iniciarJuego: (nombrePiloto: string, nacionalidad: string, equipoKartingId: string, seed?: string) => void;
  elegirEntrenamiento: (habilidadKey: StatKey) => void;
  elegirOpcion: (opcionIndex: number) => void;
  continuarSiguienteEvento: () => void;
  avanzarDesdeResumenTemporada: () => void;
  reiniciarJuego: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  playerState: null,
  eventoActual: null,
  finalActual: null,
  feedbackResultado: null,
  opcionesEntrenamiento: [],
  pantallaActual: 'inicio',

  iniciarJuego: (nombrePiloto: string, nacionalidad: string, equipoKartingId: string, seed?: string) => {
    const initialState = createInitialState(nombrePiloto, nacionalidad, equipoKartingId, seed);
    const opcionesEnt = obtenerOpcionesEntrenamiento(initialState);

    set({
      playerState: initialState,
      opcionesEntrenamiento: opcionesEnt,
      pantallaActual: 'entrenamiento',
      eventoActual: null,
      finalActual: null,
      feedbackResultado: null,
    });
  },

  elegirEntrenamiento: (habilidadKey: StatKey) => {
    const { playerState } = get();
    if (!playerState) return;

    const estadoEntrenado = aplicarEntrenamiento(playerState, habilidadKey);
    const primerEvento = seleccionarEvento(EVENTOS, estadoEntrenado);

    set({
      playerState: estadoEntrenado,
      eventoActual: primerEvento,
      pantallaActual: 'juego',
    });
  },

  elegirOpcion: (opcionIndex: number) => {
    const { playerState, eventoActual } = get();
    if (!playerState || !eventoActual || playerState.finalizado) return;

    const opcion = eventoActual.opciones[opcionIndex];
    if (!opcion) return;

    const nuevoEstado = aplicarOpcion(playerState, eventoActual, opcionIndex, FINALES);

    let finalObtenidoObj: Final | null = null;
    if (nuevoEstado.finalizado && nuevoEstado.finalObtenido) {
      finalObtenidoObj = FINALES.find((f) => f.id === nuevoEstado.finalObtenido) || null;
    }

    set({
      playerState: nuevoEstado,
      finalActual: finalObtenidoObj,
      feedbackResultado: {
        textoResultado: opcion.consecuencias.textoResultado,
        statsDeltas: opcion.consecuencias.stats || {},
        opcionTexto: opcion.texto,
      },
    });
  },

  continuarSiguienteEvento: () => {
    const { playerState, finalActual } = get();
    if (!playerState) return;

    if (playerState.finalizado || finalActual) {
      set({ feedbackResultado: null, eventoActual: null, pantallaActual: 'resultado' });
      return;
    }

    // Si terminó la temporada y hay historial de campeonato registrado, mostrar resumen de temporada
    if (playerState.historialCampeonatos.length > 0 && playerState.historial.length % 3 === 0) {
      set({
        feedbackResultado: null,
        pantallaActual: 'resumenTemporada',
      });
      return;
    }

    const siguienteEvento = seleccionarEvento(EVENTOS, playerState);

    if (!siguienteEvento) {
      const opcionesEnt = obtenerOpcionesEntrenamiento(playerState);
      set({
        opcionesEntrenamiento: opcionesEnt,
        pantallaActual: 'entrenamiento',
        feedbackResultado: null,
      });
      return;
    }

    set({
      eventoActual: siguienteEvento,
      feedbackResultado: null,
      pantallaActual: 'juego',
    });
  },

  avanzarDesdeResumenTemporada: () => {
    const { playerState } = get();
    if (!playerState) return;

    if (playerState.finalizado) {
      set({ pantallaActual: 'resultado' });
      return;
    }

    const opcionesEnt = obtenerOpcionesEntrenamiento(playerState);
    set({
      opcionesEntrenamiento: opcionesEnt,
      pantallaActual: 'entrenamiento',
    });
  },

  reiniciarJuego: () => {
    set({
      playerState: null,
      eventoActual: null,
      finalActual: null,
      feedbackResultado: null,
      opcionesEntrenamiento: [],
      pantallaActual: 'inicio',
    });
  },
}));
