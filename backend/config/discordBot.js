const discord = require('discord.js')
const { pool } = require('./pool.js')
const { GatewayIntentBits } = require('discord.js')

require('express-async-errors')

const client = new discord.Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages ],
    disableEveryone: true
})


client.on('ready', async () => {
    console.log(`Discord: Logged in as ${client.user.tag}!`)

    const updatePresence = async() => {

        const result = await pool.query('SELECT * FROM \"job\" WHERE status = $1', ['transcribe'])
        const openJobs = result.rows.length
        client.user.presence.set({
            activities: [{name: `${openJobs} Jobs Available`}],
            status: 'online'
        });
    } 

    await updatePresence()

    setInterval( async () => {
        await updatePresence()

    } , 1000 * 60 * 5) // every 5 minutes

})

module.exports = client 


