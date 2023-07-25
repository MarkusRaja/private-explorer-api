# private-explorer-api

## Requirements

- MySQL database named `private_blockchain_explorer`
- RPC URL

## Endpoints

### Blocks

- `/api/explorer/blocks` Get all blocks.
- `/api/explorer/blocks?amount=<n>` Get a list of blocks based on the specified amount.
- `/api/explorer/blocks/<block_number_or_hash>` Get specific block details.
- `/api/explorer/blocks/<block_number_or_hash>/transactions` Get all transactions for specific block.

### Transactions

- `/api/explorer/transactions` Get all transactions.
- `/api/explorer/transactions?amount=<n>` Get a list of transactions based on the specified amount.
- `/api/explorer/transactions/<transaction_hash>` Get specific transaction details.

### Addresses

- `/api/explorer/addresses` Get all wallet or contract address the node controls.
- `/api/explorer/addresses/<address>` Get specific address details.
- `/api/explorer/addresses/<address>/transactions` Get all transactions for specific address.

### Search

- `/api/explorer/search?key=<search_key>` Search specific data. The **search_key** can be the transaction hash, block hash, block number, wallet address, or contract address.
