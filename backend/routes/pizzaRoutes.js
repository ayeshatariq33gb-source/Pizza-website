const router = require('express').Router()
const controller = require('../controllers/pizzaController')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const asyncHandler = require('../utils/asyncHandler')

router.get('/', asyncHandler(controller.list))
router.get('/admin/all', requireAuth, requireAdmin, asyncHandler(controller.adminList))
router.get('/:id', asyncHandler(controller.get))
router.post('/', requireAuth, requireAdmin, asyncHandler(controller.create))
router.patch('/:id', requireAuth, requireAdmin, asyncHandler(controller.update))
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(controller.remove))
module.exports = router