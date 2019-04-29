import React from 'react'
import Statistic from './Statistic'

const Statistics = props => {
  const total = props.good + props.neutral + props.bad
  const average = (props.good - props.bad) / total
  const positive = props.good / total * 100

  const statistics = [
    {
      text: 'hyvä',
      value: props.good
    },
    {
      text: 'neutraali',
      value: props.neutral
    },
    {
      text: 'huono',
      value: props.bad,
    },
    {
      text: 'yhteensä',
      value: total,
    },
    {
      text: 'keskiarvo',
      value: average,
    },
    {
      text: 'positiivisia',
      value: positive + ' %',
    }
  ]

  return (
    <div>
      <h1>
        statistiikka
      </h1>
      {
        (total !== 0)
          ? <table>
            <tbody>
              {
                statistics.map(statistic =>
                  <Statistic key={statistic.text} text={statistic.text} value={statistic.value} />
                )
              }
            </tbody>
          </table>
          : <p>Ei yhtään palautetta annettu</p>
      }
    </div>
  )
}

export default Statistics