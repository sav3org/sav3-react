import light from './themes/light'
import dark from './themes/dark'
import sav3Light from './themes/sav3-light'
import sav3Dark from './themes/sav3-dark'

const themes = {
  Light: light,
  Dark: dark,
  'SAV3 Light': sav3Light,
  'SAV3 Dark': sav3Dark
}
Object.freeze(themes)

export default themes
