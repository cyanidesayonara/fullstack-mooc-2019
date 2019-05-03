import React, {
  useState,
  useEffect
} from 'react'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => setPersons(response))
      .catch(error => console.log(error))
  }, [])

  const showMessage = (message, error) => {
    setNotification(message)
    setError(error)

    setTimeout(() => {
      setNotification(null)
      setError(null)
    }, 5000)
  }

  const addPerson = event => {
    event.preventDefault()

    const person = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (!existingPerson) {
      personService
        .create(person)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          showMessage(`Lisättiin ${person.name}`)
        })
        .catch(error => {
          showMessage(error.response.data.error.message, true)
        })
    } else {
      if (window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`)) {
        personService
          .update(existingPerson.id, person)
          .then(response => {
            setPersons(persons
              .filter(p => p.name !== person.name)
              .concat(response)
            )
            setNewName('')
            setNewNumber('')
            showMessage(`Päivitettiin ${person.name}`)
          })
          .catch(error => {
            showMessage(error.response.data.error.message, true)
          })
      }
    }
  }

  const removePerson = (event, name) => {
    event.preventDefault()
    const person = persons.find(person => person.name === name)
    if (person) {
      if (window.confirm(`Poistetaanko ${person.name}`)) {
        personService
          .remove(person.id)
          .then(response => {
            setPersons(persons.filter(p => p.id !== person.id))
            showMessage(`Poistettiin ${person.name}`)
          })
          .catch(error => {
            showMessage(`Henkilö ${person.name} on jo poistettu`, true)
            setPersons(persons.filter(p => p.id !== person.id))
            console.log(error)
          })
      }
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
      <Notification notification={notification} error={error} />
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
      <Persons persons={filteredPersons} removePerson={removePerson} />
    </div>
  )
}

export default App