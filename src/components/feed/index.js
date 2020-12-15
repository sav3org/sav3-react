import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Post from 'src/components/post'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
  root: {}
}))

/**
 * @returns {JSX.Element}
 */
function Feed () {
  const classes = useStyles()
  const posts = []

  let postCount = 10
  while (postCount--) {
    posts.push(<Divider key={postCount + 'divider'} />)
    posts.push(<Post key={postCount} />)
  }
  posts.push(<Divider key='final divider' />)

  return <div className={classes.root}>{posts}</div>
}

export default Feed
