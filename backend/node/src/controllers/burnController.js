const axios = require('axios'); // For any API interaction, if needed
const bigchainService = require('../services/bigchainService'); // BigChainDB integration
const polygonService = require('../services/polygonService'); // Interaction with Polygon smart contracts

// Burn NFTs and update points
exports.burnNFTs = async (req, res) => {
  try {
    const { walletAddress, tokenIds, collectionSlug } = req.body;

    if (!walletAddress || !tokenIds || !collectionSlug) {
      return res.status(400).json({
        error: 'Wallet address, token IDs, and collection slug are required',
      });
    }

    // Step 1: Interact with Polygon to burn NFTs
    const burnResult = await polygonService.burnNFTs(walletAddress, tokenIds);
    if (!burnResult.success) {
      return res.status(500).json({ error: 'Failed to burn NFTs on Polygon' });
    }

    // Step 2: Calculate points based on the collection
    const pointsMap = {
      'scrapy-nft': 10,
      'scrapy-nfts-season-2': 20,
      'scrapy-nfts-ai-venture': 50,
      'scrapy-3d-drops': 100,
    };
    const pointsPerNFT = pointsMap[collectionSlug.toLowerCase()] || 0;
    const totalPoints = pointsPerNFT * tokenIds.length;

    // Step 3: Update user points and burn history in BigChainDB
    const burnHistory = tokenIds.map((tokenId) => ({
      tokenId,
      collection: collectionSlug,
      points: pointsPerNFT,
      burnedAt: new Date().toISOString(),
    }));

    const updatedUser = await bigchainService.updateUserData(walletAddress, {
      points: totalPoints,
      burnHistory: burnHistory,
    });

    // Step 4: Return success response
    res.status(200).json({
      message: 'NFTs burned successfully',
      burnedNFTs: tokenIds,
      totalPointsEarned: totalPoints,
      userData: updatedUser,
    });
  } catch (error) {
    console.error('Error burning NFTs:', error.message);
    res.status(500).json({ error: error.message });
  }
};
