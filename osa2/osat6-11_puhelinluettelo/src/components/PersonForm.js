import React from 'react'

const PersonForm = props => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        nimi: <input onChange={event => props.setNewName(event.target.value)} value={props.newName} />
      </div>
      <div>
        numero: <input onChange={event => props.setNewNumber(event.target.value)} value={props.newNumber} />
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  )
}

export default PersonForm