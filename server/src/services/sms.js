const Telnyx = require('telnyx')

async function sendSMS(toNumber, message) {
  const apiKey = process.env.TELNYX_API_KEY?.trim()
  const from = process.env.TELNYX_PHONE_NUMBER?.trim()

  if (!apiKey || !from) {
    console.log(`[SMS stub] To: +1${toNumber} | ${message}`)
    return
  }

  const telnyx = Telnyx(apiKey)
  await telnyx.messages.send({
    from,
    to: `+1${toNumber}`,
    text: message,
  })
}

module.exports = { sendSMS }
