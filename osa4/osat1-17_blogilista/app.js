const config = require('./utils/config')
const {
  requestLogger,
  unknownEndpoint,
  errorHandler
} = require('./utils/middleware')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const logger = require('./utils/logger')

app.use(requestLogger)
app.use(unknownEndpoint)
app.use(errorHandler)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

module.exports = app