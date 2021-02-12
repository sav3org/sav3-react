import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import {Link as RouterLink} from 'react-router-dom'
import WtfplIcon from 'src/components/icons/Wtfpl'
import config from 'src/config'

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

  const download = window.location.protocol !== 'file:' && 'sav3.html'

  return (
    <Box className={classes.root}>
      <Typography to='/page/what-is-sav3' className={classes.link} component={RouterLink} variant={variant}>
        What is SAV3?{' '}
      </Typography>
      <Typography to='/page/how-does-sav3-work' className={classes.link} component={RouterLink} variant={variant}>
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
      <Typography href='https://token.sav3.org' className={classes.link} component='a' target='_blank' rel='noopener' variant={variant}>
        Token{' '}
      </Typography>
      <Typography to='/page/license' className={classes.link} component={RouterLink} variant={variant}>
        Open source{' '}
        <span style={{whiteSpace: 'nowrap'}}>
          <WtfplIcon className={classes.icon} height={9} /> WTFPL
        </span>{' '}
      </Typography>
      <Typography href='' download={download} style={{whiteSpace: 'nowrap'}} component='a' className={classes.link} variant={variant}>
        Version {config.sav3Version}{' '}
      </Typography>
      <Typography
        href={`https://github.com/workingtim/sav3-test/tree/${config.gitCommitHash}`}
        style={{whiteSpace: 'nowrap'}}
        component='a'
        target='_blank'
        rel='noopener'
        className={classes.link}
        variant={variant}
      >
        Build {config.gitCommitHash}{' '}
      </Typography>
    </Box>
  )
}

export default FooterLinks
