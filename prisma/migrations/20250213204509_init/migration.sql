-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Startup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("id")
);
