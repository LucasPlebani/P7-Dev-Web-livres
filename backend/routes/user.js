const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/user');
const userCtrl = require('../controllers/user')

router.post('/signup', bookCtrl.signup);
router.post('api/auth/login', userCtrl.login);

module.exports = router; 