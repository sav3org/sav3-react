import {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useTranslation from 'src/translations/use-translation'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'
import Modal from 'src/components/modal'

const useStyles = makeStyles((theme) => ({
  errorMessage: {
    overflow: 'hidden'
  },
  content: {
    '& textarea': {
      overflow: 'hidden'
    },
    // remove text input variant borders
    '& fieldset': {
      border: 'none'
    }
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
  const [content, setContent] = useState('')
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

  const modalContent = (
    <div>
      <TextField
        autoFocus
        className={classes.content}
        onChange={handleChange}
        margin='dense'
        id='content'
        placeholder={t['Uncensorable content']()}
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
    </div>
  )

  const modalActions = (
    <div>
      <Button disableElevation variant='contained' onClick={handlePublish} color='primary'>
        SAV3
      </Button>
    </div>
  )

  return <Modal onClose={onClose} open={open} content={modalContent} actions={modalActions} />
}

PublishPostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default PublishPostModal
