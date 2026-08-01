# PROMPT 3 PARA AGENTE DE IA (Antigravity) — Nuevas mecánicas + bitácora de desarrollo

Este prompt se aplica sobre el proyecto ya iniciado (motor de juego del Prompt 1, contenido del Prompt 1.5, UI del Prompt 2). Trae dos cosas: una regla de proceso obligatoria (bitácora de desarrollo) y una expansión importante de las mecánicas del juego.

---

## 0. REGLA DE PROCESO OBLIGATORIA: BITÁCORA DE DESARROLLO

Antes de escribir una sola línea de código de este prompt, creá un archivo `DEVLOG.md` en la raíz del proyecto (si todavía no existe).

**Cómo tenés que usarlo:**

1. Cada vez que tomes una decisión de arquitectura, agregues un archivo nuevo, cambies un tipo/estructura de datos existente, o hagas algo que otro desarrollador (o vos mismo en una sesión futura) necesitaría saber para entender el proyecto, registralo ahí. Formato por entrada: fecha, qué se hizo, por qué se tomó esa decisión, qué archivos se tocaron, y qué queda pendiente o qué hay que tener en cuenta a futuro.
2. **Antes de empezar cualquier tarea nueva, releé el `DEVLOG.md` completo** para recuperar el contexto de lo que ya se decidió y por qué, y para no contradecir o romper algo que ya se resolvió a propósito.
3. Si vas a hacer un cambio que afecta una decisión ya documentada (por ejemplo, modificar la estructura de `PlayerState` que ya está en uso en el motor y en la UI), **primero escribí en el DEVLOG el plan del cambio y su impacto** (qué se rompe, qué hay que migrar) antes de tocar código. Si el cambio es grande o riesgoso, parate ahí y avisame antes de ejecutarlo.
4. Mantené también una sección corta al final del archivo tipo "Estado actual del proyecto" que resuma en 5-10 líneas en qué está el desarrollo hoy, para que retomar el contexto sea inmediato.
5. Esto no reemplaza los commits de git (que siguen siendo atómicos y descriptivos): el DEVLOG es para decisiones y contexto, el commit es para el cambio puntual de código.

No avances a la sección 1 sin haber creado o actualizado el DEVLOG con un resumen del estado actual del proyecto tal como lo encontraste.

---

## 1. REGLA DURA: NO TOCAR EL DISEÑO YA APROBADO

El diseño visual (paleta negro/rojo/blanco, tipografías, layout, componentes, elemento de firma) definido en el Prompt 2 **ya está aprobado y no se toca**. Todo lo que construyas en este prompt tiene que:

- Reutilizar los componentes, tokens de color y tipografías ya existentes, no crear una paleta o estilo nuevo para las pantallas nuevas.
- Si una pantalla nueva no encaja con un componente existente, extendé o componé a partir de lo que ya hay, manteniendo consistencia visual, en vez de inventar un patrón visual distinto.
- Si en algún punto creés que el diseño actual no alcanza para alguna pantalla nueva (por ejemplo, un selector de 22 equipos), documentá el problema en el DEVLOG y proponeme una solución que respete el sistema de diseño existente, en vez de resolverlo por tu cuenta con un estilo nuevo.

---

## 2. NUEVAS MECÁNICAS A IMPLEMENTAR

Esto expande y en algunos casos **reemplaza** el modelo de datos del piloto definido en el Prompt 1. Es un cambio de arquitectura importante: tratalo con cuidado y documentalo en el DEVLOG paso a paso.

### 2.1. Creación de piloto (nueva pantalla, antes de la pantalla de inicio actual)

Al arrancar una partida nueva, el jugador define:

- **Nombre del piloto** (texto libre).
- **Nacionalidad** (cualquier país del mundo — un selector con lista de países).
- **Equipo inicial de Karting** (ver 2.2).

El piloto siempre arranca con **9 años**.

### 2.2. Equipos de Karting

