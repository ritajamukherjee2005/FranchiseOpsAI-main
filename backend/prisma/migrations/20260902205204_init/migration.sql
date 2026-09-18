-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'REGIONAL_MANAGER', 'OUTLET_MANAGER');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('ONLINE', 'SOCIAL_MEDIA', 'IN_STORE', 'LOYALTY', 'SEASONAL', 'EMAIL', 'PARTNERSHIP');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('OPERATIONAL', 'HYGIENE', 'SAFETY', 'COMPLIANCE', 'INVENTORY');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('PASS', 'FAIL', 'PARTIAL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('INVENTORY', 'SALES', 'STAFF', 'AUDIT', 'MARKETING');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateTable
CREATE TABLE "franchises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "franchises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OUTLET_MANAGER',
    "region" TEXT,
    "franchiseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "salary" DECIMAL(12,2) NOT NULL,
    "shift" "ShiftType" NOT NULL DEFAULT 'MORNING',
    "attendanceRate" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "franchiseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "checkIn" TEXT,
    "checkOut" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retail_transactions" (
    "id" TEXT NOT NULL,
    "billId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "storeType" TEXT NOT NULL,
    "visitDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retail_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL DEFAULT 'ONLINE',
    "outletName" TEXT NOT NULL,
    "city" TEXT,
    "targetAudience" TEXT,
    "productCategory" TEXT,
    "franchiseId" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "budget" DECIMAL(12,2) NOT NULL,
    "revenueGenerated" DECIMAL(12,2) NOT NULL,
    "customersReached" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits" (
    "id" TEXT NOT NULL,
    "auditCode" TEXT NOT NULL,
    "outletName" TEXT NOT NULL,
    "city" TEXT,
    "auditorName" TEXT NOT NULL,
    "auditorId" TEXT,
    "auditDate" DATE NOT NULL,
    "auditType" "AuditType" NOT NULL DEFAULT 'OPERATIONAL',
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "compliancePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "franchiseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_checklist_items" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'PASS',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL DEFAULT 'INVENTORY',
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "outletName" TEXT,
    "franchiseId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_staffId_key" ON "staff"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- CreateIndex
CREATE INDEX "staff_franchiseId_idx" ON "staff"("franchiseId");

-- CreateIndex
CREATE INDEX "staff_status_idx" ON "staff"("status");

-- CreateIndex
CREATE INDEX "staff_department_idx" ON "staff"("department");

-- CreateIndex
CREATE INDEX "attendance_records_date_idx" ON "attendance_records"("date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_staffId_date_key" ON "attendance_records"("staffId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "retail_transactions_billId_key" ON "retail_transactions"("billId");

-- CreateIndex
CREATE INDEX "retail_transactions_city_idx" ON "retail_transactions"("city");

-- CreateIndex
CREATE INDEX "retail_transactions_storeType_idx" ON "retail_transactions"("storeType");

-- CreateIndex
CREATE INDEX "retail_transactions_visitDate_idx" ON "retail_transactions"("visitDate");

-- CreateIndex
CREATE INDEX "marketing_campaigns_franchiseId_idx" ON "marketing_campaigns"("franchiseId");

-- CreateIndex
CREATE INDEX "marketing_campaigns_status_idx" ON "marketing_campaigns"("status");

-- CreateIndex
CREATE INDEX "marketing_campaigns_type_idx" ON "marketing_campaigns"("type");

-- CreateIndex
CREATE UNIQUE INDEX "audits_auditCode_key" ON "audits"("auditCode");

-- CreateIndex
CREATE INDEX "audits_franchiseId_idx" ON "audits"("franchiseId");

-- CreateIndex
CREATE INDEX "audits_status_idx" ON "audits"("status");

-- CreateIndex
CREATE INDEX "audits_auditType_idx" ON "audits"("auditType");

-- CreateIndex
CREATE INDEX "audit_checklist_items_auditId_idx" ON "audit_checklist_items"("auditId");

-- CreateIndex
CREATE INDEX "alerts_franchiseId_idx" ON "alerts"("franchiseId");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "alerts_type_idx" ON "alerts"("type");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_checklist_items" ADD CONSTRAINT "audit_checklist_items_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "audits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
