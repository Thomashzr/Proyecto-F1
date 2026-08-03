import { create } from 'zustand';
import { PlayerState, PlayerStats, Evento, Final, StatKey, OpcionEntrenamiento, OfertaEquipo, ContextoMinijuego, ResultadoMinijuego } from '../engine/types';
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
import { generarMinijuegoParaCarrera, resolverMinijuego } from '../engine/minijuegos';
import { CALENDARIOS_POR_CATEGORIA } from '../data/calendarios';
import { EVENTOS } from '../data/eventos';
import { FINALES } from '../data/finales';

interface GameStore {
  playerState: PlayerState | null;
  eventoActual: Evento | null;
  finalActual: Final | null;
  minijuegoActual: ContextoMinijuego | null;
  resultadoMinijuegoActual: ResultadoMinijuego | null;
  modificadoresMinijuegosTemporada: Record<number, number>;
  feedbackResultado: {
    textoResultado: string;
    statsDeltas: Partial<PlayerStats>;
    opcionTexto: string;
  } | null;
  opcionesEntrenamiento: OpcionEntrenamiento[];
  pantallaActual: 'inicio' | 'entrenamiento' | 'juego' | 'minijuego' | 'ofertasEquipos' | 'resumenTemporada' | 'resultado';
  temporadaResumenMostrada: number;

  // Acciones
  iniciarJuego: (nombrePiloto: string, nacionalidad: string, equipoKartingId: string, seed?: string) => void;
  elegirEntrenamiento: (habilidadKey: StatKey) => void;
  elegirOfertaEquipo: (oferta: OfertaEquipo) => void;
  elegirOpcion: (opcionIndex: number) => void;
  responderMinijuego: (opcionIndex: number) => ResultadoMinijuego;
  continuarDesdeMinijuego: () => void;
  continuarSiguienteEvento: () => void;
  avanzarDesdeResumenTemporada: () => void;
  solicitarRetiroVoluntario: () => void;
  reiniciarJuego: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  playerState: null,
  eventoActual: null,
  finalActual: null,
  minijuegoActual: null,
  resultadoMinijuegoActual: null,
  modificadoresMinijuegosTemporada: {},
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
      minijuegoActual: null,
      resultadoMinijuegoActual: null,
      modificadoresMinijuegosTemporada: {},
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
    const calendario = CALENDARIOS_POR_CATEGORIA[estadoEntrenado.categoria] || [];
    const fechaActual = calendario[estadoEntrenado.eventosUsadosTemporadaActual.length];
    const minijuegoGen = fechaActual ? generarMinijuegoParaCarrera(estadoEntrenado, fechaActual) : null;

    if (minijuegoGen) {
      set({
        playerState: estadoEntrenado,
        eventoActual: primerEvento,
        minijuegoActual: minijuegoGen,
        pantallaActual: 'minijuego',
      });
      return;
    }

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

    const opcionesEnt = obtenerOpcionesEntrenamiento(nuevoEstado);

    set({
      playerState: nuevoEstado,
      opcionesEntrenamiento: opcionesEnt,
      pantallaActual: 'entrenamiento',
    });
  },

  responderMinijuego: (opcionIndex: number) => {
    const { minijuegoActual, playerState, modificadoresMinijuegosTemporada } = get();
    if (!minijuegoActual || !playerState) {
      throw new Error('No hay minijuego activo para responder');
    }

    const { resultado, nuevoEstado } = resolverMinijuego(minijuegoActual, opcionIndex, playerState);
    const calendario = CALENDARIOS_POR_CATEGORIA[playerState.categoria] || [];
    const fechaActual = calendario[playerState.eventosUsadosTemporadaActual.length];
    const numFecha = fechaActual ? fechaActual.numeroFecha : 1;

    const nuevosModificadores = {
      ...modificadoresMinijuegosTemporada,
      [numFecha]: resultado.bonoModificadorScore,
    };

    set({
      playerState: nuevoEstado,
      resultadoMinijuegoActual: resultado,
      modificadoresMinijuegosTemporada: nuevosModificadores,
    });

    return resultado;
  },

  continuarDesdeMinijuego: () => {
    const { playerState } = get();
    if (!playerState) return;

    const siguienteEvento = seleccionarEvento(EVENTOS, playerState);
    set({
      eventoActual: siguienteEvento,
      minijuegoActual: null,
      resultadoMinijuegoActual: null,
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

    const calendario = CALENDARIOS_POR_CATEGORIA[playerState.categoria] || [];
    const fechaActual = calendario[playerState.eventosUsadosTemporadaActual.length];
    const minijuegoGen = fechaActual ? generarMinijuegoParaCarrera(playerState, fechaActual) : null;

    if (minijuegoGen) {
      set({
        eventoActual: siguienteEvento,
        minijuegoActual: minijuegoGen,
        feedbackResultado: null,
        pantallaActual: 'minijuego',
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
      modificadoresMinijuegosTemporada: {},
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
