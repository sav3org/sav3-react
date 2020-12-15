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
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
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
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  userCid: {
    wordBreak: 'break-all',
  },
}))

function Post() {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  let mediaSrc
  if (Math.random() > 0.5) {
    mediaSrc = 'https://i.imgur.com/DWCOaz9.jpeg'
  }

  return (
    <div>
      <Box px={2} py={1.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar src='https://i.imgur.com/Jkua4yg.jpeg' className={classes.avatar} />
        </Box>

        {/* right col header + content + bottom actions */}
        <Box>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                <Typography variant='subtitle2'>John M</Typography>
                {' - '}
                <Typography variant='subtitle2'>20h</Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='textSecondary' className={classes.userCid}>
                  Qma9T5YraSnpRDZqRR4krcSJabThc8nwZuJV3LercPHufi
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* content */}
          <Box>
            <Typography variant='body2'>
              This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.
            </Typography>
            {mediaSrc && <CardMedia className={classes.media} image={mediaSrc} />}
          </Box>

          {/* actions */}
          <CardActions disableSpacing>
            <IconButton aria-label='add to favorites'>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label='share'>
              <ShareIcon />
            </IconButton>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.</Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more.
                (Discard any mussels that don’t open.)
              </Typography>
              <Typography>Set aside off of the heat to let rest for 10 minutes, and then serve.</Typography>
            </CardContent>
          </Collapse>
        </Box>
      </Box>
    </div>
  )
}

export default Post
