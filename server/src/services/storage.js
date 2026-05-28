const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

let s3 = null

function getClient() {
  if (!s3) {
    s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }
  return s3
}

async function uploadLogo(clinicId, file) {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.log(`[S3 mock] Would upload logo for clinic ${clinicId}`)
    return null
  }

  const ext = file.mimetype.split('/')[1] || 'png'
  const key = `logos/${clinicId}.${ext}`
  const bucket = process.env.AWS_S3_BUCKET
  const region = process.env.AWS_REGION || 'us-east-2'

  await getClient().send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }))

  // Return public URL
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

module.exports = { uploadLogo }
