import React from 'react';
import { motion } from 'framer-motion';
import { Evento } from '../engine/types';

interface EventCardProps {
  evento: Evento;
  onSelectOption: (index: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ evento, onSelectOption }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-xl mx-auto bg-asfalto-card border border-asfalto-border rounded-lg shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Encabezado del Evento */}
      <div className="bg-gradient-to-r from-asfalto-card via-asfalto-border to-asfalto-card p-4 sm:p-5 border-b border-asfalto-border flex items-start justify-between gap-3">
        <div>
          {evento.personajeRecurrente && (
            <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-wider text-f1red-light bg-f1red-dark/20 border border-f1red/40 px-2 py-0.5 rounded mb-2">
              Rivalidad: {evento.personajeRecurrente}
            </span>
          )}
          <h1 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white leading-snug">
            {evento.titulo}
          </h1>
        </div>
      </div>

      {/* Descripción Narrativa */}
      <div className="p-4 sm:p-6 text-telemetria-light text-sm sm:text-base leading-relaxed space-y-4">
        <p className="border-l-2 border-f1red pl-3 italic text-gray-300">
          "{evento.descripcion}"
        </p>
      </div>

      {/* Opciones de Decisión */}
      <div className="p-4 sm:p-6 pt-0 flex flex-col gap-3">
        <span className="text-xs font-mono uppercase tracking-widest text-telemetria font-semibold mb-1">
          DECISIÓN TÁCTICA:
        </span>

        {evento.opciones.map((opcion, idx) => (
          <button
            key={idx}
            onClick={() => onSelectOption(idx)}
            className="w-full text-left p-3.5 sm:p-4 bg-asfalto border border-asfalto-border hover:border-f1red hover:bg-asfalto-hover rounded-md transition-all duration-150 group flex items-start gap-3 active:scale-[0.99]"
          >
            <span className="font-mono text-f1red font-bold text-sm bg-f1red/10 border border-f1red/30 px-2 py-1 rounded group-hover:bg-f1red group-hover:text-white transition-colors">
              0{idx + 1}
            </span>
            <span className="text-xs sm:text-sm font-medium text-white group-hover:text-telemetria-light leading-snug pt-0.5">
              {opcion.texto}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
