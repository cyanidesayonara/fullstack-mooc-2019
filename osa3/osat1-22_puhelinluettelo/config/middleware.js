const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidatorError' && error.kind === 'unique') {
    return response.status(409).send({
      error: `${error.name} must be unique`
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({
      error: error
    })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

module.exports = {
  logger,
  unknownEndpoint,
  errorHandler
}