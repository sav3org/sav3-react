import React from 'react'
import Post from 'src/components/post'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'

function PostsFeed ({posts} = {}) {
  const postComponents = []

  for (const post of posts) {
    postComponents.push(<Post post={post} key={post.contentCid + post.timestamp} />)
    postComponents.push(<Divider key={post.contentCid + post.timestamp + 'feed divider'} />)
  }

  return <div>{postComponents}</div>
}

PostsFeed.propTypes = {
  posts: PropTypes.array.isRequired
}

export default PostsFeed
