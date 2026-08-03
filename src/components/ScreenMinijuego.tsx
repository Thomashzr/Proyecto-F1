import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextoMinijuego, ResultadoMinijuego } from '../engine/types';

interface ScreenMinijuegoProps {
  minijuego: ContextoMinijuego;
  onResponder: (opcionIdx: number) => ResultadoMinijuego;
  onContinuar: () => void;
}

export const ScreenMinijuego: React.FC<ScreenMinijuegoProps> = ({
  minijuego,
  onResponder,
  onContinuar,
}) => {
  const [resultado, setResultado] = useState<ResultadoMinijuego | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);

  const handleSeleccion = (idx: number) => {
    if (resultado) return;
    setOpcionSeleccionada(idx);
    const res = onResponder(idx);
    setResultado(res);
  };

  const getObjetivoBadge = (obj: 'victoria' | 'podio' | 'puntos') => {
    if (obj === 'victoria') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (obj === 'podio') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  return (
    <div className="min-h-screen bg-asfalto carbon-texture flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-asfalto-card border border-asfalto-border rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden"
      >
        {/* Header de Minijuego */}
        <div className="border-b border-asfalto-border pb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-telemetria uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-f1red animate-ping" />
              MINIJUEGO DE CARRERA CLAVE
            </span>
            <span className={`px-2.5 py-0.5 rounded border text-xs font-mono font-bold uppercase ${getObjetivoBadge(minijuego.objetivo)}`}>
              OBJETIVO: {minijuego.objetivo.toUpperCase()}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase mt-1">
            {minijuego.titulo}
          </h2>
          <p className="text-telemetria text-sm leading-relaxed mt-1 font-sans">
            {minijuego.descripcion}
          </p>
        </div>

        {/* Lista de Opciones */}
        <div className="flex flex-col gap-3">
          {minijuego.opciones.map((op, idx) => {
            const isSelected = opcionSeleccionada === idx;
            return (
              <button
                key={op.id || idx}
                disabled={resultado !== null}
                onClick={() => handleSeleccion(idx)}
                className={`w-full text-left p-4 border rounded-lg transition-all duration-200 group flex flex-col gap-1.5 active:scale-[0.99] ${
                  isSelected
                    ? resultado?.exito
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-amber-950/80 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : resultado !== null
                    ? 'bg-asfalto/50 border-asfalto-border/40 opacity-50 cursor-not-allowed'
                    : 'bg-asfalto border-asfalto-border hover:border-f1red hover:bg-asfalto-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-base sm:text-lg font-bold text-white group-hover:text-f1red-light">
                    {op.texto}
                  </span>
                </div>
                <p className="text-xs text-telemetria font-sans">{op.descripcion}</p>
              </button>
            );
          })}
        </div>

        {/* Modal de Feedback de Resultado de Minijuego */}
        <AnimatePresence>
          {resultado && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-5 rounded-lg border flex flex-col gap-3 mt-2 ${
                resultado.exito
                  ? 'bg-emerald-950/90 border-emerald-600 text-emerald-100'
                  : 'bg-amber-950/90 border-amber-600 text-amber-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                  {resultado.exito ? '🏆 ¡MANIOBRA EXITOSA!' : '⚠️ OPORTUNIDAD PERDIDA'}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 border border-white/20 font-bold">
                  {resultado.exito ? '+20 SCORE DE CARRERA' : '+0 SCORE MODIFICADOR'}
                </span>
              </div>
              <p className="text-sm font-sans leading-relaxed text-white/90">
                {resultado.mensaje}
              </p>

              <button
                onClick={onContinuar}
                className="mt-2 w-full py-3 bg-f1red hover:bg-f1red-light text-white font-display font-bold uppercase tracking-wider rounded transition-all duration-150 shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>CONTINUAR A LA CARRERA</span>
                <span>➔</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
