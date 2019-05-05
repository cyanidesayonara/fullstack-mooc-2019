const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [{
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7,
    url: 'www'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5,
    url: 'www'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
    url: 'www'
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    likes: 10,
    url: 'www'
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    likes: 0,
    url: 'www'
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2,
    url: 'www'
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  initialBlogs.map(async blog => {
    const createdBlog = new Blog(blog)
    await createdBlog.save()
  })
})

test('correct number of blogs are returned as json (step1)', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.length).toBe(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain('React patterns')
})

test('returned blogs have a field called id instead of _id (step2)', async () => {
  const response = await api.get('/api/blogs')

  response.body.map(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added and number of blogs will increase by one (step3)', async () => {
  const newBlog = {
    author: 'guy',
    title: 'title',
    url: 'www'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(titles).toContain('title')
})

test('new blog has zero likes by default (step4)', async () => {
  const newBlog = {
    author: 'guy',
    title: 'title',
    url: 'www'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  expect(response.body.likes).toBe(0)
})

test('blog without title and url is not added (step5)', async () => {
  const newBlog = {
    author: 'somebody',
    likes: 9
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})

test('blog can be deleted (step1)', async () => {
  const allBlogs = await api.get('/api/blogs')
  const firstBlogId = allBlogs.body[0].id

  await api
    .get(`/api/blogs/${firstBlogId}`)
    .expect(200)

  await api
    .delete(`/api/blogs/${firstBlogId}`)
    .expect(204)

  await api
    .get(`/api/blogs/${firstBlogId}`)
    .expect(404)
})

test('blog can be updated and updated blog is found by id (step2)', async () => {
  const allBlogs = await api.get('/api/blogs')
  const firstBlogId = allBlogs.body[0].id

  const blog = {
    _id: allBlogs.body[0].id,
    author: 'somebody',
    title: 'something',
    url: 'www',
    likes: 666
  }

  await api
    .put(`/api/blogs/${firstBlogId}`)
    .send(blog)
    .expect(204)

  const firstBlog = await api.get(`/api/blogs/${firstBlogId}`)

  expect(firstBlog.body.likes).toBe(blog.likes)
})

afterAll(() => {
  mongoose.connection.close()
})