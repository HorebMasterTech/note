-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "contenu" TEXT DEFAULT '',
    "couleur" TEXT DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "auteurId" TEXT,
    CONSTRAINT "Note_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("contenu", "couleur", "createdAt", "id", "titre", "updatedAt") SELECT "contenu", "couleur", "createdAt", "id", "titre", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE UNIQUE INDEX "Note_titre_key" ON "Note"("titre");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
