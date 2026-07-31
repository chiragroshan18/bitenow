const express = require('express');
const {
  register,
  login,
  refresh,
  logout,
  me,
} = require('../controllers/authExtendedController');
const validate = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
} = require('../validators/authValidators');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
