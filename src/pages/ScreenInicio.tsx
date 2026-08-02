import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { EQUIPOS_KARTING } from '../data/equiposKarting';

const PAISES_POPULARES = [
  'Argentina',
  'Brasil',
  'Uruguay',
  'Chile',
  'México',
  'España',
  'Italia',
  'Francia',
  'Alemania',
  'Reino Unido',
  'Estados Unidos',
  'Japón',
  'Colombia',
];

export const ScreenInicio: React.FC = () => {
  const [nombreInput, setNombreInput] = useState('');
  const [nacionalidad, setNacionalidad] = useState('Argentina');
  const [equipoKartingId, setEquipoKartingId] = useState(EQUIPOS_KARTING[0].id);
  const iniciarJuego = useGameStore((state) => state.iniciarJuego);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = nombreInput.trim() || 'Franco Colapinto';
    iniciarJuego(nombre, nacionalidad, equipoKartingId);
  };

  const equipoSeleccionado = EQUIPOS_KARTING.find((e) => e.id === equipoKartingId);

  return (
    <div className="min-h-screen bg-asfalto carbon-texture flex flex-col justify-between p-4 sm:p-8">
      {/* Header F1 Signature Branding */}
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto border-b border-asfalto-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-f1red animate-pulse" />
          <span className="font-mono text-xs text-telemetria tracking-widest uppercase">
            EL CAMPEÓN • SIMULADOR F1
          </span>
        </div>
        <span className="font-mono text-xs text-f1red font-bold uppercase bg-f1red/10 border border-f1red/30 px-2 py-0.5 rounded">
          VERSIÓN ALPHA v0.5.0
        </span>
      </div>

      {/* Main Content Card */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl mx-auto bg-asfalto-card border border-asfalto-border rounded-lg p-6 sm:p-8 shadow-2xl my-auto flex flex-col gap-6"
      >
        <div className="text-center">
          <span className="font-mono text-xs text-telemetria uppercase tracking-widest bg-asfalto border border-asfalto-border px-3 py-1 rounded">
            PILOTO DE 9 AÑOS • DESDE EL KARTING PROVINCIAL
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white mt-3 leading-none">
            EL CAMPEÓN
          </h1>
          <p className="text-telemetria text-xs sm:text-sm mt-2 font-sans max-w-md mx-auto leading-relaxed">
            Creá tu piloto juvenil, elegí tu equipo provincial de karting y forjá tu estilo desarrollando tus habilidades en pista.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* Nombre */}
          <label className="block">
            <span className="font-mono text-xs text-telemetria uppercase tracking-wider block mb-1.5 font-semibold">
              NOMBRE DEL PILOTO:
            </span>
            <input
              type="text"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              placeholder="Ej: Franco Colapinto"
              maxLength={25}
              className="w-full p-3 bg-asfalto border border-asfalto-border focus:border-f1red text-white font-mono text-sm rounded outline-none transition-colors placeholder:text-telemetria-muted"
            />
          </label>

          {/* Nacionalidad */}
          <label className="block">
            <span className="font-mono text-xs text-telemetria uppercase tracking-wider block mb-1.5 font-semibold">
              NACIONALIDAD:
            </span>
            <select
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              className="w-full p-3 bg-asfalto border border-asfalto-border focus:border-f1red text-white font-mono text-sm rounded outline-none transition-colors"
            >
              {PAISES_POPULARES.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
          </label>

          {/* Equipo Inicial de Karting */}
          <label className="block">
            <span className="font-mono text-xs text-telemetria uppercase tracking-wider block mb-1.5 font-semibold">
              EQUIPO INICIAL DE KARTING (24 PROVINCIAS):
            </span>
            <select
              value={equipoKartingId}
              onChange={(e) => setEquipoKartingId(e.target.value)}
              className="w-full p-3 bg-asfalto border border-asfalto-border focus:border-f1red text-white font-mono text-sm rounded outline-none transition-colors"
            >
              {EQUIPOS_KARTING.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre} ({equipo.provincia})
                </option>
              ))}
            </select>
            {equipoSeleccionado && (
              <p className="text-[11px] text-telemetria mt-1.5 italic font-sans">
                "{equipoSeleccionado.descripcion}"
              </p>
            )}
          </label>

          <button
            type="submit"
            className="w-full py-4 bg-f1red hover:bg-f1red-light text-white font-display text-lg sm:text-xl uppercase tracking-wider font-bold rounded transition-all active:scale-[0.99] shadow-xl shadow-f1red/20 mt-2 flex items-center justify-center gap-2"
          >
            CREAR PILOTO Y LARGAR ➔
          </button>
        </form>

        <div className="text-center font-mono text-[11px] text-telemetria-muted border-t border-asfalto-border pt-4">
          10 Categorías • 6 Habilidades de Pista • Fama & Popularidad
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-telemetria-muted w-full max-w-2xl mx-auto border-t border-asfalto-border pt-4">
        EDICIÓN MOTORSPORT 2026 • PROMPT 3 ACTUALIZADO
      </footer>
    </div>
  );
};
