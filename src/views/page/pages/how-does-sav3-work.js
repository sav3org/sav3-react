import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'

function HowDoesSav3Work () {
  const history = useHistory()
  const variantBody = 'body2'
  const variantHeading = 'subtitle2'
  const spacing = 2

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          How does SAV3 work?
        </Typography>
      </TopBar>
      <div>
        <Box px={3}>
          <Box pb={spacing} />
          <Typography variant={variantBody}>
            SAV3 is built using{' '}
            <Link variant={variantBody} href='https://en.wikipedia.org/wiki/InterPlanetary_File_System' target='_blank' rel='noopener'>
              IPFS
            </Link>
            .
          </Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>Where is content hosted?</Typography>
          <Typography variant={variantBody}>There are no servers. All content is stored in each user's browser cache.</Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>How do peers connect to each other to download content in the browser?</Typography>
          <Typography variant={variantBody}>
            By using{' '}
            <Link variant={variantBody} href='https://en.wikipedia.org/wiki/WebRTC' target='_blank' rel='noopener'>
              WebRTC
            </Link>{' '}
            and a{' '}
            <Link variant={variantBody} href='https://www.npmjs.com/package/libp2p-webrtc-star' target='_blank' rel='noopener'>
              signaling server
            </Link>{' '}
            which trustlessly (and end-to-end encrypted) tells peers what IP, port and protocol to use to connect to each other.
          </Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>What are SAV3 accounts/users/profiles?</Typography>
          <Typography variant={variantBody}>
            A SAV3 user is a private/public key pair. Query the IPFS{' '}
            <Link variant={variantBody} href='https://docs.ipfs.io/concepts/dht/' target='_blank' rel='noopener'>
              DHT
            </Link>{' '}
            for a public key and get the latest content published (and signed) by the private key using{' '}
            <Link variant={variantBody} href='https://docs.ipfs.io/concepts/ipns/' target='_blank' rel='noopener'>
              IPNS
            </Link>
            .
          </Typography>
        </Box>
      </div>
    </div>
  )
}

export default HowDoesSav3Work
