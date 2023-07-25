const Web3 = require('web3');
const environments = require('./environments');
const { prisma } = require('./services/prisma.service');

const provider = environments.WEB3_PROVIDER_URL;
const web3 = new Web3(provider);

const getBlockByNumber = async (blockNumber) => {
  try {
    const block = await web3.eth.getBlock(blockNumber);

    return {
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      baseFeePerGas: block.baseFeePerGas,
      nonce: block.nonce,
      sha3Uncles: block.sha3Uncles,
      logsBloom: block.logsBloom,
      transactionsRoot: block.transactionsRoot,
      stateRoot: block.stateRoot,
      miner: block.miner,
      difficulty: block.difficulty,
      totalDifficulty: block.totalDifficulty,
      extraData: block.extraData,
      size: block.size,
      gasLimit: block.gasLimit,
      gasUsed: block.gasUsed,
      timestamp: block.timestamp,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get block data from blockchain (${blockNumber})`);
  }
};

const getLatestBlockDb = async () => {
  try {
    const [latestBlockDb] = await prisma.blocks.findMany({
      orderBy: {
        number: 'desc',
      },
      take: 1,
    });

    return latestBlockDb;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get latest block from DB');
  }
};

const fetchAllBlocks = async () => {
  try {
    const blocks = [];

    // Get the latest block number from blockchain
    const latestBlockNumber = await web3.eth.getBlockNumber();

    // Get the latest block recorded from DB
    const latestBlockDb = await getLatestBlockDb();

    /**
     * Insert a new block record to DB
     * because the blocks table is still empty
     */
    if (!latestBlockDb) {
      for (let i = 0; i <= latestBlockNumber; i++) {
        const block = await getBlockByNumber(i);

        blocks.push(block);
      }

      await prisma.blocks.createMany({
        data: blocks,
        skipDuplicates: true,
      });
      return;
    }

    // Skip if the latest block recorded from DB is the latest block from blockchain
    if (latestBlockNumber === latestBlockDb.number) {
      return;
    }

    /**
     * Insert new block records to DB
     * starting from the latest block recorded + 1 from DB
     * until the latest block from blockchain
     */
    for (let i = latestBlockDb.number + 1; i <= latestBlockNumber; i++) {
      const block = await getBlockByNumber(i);

      blocks.push(block);
    }

    await prisma.blocks.createMany({
      data: blocks,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(error?.message ?? error);
  }
};

const getTransactionsFromBlock = async (blockNumber) => {
  try {
    const { transactions } = await web3.eth.getBlock(blockNumber, true);
    const trxs = [];

    if (!transactions.length) {
      return;
    }

    for (const trx of transactions) {
      const { contractAddress } = await web3.eth.getTransactionReceipt(trx.hash);

      trxs.push({
        blockHash: trx.blockHash,
        blockNumber: trx.blockNumber,
        from: trx.from,
        gas: trx.gas,
        gasPrice: trx.gasPrice,
        hash: trx.hash,
        input: trx.input,
        nonce: trx.nonce,
        to: trx.to,
        contractAddress: contractAddress,
        transactionIndex: trx.transactionIndex,
        value: trx.value,
      });
    }

    return trxs;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get transactions from block (${blockNumber})`);
  }
};

const fetchAllTransactions = async () => {
  try {
    const transactions = [];

    // Get all blocks data from DB
    const blocks = await prisma.blocks.findMany();

    if (!blocks.length) {
      return;
    }

    /**
     * Get all transactions from each block
     * and insert them into DB only if the transaction
     * is not recorded in DB yet
     */
    for (const { number: blockNumber } of blocks) {
      const trxs = await getTransactionsFromBlock(blockNumber);

      // Skip if there is no transaction in the block
      if (!trxs) {
        continue;
      }

      // Search all transaction hashes in the database
      const trxHashes = trxs.map((trx) => trx.hash);
      const trxHashesDb = await prisma.transactions.findMany({
        where: {
          hash: {
            in: trxHashes,
          },
        },
        select: {
          hash: true,
        },
      });

      for (const trx of trxs) {
        if (!trxHashesDb.find((trxDb) => trxDb.hash === trx.hash)) {
          transactions.push(trx);
        }
      }
    }

    await prisma.transactions.createMany({
      data: transactions,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(error?.message ?? error);
  }
};

const fetchAllAddresses = async () => {
  try {
    const addresses = [];

    const transactions = await prisma.transactions.findMany();

    if (!transactions.length) {
      return;
    }

    const addrs = await prisma.addresses.findMany();

    for (const { from, to, contractAddress } of transactions) {
      if (from && !addresses.find((addr) => addr.address === from) && !addrs.find((addr) => addr.address === from)) {
        const balance = await web3.eth.getBalance(from);
        addresses.push({ address: from, balance });
      }

      if (to && !addresses.find((addr) => addr.address === to) && !addrs.find((addr) => addr.address === to)) {
        const balance = await web3.eth.getBalance(to);
        addresses.push({ address: to, balance });
      }

      if (contractAddress && !addresses.find((addr) => addr.address === contractAddress) && !addrs.find((addr) => addr.address === contractAddress)) {
        const balance = await web3.eth.getBalance(contractAddress);
        addresses.push({ address: contractAddress, balance, isContract: true });
      }
    }

    await prisma.addresses.createMany({
      data: addresses,
      skipDuplicates: true,
    });

    if (!addrs.length) {
      return;
    }

    // Update balance for each address in database
    const updatedAddrs = [];

    for (const { address } of addrs) {
      const balance = await web3.eth.getBalance(address);

      updatedAddrs.push({ address, balance });
    }

    // Update balance for each address in database
    await prisma.$transaction(
      updatedAddrs.map((addr) =>
        prisma.addresses.update({
          where: {
            address: addr.address,
          },
          data: {
            balance: addr.balance,
          },
        })
      )
    );
  } catch (error) {
    console.error(error?.message ?? error);
  }
};

const fetch = async () => {
  await fetchAllBlocks();
  await fetchAllTransactions();
  await fetchAllAddresses();
};

module.exports = { fetch };
