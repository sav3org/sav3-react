import {makeStyles} from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'

const Video = ({link}) => {
  return (
    <Box pt={1}>
      <Card variant='outlined'>
        <CardMedia controls autoPlay muted component='video' image={link} />
      </Card>
    </Box>
  )
}
Video.propTypes = {link: PropTypes.string.isRequired}

export default Video
