const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const stream = require('stream')
const path = require('path')

// start up app 
const app = express()
const PORT = process.env.PORT

// middleware for handling requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))

if(process.env.NODE_ENV === 'development') app.use(cors())

// routes
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/file', require('./routes/fileRoutes'))
app.use('/api/job', require('./routes/jobRoutes'))

//  Serve Frontend
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html')))
} else {
  app.get('/', (req, res) => res.send('Please set environment variable to production'))
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app;
