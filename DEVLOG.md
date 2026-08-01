# DEVLOG — Bitácora de Desarrollo de "El Campeón" (Simulador F1)

## [2026-08-01] Plan de Migración e Implementación — Prompt 4 (ALPHA v0.4)

### 1. Resolución de Conflicto de Regla Dura: Eliminación de Retiro Obligatorio por Lesión
- **Conflicto Detectado**: El Prompt 1.5 definió `final-retiro-lesion` como un Game Over impuesto. La sección 6 del Prompt 4 prohíbe explícitamente cualquier retiro forzado o derrota por lesión.
- **Resolución**:
  - Se elimina `final-retiro-lesion`.
  - Se reemplaza por `final-estancado-rendimiento-bajo` (estancamiento prolongado por bajo nivel técnico sostenido) o retiro voluntario acordado.
  - Se mantiene la cuenta de 8 finales narrativos sin game overs físicos injustos.

#### Diff en `src/data/finales.ts`:
```diff
-  {
-    id: 'final-retiro-lesion',
-    titulo: 'Retiro Forzado por Lesión',
-    subtitulo: 'El cuerpo dijo basta antes que la pasión.',
-    descripcion: 'Los médicos no te dieron el alta para volver a subirte a un monoplaza.',
-    esExito: false,
-    evaluar: (state) => state.stats.consistencia <= 15,
-  },
+  {
+    id: 'final-estancado-rendimiento-bajo',
+    titulo: 'Retiro por Rendimiento Insuficiente',
+    subtitulo: 'Sin la velocidad requerida para mantener el asiento.',
+    descripcion: 'Tras varias temporadas sin alcanzar los tiempos mínimos de clasificación, el equipo decidió no renovar tu plaza.',
+    esExito: false,
+    evaluar: (state) => state.stats.velocidad <= 20 && state.stats.consistencia <= 20,
+  },
```

---

### 2. Nuevas Características de Arquitectura (ALPHA v0.4)
- **OVR (Media General)**: Función pura `calcularMediaGeneral(stats)` (promedio de las 6 habilidades de pista).
- **Control de Repetición Estacional**: Campo `eventosUsadosTemporadaActual: string[]` en `PlayerState` para evitar eventos repetidos dentro del mismo año.
- **Simulación Anual de Campeonato**:
  - Categorías Argentinas: 1 carrera clave + simulación del resto del calendario.
  - Categorías Internacionales: 3 carreras clave + simulación determinista/ponderada con OVR.
  - Módulo [src/data/calendarios.ts](file:///home/thomi/M%C3%BAsica/Proyecto%20F1/src/data/calendarios.ts).
- **Tipificación de Eventos**: Campo `tipo: 'deportivo' | 'extradeportivo'` en `Evento`.
- **Equipos Reales por Categoría**: Módulos en `/src/data/equipos/` (`equiposF1.ts`, `equiposF2.ts`, `equiposF3.ts`, `equiposFRECA.ts`, `equiposF4.ts`, `equiposFormulaNacional.ts`).
- **Resumen de Temporada (`ScreenResumenTemporada.tsx`)**: Tabla completa de resultados de campeonato (fechas jugadas y simuladas) + ofertas de escuderías.
- **Etiqueta de Versión**: Actualizada a **ALPHA v0.4**.

---

## Estado Actual del Proyecto
- **Versión**: ALPHA v0.4 (En proceso de migración de Prompt 4)
- **Estado de Build/Tests**: 7 tests en suite previa.
- **Próximos Pasos**: Crear `/src/data/equipos/`, actualizar `types.ts`, `gameEngine.ts`, `finales.ts`, `eventos.ts`, implementar simulación anual y componentes de la versión ALPHA.
