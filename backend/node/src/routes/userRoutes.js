const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Fetch user data
router.get('/:wallet', userController.getUserData);

// Update or create user data
router.post('/update', userController.updateUserData);

module.exports = router;
