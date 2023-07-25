const { prisma } = require('../services/prisma.service');
const { decodeInputData } = require('../services/input-decoder.service');

const { isEmptyObject } = require('../utils');

const getAllBlocks = async (req, res, next) => {
  const { amount, fields } = req.query;

  const blockFields = {};

  try {
    if (fields?.blocks) {
      const blocks = fields.blocks.split(',');

      for (const fieldName of blocks) {
        if (fieldName) {
          blockFields[fieldName] = true;
        }
      }
    }

    if (amount) {
      const parsedAmount = parseInt(amount);

      if (!parsedAmount) {
        return res.status(400).json({
          code: 400,
          status: 'BAD_REQUEST',
          errors: {
            message: 'Invalid amount'
          },
        });
      }

      const blocks = await prisma.blocks.findMany({
        ...!isEmptyObject(blockFields) && { select: blockFields },
        take: parsedAmount,
        orderBy: {
          number: 'desc',
        }
      });

      if (!blocks.length) {
        return res.status(404).json({
          code: 404,
          status: 'NOT_FOUND',
          errors: {
            message: 'Blocks does not exist'
          },
        });
      }

      const trxs = await prisma.transactions.findMany({
        select: { blockNumber: true },
        orderBy: {
          blockNumber: 'desc',
        }
      });

      for (const block of blocks) {
        block.transactionsCount = trxs.filter((trx) => trx.blockNumber === block.number).length;
      }

      return res.status(200).json({
        code: 200,
        status: 'OK',
        data: blocks,
      });
    }

    const blocks = await prisma.blocks.findMany({
      ...!isEmptyObject(blockFields) && { select: blockFields },
      orderBy: {
        number: 'desc',
      }
    });

    if (!blocks.length) {
      return res.status(404).json({
        code: 404,
        status: 'NOT_FOUND',
        errors: {
          message: 'Blocks does not exist'
        },
      });
    }

    const trxs = await prisma.transactions.findMany({
      select: { blockNumber: true },
      orderBy: {
        blockNumber: 'desc',
      }
    });

    for (const block of blocks) {
      block.transactionsCount = trxs.filter((trx) => trx.blockNumber === block.number).length;
    }

    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: blocks,
    });
  } catch (error) {
    next(error);
  }
};

const getBlockDetails = async (req, res, next) => {
  const { blockId } = req.params;

  if (!blockId) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Missing block id'
      },
    });
  }

  const blockByHash = await prisma.blocks.findUnique({
    where: {
      hash: blockId,
    }
  });

  if (blockByHash) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: blockByHash,
    });
  }

  const parsedBlockNumber = parseInt(blockId);

  if (parsedBlockNumber < 0) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Invalid block number'
      },
    });
  }

  const blockByNumber = await prisma.blocks.findUnique({
    where: {
      number: parsedBlockNumber,
    },
  });

  if (blockByNumber) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: blockByNumber,
    });
  }

  return res.status(404).json({
    code: 404,
    status: 'NOT_FOUND',
    errors: {
      message: 'Block Id does not exist'
    },
  });
};

const getAllTrxs = async (req, res, next) => {
  const { amount, fields } = req.query;

  const transactionFields = {};

  try {
    if (fields?.transactions) {
      const transactions = fields.transactions.split(',');

      for (const fieldName of transactions) {
        if (fieldName) {
          transactionFields[fieldName] = true;
        }
      }
    }

    if (amount) {
      const parsedAmount = parseInt(amount);

      if (!parsedAmount) {
        return res.status(400).json({
          code: 400,
          status: 'BAD_REQUEST',
          errors: {
            message: 'Invalid amount'
          },
        });
      }

      const trxs = await prisma.transactions.findMany({
        ...!isEmptyObject(transactionFields) && { select: transactionFields },
        take: parsedAmount,
        orderBy: {
          blockNumber: 'desc',
        }
      });

      if (!trxs.length) {
        return res.status(404).json({
          code: 404,
          status: 'NOT_FOUND',
          errors: {
            message: 'Transactions does not exist'
          },
        });
      }

      return res.status(200).json({
        code: 200,
        status: 'OK',
        data: trxs,
      });
    }

    const transactions = await prisma.transactions.findMany({
      ...!isEmptyObject(transactionFields) && { select: transactionFields },
      orderBy: {
        blockNumber: 'desc',
      }
    });

    if (!transactions.length) {
      return res.status(404).json({
        code: 404,
        status: 'NOT_FOUND',
        errors: {
          message: 'Transactions does not exist'
        },
      });
    }

    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

const getTrx = async (req, res, next) => {
  const { transactionHash } = req.params;

  if (!transactionHash) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Missing transaction hash'
      },
    });
  }

  const trx = await prisma.transactions.findUnique({
    where: {
      hash: transactionHash,
    }
  });

  if (!trx) {
    return res.status(404).json({
      code: 404,
      status: 'NOT_FOUND',
      errors: {
        message: 'Transaction does not exist'
      },
    });
  }

  // Decode input data
  trx.decodedInput = decodeInputData(trx.input);

  return res.status(200).json({
    code: 200,
    status: 'OK',
    data: trx,
  });
};

