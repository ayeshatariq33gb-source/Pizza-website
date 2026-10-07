const router = require('express').Router()
const controller = require('../controllers/categoryController')
const asyncHandler = require('../utils/asyncHandler')

router.get('/', asyncHandler(controller.list))
module.exports = router