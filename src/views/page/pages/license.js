import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'

function License () {
  const history = useHistory()
  const variantBody = 'body2'
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
          DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
        </Typography>
      </TopBar>
      <div>
        <Box px={3}>
          <Box pb={spacing} />
          <Typography variant={variantBody}>Version 2, December 2004</Typography>
          <Box pb={spacing} />
          <Typography variant={variantBody}>Copyright (C) 2004 Sam Hocevar &#60;sam@hocevar.net&#62;</Typography>
          <Box pb={spacing} />
          <Typography variant={variantBody}>
            Everyone is permitted to copy and distribute verbatim or modified copies of this license document, and changing it is allowed as long as the name is changed.
          </Typography>
          <Box pb={spacing} />
          <Typography variant={variantBody}>DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION</Typography>
          <Box pb={spacing} />
          <Typography variant={variantBody}>0. You just DO WHAT THE FUCK YOU WANT TO.</Typography>
          <Box pb={spacing} />
        </Box>
      </div>
    </div>
  )
}

export default License
