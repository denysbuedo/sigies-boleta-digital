-- CreateTable
CREATE TABLE "boletas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boletas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boleta_preferences" (
    "id" TEXT NOT NULL,
    "boletaId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "careerName" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "universityAbbr" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boleta_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boletas_userId_key" ON "boletas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "boleta_preferences_boletaId_position_key" ON "boleta_preferences"("boletaId", "position");

-- AddForeignKey
ALTER TABLE "boletas" ADD CONSTRAINT "boletas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boleta_preferences" ADD CONSTRAINT "boleta_preferences_boletaId_fkey" FOREIGN KEY ("boletaId") REFERENCES "boletas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
