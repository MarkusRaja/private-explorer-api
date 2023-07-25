-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `balance` VARCHAR(191) NOT NULL DEFAULT '0',
    `isContract` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `addresses_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
