import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AvatarDrawerMenuButton from 'src/components/menus/drawer/avatar-button'
import Feed from 'src/components/feeds/posts'
import useFollowingOnce from 'src/hooks/following/use-following-once'
import useUsersPosts from 'src/hooks/use-users-posts'
import ImportForm from './components/form'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTranslation from 'src/translations/use-translation'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import Divider from '@material-ui/core/Divider'

/**
 * @returns {JSX.Element}
 */
function Export () {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const t = useTranslation()

  return (
    <div>
      <TopBar>
        {fullScreen && (
          <Box pl={2} pr={1}>
            <AvatarDrawerMenuButton />
          </Box>
        )}
        <Box pl={2}>
          <Typography noWrap variant='h6'>
            {t.Import()} / {t.Export()}
          </Typography>
        </Box>
      </TopBar>
      <ImportForm />
    </div>
  )
}

export default Export