Hay **22 equipos**, uno por cada provincia argentina más la Ciudad Autónoma de Buenos Aires, todos con el formato `[Provincia] Racing` (ej: Buenos Aires Racing, Córdoba Racing, Santa Fe Racing, Mendoza Racing, Entre Ríos Racing, ..., Tierra del Fuego Racing — completá la lista con las 24 jurisdicciones argentinas).

Los equipos se diferencian entre sí con **ventajas menores** (presupuesto inicial, calidad de ingenieros, ritmo de desarrollo del auto), sin que ningún equipo sea claramente superior a otro — variación, no jerarquía. Definí estos valores como datos en `/data/equiposKarting.ts`.

### 2.3. Progresión de categorías (no lineal)

La ruta principal de categorías, en orden, es:

1. Karting Regional
2. Karting Nacional
3. Fórmula Nacional
4. Fórmula 4 Brasil
5. Fórmula 4 España
6. Fórmula 4 Italia
7. Formula Regional Europea (FRECA)
8. FIA Fórmula 3
9. FIA Fórmula 2
10. Fórmula 1

Importante: **la progresión no es estrictamente lineal**. Según resultados, eventos y ofertas recibidas durante la temporada, al final de cada año el motor debe poder resolver alguno de estos caminos:

- Permanecer un año más en la misma categoría/equipo.
- Cambiar de equipo dentro de la misma categoría.
- Cambiar de campeonato (ej. de F4 Brasil a F4 España, no necesariamente el "siguiente" en la lista).
- Saltar una categoría completa si el desempeño lo justifica.
- Recibir una oportunidad inesperada (ej. un asiento que se libera, una prueba con un equipo superior).

Esto reemplaza cualquier lógica más simple de "avanza de categoría si supera un umbral" que hayas implementado antes: ahora la transición de temporada es una resolución con múltiples resultados posibles, no un simple if/else. Documentá en el DEVLOG cómo decidiste modelar esta lógica (por ejemplo, como una función `resolverFinDeTemporada(playerState, resultadosTemporada)` que devuelve uno de los caminos posibles según reglas + algo de aleatoriedad ponderada).

### 2.4. Habilidades del piloto (reemplaza el modelo de stats anterior)

Las **habilidades principales** (afectan directamente el rendimiento en pista) son:

- Velocidad
- Lluvia
- Ataque
- Defensa
- Gestión
- Consistencia

Los **atributos secundarios** (no afectan el ritmo en pista, sino las oportunidades fuera de ella) son:

- **Fama** → influye en patrocinadores, interés de equipos/academias y repercusión mediática.
- **Popularidad** → representa la relación con los aficionados y habilita ciertos eventos positivos ligados a la imagen del piloto.

Los atributos secundarios **no se entrenan directamente**: solo suben o bajan por entrevistas, decisiones fuera de pista, eventos especiales, resultados deportivos y la actitud del piloto durante la temporada.

**Este es el cambio de arquitectura más importante del prompt.** Actualizá el tipo `PlayerState.stats` para reflejar este modelo (6 habilidades + 2 atributos secundarios) en vez del set de stats genérico que se usó para probar el motor en el Prompt 1. Migrá el motor, los eventos de ejemplo y la UI (HUD de stats) a este nuevo modelo, respetando el diseño visual ya aprobado (sección 1). Documentá la migración en el DEVLOG con el detalle de qué se reemplazó y por qué.

### 2.5. Entrenamiento al inicio de temporada

Al comenzar cada temporada, antes del campeonato, se ofrecen **solo 3 o 4 opciones de entrenamiento**, elegidas al azar entre las 6 habilidades principales (no siempre las mismas, para que cada partida tenga una estrategia distinta). El jugador elige **una sola** para entrenar esa temporada, y esa habilidad sube.

### 2.6. Desarrollo de habilidades durante la temporada

Además del entrenamiento elegido, las decisiones tomadas durante los eventos de carrera también desarrollan habilidades específicas:

