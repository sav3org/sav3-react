// credits: https://github.com/spacex07

import createTranslation from '../create-translation'
import {register as registerTimeAgo} from 'timeago.js'

const timeAgo = (number, index, totalSec) => {
  // copy paste timeAgo locale from https://github.com/hustcc/timeago.js/tree/master/src/lang
  return [
    ['az önce', 'şimdi'],
    ['%s saniye önce', '%s saniye içinde'],
    ['1 dakika önce', '1 dakika içinde'],
    ['%s dakika önce', '%s dakika içinde'],
    ['1 saat önce', '1 saat içinde'],
    ['%s saat önce', '%s saat içinde'],
    ['1 gün önce', '1 gün içinde'],
    ['%s gün önce', '%s gün içinde'],
    ['1 hafta önce', '1 hafta içinde'],
    ['%s hafta önce', '%s hafta içinde'],
    ['1 ay önce', '1 ay içinde'],
    ['%s ay önce', '%s ay içinde'],
    ['1 yıl önce', '1 yıl içinde'],
    ['%s yıl önce', '%s yıl içinde']
  ][index]
}
registerTimeAgo('tr', timeAgo)

const translation = createTranslation({
  // profile
  Follow: () => 'Takip et',
  Unfollow: () => 'Takibi bırak',
  'Edit profile': () => 'Profili düzenle',
  'Display name': () => 'Görüntülecek isim',
  Description: () => 'Açıklama',
  'Thumbnail URL': () => 'Profil resmi URL’si',
  'Banner URL': () => 'Kapak resmi URL’si',

  // menu
  Home: () => 'Anasayfa',
  Profile: () => 'Profil',
  Search: () => 'Ara',
  'Search user ID': () => 'Kullanıcı adı Ara',
  Peers: () => 'Eşler',
  'Connected peers posts': () => 'Eşlerin gönderilerine bağlandı',
  Stats: () => 'İstatistikler',
  'Connected peers stats': () => 'Eşlerin istatistiklerine bağlandı',
  'Connecting to peers': () => 'Eşlere bağlanıyor',
  Following: () => 'Takip ediliyor',
  'Not following anyone': () => 'Hiç kimseyi takip etmiyorsunuz',
  Export: () => 'Dışarı aktar',
  Import: () => 'İçeri aktar',

  // post
  'Uncensorable content': () => 'Sansürsüz içerik'
})

export default translation
