import {LanguageCodeContext} from 'src/translations/language-code-provider'
import {useContext} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import translations from 'src/translations'

function TranslationSwitcher () {
  const {languageCode, setLanguageCode} = useContext(LanguageCodeContext)
  const handleTranslationChange = (event) => {
    setLanguageCode(event.target.value)
  }
  const translationMenuItems = []
  for (const translationName in translations) {
    translationMenuItems.push(
      <MenuItem key={translationName} value={translationName}>
        {translationName}
      </MenuItem>
    )
  }

  return (
    <Select value={languageCode} onChange={handleTranslationChange} label='Translation' variant='outlined'>
      {translationMenuItems}
    </Select>
  )
}

export default TranslationSwitcher
