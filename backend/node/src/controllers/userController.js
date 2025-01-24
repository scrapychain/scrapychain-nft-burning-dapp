const axios = require('axios'); // If needed for external API calls
const bigchainService = require('../services/bigchainService'); // Your service for BigChainDB operations

// Fetch user data (e.g., points, burn history)
exports.getUserData = async (req, res) => {
  try {
    const walletAddress = req.params.wallet;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Fetch user data from BigChainDB
    const userData = await bigchainService.getUserData(walletAddress);

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create or update user data
exports.updateUserData = async (req, res) => {
  try {
    const walletAddress = req.body.walletAddress;
    const { name, points, burnHistory } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Update or create user data in BigChainDB
    const updatedData = await bigchainService.updateUserData(walletAddress, {
      name,
      points,
      burnHistory,
    });

    res.status(200).json({
      message: 'User data updated successfully',
      data: updatedData,
    });
  } catch (error) {
    console.error('Error updating user data:', error.message);
    res.status(500).json({ error: error.message });
  }
};
