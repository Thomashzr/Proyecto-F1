// Temporada de referencia: 2026

export interface EquipoF1 {
  id: string;
  nombre: string;
  motor: string;
  nivelRendimiento: number; // 0-100
  ovrRequerido: number;
}

export const EQUIPOS_F1: EquipoF1[] = [
  { id: 'red-bull-racing', nombre: 'Oracle Red Bull Racing', motor: 'Red Bull Ford Powertrains', nivelRendimiento: 95, ovrRequerido: 78 },
  { id: 'scuderia-ferrari', nombre: 'Scuderia Ferrari HP', motor: 'Ferrari', nivelRendimiento: 93, ovrRequerido: 76 },
  { id: 'mclaren-f1-team', nombre: 'McLaren F1 Team', motor: 'Mercedes', nivelRendimiento: 94, ovrRequerido: 77 },
  { id: 'mercedes-amg', nombre: 'Mercedes-AMG PETRONAS F1 Team', motor: 'Mercedes', nivelRendimiento: 91, ovrRequerido: 75 },
  { id: 'aston-martin', nombre: 'Aston Martin Aramco F1 Team', motor: 'Honda', nivelRendimiento: 85, ovrRequerido: 72 },
  { id: 'alpine-f1-team', nombre: 'BWT Alpine F1 Team', motor: 'Renault', nivelRendimiento: 78, ovrRequerido: 68 },
  { id: 'williams-racing', nombre: 'Williams Racing', motor: 'Mercedes', nivelRendimiento: 77, ovrRequerido: 65 },
  { id: 'visa-cash-app-rb', nombre: 'Visa Cash App RB F1 Team', motor: 'Red Bull Ford Powertrains', nivelRendimiento: 79, ovrRequerido: 67 },
  { id: 'haas-f1-team', nombre: 'MoneyGram Haas F1 Team', motor: 'Ferrari', nivelRendimiento: 75, ovrRequerido: 63 },
  { id: 'stake-f1-team-sauber', nombre: 'Stake F1 Team Kick Sauber (Audi)', motor: 'Audi', nivelRendimiento: 74, ovrRequerido: 62 },
];
