import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import {Link as RouterLink} from 'react-router-dom'
import WtfplIcon from 'src/components/icons/Wtfpl'

// NOTE: for some reason the only way to make these links work is to add a {' '} before </Typography>
// and to make the margin right 0.75 instead of 1

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.hint,
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    },
    marginRight: theme.spacing(0.75)
  },
  text: {
    color: theme.palette.text.hint,
    marginRight: theme.spacing(0.75)
  },
  icon: {
    fontSize: '1rem',
    // center on the line
    transform: 'translateY(25%)'
  },
  root: {
    // the text container has inherent extra padding at the top that can't be removed
    marginTop: -6,
    // too bright
    opacity: 1 / 3
  }
}))

function FooterLinks () {
  const classes = useStyles()
  const variant = 'caption'

  return (
    <Box className={classes.root}>
      <Typography className={classes.link} component={RouterLink} variant={variant}>
        What is SAV3?{' '}
      </Typography>
      <Typography className={classes.link} component={RouterLink} variant={variant}>
        How does it work under the hood?{' '}
      </Typography>
      <Typography href='https://twitter.com/sav3org' className={classes.link} component='a' target='_blank' rel='noopener' variant={variant}>
        Twitter{' '}
      </Typography>
      <Typography href='https://t.me/sav3org' className={classes.link} component='a' target='_blank' rel='noopener' variant={variant}>
        Telegram{' '}
      </Typography>
      <Typography href='https://github.com/sav3org' className={classes.link} component='a' target='_blank' rel='noopener' variant={variant}>
        Github{' '}
      </Typography>
      <Typography href='https://sav3.org' className={classes.link} component='a' target='_blank' rel='noopener' variant={variant}>
        Token{' '}
      </Typography>
      <Typography className={classes.link} component={RouterLink} variant={variant}>
        Open source{' '}
        <span style={{whiteSpace: 'nowrap'}}>
          <WtfplIcon className={classes.icon} height={9} /> WTFPL
        </span>{' '}
      </Typography>
      <Typography style={{whiteSpace: 'nowrap'}} component={RouterLink} className={classes.link} variant={variant}>
        Build FKD3KDSF
      </Typography>
    </Box>
  )
}

export default FooterLinks
