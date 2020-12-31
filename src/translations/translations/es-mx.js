import createTranslation from '../create-translation'
import {register as registerTimeAgo} from 'timeago.js'

const timeAgo = (number, index, totalSec) => {
  // copy paste timeAgo locale from https://github.com/hustcc/timeago.js/tree/master/src/lang
  return [
    ['justo ahora', 'en un rato'],
    ['hace %s segundos', 'en %s segundos'],
    ['hace 1 minuto', 'en 1 minuto'],
    ['hace %s minutos', 'en %s minutos'],
    ['hace 1 hora', 'en 1 hora'],
    ['hace %s horas', 'en %s horas'],
    ['hace 1 día', 'en 1 día'],
    ['hace %s días', 'en %s días'],
    ['hace 1 semana', 'en 1 semana'],
    ['hace %s semanas', 'en %s semanas'],
    ['hace 1 mes', 'en 1 mes'],
    ['hace %s meses', 'en %s meses'],
    ['hace 1 año', 'en 1 año'],
    ['hace %s años', 'en %s años']
  ][index]
}
registerTimeAgo('es-MX', timeAgo)

const translation = createTranslation({
  // profile
  Follow: () => 'Seguir',
  Unfollow: () => 'Dejar de seguir',
  'Edit profile': () => 'Editar perfil',
  'Display name': () => 'Nombre para mostrar',
  Description: () => 'Descripción',
  'Thumbnail URL': () => 'URL de miniatura',
  'Banner URL': () => 'URL del banner',

  // menu
  Home: () => 'Casa',
  Profile: () => 'Perfil',
  Search: () => 'Buscar',
  'Search user ID': () => 'Buscar ID de usuario',
  Peers: () => 'Compañeros',
  'Connected peers posts': () => 'Publicaciones de compañeros conectados',
  Stats: () => 'Estadisticas',
  'Connected peers stats': () => 'Estadísticas de compañeros conectados',
  'Connecting to peers': () => 'Conectando con sus compañeros',
  Following: () => 'Siguiendo',
  'Not following anyone': () => 'No seguir a nadie',
  Export: () => 'Exportar',
  Import: () => 'Importar',

  // post
  'Uncensorable content': () => 'Contenido sin censura'
})

export default translation
