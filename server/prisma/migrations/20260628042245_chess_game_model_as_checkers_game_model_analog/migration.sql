/*
  Warnings:

  - Added the required column `mode` to the `ChessGame` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChessGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "board" JSONB,
    "currentTurn" TEXT,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL,
    CONSTRAINT "ChessGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChessGame" ("gameId", "id") SELECT "gameId", "id" FROM "ChessGame";
DROP TABLE "ChessGame";
ALTER TABLE "new_ChessGame" RENAME TO "ChessGame";
CREATE UNIQUE INDEX "ChessGame_gameId_key" ON "ChessGame"("gameId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
