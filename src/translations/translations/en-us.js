import createTranslation from '../create-translation'

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
