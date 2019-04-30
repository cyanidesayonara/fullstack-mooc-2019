import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Country from './components/Country'

import axios from 'axios'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const GetAllCountries = async () => {
      const response = await axios.get('https://restcountries.eu/rest/v2/all')
      setCountries(response.data)
    }
    GetAllCountries()
  }, [])

  const shownCountries = countries.filter(country => {
    return country.name.toLowerCase().includes(filter.toLowerCase())
  })

  return (
    <div className="App">
      <Filter filter={filter} setFilter={setFilter} />
      {
        shownCountries.length > 10 &&
        <p>Too many matches, specify another filter</p>
      }
      {
        shownCountries.length <= 10 && shownCountries.length > 1 &&
        shownCountries.map(country =>
          <p key={country.name}>{country.name} <button onClick={() => setFilter(country.name)}>show</button></p>
        )
      }
      {
        shownCountries.length === 1 &&
        shownCountries.map(country =>
          <Country key={country.name} country={country} />
        )
      }
    </div>
  );
}

export default App;
