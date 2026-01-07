-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GENERAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('PROBLEM', 'PLAN');

-- CreateTable
CREATE TABLE "sales_staff" (
    "sales_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "department" VARCHAR(50) NOT NULL,
    "position" VARCHAR(50),
    "manager_id" INTEGER,
    "role" "Role" NOT NULL DEFAULT 'GENERAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_staff_pkey" PRIMARY KEY ("sales_id")
);

-- CreateTable
CREATE TABLE "daily_report" (
    "report_id" SERIAL NOT NULL,
    "sales_id" INTEGER NOT NULL,
    "report_date" DATE NOT NULL,
    "problem" TEXT,
    "plan" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "visit_record" (
    "visit_id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "visit_content" TEXT NOT NULL,
    "visit_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visit_record_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" SERIAL NOT NULL,
    "customer_name" VARCHAR(50) NOT NULL,
    "company_name" VARCHAR(100) NOT NULL,
    "department" VARCHAR(50),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "comment_type" "CommentType" NOT NULL,
    "comment_content" TEXT NOT NULL,
    "commenter_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_staff_email_key" ON "sales_staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "daily_report_sales_id_report_date_key" ON "daily_report"("sales_id", "report_date");

-- AddForeignKey
ALTER TABLE "sales_staff" ADD CONSTRAINT "sales_staff_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "sales_staff"("sales_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report" ADD CONSTRAINT "daily_report_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "sales_staff"("sales_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_record" ADD CONSTRAINT "visit_record_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "daily_report"("report_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_record" ADD CONSTRAINT "visit_record_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "daily_report"("report_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_commenter_id_fkey" FOREIGN KEY ("commenter_id") REFERENCES "sales_staff"("sales_id") ON DELETE CASCADE ON UPDATE CASCADE;
