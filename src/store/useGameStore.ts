import { create } from 'zustand';
import { PlayerState, PlayerStats, Evento, Final, StatKey, OpcionEntrenamiento, OfertaEquipo } from '../engine/types';
import {
  createInitialState,
  seleccionarEvento,
  aplicarOpcion,
  obtenerOpcionesEntrenamiento,
  aplicarEntrenamiento,
  evaluarFinales,
  interpolarTexto,
  cantidadCarrerasClave,
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
  pantallaActual: 'inicio' | 'entrenamiento' | 'juego' | 'ofertasEquipos' | 'resumenTemporada' | 'resultado';
  temporadaResumenMostrada: number;

  // Acciones
  iniciarJuego: (nombrePiloto: string, nacionalidad: string, equipoKartingId: string, seed?: string) => void;
  elegirEntrenamiento: (habilidadKey: StatKey) => void;
  elegirOfertaEquipo: (oferta: OfertaEquipo) => void;
  elegirOpcion: (opcionIndex: number) => void;
  continuarSiguienteEvento: () => void;
  avanzarDesdeResumenTemporada: () => void;
  solicitarRetiroVoluntario: () => void;
  reiniciarJuego: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  playerState: null,
  eventoActual: null,
  finalActual: null,
  feedbackResultado: null,
  opcionesEntrenamiento: [],
  pantallaActual: 'inicio',
  temporadaResumenMostrada: 0,

  iniciarJuego: (nombrePiloto: string, nacionalidad: string, equipoKartingId: string, seed?: string) => {
    const initialState = createInitialState(nombrePiloto, nacionalidad, equipoKartingId, seed);
    const opcionesEnt = obtenerOpcionesEntrenamiento(initialState);

    set({
      playerState: initialState,
      opcionesEntrenamiento: opcionesEnt,
      pantallaActual: 'entrenamiento',
      temporadaResumenMostrada: 0,
      eventoActual: null,
      finalActual: null,
      feedbackResultado: null,
    });
  },

  elegirEntrenamiento: (habilidadKey: StatKey) => {
    const { playerState } = get();
    if (!playerState) return;

    const estadoEntrenado = aplicarEntrenamiento(playerState, habilidadKey);

    if (estadoEntrenado.ofertasPendientes.length > 0) {
      set({
        playerState: estadoEntrenado,
        pantallaActual: 'ofertasEquipos',
      });
      return;
    }

    const primerEvento = seleccionarEvento(EVENTOS, estadoEntrenado);

    set({
      playerState: estadoEntrenado,
      eventoActual: primerEvento,
      pantallaActual: 'juego',
    });
  },

  elegirOfertaEquipo: (oferta: OfertaEquipo) => {
    const { playerState } = get();
    if (!playerState) return;

    const nuevoEstado: PlayerState = {
      ...playerState,
      equipo: oferta.nombre,
      categoria: oferta.categoria,
      ofertasPendientes: [],
    };

    const primerEvento = seleccionarEvento(EVENTOS, nuevoEstado);

    set({
      playerState: nuevoEstado,
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
      pantallaActual: finalObtenidoObj ? 'resultado' : 'juego',
      feedbackResultado: {
        textoResultado: interpolarTexto(opcion.consecuencias.textoResultado, playerState),
        statsDeltas: opcion.consecuencias.stats || {},
        opcionTexto: interpolarTexto(opcion.texto, playerState),
      },
    });
  },

  continuarSiguienteEvento: () => {
    const { playerState, finalActual, temporadaResumenMostrada } = get();
    if (!playerState) return;

    if (playerState.finalizado || finalActual) {
      set({ feedbackResultado: null, eventoActual: null, pantallaActual: 'resultado' });
      return;
    }

    const ultimoCampeonato = playerState.historialCampeonatos[playerState.historialCampeonatos.length - 1];
    if (ultimoCampeonato && ultimoCampeonato.temporada > temporadaResumenMostrada) {
      set({
        temporadaResumenMostrada: ultimoCampeonato.temporada,
        feedbackResultado: null,
        pantallaActual: 'resumenTemporada',
      });
      return;
    }

    const maxEventos = cantidadCarrerasClave(playerState.categoria);
    if (playerState.eventosUsadosTemporadaActual.length >= maxEventos) {
      set({
        feedbackResultado: null,
        pantallaActual: 'resumenTemporada',
      });
      return;
    }

    const siguienteEvento = seleccionarEvento(EVENTOS, playerState);

    if (!siguienteEvento) {
      set({
        feedbackResultado: null,
        pantallaActual: 'resumenTemporada',
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

    if (playerState.ofertasPendientes.length > 0) {
      set({ pantallaActual: 'ofertasEquipos' });
      return;
    }

    const opcionesEnt = obtenerOpcionesEntrenamiento(playerState);
    set({
      opcionesEntrenamiento: opcionesEnt,
      pantallaActual: 'entrenamiento',
    });
  },

  solicitarRetiroVoluntario: () => {
    const { playerState } = get();
    if (!playerState) return;

    const estadoFinalizado: PlayerState = {
      ...playerState,
      finalizado: true,
    };

    const estadoEvaluado = evaluarFinales(estadoFinalizado, FINALES);
    const finalObtenidoObj = FINALES.find((f) => f.id === estadoEvaluado.finalObtenido) || FINALES[FINALES.length - 1];

    set({
      playerState: estadoEvaluado,
      finalActual: finalObtenidoObj,
      pantallaActual: 'resultado',
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
      temporadaResumenMostrada: 0,
    });
  },
}));
