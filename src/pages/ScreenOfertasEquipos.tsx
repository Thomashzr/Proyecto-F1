import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { OfertaEquipo } from '../engine/types';

export const ScreenOfertasEquipos: React.FC = () => {
  const { playerState, elegirOfertaEquipo, solicitarRetiroVoluntario } = useGameStore();

  if (!playerState || playerState.ofertasPendientes.length === 0) return null;

  const esOfertaF1 = playerState.ofertasPendientes.some((o) => o.categoria === 'Fórmula 1');

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
            MERCADO DE CONTRATOS • TEMPORADA {playerState.temporada}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide mt-1">
            {esOfertaF1
              ? '🏆 ¡SUPERLICENCIA F1 ALCANZADA! OFERTAS TITULARES'
              : 'OFERTAS DE ESCUDERÍA Y CONTRATOS'}
          </h1>
          <p className="text-telemetria text-xs sm:text-sm mt-2 font-sans">
            {esOfertaF1
              ? 'Tus actuaciones te abrieron las puertas de la máxima categoría mundial del deporte motor. Elegí tu escudería de F1 o renová tu vínculo para ganar experiencia.'
              : `Elegí tu contrato para las próximas temporadas o decidí el rumbo de tu carrera.`}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {playerState.ofertasPendientes.map((oferta: OfertaEquipo, idx: number) => (
            <button
              key={oferta.id || idx}
              onClick={() => elegirOfertaEquipo(oferta)}
              className={`w-full text-left p-4 border rounded-md transition-all duration-150 group flex flex-col gap-2 active:scale-[0.99] ${
                oferta.esContinuidad
                  ? 'bg-asfalto/80 border-telemetria-gold/60 hover:border-telemetria-gold hover:bg-asfalto-hover'
                  : 'bg-asfalto border-asfalto-border hover:border-f1red hover:bg-asfalto-hover'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white group-hover:text-f1red-light uppercase">
                  {oferta.esContinuidad
                    ? `🔄 RENOVACIÓN CON ${oferta.nombre}`
                    : oferta.nombre}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  {oferta.categoria.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-telemetria">
                <span>
                  📜 {oferta.duracionContrato || 1} {oferta.duracionContrato === 1 ? 'TEMPORADA' : 'TEMPORADAS'} DE CONTRATO
                </span>
                <span className="text-telemetria-gold">Expectativa: {oferta.expectativas}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Retiro Voluntario reubicado a la pantalla de decisiones de contrato (Parte D.1) */}
        {playerState.edad >= 32 && (
          <div className="border-t border-asfalto-border pt-4 text-center">
            <button
              onClick={solicitarRetiroVoluntario}
              className="w-full py-3 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-display uppercase tracking-wider font-bold text-sm rounded transition-all"
            >
              🏁 ANUNCIAR RETIRO VOLUNTARIO DEL AUTOMOVILISMO ({playerState.edad} AÑOS)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
