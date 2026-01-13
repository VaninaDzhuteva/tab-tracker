const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function jwtSignUser(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  )
}

module.exports = {
  async register(req, res) {
    try {
      const user = await User.create(req.body)

      // Return token too so the client can be "logged in" immediately
      res.send({
        user: { id: user.id, email: user.email },
        token: jwtSignUser(user),
      })
    } catch (error) {
      res.status(400).send({
        error: 'This email account is already in use!',
      })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(403).send({ error: 'Invalid login information.' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(403).send({ error: 'Invalid login information.' })
      }

      res.send({
        user: { id: user.id, email: user.email },
        token: jwtSignUser(user),
      })
    } catch (err) {
      res.status(500).send({ error: 'An error has occurred trying to log in.' })
    }
  },
}
