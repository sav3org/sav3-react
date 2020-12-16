/* eslint-disable */

import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import {red} from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import useTranslation from 'src/translations/use-translation'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Feed from 'src/components/feed'
import useUserPosts from 'src/hooks/use-user-posts'
import useUserProfile from 'src/hooks/use-user-profile'

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    paddingTop: '33.25%', // approximately 200px height
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    position: 'absolute',
    // make avatar 25% of the middle col
    width: theme.sav3.layout.columns.middle.width.md / 4,
    height: theme.sav3.layout.columns.middle.width.md / 4,
    marginTop: theme.sav3.layout.columns.middle.width.md / -8,
    marginLeft: theme.spacing(2),
    borderWidth: theme.spacing(0.5),
    borderStyle: 'solid',
    borderColor: theme.palette.background.default,
    [theme.breakpoints.down(theme.sav3.layout.columns.middle.width.md)]: {
      width: '25vw',
      height: '25vw',
      marginTop: '-12.5vw',
      borderWidth: theme.spacing(0.25),
    },
  },
  profileName: {
    wordBreak: 'break-all',
  },
}))

/**
 * @param {object} props
 * @param {string} props.userCid
 * @returns {JSX.Element}
 */
function Profile({userCid} = {}) {
  const t = useTranslation()
  const classes = useStyles()
  const posts = useUserPosts(userCid)
  const profile = useUserProfile(userCid)
  console.log({posts, profile})

  let description = profile.description
  if (description && description.length > 140) {
    description = description.substring(0, 140)
  }

  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={classes.root}>
      <CardMedia className={classes.media} image={profile.bannerUrl} />
      <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
      <Box p={2} pb={0} display='flex' flexDirection='row-reverse'>
        <Button variant='outlined' size='large' color='primary'>
          {t['Follow']()}
        </Button>
        <IconButton aria-label='settings'>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <CardHeader className={classes.profileName} pb={0} title={profile.displayName} subheader={userCid} />
      <Box p={2} pt={0}>
        <Typography variant='body2'>{description}</Typography>
      </Box>

      <Feed posts={posts} />
    </div>
  )
}

export default Profile
