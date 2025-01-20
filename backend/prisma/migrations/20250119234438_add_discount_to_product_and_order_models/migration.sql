-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "finalAmount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "isDiscounted" BOOLEAN NOT NULL DEFAULT false;
