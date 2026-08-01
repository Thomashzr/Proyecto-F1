// Temporada de referencia: 2026

export interface EquipoCompeticion {
  id: string;
  nombre: string;
  pais: string;
  nivelRendimiento: number;
  ovrRequerido: number;
}

export const EQUIPOS_F2: EquipoCompeticion[] = [
  { id: 'prema-f2', nombre: 'Prema Racing', pais: 'Italia', nivelRendimiento: 92, ovrRequerido: 68 },
  { id: 'art-f2', nombre: 'ART Grand Prix', pais: 'Francia', nivelRendimiento: 90, ovrRequerido: 66 },
  { id: 'mp-f2', nombre: 'MP Motorsport', pais: 'Países Bajos', nivelRendimiento: 88, ovrRequerido: 64 },
  { id: 'rodin-f2', nombre: 'Rodin Motorsport', pais: 'Reino Unido', nivelRendimiento: 85, ovrRequerido: 62 },
  { id: 'dams-f2', nombre: 'DAMS Lucas Oil', pais: 'Francia', nivelRendimiento: 86, ovrRequerido: 63 },
  { id: 'invicta-f2', nombre: 'Invicta Racing', pais: 'Reino Unido', nivelRendimiento: 89, ovrRequerido: 65 },
  { id: 'hitech-f2', nombre: 'Hitech Pulse-Eight', pais: 'Reino Unido', nivelRendimiento: 84, ovrRequerido: 61 },
  { id: 'campos-f2', nombre: 'Campos Racing', pais: 'España', nivelRendimiento: 87, ovrRequerido: 63 },
  { id: 'trident-f2', nombre: 'Trident', pais: 'Italia', nivelRendimiento: 83, ovrRequerido: 60 },
  { id: 'var-f2', nombre: 'Van Amersfoort Racing', pais: 'Países Bajos', nivelRendimiento: 81, ovrRequerido: 58 },
  { id: 'phm-f2', nombre: 'AIX Racing', pais: 'Alemania', nivelRendimiento: 79, ovrRequerido: 56 },
];
