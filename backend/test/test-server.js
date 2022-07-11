const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')
const path = require('path')
const fileTest = require('./test/file/fileTest')



const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())

//initiaite the tests poggers
app.use(fileTest)

app.use(errorHandler)
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`))