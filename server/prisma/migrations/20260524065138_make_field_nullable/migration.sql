/*
  Warnings:

  - You are about to drop the column `figures` on the `CheckersGame` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckersGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "board" JSONB,
    "currentTurn" TEXT,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL,
    CONSTRAINT "CheckersGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckersGame" ("currentTurn", "gameId", "id", "mode", "moveCount") SELECT "currentTurn", "gameId", "id", "mode", "moveCount" FROM "CheckersGame";
DROP TABLE "CheckersGame";
ALTER TABLE "new_CheckersGame" RENAME TO "CheckersGame";
CREATE UNIQUE INDEX "CheckersGame_gameId_key" ON "CheckersGame"("gameId");
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameTypeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    CONSTRAINT "Game_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "GameType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("finishedAt", "gameTypeId", "id", "startedAt", "status") SELECT "finishedAt", "gameTypeId", "id", "startedAt", "status" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
