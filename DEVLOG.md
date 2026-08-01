# DEVLOG — Bitácora de Desarrollo de "El Campeón" (Simulador F1)

## [2026-08-01] Implementación Completa de Prompt 5 — Corrección de Errores, Balance y Ciclo de F1 (VERSIÓN ALPHA v0.4.1)

### 1. Resumen de Correcciones Aplicadas

- **Versión Actualizada**: Configurada a **VERSIÓN ALPHA v0.4.1** en la interfaz (`ScreenInicio.tsx`), `package.json` (`0.4.0-alpha`) y el HUD.
- **Bug 1: Límite de Eventos por Temporada en Categorías Nacionales**:
  - En `Karting Regional`, `Karting Nacional` y `Fórmula Nacional` se genera exactamente 1 evento deportivo (carrera clave) + máximo 1 evento extradeportivo opcional.
- **Bug 2: Progresión de Habilidades y Pantalla de Ofertas de Escudería**:
  - Se redujeron los deltas de entrenamiento de +7 a +4 y deltas de eventos a escala suave (+3 a +8).
  - Se implementó `ScreenOfertasEquipos.tsx` para permitir elegir entre 3 ofertas de equipo al cambiar de escudería o ascender de categoría.
- **Bug 3: Fuente Única de Verdad de Categoría**:
  - Auditada la interfaz para garantizar que todos los componentes dependan exclusivamente de `playerState.categoria`.
- **Bug 4: Extensión de Carrera en F1 Hasta los 38 Años & Declive Progresivo**:
  - Eliminado el corte de juego al llegar a F1.
  - El piloto puede competir en F1 hasta los 38 años.
  - A partir de los 30 años se aplica declive estacional (-1 a los 30-31, -2 a los 32-34, -3 a los 35-38).
  - Opción de retiro voluntario habilitada en pre-temporada desde los 32 años.
- **Bug 5: Generación Dinámica del Rival Deportivo**:
  - Módulo [nombresRivales.ts](file:///home/thomi/M%C3%BAsica/Proyecto%20F1/src/data/nombresRivales.ts) con 25 nombres y 25 apellidos que generan deterministamente el nombre del rival (`rivalNombre`) según la semilla.
- **Bug 6: Deck de Eventos Ampliado**:
  - Incorporados nuevos eventos deportivos y extradeportivos clasificando el campo `tipo`.

---

### 2. Resultados de Simulación de 1.000 Partidas (Prompt 5)

```text
================ RESULTADOS DE SIMULACIÓN PROMPT 5 (1000 PARTIDAS) ================
Partidas jugadas: 1000
Partidas inconclusas (loops): 0 (0%)
Promedio de eventos por partida: 27.88
Promedio de temporadas por partida: 13.68
Edad promedio de retiro: 21.7 años

Distribución de Finales:
  - final-f1-subcampeon-agridulce: 438 (43.8%)
  - final-f1-campeon-sucio:        295 (29.5%)
  - final-f1-mitad-de-tabla:        262 (26.2%)
  - final-estancado-inferiores:       3 (0.3%)
  - final-quema-mental-abandono:      2 (0.2%)
===================================================================================
```

---

## Estado Actual del Proyecto
- **Versión**: ALPHA v0.4.1 (Prompt 5 completado y validado)
- **Compilación / Pruebas**:
  - `pnpm test` $\rightarrow$ 5 suites pasadas al 100% (incluyendo simulación masiva).
  - `pnpm typecheck` $\rightarrow$ 0 errores de compilación (`strict: true`).
  - `pnpm build` $\rightarrow$ Build de producción generado en 3.55s.
