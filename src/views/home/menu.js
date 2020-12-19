import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AccountCircle from '@material-ui/icons/AccountCircle'
import {Link as RouterLink} from 'react-router-dom'
import useTranslation from 'src/translations/use-translation'
import ThemeSwitcher from 'src/components/theme-switcher'
import TranslationSwitcher from 'src/components/translation-switcher'

const useStyles = makeStyles((theme) => ({
  text: {},
  root: {
    width: 280
  }
}))

/**
 * @returns {JSX.Element}
 */
function HomeMenu () {
  const classes = useStyles()
  const t = useTranslation()

  return (
    <div className={classes.root}>
      <List>
        <ListItem button component={RouterLink} to='/profile'>
          <ListItemIcon>
            <AccountCircle fontSize='large' />
          </ListItemIcon>
          <ListItemText primary={t.Profile()} className={classes.text} />
        </ListItem>
        <ListItem>
          <ThemeSwitcher />
          <TranslationSwitcher />
        </ListItem>
      </List>
    </div>
  )
}

export default HomeMenu
