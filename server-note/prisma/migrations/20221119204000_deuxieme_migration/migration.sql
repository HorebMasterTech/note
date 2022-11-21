/*
  Warnings:

  - You are about to drop the column `auteurId` on the `Note` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "contenu" TEXT DEFAULT '',
    "couleur" TEXT DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Note" ("contenu", "couleur", "createdAt", "id", "titre", "updatedAt") SELECT "contenu", "couleur", "createdAt", "id", "titre", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE UNIQUE INDEX "Note_titre_key" ON "Note"("titre");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
