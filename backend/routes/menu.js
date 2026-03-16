const express = require('express');
const router = express.Router();
const { getMenuItems, getFeaturedItems, getPopularItems, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getMenuItems);
router.get('/featured', getFeaturedItems);
router.get('/popular', getPopularItems);
router.post('/', protect, adminOnly, addMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
