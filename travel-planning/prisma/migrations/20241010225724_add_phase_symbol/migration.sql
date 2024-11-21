/*
  Warnings:

  - Added the required column `symbol` to the `phases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phases" ADD COLUMN     "symbol" VARCHAR(50) NOT NULL;
