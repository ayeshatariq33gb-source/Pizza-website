const router = require('express').Router()
const controller = require('../controllers/authController')
const asyncHandler = require('../utils/asyncHandler')

router.post('/register', asyncHandler(controller.register))
router.post('/login', asyncHandler(controller.login))
module.exports = router