- Adelantar rivales → sube Ataque.
- Defender posiciones → sube Defensa.
- Ahorrar neumáticos/combustible → sube Gestión.
- Varias carreras sin errores → sube Consistencia.
- Buenas actuaciones bajo lluvia → sube Lluvia.
- Poles, vueltas rápidas, ritmo sobresaliente → sube Velocidad.

Esto significa que los eventos de carrera del Prompt 1.5 tienen que revisarse: cada opción de decisión relacionada con una acción en pista debe mapear a la habilidad correspondiente en sus `consecuencias.stats`. Repasá el contenido existente y ajustalo; documentá en el DEVLOG qué eventos tuviste que modificar.

### 2.7. Sistema de eventos (ampliación)

Sumá event pools de eventos **positivos** y **negativos** fuera de pista, en la misma línea de variedad que ya tenías, incluyendo como mínimo:

**Positivos:** aparición de un patrocinador importante, interés de un equipo superior, invitación a una academia de pilotos jóvenes, un asiento que queda libre inesperadamente, abandono de un rival de la categoría, mejora técnica inesperada del equipo, entrenamiento especial con un piloto reconocido.

**Negativos:** pérdida de un patrocinador, problemas económicos del equipo, reducción de presupuesto, conflictos con ingenieros/directivos, cambios de reglamento desfavorables, un rival que recibe un apoyo económico importante.

**Regla especial sobre lesiones:** las lesiones tienen que existir en el sistema, pero deben ser **extremadamente raras** (peso muy bajo). El objetivo del juego es un ritmo ágil y adictivo, no generar frustración con partidas arruinadas por mala suerte física. Si en el Prompt 1.5 ya se implementaron eventos de lesión con frecuencia mayor, bajá su peso drásticamente y documentá el ajuste.

### 2.8. Filosofía de diseño a preservar (no es código, es criterio)

Tené esto presente en cada decisión de balance y contenido que tomes en este prompt, y anotalo también al inicio del DEVLOG como principios del proyecto para no perderlos de vista en el futuro:

- Cada partida se tiene que sentir distinta.
- La progresión nunca está garantizada.
- Las decisiones importan tanto como los resultados deportivos.
- El jugador construye un piloto con estilo propio (según qué habilidades desarrolló).
- Las habilidades son pocas, claras y todas útiles — ninguna debería sentirse "de relleno".
- Fama y Popularidad crean oportunidades, pero nunca hacen al piloto más rápido.
- El sistema prioriza una experiencia ágil, adictiva y rejugable.

---

## 3. ORDEN DE TRABAJO

1. Crear/actualizar `DEVLOG.md` con el estado actual del proyecto (sección 0).
2. Escribir en el DEVLOG el plan de migración del modelo de stats (sección 2.4) antes de tocar código, y avisarme si el impacto es mayor al esperado.
3. Implementar los cambios de tipos y motor (2.3, 2.4).
4. Migrar el contenido existente de eventos (`/data/eventos.ts`) al nuevo modelo de habilidades, ajustando `consecuencias.stats` según el mapeo de la sección 2.6.
5. Crear los datos de los 22 equipos de karting (2.2).
6. Construir las pantallas nuevas —creación de piloto, selección de equipo inicial, selección de entrenamiento de temporada— reutilizando el sistema de diseño ya aprobado (sección 1).
7. Sumar los nuevos eventos positivos/negativos (2.7) y recalibrar el peso de eventos de lesión.
8. Volver a correr la simulación de 1000 partidas (igual que en prompts anteriores) con el modelo actualizado, y registrar los resultados en el DEVLOG: distribución de finales, categorías más comunes de estancamiento, si algún camino de progresión nunca se activa.
9. Cerrar la entrada del DEVLOG de esta sesión con el resumen de "Estado actual del proyecto" actualizado.

No avances a pulir UI adicional ni a las fases de compartir/Supabase hasta que confirme que este cambio de mecánicas y el DEVLOG están en orden.
