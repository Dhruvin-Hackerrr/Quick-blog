/*
  Warnings:

  - Added the required column `slugDisplay` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "slugDisplay" TEXT NOT NULL;
