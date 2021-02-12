import {useState, createContext} from 'react'
import translations from './index'

export const LanguageCodeContext = createContext({
  languageCode: 'en',
  setLanguageCode: null
})

const LanguageCodeProvider = (props) => {
  const defaultLanguageCode = 'en'
  const preferredLanguageCode = window.navigator.language
  let localStorageLanguageCode = localStorage.getItem('languageCode') || preferredLanguageCode || defaultLanguageCode
  if (!translations[localStorageLanguageCode]) {
    const localStorageLanguageCodeWithoutCountryCode = getLanguageCodeWithoutCountryCode(localStorageLanguageCode)
    if (!translations[localStorageLanguageCodeWithoutCountryCode]) {
      console.warn(`no available translation for '${localStorageLanguageCode}' and '${localStorageLanguageCodeWithoutCountryCode}'`)
      localStorageLanguageCode = defaultLanguageCode
    }
    else {
      localStorageLanguageCode = localStorageLanguageCodeWithoutCountryCode
    }
  }

  const [languageCode, _setLanguageCode] = useState(localStorageLanguageCode)

  const setLanguageCode = (languageCode) => {
    const languageCodeWithoutCountryCode = getLanguageCodeWithoutCountryCode(languageCode)
    if (!translations[languageCode]) {
      if (!translations[languageCodeWithoutCountryCode]) {
        console.warn(`no available translation for '${languageCode}' and '${languageCodeWithoutCountryCode}'`)
        return
      }
      else {
        // language code is available but not with country code
        languageCode = languageCodeWithoutCountryCode
      }
    }
    localStorage.setItem('languageCode', languageCode)
    _setLanguageCode(languageCode)
  }

  const contextValue = {
    languageCode,
    setLanguageCode
  }

  const {children} = props
  return <LanguageCodeContext.Provider value={contextValue}>{children}</LanguageCodeContext.Provider>
}

const getLanguageCodeWithoutCountryCode = (languageCode) => languageCode.replace(/-.+/, '')

export default LanguageCodeProvider
