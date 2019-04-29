import React from 'react'
import Part from './Part'

const Content = props => {
  return (
    <div>
      {props.parts.map(part =>
        <Part key={part.name} part={part} />
      )}
    </div>
  )
}

export default Content