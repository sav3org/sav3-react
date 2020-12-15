import {useContext} from 'react'
import {LanguageCodeContext} from './language-code-provider'

const useLanguageCode = () => {
  const {languageCode} = useContext(LanguageCodeContext)
  return languageCode
}

export default useLanguageCode
