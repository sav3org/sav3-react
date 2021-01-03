import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden'
  }
}))

function Modal ({open, onClose, content, actions} = {}) {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog fullScreen={fullScreen} fullWidth={true} maxWidth='xs' open={open} onClose={onClose}>
      <Box alignItems='center' display='flex' px={2} height={theme.sav3.topBar.height}>
        <Box flexGrow={1}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {fullScreen && <Box px={1}>{actions}</Box>}
      </Box>
      <Divider />
      <DialogContent className={classes.content}>{content}</DialogContent>
      {!fullScreen && (
        <div>
          <Divider />
          <Box alignItems='center' display='flex' px={3} height={theme.sav3.topBar.height}>
            <Box flexGrow={1}></Box>
            <Box>{actions}</Box>
          </Box>
        </div>
      )}
    </Dialog>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.element.isRequired,
  actions: PropTypes.element.isRequired
}

export default Modal
