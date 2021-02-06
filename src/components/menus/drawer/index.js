import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import BarChartIcon from '@material-ui/icons/BarChart'
import AccountCircle from '@material-ui/icons/AccountCircle'
import GroupIcon from '@material-ui/icons/Group'
import {Link as RouterLink} from 'react-router-dom'
import useTranslation from 'src/translations/use-translation'
import ThemeSwitcher from 'src/components/theme-switcher'
import TranslationSwitcher from 'src/components/translation-switcher'
import FooterLinks from 'src/components/footer/links'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  text: {},
  root: {
    width: theme.sav3.drawerMenu.width,
    height: '100vh'
  }
}))

function HomeMenu () {
  const classes = useStyles()
  const t = useTranslation()

  return (
    <Box display='flex' flexDirection='column' className={classes.root}>
      <List>
        <ListItem button component={RouterLink} to='/following'>
          <ListItemIcon>
            <GroupIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText primary={t.Following()} className={classes.text} />
        </ListItem>
        <ListItem button component={RouterLink} to='/stats'>
          <ListItemIcon>
            <BarChartIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText primary={t.Stats()} className={classes.text} />
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
      </List>
      <Box style={{opacity: 0.75}} mx={2} mb={2.1}>
        <ThemeSwitcher />
        <TranslationSwitcher />
      </Box>
      <Box mx={2} mr={4} mb={2}>
        <FooterLinks />
      </Box>
    </Box>
  )
}

export default HomeMenu
