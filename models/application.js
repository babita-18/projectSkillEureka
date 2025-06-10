// backend/routes/application.js
const router = require('express').Router();
const { apply } = require('../controllers/applicationController');

router.post('/apply', apply);

module.exports = router;
