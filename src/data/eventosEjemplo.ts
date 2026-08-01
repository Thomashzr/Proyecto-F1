import { Evento } from '../engine/types';

export const EVENTOS_EJEMPLO: Evento[] = [
  {
    id: 'karting_01_primera_carrera',
    tipo: 'deportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Regional',
    peso: 10,
    titulo: 'Primera final de Karting regional',
    descripcion: 'Llegas a la última vuelta en 2do lugar. El líder te deja un pequeño hueco en la curva previa a la recta.',
    opciones: [
      {
        texto: 'Arriesgar tirando el kart por dentro',
        consecuencias: {
          stats: { velocidad: 5, ataque: 10, consistencia: -5 },
          textoResultado: '¡Adelantamiento espectacular! Te llevas la victoria y atraes miradas de los cazatalentos.',
        },
      },
      {
        texto: 'Asegurar el 2do puesto sin arriesgar el chasis',
        consecuencias: {
          stats: { consistencia: 10, defensa: 5 },
          textoResultado: 'Terminas 2do en el podio. El equipo agradece haber devuelto el kart intacto.',
        },
      },
    ],
  },
];
