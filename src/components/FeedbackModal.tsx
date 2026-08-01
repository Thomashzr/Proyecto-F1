import React from 'react';
import { motion } from 'framer-motion';
import { PlayerStats, StatKey } from '../engine/types';

interface FeedbackModalProps {
  opcionTexto: string;
  textoResultado: string;
  statsDeltas: Partial<PlayerStats>;
  onContinue: () => void;
  esFinal: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  opcionTexto,
  textoResultado,
  statsDeltas,
  onContinue,
  esFinal,
}) => {
  const statLabels: Record<StatKey, string> = {
    velocidad: 'Velocidad',
    lluvia: 'Lluvia',
    ataque: 'Ataque',
    defensa: 'Defensa',
    gestion: 'Gestión',
    consistencia: 'Consistencia',
    fama: 'Fama',
    popularidad: 'Popularidad',
  };

  const deltasList = (Object.keys(statsDeltas) as StatKey[])
    .map((key) => {
      const val = statsDeltas[key];
      if (val === undefined || val === 0) return null;
      return {
        key,
        label: statLabels[key] || key,
        value: val,
      };
    })
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-xl mx-auto bg-asfalto-card border border-f1red/50 rounded-lg shadow-2xl p-5 sm:p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between border-b border-asfalto-border pb-3">
        <span className="font-mono text-xs text-telemetria uppercase tracking-widest font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-f1red animate-ping" />
          RESULTADO DE LA DECISIÓN
        </span>
      </div>

      <div className="bg-asfalto/60 p-3 rounded border border-asfalto-border text-xs font-mono text-telemetria">
        Opción elegida: <span className="text-white italic">"{opcionTexto}"</span>
      </div>

      <p className="text-white text-sm sm:text-base leading-relaxed border-l-2 border-f1red pl-3 py-1 font-sans">
        {textoResultado}
      </p>

      {/* Lista de deltas de habilidades */}
      {deltasList.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {deltasList.map((item) => {
            if (!item) return null;
            const isPos = item.value > 0;
            return (
              <span
                key={item.key}
                className={`font-mono text-xs px-2.5 py-1 rounded border font-semibold ${
                  isPos
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                    : 'bg-red-950/80 border-red-800 text-red-400'
                }`}
              >
                {item.label}: {isPos ? `+${item.value}` : item.value}
              </span>
            );
          })}
        </div>
      )}

      <button
        onClick={onContinue}
        className="mt-3 w-full py-3 bg-f1red hover:bg-f1red-light text-white font-display uppercase tracking-wider font-bold text-base rounded transition-all active:scale-[0.99] shadow-lg shadow-f1red/20"
      >
        {esFinal ? 'VER RESULTADO FINAL DE CARRERA ➔' : 'SIGUIENTE EVENTO ➔'}
      </button>
    </motion.div>
  );
};
