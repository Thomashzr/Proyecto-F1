import { Categoria } from '../engine/types';

export interface FechaCalendario {
  numeroFecha: number;
  nombreGranPremio: string;
  circuito: string;
  pais: string;
  esCarreraClave: boolean;
  esMojado?: boolean;
}

export const CALENDARIOS_POR_CATEGORIA: Record<Categoria, FechaCalendario[]> = {
  'Karting Regional': [
    { numeroFecha: 1, nombreGranPremio: 'GP Apertura Zárate', circuito: 'Kartódromo Internacional de Zárate', pais: 'Argentina', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP Ciudad Evita', circuito: 'Kartódromo de Ciudad Evita', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP Mar del Plata', circuito: 'Kartódromo AKPS Mar del Plata', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 4, nombreGranPremio: 'GP Coronación Luján', circuito: 'Kartódromo de Luján', pais: 'Argentina', esCarreraClave: false },
  ],
  'Karting Nacional': [
    { numeroFecha: 1, nombreGranPremio: 'GP Nacional Buenos Aires', circuito: 'Kartódromo Gálvez de BsAs', pais: 'Argentina', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP Trenque Lauquen', circuito: 'Kartódromo de Trenque Lauquen', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP Córdoba Kart', circuito: 'Kartódromo de Colonia Caroya', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 4, nombreGranPremio: 'GP Villaguay', circuito: 'Kartódromo Parque Villaguay', pais: 'Argentina', esCarreraClave: false },
  ],
  'Fórmula Nacional': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Buenos Aires', circuito: 'Autódromo Oscar y Juan Gálvez', pais: 'Argentina', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de San Juan', circuito: 'Autódromo San Juan Villicum', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Córdoba', circuito: 'Autódromo Oscar Cabalén', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 4, nombreGranPremio: 'GP de San Nicolás', circuito: 'Autódromo San Nicolás Ciudad', pais: 'Argentina', esCarreraClave: false },
    { numeroFecha: 5, nombreGranPremio: 'GP Coronación Rafaela', circuito: 'Autódromo Ciudad de Rafaela', pais: 'Argentina', esCarreraClave: false },
  ],
  'Fórmula 4 Brasil': [
    { numeroFecha: 1, nombreGranPremio: 'GP de São Paulo', circuito: 'Autódromo José Carlos Pace (Interlagos)', pais: 'Brasil', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP Velo Città', circuito: 'Autódromo Velo Città', pais: 'Brasil', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Goiânia', circuito: 'Autódromo Internacional de Goiânia', pais: 'Brasil', esCarreraClave: true },
    { numeroFecha: 4, nombreGranPremio: 'GP Velo Città II', circuito: 'Autódromo Velo Città', pais: 'Brasil', esCarreraClave: false },
    { numeroFecha: 5, nombreGranPremio: 'GP Interlagos Final', circuito: 'Autódromo José Carlos Pace', pais: 'Brasil', esCarreraClave: true, esMojado: true },
  ],
  'Fórmula 4 España': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Aragón', circuito: 'MotorLand Aragón', pais: 'España', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de Navarra', circuito: 'Circuito de Navarra', pais: 'España', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Valencia', circuito: 'Circuito Ricardo Tormo', pais: 'España', esCarreraClave: true },
    { numeroFecha: 4, nombreGranPremio: 'GP de Jerez', circuito: 'Circuito de Jerez-Ángel Nieto', pais: 'España', esCarreraClave: false },
    { numeroFecha: 5, nombreGranPremio: 'GP de Catalunya', circuito: 'Circuit de Barcelona-Catalunya', pais: 'España', esCarreraClave: true },
  ],
  'Fórmula 4 Italia': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Misano', circuito: 'Misano World Circuit Marco Simoncelli', pais: 'Italia', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de Imola', circuito: 'Autodromo Enzo e Dino Ferrari', pais: 'Italia', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Vallelunga', circuito: 'Autodromo Piero Taruffi', pais: 'Italia', esCarreraClave: true },
    { numeroFecha: 4, nombreGranPremio: 'GP de Mugello', circuito: 'Autodromo Internazionale del Mugello', pais: 'Italia', esCarreraClave: false },
    { numeroFecha: 5, nombreGranPremio: 'GP de Monza', circuito: 'Autodromo Nazionale Monza', pais: 'Italia', esCarreraClave: true, esMojado: true },
  ],
  'Formula Regional Europea': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Imola FRECA', circuito: 'Autodromo Enzo e Dino Ferrari', pais: 'Italia', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de Barcelona FRECA', circuito: 'Circuit de Barcelona-Catalunya', pais: 'España', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Spa FRECA', circuito: 'Circuit de Spa-Francorchamps', pais: 'Bélgica', esCarreraClave: true, esMojado: true },
    { numeroFecha: 4, nombreGranPremio: 'GP de Zandvoort FRECA', circuito: 'Circuit Zandvoort', pais: 'Países Bajos', esCarreraClave: false },
    { numeroFecha: 5, nombreGranPremio: 'GP de Monza FRECA', circuito: 'Autodromo Nazionale Monza', pais: 'Italia', esCarreraClave: true },
  ],
  'FIA Fórmula 3': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Bahréin F3', circuito: 'Bahrain International Circuit', pais: 'Bahréin', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de Australia F3', circuito: 'Albert Park Circuit', pais: 'Australia', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Mónaco F3', circuito: 'Circuit de Monaco', pais: 'Mónaco', esCarreraClave: true },
    { numeroFecha: 4, nombreGranPremio: 'GP de Silverstone F3', circuito: 'Silverstone Circuit', pais: 'Reino Unido', esCarreraClave: false, esMojado: true },
    { numeroFecha: 5, nombreGranPremio: 'GP de Italia F3', circuito: 'Autodromo Nazionale Monza', pais: 'Italia', esCarreraClave: true },
  ],
  'FIA Fórmula 2': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Bahréin F2', circuito: 'Bahrain International Circuit', pais: 'Bahréin', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de Jeddah F2', circuito: 'Jeddah Corniche Circuit', pais: 'Arabia Saudita', esCarreraClave: false },
    { numeroFecha: 3, nombreGranPremio: 'GP de Mónaco F2', circuito: 'Circuit de Monaco', pais: 'Mónaco', esCarreraClave: true },
    { numeroFecha: 4, nombreGranPremio: 'GP de Silverstone F2', circuito: 'Silverstone Circuit', pais: 'Reino Unido', esCarreraClave: false, esMojado: true },
    { numeroFecha: 5, nombreGranPremio: 'GP de Abu Dhabi F2', circuito: 'Yas Marina Circuit', pais: 'Emiratos Árabes Unidos', esCarreraClave: true },
  ],
  'Fórmula 1': [
    { numeroFecha: 1, nombreGranPremio: 'GP de Bahréin F1', circuito: 'Bahrain International Circuit', pais: 'Bahréin', esCarreraClave: true },
    { numeroFecha: 2, nombreGranPremio: 'GP de Mónaco F1', circuito: 'Circuit de Monaco', pais: 'Mónaco', esCarreraClave: true },
    { numeroFecha: 3, nombreGranPremio: 'GP de Silverstone F1', circuito: 'Silverstone Circuit', pais: 'Reino Unido', esCarreraClave: false, esMojado: true },
    { numeroFecha: 4, nombreGranPremio: 'GP de São Paulo F1', circuito: 'Autódromo José Carlos Pace (Interlagos)', pais: 'Brasil', esCarreraClave: true, esMojado: true },
    { numeroFecha: 5, nombreGranPremio: 'GP de Abu Dhabi F1', circuito: 'Yas Marina Circuit', pais: 'Emiratos Árabes Unidos', esCarreraClave: false },
  ],
};
