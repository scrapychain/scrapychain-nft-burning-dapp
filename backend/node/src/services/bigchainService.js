const { Connection } = require('bigchaindb-driver');

// Configure BigChainDB connection
const bigchainDBConfig = {
  endpoint: process.env.BIGCHAINDB_ENDPOINT || 'http://localhost:9984/api/v1/',
  appId: process.env.BIGCHAINDB_APP_ID || '',
  appKey: process.env.BIGCHAINDB_APP_KEY || '',
};

const connection = new Connection(bigchainDBConfig.endpoint, {
  app_id: bigchainDBConfig.appId,
  app_key: bigchainDBConfig.appKey,
});

// Fetch user data from BigChainDB
exports.getUserData = async (walletAddress) => {
  try {
    // Query the database for user data by wallet address
    const assets = await connection.searchAssets(walletAddress);

    if (assets.length === 0) {
      return null; // User not found
    }

    // Assuming the latest asset contains the most recent user data
    return assets[assets.length - 1].data;
  } catch (error) {
    console.error('Error fetching user data from BigChainDB:', error.message);
    throw new Error('Failed to fetch user data');
  }
};

// Update or create user data in BigChainDB
exports.updateUserData = async (walletAddress, updates) => {
  try {
    // Fetch existing data for the user
    const existingUserData = await this.getUserData(walletAddress);

    // Merge updates with existing data
    const newUserData = {
      walletAddress,
      ...existingUserData,
      ...updates,
    };

    // Create a new BigChainDB transaction for the updated user data
    const transaction = await connection.createTransaction(
      {
        data: newUserData,
      },
      walletAddress // Using walletAddress as the asset's unique identifier
    );

    // Send the transaction to BigChainDB
    await connection.postTransactionCommit(transaction);

    return newUserData;
  } catch (error) {
    console.error('Error updating user data in BigChainDB:', error.message);
    throw new Error('Failed to update user data');
  }
};
