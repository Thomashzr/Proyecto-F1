import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { OfertaEquipo } from '../engine/types';

export const ScreenOfertasEquipos: React.FC = () => {
  const { playerState, elegirOfertaEquipo } = useGameStore();

  if (!playerState || playerState.ofertasPendientes.length === 0) return null;

  return (
    <div className="min-h-screen bg-asfalto carbon-texture flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-asfalto-card border border-asfalto-border rounded-lg p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
      >
        <div className="border-b border-asfalto-border pb-4">
          <span className="font-mono text-xs text-telemetria uppercase tracking-widest block font-semibold">
            OFERTAS DE ESCUDERÍA RECIBIDAS • TEMPORADA {playerState.temporada}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide mt-1">
            SELECCIONÁ TU PRÓXIMO EQUIPO
          </h1>
          <p className="text-telemetria text-xs sm:text-sm mt-2 font-sans">
            Tus actuaciones despertaron el interés de estas escuderías para competir en{' '}
            <strong className="text-f1red-light uppercase">{playerState.categoria}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {playerState.ofertasPendientes.map((oferta: OfertaEquipo, idx: number) => (
            <button
              key={oferta.id || idx}
              onClick={() => elegirOfertaEquipo(oferta)}
              className="w-full text-left p-4 bg-asfalto border border-asfalto-border hover:border-f1red hover:bg-asfalto-hover rounded-md transition-all duration-150 group flex flex-col gap-2 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white group-hover:text-f1red-light uppercase">
                  {oferta.nombre}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  RENDIMIENTO {oferta.nivelRendimiento}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-telemetria">
                <span>País: {oferta.pais}</span>
                <span className="text-telemetria-gold">Expectativa: {oferta.expectativas}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
