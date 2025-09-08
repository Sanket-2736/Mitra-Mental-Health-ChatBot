const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { sendMessage, getChatHistory, endSession } = require('../controllers/chatController');

const router = express.Router();

const validateMessage = [
  body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('sessionId').optional().isUUID()
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authenticateToken);

router.post('/message', validateMessage, handleValidation, sendMessage);
router.get('/history', getChatHistory);
router.post('/end-session', endSession);

module.exports = router;
