-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckersGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "board" JSONB,
    "currentTurn" TEXT NOT NULL DEFAULT 'white',
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL,
    CONSTRAINT "CheckersGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckersGame" ("board", "currentTurn", "gameId", "id", "mode", "moveCount") SELECT "board", coalesce("currentTurn", 'white') AS "currentTurn", "gameId", "id", "mode", "moveCount" FROM "CheckersGame";
DROP TABLE "CheckersGame";
ALTER TABLE "new_CheckersGame" RENAME TO "CheckersGame";
CREATE UNIQUE INDEX "CheckersGame_gameId_key" ON "CheckersGame"("gameId");
CREATE TABLE "new_ChessGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "board" JSONB,
    "currentTurn" TEXT NOT NULL DEFAULT 'white',
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL,
    CONSTRAINT "ChessGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChessGame" ("board", "currentTurn", "gameId", "id", "mode", "moveCount") SELECT "board", coalesce("currentTurn", 'white') AS "currentTurn", "gameId", "id", "mode", "moveCount" FROM "ChessGame";
DROP TABLE "ChessGame";
ALTER TABLE "new_ChessGame" RENAME TO "ChessGame";
CREATE UNIQUE INDEX "ChessGame_gameId_key" ON "ChessGame"("gameId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
