CREATE TABLE IF NOT EXISTS "public"."managed_ai_usage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "featureKey" TEXT NOT NULL,
  "periodKey" TEXT NOT NULL,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "limitCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "managed_ai_usage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "managed_ai_usage_userId_featureKey_periodKey_key"
ON "public"."managed_ai_usage"("userId", "featureKey", "periodKey");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'managed_ai_usage_userId_fkey'
  ) THEN
    ALTER TABLE "public"."managed_ai_usage"
    ADD CONSTRAINT "managed_ai_usage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
