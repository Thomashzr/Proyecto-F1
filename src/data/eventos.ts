import { Evento } from '../engine/types';

export const EVENTOS: Evento[] = [
  // ==========================================
  // KARTING REGIONAL Y KARTING NACIONAL (Edad 9-14)
  // ==========================================
  {
    id: 'karting-01-chasis-prestado',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 15,
    titulo: 'Chasis usado y motor con mañas',
    descripcion: 'Llegás al campeonato zonal con un karting usado que le compraste a un vecino. En la clasificación sintió una falla de carburación en baja.',
    opciones: [
      {
        texto: 'Meter mano al carburador solo en el parque cerrado',
        consecuencias: {
          stats: { velocidad: 8, gestion: -4 },
          textoResultado: 'Carburaste justo a tiempo. El motor respondió y metiste el 3er mejor tiempo de tanda.',
        },
      },
      {
        texto: 'Pedirle repuestos prestados a la familia de Nico Varela',
        consecuencias: {
          stats: { fama: 5, popularidad: 8 },
          textoResultado: 'El padre de Nico Varela te prestó un chiclé de baja. Quedás en deuda moral pero clasificás bien.',
        },
      },
    ],
  },
  {
    id: 'karting-02-primera-final-lluvia',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 15,
    titulo: 'Tormenta sobre la pista de barro',
    descripcion: 'Faltan 5 minutos para la largada y se largó una cortina de agua en Buenos Aires. No tenés presupuesto para ganchos de lluvia nuevos.',
    opciones: [
      {
        texto: 'Largar con cubiertas lisas gastadas y controlar con la mano al aire',
        consecuencias: {
          stats: { lluvia: 12, consistencia: -5 },
          textoResultado: 'Fue una lección magistral de control en mojado. Saliste 2do trompeando en la última curva.',
        },
      },
      {
        texto: 'Hipotecar ahorros familiares para comprar gomas de lluvia usadas',
        consecuencias: {
          stats: { gestion: 10, popularidad: 5 },
          textoResultado: 'Ganas la carrera holgado, pero la discusión financiera en casa fue dura.',
        },
      },
    ],
  },
  {
    id: 'karting-03-rivalidad-varela-1',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 20,
    personajeRecurrente: 'Nico Varela',
    esUnico: true,
    titulo: 'Toque con Nico Varela en la chicana',
    descripcion: 'Nico Varela, el chico adinerado del equipo oficial, te frena el karting en el apéndice de la chicana para taparte el radio de curva.',
    opciones: [
      {
        texto: 'Tirarle el pontón en la horquilla de entrada a meta',
        consecuencias: {
          stats: { ataque: 10, popularidad: -5 },
          incrementaJuegoSucio: true,
          textoResultado: 'Lo dejaste cruzado sobre el piano. Saliste campeón regional, pero te ganaste un enemigo de por vida.',
        },
      },
      {
        texto: 'Cruzar el kart por la huella limpia y esperar el error',
        consecuencias: {
          stats: { defensa: 10, consistencia: 8 },
          textoResultado: 'Varela se pasó de frenada dos vueltas después. Cruzaste la meta victorioso y con aplausos del comisariato.',
        },
      },
    ],
  },
  {
    id: 'karting-04-sacrificio-familiar',
    categoriaMinima: 'Karting Regional',
    categoriaMaxima: 'Karting Nacional',
    peso: 12,
    titulo: 'El trailer que se rompió en la ruta',
    descripcion: 'A mitad de camino al kartódromo nacional, se rompió el eje del trailer. Si no llegás a la técnica antes de las 8 AM, quedás excluido.',
    opciones: [
      {
        texto: 'Cargar el karting en el baúl del auto familiar sacrificando el equipaje',
        consecuencias: {
          stats: { consistencia: 8, popularidad: 10 },
          textoResultado: 'Llegaron a las 7:55 AM destruidos de fatiga, pero listos para la técnica.',
        },
      },
      {
        texto: 'Pagar un remolque de auxilio con los últimos ahorros de la inscripción',
        consecuencias: {
          stats: { fama: 5, gestion: -10 },
          textoResultado: 'Llegaron a tiempo, pero entraron a la carrera sin un solo peso para repuestos.',
        },
      },
    ],
  },
  {
    id: 'karting-05-salto-nacional',
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
          stats: { fama: 15, velocidad: 8 },
          avanzaCategoria: true,
          textoResultado: '¡Ascendés a Karting Nacional! Los circuitos son más exigentes y la competencia es implacable.',
        },
      },
    ],
  },

  // ==========================================
  // FÓRMULA NACIONAL Y F4 BRASIL / ESPAÑA / ITALIA (Edad 14-18)
  // ==========================================
  {
    id: 'f4-01-primer-test-monoplaza',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 15,
    titulo: 'La carga aerodinámica del F4',
    descripcion: 'Tu primer test oficial en monoplaza. La dirección y la fuerza G en el cuello te exigen al límite.',
    opciones: [
      {
        texto: 'Exigir el cuello al máximo sin pedir parar en boxes',
        consecuencias: {
          stats: { velocidad: 10, consistencia: 5 },
          textoResultado: 'Te bajaste del auto dolorido, pero los ingenieros amaron tu tenacidad.',
        },
      },
      {
        texto: 'Parar cada 5 vueltas para calibrar la postura con el fisio',
        consecuencias: {
          stats: { gestion: 10, consistencia: 8 },
          textoResultado: 'Aprendiste a cuidar el físico en curvas de alta velocidad.',
        },
      },
    ],
  },
  {
    id: 'f4-02-patrocinador-lacteo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 15,
    titulo: 'Presión de la marca patrocinante',
    descripcion: 'El patrocinador principal exige que te vistas con un traje ridículo en un spot publicitario antes de la carrera.',
    opciones: [
      {
        texto: 'Tragar saliva, hacer el spot y sonreír para las redes',
        consecuencias: {
          stats: { fama: 25, popularidad: -5 },
          textoResultado: 'El video se volvió viral. Pasaste vergüenza pero aseguraste presupuesto publicitario.',
        },
      },
      {
        texto: 'Negarte rotundamente aduciendo dignidad deportiva',
        consecuencias: {
          stats: { popularidad: 15, fama: -10 },
          textoResultado: 'El público apreció tu postura, aunque el patrocinador redujo presupuesto.',
        },
      },
    ],
  },
  {
    id: 'f4-03-choque-muro-curva-1',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 15,
    titulo: 'Bloqueada y paredón a 180 km/h',
    descripcion: 'Poblada la Curva 1, te quedaste sin frenos por sobrecalentamiento de líquido y golpeaste de costado.',
    opciones: [
      {
        texto: 'Asumir la culpa con el equipo e ir al médico de pista',
        consecuencias: {
          stats: { consistencia: 10, popularidad: 10 },
          textoResultado: 'Te hicieron placas de tórax. El equipo valora tu honestidad.',
        },
      },
      {
        texto: 'Echarle la culpa a una supuesta falla del sensor de frenos',
        consecuencias: {
          stats: { fama: -15, popularidad: -10 },
          textoResultado: 'La telemetría demostró que bloqueaste vos. Perdiste reputación en los pits.',
        },
      },
    ],
  },
  {
    id: 'f4-04-rivalidad-varela-2',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 18,
    personajeRecurrente: 'Nico Varela',
    esUnico: true,
    titulo: 'Nico Varela reaparece en F4',
    descripcion: 'Varela reaparece con el equipo líder. En la conferencia de prensa dice que vos sólo estás ahí por suerte.',
    opciones: [
      {
        texto: 'Responder en pista haciéndole un sobrepaso por fuera en el Curvón',
        consecuencias: {
          stats: { ataque: 12, velocidad: 10 },
          textoResultado: 'Le metiste un sobrepaso quirúrgico que salió en los resúmenes de televisión.',
        },
      },
      {
        texto: 'Encerrarlo contra el muro del box en la salida de clasificatoria',
        consecuencias: {
          stats: { defensa: 8, popularidad: -10 },
          incrementaJuegoSucio: true,
          textoResultado: 'Los comisarios te apercibieron. Tensión al máximo en los boxes.',
        },
      },
    ],
  },
  {
    id: 'f4-05-orden-de-equipo',
    categoriaMinima: 'Fórmula Nacional',
    categoriaMaxima: 'Fórmula 4 Italia',
    peso: 15,
    titulo: 'Orden de equipo por radio en la última vuelta',
    descripcion: 'Vas 1ro pero tu compañero de equipo se juega el campeonato de marcas. La radio te ordena: "Dejalo pasar en la recta".',
    opciones: [
      {
        texto: 'Acatar la orden y frenar unos metros antes de la línea',
        consecuencias: {
          stats: { consistencia: 15, popularidad: -5 },
          textoResultado: 'Hiciste el trabajo sucio. El dueño del equipo te prometió prioridad para el próximo año.',
        },
      },
      {
        texto: 'Simular falla de radio ("Radio check, no los escucho") y ganar',
        consecuencias: {
          stats: { velocidad: 8, fama: 15, popularidad: -15 },
          textoResultado: 'Ganaste la carrera. Festejaste solo en el podio mientras el box ardía.',
        },
      },
    ],
  },
  {
    id: 'f4-06-oferta-freca',
    categoriaMinima: 'Fórmula 4 Brasil',
    categoriaMaxima: 'Fórmula 4 Italia',
    condiciones: [{ stat: 'velocidad', operador: '>=', valor: 50 }],
    peso: 40,
    esUnico: true,
    titulo: 'Promoción a Formula Regional Europea (FRECA)',
    descripcion: 'Una escudería europea te ofrece dar el salto a FRECA en los circuitos continentales.',
    opciones: [
      {
        texto: 'Firmar con el equipo de FRECA y mudar tus pertenencias a Europa',
        consecuencias: {
          stats: { fama: 20, velocidad: 10 },
          avanzaCategoria: true,
          cambioEquipo: 'ART Grand Prix FRECA',
          textoResultado: 'Armás las valijas. Estás en la antesala real de la Fórmula 3.',
        },
      },
    ],
  },

  // ==========================================
  // FRECA, FIA F3 Y FIA F2 (Edad 18-22)
  // ==========================================
  {
    id: 'f3-01-silverstone-lluvia',
    categoriaMinima: 'Formula Regional Europea',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 15,
    titulo: 'Silverstone bajo temporal británico',
    descripcion: 'Pista inundada en Copse. Los monoplazas hacen aquaplaning a 240 km/h. La mitad de los autos están desparramados en el pasto.',
    opciones: [
      {
        texto: 'Soltar el acelerador 50 metros antes y buscar tracción por fuera',
        consecuencias: {
          stats: { lluvia: 15, consistencia: 10 },
          textoResultado: 'Espectacular lección de manejo sobre agua. Ganás 4 posiciones.',
        },
      },
      {
        texto: 'Cerrar los ojos, mantener el pie a fondo y confiar en el difusor',
        consecuencias: {
          stats: { velocidad: 10, consistencia: -15 },
          textoResultado: 'Terminaste en el paredón de Stowe destruyendo la suspensión delantera.',
        },
      },
    ],
  },
  {
    id: 'f3-02-telemetria-compartida',
    categoriaMinima: 'Formula Regional Europea',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 15,
    titulo: 'Sospechas sobre la telemetría del equipo',
    descripcion: 'Descubrís que el ingeniero jefe le entrega tus mapas de aceleración y puntos de frenada a Nico Varela, tu compañero de equipo.',
    opciones: [
      {
        texto: 'Guardarte un secreto de trazada para las rondas finales',
        consecuencias: {
          stats: { velocidad: 10, gestion: 8 },
          textoResultado: 'En la clasificación abriste la trazada en el sector 2 y le sacaste 3 décimas a Varela.',
        },
      },
      {
        texto: 'Enfrentar al director de equipo delante de los mecánicos',
        consecuencias: {
          stats: { popularidad: -15, fama: 10 },
          textoResultado: 'Un escándalo en los boxes. La relación con los ingenieros quedó sumamente tirante.',
        },
      },
    ],
  },
  {
    id: 'f3-03-trampa-aleron',
    categoriaMinima: 'Formula Regional Europea',
    categoriaMaxima: 'FIA Fórmula 2',
    peso: 15,
    titulo: 'Zona gris del reglamento técnico',
    descripcion: 'Tu mecánico te propone instalar un alerón flexible que pasa las verificaciones pero se deforma a alta velocidad ganando 8 km/h.',
    opciones: [
      {
        texto: 'Aceptar colocar el alerón clandestino',
        consecuencias: {
          stats: { velocidad: 12, popularidad: -15 },
          incrementaJuegoSucio: true,
          textoResultado: 'Ganaste la pole por amplio margen, aunque en el paddock se rumorea tu trampa.',
        },
      },
      {
        texto: 'Exigir correr 100% legal respetando la reglamentación',
        consecuencias: {
          stats: { popularidad: 20, consistencia: 10 },
          textoResultado: 'Mantuviste el honor intacto. Tu reputación de piloto limpio crece entre los jefes de F1.',
        },
      },
    ],
  },
  {
    id: 'f3-04-superlicencia-f1',
    categoriaMinima: 'FIA Fórmula 2',
    categoriaMaxima: 'FIA Fórmula 2',
    condiciones: [{ stat: 'velocidad', operador: '>=', valor: 55 }],
    peso: 45,
    esUnico: true,
    titulo: 'Puntos de Superlicencia FIA alcanzados',
    descripcion: 'Completaste los puntos requeridos para la Superlicencia. Un equipo de F1 te ofrece asiento titular para el próximo año.',
    opciones: [
      {
        texto: 'Firmar contrato de F1 y cumplir el sueño de toda tu vida',
        consecuencias: {
          stats: { fama: 35, popularidad: 25 },
          avanzaCategoria: true,
          cambioEquipo: 'Williams Racing F1',
          textoResultado: '¡LLEGASTE A LA FÓRMULA 1! Tu nombre estará en las grillas oficiales.',
        },
      },
    ],
  },

  // ==========================================
  // FÓRMULA 1 (Edad 22+)
  // ==========================================
  {
    id: 'f1-01-debut-australia',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 15,
    esUnico: true,
    titulo: 'Gran Premio debut en Albert Park, Melbourne',
    descripcion: 'Apagan los 5 semáforos rojos. 20 monoplazas rugen hacia la Curva 1. Tenés al campeón mundial vigente a tu lado.',
    opciones: [
      {
        texto: 'Aprovechar el hueco interno entre dos autos para avanzar 3 puestos',
        consecuencias: {
          stats: { ataque: 15, velocidad: 15, fama: 20 },
          textoResultado: '¡Debut de ensueño! Sumás tus primeros puntos en la máxima categoría.',
        },
      },
      {
        texto: 'Mantener la cautela y asegurar terminar la primera carrera limpia',
        consecuencias: {
          stats: { consistencia: 20, gestion: 15 },
          textoResultado: 'Llevaste el auto a boxes sin un solo rasguño. El equipo aplaude tu madurez.',
        },
      },
    ],
  },
  {
    id: 'f1-02-guerra-compañero-f1',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 18,
    titulo: 'Tensión máxima con tu compañero en F1',
    descripcion: 'En las tandas de clasificación, tu compañero de equipo frena de golpe delante tuyo quitándote la posibilidad del último intento.',
    opciones: [
      {
        texto: 'Denunciarlo en los micrófonos internacionales de la transmisión',
        consecuencias: {
          stats: { fama: 20, popularidad: -15 },
          textoResultado: 'Guerra civil desatada en la escudería. Las fotos tuyas y de tu compañero ocupan todas las portadas.',
        },
      },
      {
        texto: 'Demostrarle quién manda superándolo en el primer frenaje de carrera',
        consecuencias: {
          stats: { ataque: 15, defensa: 15 },
          textoResultado: 'Le metiste el auto en la chicana sin dudar. El mensaje quedó clarísimo en la pista.',
        },
      },
    ],
  },
  {
    id: 'f1-03-desarrollo-monoplaza',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 15,
    titulo: 'Elección de paquete aerodinámico',
    descripcion: 'El equipo te da a elegir entre dos paquetes de mejoras: uno agresivo de alta velocidad punta o uno dócil de alta carga.',
    opciones: [
      {
        texto: 'Pedir el paquete de velocidad punta agresivo para sobrepasos',
        consecuencias: {
          stats: { velocidad: 15, ataque: 10 },
          textoResultado: 'El auto se volvió una bestia en las rectas. Lográs velocidades récord de punta.',
        },
      },
      {
        texto: 'Pedir el paquete dócil y equilibrado que cuida los neumáticos',
        consecuencias: {
          stats: { gestion: 20, consistencia: 15 },
          textoResultado: 'Tus ritmos de carrera son los más consistentes de la parrilla.',
        },
      },
    ],
  },
  {
    id: 'f1-04-pole-monaco',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 15,
    esUnico: true,
    titulo: 'Vuelo rasante buscando la Pole Position en Mónaco',
    descripcion: 'Q3 en Mónaco. Rozás los guardarraíles a milímetros en Rascasse. Vas bajando 2 décimas el tiempo del récord.',
    opciones: [
      {
        texto: 'Pisar el acelerador un 5% antes en la salida hacia la recta de meta',
        consecuencias: {
          stats: { velocidad: 25, fama: 30 },
          textoResultado: '¡POLE POSITION EN MÓNACO! Una de las vueltas clasificatorias más hermosas de la década.',
        },
      },
      {
        texto: 'Asegurar sin arriesgar a besarte la pared',
        consecuencias: {
          stats: { consistencia: 15, gestion: 10 },
          textoResultado: 'Asegurás el 2do lugar en primera fila. Gran posición para la carrera.',
        },
      },
    ],
  },
  {
    id: 'f1-05-decisión-etica-campeonato',
    categoriaMinima: 'Fórmula 1',
    categoriaMaxima: 'Fórmula 1',
    peso: 18,
    titulo: 'Maniobra en la chicana con el candidato al título',
    descripcion: 'Pelea directa de carrera. Tu rival directo en el mundial te mete el auto por dentro. Si no cortás la chicana chocan ambos.',
    opciones: [
      {
        texto: 'Mantener la línea y apretar el choque (si quedamos afuera los dos, sigo arriba)',
        consecuencias: {
          stats: { defensa: 15, popularidad: -25 },
          incrementaJuegoSucio: true,
          textoResultado: 'Choque espectacular. Ambos fuera de carrera. Mantuviste la ventaja de puntos pero bajo abucheos.',
        },
      },
      {
        texto: 'Esquivar por la escapatoria sacrificando la posición',
        consecuencias: {
          stats: { popularidad: 25, consistencia: 10 },
          textoResultado: 'Mantenés el auto sano. Perdiste la punta hoy pero la caballerosidad deportiva te enaltece.',
        },
      },
    ],
  },
  {
    id: 'f1-06-gran-final-interlagos',
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
          stats: { velocidad: 25, lluvia: 25, fama: 35 },
          textoResultado: '¡CRUZÁS LA META EN PRIMER LUGAR! El grito sagrado recorre el mundo.',
        },
      },
      {
        texto: 'Jugar sucio cerrándole el paso en boxes a tu perseguidor',
        consecuencias: {
          stats: { defensa: 15, popularidad: -20 },
          incrementaJuegoSucio: true,
          textoResultado: 'Cruzás la meta envuelto en protestas reglamentarias y reclamos técnicos.',
        },
      },
    ],
  },
];
