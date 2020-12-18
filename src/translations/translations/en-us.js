import createTranslation from '../create-translation'

const translation = createTranslation({
  // profile
  Follow: () => 'Follow',
  'Edit profile': () => 'Edit profile',
  'Display name': () => 'Display name',
  Description: () => 'Description',
  'Thumbnail URL': () => 'Thumbnail URL',
  'Banner URL': () => 'Banner URL',
  Cancel: () => 'Cancel',
  Publish: () => 'Publish',

  // menu
  Home: () => 'Home',
  Profile: () => 'Profile'
})

export default translation
