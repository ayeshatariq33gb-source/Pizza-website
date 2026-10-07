const router = require('express').Router()
const controller = require('../controllers/reviewController')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const asyncHandler = require('../utils/asyncHandler')

router.get('/', asyncHandler(controller.list))
router.post('/', requireAuth, asyncHandler(controller.create))
router.delete('/:id', requireAuth, asyncHandler(controller.remove))
module.exports = router