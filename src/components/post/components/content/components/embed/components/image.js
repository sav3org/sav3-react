import {makeStyles} from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  imgMedia: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  }
}))

const Image = ({link}) => {
  const classes = useStyles()
  return (
    <Box pt={1}>
      <Card variant='outlined'>
        <CardMedia className={classes.imgMedia} image={link} />
      </Card>
    </Box>
  )
}
Image.propTypes = {link: PropTypes.string.isRequired}

export default Image
