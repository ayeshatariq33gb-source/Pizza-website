const router = require('express').Router()
const controller = require('../controllers/siteContentController')
const asyncHandler = require('../utils/asyncHandler')

router.get('/', asyncHandler(controller.get))
module.exports = router