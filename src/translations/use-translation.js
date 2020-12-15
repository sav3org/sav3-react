import {useContext} from 'react'
import {LanguageCodeContext} from './language-code-provider'
import translations from './index'

const useTranslation = () => {
  const {languageCode} = useContext(LanguageCodeContext)
  return translations[languageCode]
}

export default useTranslation
