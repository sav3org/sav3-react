import {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import useTranslation from 'src/translations/use-translation'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  errorMessage: {
    overflow: 'hidden'
  },
  content: {
    '& textarea': {
      overflow: 'hidden'
    }
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 0
  },
  buttonContainer: {
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(2)
  }
}))

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @returns {JSX.Element}
 */
function PublishPostModal ({open, onClose}) {
  const t = useTranslation()
  const classes = useStyles()
  const [content, setContent] = useState()
  const [errorMessage, setErrorMessage] = useState()

  const handleChange = (event) => {
    let content = event.target.value
    try {
      if (content.length > 140) {
        content = content.subtring(0, 140)
      }
      setContent(content)
    }
    catch (e) {}
  }

  const handlePublish = async () => {
    try {
      await sav3Ipfs.publishPost({content})
      setErrorMessage(null)
      setContent(null)
      onClose()
    }
    catch (e) {
      setErrorMessage(e.message)
    }
  }

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open} onClose={onClose}>
      <Box pl={2} pt={1}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent className={classes.contentContainer}>
        <TextField
          className={classes.content}
          onChange={handleChange}
          margin='dense'
          id='content'
          label={t['Uncensorable content']()}
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          value={content}
        />
        {errorMessage && (
          <Alert classes={{message: classes.errorMessage}} severity='error'>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions className={classes.buttonContainer}>
        <Button disableElevation variant='contained' onClick={handlePublish} color='primary'>
          SAV3
        </Button>
      </DialogActions>
    </Dialog>
  )
}

PublishPostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default PublishPostModal
