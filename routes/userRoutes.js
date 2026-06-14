const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/', authorize('ADMIN'), getAllUsers);
router.patch('/:id/role', authorize('ADMIN'), updateUserRole);
module.exports = router;