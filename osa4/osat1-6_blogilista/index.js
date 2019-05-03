const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const Blog = require('./models/blog')

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true
  })

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})