const discord = require('discord.js')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { pool } = require('./pool.js')

const { GatewayIntentBits, Partials } = require('discord.js')

require('express-async-errors')


let config = null

const fetchConfig = async () => {
    const query = `SELECT * FROM \"config\"`
    const result = await pool.query(query)
    config = new Object()
    if (result.rows.length > 0) {
        config.transcribe_channel_id = result.rows[0].transcribers_channel_id
        config.review_channel_id = result.rows[0].reviewers_channel_id
        config.toggleNotification = result.rows[0].toggle_discord_notif
    }

    return;
}

const client = new discord.Client({
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    intents: [
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
    ],
    disableEveryone: true
})

const sendToTranscribers = async (message) => {

    if (!config.transcribe_channel_id) {
        await fetchConfig()
    }

    if (!config.toggleNotification) {
        console.log('Notification is disabled, ignoring sending a message to transcribers...')
        return;
    }

    if (config.transcribe_channel_id && client.user) {
        const channel = await client.channels.fetch(config.transcribe_channel_id)
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

const sendToReviewers = async (message) => {
    
    if (!config.review_channel_id) {
        await fetchChannelIds()
    }

    if (!config.toggleNotification) {
        console.log('Notification is disabled, ignoring sending a message to reviewers...')
        return;
    }

    if (config.review_channel_id && client.user) {
        const channel = await client.channels.fetch(config.review_channel_id)
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

    if (!config) {
        await fetchConfig()
    }

    if (!config.toggleNotification) {
        return;
    }

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

const updatePresence = async() => {

    if (!config) {
        await fetchConfig()
    }

    if (config.toggleNotification) {

        const result = await pool.query('SELECT * FROM \"job\" WHERE (status = $1 OR status = $2) AND (active = true) AND (claimed_userid IS NULL) ', ['transcribe', 'review'])
        // count nulls for transcribe and reviewer ids
        const openJobs = result.rows.length

        client.user.presence.set({
            activities: [{name: `${openJobs} Jobs Available`}],
            status: 'online'
        });
    } else {
        client.user.presence.set({
            activities: [{name: 'Notifications Disabled'}],
            status: 'dnd'
        });
    }

} 

const updateHeader = async() => {

    if (!config) {
        await fetchConfig()
    }

    if (!config.toggleNotification) {
        console.log('Notification is disabled, ignoring updating the header...')
        return;
    }
        
    if (config && client.user) {
        let reviewChannel = null
        let transcribeChannel = null
        
        if (config.review_channel_id) {
            reviewChannel = await client.channels.fetch(config.review_channel_id)
        }

        if (config.transcribe_channel_id) {
            transcribeChannel = await client.channels.fetch(config.transcribe_channel_id)
        }
        
        const result = await pool.query('SELECT * FROM \"job\" WHERE (status = $1 OR status = $2) AND (active = true) AND (claimed_userid IS NULL)', ['transcribe', 'review'])

        if (reviewChannel) {
        
            const reviewerJobs = result.rows.filter(row => row.status === 'review').length
            
            try {
                await reviewChannel.setTopic(` ${reviewerJobs} Review Jobs Available | Updated ${new Date().toLocaleString(process.env.LOCALE, {timeZone: process.env.TIMEZONE})} ${process.env.TIMEZONE}`)
                
            } catch (error) {
                throw new Error(error)
            }
        } else {
            console.log('Reviewer channel not found, ignoring updating the channel topic...')
        }

        if (transcribeChannel) {
            const transcriberJobs = result.rows.filter(row => row.status === 'transcribe').length
            
            try {
                await transcribeChannel.setTopic(`${transcriberJobs} Transcribe Jobs Available | Updated ${new Date().toLocaleString(process.env.LOCALE, {timeZone: process.env.TIMEZONE})} ${process.env.TIMEZONE}`)
                
            } catch (error) {
                throw new Error(error)
            }
        } else {
            console.log('Transcriber channel not found, ignoring updating the channel topic...')
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

    
    await updatePresence()
    await updateHeader()

    setInterval( async () => {
        await updatePresence()
        await updateHeader()
    } , 1000 * 60 * 5) // every 5 minutes

})


module.exports = { 
    client,
    sendToTranscribers,
    sendToReviewers,
    sendToPM,
    fetchConfig
} 


