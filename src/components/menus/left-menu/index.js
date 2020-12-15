import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'

const useStyles = makeStyles((theme) => ({
  text: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
}))

/**
 * @returns {JSX.Element}
 */
function LeftMenu () {
  const classes = useStyles()

  return (
    <div>
      <List>
        <ListItem>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='Inbox' className={classes.text} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary='Starred' className={classes.text} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='Send email' className={classes.text} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary='Drafts' className={classes.text} />
        </ListItem>
      </List>
    </div>
  )
}

export default LeftMenu
