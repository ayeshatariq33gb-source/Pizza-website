const router = require('express').Router()
const controller = require('../controllers/contactController')
const asyncHandler = require('../utils/asyncHandler')

router.post('/', asyncHandler(controller.create))
module.exports = router