const express = require('express');
const router = express.Router();
const burnController = require('../controllers/burnController');

// Route to burn NFTs
router.post('/', burnController.burnNFTs);

module.exports = router;
