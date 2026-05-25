const twilio = require('twilio')

let client = null

function getClient() {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }
  return client
}

async function sendSMS(toNumber, message) {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log(`[SMS mock] To: +1${toNumber} | ${message}`)
    return
  }

  await getClient().messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+1${toNumber}`,
  })
}

module.exports = { sendSMS }
