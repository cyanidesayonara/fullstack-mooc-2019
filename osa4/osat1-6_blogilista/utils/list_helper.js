const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((total, current) => {
    return total + current.likes
  }, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
}

const mostBlogs = blogs => {
  return _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      'author': key,
      'blogs': objs.reduce((total, current) => {
        return total + 1
      }, 0)
    }))
    .sortBy('blogs')
    .reverse()
    .first()
}

const mostLikes = blogs => {
  return _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      'author': key,
      'likes': _.sumBy(objs, 'likes')
    }))
    .sortBy('likes')
    .reverse()
    .first()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}