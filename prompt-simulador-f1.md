# PROMPT PARA AGENTE DE IA — Desarrollo de "El Campeón" (simulador de carrera de piloto de F1)

Copiá y pegá todo este documento como prompt inicial para el agente (Claude Code, Cursor, etc.). Está pensado para que el agente entienda el proyecto completo y empiece a programar en orden, sin perderse.

---

## 1. CONTEXTO DEL PROYECTO

Quiero que me ayudes a construir un juego web narrativo de simulación de carrera deportiva, inspirado en "El Ídolo" de Potrero Fútbol y el "Simulador de Carrera" de Copero, pero ambientado en el mundo de la Fórmula 1.

**Concepto:** el jugador crea/elige un piloto joven que arranca en categorías inferiores (karting o Fórmula 4) y, a través de una serie de eventos y decisiones narrativas con opciones múltiples, va progresando —o fracasando— en su carrera hasta llegar (o no) a ser campeón de F1. Cada partida dura entre 3 y 7 minutos, tiene alta rejugabilidad (eventos aleatorios ponderados, distintos finales), y termina con una pantalla de resultado compartible en redes sociales (estilo "tarjeta de resultado" con imagen generada).

**Objetivo del producto:** juego liviano, rápido de cargar, mobile-first, con mecánica adictiva de "una decisión más" y gran capacidad de viralización por el resultado compartible.

---

## 2. STACK TECNOLÓGICO (definido, no cambiar sin consultar)

- **Frontend:** Vite + React 18 + TypeScript
- **State management:** Zustand
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Backend / DB / Auth:** Supabase (Postgres + Auth anónima + Edge Functions)
- **Generación de imagen de resultado compartible:** html-to-image (cliente) para MVP; evaluar Satori/Vercel OG en el backend más adelante para imágenes prerenderizadas de mejor calidad para el share preview (og:image)
- **Hosting:** Vercel
- **Analytics:** Plausible o Google Analytics 4 (eventos custom por cada decisión tomada, para poder balancear el juego con datos reales)
- **Control de versiones:** Git, con commits atómicos y mensajes descriptivos

---

## 3. ARQUITECTURA DEL JUEGO (lo más importante)

### 3.1. Principio de diseño
Todo el contenido narrativo (eventos, textos, decisiones, consecuencias, finales) debe vivir **separado del código**, en archivos de datos (JSON o TS con objetos tipados) para que se pueda agregar/editar contenido sin tocar la lógica del motor. El motor de juego es genérico y agnóstico del contenido.

### 3.2. Modelo de datos del piloto (estado del jugador)

Definir un tipo `PlayerState` con, como mínimo:

```typescript
interface PlayerState {
  nombre: string;
  edad: number;
  temporada: number;
  categoria: 'Karting' | 'F4' | 'F3' | 'F2' | 'F1';
  equipo: string | null;
  stats: {
    habilidad: number;       // 0-100, técnica al volante
    reputacion: number;      // 0-100, cómo lo ve la industria
    relacionEquipo: number;  // 0-100, confianza del equipo en él
    dineroPatrocinio: number;// presupuesto disponible
    saludMental: number;     // 0-100, presión/burnout
    condicionFisica: number; // 0-100, lesiones
  };
  historial: EventoHistorial[]; // log de decisiones tomadas, para el resumen final
  finalizado: boolean;
  finalObtenido: string | null; // id del final alcanzado
}
```

### 3.3. Modelo de eventos

Definir un tipo `Evento` que represente cada "pantalla" de decisión:

```typescript
interface Evento {
  id: string;
  categoriaMinima?: string;      // en qué etapa de la carrera puede aparecer
  condiciones?: Condicion[];     // requisitos de stats para que el evento sea elegible
  peso: number;                  // probabilidad relativa de que aparezca
  titulo: string;
  descripcion: string;
  imagen?: string;
  opciones: Opcion[];
  esUnico?: boolean;             // si solo puede pasar una vez por partida
}

interface Opcion {
  texto: string;
  consecuencias: {
    stats: Partial<Record<keyof PlayerState['stats'], number>>; // deltas, ej: { habilidad: +5, saludMental: -10 }
    textoResultado: string; // feedback narrativo inmediato
    siguienteEventoId?: string; // para ramificar directamente si hace falta
  };
}
```

### 3.4. Motor de juego (game engine)

Crear un módulo `gameEngine.ts` (independiente de React, testeable) responsable de:

1. **Selección de eventos:** dado el `PlayerState` actual, filtrar eventos elegibles (por categoría, condiciones, si ya ocurrieron) y elegir uno con selección aleatoria ponderada por `peso`.
2. **Aplicar consecuencias:** al elegir una opción, actualizar stats (con clamps 0-100), avanzar temporada/categoría según reglas (ej: si `habilidad` y `reputacion` superan cierto umbral, asciende de categoría), y registrar en `historial`.
3. **Chequeo de finales:** después de cada evento, evaluar si se cumple la condición de algún final (retiro forzado por salud, despido, título de F1, accidente de carrera, etc.) definidos en `finales.ts`.
4. **Sistema de semillas (seed):** usar una librería simple de PRNG con seed (ej. `mulberry32`) para que, dado el mismo seed, la partida sea reproducible. Guardar el seed usado para poder mostrarlo/compartirlo.

