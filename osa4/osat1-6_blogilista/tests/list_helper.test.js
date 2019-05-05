const listHelper = require('../utils/list_helper')

const listWithOneBlog = [{
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  likes: 5,
}]

const blogs = [{
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2,
  }
]

test('dummy returns one (step1)', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes (step2)', () => {
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('equals the likes of all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog (step3)', () => {
  test('when list has only one blog returns that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('returns the blog with most likes of all blogs', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs (step4)', () => {
  test('when list has only one blog returns that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes (step5)', () => {
  test('when list has only one blog returns that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('returns the author whose blogs have the most likes combined', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})