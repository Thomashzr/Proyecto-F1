import { Final } from '../engine/types';

export const FINALES: Final[] = [
  {
    id: 'final-estancado-rendimiento-bajo',
    titulo: 'Retiro por Rendimiento Insuficiente',
    subtitulo: 'Sin la velocidad requerida para mantener el asiento.',
    descripcion: 'Tras varias temporadas sin alcanzar los tiempos mínimos de clasificación, el equipo decidió no renovar tu plaza. Diste todo en la pista.',
    esExito: false,
    evaluar: (state) => (state.finalizado || state.edad >= 38) && state.stats.velocidad <= 20,
  },
  {
    id: 'final-quema-mental-abandono',
    titulo: 'Retiro Voluntario por Paz Personal',
    subtitulo: 'Decidiste colgar el casco por tu propia tranquilidad.',
    descripcion: 'La presión insoportable de los medios y la competencia constante te llevaron a tomar la decisión consciente de retirarte del automovilismo.',
    esExito: false,
    evaluar: (state) => state.stats.popularidad <= 10 || state.stats.fama <= 10,
  },
  {
    id: 'final-despido-bajo-rendimiento',
    titulo: 'Despedido por Falta de Resultados',
    subtitulo: 'En este deporte el talento no alcanza si no hay resultados.',
    descripcion: 'Tu equipo rescindió tu contrato unilateralmente. Sin patrocinantes ni velocidad suficiente en pista, te quedaste sin asiento.',
    esExito: false,
    evaluar: (state) => (state.finalizado || state.edad >= 38) && state.stats.velocidad <= 15,
  },
  {
    id: 'final-estancado-inferiores',
    titulo: 'Estancado en Categorías Inferiores',
    subtitulo: 'El sueño de la Fórmula 1 quedó fuera de alcance.',
    descripcion: 'Pasaron los años y los equipos grandes buscaron talentos más jóvenes. Te convertiste en un veterano respetado de categorías zonales, pero sin llegar a la cima.',
    esExito: false,
    evaluar: (state) => (state.finalizado || state.edad >= 38 || (state.edad >= 28 && state.stats.velocidad < 45)) && state.categoria !== 'Fórmula 1',
  },
  {
    id: 'final-f1-campeon-sucio',
    titulo: 'Campeón Polémico e Implacable',
    subtitulo: 'Conseguiste la corona de F1, pero el paddock no olvida tus maniobras.',
    descripcion: 'Lograste lo máximo: el título mundial de Fórmula 1. Pero en los libros de historia tu nombre quedará asociado a sobrepasos al límite y una ambición despiadada.',
    esExito: true,
    evaluar: (state) =>
      (state.finalizado || state.edad >= 38) &&
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 70 &&
      state.juegoSucioCount >= 2,
  },
  {
    id: 'final-f1-campeon-del-mundo',
    titulo: 'Campeón del Mundo de Fórmula 1',
    subtitulo: '¡Gloria eterna! Tocaste la cima del deporte motor mundial.',
    descripcion: 'Dominaste los circuitos con maestría técnica pura y velocidad letal. Te coronaste Campeón Mundial de F1 de forma impecable. Un ídolo eterno.',
    esExito: true,
    evaluar: (state) =>
      (state.finalizado || state.edad >= 38) &&
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 75 &&
      state.stats.consistencia >= 65,
  },
  {
    id: 'final-f1-subcampeon-agridulce',
    titulo: 'Subcampeón de F1 en Definición de Infarto',
    subtitulo: 'Perdiste el título por solo un punto en el último sector de la última vuelta.',
    descripcion: 'Peleaste el campeonato mundial mano a mano hasta el último GP. Una falla técnica o una maniobra desesperada de tu rival te privó del título.',
    esExito: true,
    evaluar: (state) =>
      (state.finalizado || state.edad >= 38) &&
      state.categoria === 'Fórmula 1' &&
      state.stats.velocidad >= 60,
  },
  {
    id: 'final-f1-mitad-de-tabla',
    titulo: 'Piloto Consolidado de F1',
    subtitulo: 'Corriste años en la máxima categoría con orgullo y dignidad.',
    descripcion: 'Llegaste a la Fórmula 1 y sumaste podios esporádicos en equipos de mitad de tabla. Viviste el sueño que millones persiguen.',
    esExito: true,
    evaluar: (state) => (state.finalizado || state.edad >= 38) && state.categoria === 'Fórmula 1',
  },
];
