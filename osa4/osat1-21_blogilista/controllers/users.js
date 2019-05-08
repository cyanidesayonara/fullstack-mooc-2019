const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1
    })
    return response.json(users.map(user => user.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()
    return response.status(201).json(savedUser.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter