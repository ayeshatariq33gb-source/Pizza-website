const SiteContent = require('../models/SiteContent')

exports.get = async (request, response) => {
  let content = await SiteContent.findOne({ key: 'main' })
  if (!content) content = await SiteContent.create({ key: 'main' })
  response.json({ content })
}

exports.update = async (request, response) => {
  let content = await SiteContent.findOne({ key: 'main' })
  if (!content) content = new SiteContent({ key: 'main' })
  for (const section of ['hero', 'about', 'offer', 'contact']) {
    if (request.body[section] && typeof request.body[section] === 'object') {
      const current = content[section]?.toObject?.() || content[section] || {}
      content[section] = { ...current, ...request.body[section] }
    }
  }
  await content.save()
  response.json({ content })
}