const router = require('express').Router()
const controller = require('../controllers/orderController')
const { requireAuth } = require('../middleware/auth')
const asyncHandler = require('../utils/asyncHandler')

router.use(requireAuth)
router.post('/', asyncHandler(controller.place))
router.get('/mine', asyncHandler(controller.history))
router.get('/active', asyncHandler(controller.active))
router.post('/:id/demo-payment', asyncHandler(controller.retryDemoPayment))
module.exports = router