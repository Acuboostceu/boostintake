const jwt = require('jsonwebtoken')
const { supabase } = require('../services/supabase')

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

async function requireSubscription(req, res, next) {
  const { data, error } = await supabase
    .from('clinics')
    .select('subscription_status, trial_ends_at')
    .eq('id', req.user.clinicId)
    .single()

  if (error || !data) {
    return res.status(403).json({ message: 'Subscription check failed', code: 'SUBSCRIPTION_ERROR' })
  }

  const now = new Date()
  const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null
  const isActive =
    data.subscription_status === 'active' ||
    (data.subscription_status === 'trial' && trialEnd && trialEnd > now)

  if (!isActive) {
    return res.status(403).json({
      message: 'Your trial has expired. Please subscribe to continue.',
      code: 'SUBSCRIPTION_EXPIRED',
    })
  }

  next()
}

module.exports = { requireAuth, requireSubscription }
