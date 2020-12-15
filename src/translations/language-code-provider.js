import React, {useState} from 'react'
import translations from './index'

export const LanguageCodeContext = React.createContext({
  languageCode: 'en-US',
  setLanguageCode: null
})

const LanguageCodeProvider = (props) => {
  const defaultLanguageCode = 'en-US'
  const preferredLanguageCode = window.navigator.language
  let localStorageLanguageCode = localStorage.getItem('languageCode') || preferredLanguageCode || defaultLanguageCode
  if (!translations[localStorageLanguageCode]) {
    console.warn(`no available translation for '${localStorageLanguageCode}'`)
    localStorageLanguageCode = defaultLanguageCode
  }

  // State to hold the selected languageCode
  const [languageCode, _setLanguageCode] = useState(localStorageLanguageCode)

  // Wrap _setLanguageCode to store new languageCode in localStorage
  const setLanguageCode = (languageCode) => {
    if (!translations[languageCode]) {
      console.warn(`no available translation for '${languageCode}'`)
      return
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

export default LanguageCodeProvider
