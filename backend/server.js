const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')

// start up app 
const app = express()
const PORT = process.env.PORT || 5000

// middleware for handling requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
app.use('/api/user', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))