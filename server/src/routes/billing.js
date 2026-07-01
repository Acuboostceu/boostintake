const express = require('express')
const Stripe = require('stripe')
const { requireAuth } = require('../middleware/auth')
const { supabase } = require('../services/supabase')

const router = express.Router()
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  tablet: process.env.STRIPE_PRICE_TABLET,
}

// Get subscription status
router.get('/status', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('clinics')
    .select('subscription_status, trial_ends_at, stripe_customer_id')
    .eq('id', req.user.clinicId)
    .single()

  if (error) return res.status(500).json({ message: 'Failed to load status' })

  const now = new Date()
  const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null
  const trialActive = data.subscription_status === 'trial' && trialEnd && trialEnd > now
  const trialDaysLeft = trialActive ? Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)) : 0

  res.json({
    status: data.subscription_status,
    trialEndsAt: data.trial_ends_at,
    trialActive,
    trialDaysLeft,
    isActive: data.subscription_status === 'active' || trialActive,
  })
})

// Create Stripe Checkout session
router.post('/create-checkout', requireAuth, async (req, res) => {
  try {
    const { plan = 'tablet' } = req.body
    const priceId = PRICES[plan]
    if (!priceId) return res.status(400).json({ message: `Invalid plan or missing price ID for: ${plan}` })

    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('email, name, stripe_customer_id')
      .eq('id', req.user.clinicId)
      .single()

    if (clinicError || !clinic) {
      return res.status(500).json({ message: 'Failed to load clinic info' })
    }

    // Create or reuse Stripe customer
    let customerId = clinic.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: clinic.email,
        name: clinic.name,
        metadata: { clinicId: req.user.clinicId },
      })
      customerId = customer.id
      await supabase.from('clinics').update({ stripe_customer_id: customerId }).eq('id', req.user.clinicId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/dashboard?subscribed=1`,
      cancel_url: `${process.env.APP_URL}/dashboard/billing`,
      metadata: { clinicId: req.user.clinicId },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout] error:', err.message)
    res.status(500).json({ message: err.message || 'Failed to create checkout session' })
  }
})

// Create Stripe Customer Portal session (manage billing)
router.post('/portal', requireAuth, async (req, res) => {
  const { data: clinic } = await supabase
    .from('clinics')
    .select('stripe_customer_id')
    .eq('id', req.user.clinicId)
    .single()

  if (!clinic?.stripe_customer_id) {
    return res.status(400).json({ message: 'No billing account found' })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: clinic.stripe_customer_id,
    return_url: `${process.env.APP_URL}/dashboard/billing`,
  })

  res.json({ url: session.url })
})

// Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const getClinicId = (obj) => obj?.metadata?.clinicId

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const clinicId = getClinicId(session)
      if (clinicId) {
        await supabase.from('clinics').update({
          subscription_status: 'active',
          stripe_subscription_id: session.subscription,
        }).eq('id', clinicId)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('stripe_customer_id', sub.customer)
        .single()
      if (clinic) {
        await supabase.from('clinics').update({
          subscription_status: sub.status === 'active' ? 'active' : sub.status,
        }).eq('id', clinic.id)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('stripe_customer_id', sub.customer)
        .single()
      if (clinic) {
        await supabase.from('clinics').update({
          subscription_status: 'cancelled',
          stripe_subscription_id: null,
        }).eq('id', clinic.id)
      }
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('stripe_customer_id', invoice.customer)
        .single()
      if (clinic) {
        await supabase.from('clinics').update({
          subscription_status: 'past_due',
        }).eq('id', clinic.id)
      }
      break
    }
  }

  res.json({ received: true })
})

module.exports = router
