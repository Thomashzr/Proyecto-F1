import React from 'react';
import { useGameStore } from './store/useGameStore';
import { ScreenInicio } from './pages/ScreenInicio';
import { ScreenEntrenamiento } from './pages/ScreenEntrenamiento';
import { ScreenJuego } from './pages/ScreenJuego';
import { ScreenResultado } from './pages/ScreenResultado';

export const App: React.FC = () => {
  const { pantallaActual } = useGameStore();

  switch (pantallaActual) {
    case 'inicio':
      return <ScreenInicio />;
    case 'entrenamiento':
      return <ScreenEntrenamiento />;
    case 'juego':
      return <ScreenJuego />;
    case 'resultado':
      return <ScreenResultado />;
    default:
      return <ScreenInicio />;
  }
};

export default App;
