const { pool } = require('../config/pool')
const { fetchConfig:refreshDiscordConfig } = require('../config/discordBot')
require('express-async-errors')


// @route:  GET /api/config
// @desc:   Gets the config from the 'config' table
// @access: PRIVATE
const getAppConfig = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const results = await pool.query('SELECT * FROM config limit 1')
  if(!results.rows[0]){
    res.status(400)
    throw new Error('settings not found')
  }
  const { id, reviewers_channel_id, transcribers_channel_id, email_domain, toggle_discord_notif, toggle_email_notif } = results.rows[0]
  const settings = { 
    id: id,
    reviewersChannelId: reviewers_channel_id, 
    transcribersChannelId: transcribers_channel_id, 
    emailDomain: email_domain, 
    toggleDiscordNotif: toggle_discord_notif,  
    toggleEmailNotif: toggle_email_notif,
  }
  res.status(200).json(settings)
}

// @route:  PUT /api/config
// @desc:   Updates the config in the 'config' table
// @body:   obj w/ id, reviewers_channel_id, transcribers_channel_id, email_domain, toggle_discord_notif, toggle_email_notif
// @access: PRIVATE
const updateAppConfig = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  if(!req.body){
    res.status(400)
    throw new Error('missing fields')
  }
  const { id, reviewersChannelId, transcribersChannelId, emailDomain, toggleDiscordNotif, toggleEmailNotif } = req.body
  const updateAppConfigQuery = {
    text: 'UPDATE config set reviewers_channel_id = $1, transcribers_channel_id = $2, email_domain = $3, toggle_discord_notif = $4, toggle_email_notif = $5 WHERE id = $6',
    values: [reviewersChannelId, transcribersChannelId, emailDomain, toggleDiscordNotif, toggleEmailNotif, id]
  }
  await refreshDiscordConfig()
  await pool.query(updateAppConfigQuery)
  res.status(200).json({message: 'success'})
}

module.exports ={  
  getAppConfig,
  updateAppConfig
}