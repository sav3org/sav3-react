import {makeStyles} from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'

const Audio = ({link}) => {
  return (
    <Box pt={1}>
      <Card variant='outlined'>
        <CardMedia controls component='audio' image={link} />
      </Card>
    </Box>
  )
}
Audio.propTypes = {link: PropTypes.string.isRequired}

export default Audio
