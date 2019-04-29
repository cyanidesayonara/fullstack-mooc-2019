import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Feedback from './components/Feedback'
import Statistics from './components/Statistics'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const buttons = [
    {
      text: 'hyvä',
      setter: setGood,
      value: good
    },
    {
      text: 'neutraali',
      setter: setNeutral,
      value: neutral
    },
    {
      text: 'huono',
      setter: setBad,
      value: bad
    }
  ]

  return (
    <div>
      <Feedback buttons={buttons} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)