import React from 'react'

const Persons = props => {
  return (
    props.persons.map(person =>
      <p key={person.name}>
        {person.name} {person.number}
        <button onClick={event => props.removePerson(event, person.name)}>poista</button>
      </p>
    )
  )
}

export default Persons