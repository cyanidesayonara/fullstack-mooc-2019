require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const {
  logger,
  unknownEndpoint,
  errorHandler
} = require('./config/middleware')


app.use(bodyParser.json())
app.use(express.static('build'))
app.use(cors())
app.use(logger)

morgan.token('data', function (request, response) {
  return JSON.stringify(request.body)
})

const morganConfig = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.data(req, res)
  ].join(' ')
})

app.use(morganConfig)

app.get('/', (requset, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person
    .find({})
    .then(persons =>
      response.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${date}</p>`)
    )
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      return response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(note => {
      if (note) {
        return response.json(note.toJSON())
      } else {
        return response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save(person)
    .then(savedPerson => {
      return response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {
      new: true
    })
    .then(updatedPerson => {
      return response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      return response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})