import createTranslation from '../create-translation'

const translation = createTranslation({
  // profile
  Follow: () => 'Follow',
  'Edit profile': () => 'Edit profile',
  'Display name': () => 'Display name',
  Description: () => 'Description',
  'Thumbnail URL': () => 'Thumbnail URL',
  'Banner URL': () => 'Banner URL',
  editProfileWarning: () => 'Edit profile history cannot be deleted and your IP address is public.',

  // menu
  Home: () => 'Home',
  Profile: () => 'Profile',

  // post
  'Uncensorable content': () => 'Uncensorable content',
  publishPostWarning: () => 'Posts cannot be deleted and your IP address is public.'
})

export default translation
