import {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useTranslation from 'src/translations/use-translation'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  errorMessage: {
    overflow: 'hidden'
  },
  description: {
    '& textarea': {
      overflow: 'hidden'
    }
  }
}))

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {object} props.previousProfile
 * @returns {JSX.Element}
 */
function EditProfileModal ({open, onClose, previousProfile}) {
  const t = useTranslation()
  const classes = useStyles()
  const [profile, setProfile] = useState(previousProfile)
  const [errorMessage, setErrorMessage] = useState()

  // set previous profile once
  useEffect(() => {
    setProfile(previousProfile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(previousProfile)])

  const handleChange = (event) => {
    const {id, value} = event.target
    const newProfile = {...profile, [id]: value}
    setProfile(newProfile)
  }

  const handlePublish = async () => {
    try {
      await sav3Ipfs.editUserProfile(profile)
      setErrorMessage()
      onClose()
    }
    catch (e) {
      setErrorMessage(e.message)
    }
  }

  // console.log('EditProfileModal', {open, onClose, profile, previousProfile})

  return (
    <Dialog maxWidth='xs' open={open} onClose={onClose}>
      <DialogTitle>{t['Edit profile']()}</DialogTitle>
      <DialogContent>
        {/* maybe add some help text here later
        <DialogContentText>
        </DialogContentText>
        */}
        <TextField onChange={handleChange} autoFocus margin='dense' id='displayName' label={t['Display name']()} fullWidth variant='outlined' value={profile.displayName} />
        <TextField onChange={handleChange} margin='dense' id='thumbnailUrl' label={t['Thumbnail URL']()} fullWidth variant='outlined' value={profile.thumbnailUrl} />
        <TextField onChange={handleChange} margin='dense' id='bannerUrl' label={t['Banner URL']()} fullWidth variant='outlined' value={profile.bannerUrl} />
        <TextField
          className={classes.description}
          onChange={handleChange}
          margin='dense'
          id='description'
          label={t.Description()}
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          value={profile.description}
        />
        {errorMessage && (
          <Alert classes={{message: classes.errorMessage}} severity='error'>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          {t.Cancel()}
        </Button>
        <Button onClick={handlePublish} color='primary'>
          {t.Publish()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EditProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  previousProfile: PropTypes.object.isRequired
}

export default EditProfileModal
