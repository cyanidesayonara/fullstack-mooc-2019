const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  let user = new User({
    username: 'xxx',
    passwordHash: '$2b$10$WU7YRWktk70d2YPfVU.71euI9/rSErUFGRmWlrutN7Xj0gilR.jmK'
  })
  await user.save()

  user = {
    username: 'xxx',
    password: '12345678'
  }

  const response = await api
    .post('/api/login')
    .send(user)

  token = response.body.token

  const newBlog = {
    title: 'blog',
    author: 'dude',
    url: 'www'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

describe('when there is initially one user and one blog in db', () => {

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
      username: 'xxx',
      password: '12345678',
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
    const blogs = await Blog.find({})

    const users = await User.find({})
    expect(blogs[0].user.toString()).toBe(users[0]._id.toString())
  })

  test('blog can be removed', async () => {
    const firstBlog = await Blog.find({})

    await api
      .delete(`/api/blogs/${firstBlog[0]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    const blogs = await Blog.find({})
    expect(blogs.length).toBe(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})