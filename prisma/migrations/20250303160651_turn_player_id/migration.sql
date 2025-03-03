/*
  Warnings:

  - Added the required column `playerId` to the `turns` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_turns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "turn" REAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "turns_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "turns_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_turns" ("createdAt", "id", "matchId", "status", "turn", "updatedAt") SELECT "createdAt", "id", "matchId", "status", "turn", "updatedAt" FROM "turns";
DROP TABLE "turns";
ALTER TABLE "new_turns" RENAME TO "turns";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
