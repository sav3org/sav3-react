import {useState, Fragment} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useTranslation from 'src/translations/use-translation'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'
import Modal from 'src/components/modal'
import useUserProfile from 'src/hooks/use-user-profile'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

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
    marginBottom: theme.spacing(1),
    '& .MuiInputBase-root': {
      paddingLeft: theme.spacing(1)
    }
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
  },
  userCid: {
    wordBreak: 'break-all'
  },
  parentPostLine: {
    margin: 'auto',
    width: 2
  }
}))

function PublishPostModal ({open, onClose, parentPost} = {}) {
  const t = useTranslation()
  const classes = useStyles()
  const [content, setContent] = useState('')
  const [errorMessage, setErrorMessage] = useState()

  const userCid = useOwnUserCid()
  const profile = useUserProfile(userCid)

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
    const parentPostCid = parentPost && parentPost.cid

    try {
      await sav3Ipfs.publishPost({content, parentPostCid})
      setErrorMessage(null)
      setContent('')
      onClose()
    }
    catch (e) {
      setErrorMessage(e.message)
    }
  }

  const modalContent = (
    <Fragment>
      {parentPost && <ParentPost parentPost={parentPost} />}
      <Box display='flex'>
        <Box pr={1} py={1.5}>
          <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
        </Box>
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
      </Box>
    </Fragment>
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
  onClose: PropTypes.func.isRequired,
  parentPost: PropTypes.object
}

function ParentPost ({parentPost} = {}) {
  const classes = useStyles()
  return (
    <Box display='flex' mb={1}>
      <Box pr={1} py={1.5}>
        <Avatar src={parentPost.profile.thumbnailUrl} className={classes.avatar} />
        <Divider className={classes.parentPostLine} orientation='vertical' />
      </Box>
      <Box pt={1.5} pl={0.5} flexGrow={1}>
        {parentPost.profile.displayName && <Typography variant='subtitle2'>{parentPost.profile.displayName}</Typography>}
        <Typography variant='caption' color='textSecondary' className={classes.userCid}>
          {parentPost.userCid}
        </Typography>
        <Typography variant='body2'>{parentPost.content}</Typography>
      </Box>
    </Box>
  )
}

export default PublishPostModal
