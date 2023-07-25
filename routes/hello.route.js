const express = require('express');
const { helloController } = require('../controllers');

const router = express.Router();

router.get('/hello', helloController.hello);

module.exports = router;
