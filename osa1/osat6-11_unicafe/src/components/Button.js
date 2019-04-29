import React from 'react'

const Button = props => {
  return (
    <button onClick={() => props.setter()}>{props.text}</button>
  )
}

export default Button