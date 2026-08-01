import { Final } from '../engine/types';

export const FINALES_EJEMPLO: Final[] = [
  {
    id: 'final_retiro_lesion',
    titulo: 'Retiro Forzado por Lesión',
    subtitulo: 'Un grave accidente terminó con tus días de piloto.',
    descripcion: 'Tus lesiones físicas sufridas en la pista no te permiten continuar compitiendo al nivel profesional.',
    esExito: false,
    evaluar: (state) => state.stats.consistencia <= 15,
  },
  {
    id: 'final_campeon_f1',
    titulo: 'Campeón Mundial de Fórmula 1',
    subtitulo: '¡Lograste el mayor sueño del automovilismo!',
    descripcion: 'Llegaste a la F1 y dominaste el campeonato contra los mejores pilotos del mundo. ¡Te coronaste Campeón del Mundo!',
    esExito: true,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 80 &&
      state.stats.consistencia >= 75,
  },
];
