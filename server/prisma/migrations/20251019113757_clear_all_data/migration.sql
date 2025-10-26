/*
  Warnings:

  - You are about to drop the column `gameTypeId` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `GameType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GameType` table. All the data in the column will be lost.
  - Added the required column `type` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Game_type_fkey" FOREIGN KEY ("type") REFERENCES "GameType" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("createdAt", "id", "status") SELECT "createdAt", "id", "status" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_GameType" (
    "name" TEXT NOT NULL
);
INSERT INTO "new_GameType" ("name") SELECT "name" FROM "GameType";
DROP TABLE "GameType";
ALTER TABLE "new_GameType" RENAME TO "GameType";
CREATE UNIQUE INDEX "GameType_name_key" ON "GameType"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
