/*
  Warnings:

  - Changed the type of `body` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'PROGRAMMING', 'WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'AI_ML', 'DATA_SCIENCE', 'DESIGN', 'DEVOPS', 'SECURITY', 'STARTUPS', 'CAREER', 'LIFESTYLE', 'FINANCE', 'EDUCATION', 'PRODUCTIVITY');

-- Add category column
ALTER TABLE "Post"
ADD COLUMN "category" "Category"
NOT NULL DEFAULT 'PRODUCTIVITY';

-- Convert body String -> Json
ALTER TABLE "Post"
ALTER COLUMN "body" TYPE JSONB
USING jsonb_build_object('content', "body");