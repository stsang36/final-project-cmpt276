const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const stream = require('stream')

// start up app 
const app = express()
const PORT = process.env.PORT

// middleware for handling requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// routes
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/file', require('./routes/fileRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))