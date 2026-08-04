import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { StatKey } from '../engine/types';

export const ScreenEntrenamiento: React.FC = () => {
  const { playerState, opcionesEntrenamiento, elegirEntrenamiento } = useGameStore();

  if (!playerState) return null;

  const categoriaVisible = playerState.situacionActual ? playerState.situacionActual.categoria : playerState.categoria;

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
            INICIO DE TEMPORADA {playerState.temporada} • {categoriaVisible.toUpperCase()} ({playerState.edad} AÑOS)
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide mt-1">
            ENTRENAMIENTO INICIAL
          </h1>
          <p className="text-telemetria text-xs sm:text-sm mt-2 font-sans">
            Elegí una sola área de enfoque técnico para desarrollar tu piloto antes de salir a pista este año.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {opcionesEntrenamiento.map((opcion, idx) => (
            <button
              key={idx}
              onClick={() => elegirEntrenamiento(opcion.habilidad as StatKey)}
              className="w-full text-left p-4 bg-asfalto border border-asfalto-border hover:border-f1red hover:bg-asfalto-hover rounded-md transition-all duration-150 group flex flex-col gap-1 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white group-hover:text-f1red-light uppercase">
                  {opcion.titulo}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  +{opcion.incremento} {opcion.habilidad.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-telemetria font-sans">{opcion.descripcion}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
