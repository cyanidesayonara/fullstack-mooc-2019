import React from 'react'

const Weather = props => {
  return (
    <div>
      <h3>Weather in {props.weather.location.name}</h3>
      <h4>temperature: {props.weather.current.temp_c} Celsius</h4>
      <img width='50' src={props.weather.current.condition.icon} alt={`Weather icon for ${props.weather.location.name}`} />
      <h4>wind: {props.weather.current.wind_kph} kph direction {props.weather.current.wind_dir}</h4>
    </div >
  )
}

export default Weather
