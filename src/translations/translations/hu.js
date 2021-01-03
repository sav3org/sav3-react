// credits: telegram @harq72

import createTranslation from '../create-translation'
import {register as registerTimeAgo} from 'timeago.js'

const timeAgo = (number, index, totalSec) => {
  // copy paste timeAgo locale from https://github.com/hustcc/timeago.js/tree/master/src/lang
  return [
    ['éppen most', 'éppen most'],
    ['%s másodperce', '%s másodpercen belül'],
    ['1 perce', '1 percen belül'],
    ['%s perce', '%s percen belül'],
    ['1 órája', '1 órán belül'],
    ['%s órája', '%s órán belül'],
    ['1 napja', '1 napon belül'],
    ['%s napja', '%s napon belül'],
    ['1 hete', '1 héten belül'],
    ['%s hete', '%s héten belül'],
    ['1 hónapja', '1 hónapon belül'],
    ['%s hónapja', '%s hónapon belül'],
    ['1 éve', '1 éven belül'],
    ['%s éve', '%s éven belül']
  ][index]
}

registerTimeAgo('hu', timeAgo)

const translation = createTranslation({
  // profile
  Follow: () => 'Követés',
  Unfollow: () => 'Követés megszüntetése',
  'Edit profile': () => 'Profil szerkesztése',
  'Display name': () => 'Látható név',
  Description: () => 'Leírás',
  'Thumbnail URL': () => 'Profilkép URL',
  'Banner URL': () => 'Banner URL',

  // menu
  Home: () => 'Home',
  Profile: () => 'Profil',
  Search: () => 'Keresés',
  'Search user ID': () => 'Felhasználó ID keresése',
  Peers: () => 'Kapcsolatok',
  'Connected peers posts': () => 'Kapcsolatok üzenetei',
  Stats: () => 'Statisztikák',
  'Connected peers stats': () => 'Kapcsolatok statisztikái',
  'Connecting to peers': () => 'Kapcsolódás',
  Following: () => 'Követések',
  'Not following anyone': () => 'Nem követ senkit',
  Export: () => 'Exportálás',
  Import: () => 'Importálás',

  // post
  'Uncensorable content': () => 'Cenzúrázhatatlan tartalom'
})

export default translation
