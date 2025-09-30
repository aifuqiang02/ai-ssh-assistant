-- AlterTable
ALTER TABLE "ssh_connections" ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ssh_folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ssh_folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ssh_folders" ADD CONSTRAINT "ssh_folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ssh_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ssh_folders" ADD CONSTRAINT "ssh_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ssh_connections" ADD CONSTRAINT "ssh_connections_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "ssh_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
