const express = require('express');
const { explorerController } = require('../controllers');

const router = express.Router();

router.get('/blocks', explorerController.getAllBlocks);
router.get('/blocks/:blockId', explorerController.getBlockDetails);
router.get('/blocks/:blockId/transactions', explorerController.getTransactionInBlock);
router.get('/transactions', explorerController.getAllTrxs);
router.get('/transactions/:transactionHash', explorerController.getTrx);
router.get('/addresses', explorerController.getAllAddress);
router.get('/addresses/:address', explorerController.getAddressDetails);
router.get('/addresses/:address/transactions', explorerController.getTransactionInAddress);
router.get('/search', explorerController.search);

module.exports = router;
