const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

// start up app 
const app = express()
const PORT = process.env.PORT

// middleware for handling requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
// example route remove as necessary
app.use('/exampleRoute', require('./routes/exampleRoutes'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))