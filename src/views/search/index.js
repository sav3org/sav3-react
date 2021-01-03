import {useState} from 'react'
import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import {useTheme, makeStyles} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AvatarDrawerMenuButton from 'src/components/menus/drawer/avatar-button'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import useTranslation from 'src/translations/use-translation'
import Profile from 'src/views/profile/components/profile'
import isIpfs from 'is-ipfs'

const useStyles = makeStyles((theme) => ({
  search: {
    height: theme.sav3.topBar.height / 1.5,
    '& fieldset': {
      border: 'none',
      backgroundColor: theme.palette.divider
    }
  }
}))

function Search () {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [userCid, setUserCid] = useState('')
  const t = useTranslation()

  const handleChange = (event) => {
    let userCid = event.target.value
    try {
      userCid = userCid.trim()
      setUserCid(userCid)
    }
    catch (e) {}
  }

  return (
    <div>
      <TopBar>
        <Box pl={fullScreen ? 2 : 4}>
          {fullScreen && (
            <Box pr={0.5}>
              <AvatarDrawerMenuButton />
            </Box>
          )}
        </Box>
        <Box width='100%' pl={0} pr={4}>
          <TextField
            onChange={handleChange}
            InputProps={{
              spellCheck: false,
              classes: {root: classes.search},
              startAdornment: (
                <Box pr={1}>
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                </Box>
              )
            }}
            variant='outlined'
            fullWidth
            placeholder={t['Search user ID']()}
            value={userCid}
          />
        </Box>
      </TopBar>
      {isIpfs.cid(userCid) && <Profile userCid={userCid} />}
    </div>
  )
}

export default Search
