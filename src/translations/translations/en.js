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

  // menu
  Home: () => 'Home',
  Profile: () => 'Profile',
  Search: () => 'Search',
  'Search user ID': () => 'Search user ID',
  Peers: () => 'Peers',
  'Connected peers': () => 'Connected peers',
  'Connecting to peers': () => 'Connecting to peers',
  Following: () => 'Following',
  'Not following anyone': () => 'Not following anyone',
  Export: () => 'Export',
  Import: () => 'Import',
  Feed: () => 'Feed',

  // post
  'Uncensorable content': () => 'Uncensorable content',
  Post: () => 'Post',
  'Copied to clipboard': () => 'Copied to clipboard',
  Share: () => 'Share',

  // global
  'URL expired': () => 'URL expired'
})

export default translation
