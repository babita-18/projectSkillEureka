const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController'); // ✅ THIS LINE IS REQUIRED

router.post('/login', authController.login);

module.exports = router;
