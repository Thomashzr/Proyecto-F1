import { Evento } from '../engine/types';

export const EVENTOS: Evento[] = [
  // ==========================================
  // KARTING REGIONAL Y KARTING NACIONAL (Edad 9-14)
  // ==========================================
  {
    id: 'karting-01-chasis-prestado',
    tipo: 'deportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 20,
    titulo: 'Chasis usado y motor con mañas',
    descripcion: 'Llegás al campeonato zonal con un karting usado que le compraste a un vecino. En la clasificación sintió una falla de carburación en baja.',
    opciones: [
      {
        texto: 'Meter mano al carburador solo en el parque cerrado',
        consecuencias: {
          stats: { velocidad: 4, gestion: -2 },
          textoResultado: 'Carburaste justo a tiempo. El motor respondió mejor y ganaste valiosas posiciones en la tanda.',
        },
      },
      {
        texto: 'Pedirle repuestos prestados a la familia de {RIVAL}',
        consecuencias: {
          stats: { fama: 3, popularidad: 5 },
          textoResultado: 'La familia de {RIVAL} te prestó un chiclé de baja. Quedás en deuda moral pero clasificás bien.',
        },
      },
    ],
  },
  {
    id: 'karting-02-primera-final-lluvia',
    tipo: 'deportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 20,
    titulo: 'Tormenta sobre la pista de barro',
    descripcion: 'Faltan 5 minutos para la largada y se largó una cortina de agua en Buenos Aires. No tenés presupuesto para ganchos de lluvia nuevos.',
    opciones: [
      {
        texto: 'Largar con cubiertas lisas gastadas y controlar con la mano al aire',
        consecuencias: {
          stats: { lluvia: 6, consistencia: -3 },
          textoResultado: 'Fue una lección magistral de control en mojado. Cruzás la meta peleando los puestos de cabeza.',
        },
      },
      {
        texto: 'Hipotecar ahorros familiares para comprar gomas de lluvia usadas',
        consecuencias: {
          stats: { gestion: 5, popularidad: 3 },
          textoResultado: 'Completás la carrera con gran ritmo sobre el asfalto mojado, aunque la discusión económica fue dura.',
        },
      },
    ],
  },
  {
    id: 'karting-03-rivalidad-varela-1',
    tipo: 'deportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 25,
    personajeRecurrente: '{RIVAL}',
    esUnico: true,
    titulo: 'Toque con {RIVAL} en la chicana',
    descripcion: '{RIVAL}, el chico adinerado del equipo oficial, te frena el karting en el apéndice de la chicana para taparte el radio de curva.',
    opciones: [
      {
        texto: 'Tirarle el pontón en la horquilla de entrada a meta',
        consecuencias: {
          stats: { ataque: 5, popularidad: -3 },
          incrementaJuegoSucio: true,
          textoResultado: 'Lo dejaste cruzado sobre el piano. Saliste adelante en la pista, pero te ganaste una rivalidad picante.',
        },
      },
      {
        texto: 'Cruzar el kart por la huella limpia y esperar el error',
        consecuencias: {
          stats: { defensa: 5, consistencia: 4 },
          textoResultado: '{RIVAL} se pasó de frenada dos vueltas después. Superás su karting con aplausos del comisariato.',
        },
      },
    ],
  },
  {
    id: 'karting-04-sacrificio-familiar',
    tipo: 'extradeportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 15,
    titulo: 'El trailer que se rompió en la ruta',
    descripcion: 'A mitad de camino al kartódromo nacional, se rompió el eje del trailer. Si no llegás a la técnica antes de las 8 AM, quedás excluido.',
    opciones: [
      {
        texto: 'Cargar el karting en el baúl del auto familiar sacrificando el equipaje',
        consecuencias: {
          stats: { consistencia: 4, popularidad: 5 },
          textoResultado: 'Llegaron a las 7:55 AM destruidos de fatiga, pero listos para la técnica.',
        },
      },
      {
        texto: 'Pagar un remolque de auxilio con los últimos ahorros de la inscripción',
        consecuencias: {
          stats: { fama: 3, gestion: -5 },
          textoResultado: 'Llegaron a tiempo, pero entraron a la carrera sin un solo peso para repuestos.',
        },
      },
    ],
  },
  {
    id: 'karting-05-salto-nacional',
    tipo: 'extradeportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Regional',
    condiciones: [{ stat: 'velocidad', operador: '>=', valor: 48 }],
    peso: 40,
    esUnico: true,
    titulo: 'Ascenso al Campeonato Nacional de Karting',
    descripcion: 'Tus resultados en el campeonato regional abren las puertas para competir contra los mejores del país.',
    opciones: [
      {
        texto: 'Aceptar el ascenso a Karting Nacional',
        consecuencias: {
          stats: { fama: 8, velocidad: 4 },
          avanzaCategoria: true,
          textoResultado: '¡Ascendés a Karting Nacional! Los circuitos son más exigentes y la competencia es implacable.',
        },
      },
      {
        texto: 'Rechazar el ascenso y continuar en Karting Regional',
        consecuencias: {
          stats: { consistencia: 4 },
          textoResultado: 'Rechazaste el ascenso para buscar el título en Karting Regional.',
        },
      },
    ],
  },
  {
    id: 'karting-06-rival-box-vecino',
    tipo: 'extradeportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 25,
    personajeRecurrente: '{RIVAL}',
    titulo: 'Provocaciones de {RIVAL} en el box vecino',
    descripcion: '{RIVAL} y su mecánico pasean frente a tu carpa riéndose de tu juego de cubiertas usadas.',
    opciones: [
      {
        texto: 'Ignorarlos por completo y concentrarte en afilar el eje',
        consecuencias: {
          stats: { consistencia: 5, defensa: 4 },
          textoResultado: 'Mantuviste la cabeza fría. En pista respondiste con tiempos impecables.',
        },
      },
      {
        texto: 'Mandarles una mirada desafiante y subir el volumen de la música',
        consecuencias: {
          stats: { fama: 4, popularidad: 4 },
          textoResultado: 'Marcaste presencia en los pits. La tensión entre ambos carpas es evidente.',
        },
      },
    ],
  },

  // ==========================================
  // FÓRMULA NACIONAL Y FÓRMULA 4 BRASIL / ESPAÑA / ITALIA
  // ==========================================
  {
    id: 'f4-01-primer-test-monoplaza',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 20,
    titulo: 'La carga aerodinámica del F4',
    descripcion: 'Tu primer test oficial en monoplaza. La dirección y la fuerza G en el cuello te exigen al límite.',
    opciones: [
      {
        texto: 'Exigir el cuello al máximo sin pedir parar en boxes',
        consecuencias: {
          stats: { velocidad: 5, consistencia: 3 },
          textoResultado: 'Te bajaste del auto dolorido, pero los ingenieros amaron tu tenacidad.',
        },
      },
      {
        texto: 'Parar cada 5 vueltas para calibrar la postura con el fisio',
        consecuencias: {
          stats: { gestion: 5, consistencia: 4 },
          textoResultado: 'Aprendiste a cuidar el físico en curvas de alta velocidad.',
        },
      },
    ],
  },
  {
    id: 'f4-02-patrocinador-lacteo',
    tipo: 'extradeportivo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 15,
    titulo: 'Presión de la marca patrocinante',
    descripcion: 'El patrocinador principal exige que te vistas con un traje llamativo en un spot publicitario antes de la carrera.',
    opciones: [
      {
        texto: 'Tragar saliva, hacer el spot y sonreír para las redes',
        consecuencias: {
          stats: { fama: 12, popularidad: -2 },
          textoResultado: 'El video se volvió viral. Pasaste vergüenza pero aseguraste presupuesto publicitario.',
        },
      },
      {
        texto: 'Negarte rotundamente aduciendo dignidad deportiva',
        consecuencias: {
          stats: { popularidad: 8, fama: -5 },
          textoResultado: 'El público apreció tu postura, aunque el patrocinador redujo presupuesto.',
        },
      },
    ],
  },
  {
    id: 'f4-03-choque-muro-curva-1',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 18,
    titulo: 'Bloqueada y paredón a 180 km/h',
    descripcion: 'Poblada la Curva 1, te quedaste sin frenos por sobrecalentamiento de líquido y golpeaste de costado.',
    opciones: [
      {
        texto: 'Asumir la culpa con el equipo e ir al médico de pista',
        consecuencias: {
          stats: { consistencia: 5, popularidad: 5 },
          textoResultado: 'Te hicieron placas de tórax. El equipo valora tu honestidad.',
        },
      },
      {
        texto: 'Echarle la culpa a una supuesta falla del sensor de frenos',
        consecuencias: {
          stats: { fama: -8, popularidad: -5 },
          textoResultado: 'La telemetría demostró que bloqueaste vos. Perdiste reputación en los pits.',
        },
      },
    ],
  },
  {
    id: 'f4-04-rivalidad-varela-2',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 25,
    personajeRecurrente: '{RIVAL}',
    esUnico: true,
    titulo: '{RIVAL} reaparece en monoplazas',
    descripcion: '{RIVAL} reaparece con el equipo líder. En la conferencia de prensa dice que vos sólo estás ahí por suerte.',
    opciones: [
      {
        texto: 'Responder en pista haciéndole un sobrepaso por fuera en el Curvón',
        consecuencias: {
          stats: { ataque: 6, velocidad: 5 },
          textoResultado: 'Le metiste un sobrepaso quirúrgico que salió en los resúmenes de televisión.',
        },
      },
      {
        texto: 'Encerrarlo contra el muro del box en la salida de clasificatoria',
        consecuencias: {
          stats: { defensa: 4, popularidad: -5 },
          incrementaJuegoSucio: true,
          textoResultado: 'Los comisarios te apercibieron. Tensión al máximo en los boxes.',
        },
      },
    ],
  },
  {
    id: 'f4-06-oferta-freca',
    tipo: 'extradeportivo',
    categoriaMinima: 'Fórmula 4 Brasil',
    categoriaMaxima: 'Fórmula 4 Italia',
    condiciones: [{ stat: 'velocidad', operador: '>=', valor: 50 }],
    peso: 40,
    esUnico: true,
    titulo: 'Promoción a Formula Regional Europea (FRECA)',
    descripcion: 'Una escudería europea te ofrece dar el salto a FRECA en los circuitos continentales.',
    opciones: [
      {
        texto: 'Firmar con el equipo de FRECA y consolidar tu presencia en Europa',
        consecuencias: {
          stats: { fama: 10, velocidad: 5 },
          avanzaCategoria: true,
          cambioEquipo: 'ART Grand Prix FRECA',
          textoResultado: 'Confirmás tu contrato en FRECA. Estás en la antesala real de la Fórmula 3.',
        },
      },
      {
        texto: 'Rechazar la oferta y continuar en tu escudería actual de Fórmula 4',
        consecuencias: {
          stats: { consistencia: 5 },
          textoResultado: 'Rechazaste la oferta de FRECA para continuar ganando experiencia en Fórmula 4.',
        },
      },
    ],
  },

  // ==========================================
  // FRECA, FIA F3 Y FIA F2
  // ==========================================
  {
    id: 'f3-01-silverstone-lluvia',
    tipo: 'deportivo',
    categoriaMinima: 'Formula Regional Europea',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 20,
    titulo: 'Silverstone bajo temporal británico',
    descripcion: 'Pista inundada en Copse. Los monoplazas hacen aquaplaning a 240 km/h. La mitad de los autos están desparramados en el pasto.',
    opciones: [
      {
        texto: 'Soltar el acelerador 50 metros antes y buscar tracción por fuera',
        consecuencias: {
          stats: { lluvia: 8, consistencia: 5 },
          textoResultado: 'Espectacular lección de manejo sobre agua. Ganás posiciones clave.',
        },
      },
      {
        texto: 'Cerrar los ojos, mantener el pie a fondo y confiar en el difusor',
        consecuencias: {
          stats: { velocidad: 5, consistencia: -8 },
          textoResultado: 'Terminaste en el paredón de Stowe destruyendo la suspensión delantera.',
        },
      },
    ],
  },
  {
    id: 'f3-02-telemetria-compartida',
    tipo: 'deportivo',
    categoriaMinima: 'Formula Regional Europea',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 25,
    personajeRecurrente: '{RIVAL}',
    titulo: 'Sospechas sobre la telemetría del equipo',
    descripcion: 'Descubrís que el ingeniero jefe le entrega tus mapas de aceleración y puntos de frenada a {RIVAL}, tu compañero de equipo.',
    opciones: [
      {
        texto: 'Guardarte un secreto de trazada para las rondas finales',
        consecuencias: {
          stats: { velocidad: 5, gestion: 4 },
          textoResultado: 'En la clasificación abriste la trazada en el sector 2 y le sacaste 3 décimas a {RIVAL}.',
        },
      },
      {
        texto: 'Enfrentar al director de equipo delante de los mecánicos',
        consecuencias: {
          stats: { popularidad: -8, fama: 5 },
          textoResultado: 'Un escándalo en los boxes. La relación con los ingenieros quedó sumamente tirante.',
        },
      },
    ],
  },
  {
    id: 'f2-superlicencia-f1',
    tipo: 'extradeportivo',
    categoriaMinima: 'FIA Fórmula 3',
    categoriaMaxima: 'FIA Fórmula 2',
    condiciones: [{ stat: 'velocidad', operador: '>=', valor: 65 }],
    peso: 35,
    esUnico: true,
    titulo: 'Puntos de Superlicencia FIA Completados',
    descripcion: 'Alcanzás los 40 puntos necesarios de Superlicencia de la FIA. Las escuderías de Fórmula 1 ahora pueden ofrecerte asiento titular.',
    opciones: [
      {
        texto: 'Celebrar el logro e informar a la prensa que estás listo para la F1',
        consecuencias: {
          stats: { fama: 15, popularidad: 10 },
          tagHistorial: 'superlicenciaObtenida',
          textoResultado: '¡Hito fundamental! Tu representante recibe llamadas inmediatas del paddock de F1.',
        },
      },
    ],
  },

  // ==========================================
  // FÓRMULA 1
  // ==========================================
  {
    id: 'f1-01-debut-australia',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 20,
    esUnico: true,
    titulo: 'Gran Premio debut en Albert Park, Melbourne',
    descripcion: 'Apagan los 5 semáforos rojos. 20 monoplazas rugen hacia la Curva 1. Tenés al campeón mundial vigente a tu lado.',
    opciones: [
      {
        texto: 'Aprovechar el hueco interno entre dos autos para avanzar 3 puestos',
        consecuencias: {
          stats: { ataque: 8, velocidad: 8, fama: 10 },
          textoResultado: '¡Debut brillante! Demostrás temple de piloto oficial en la máxima categoría.',
        },
      },
      {
        texto: 'Mantener la cautela y asegurar terminar la primera carrera limpia',
        consecuencias: {
          stats: { consistencia: 10, gestion: 8 },
          textoResultado: 'Llevaste el auto a boxes sin un solo rasguño. El equipo aplaude tu madurez.',
        },
      },
    ],
  },
  {
    id: 'f1-02-guerra-compañero-f1',
    tipo: 'extradeportivo',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 25,
    personajeRecurrente: '{RIVAL}',
    titulo: 'Tensión máxima con {RIVAL} en F1',
    descripcion: 'En las tandas de clasificación, {RIVAL} frena de golpe delante tuyo en la chicana quitándote la posibilidad del último intento.',
    opciones: [
      {
        texto: 'Denunciarlo en los micrófonos internacionales de la transmisión',
        consecuencias: {
          stats: { fama: 10, popularidad: -8 },
          textoResultado: 'Guerra civil desatada en la escudería. Las fotos tuyas y de {RIVAL} ocupan todas las portadas.',
        },
      },
      {
        texto: 'Demostrarle quién manda superándolo en el primer frenaje de carrera',
        consecuencias: {
          stats: { ataque: 8, defensa: 8 },
          textoResultado: 'Le metiste el auto en la chicana sin dudar. El mensaje quedó clarísimo en la pista.',
        },
      },
    ],
  },
  {
    id: 'f1-06-gran-final-interlagos',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    condiciones: [{ stat: 'velocidad', operador: '>=', valor: 65 }],
    peso: 35,
    esUnico: true,
    titulo: 'Gran Premio de Interlagos: la coronación',
    descripcion: 'Última fecha del campeonato del mundo. Lluvia copiosa en San Pablo. Se decide quién escribe su nombre en la historia.',
    opciones: [
      {
        texto: 'Manejar como un poseso sin soltar el acelerador en el Curvón',
        consecuencias: {
          stats: { velocidad: 12, lluvia: 12, fama: 18 },
          textoResultado: '¡Actuación legendaria en agua! Cierras el campeonato con los aplausos del mundo entero.',
        },
      },
      {
        texto: 'Jugar sucio cerrándole el paso en boxes a tu perseguidor',
        consecuencias: {
          stats: { defensa: 8, popularidad: -10 },
          incrementaJuegoSucio: true,
          textoResultado: 'Cruzás la meta envuelto en protestas reglamentarias y reclamos técnicos.',
        },
      },
    ],
  },

  // Nuevos eventos agregados para mayor variedad y balance (Prompt 8)
  {
    id: 'karting-07-ajuste-carburacion-calor',
    tipo: 'deportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 20,
    titulo: 'Calor sofocante sobre el asfalto',
    descripcion: 'La temperatura en pista supera los 42°C. El motor de 2 tiempos empieza a ahogarse por falta de densidad de aire.',
    opciones: [
      {
        texto: 'Abrir la aguja de alta y bajar compresión sacrificando recta',
        consecuencias: {
          stats: { gestion: 5, consistencia: 4 },
          textoResultado: 'El motor no se detuvo y lográs terminar con ritmo sólido a pesar del calor agobiante.',
        },
      },
      {
        texto: 'Mantener la carburación fina al límite corriendo el riesgo de agarrar pistón',
        consecuencias: {
          stats: { velocidad: 6, consistencia: -4 },
          textoResultado: 'Ganas décimas clave por vuelta, rozando el límite de temperatura de agua.',
        },
      },
    ],
  },
  {
    id: 'karting-08-chasis-doblado',
    tipo: 'deportivo',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 18,
    titulo: 'Golpe en las tandas libres y chasis torcido',
    descripcion: 'Un toque en los entrenamientos dejó el pontón y la punta de eje desalineada.',
    opciones: [
      {
        texto: 'Enderezar el chasis a palanca con el mecánico en los boxes',
        consecuencias: {
          stats: { defensa: 4, consistencia: 3 },
          textoResultado: 'Acomodaron la masa y saliste a pista resistiendo con el auto equilibrado.',
        },
      },
      {
        texto: 'Gastar los ahorros en reemplazar el soporte de eje completo',
        consecuencias: {
          stats: { velocidad: 5, gestion: -3 },
          textoResultado: 'El karting quedó impecable, aunque afectó el presupuesto de la fecha.',
        },
      },
    ],
  },
  {
    id: 'f4-05-viento-cruzado',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 20,
    titulo: 'Ráfagas de viento cruzado en la recta principal',
    descripcion: 'Fuertes vientos en el circuito desestabilizan el alerón delantero a más de 200 km/h.',
    opciones: [
      {
        texto: 'Cargar 2 grados más de ala delantera para ganar estabilidad',
        consecuencias: {
          stats: { defensa: 5, gestion: 4 },
          textoResultado: 'Perdiste un poco de velocidad final, pero ganaste seguridad en curvas rápidas.',
        },
      },
      {
        texto: 'Mantener la configuración descargada y corregir con el volante',
        consecuencias: {
          stats: { ataque: 6, consistencia: -3 },
          textoResultado: 'Brillante trabajo de brazos en la recta superando a dos monoplazas.',
        },
      },
    ],
  },
  {
    id: 'f4-07-eleccion-compuesto',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula 4 Brasil',
    categoriaMaxima: 'Formula Regional Europea',
    peso: 20,
    titulo: 'Dilema de compuesto para la tanda decisiva',
    descripcion: 'El asfalto está frío y abrasivo. Tenés que elegir la estrategia de neumáticos con el equipo.',
    opciones: [
      {
        texto: 'Optar por neumáticos blandos para atacar en las primeras 5 vueltas',
        consecuencias: {
          stats: { velocidad: 6, ataque: 5, gestion: -4 },
          textoResultado: 'Tomaste la punta temprano pero los neumáticos terminaron al límite de desgaste.',
        },
      },
      {
        texto: 'Elegir el compuesto medio apostando al ritmo de fin de carrera',
        consecuencias: {
          stats: { gestion: 6, consistencia: 5 },
          textoResultado: 'Cuidaste el compuesto y superaste rivales en las últimas vueltas.',
        },
      },
    ],
  },
  {
    id: 'f3-03-pole-monaco',
    tipo: 'deportivo',
    categoriaMinima: 'Formula Regional Europea',
    categoriaMaxima: 'FIA Fórmula 3',
    peso: 20,
    titulo: 'Clasificación entre los muros de Mónaco',
    descripcion: 'Tenés una sola vuelta limpia para meter el auto en la primera fila rozando los guardarraíles de la Piscina.',
    opciones: [
      {
        texto: 'Rozar los muros al milímetro arriesgando la suspensión',
        consecuencias: {
          stats: { velocidad: 8, ataque: 6, fama: 8 },
          textoResultado: '¡Vuelta impresionante! Metés el monoplaza en la primera línea con aplausos del paddock.',
        },
      },
      {
        texto: 'Asegurar una trazada limpia sin arriesgar el auto en la chicana',
        consecuencias: {
          stats: { consistencia: 6, gestion: 5 },
          textoResultado: 'Clasificás en el lote puntero garantizando salir sin daños.',
        },
      },
    ],
  },
  {
    id: 'f3-04-estrategia-undercut',
    tipo: 'deportivo',
    categoriaMinima: 'FIA Fórmula 3',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 20,
    titulo: 'Oportunidad de Undercut en boxes',
    descripcion: 'Quedaste atrapado en el aire sucio detrás de tu rival. Tu ingeniero propone parar una vuelta antes.',
    opciones: [
      {
        texto: 'Anticipar la parada en boxes marcando 3 sectores en récord',
        consecuencias: {
          stats: { ataque: 7, velocidad: 6 },
          textoResultado: '¡Undercut perfecto! Salís por delante cuando tu rival sale de los pits.',
        },
      },
      {
        texto: 'Estirar la tanda 4 vueltas más para tener neumáticos más frescos al final',
        consecuencias: {
          stats: { gestion: 7, consistencia: 5 },
          textoResultado: 'Tu ritmo al final de carrera te permitió superar a dos autos sobre la meta.',
        },
      },
    ],
  },
  {
    id: 'f2-01-degradacion-bahrein',
    tipo: 'deportivo',
    categoriaMinima: 'FIA Fórmula 2',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 22,
    titulo: 'Abrasión extrema de asfalto en Sakhir',
    descripcion: 'El neumático trasero izquierdo muestra ampolla de degradación térmica a falta de 4 vueltas.',
    opciones: [
      {
        texto: 'Modificar el reparto de frenada hacia adelante y cuidar la tracción',
        consecuencias: {
          stats: { gestion: 8, defensa: 5 },
          textoResultado: 'Salvaste la goma y aguantaste la posición con astucia estratégica.',
        },
      },
      {
        texto: 'Defender la posición atacando cada vértice sin aflojar',
        consecuencias: {
          stats: { ataque: 6, consistencia: -6 },
          textoResultado: 'Sufriste un derrape en la última curva pero mantuviste el puesto.',
        },
      },
    ],
  },
  {
    id: 'f1-03-radio-ordenes-equipo',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 25,
    titulo: 'Órdenes de equipo por radio: "Let him pass"',
    descripcion: 'Tu ingeniero te comunica por radio que dejes pasar a tu compañero de equipo por estrategia de campeonato.',
    opciones: [
      {
        texto: 'Acatar la orden y ceder la posición de forma profesional',
        consecuencias: {
          stats: { consistencia: 6, popularidad: 5 },
          tagHistorial: 'ordenesAcatadas',
          textoResultado: 'Cediste el paso de forma impecable. El director de equipo valora tu lealtad institucional.',
        },
      },
      {
        texto: 'Ignorar la radio y defender el puesto hasta la bandera a cuadros',
        consecuencias: {
          stats: { velocidad: 8, popularidad: -6 },
          tagHistorial: 'ordenesIgnoradas',
          textoResultado: 'Cruzaste por delante de tu compañero. Polémica ardiente en las entrevistas post-carrera.',
        },
      },
    ],
  },
  {
    id: 'f1-04-mejora-suelo',
    tipo: 'deportivo',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 22,
    titulo: 'Nuevo paquete aerodinámico de piso',
    descripcion: 'El equipo trae un suelo rediseñado en carbono que promete 2 décimas por vuelta.',
    opciones: [
      {
        texto: 'Exigir la puesta a punto agresiva de altura al suelo',
        consecuencias: {
          stats: { velocidad: 9, consistencia: -3 },
          textoResultado: 'El monoplaza vuela en clasificación aunque roza con violencia sobre las rectas.',
        },
      },
      {
        texto: 'Configurar una altura conservadora para evitar desgaste de la plancha inferior',
        consecuencias: {
          stats: { gestion: 7, consistencia: 6 },
          textoResultado: 'Asegurás un auto estable y sin riesgos de descalificación técnica.',
        },
      },
    ],
  },
  {
    id: 'f1-05-rueda-prensa-polemica',
    tipo: 'extradeportivo',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 20,
    titulo: 'Conferencia de prensa acalorada',
    descripcion: 'Periodistas internacionales cuestionan tu estilo de defensa agresivo contra {RIVAL}.',
    opciones: [
      {
        texto: 'Defender tu estilo: "Esto es Fórmula 1, no un paseo de domingo"',
        consecuencias: {
          stats: { fama: 10, popularidad: 8 },
          textoResultado: 'Tu declaración se volvió tendencia global. Los fanáticos adoran tu carácter picante.',
        },
      },
      {
        texto: 'Responder con diplomacia y elogiar la competitividad del campeonato',
        consecuencias: {
          stats: { popularidad: 5, gestion: 4 },
          textoResultado: 'Proyectaste una imagen madura y profesional altamente valorada por los patrocinadores.',
        },
      },
    ],
  },

  // ==========================================
  // EVENTOS REDISEÑADOS DE FAMA / POPULARIDAD (Prompt 10 - E.2)
  // ==========================================
  {
    id: 'prensa-01-podcast-estelar',
    tipo: 'extradeportivo',
    categoriaEvento: 'prensa',
    categoriaMinima: 'Fórmula 4 España',
    peso: 22,
    titulo: 'Invitación a Podcast Deportivo Internacional',
    descripcion: 'Un programa de streaming deportivo con millones de oyentes te invita a una entrevista distendida de 2 horas.',
    opciones: [
      {
        texto: 'Revelar anécdotas picantes de vestuario y críticas al ambiente del paddock',
        consecuencias: {
          stats: { fama: 12, popularidad: 10 },
          textoResultado: 'El episodio rompió récords de audiencia. Generaste debate acalorado en redes.',
        },
      },
      {
        texto: 'Mantener un perfil enfocado 100% en la disciplina, nutrición y telemetría',
        consecuencias: {
          stats: { popularidad: 8, fama: 6 },
          textoResultado: 'Ganaste el respeto de los analistas técnicos por tu seriedad profesional.',
        },
      },
    ],
  },
  {
    id: 'prensa-02-gala-premios-fia',
    tipo: 'extradeportivo',
    categoriaEvento: 'prensa',
    categoriaMinima: 'FIA Fórmula 3',
    peso: 20,
    titulo: 'Gala Anual de Premiación y Alfombra Roja',
    descripcion: 'Asistís a la entrega anual de trofeos luciendo un atuendo vanguardista que acapara las cámaras.',
    opciones: [
      {
        texto: 'Posar con soltura y dedicar unas palabras al público de tu país natal',
        consecuencias: {
          stats: { popularidad: 12, fama: 8 },
          textoResultado: 'La transmisión oficial destacó tu carisma y orgullo nacional.',
        },
      },
      {
        texto: 'Aprovechar la noche para charlar en privado con directores de equipos rivales',
        consecuencias: {
          stats: { fama: 14, popularidad: 4 },
          textoResultado: 'Causaste intriga en el paddock sobre tu futuro contractual.',
        },
      },
    ],
  },
  {
    id: 'mercado-01-spot-indumentaria',
    tipo: 'extradeportivo',
    categoriaEvento: 'mercado',
    categoriaMinima: 'Fórmula 4 Brasil',
    peso: 20,
    titulo: 'Campaña Global de Marca de Indumentaria',
    descripcion: 'Una renombrada firma de ropa urbana propone convertirte en la cara de su nueva colección.',
    opciones: [
      {
        texto: 'Aceptar el contrato y participar activamente en sesiones fotográficas',
        consecuencias: {
          stats: { fama: 15, popularidad: 10 },
          textoResultado: 'Tus gigantografías aparecieron en centros comerciales de todo el mundo.',
        },
      },
      {
        texto: 'Priorizar el descanso de pretemporada y delegar la publicidad en tu agente',
        consecuencias: {
          stats: { popularidad: 5, fama: 5 },
          textoResultado: 'Mantuviste el foco en tu entrenamiento físico sin distracciones mediáticas.',
        },
      },
    ],
  },
  {
    id: 'prensa-03-simracing-benefico',
    tipo: 'extradeportivo',
    categoriaEvento: 'prensa',
    categoriaMinima: 'Fórmula Nacional',
    peso: 22,
    titulo: 'Torneo Benefactor de Simracing con Streamers',
    descripcion: 'Te invitan a competir en una carrera virtual benéfica transmitida en vivo para cientos de miles de espectadores.',
    opciones: [
      {
        texto: 'Brindar un show de sobrepasos arriesgados y bromas por micrófono',
        consecuencias: {
          stats: { popularidad: 14, fama: 6 },
          textoResultado: 'La comunidad gamer te adoptó como uno de sus pilotos preferidos.',
        },
      },
      {
        texto: 'Tomar la competencia virtual con rigor profesional y aplastar a los rivales',
        consecuencias: {
          stats: { fama: 10, popularidad: 6 },
          textoResultado: 'Demostraste tu velocidad indiscutida incluso en el plano digital.',
        },
      },
    ],
  },
];
