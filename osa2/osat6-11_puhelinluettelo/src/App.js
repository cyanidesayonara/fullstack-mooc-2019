import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const getAllPersons = async () => {
    const response = await axios.get('http://localhost:3001/persons')
    setPersons(response.data)
  }

  useEffect(() => {
    getAllPersons()
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const person = {
      name: newName,
      number: newNumber
    }

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} on jo luettelossa`)
    } else {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
    }
  }

  const filteredPersons = filter
    ? persons.filter(person => {
      return person.name.toLowerCase().includes(filter.toLowerCase())
    })
    : persons

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Filter setFilter={setFilter} filter={filter} />
      <h3>lisää uusi</h3>
      <PersonForm
        addPerson={addPerson}
        setNewName={setNewName}
        newName={newName}
        setNewNumber={setNewNumber}
        newNumber={newNumber}
      />
      <h2>Numerot</h2>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App