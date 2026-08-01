import { Final } from '../engine/types';

export const FINALES: Final[] = [
  {
    id: 'final-retiro-lesion',
    titulo: 'Retiro Forzado por Lesión',
    subtitulo: 'El cuerpo dijo basta antes que la pasión.',
    descripcion: 'Los médicos no te dieron el alta para volver a subirte a un monoplaza. Tu carrera termina abruptamente en boxes.',
    esExito: false,
    evaluar: (state) => state.stats.consistencia <= 15,
  },
  {
    id: 'final-quema-mental-abandono',
    titulo: 'Abandono por Presión y Burnout',
    subtitulo: 'Decidiste colgar el casco por tu propia salud mental.',
    descripcion: 'La presión insoportable de la prensa, los patrocinadores y la competencia quebraron tu paz. Dejaste el automovilismo para recuperar tu vida.',
    esExito: false,
    evaluar: (state) => state.stats.popularidad <= 10 || state.stats.fama <= 10,
  },
  {
    id: 'final-despido-bajo-rendimiento',
    titulo: 'Despedido por Falta de Resultados',
    subtitulo: 'En este deporte el talento no alcanza si no hay resultados.',
    descripcion: 'Tu equipo rescindió tu contrato unilateralmente. Sin patrocinantes ni velocidad suficiente en pista, te quedaste sin asiento.',
    esExito: false,
    evaluar: (state) => state.stats.velocidad <= 15,
  },
  {
    id: 'final-estancado-inferiores',
    titulo: 'Estancado en Categorías Inferiores',
    subtitulo: 'El sueño de la Fórmula 1 quedó fuera de alcance.',
    descripcion: 'Pasaron los años y los equipos grandes buscaron talentos más jóvenes. Te convertiste en un veterano respetado de categorías zonales, pero sin llegar a la cima.',
    esExito: false,
    evaluar: (state) => state.edad >= 26 && state.categoria !== 'Fórmula 1',
  },
  {
    id: 'final-f1-campeon-sucio',
    titulo: 'Campeón Polémico e Implacable',
    subtitulo: 'Conseguiste la corona de F1, pero el paddock no olvida tus maniobras.',
    descripcion: 'Lograste lo máximo: el título mundial de Fórmula 1. Pero en los libros de historia tu nombre quedará asociado a sobrepasos al límite, maniobras antideportivas y una ambición despiadada.',
    esExito: true,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 75 &&
      state.juegoSucioCount >= 2 &&
      state.temporada >= 7,
  },
  {
    id: 'final-f1-campeon-del-mundo',
    titulo: 'Campeón del Mundo de Fórmula 1',
    subtitulo: '¡Gloria eterna! Tocaste la cima del deporte motor mundial.',
    descripcion: 'Dominaste los circuitos con maestría técnica pura y velocidad letal. Te coronaste Campeón Mundial de F1 de forma impecable. Un ídolo eterno.',
    esExito: true,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 80 &&
      state.stats.consistencia >= 75 &&
      state.temporada >= 7,
  },
  {
    id: 'final-f1-subcampeon-agridulce',
    titulo: 'Subcampeón de F1 en Definición de Infarto',
    subtitulo: 'Perdiste el título por solo un punto en el último sector de la última vuelta.',
    descripcion: 'Peleaste el campeonato mundial mano a mano hasta el último GP. Una falla técnica o una maniobra desesperada de tu rival te privó del título. Una carrera legendaria pero agridulce.',
    esExito: true,
    evaluar: (state) =>
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 70 &&
      state.temporada >= 7,
  },
  {
    id: 'final-f1-mitad-de-tabla',
    titulo: 'Piloto Consolidado de F1',
    subtitulo: 'Corriste años en la máxima categoría con orgullo y dignidad.',
    descripcion: 'Llegaste a la Fórmula 1 y sumaste podios esporádicos en equipos de mitad de tabla. No fuiste campeón mundial, pero viviste el sueño que millones persiguen.',
    esExito: true,
    evaluar: (state) => state.categoria === 'Fórmula 1' && state.temporada >= 7,
  },
];
