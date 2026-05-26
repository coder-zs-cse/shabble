-- CreateTable: UserStats (separating stats from identity)
CREATE TABLE "UserStats" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "totalStars" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "starDistribution" INTEGER[] NOT NULL DEFAULT '{0,0,0,0,0,0}',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique userId on UserStats
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- AddForeignKey: UserStats -> User
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing stats from User into UserStats
INSERT INTO "UserStats" ("userId", "played", "totalStars", "currentStreak", "bestStreak", "starDistribution", "updatedAt")
SELECT "id", "played", "totalStars", "currentStreak", "bestStreak", "starDistribution", CURRENT_TIMESTAMP
FROM "User";

-- AlterTable: add identity columns to User
ALTER TABLE "User"
    ADD COLUMN "name"        TEXT,
    ADD COLUMN "email"       TEXT,
    ADD COLUMN "provider"    TEXT,
    ADD COLUMN "providerId"  TEXT,
    ADD COLUMN "countryCode" TEXT;

-- CreateIndex: unique (provider, providerId) for OAuth upsert
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- AlterTable: drop stats columns from User (now live in UserStats)
ALTER TABLE "User"
    DROP COLUMN "played",
    DROP COLUMN "totalStars",
    DROP COLUMN "currentStreak",
    DROP COLUMN "bestStreak",
    DROP COLUMN "starDistribution";

-- AlterTable: add updatedAt to UserProgress
ALTER TABLE "UserProgress"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
