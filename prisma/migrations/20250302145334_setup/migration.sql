-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accessType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "deck_has_card" (
    "cardId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,

    PRIMARY KEY ("cardId", "deckId"),
    CONSTRAINT "deck_has_card_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "deck_has_card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "decks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "decks_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "winnerId" TEXT,
    "finishedAt" DATETIME,
    "currentTurn" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "players" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "turns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "turn" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "turns_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "turn_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "masterActionId" TEXT,
    "turnId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actionDescription" JSONB NOT NULL,
    "actionResult" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "turn_history_masterActionId_fkey" FOREIGN KEY ("masterActionId") REFERENCES "turn_history" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "turn_history_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "turns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "turn_history_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "players_in_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "life" REAL NOT NULL DEFAULT 30,
    "remainingCardsInDeck" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "players_in_match_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "players_in_match_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "current_card_state" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "position" REAL NOT NULL,
    "attackModification" REAL,
    "deffenseModification" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "current_card_state_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "current_card_state_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players_in_match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "players_email_key" ON "players"("email");
