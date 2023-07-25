/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `blocks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `blocks_number_key` ON `blocks`(`number`);
