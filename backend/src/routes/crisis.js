const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getCrisisResources, reportCrisis } = require('../controllers/crisisController');

const router = express.Router();

const validateCrisisReport = [
  body('severity').isIn(['low', 'medium', 'high', 'critical']),
  body('description').trim().isLength({ min: 1 }),
  body('immediateHelp').isBoolean()
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/resources', getCrisisResources);
router.post('/report', authenticateToken, validateCrisisReport, handleValidation, reportCrisis);

module.exports = router;
