const discord = require('discord.js')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { pool } = require('./pool.js')
const { GatewayIntentBits, Partials } = require('discord.js')

require('express-async-errors')

const client = new discord.Client({
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    intents: [
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
    ],
    disableEveryone: true
})

const sendToChannel = async (message) => {

    if (process.env.DISCORD_CHANNEL_ID && client.user) {
        const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)
        if (channel) {
            const embedMessage = new discord.EmbedBuilder()
            embedMessage.setTitle(message.title)
            embedMessage.setDescription(message.description)
            embedMessage.setColor(message.color)
            embedMessage.setTimestamp()
            embedMessage.setFooter({text: 'Bytetools Job Notification'})

            if (message.fields) {
                embedMessage.addFields(message.fields)
            }

            try {
                await channel.send({embeds: [embedMessage]})
            } catch (error) {
                throw new Error(error)
            }
        } else {
            console.log('Channel not found, ignoring sending a server message...')
        }
      }

}

const sendToPM = async (discordId, message) => {

    if (client.user && discordId) {
        const user = await client.users.fetch(discordId)
        if (user) {
        const embedMessage = new discord.EmbedBuilder()
        embedMessage.setTitle(message.title)
        embedMessage.setDescription(message.description)
        embedMessage.setColor(message.color)
        embedMessage.setTimestamp()
        embedMessage.setFooter({text: 'Bytetools Job Notification'})

        if (message.fields) {
            embedMessage.addFields(message.fields)
        }
        
        try {
            await user.send({embeds: [embedMessage]})
        } catch (error) {
            throw new Error(error)
        }

        } else {
            console.log('User not found on server, ignoring sending a private message...')
        }
    }
}

client.on('messageCreate', async (message) => {

    if (message.author.bot) {
        return
    }

    try {
        await message.reply({
            content: `Hi ${message.author.username}, this messasge box is unmonitored. Please contact the administrator if you have any questions.`,
        })
    } catch (error) {
        console.log(error)
    }


    return
})

client.on('ready', async () => {
    console.log(`Discord: Logged in as ${client.user.tag}!`)

    const updatePresence = async() => {

        const result = await pool.query('SELECT * FROM \"job\" WHERE (status = $1 OR status = $2) AND (active = true)', ['transcribe', 'review'])
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






module.exports = { 
    client,
    sendToChannel,
    sendToPM
} 


