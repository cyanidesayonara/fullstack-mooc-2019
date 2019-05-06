const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const user = new User({
      username: 'guy',
      name: 'guy',
      passwordHash: 'pass'
    })
    await user.save()
  })

  test('creation succeeds with a fresh username (step4)', async () => {
    const initialUsers = await User.find({})

    const newUser = {
      username: 'someone',
      name: 'Buddy McGuy',
      password: 'hunter2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(initialUsers.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user without username or password cannot be created (step5)', async () => {
    const initialUsers = await User.find({})

    const newUser = {
      name: 'Buddy McGuy',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(initialUsers.length)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'guy',
      password: 'pass',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('blog has a creator (user) (step6)', async () => {
    const usersAtStart = await User.find({})

    const newBlog = {
      title: 'blog',
      author: 'dude',
      url: 'www',
      user: usersAtStart[0]
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await Blog.find({})
    console.log(blogs)
    expect(blogs[0].user).toBe(usersAtStart[0])
  })
})


afterAll(() => {
  mongoose.connection.close()
})