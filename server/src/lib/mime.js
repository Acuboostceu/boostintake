// Minimal MIME builder for SES raw email with PDF attachment
function createMimeMessage({ from, to, subject, text, attachments = [] }) {
  const boundary = `----=_Part_${Date.now()}`
  const toStr = Array.isArray(to) ? to.join(', ') : to

  const lines = [
    `From: ${from}`,
    `To: ${toStr}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    text,
  ]

  for (const att of attachments) {
    const b64 = att.content instanceof Buffer ? att.content.toString('base64') : Buffer.from(att.content).toString('base64')
    lines.push(
      `--${boundary}`,
      `Content-Type: ${att.contentType}; name="${att.filename}"`,
      `Content-Disposition: attachment; filename="${att.filename}"`,
      'Content-Transfer-Encoding: base64',
      '',
      ...b64.match(/.{1,76}/g),
    )
  }

  lines.push(`--${boundary}--`)
  return lines.join('\r\n')
}

module.exports = { createMimeMessage }
