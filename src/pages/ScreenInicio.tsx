import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { EQUIPOS_KARTING } from '../data/equiposKarting';
import { PAISES } from '../data/paises';

export const ScreenInicio: React.FC = () => {
  const { iniciarJuego } = useGameStore();

  const [nombre, setNombre] = useState('');
  const [nacionalidad, setNacionalidad] = useState('Argentina');
  const [equipoKartingId, setEquipoKartingId] = useState(EQUIPOS_KARTING[0].id);
  const [busquedaPais, setBusquedaPais] = useState('');

  const paisesFiltrados = useMemo(() => {
    if (!busquedaPais.trim()) return PAISES;
    return PAISES.filter((p) =>
      p.nombre.toLowerCase().includes(busquedaPais.toLowerCase())
    );
  }, [busquedaPais]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    iniciarJuego(nombre.trim(), nacionalidad, equipoKartingId);
  };

  return (
    <div className="min-h-screen bg-asfalto carbon-texture flex flex-col justify-between items-center p-4 sm:p-8">
      {/* Top Header */}
      <div className="w-full max-w-2xl flex items-center justify-between border-b border-asfalto-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-f1red animate-pulse" />
          <span className="font-mono text-xs text-telemetria tracking-widest uppercase">
            PISTERO • SIMULADOR F1
          </span>
        </div>
        <span className="font-mono text-xs text-f1red font-bold uppercase bg-f1red/10 border border-f1red/30 px-2 py-0.5 rounded">
          VERSIÓN ALPHA v0.7.0
        </span>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-asfalto-card border-2 border-asfalto-border rounded-xl p-6 sm:p-8 shadow-2xl my-6"
      >
        <div className="mb-6 border-b border-asfalto-border pb-4">
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            CREACIÓN DE PILOTO
          </h1>
          <p className="text-telemetria text-xs sm:text-sm mt-1 font-sans">
            Comenzá tu trayectoria automovilística desde los 9 años en el Karting Regional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label htmlFor="nombre-piloto" className="font-mono text-xs text-telemetria uppercase tracking-wider block font-bold">
              NOMBRE Y APELLIDO DEL PILOTO:
            </label>
            <input
              id="nombre-piloto"
              type="text"
              required
              placeholder="Ej: Franco Colapinto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-asfalto border border-asfalto-border focus:border-f1red text-white font-mono p-3 rounded text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Nacionalidad con filtro y grilla de 2 columnas (A.1) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="busqueda-pais" className="font-mono text-xs text-telemetria uppercase tracking-wider font-bold">
                SELECCIONÁ NACIONALIDAD ({nacionalidad}):
              </label>
              <input
                id="busqueda-pais"
                type="text"
                placeholder="Buscar país..."
                value={busquedaPais}
                onChange={(e) => setBusquedaPais(e.target.value)}
                className="bg-asfalto border border-asfalto-border text-white text-xs font-mono px-2 py-1 rounded focus:outline-none focus:border-f1red"
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto bg-asfalto border border-asfalto-border p-2 rounded">
              {paisesFiltrados.map((p) => (
                <button
                  type="button"
                  key={p.codigo}
                  onClick={() => setNacionalidad(p.nombre)}
                  className={`flex items-center gap-2 p-2 text-xs font-mono rounded text-left transition-colors ${
                    nacionalidad === p.nombre
                      ? 'bg-f1red-dark text-white font-bold border border-f1red'
                      : 'hover:bg-asfalto-hover text-telemetria-light'
                  }`}
                >
                  <span className="text-base">{p.bandera}</span>
                  <span className="truncate">{p.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Equipo Inicial de Karting */}
          <div className="space-y-2">
            <label htmlFor="equipo-karting" className="font-mono text-xs text-telemetria uppercase tracking-wider block font-bold">
              EQUIPO INICIAL DE KARTING REGIONAL:
            </label>
            <select
              id="equipo-karting"
              value={equipoKartingId}
              onChange={(e) => setEquipoKartingId(e.target.value)}
              className="w-full bg-asfalto border border-asfalto-border focus:border-f1red text-white font-mono p-3 rounded text-sm focus:outline-none transition-colors"
            >
              {EQUIPOS_KARTING.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre} ({equipo.provincia}) — Presupuesto: ${equipo.presupuestoInicial}k
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!nombre.trim()}
            className="w-full mt-2 py-4 bg-f1red hover:bg-f1red-light disabled:opacity-50 text-white font-display uppercase tracking-wider font-bold text-lg rounded transition-all active:scale-[0.99] shadow-lg shadow-f1red/20"
          >
            INICIAR CARRERA DESDE LOS 9 AÑOS ➔
          </button>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="w-full max-w-2xl text-center font-mono text-[10px] text-telemetria-muted">
        PISTERO SIMULADOR F1 • ALPHA v0.7.0
      </div>
    </div>
  );
};
