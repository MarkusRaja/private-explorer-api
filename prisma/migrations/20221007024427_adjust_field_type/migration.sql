/*
  Warnings:

  - Added the required column `baseFeePerGas` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraData` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasLimit` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasUsed` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `miner` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentHash` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sha3Uncles` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateRoot` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDifficulty` to the `blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionsRoot` to the `blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blocks` ADD COLUMN `baseFeePerGas` INTEGER NOT NULL,
    ADD COLUMN `difficulty` VARCHAR(191) NOT NULL,
    ADD COLUMN `extraData` VARCHAR(191) NOT NULL,
    ADD COLUMN `gasLimit` INTEGER NOT NULL,
    ADD COLUMN `gasUsed` INTEGER NOT NULL,
    ADD COLUMN `logsBloom` VARCHAR(191) NULL,
    ADD COLUMN `miner` VARCHAR(191) NOT NULL,
    ADD COLUMN `nonce` VARCHAR(191) NULL,
    ADD COLUMN `parentHash` VARCHAR(191) NOT NULL,
    ADD COLUMN `sha3Uncles` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL,
    ADD COLUMN `stateRoot` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalDifficulty` VARCHAR(191) NOT NULL,
    ADD COLUMN `transactionsRoot` VARCHAR(191) NOT NULL,
    MODIFY `number` INTEGER NULL,
    MODIFY `hash` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transactions` MODIFY `blockHash` VARCHAR(191) NULL,
    MODIFY `blockNumber` INTEGER NULL,
    MODIFY `transactionIndex` INTEGER NULL;
