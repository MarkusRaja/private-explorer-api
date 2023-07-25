/*
  Warnings:

  - You are about to drop the `block` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
-- DROP TABLE `block`;

-- CreateTable
CREATE TABLE `blocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blocks_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
