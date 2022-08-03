const mail = require('@sendgrid/mail')
const { pool } = require('./pool.js')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

require('express-async-errors')

let config = null

const fetchConfig = async() => {
  const query = `SELECT * FROM \"config\"`
  const result = await pool.query(query)
  config = new Object()
  if (result.rows.length > 0) {
    config.toggleEmailNotif = result.rows[0].toggle_email_notif
    config.emailDomain = result.rows[0].email_domain
  }
}

const sendEmail = async(data) => {
  if (!config) {
    await fetchConfig()
  }

  if (!config.emailDomain) {
    console.log('Email domain is not set, ignoring sending an email...')
    return;
  }

  if (config.toggleEmailNotif) {
    const message = {
      to: data.to_email,
      from: config.emailDomain,
      templateId: data.templateId,
      dynamicTemplateData:
      {
        subject : data.subject,
        first_name: data.username,
        targetLink: data.targetLink

      }
    }

    try {
      mail.setApiKey(process.env.SENDGRID_API_KEY)
      await mail.send(message)
    } catch(err){
      throw new Error(err)
    }

  } else {
    console.log('Email notification is disabled, ignoring sending an email...')
  }

  return;
}

const sendResetEmail = async(data) => {
  if (!config) {
    await fetchConfig()
  }

  if (!config.emailDomain) {
    console.log('Email domain is not set, ignoring sending an email...')
    return;
  }

  const resetMessage = {
    to: data.to_email,
    from: config.emailDomain,
    templateId: data.templateId,
    dynamicTemplateData:
    {
      subject : data.subject,
      first_name: data.username,
      targetLink: data.targetLink

    }
  }

  try {
    mail.setApiKey(process.env.SENDGRID_API_KEY)
    await mail.send(resetMessage)
  } catch(err){
    throw new Error(err)
  }

  return;
}


module.exports = { 
  sendEmail,
  fetchConfig,
  sendResetEmail
}