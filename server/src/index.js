require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const clinicRoutes = require('./routes/clinic')
const patientRoutes = require('./routes/patient')
const formsRoutes = require('./routes/forms')
const billingRoutes = require('./routes/billing')
const socialRoutes = require('./routes/social')
const embedRoutes = require('./routes/embed')

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'https://boostintake.com',
      'https://www.boostintake.com',
      process.env.EHR_URL, // Glow EHR on Railway
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/,
      /^https:\/\/.*\.vercel\.app$/,
    ]
    if (!origin || allowed.some((a) => typeof a === 'string' ? a === origin : a.test(origin))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// Webhook needs raw body — must be before express.json()
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use((req, _res, next) => { console.log(`→ ${req.method} ${req.path}`) ; next() })

app.use('/api/auth', authRoutes)
app.use('/api/clinic', clinicRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/forms', formsRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/social', socialRoutes)
app.use('/api/embed', embedRoutes)

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log(`BoostIntake server running on :${PORT}`))
}

module.exports = app
