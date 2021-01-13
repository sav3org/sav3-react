import React from 'react'
import Post from 'src/components/post'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'

function PostsFeed ({posts, next, hasMore} = {}) {
  const postComponents = []

  for (const post of posts) {
    postComponents.push(
      <div key={post.contentCid + post.timestamp}>
        <Post post={post} />
        <Divider />
      </div>
    )
  }

  return (
    <InfiniteScroll
      dataLength={postComponents.length}
      // scrollThreshold='400px'
      next={next}
      hasMore={hasMore}
      loader={
        <Box width='100%' p={2} justifyContent='center' display='flex' style={{overflow: 'hidden'}}>
          <CircularProgress size={24} />
        </Box>
      }
    >
      {postComponents}
    </InfiniteScroll>
  )
}

PostsFeed.propTypes = {
  posts: PropTypes.array.isRequired,
  next: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired
}

export default PostsFeed
