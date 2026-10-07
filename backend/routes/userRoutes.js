const router = require('express').Router()
const controller = require('../controllers/userController')
const { requireAuth } = require('../middleware/auth')
const asyncHandler = require('../utils/asyncHandler')

router.use(requireAuth)
router.get('/me', asyncHandler(controller.profile))
router.patch('/me', asyncHandler(controller.updateProfile))
module.exports = router