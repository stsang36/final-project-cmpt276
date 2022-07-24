const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const discord = require('discord.js')
dotenv.config({path: '../.env'})
require('express-async-errors')

const { errorHandler } = require('./middleware/errorMiddleware')
const { GatewayIntentBits } = require('discord.js')

const app = express()
const PORT = process.env.PORT

const client = new discord.Client({intents: GatewayIntentBits.DirectMessages})
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({limit: '100mb', extended: true}))

app.post('/api/sendMessage/:id',  async (req, res) => {
    const { id } = req.params
    const { message } = req.body


    if (!message || !id) {
        res.status(400)
        throw new Error('Missing required fields')
    }

    const user = await client.users.fetch(id)
    const result = await user.send(message)
    res.status(200).send({
        status: 'Message sent successfully',
        username: `${user.username}#${user.discriminator}`,
        message: message 
    })
})

app.use(errorHandler)

client.login(process.env.DISCORD_TOKEN)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))