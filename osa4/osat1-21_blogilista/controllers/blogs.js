const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('users', {
      username: 1,
      name: 1
    })
    return response.json(blogs.map(blog => blog.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('users')
    if (blog) {
      return response.json(blog.toJSON())
    }
    return response.status(404).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {

  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'missing token'
      })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'invalid token'
      })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({
        error: 'invalid token'
      })
    }

    const blog = new Blog({
      ...request.body,
      user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'missing token'
      })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'invalid token'
      })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({
        error: 'invalid token'
      })
    }

    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, blog, {
        new: true
      })
    return response.status(204).json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'missing token'
      })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'invalid token'
      })
    }

    const blogToRemove = await Blog.findById(request.params.id)
    if (!blogToRemove) {
      return response.status(404).end()
    }

    if (blogToRemove.user && blogToRemove.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({
        error: `unauthorized request for user ${decodedToken.name}`
      })
    }

    await blogToRemove.remove()
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter