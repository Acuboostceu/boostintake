const { SESClient, SendRawEmailCommand } = require('@aws-sdk/client-ses')
const { createMimeMessage } = require('../lib/mime')

let ses = null

function getClient() {
  if (!ses) {
    ses = new SESClient({
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }
  return ses
}

async function sendEmail({ to, subject, text, attachments = [] }) {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.log(`[Email mock] To: ${to.join(', ')} | Subject: ${subject}`)
    // Save PDF attachments to /tmp for local testing
    const fs = require('fs')
    for (const att of attachments) {
      if (att.content) {
        const filePath = `/tmp/${att.filename}`
        fs.writeFileSync(filePath, att.content)
        console.log(`[Email mock] PDF saved → ${filePath}`)
      }
    }
    return
  }

  const toAddresses = Array.isArray(to) ? to : [to]
  const rawMessage = createMimeMessage({
    from: process.env.SES_FROM_EMAIL,
    to: toAddresses,
    subject,
    text,
    attachments,
  })

  await getClient().send(new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(rawMessage) },
    Source: process.env.SES_FROM_EMAIL,
    Destinations: toAddresses,
  }))
}

module.exports = { sendEmail }