const getTransactionInBlock = async (req, res, next) => {
  const { blockId } = req.params;

  if (!blockId) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Missing block id'
      },
    });
  }

  const transactionsByBlockHash = await prisma.transactions.findMany({
    where: {
      blockHash: blockId,
    },
    orderBy: {
      blockNumber: 'desc',
    }
  });

  if (transactionsByBlockHash.length) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: transactionsByBlockHash,
    });
  }

  const parsedBlockNumber = parseInt(blockId);

  if (parsedBlockNumber === 0) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: [],
    });
  }

  if (!parsedBlockNumber) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Invalid block id'
      },
    });
  }

  const transactionsByBlockNumber = await prisma.transactions.findMany({
    where: {
      blockNumber: parsedBlockNumber,
    },
    orderBy: {
      blockNumber: 'desc',
    }
  });

  if (transactionsByBlockNumber.length) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: transactionsByBlockNumber,
    });
  }

  return res.status(404).json({
    code: 404,
    status: 'NOT_FOUND',
    errors: {
      message: 'Transactions in this block number does not exist'
    },
  });
};

const getAllAddress = async (req, res, next) => {
  const addresses = await prisma.addresses.findMany();

  if (!addresses.length) {
    return res.status(404).json({
      code: 404,
      status: 'NOT_FOUND',
      errors: {
        message: 'Addresses does not exist'
      },
    });
  }

  return res.status(200).json({
    code: 200,
    status: 'OK',
    data: addresses,
  });
};

const getAddressDetails = async (req, res, next) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Missing address'
      },
    });
  }

  const addressDetails = await prisma.addresses.findUnique({
    where: {
      address,
    }
  });

  if (!addressDetails) {
    return res.status(404).json({
      code: 404,
      status: 'NOT_FOUND',
      errors: {
        message: 'Address does not exist'
      },
    });
  }

  return res.status(200).json({
    code: 200,
    status: 'OK',
    data: addressDetails,
  });
};

const getTransactionInAddress = async (req, res, next) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Missing address'
      },
    });
  }

  const transactions = await prisma.transactions.findMany({
    where: {
      OR: [
        {
          from: address,
        },
        {
          to: address,
        },
        {
          contractAddress: address,
        }
      ],
    },
    orderBy: {
      blockNumber: 'desc',
    }
  });

  if (!transactions.length) {
    return res.status(404).json({
      code: 404,
      status: 'NOT_FOUND',
      errors: {
        message: 'Transactions in this address does not exist'
      },
    });
  }

  return res.status(200).json({
    code: 200,
    status: 'OK',
    data: transactions,
  });
};

const search = async (req, res, next) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Missing key'
      },
    });
  }

  // Search for transaction hash
  const trx = await prisma.transactions.findUnique({
    where: {
      hash: key,
    },
  });

  if (trx) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      type: 'transaction',
      data: trx,
    });
  }

  // Search for block hash
  const block = await prisma.blocks.findUnique({
    where: {
      hash: key,
    },
  });

  if (block) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      type: 'block',
      data: block,
    });
  }

  // Search for address
  const address = await prisma.addresses.findUnique({
    where: {
      address: key,
    },
  });

  if (address) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      type: 'address',
      data: address,
    });
  }

  // Search for block number
  const parsedBlockNumber = parseInt(key);

  if (parsedBlockNumber < 0) {
    return res.status(400).json({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        message: 'Invalid block number'
      },
    });
  }

  const blockByNumber = await prisma.blocks.findUnique({
    where: {
      number: parsedBlockNumber,
    },
  });

  if (blockByNumber) {
    return res.status(200).json({
      code: 200,
      status: 'OK',
      type: 'block',
      data: blockByNumber,
    });
  }

  return res.status(404).json({
    code: 404,
    status: 'NOT_FOUND',
    errors: {
      message: 'Key does not exist'
    },
  });
};

module.exports = {
  getAllBlocks,
  getAllTrxs,
  getTrx,
  getBlockDetails,
  getTransactionInBlock,
  getAllAddress,
  getAddressDetails,
  getTransactionInAddress,
  search,
};
