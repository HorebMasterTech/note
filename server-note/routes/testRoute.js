const express = require('express');
const { Test } = require('../controllers/testController');

const router = express.Router();

router.get('/mon-test', Test);

module.exports = router;