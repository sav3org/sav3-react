import {useTheme} from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import {Tweet} from 'react-twitter-widgets'

// TODO: add language option to tweet

const Twitter = ({link}) => {
  const theme = useTheme()
  const dark = theme.palette.type === 'dark' ? 'dark' : undefined

  // negative margins because twitter script adds unwanted padding
  return (
    <Box style={{marginTop: -10, marginBottom: -10}} pt={1}>
      <Tweet options={{theme: dark}} tweetId='841418541026877441' />
    </Box>
  )
}
Twitter.propTypes = {link: PropTypes.string.isRequired}

export default Twitter
