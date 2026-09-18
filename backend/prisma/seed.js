import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcrypt";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
let prisma;

if (connectionString) {
  try {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } catch (e) {
    prisma = new PrismaClient();
  }
} else {
  prisma = new PrismaClient();
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseVisitDate(value) {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

async function loadRetailTransactions() {
  const csvPath = path.resolve(process.cwd(), "../datasets/Indian Retail Store.csv");
  let csv;
  try {
    csv = await fs.readFile(csvPath, "utf8");
  } catch {
    console.warn("Dataset CSV not found at", csvPath, "- skipping retail transactions seeding.");
    return [];
  }
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return rows
    .filter(Boolean)
    .map((row) => {
      const values = parseCsvLine(row);
      const record = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
      return {
        billId: Number(record.bill_id),
        customerName: record.customer_name,
        city: record.city,
        productCategory: record.product_category,
        quantity: Number(record.quantity),
        totalAmount: Number(record.total_amount),
        paymentMethod: record.payment_method,
        storeType: record.store_type,
        visitDate: parseVisitDate(record.visit_date),
      };
    });
}

const franchises = [
  { name: "Anna Nagar Flagship", city: "Chennai", state: "Tamil Nadu", region: "South" },
  { name: "Indiranagar Central", city: "Bengaluru", state: "Karnataka", region: "South" },
  { name: "Bandra West", city: "Mumbai", state: "Maharashtra", region: "West" },
  { name: "Connaught Place", city: "New Delhi", state: "Delhi", region: "North" },
  { name: "Koramangala", city: "Bengaluru", state: "Karnataka", region: "South" },
  { name: "Salt Lake Sector V", city: "Kolkata", state: "West Bengal", region: "East" },
  { name: "Viman Nagar", city: "Pune", state: "Maharashtra", region: "West" },
  { name: "SG Highway", city: "Ahmedabad", state: "Gujarat", region: "West" },
];

const staffSeed = [
  { staffId: "STF-001", name: "Priya Sharma", email: "priya.sharma@franchiseops.ai", phone: "+91 98765 43210", department: "Operations", designation: "Store Manager", salary: 45000, shift: "MORNING", attendanceRate: 96, joiningDate: "2022-03-15", status: "ACTIVE", franchise: "Indiranagar Central" },
  { staffId: "STF-002", name: "Arjun Mehta", email: "arjun.mehta@franchiseops.ai", phone: "+91 98765 43211", department: "Kitchen", designation: "Head Chef", salary: 38000, shift: "AFTERNOON", attendanceRate: 92, joiningDate: "2021-08-20", status: "ACTIVE", franchise: "Bandra West" },
  { staffId: "STF-003", name: "Kavya Reddy", email: "kavya.reddy@franchiseops.ai", phone: "+91 98765 43212", department: "Sales", designation: "Cashier", salary: 22000, shift: "MORNING", attendanceRate: 98, joiningDate: "2023-01-10", status: "ACTIVE", franchise: "Anna Nagar Flagship" },
  { staffId: "STF-004", name: "Rahul Singh", email: "rahul.singh@franchiseops.ai", phone: "+91 98765 43213", department: "Operations", designation: "Shift Supervisor", salary: 32000, shift: "NIGHT", attendanceRate: 88, joiningDate: "2022-11-05", status: "ACTIVE", franchise: "Connaught Place" },
  { staffId: "STF-005", name: "Ananya Iyer", email: "ananya.iyer@franchiseops.ai", phone: "+91 98765 43214", department: "Customer Service", designation: "Team Lead", salary: 28000, shift: "FLEXIBLE", attendanceRate: 94, joiningDate: "2023-06-18", status: "ACTIVE", franchise: "Koramangala" },
  { staffId: "STF-006", name: "Vikram Das", email: "vikram.das@franchiseops.ai", phone: "+91 98765 43215", department: "Kitchen", designation: "Line Cook", salary: 24000, shift: "AFTERNOON", attendanceRate: 85, joiningDate: "2024-02-01", status: "ACTIVE", franchise: "Salt Lake Sector V" },
  { staffId: "STF-007", name: "Meera Patel", email: "meera.patel@franchiseops.ai", phone: "+91 98765 43216", department: "Sales", designation: "Sales Associate", salary: 20000, shift: "MORNING", attendanceRate: 91, joiningDate: "2023-09-12", status: "ACTIVE", franchise: "Viman Nagar" },
  { staffId: "STF-008", name: "Suresh Kumar", email: "suresh.kumar@franchiseops.ai", phone: "+91 98765 43217", department: "Operations", designation: "Delivery Executive", salary: 18000, shift: "FLEXIBLE", attendanceRate: 78, joiningDate: "2024-04-22", status: "INACTIVE", franchise: "SG Highway" },
  { staffId: "STF-009", name: "Deepa Nair", email: "deepa.nair@franchiseops.ai", phone: "+91 98765 43218", department: "HR", designation: "HR Coordinator", salary: 35000, shift: "MORNING", attendanceRate: 97, joiningDate: "2021-05-30", status: "ACTIVE", franchise: "Indiranagar Central" },
  { staffId: "STF-010", name: "Imran Khan", email: "imran.khan@franchiseops.ai", phone: "+91 98765 43219", department: "Finance", designation: "Accounts Executive", salary: 30000, shift: "MORNING", attendanceRate: 93, joiningDate: "2022-07-14", status: "ACTIVE", franchise: "Bandra West" },
  { staffId: "STF-011", name: "Lakshmi Venkatesh", email: "lakshmi.v@franchiseops.ai", phone: "+91 98765 43220", department: "Kitchen", designation: "Prep Cook", salary: 21000, shift: "MORNING", attendanceRate: 90, joiningDate: "2023-12-01", status: "ACTIVE", franchise: "Anna Nagar Flagship" },
  { staffId: "STF-012", name: "Amit Joshi", email: "amit.joshi@franchiseops.ai", phone: "+91 98765 43221", department: "Sales", designation: "Cashier", salary: 22000, shift: "AFTERNOON", attendanceRate: 82, joiningDate: "2024-01-15", status: "INACTIVE", franchise: "Connaught Place" },
];

async function main() {
  console.log("Seeding database...");

  const retailTransactions = await loadRetailTransactions();

  await prisma.attendanceRecord.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auditChecklistItem.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.marketingCampaign.deleteMany();
  await prisma.franchise.deleteMany();
  await prisma.retailTransaction.deleteMany();

  const franchiseMap = {};
  for (const f of franchises) {
    const created = await prisma.franchise.create({ data: f });
    franchiseMap[f.name] = created;
  }

  const passwordHash = await bcrypt.hash("password123", 10);
  const indiranagar = franchiseMap["Indiranagar Central"];
  const bandra = franchiseMap["Bandra West"];
  const connaught = franchiseMap["Connaught Place"];
  const annaNagar = franchiseMap["Anna Nagar Flagship"];
  const sgHighway = franchiseMap["SG Highway"];

  await prisma.user.createMany({
    data: [
      { email: "admin@franchiseops.ai", password: passwordHash, fullName: "System Admin", role: "ADMIN", region: null, franchiseId: null },
      { email: "rajesh.kumar@franchiseops.ai", password: passwordHash, fullName: "Rajesh Kumar", role: "REGIONAL_MANAGER", region: "South", franchiseId: null },
      { email: "manager@franchiseops.ai", password: passwordHash, fullName: "Sneha Menon", role: "OUTLET_MANAGER", region: "South", franchiseId: indiranagar.id },
    ],
  });

  const campaignSeed = [
    {
      name: "Festive Electronics Bash",
      type: "SOCIAL_MEDIA",
      outletName: indiranagar.name,
      city: indiranagar.city,
      productCategory: "Electronics",
      targetAudience: "Tech Enthusiasts & Home Shoppers",
      franchiseId: indiranagar.id,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-01-31"),
      budget: 50000,
      revenueGenerated: 240000,
      customersReached: 12000,
      clicks: 1500,
      conversions: 180,
      status: "ACTIVE",
      description: "Omnichannel social campaign driving store footfalls and high-value tech sales.",
    },
    {
      name: "New Year Fashion Blitz",
      type: "ONLINE",
      outletName: bandra.name,
      city: bandra.city,
      productCategory: "Clothing",
      targetAudience: "Urban Youth & Professionals",
      franchiseId: bandra.id,
      startDate: new Date("2025-01-05"),
      endDate: new Date("2025-01-25"),
      budget: 75000,
      revenueGenerated: 310000,
      customersReached: 18000,
      clicks: 2200,
      conversions: 290,
      status: "ACTIVE",
      description: "Digital retargeting campaign highlighting apparel discounts and fashion bundles.",
    },
    {
      name: "Winter Grocery Savings",
      type: "IN_STORE",
      outletName: connaught.name,
      city: connaught.city,
      productCategory: "Grocery",
      targetAudience: "Families & Bulk Buyers",
      franchiseId: connaught.id,
      startDate: new Date("2025-01-08"),
      endDate: new Date("2025-02-15"),
      budget: 30000,
      revenueGenerated: 95000,
      customersReached: 8500,
      clicks: 900,
      conversions: 140,
      status: "ACTIVE",
      description: "In-store cashback and promotional bundle campaign for weekly essential goods.",
    },
    {
      name: "South India Loyalty Rewards",
      type: "LOYALTY",
      outletName: annaNagar.name,
      city: annaNagar.city,
      productCategory: "Electronics",
      targetAudience: "Repeat Loyalty Members",
      franchiseId: annaNagar.id,
      startDate: new Date("2024-12-15"),
      endDate: new Date("2025-01-10"),
      budget: 40000,
      revenueGenerated: 185000,
      customersReached: 9500,
      clicks: 1100,
      conversions: 160,
      status: "COMPLETED",
      description: "Exclusive rewards program offer for top-tier loyalty account holders.",
    },
    {
      name: "Spring Tech Super Sale",
      type: "SEASONAL",
      outletName: sgHighway.name,
      city: sgHighway.city,
      productCategory: "Electronics",
      targetAudience: "Students & Early Adopters",
      franchiseId: sgHighway.id,
      startDate: new Date("2025-01-12"),
      endDate: new Date("2025-02-28"),
      budget: 60000,
      revenueGenerated: 210000,
      customersReached: 14000,
      clicks: 1700,
      conversions: 210,
      status: "ACTIVE",
      description: "Seasonal promotional drive targeting gadget upgrades and electronic accessories.",
    },
  ];

  for (const c of campaignSeed) {
    await prisma.marketingCampaign.create({ data: c });
  }

  const auditsSeed = [
    {
      auditCode: "AUD-2025-001",
      outletName: indiranagar.name,
      city: indiranagar.city,
      auditorName: "Vikram Sethi (Senior Inspector)",
      auditDate: new Date("2025-01-15"),
      auditType: "OPERATIONAL",
      status: "COMPLETED",
      score: 92,
      compliancePercentage: 94,
      remarks: "Store operations, register reconciliations, and staff safety protocols met high standards.",
      franchiseId: indiranagar.id,
      items: [
        { category: "Store Operations", question: "POS terminal cash registers reconciled daily?", status: "PASS" },
        { category: "Inventory", question: "Weekly inventory cycle count matches ERP software records?", status: "PASS" },
        { category: "Safety", question: "Fire extinguishers serviced and emergency exits clear?", status: "PASS" },
        { category: "Staff", question: "All staff wearing mandatory uniform and ID badges?", status: "PARTIAL", notes: "1 junior cashier missing badge" },
        { category: "Hygiene", question: "Floors and food counter surfaces sanitized hourly?", status: "PASS" },
      ],
    },
    {
      auditCode: "AUD-2025-002",
      outletName: bandra.name,
      city: bandra.city,
      auditorName: "Ananya Deshmukh (Quality Officer)",
      auditDate: new Date("2025-01-18"),
      auditType: "HYGIENE",
      status: "COMPLETED",
      score: 88,
      compliancePercentage: 90,
      remarks: "Clean store environment. Minor inventory tagging issue logged in storage room.",
      franchiseId: bandra.id,
      items: [
        { category: "Hygiene", question: "Sanitization logs updated at opening and mid-shift?", status: "PASS" },
        { category: "Inventory", question: "Perishable items labeled with expiration codes?", status: "PARTIAL", notes: "3 boxes missing code labels" },
        { category: "Documentation", question: "FSSAI compliance certificates displayed near entrance?", status: "PASS" },
        { category: "Staff", question: "Grooming standards verified before shift?", status: "PASS" },
      ],
    },
    {
      auditCode: "AUD-2025-003",
      outletName: connaught.name,
      city: connaught.city,
      auditorName: "Rakesh Verma (Compliance Lead)",
      auditDate: new Date("2025-01-20"),
      auditType: "SAFETY",
      status: "FAILED",
      score: 58,
      compliancePercentage: 62,
      remarks: "Critical safety non-compliance observed. Backroom emergency door obstructed by inventory pallets.",
      franchiseId: connaught.id,
      items: [
        { category: "Safety", question: "Emergency exit pathways completely unobstructed?", status: "FAIL", notes: "Pallets blocking exit door" },
        { category: "Store Operations", question: "First aid box fully stocked?", status: "FAIL", notes: "Bandages and antiseptic missing" },
        { category: "Documentation", question: "Safety drill log updated quarterly?", status: "PASS" },
        { category: "Compliance", question: "Electrical panels properly insulated?", status: "PASS" },
      ],
    },
    {
      auditCode: "AUD-2025-004",
      outletName: annaNagar.name,
      city: annaNagar.city,
      auditorName: "Meera Krishnan (Regional Auditor)",
      auditDate: new Date("2025-01-22"),
      auditType: "COMPLIANCE",
      status: "PENDING",
      score: 0,
      compliancePercentage: 0,
      remarks: "Scheduled for end-of-month review.",
      franchiseId: annaNagar.id,
      items: [
        { category: "Compliance", question: "Local store operating licenses renewed?", status: "PASS" },
        { category: "Customer Service", question: "Customer feedback register maintained?", status: "PASS" },
      ],
    },
  ];

  for (const a of auditsSeed) {
    const { items, ...auditData } = a;
    const createdAudit = await prisma.audit.create({ data: auditData });
    for (const item of items) {
      await prisma.auditChecklistItem.create({
        data: {
          ...item,
          auditId: createdAudit.id,
        },
      });
    }
  }

  const alertsSeed = [
    {
      type: "AUDIT",
      severity: "CRITICAL",
      title: "Audit Safety Failure",
      message: "Connaught Place failed safety audit (Score 58%). Emergency exit pathway obstructed by inventory pallets.",
      outletName: connaught.name,
      franchiseId: connaught.id,
      isRead: false,
    },
    {
      type: "STAFF",
      severity: "WARNING",
      title: "Low Staff Attendance",
      message: "SG Highway reported attendance rate below threshold (78%). Follow up required.",
      outletName: sgHighway.name,
      franchiseId: sgHighway.id,
      isRead: false,
    },
    {
      type: "MARKETING",
      severity: "INFO",
      title: "High Campaign ROI",
      message: "New Year Fashion Blitz at Bandra West achieved 313% ROI.",
      outletName: bandra.name,
      franchiseId: bandra.id,
      isRead: true,
    },
    {
      type: "INVENTORY",
      severity: "WARNING",
      title: "High Stock Demand",
      message: "Electronics inventory in Indiranagar Central rapidly declining due to Festive Campaign sales.",
      outletName: indiranagar.name,
      franchiseId: indiranagar.id,
      isRead: false,
    },
  ];

  for (const alert of alertsSeed) {
    await prisma.alert.create({ data: alert });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const s of staffSeed) {
    const franchise = franchiseMap[s.franchise];
    const staff = await prisma.staff.create({
      data: {
        staffId: s.staffId,
        name: s.name,
        email: s.email,
        phone: s.phone,
        department: s.department,
        designation: s.designation,
        salary: s.salary,
        shift: s.shift,
        attendanceRate: s.attendanceRate,
        joiningDate: new Date(s.joiningDate),
        status: s.status,
        franchiseId: franchise.id,
      },
    });

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const isWeekend = date.getDay() === 0;
      const status = s.status === "INACTIVE" ? "ABSENT" : isWeekend ? "ON_LEAVE" : i === 0 && s.attendanceRate < 85 ? "LATE" : "PRESENT";
      await prisma.attendanceRecord.create({
        data: {
          staffId: staff.id,
          date,
          status,
          checkIn: status === "PRESENT" || status === "LATE" ? "09:00" : null,
          checkOut: status === "PRESENT" || status === "LATE" ? "18:00" : null,
        },
      });
    }
  }

  if (retailTransactions.length > 0) {
    await prisma.retailTransaction.createMany({
      data: retailTransactions.map((row) => ({
        billId: row.billId,
        customerName: row.customerName,
        city: row.city,
        productCategory: row.productCategory,
        quantity: row.quantity,
        totalAmount: row.totalAmount,
        paymentMethod: row.paymentMethod,
        storeType: row.storeType,
        visitDate: row.visitDate,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`Seeded ${franchises.length} franchises, ${staffSeed.length} staff, 3 users, and ${retailTransactions.length} retail transactions`);
  console.log("Demo login: rajesh.kumar@franchiseops.ai / password123 (Regional Manager)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
