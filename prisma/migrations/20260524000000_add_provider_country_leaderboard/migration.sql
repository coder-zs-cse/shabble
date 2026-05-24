-- AlterTable: add auth provider fields and country to User
ALTER TABLE "User"
ADD COLUMN "name"       TEXT,
ADD COLUMN "email"      TEXT,
ADD COLUMN "provider"   TEXT,
ADD COLUMN "providerId" TEXT,
ADD COLUMN "countryCode" TEXT;

-- CreateIndex: composite unique on (provider, providerId)
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- AlterTable: add updatedAt to UserProgress
ALTER TABLE "UserProgress"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
