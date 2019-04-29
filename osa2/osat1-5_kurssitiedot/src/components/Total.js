import React from 'react'

const Total = props => {
  const sum = props.parts.reduce((total, current) => {
    return total + current.exercises
  }, 0)

  return (
    <p>
      yhteensä {sum} tehtävää
    </p>
  )
}

export default Total