-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `nonce` INTEGER NOT NULL,
    `blockHash` VARCHAR(191) NOT NULL,
    `blockNumber` INTEGER NOT NULL,
    `transactionIndex` INTEGER NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `gasPrice` VARCHAR(191) NOT NULL,
    `gas` INTEGER NOT NULL,
    `input` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `transactions_hash_key`(`hash`),
    UNIQUE INDEX `transactions_blockHash_key`(`blockHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
