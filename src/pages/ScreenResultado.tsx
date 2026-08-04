import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { useGameStore } from '../store/useGameStore';
import { evaluarArquetipoFinal } from '../data/arquetiposFinales';

export const ScreenResultado: React.FC = () => {
  const { playerState, reiniciarJuego } = useGameStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [generandoImagen, setGenerandoImagen] = useState(false);

  if (!playerState) return null;

  const resultadoDinámico = evaluarArquetipoFinal(playerState);

  const handleDescargarTarjeta = async () => {
    if (!cardRef.current) return;
    try {
      setGenerandoImagen(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `el-campeon-${playerState.nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generando tarjeta para compartir:', err);
    } finally {
      setGenerandoImagen(false);
    }
  };

  const handleCompartirTexto = () => {
    const texto = `🏎️ Mi carrera en "Pistero (Simulador F1)":\nPiloto: ${playerState.nombre} (${playerState.nacionalidad})\nConclusión: ${resultadoDinámico.titulo}\nCategoría Final: ${playerState.categoria} (${playerState.temporada} temporadas • ${playerState.edad} años)`;
    if (navigator.share) {
      navigator.share({ title: 'Pistero F1', text: texto }).catch(() => {});
    } else {
      navigator.clipboard.writeText(texto);
      alert('¡Resultado copiado al portapapeles!');
    }
  };

  return (
    <div className="min-h-screen bg-asfalto carbon-texture p-4 sm:p-8 flex flex-col justify-between items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-xl flex flex-col gap-6"
      >
        {/* TARJETA DE RESULTADO DINÁMICA COMPARTIBLE */}
        <div
          ref={cardRef}
          className="bg-asfalto-card border-2 border-asfalto-border rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden"
        >
          {/* Listón lateral de estatus */}
          <div
            className={`absolute top-0 left-0 right-0 h-2 ${
              resultadoDinámico.esExito ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-f1red'
            }`}
          />

          <div className="flex items-center justify-between border-b border-asfalto-border pb-4">
            <div>
              <span className="font-mono text-xs text-telemetria uppercase tracking-widest block">
                FICHA HISTÓRICA DE CARRERA
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
                {playerState.nombre}
              </h2>
              <span className="text-xs font-mono text-telemetria">
                {playerState.nacionalidad} • {playerState.edad} AÑOS DE EDAD
              </span>
            </div>
            <span
              className={`font-mono text-xs px-3 py-1 rounded border uppercase font-bold ${
                resultadoDinámico.esExito
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-red-950 text-red-400 border-red-800'
              }`}
            >
              {resultadoDinámico.esExito ? 'CARRERA EXITOSA' : 'FICHA CERRADA'}
            </span>
          </div>

          {/* Bloque del Resultado Dinámico Interpolado (B.5) */}
          <div className="bg-asfalto/80 border border-asfalto-border p-4 rounded-lg space-y-2">
            <span className="font-mono text-xs text-f1red font-bold uppercase tracking-wider block">
              {resultadoDinámico.subtitulo}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase leading-none">
              {resultadoDinámico.titulo}
            </h1>
            <p className="text-telemetria-light text-xs sm:text-sm leading-relaxed font-sans pt-1">
              {resultadoDinámico.descripcion}
            </p>
          </div>

          {/* Estadísticas de Pista */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-asfalto border border-asfalto-border p-2.5 rounded">
              <span className="text-[10px] text-telemetria block">CATEGORÍA</span>
              <span className="text-xs font-bold text-white uppercase">
                {playerState.situacionActual ? playerState.situacionActual.categoria : playerState.categoria}
              </span>
            </div>
            <div className="bg-asfalto border border-asfalto-border p-2.5 rounded">
              <span className="text-[10px] text-telemetria block">VELOCIDAD</span>
              <span className="text-sm font-bold text-emerald-400">{playerState.stats.velocidad}</span>
            </div>
            <div className="bg-asfalto border border-asfalto-border p-2.5 rounded">
              <span className="text-[10px] text-telemetria block">FAMA</span>
              <span className="text-sm font-bold text-telemetria-gold">{playerState.stats.fama}</span>
            </div>
            <div className="bg-asfalto border border-asfalto-border p-2.5 rounded">
              <span className="text-[10px] text-telemetria block">POPULARIDAD</span>
              <span className="text-sm font-bold text-f1red-light">{playerState.stats.popularidad}</span>
            </div>
          </div>

          {/* Resumen del Historial */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-telemetria uppercase tracking-widest block font-semibold">
              HITOS CLAVE ({playerState.historial.length} Eventos • {playerState.temporada} Temporadas):
            </span>
            <div className="bg-asfalto border border-asfalto-border rounded p-3 max-h-36 overflow-y-auto text-xs space-y-2 font-sans">
              {playerState.historial.map((item, idx) => (
                <div key={idx} className="border-b border-asfalto-border/60 pb-1.5 last:border-0">
                  <span className="font-mono text-f1red font-bold">
                    [T{item.temporada} - {item.categoria}]
                  </span>{' '}
                  <span className="text-white font-medium">{item.eventoTitulo}</span>
                  <p className="text-telemetria text-[11px] italic">"{item.textoResultado}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center text-[10px] font-mono text-telemetria-muted border-t border-asfalto-border pt-3">
            <span>PISTERO F1 • ALPHA v0.7.0</span>
          </div>
        </div>

        {/* Acciones de Compartir / Reiniciar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handleDescargarTarjeta}
            disabled={generandoImagen}
            className="flex-1 py-3 bg-f1red hover:bg-f1red-light text-white font-display uppercase tracking-wider font-bold text-sm rounded transition-all active:scale-[0.99] shadow-lg flex items-center justify-center gap-2"
          >
            {generandoImagen ? 'GENERANDO...' : '📥 DESCARGAR TARJETA PNG'}
          </button>
          <button
            onClick={handleCompartirTexto}
            className="flex-1 py-3 bg-asfalto-card border border-asfalto-border hover:border-telemetria text-white font-display uppercase tracking-wider font-bold text-sm rounded transition-all active:scale-[0.99]"
          >
            📲 COMPARTIR RESULTADO
          </button>
        </div>

        <button
          onClick={reiniciarJuego}
          className="w-full py-3 bg-asfalto border border-asfalto-border hover:border-f1red text-telemetria-light font-display uppercase tracking-wider font-bold text-sm rounded transition-all"
        >
          🔄 CORRER OTRA PARTIDA
        </button>
      </motion.div>
    </div>
  );
};
