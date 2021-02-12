import {LanguageCodeContext} from 'src/translations/language-code-provider'
import {useContext} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import translations from 'src/translations'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  switcher: {
    fontSize: '0.8rem',
    '& .MuiSelect-root': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    // fix bug with select with only 2 letter text
    '& fieldset': {
      padding: 0
    }
  }
}))

function TranslationSwitcher () {
  const classes = useStyles()
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
    <Select className={classes.switcher} value={languageCode} onChange={handleTranslationChange} label='Translation' variant='outlined'>
      {translationMenuItems}
    </Select>
  )
}

export default TranslationSwitcher
