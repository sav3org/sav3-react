import merge from 'lodash.merge'
import defaultTranslation from './translations/en'

const createTranslation = (_translation) => {
  const translation = merge({}, defaultTranslation, _translation)
  return translation
}

export default createTranslation