### 3.5. Contenido inicial a crear

Para el MVP, generar:
- Al menos **25-30 eventos** distribuidos en las 5 categorías (Karting, F4, F3, F2, F1), cubriendo: choques, lesiones, ofertas de equipos, rivalidades, presión de patrocinadores, decisiones éticas (ej. jugar sucio o no), vida personal/mediática, negociación de contratos.
- Al menos **6-8 finales distintos** (desde "abandonaste en F3" hasta "Campeón del Mundo de F1"), cada uno con su propio texto y assets visuales para la tarjeta compartible.

---

## 4. ESTRUCTURA DE CARPETAS

```
/src
  /components       -> componentes React de UI (EventCard, StatsBar, ResultShareCard, etc.)
  /engine            -> gameEngine.ts, rng.ts, tipos del motor (sin dependencias de React)
  /data
    /eventos.ts      -> contenido de eventos
    /finales.ts      -> contenido de finales
  /store             -> store de Zustand (useGameStore.ts)
  /pages             -> Home, Juego, Resultado
  /lib
    supabaseClient.ts
    analytics.ts
    shareImage.ts    -> lógica de generación de imagen para compartir
  /styles
/tests
  engine.test.ts     -> tests unitarios del motor (Vitest)
```

---

## 5. BASE DE DATOS (Supabase)

Tablas mínimas para el MVP:

```sql
create table partidas (
  id uuid primary key default gen_random_uuid(),
  seed text not null,
  nombre_piloto text,
  final_id text,
  temporadas_jugadas int,
  stats_finales jsonb,
  created_at timestamptz default now()
);

create table eventos_stats (
  evento_id text,
  opcion_index int,
  veces_elegida int default 0,
  updated_at timestamptz default now(),
  primary key (evento_id, opcion_index)
);
```

La tabla `eventos_stats` es clave para balancear el juego: te permite ver qué opciones elige más la gente y ajustar dificultad/narrativa con datos reales.

---

## 6. FASES DE DESARROLLO (seguir este orden)

**Fase 0 — Setup**
- Inicializar proyecto Vite + React + TS, configurar Tailwind, ESLint, Prettier, Vitest.
- Configurar estructura de carpetas de la sección 4.

**Fase 1 — Motor de juego (sin UI)**
- Implementar `gameEngine.ts` con tipos, selección ponderada de eventos, aplicación de consecuencias, chequeo de finales.
- Escribir tests unitarios que cubran: selección de eventos respeta condiciones, clamps de stats funcionan, se alcanzan los finales correctamente con distintos estados simulados.

**Fase 2 — Contenido**
- Cargar el contenido inicial de eventos y finales (sección 3.5) en `/data`.

**Fase 3 — UI del juego**
- Pantalla de inicio (nombre del piloto, categoría inicial).
- Pantalla de evento (tarjeta con título, descripción, botones de opciones, animación de transición con Framer Motion).
- Barra/indicadores de stats visibles siempre.
- Pantalla de resultado final con resumen del historial y botón de compartir.

**Fase 4 — Compartir e imagen**
- Generar imagen de resultado con html-to-image.
- Botones de compartir (WhatsApp, X/Twitter, descargar imagen).
- Meta tags Open Graph dinámicos para el link de resultado (si aplica).

**Fase 5 — Backend**
- Conectar Supabase: guardar partida al finalizar, incrementar contador en `eventos_stats`.
- (Opcional MVP+) ranking de finales más comunes/raros.

**Fase 6 — Polish**
- Analytics de eventos (qué opción elige la gente, en qué evento abandona).
- Optimización de performance y peso del bundle (code splitting, lazy loading de imágenes).
- Responsive y testeo mobile real.

---

## 7. CRITERIOS DE CALIDAD (no negociables)

- TypeScript estricto (`strict: true`), sin `any` salvo justificación explícita en comentario.
- El motor de juego (`/engine`) no debe importar nada de React: debe poder testearse de forma aislada.
- Componentes chicos y con una sola responsabilidad.
- Todo el contenido narrativo debe poder agregarse editando solo `/data`, sin tocar el motor ni los componentes.
- Commits atómicos, en español, describiendo el "por qué" además del "qué".
- Priorizar performance: bundle inicial debe cargar rápido en 3G/4G (target: <200kb JS inicial gzip).

---

## 8. PRIMER ENTREGABLE QUE ESPERO DEL AGENTE

Empezá por la **Fase 0 y Fase 1**: inicializá el proyecto con la estructura de carpetas indicada, definí todos los tipos TypeScript del motor de juego, e implementá `gameEngine.ts` con sus tests, usando 3-4 eventos de ejemplo (no hace falta el contenido completo todavía) para validar que el motor funciona de punta a punta: selección ponderada, aplicación de consecuencias, avance de categoría, y llegada a un final.

No avances a la UI hasta que el motor esté probado y yo lo confirme.
