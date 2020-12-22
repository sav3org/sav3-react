import {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useTranslation from 'src/translations/use-translation'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import Alert from '@material-ui/lab/Alert'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import useUserProfile from 'src/hooks/use-user-profile'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import Avatar from '@material-ui/core/Avatar'

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
    },
    '& .MuiInputBase-root': {
      paddingLeft: 0,
      paddingRight: 0
    },
    marginBottom: theme.spacing(1)
  },
  contentInput: {
    paddingTop: 0,
    paddingBottom: 0
  },
  avatar: {
    // slightly higher placement than the user name seems more pleasing
    marginTop: theme.spacing(-0.25),
    width: theme.spacing(6),
    height: theme.spacing(6),
    // borders
    borderWidth: theme.sav3.borderWidth,
    borderStyle: 'solid',
    borderColor: theme.sav3.borderColor
  }
}))

/**
 * @returns {JSX.Element}
 */
function PublishPostForm () {
  const t = useTranslation()
  const classes = useStyles()
  const theme = useTheme()
  const userCid = useOwnUserCid()
  const profile = useUserProfile(userCid)

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
      setContent('')
    }
    catch (e) {
      setErrorMessage(e.message)
    }
  }

  const modalActions = (
    <div>
      <Box>
        <Divider />
      </Box>
      <Box alignItems='center' display='flex' height={theme.sav3.topBar.height}>
        <Box flexGrow={1}></Box>
        <Button disableElevation variant='contained' onClick={handlePublish} color='primary'>
          SAV3
        </Button>
      </Box>
    </div>
  )

  return (
    <Box px={2} display='flex'>
      {/* left col avatar */}
      <Box pr={1.5} py={1.5}>
        <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
      </Box>

      <Box pt={1} width='100%'>
        <TextField className={classes.content} onChange={handleChange} margin='dense' id='content' placeholder={t['Uncensorable content']()} fullWidth multiline variant='outlined' value={content} />
        {errorMessage && (
          <Box py={1}>
            <Alert classes={{message: classes.errorMessage}} severity='error'>
              {errorMessage}
            </Alert>
          </Box>
        )}

        {modalActions}
      </Box>
    </Box>
  )
}

PublishPostForm.propTypes = {}

export default PublishPostForm
