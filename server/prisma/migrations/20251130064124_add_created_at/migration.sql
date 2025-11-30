/*
  Warnings:

  - You are about to drop the `PlayerGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lastMove` on the `CheckersGame` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - Added the required column `gameId` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `ChessGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameTypeId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `GameType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPlayers` to the `GameType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlayerGame";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "GameParticipant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GameParticipant_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameWithColorParticipant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "color" TEXT NOT NULL,
    "participantId" INTEGER NOT NULL,
    CONSTRAINT "GameWithColorParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "GameParticipant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckersGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "figures" TEXT NOT NULL DEFAULT '[]',
    "currentTurn" TEXT,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CheckersGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckersGame" ("figures", "id") SELECT "figures", "id" FROM "CheckersGame";
DROP TABLE "CheckersGame";
ALTER TABLE "new_CheckersGame" RENAME TO "CheckersGame";
CREATE UNIQUE INDEX "CheckersGame_gameId_key" ON "CheckersGame"("gameId");
CREATE TABLE "new_ChessGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    CONSTRAINT "ChessGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChessGame" ("id") SELECT "id" FROM "ChessGame";
DROP TABLE "ChessGame";
ALTER TABLE "new_ChessGame" RENAME TO "ChessGame";
CREATE UNIQUE INDEX "ChessGame_gameId_key" ON "ChessGame"("gameId");
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameTypeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    CONSTRAINT "Game_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "GameType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("id", "status") SELECT "id", "status" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_GameType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "minPlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER,
    "description" TEXT
);
INSERT INTO "new_GameType" ("name") SELECT "name" FROM "GameType";
DROP TABLE "GameType";
ALTER TABLE "new_GameType" RENAME TO "GameType";
CREATE UNIQUE INDEX "GameType_name_key" ON "GameType"("name");
CREATE TABLE "new_RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RefreshToken" ("id") SELECT "id" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");
CREATE UNIQUE INDEX "RefreshToken_refreshToken_key" ON "RefreshToken"("refreshToken");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("id", "login", "password") SELECT "id", "login", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "GameParticipant_gameId_idx" ON "GameParticipant"("gameId");

-- CreateIndex
CREATE INDEX "GameParticipant_playerId_idx" ON "GameParticipant"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "GameParticipant_gameId_playerId_key" ON "GameParticipant"("gameId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "GameWithColorParticipant_participantId_key" ON "GameWithColorParticipant"("participantId");
