import React from 'react'
import Button from './Button'

const Feedback = props => {
  return (
    <div>
      <h1>
        anna palautetta
      </h1>
      {props.buttons.map(button =>
        <Button key={button.text} setter={() => button.setter(button.value + 1)} text={button.text} />
      )}
    </div>
  )
}

export default Feedback