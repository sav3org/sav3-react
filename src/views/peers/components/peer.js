import {makeStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import prettyBytes from 'pretty-bytes'

const useStyles = makeStyles((theme) => ({
  avatar: {
    // slightly higher placement than the user name seems more pleasing
    marginTop: theme.spacing(-0.25),
    width: theme.spacing(6),
    height: theme.spacing(6),
    // borders
    borderWidth: theme.sav3.borderWidth,
    borderStyle: 'solid',
    borderColor: theme.sav3.borderColor,
    backgroundColor: theme.palette.background.default
  },
  userCid: {
    wordBreak: 'break-all'
  }
}))

function Peer ({peer} = {}) {
  const classes = useStyles()

  return (
    <div>
      <Box px={2} py={1.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar className={classes.avatar}>{peer.countryFlagEmoji}</Avatar>
        </Box>

        {/* right col header + content + bottom actions */}
        <Box width='100%'>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                <Typography variant='subtitle2'>
                  {peer.ip}:{peer.port}
                </Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='textSecondary' className={classes.userCid}>
                  {peer.peerCid}
                </Typography>
              </Box>
            </Box>
            {/* add some height so it looks better */}
            <Box height={48} />
          </Box>

          {/* content */}
          <Typography variant='body2'>
            ⬆️{prettyBytes(peer.dataSent)}&nbsp;&nbsp;⬇️{prettyBytes(peer.dataReceived)}
          </Typography>
        </Box>
      </Box>
    </div>
  )
}

export default Peer
