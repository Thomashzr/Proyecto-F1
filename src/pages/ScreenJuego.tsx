import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { HUDStats } from '../components/HUDStats';
import { EventCard } from '../components/EventCard';
import { FeedbackModal } from '../components/FeedbackModal';

export const ScreenJuego: React.FC = () => {
  const {
    playerState,
    eventoActual,
    feedbackResultado,
    elegirOpcion,
    continuarSiguienteEvento,
  } = useGameStore();

  if (!playerState) return null;

  return (
    <div className="min-h-screen bg-asfalto carbon-texture flex flex-col justify-between">
      {/* HUD Persistente (8 Métricas + Edad y Nacionalidad) */}
      <HUDStats
        nombre={playerState.nombre}
        nacionalidad={playerState.nacionalidad}
        edad={playerState.edad}
        situacionActual={playerState.situacionActual}
        temporada={playerState.temporada}
        stats={playerState.stats}
      />

      {/* Área Principal del Evento */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <AnimatePresence mode="wait">
          {feedbackResultado ? (
            <FeedbackModal
              key="feedback"
              opcionTexto={feedbackResultado.opcionTexto}
              textoResultado={feedbackResultado.textoResultado}
              statsDeltas={feedbackResultado.statsDeltas}
              onContinue={continuarSiguienteEvento}
              esFinal={playerState.finalizado}
            />
          ) : eventoActual ? (
            <EventCard
              key={eventoActual.id}
              evento={eventoActual}
              onSelectOption={elegirOpcion}
            />
          ) : (
            <div key="no-event" className="text-center p-8 bg-asfalto-card border border-asfalto-border rounded">
              <p className="text-telemetria font-mono text-sm">
                Fin del calendario de la temporada {playerState.temporada}. Preparando balance...
              </p>
              <button
                onClick={continuarSiguienteEvento}
                className="mt-4 px-6 py-2.5 bg-f1red text-white font-display uppercase font-bold rounded"
              >
                VER RESUMEN DE TEMPORADA ➔
              </button>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer F1 Signature */}
      <footer className="w-full bg-asfalto-card border-t border-asfalto-border p-3 text-center font-mono text-xs text-telemetria-muted">
        {playerState.historial.length} EVENTOS COMPLETADOS
      </footer>
    </div>
  );
};
