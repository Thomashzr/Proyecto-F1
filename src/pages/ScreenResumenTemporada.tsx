import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

export const ScreenResumenTemporada: React.FC = () => {
  const { playerState, avanzarDesdeResumenTemporada } = useGameStore();

  if (!playerState || playerState.historialCampeonatos.length === 0) return null;

  const ultimoCampeonato =
    playerState.historialCampeonatos[playerState.historialCampeonatos.length - 1];

  return (
    <div className="min-h-screen bg-asfalto carbon-texture p-4 sm:p-8 flex flex-col items-center justify-between">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-asfalto-card border-2 border-asfalto-border rounded-xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6"
      >
        {/* Encabezado del Resumen */}
        <div className="flex items-center justify-between border-b border-asfalto-border pb-4">
          <div>
            <span className="font-mono text-xs text-telemetria uppercase tracking-widest block font-semibold">
              RESUMEN DE TEMPORADA {ultimoCampeonato.temporada} • {ultimoCampeonato.categoria.toUpperCase()}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
              {ultimoCampeonato.equipo}
            </h1>
          </div>
          <div className="bg-asfalto border border-asfalto-border p-3 rounded text-center">
            <span className="font-mono text-[10px] text-telemetria uppercase block">POSICIÓN FINAL</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-f1red-light">
              #{ultimoCampeonato.posicionFinal}
            </span>
          </div>
        </div>

        {/* Rejilla de Totales del Campeonato */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono">
          <div className="bg-asfalto border border-asfalto-border p-2 rounded">
            <span className="text-[9px] text-telemetria block">PUNTOS</span>
            <span className="text-sm sm:text-base font-bold text-white">{ultimoCampeonato.puntosTotales}</span>
          </div>
          <div className="bg-asfalto border border-asfalto-border p-2 rounded">
            <span className="text-[9px] text-telemetria block">VICTORIAS</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">{ultimoCampeonato.victorias}</span>
          </div>
          <div className="bg-asfalto border border-asfalto-border p-2 rounded">
            <span className="text-[9px] text-telemetria block">PODIOS</span>
            <span className="text-sm sm:text-base font-bold text-telemetria-gold">{ultimoCampeonato.podios}</span>
          </div>
          <div className="bg-asfalto border border-asfalto-border p-2 rounded">
            <span className="text-[9px] text-telemetria block">POLES</span>
            <span className="text-sm sm:text-base font-bold text-purple-400">{ultimoCampeonato.poles}</span>
          </div>
          <div className="bg-asfalto border border-asfalto-border p-2 rounded">
            <span className="text-[9px] text-telemetria block">V. RÁPIDAS</span>
            <span className="text-sm sm:text-base font-bold text-blue-400">{ultimoCampeonato.vueltasRapidas}</span>
          </div>
          <div className="bg-asfalto border border-asfalto-border p-2 rounded">
            <span className="text-[9px] text-telemetria block">ABANDONOS</span>
            <span className="text-sm sm:text-base font-bold text-red-400">{ultimoCampeonato.abandonos}</span>
          </div>
        </div>

        {/* Tabla Completa de Resultados por Fecha */}
        <div className="space-y-2">
          <span className="font-mono text-xs text-telemetria uppercase tracking-widest block font-semibold">
            RESULTADOS FECHA POR FECHA (TIMING SHEET):
          </span>
          <div className="bg-asfalto border border-asfalto-border rounded overflow-hidden max-h-48 overflow-y-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-asfalto-card text-telemetria border-b border-asfalto-border text-[10px] uppercase">
                  <th className="p-2">F#</th>
                  <th className="p-2">GRAN PREMIO</th>
                  <th className="p-2 text-center">POS</th>
                  <th className="p-2 text-center">PTS</th>
                  <th className="p-2 text-right">DETALLES</th>
                </tr>
              </thead>
              <tbody>
                {ultimoCampeonato.fechas.map((fecha) => (
                  <tr key={fecha.numeroFecha} className="border-b border-asfalto-border/40 hover:bg-asfalto-hover">
                    <td className="p-2 text-telemetria font-bold">{fecha.numeroFecha}</td>
                    <td className="p-2 text-white font-medium">{fecha.nombreGranPremio}</td>
                    <td className="p-2 text-center font-bold text-emerald-400">
                      {fecha.posicion === 1 ? '🥇 1st' : fecha.posicion <= 3 ? `🥉 ${fecha.posicion}th` : `${fecha.posicion}th`}
                    </td>
                    <td className="p-2 text-center font-bold text-telemetria-gold">+{fecha.puntos}</td>
                    <td className="p-2 text-right text-[10px] text-telemetria">
                      {fecha.pole && <span className="bg-purple-950 text-purple-300 px-1 py-0.5 rounded mr-1">POLE</span>}
                      {fecha.vueltaRapida && <span className="bg-blue-950 text-blue-300 px-1 py-0.5 rounded mr-1">VR</span>}
                      {fecha.esCarreraClave && <span className="bg-f1red-dark text-white px-1 py-0.5 rounded">CLAVE</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón de Continuar */}
        <button
          onClick={avanzarDesdeResumenTemporada}
          className="w-full py-4 bg-f1red hover:bg-f1red-light text-white font-display uppercase tracking-wider font-bold text-lg rounded transition-all active:scale-[0.99] shadow-xl shadow-f1red/20"
        >
          AVANZAR A LA SIGUIENTE TEMPORADA ➔
        </button>
      </motion.div>
    </div>
  );
};
