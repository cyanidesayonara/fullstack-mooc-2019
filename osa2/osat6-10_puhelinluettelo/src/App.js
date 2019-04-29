import React, { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Martti Tienari', number: '040-123456' },
    { name: 'Arto Järvinen', number: '040-123456' },
    { name: 'Lea Kutvonen', number: '040-123456' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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