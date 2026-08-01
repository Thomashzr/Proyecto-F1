# PROMPT 2 PARA AGENTE DE IA — Validación del motor + inicio de UI

Este es el segundo prompt de la serie. Asumí que ya tenés el proyecto inicializado según el prompt anterior (Fase 0 y Fase 1: motor de juego con tipos, `gameEngine.ts`, tests y 3-4 eventos de ejemplo). Antes de avanzar a la UI, hay que validar que el motor esté sólido.

---

## 1. VALIDACIÓN DEL MOTOR (hacer esto primero, no saltear)

1. Corré la suite de tests existente y mostrame el resultado.
2. Escribí un script o test adicional que simule **1000 partidas completas de punta a punta** (desde estado inicial hasta llegar a un final), usando distintos seeds, y reportá:
   - Distribución de finales alcanzados (cuántas partidas terminan en cada final).
   - Cantidad promedio de eventos/temporadas hasta llegar a un final.
   - Si hay algún estado del que el motor no puede salir (loop infinito o partida que nunca termina) — si existe, corregilo.
3. Si encontrás algún desbalance evidente (ej: 90% de las partidas terminan en el mismo final), avisame antes de seguir, con tu diagnóstico y una propuesta de ajuste de pesos/condiciones.
4. Confirmame explícitamente: "el motor está validado y listo para conectar a la UI" antes de pasar a la sección 2.

---

## 2. DIRECCIÓN DE DISEÑO DE LA UI

Quiero un estilo **minimalista, editorial y deportivo**, en la misma línea que estos dos juegos (referencia de tono, no de copiar): "El Ídolo" de Potrero Fútbol y el "Simulador de Carrera" de Copero. Son juegos livianos, directos, con mucha personalidad visual pero sin exceso de elementos ni animaciones innecesarias. Que se sienta como un producto editorial de un medio deportivo, no como una landing genérica de IA.

**Evitar activamente** (son las muletillas visuales típicas de diseño hecho por IA, no las quiero):
- Fondo negro genérico con UN solo acento neón/vermellón puesto sin criterio.
- Bordes redondeados exagerados en todo, sombras difusas tipo "glassmorphism", gradientes decorativos sin sentido.
- Iconos genéricos de librería (emoji o line-icons repetidos) sin relación con el mundo de la F1.
- Animaciones excesivas o "flotantes" en cada elemento — la motion tiene que ser funcional (transición entre eventos, feedback de una elección), nunca decorativa porque sí.
- Tipografía default del sistema o la típica combinación Inter+Inter para todo.

### 2.1. Paleta de colores (definir tokens exactos)

Trabajá con negro, rojo y blanco como base, pero definilo con precisión de diseñador, no "negro y rojo" genéricos:

- Un negro profundo casi puro para fondo principal (pensá en el asfalto/la pista, no un gris oscuro cualquiera).
- Un rojo específico con carácter propio (no el rojo Ferrari genérico ni el rojo bootstrap) — elegí un tono que funcione bien como acento de alto contraste sobre negro y blanco, y usalo con disciplina: para las decisiones importantes, alertas de stats críticos, y el elemento "firma" del diseño (ver 2.4).
- Un blanco o hueso para texto principal sobre negro (evaluar si un blanco puro roto levemente da más calidez que un #FFFFFF plano).
- 1-2 tonos de gris para jerarquía secundaria (texto secundario, bordes sutiles, fondos de tarjetas).
- Definí los valores hex exactos de los 4-6 colores del sistema antes de escribir una sola línea de CSS, y documentalos como variables (Tailwind config o CSS custom properties).

### 2.2. Tipografía

- Una tipografía de display con carácter para títulos de eventos y la pantalla de resultado — algo con presencia, que remita a números de carrera, tableros de tiempos o cartelería de circuito (pensá en fuentes condensadas/técnicas tipo las que usan los timing boards de motorsport), no una serif genérica ni Inter.
- Una tipografía monoespaciada o técnica para los datos numéricos (stats, tiempos, número de temporada/vuelta) — esto es clave para el mundo de F1, donde los números y las tablas de tiempos son parte central de la estética.
- Una tipografía de texto para los cuerpos de descripción de eventos, legible y neutra, que no compita con la de display.
- Definí escala tipográfica clara (tamaños y pesos) antes de codear.

### 2.3. Layout

- Diseño mobile-first, pantalla completa, sin scroll innecesario en la pantalla de evento (todo tiene que entrar en un viewport de celular).
- Pensá el layout de la pantalla de evento como si fuera un "boletín" o "parte de carrera": jerarquía clara entre el titular del evento, el cuerpo, y las opciones como si fueran decisiones tácticas, no botones de formulario genéricos.
- Las stats del piloto deben estar siempre visibles pero sin robarle protagonismo al evento — pensalo como un HUD discreto (tipo dashboard de auto de carrera), no como una barra de progreso de video juego casual.
- Antes de escribir código, planteame el layout con un wireframe en ASCII o una descripción corta de cada pantalla (inicio, evento, resultado) para que lo revise.

### 2.4. Elemento de firma (signature)

Definí **un único elemento visual distintivo** que se repita a lo largo del juego y que sea lo primero que la gente asocie con este producto — por ejemplo (son ideas de partida, no una orden cerrada): una numeración de vuelta/temporada tratada como si fuera un contador de tablero de carrera, una bandera a cuadros estilizada usada como divisor de sección, una barra de "tiempo de vuelta" como metáfora de las stats. Elegí uno solo, ejecutalo con precisión, y no lo repitas en todos lados como decoración — que aparezca donde tenga sentido narrativo (ej: al pasar de temporada, en la pantalla de resultado).

### 2.5. Proceso a seguir

1. Antes de tocar código, escribime el **plan de diseño compacto**: paleta con hex exactos, tipografías elegidas (nombre de la fuente y de dónde la vas a traer — Google Fonts, Fontshare, etc.), wireframes ASCII de las 3 pantallas principales, y la descripción del elemento de firma.
2. Revisá vos mismo ese plan: si algo se parece a los defaults genéricos de IA que mencioné arriba, corregilo y decime qué cambiaste y por qué.
3. Recién ahí, empezá a construir los componentes de UI (sección 3), siguiendo el plan validado.

---

## 3. COMPONENTES A CONSTRUIR (después de validar el plan de diseño)

Con el motor ya validado y el plan de diseño aprobado, construí en este orden:

1. **Pantalla de inicio**: nombre del piloto, arranque de partida. Debe transmitir de entrada la identidad visual del juego (esto es lo primero que ve el usuario, es el lugar para el elemento de firma si aplica).
2. **HUD de stats**: componente persistente que muestra las stats clave del piloto sin distraer del evento.
3. **Tarjeta de evento**: título, descripción, opciones. Con la transición/animación de entrada y salida entre eventos (Framer Motion), sobria y funcional.
4. **Pantalla de resultado final**: resumen del historial, final obtenido, y el diseño de la tarjeta que después se va a exportar como imagen para compartir (aunque la exportación a imagen la programemos en una fase posterior, el diseño de esta pantalla tiene que estar pensado ya para funcionar bien como imagen cuadrada/vertical).

Usá los 3-4 eventos de ejemplo que ya existen en `/data` para probar el flujo completo de punta a punta con la UI real, sin necesidad de tener todavía el contenido completo del juego.

No sigas a la Fase 4 (compartir e imagen) ni a la Fase 5 (Supabase) hasta que yo revise y apruebe esta UI.
