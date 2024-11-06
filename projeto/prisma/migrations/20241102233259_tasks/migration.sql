-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "dateLimit" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_order_key" ON "Task"("order");
