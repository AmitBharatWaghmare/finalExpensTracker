const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();


router.post('/signup', userController.Signup);

router.post('/login', userController.Login)

module.exports = router;

