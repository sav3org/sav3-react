import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Post from 'src/components/post'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
  root: {}
}))

/**
 * @param {object} props
 * @param {string} props.posts
 * @returns {JSX.Element}
 */
function Feed ({posts} = {}) {
  const classes = useStyles()
  const postComponents = []

  for (const post of posts) {
    postComponents.push(<Divider key={post.contentCid + post.timestamp + 'feed divider'} />)
    postComponents.push(<Post post={post} key={post.contentCid + post.timestamp} />)
  }
  postComponents.push(<Divider key='last feed divider' />)

  return <div className={classes.root}>{postComponents}</div>
}

export default Feed
