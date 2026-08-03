import React from 'react';
import { useGameStore } from './store/useGameStore';
import { ScreenInicio } from './pages/ScreenInicio';
import { ScreenEntrenamiento } from './pages/ScreenEntrenamiento';
import { ScreenOfertasEquipos } from './pages/ScreenOfertasEquipos';
import { ScreenJuego } from './pages/ScreenJuego';
import { ScreenMinijuego } from './components/ScreenMinijuego';
import { ScreenResumenTemporada } from './pages/ScreenResumenTemporada';
import { ScreenResultado } from './pages/ScreenResultado';

export const App: React.FC = () => {
  const {
    pantallaActual,
    minijuegoActual,
    responderMinijuego,
    continuarDesdeMinijuego,
  } = useGameStore();

  switch (pantallaActual) {
    case 'inicio':
      return <ScreenInicio />;
    case 'entrenamiento':
      return <ScreenEntrenamiento />;
    case 'ofertasEquipos':
      return <ScreenOfertasEquipos />;
    case 'minijuego':
      if (!minijuegoActual) return <ScreenJuego />;
      return (
        <ScreenMinijuego
          minijuego={minijuegoActual}
          onResponder={responderMinijuego}
          onContinuar={continuarDesdeMinijuego}
        />
      );
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
