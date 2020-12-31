import {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useTranslation from 'src/translations/use-translation'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import Alert from '@material-ui/lab/Alert'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import useFollowing from 'src/hooks/following/use-following'
import followManager from 'src/lib/follow-manager'

const useStyles = makeStyles((theme) => ({
  message: {
    overflow: 'hidden'
  },
  data: {
    '& textarea': {
      fontFamily: 'Monospace',
      minHeight: '10vh',
      maxHeight: '40vh',
      overflowY: 'scroll!important'
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
  }
}))

function ImportForm () {
  const t = useTranslation()
  const classes = useStyles()
  const theme = useTheme()
  const [, setFollowing] = useFollowing()

  const [data, setData] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()

  const handleChange = (event) => {
    const data = event.target.value
    setData(data)
  }

  const handleFocus = (event) => {
    // throws for unknown reason sometimes
    try {
      event.target.setSelectionRange(0, event.target.value.length)
    }
    catch (e) {}
  }

  const handleExport = async () => {
    setData('Exporting...')
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const following = await followManager.getAllFollowing()
      const privateKey = await sav3Ipfs.getPrivateKey()
      console.log({privateKey})
      const data = JSON.stringify({privateKey, following})
      setErrorMessage(null)
      setData(data)
    }
    catch (e) {
      setErrorMessage(e.message)
    }
    setSuccessMessage('Export successful. Copy paste your data somewhere safe.')
  }

  const handleImport = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    let dataObject

    // validate json
    try {
      dataObject = JSON.parse(data)
    }
    catch (e) {
      setErrorMessage(`Invalid JSON: ${e.message}`)
      return
    }

    // validate confirm
    const confirmMessage = 'Did you backup your data? Importing will irreversibly delete it. Click import again to confirm.'
    if (errorMessage !== confirmMessage) {
      setErrorMessage(confirmMessage)
      return
    }

    // validate following
    try {
      // use follow manager to validate because setFollowing is a react hook that doesnt validate
      await followManager.setAllFollowing(dataObject.following)
      setFollowing(dataObject.following)
    }
    catch (e) {
      setErrorMessage(`Invalid following: ${e.message}`)
      return
    }

    // validate private key
    try {
      // use follow manager to validate because setFollowing is a react hook that doesnt validate
      await followManager.setAllFollowing(dataObject.following)
      setFollowing(dataObject.following)
    }
    catch (e) {
      setErrorMessage(`Invalid privateKey: ${e.message}`)
      return
    }

    setErrorMessage(null)
    setSuccessMessage('Import successful.')
  }

  const modalActions = (
    <div>
      <Box>
        <Divider />
      </Box>
      <Box alignItems='center' display='flex' height={theme.sav3.topBar.height}>
        <Box flexGrow={1}></Box>
        <Button disableElevation variant='contained' onClick={handleImport} color='primary'>
          {t.Import()}
        </Button>
        <Box pr={0.5}></Box>
        <Button disableElevation variant='contained' onClick={handleExport} color='primary'>
          {t.Export()}
        </Button>
      </Box>
    </div>
  )

  return (
    <Box px={2} display='flex'>
      <Box pt={0} width='100%'>
        <TextField
          onClick={handleFocus}
          onFocus={handleFocus}
          className={classes.data}
          onChange={handleChange}
          margin='dense'
          id='data'
          placeholder='Paste exported data here...'
          fullWidth
          multiline
          variant='outlined'
          value={data}
        />
        {errorMessage && (
          <Box pb={1}>
            <Alert classes={{message: classes.message}} severity='error'>
              {errorMessage}
            </Alert>
          </Box>
        )}
        {successMessage && (
          <Box pb={1}>
            <Alert classes={{message: classes.message}} severity='success'>
              {successMessage}
            </Alert>
          </Box>
        )}
        <Box pb={0} />
        {modalActions}
      </Box>
    </Box>
  )
}

export default ImportForm
