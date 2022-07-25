const discord = require('discord.js')
const { GatewayIntentBits } = require('discord.js')

const discordBot = new discord.Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
    disableEveryone: true
})

discordBot.on('ready', () => {
    console.log(`Discord: Logged in as ${discordBot.user.tag}!`)
})




module.exports = discordBot 


