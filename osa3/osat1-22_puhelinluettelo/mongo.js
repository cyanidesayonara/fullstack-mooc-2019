const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://username:${password}@puhelinluettelo-n3hyj.mongodb.net/test?retryWrites=true`

mongoose.connect(url, {
  useNewUrlParser: true
})


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person
    .find()
    .then(persons => {
      console.log('puhelinluettelo:')
      persons.map(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(response => {
    console.log(`Lisätään ${person.name} numero ${person.number} luetteloon`)
    mongoose.connection.close()
  })
}