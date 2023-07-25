/*
  Warnings:

  - You are about to alter the column `timestamp` on the `blocks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `blocks` MODIFY `timestamp` INTEGER NOT NULL;
