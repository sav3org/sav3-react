import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AccountCircle from '@material-ui/icons/AccountCircle'
import GroupIcon from '@material-ui/icons/Group'
import {Link as RouterLink} from 'react-router-dom'
import useTranslation from 'src/translations/use-translation'
import ThemeSwitcher from 'src/components/theme-switcher'
import TranslationSwitcher from 'src/components/translation-switcher'

const useStyles = makeStyles((theme) => ({
  text: {},
  root: {
    width: theme.sav3.drawerMenu.width
  }
}))

function HomeMenu () {
  const classes = useStyles()
  const t = useTranslation()

  return (
    <div className={classes.root}>
      <List>
        <ListItem button component={RouterLink} to='/following'>
          <ListItemIcon>
            <GroupIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText primary={t.Following()} className={classes.text} />
        </ListItem>
        {/* temporarily added to bottom menu
        <ListItem button component={RouterLink} to='/peers'>
          <ListItemIcon>
            <PeersIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText primary={t.Peers()} className={classes.text} />
        </ListItem>
        <ListItem button component={RouterLink} to='/stats'>
          <ListItemIcon>
            <BarChartIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText primary={t.Stats()} className={classes.text} />
        </ListItem>
        */}
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
