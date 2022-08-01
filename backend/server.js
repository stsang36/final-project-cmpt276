const express = require('express')
const dotenv = require('dotenv')
const { client:discordBot } = require('./config/discordBot')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const path = require('path')
// start up app 
const app = express()
const PORT = process.env.PORT

if(process.env.NODE_ENV === 'development'){
  app.use(cors())
}

// middleware for handling requests
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({limit: '100mb', extended: true}))


// routes
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/file', require('./routes/fileRoutes'))
app.use('/api/job', require('./routes/jobRoutes'))
app.use('/api/config', require('./routes/configRoutes'))

//  Serve Frontend
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html')))
} else {
  app.get('/', (req, res) => res.send('Please set environment variable to production'))
}

app.use(errorHandler)

discordBot.login(process.env.DISCORD_TOKEN).then(() => {
  app.emit('DISCORD_LOGIN_SUCCESS')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
module.exports = app;
