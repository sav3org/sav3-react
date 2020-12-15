import merge from 'lodash.merge'
import defaultTranslation from './translations/en-us'

const createTranslation = (_translation) => {
  const translation = merge({}, defaultTranslation, _translation)
  return translation
}

export default createTranslation
