-- CreateTable
CREATE TABLE "public"."TwitchToken" (
    "id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwitchToken_pkey" PRIMARY KEY ("id")
);
