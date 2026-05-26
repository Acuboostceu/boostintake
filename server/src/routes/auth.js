const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { supabase } = require('../services/supabase')

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

  const { data: clinic, error } = await supabase
    .from('clinics')
    .select('id, email, password_hash, name')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !clinic) return res.status(401).json({ message: 'Invalid credentials' })

  const match = await bcrypt.compare(password, clinic.password_hash)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign(
    { clinicId: clinic.id, email: clinic.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, clinicName: clinic.name })
})

router.post('/register', async (req, res) => {
  const { email, password, clinicName } = req.body
  if (!email || !password || !clinicName) {
    return res.status(400).json({ message: 'All fields required' })
  }

  const hash = await bcrypt.hash(password, 12)

  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('clinics')
    .insert({
      email: email.toLowerCase(),
      password_hash: hash,
      name: clinicName,
      trial_ends_at: trialEndsAt,
      subscription_status: 'trial',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Register error:', error)
    if (error.code === '23505') return res.status(409).json({ message: 'Email already registered' })
    return res.status(500).json({ message: 'Registration failed' })
  }

  const token = jwt.sign({ clinicId: data.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.status(201).json({ token })
})

module.exports = router
