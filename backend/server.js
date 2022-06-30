const express = require('express')
const dotenv = require('dotenv')
const loginRoute = require('./routes/loginRoutes')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')

// start up app 
const app = express()
const PORT = process.env.PORT

// middleware for handling requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
app.use('/api/user', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))