import {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
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
  description: {
    '& textarea': {
      overflow: 'hidden'
    }
  },
  content: {
    '& input': {
      padding: theme.spacing(2),
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5)
    },
    '& label[data-shrink="false"]': {
      transform: 'translate(20px, 18px) scale(1)'
    },
    '& textarea': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5)
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
      setErrorMessage(null)
      onClose()
    }
    catch (e) {
      setErrorMessage(e.message)
    }
  }

  const content = (
    <Box pt={1} pb={1.5} className={classes.content}>
      <TextField onChange={handleChange} autoFocus margin='dense' id='displayName' label={t['Display name']()} fullWidth variant='outlined' value={profile.displayName || ''} />
      <TextField onChange={handleChange} margin='dense' id='thumbnailUrl' label={t['Thumbnail URL']()} fullWidth variant='outlined' value={profile.thumbnailUrl || ''} />
      <TextField onChange={handleChange} margin='dense' id='bannerUrl' label={t['Banner URL']()} fullWidth variant='outlined' value={profile.bannerUrl || ''} />
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
        value={profile.description || ''}
      />
      {errorMessage && (
        <Alert classes={{message: classes.errorMessage}} severity='error'>
          {errorMessage}
        </Alert>
      )}
    </Box>
  )

  const actions = (
    <div>
      <Button disableElevation variant='contained' onClick={handlePublish} color='primary'>
        SAV3
      </Button>
    </div>
  )

  return <Modal open={open} onClose={onClose} content={content} actions={actions} />
}

EditProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  previousProfile: PropTypes.object.isRequired
}

export default EditProfileModal
