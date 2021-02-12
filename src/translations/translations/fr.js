import createTranslation from '../create-translation'
import {register as registerTimeAgo} from 'timeago.js'

const timeAgo = (number, index, totalSec) => {
  // copy paste timeAgo locale from https://github.com/hustcc/timeago.js/tree/master/src/lang
  return [
    ["à l'instant", 'dans un instant'],
    ['il y a %s secondes', 'dans %s secondes'],
    ['il y a 1 minute', 'dans 1 minute'],
    ['il y a %s minutes', 'dans %s minutes'],
    ['il y a 1 heure', 'dans 1 heure'],
    ['il y a %s heures', 'dans %s heures'],
    ['il y a 1 jour', 'dans 1 jour'],
    ['il y a %s jours', 'dans %s jours'],
    ['il y a 1 semaine', 'dans 1 semaine'],
    ['il y a %s semaines', 'dans %s semaines'],
    ['il y a 1 mois', 'dans 1 mois'],
    ['il y a %s mois', 'dans %s mois'],
    ['il y a 1 an', 'dans 1 an'],
    ['il y a %s ans', 'dans %s ans']
  ][index]
}
registerTimeAgo('fr', timeAgo)

const translation = createTranslation({
  // profile
  Follow: () => 'Suivre',
  Unfollow: () => 'Ne plus Suivre',
  'Edit profile': () => 'Editer profile',
  'Display name': () => 'Nom affiché',
  Description: () => 'Description',
  'Thumbnail URL': () => 'URL de la miniature',
  'Banner URL': () => 'URL de la banière',

  // menu
  Home: () => 'Accueil',
  Profile: () => 'Profile',
  Search: () => 'Rechercher',
  'Search user ID': () => 'Rechercher un ID utilisateur',
  Peers: () => 'Pair',
  'Connected peers': () => 'Pairs connectés',
  'Connecting to peers': () => 'Connexion aux pairs',
  Following: () => 'Abonnements',
  'Not following anyone': () => 'Ne plus suivre',
  Export: () => 'Exporter',
  Import: () => 'Importer',

  // post
  'Uncensorable content': () => 'Contenu non-censurable',
  Post: () => 'Publication'
})

export default translation
