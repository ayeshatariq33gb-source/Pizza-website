require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

async function createAdmin() {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters in .env.')
  }
  await mongoose.connect(MONGODB_URI)
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() })
  if (existing) {
    existing.role = 'admin'
    existing.name = ADMIN_NAME
    await existing.save()
    console.log(`Administrator access enabled for ${existing.email}.`)
  } else {
    const user = await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' })
    console.log(`Administrator created: ${user.email}.`)
  }
}

createAdmin()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())