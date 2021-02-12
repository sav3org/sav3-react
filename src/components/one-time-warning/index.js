import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme) => ({
  alert: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '& .MuiAlert-icon': {
      alignItems: 'center'
    }
  }
}))

export default function OneTimeWarning ({message} = {}) {
  const alreadyWarnedOneTime = !!localStorage.getItem(`oneTimeWarning-${message}`)
  const [open, setOpen] = useState(!alreadyWarnedOneTime)

  const handleClose = (event, reason) => {
    // don't close from click outside warning
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    // if warning goes away from auto close, show again later
    // otherwise never show again
    if (reason !== 'timeout') {
      localStorage.setItem(`oneTimeWarning-${message}`, true)
    }
  }

  const classes = useStyles()
  return (
    <Snackbar
      key={message}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={12000}
      onClose={handleClose}
      message={message}
    >
      <Alert className={classes.alert} elevation={6} variant='filled' onClose={handleClose} severity='warning'>
        {message}
      </Alert>
    </Snackbar>
  )
}
