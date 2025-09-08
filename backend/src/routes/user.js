const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getProfile, updateProfile, getDashboard, deleteAccount } = require('../controllers/userController');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);
router.delete('/account', deleteAccount);

module.exports = router;
