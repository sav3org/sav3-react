import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'

function WhatIsSav3 () {
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
          What is SAV3?
        </Typography>
      </TopBar>
      <div>
        <Box px={3}>
          <Box pb={spacing} />
          <Typography variant={variantBody}>SAV3 is an experimental uncensorable platform with no CEO, no servers, and no content policy, with one objective: save the world.</Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>How does it deal with spam/illegal content?</Typography>
          <Typography variant={variantBody}>By only showing you content from users you save, and users they also save.</Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>How does it deal with illegal media?</Typography>
          <Typography variant={variantBody}>By storing text only, it doesn't store any media.</Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>How does it deal with content discovery?</Typography>
          <Typography variant={variantBody}>If you are a new user saving no one, it suggests users to save from a list voted by the governance SAV3 holders.</Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>How does it deal with app store bans?</Typography>
          <Typography variant={variantBody}>By not having an official app, it works in the browser through WebRTC.</Typography>
          <Box pb={spacing} />
          <Typography variant={variantHeading}>How does it deal with DMCA requests and domain confiscation?</Typography>
          <Typography variant={variantBody}>By being a single HTML page with no content/servers that you can save as and run locally or mirror.</Typography>
        </Box>
      </div>
    </div>
  )
}

export default WhatIsSav3
