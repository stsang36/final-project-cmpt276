const mail = require('@sendgrid/mail')

const sendEmail = async(data) => {
  try{
    mail.setApiKey(process.env.SENDGRID_API_KEY)
    const result = await mail.send(data)
    return
  }catch(err){
    throw new Error(err)
  }
}

module.exports = sendEmail