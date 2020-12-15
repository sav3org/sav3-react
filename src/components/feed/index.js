import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Post from 'src/components/post'

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
    posts.push(<Post key={postCount} />)
  }

  return <div className={classes.root}>{posts}</div>
}

export default Feed
