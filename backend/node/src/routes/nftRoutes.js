const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

// Fetch NFTs owned by a user for a specific collection
router.get('/user', nftController.getUserNFTs);

// Fetch all NFTs by collection
router.get('/collection', nftController.getAllNFTsByCollection);

module.exports = router;
