import React from 'react';
import { useGameStore } from './store/useGameStore';
import { ScreenInicio } from './pages/ScreenInicio';
import { ScreenEntrenamiento } from './pages/ScreenEntrenamiento';
import { ScreenOfertasEquipos } from './pages/ScreenOfertasEquipos';
import { ScreenJuego } from './pages/ScreenJuego';
import { ScreenResumenTemporada } from './pages/ScreenResumenTemporada';
import { ScreenResultado } from './pages/ScreenResultado';

export const App: React.FC = () => {
  const { pantallaActual } = useGameStore();

  switch (pantallaActual) {
    case 'inicio':
      return <ScreenInicio />;
    case 'entrenamiento':
      return <ScreenEntrenamiento />;
    case 'ofertasEquipos':
      return <ScreenOfertasEquipos />;
    case 'juego':
      return <ScreenJuego />;
    case 'resumenTemporada':
      return <ScreenResumenTemporada />;
    case 'resultado':
      return <ScreenResultado />;
    default:
      return <ScreenInicio />;
  }
};

export default App;
