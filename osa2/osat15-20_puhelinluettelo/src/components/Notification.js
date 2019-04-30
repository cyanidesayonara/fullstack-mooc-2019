import React from 'react'

const Notification = props => {
  if (props.notification === null) {
    return null
  }

  if (props.error) {
    return (
      <div className="error">
        {props.notification}
      </div>
    )
  }
  return (
    <div className="message">
      {props.notification}
    </div>
  )
}

export default Notification