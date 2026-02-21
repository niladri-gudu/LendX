-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'BORROW', 'REPAY', 'LIQUIDATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collateralEth" DECIMAL(38,18) NOT NULL,
    "debtUsdc" DECIMAL(38,6) NOT NULL,
    "collateralUsd" DECIMAL(38,6) NOT NULL,
    "healthFactor" DECIMAL(38,18) NOT NULL,
    "ltv" DECIMAL(10,4) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "userId" TEXT,
    "action" "ActionType" NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liquidation" (
    "id" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "liquidatorId" TEXT NOT NULL,
    "repayAmount" DECIMAL(38,6) NOT NULL,
    "collateralSeized" DECIMAL(38,18) NOT NULL,
    "bonusUsd" DECIMAL(38,6) NOT NULL,
    "txHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Liquidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocalStats" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tvlUsd" DECIMAL(38,6) NOT NULL,
    "totalBorrowUsd" DECIMAL(38,6) NOT NULL,
    "utilization" DECIMAL(10,4) NOT NULL,
    "liquidationCount" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProtocalStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OraclePrice" (
    "id" TEXT NOT NULL,
    "priceUsd" DECIMAL(38,8) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OraclePrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Position_userId_key" ON "Position"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Liquidation_txHash_key" ON "Liquidation"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocalStats_date_key" ON "ProtocalStats"("date");

-- CreateIndex
CREATE INDEX "OraclePrice_timestamp_idx" ON "OraclePrice"("timestamp");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidation" ADD CONSTRAINT "Liquidation_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidation" ADD CONSTRAINT "Liquidation_liquidatorId_fkey" FOREIGN KEY ("liquidatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
