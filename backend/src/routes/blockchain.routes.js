const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchain.service');

router.get('/network-info', async (req, res) => {
  try {
    const networkInfo = blockchainService.getNetworkInfo();
    res.json({
      success: true,
      data: networkInfo
    });
  } catch (error) {
    console.error('Error getting network info:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving network information',
      error: error.message
    });
  }
});

router.get('/verify-transaction/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({
        success: false,
        message: 'Transaction hash is required'
      });
    }

    const verification = await blockchainService.verifyTransaction(hash);
    
    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying transaction',
      error: error.message
    });
  }
});

module.exports = router;
