# PROMPT 1.5 PARA AGENTE DE IA — Contenido completo: eventos, decisiones y finales

Este prompt va **entre** el Prompt 1 (motor de juego) y el Prompt 2 (UI). Asumí que el motor (`gameEngine.ts`) ya está implementado y testeado con 3-4 eventos de ejemplo, siguiendo los tipos `Evento`, `Opcion` y `PlayerState` definidos en el prompt anterior.

Ahora hay que escribir el contenido narrativo completo del juego: esto es tan importante como el motor, porque es lo que hace que el juego se sienta vivo y no un formulario con stats. Dedicale el mismo cuidado que al código.

---

## 1. TONO Y VOZ NARRATIVA

- Escribí en español rioplatense, natural, directo. Nada de traducciones literales del inglés ni de un tono neutro "internacional".
- Los textos de evento son cortos y concretos (2-4 líneas), como si fueran el relato de un cronista deportivo contando lo que le pasó al piloto, no una descripción de sistema de juego.
- Las opciones de decisión tienen que sonar a decisiones reales de un piloto (lo que diría o haría), no a etiquetas de botón genéricas. Mal: "Ser agresivo" / "Ser cauteloso". Bien: "Meter el sobrepaso en la última chicana, aunque el auto no dé" / "Cuidar los neumáticos y asegurar el podio".
- El feedback inmediato después de elegir una opción (`textoResultado`) tiene que tener consecuencia narrativa concreta, no un genérico "tu decisión tuvo efecto". Contá qué pasó.
- Evitá clichés motivacionales de LinkedIn ("los sueños se logran con esfuerzo") y evitá que todo texto termine en una moraleja. La dureza y la injusticia también son parte de una carrera deportiva real: no todo final feliz, no toda decisión correcta es recompensada.

---

## 2. ESTRUCTURA DEL CONTENIDO A GENERAR

Repartí los eventos en las 5 etapas de la carrera, respetando esta progresión y cantidades:

| Categoría | Edad aprox. | Cantidad de eventos | Foco temático |
|---|---|---|---|
| Karting | 12-16 | 5-6 eventos | Talento crudo, primeros sacrificios familiares/económicos, primeras rivalidades, descubrimiento |
| Fórmula 4 | 16-18 | 6-7 eventos | Primeros contratos, presión de resultados, primeros patrocinantes, primeros choques serios |
| Fórmula 3 | 18-20 | 6-7 eventos | Rivalidad directa con un competidor recurrente, escrutinio mediático, decisiones éticas (jugar sucio, orden de equipo) |
| Fórmula 2 | 20-22 | 5-6 eventos | Última chance antes de F1, ofertas de equipos grandes vs. chicos, lesiones, quema (burnout) |
| Fórmula 1 | 22+ | 6-8 eventos | Política de equipo, rivalidad con compañero de equipo, prensa, títulos, retiro |

Total aproximado: **28-34 eventos**. Cada evento tiene 2-3 opciones (evitá que todos tengan exactamente 2, para no sentirse mecánico — algunos eventos con 3 opciones dan lugar a decisiones más matizadas: agresiva / calculadora / ambigua-arriesgada).

### 2.1. Tipos de evento a incluir (variedad obligatoria, no solo "carrera y resultado")

Asegurate de cubrir todos estos ejes, no solo resultados deportivos:

- **Deportivo puro:** carreras, choques, superaciones, errores propios.
- **Contractual/económico:** ofertas de equipo, negociación de sueldo, presión de patrocinadores, presupuesto familiar en las categorías inferiores.
- **Físico/salud:** lesiones, fatiga, decisión de correr lesionado o no.
- **Mental:** presión mediática, comparación con rivales, síndrome del impostor, momentos de duda.
- **Ético/moral:** jugar sucio para ganar, respetar o no una orden de equipo, delatar o cubrir a un compañero, doping/zona gris de reglamento.
- **Relacional:** rivalidad con un piloto recurrente que aparezca en más de un evento a lo largo de las categorías (dale nombre y continuidad — esto le da al jugador la sensación de una historia, no eventos sueltos), relación con el equipo, con la familia.
- **Mediático:** entrevistas, redes sociales, escándalos, cómo manejar la fama.

### 2.2. Condiciones y pesos

- Definí `condiciones` en al menos un tercio de los eventos, para que la narrativa reaccione al estado del piloto (ej: un evento de "quema mental" solo aparece si `saludMental` < 40; un evento de "oferta de equipo top" solo si `reputacion` > 70).
- Ajustá el `peso` de cada evento pensando en frecuencia narrativa realista (los choques graves no deberían ser tan frecuentes como las decisiones de rutina).
- Marcá como `esUnico: true` los eventos de rivalidad recurrente y los hitos de carrera (primera pole, primer título, etc.) para que no se repitan en la misma partida.

---

## 3. FINALES

Escribí **8 finales distintos**, cubriendo todo el espectro de resultados posibles, no solo "ganaste" o "perdiste". Para cada uno definí: condición de activación (qué combinación de stats/categoría/temporada lo dispara), título del final, texto de cierre (3-5 líneas, con peso narrativo real, es el momento de mayor impacto emocional del juego), y qué datos del historial se destacan en la pantalla de resultado.

Cubrí como mínimo estos arcos:

1. **Retiro forzado por lesión/salud** — la carrera termina por el cuerpo, no por falta de talento.
2. **Despedido por bajo rendimiento** — el equipo pierde la paciencia.
3. **Se quema mentalmente y abandona por decisión propia** — un final que no es "fracaso" sino una decisión válida y humana.
4. **Se estanca en categorías inferiores** — nunca llega a F1, pero sigue compitiendo (un final "gris", ni trágico ni triunfal).
5. **Llega a F1 como piloto de mitad de tabla** — corre en la máxima categoría pero nunca pelea títulos.
6. **Pelea el título y lo pierde en la última fecha** — el final agridulce, quizás el más memorable.
7. **Campeón del Mundo de F1** — el final "ídolo", el más difícil de conseguir.
8. **Un final "sucio"**: llega arriba pero a costa de decisiones éticas cuestionables a lo largo del camino (jugando sucio, pisando compañeros) — el juego no lo condena explícitamente, pero el texto deja la ambigüedad moral instalada.

Los finales 6, 7 y 8 deberían ser los más difíciles de alcanzar (requieren stats altos sostenidos en el tiempo), para que llegar a ellos se sienta como un logro real y la gente quiera volver a jugar.

---

## 4. FORMATO DE ENTREGA

- Escribí todo el contenido directamente en `/src/data/eventos.ts` y `/src/data/finales.ts`, respetando los tipos ya definidos en el motor. Si necesitás extender algún tipo (por ejemplo agregar un campo `personajeRecurrente` para las rivalidades), proponelo y avisame el cambio antes de aplicarlo.
- Cada evento y cada final deben tener un `id` único, en formato `kebab-case` descriptivo (ej: `f3-rivalidad-primera-vuelta`, no `evento-14`).
- Al terminar, corré de nuevo la simulación de 1000 partidas del Prompt 2 (sección 1) pero ahora con el contenido completo, y mostrame:
  - Distribución real de finales alcanzados con este contenido.
  - Si algún evento nunca llega a aparecer en las 1000 simulaciones (señal de que sus condiciones están mal calibradas).
  - Tu diagnóstico de balance general y ajustes de `peso`/condiciones si hace falta.

No avances al Prompt 2 (UI) hasta que este contenido esté completo y la simulación muestre una distribución de finales razonable (ningún final debería aparecer en más del ~35% de las partidas, y los finales 6/7/8 deberían ser claramente minoritarios).
