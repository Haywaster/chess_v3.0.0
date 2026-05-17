/*
  Warnings:

  - Added the required column `mode` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckersGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "figures" TEXT NOT NULL DEFAULT '[]',
    "currentTurn" TEXT,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL,
    CONSTRAINT "CheckersGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckersGame" ("currentTurn", "figures", "gameId", "id", "moveCount") SELECT "currentTurn", "figures", "gameId", "id", "moveCount" FROM "CheckersGame";
DROP TABLE "CheckersGame";
ALTER TABLE "new_CheckersGame" RENAME TO "CheckersGame";
CREATE UNIQUE INDEX "CheckersGame_gameId_key" ON "CheckersGame"("gameId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
