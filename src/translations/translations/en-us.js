import createTranslation from '../create-translation'

const translation = createTranslation({
  // profile
  Follow: () => 'Follow',
  Unfollow: () => 'Unfollow',
  'Edit profile': () => 'Edit profile',
  'Display name': () => 'Display name',
  Description: () => 'Description',
  'Thumbnail URL': () => 'Thumbnail URL',
  'Banner URL': () => 'Banner URL',
  editProfileWarning: () => 'Edit profile history cannot be deleted and your IP address is public.',

  // menu
  Home: () => 'Home',
  Profile: () => 'Profile',
  Search: () => 'Search',
  'Search user ID': () => 'Search user ID',
  Peers: () => 'Peers',
  'Connected peers posts': () => 'Connected peers posts',
  Stats: () => 'Stats',
  'Connected peers stats': () => 'Connected peers stats',
  'Connecting to peers': () => 'Connecting to peers',
  Following: () => 'Following',
  'Not following anyone': () => 'Not following anyone',
  Export: () => 'Export',
  Import: () => 'Import',

  // post
  'Uncensorable content': () => 'Uncensorable content',
  publishPostWarning: () => 'Posts cannot be deleted and your IP address is public.'
})

export default translation
