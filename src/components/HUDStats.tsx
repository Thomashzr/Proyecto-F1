import React from 'react';
import { PlayerStats, Categoria, SituacionActual } from '../engine/types';
import { calcularMediaGeneral } from '../engine/gameEngine';

interface HUDStatsProps {
  nombre: string;
  nacionalidad: string;
  edad: number;
  categoria?: Categoria;
  temporada: number;
  equipo?: string | null;
  situacionActual?: SituacionActual;
  stats: PlayerStats;
}

export const HUDStats: React.FC<HUDStatsProps> = ({
  nombre,
  nacionalidad,
  edad,
  categoria: propCategoria,
  temporada,
  equipo: propEquipo,
  situacionActual,
  stats,
}) => {
  const categoria = situacionActual ? situacionActual.categoria : (propCategoria || 'Karting Regional');
  const equipo = situacionActual ? situacionActual.equipo : propEquipo;
  const ovr = calcularMediaGeneral(stats);

  const getCategoryBadgeColor = (cat: Categoria) => {
    if (cat.includes('Karting')) return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    if (cat.includes('Fórmula 4') || cat.includes('Nacional'))
      return 'bg-blue-950 text-blue-400 border-blue-800';
    if (cat.includes('FRECA') || cat.includes('Regional'))
      return 'bg-indigo-950 text-indigo-400 border-indigo-800';
    if (cat.includes('F3') || cat.includes('F2'))
      return 'bg-purple-950 text-purple-400 border-purple-800';
    if (cat === 'Fórmula 1')
      return 'bg-f1red-dark/80 text-white border-f1red shadow-[0_0_10px_rgba(225,6,0,0.4)]';
    return 'bg-gray-800 text-gray-300 border-gray-700';
  };

  const statItems = [
    { label: 'VELOCIDAD', value: stats.velocidad, icon: '🏎️' },
    { label: 'LLUVIA', value: stats.lluvia, icon: '🌧️' },
    { label: 'ATAQUE', value: stats.ataque, icon: '⚔️' },
    { label: 'DEFENSA', value: stats.defensa, icon: '🛡️' },
    { label: 'GESTIÓN', value: stats.gestion, icon: '🛞' },
    { label: 'CONSISTENCIA', value: stats.consistencia, icon: '🎯' },
    { label: 'FAMA', value: stats.fama, icon: '🌟' },
    { label: 'POPULARIDAD', value: stats.popularidad, icon: '❤️' },
  ];

  return (
    <header className="w-full bg-asfalto-card border-b border-asfalto-border p-3 sm:p-4 sticky top-0 z-30 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        {/* Superior: Nombre, Edad, OVR, Categoría y Temporada */}
        <div className="flex items-center justify-between gap-2 border-b border-asfalto-border/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-f1red animate-pulse" />
            <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
              {nombre}
            </h2>
            <span className="bg-f1red-dark/80 text-white border border-f1red px-2 py-0.5 rounded font-mono text-xs font-bold">
              OVR {ovr}
            </span>
            <span className="text-xs font-mono text-telemetria hidden sm:inline">
              ({nacionalidad} • {edad} AÑOS • {equipo || 'Sin Escudería'})
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`px-2 py-0.5 rounded border uppercase font-bold text-xs ${getCategoryBadgeColor(
                categoria
              )}`}
            >
              {categoria}
            </span>
            <span className="bg-asfalto border border-asfalto-border px-2 py-0.5 rounded text-telemetria-light">
              TEMP. <strong className="text-f1red-light font-display text-sm">{temporada}</strong>
            </span>
          </div>
        </div>

        {/* Rejilla de Habilidades (8 métricas) */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {statItems.map((s) => (
            <div
              key={s.label}
              className="bg-asfalto/90 border border-asfalto-border p-1.5 rounded flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[9px] text-telemetria uppercase font-mono tracking-tighter">
                <span>{s.label}</span>
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-mono text-xs sm:text-sm font-bold text-white">
                  {s.value}
                </span>
                <div className="w-8 h-1 bg-asfalto-border rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      s.value >= 70
                        ? 'bg-emerald-500'
                        : s.value >= 40
                        ? 'bg-telemetria-gold'
                        : 'bg-f1red'
                    }`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
