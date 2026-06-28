-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameParticipant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "playerId" INTEGER,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GameParticipant_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GameParticipant" ("gameId", "id", "joinedAt", "playerId") SELECT "gameId", "id", "joinedAt", "playerId" FROM "GameParticipant";
DROP TABLE "GameParticipant";
ALTER TABLE "new_GameParticipant" RENAME TO "GameParticipant";
CREATE INDEX "GameParticipant_gameId_idx" ON "GameParticipant"("gameId");
CREATE INDEX "GameParticipant_playerId_idx" ON "GameParticipant"("playerId");
CREATE UNIQUE INDEX "GameParticipant_gameId_playerId_key" ON "GameParticipant"("gameId", "playerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
