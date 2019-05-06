const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

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
  const blog = new Blog(request.body)

  // const token = getTokenFrom(request)

  try {
    // const decodedToken = jwt.verify(token, process.env.SECRET)
    // if (!token || !decodedToken.id) {
    //   return response.status(401).json({
    //     error: 'token missing or invalid'
    //   })
    // }

    // const user = await User.findById(decodedToken.id)

    const savedBlog = await blog.save()
    // user.blogs = user.blogs.concat(savedBlog._id)
    // await user.save()
    return response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await Blog
      .findByIdAndUpdate(request.params.id, blog, {
        new: true
      })
    return response.status(204).json(result.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter