exports.getUserNFTs = async (req, res) => {
    try {
      const { walletAddress, collectionSlug, limit, cursor } = req.query;
  
      // Validate input
      if (!walletAddress || !collectionSlug) {
        return res.status(400).json({
          error: 'Wallet address and collection slug are required',
        });
      }
  
      // Fetch NFTs from OpenSea API with pagination
      const response = await axios.get(
        `https://api.opensea.io/v2/accounts/${walletAddress}/nfts`,
        {
          params: {
            collection: collectionSlug,
            limit: limit || 20, // Default to 20 items per page if not specified
            cursor: cursor || null, // Use the cursor if provided
          },
          headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY },
        }
      );
  
      // Return the data and next cursor
      res.status(200).json({
        nfts: response.data.nfts,
        nextCursor: response.data.next, // Next cursor for pagination
      });
    } catch (error) {
      console.error('Error fetching user NFTs:', error.message);
      res.status(500).json({ error: error.message });
    }
  };

  exports.getAllNFTsByCollection = async (req, res) => {
    try {
      const { collectionSlug, limit, cursor } = req.query;
  
      // Validate input
      if (!collectionSlug) {
        return res.status(400).json({
          error: 'Collection slug is required',
        });
      }
  
      // Fetch NFTs from OpenSea API with pagination
      const response = await axios.get(
        `https://api.opensea.io/v2/collection/${collectionSlug}/nfts`,
        {
          params: {
            limit: limit || 20, // Default to 20 items per page
            cursor: cursor || null, // Use the cursor if provided
          },
          headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY },
        }
      );
  
      // Return the data and next cursor
      res.status(200).json({
        nfts: response.data.nfts,
        nextCursor: response.data.next, // Next cursor for pagination
      });
    } catch (error) {
      console.error('Error fetching NFTs by collection:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  