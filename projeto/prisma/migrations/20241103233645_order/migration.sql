-- DropIndex
DROP INDEX "Task_order_key";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "task_order_seq";
