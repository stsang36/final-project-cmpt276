const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const discord = require('discord.js')
dotenv.config({path: '../.env'})
const { errorHandler } = require('./middleware/errorMiddleware')
const { GatewayIntentBits } = require('discord.js')

const app = express()
const PORT = process.env.PORT

const client = new discord.Client({intents: GatewayIntentBits.DirectMessages})
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({limit: '100mb', extended: true}))



app.use(errorHandler)

client.login(process.env.DISCORD_TOKEN)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))