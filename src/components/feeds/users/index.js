import React from 'react'
import User from './user'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'

/**
 * @param {object} props
 * @param {string} props.users
 * @returns {JSX.Element}
 */
function UsersFeed ({users} = {}) {
  const userComponents = []

  for (const user of users) {
    userComponents.push(<User user={user} key={user.cid} />)
    userComponents.push(<Divider key={user.cid + 'feed divider'} />)
  }

  return <div>{userComponents}</div>
}

UsersFeed.propTypes = {
  users: PropTypes.array.isRequired
}

export default UsersFeed
