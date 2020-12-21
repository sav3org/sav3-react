import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AvatarDrawerMenuButton from 'src/components/menus/drawer-menu/avatar-button'

/**
 * @returns {JSX.Element}
 */
function Home () {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

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
            Home
          </Typography>
        </Box>
      </TopBar>
    </div>
  )
}

export default Home
