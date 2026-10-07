const router = require('express').Router()
const controller = require('../controllers/cartController')
const { requireAuth } = require('../middleware/auth')
const asyncHandler = require('../utils/asyncHandler')

router.use(requireAuth)
router.get('/', asyncHandler(controller.get))
router.post('/items', asyncHandler(controller.add))
router.patch('/items/:pizzaId', asyncHandler(controller.update))
router.delete('/items/:pizzaId', asyncHandler(controller.remove))
router.delete('/', asyncHandler(controller.clear))
module.exports = router