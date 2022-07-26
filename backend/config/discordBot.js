const discord = require('discord.js')
const { pool } = require('./pool.js')
const { GatewayIntentBits } = require('discord.js')

require('express-async-errors')

const client = new discord.Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
    disableEveryone: true
})

const updatePresence = async() => {

    const result = await pool.query('SELECT * FROM \"job\" WHERE status = $1', ['transcribe'])
    const openJobs = result.rows.length
    client.user.setActivity(`${openJobs} available jobs`, { type: 'WATCHING' })

}

client.on('ready', async () => {
    console.log(`Discord: Logged in as ${client.user.tag}!`)

    await updatePresence()

    setInterval( async () => {
        await updatePresence()
    } , 50000)

})

module.exports = client 


