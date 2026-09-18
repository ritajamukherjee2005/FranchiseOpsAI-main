import { prisma } from "../lib/prisma.js";
import { buildStaffScopeFilter, canManageStaff } from "../middleware/roles.js";

const SHIFT_LABELS = {
  MORNING: "Morning (6AM–2PM)",
  AFTERNOON: "Afternoon (2PM–10PM)",
  NIGHT: "Night (10PM–6AM)",
  FLEXIBLE: "Flexible",
};

const VALID_SHIFTS = ["MORNING", "AFTERNOON", "NIGHT", "FLEXIBLE"];
const VALID_STATUS = ["ACTIVE", "INACTIVE"];
const VALID_ATTENDANCE = ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"];

export function serializeStaff(staff) {
  return {
    ...staff,
    salary: staff.salary ? Number(staff.salary) : 0,
    shiftLabel: SHIFT_LABELS[staff.shift] || staff.shift,
    franchiseName: staff.franchise?.name,
    franchiseRegion: staff.franchise?.region,
  };
}

function getTodayDate() {
  return new Date(new Date().toISOString().slice(0, 10));
}

function resolveScopeWhere(user) {
  const scope = buildStaffScopeFilter(user);
  if (scope.franchiseId === "__none__") return { id: "__none__" };
  return scope;
}

export async function getDashboardStats(user) {
  const where = resolveScopeWhere(user);
  const today = getTodayDate();

  const [total, presentToday, absentToday, avgAttendance, deptBreakdown] = await Promise.all([
    prisma.staff.count({ where }),
    prisma.attendanceRecord.count({
      where: {
        date: today,
        status: { in: ["PRESENT", "LATE", "HALF_DAY"] },
        staff: where,
      },
    }),
    prisma.attendanceRecord.count({
      where: {
        date: today,
        status: "ABSENT",
        staff: where,
      },
    }),
    prisma.staff.aggregate({ where, _avg: { attendanceRate: true } }),
    prisma.staff.groupBy({
      by: ["department"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return {
    totalStaff: total,
    presentToday,
    absentToday,
    attendancePercentage: Math.round(avgAttendance._avg.attendanceRate || 0),
    departmentBreakdown: deptBreakdown.map((d) => ({
      department: d.department,
      count: d._count.id,
    })),
  };
}

export async function listStaffRecords(user, query) {
  const {
    search = "",
    department = "",
    status = "",
    shift = "",
    franchiseId = "",
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortDir = "desc",
  } = query;

  const scope = buildStaffScopeFilter(user);
  const where = { ...scope };

  if (scope.franchiseId === "__none__") {
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { staffId: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }
  if (department && department !== "All") where.department = department;
  if (status && status !== "All") where.status = status;
  if (shift && shift !== "All") where.shift = shift;
  if (franchiseId && franchiseId !== "All") where.franchiseId = franchiseId;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * pageSize;

  const allowedSort = ["name", "staffId", "department", "joiningDate", "salary", "attendanceRate", "createdAt"];
  const orderField = allowedSort.includes(sortBy) ? sortBy : "createdAt";
  const orderDir = sortDir === "asc" ? "asc" : "desc";

  const [total, staff] = await Promise.all([
    prisma.staff.count({ where }),
    prisma.staff.findMany({
      where,
      include: { franchise: { select: { id: true, name: true, city: true, region: true } } },
      orderBy: { [orderField]: orderDir },
      skip,
      take: pageSize,
    }),
  ]);

  return {
    data: staff.map(serializeStaff),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function getStaffById(user, id) {
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      franchise: true,
      attendances: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  if (!staff) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  if (!canManageStaff(user, staff.franchiseId, staff.franchise?.region)) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  return serializeStaff(staff);
}

async function generateStaffId() {
  const count = await prisma.staff.count();
  return `STF-${String(count + 1).padStart(3, "0")}`;
}

export async function createStaffRecord(user, payload) {
  const {
    name,
    email,
    phone,
    department,
    designation,
    salary,
    shift,
    joiningDate,
    franchiseId,
    status,
    attendanceRate,
  } = payload;

  const franchise = await prisma.franchise.findUnique({ where: { id: franchiseId } });
  if (!franchise) {
    const err = new Error("Invalid franchise");
    err.status = 400;
    throw err;
  }

  if (!canManageStaff(user, franchiseId, franchise.region)) {
    const err = new Error("Cannot add staff to this franchise");
    err.status = 403;
    throw err;
  }

  if (user.role === "OUTLET_MANAGER" && user.franchiseId !== franchiseId) {
    const err = new Error("Outlet managers can only add staff to their franchise");
    err.status = 403;
    throw err;
  }

  const staffId = await generateStaffId();

  const staff = await prisma.staff.create({
    data: {
      staffId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      department,
      designation,
      salary: parseFloat(salary) || 0,
      shift: shift || "MORNING",
      joiningDate: new Date(joiningDate),
      franchiseId,
      status: status || "ACTIVE",
      attendanceRate: parseFloat(attendanceRate) ?? 100,
    },
    include: { franchise: { select: { id: true, name: true, region: true } } },
  });

  return serializeStaff(staff);
}

export async function updateStaffRecord(user, id, payload) {
  const existing = await prisma.staff.findUnique({
    where: { id },
    include: { franchise: true },
  });

  if (!existing) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  if (!canManageStaff(user, existing.franchiseId, existing.franchise?.region)) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  const { franchiseId } = payload;
  if (franchiseId && franchiseId !== existing.franchiseId) {
    const franchise = await prisma.franchise.findUnique({ where: { id: franchiseId } });
    if (!franchise) {
      const err = new Error("Invalid franchise");
      err.status = 400;
      throw err;
    }
    if (!canManageStaff(user, franchiseId, franchise.region)) {
      const err = new Error("Cannot assign staff to this franchise");
      err.status = 403;
      throw err;
    }
  }

  const {
    name,
    email,
    phone,
    department,
    designation,
    salary,
    shift,
    joiningDate,
    status,
    attendanceRate,
  } = payload;

  const staff = await prisma.staff.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
      ...(email && { email: email.toLowerCase().trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(department && { department }),
      ...(designation && { designation }),
      ...(salary !== undefined && { salary: parseFloat(salary) }),
      ...(shift && { shift }),
      ...(joiningDate && { joiningDate: new Date(joiningDate) }),
      ...(franchiseId && { franchiseId }),
      ...(status && { status }),
      ...(attendanceRate !== undefined && { attendanceRate: parseFloat(attendanceRate) }),
    },
    include: { franchise: { select: { id: true, name: true, region: true } } },
  });

  return serializeStaff(staff);
}

export async function deleteStaffRecord(user, id) {
  const existing = await prisma.staff.findUnique({
    where: { id },
    include: { franchise: true },
  });

  if (!existing) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  if (!canManageStaff(user, existing.franchiseId, existing.franchise?.region)) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  if (user.role === "OUTLET_MANAGER") {
    const err = new Error("Outlet managers cannot delete staff");
    err.status = 403;
    throw err;
  }

  await prisma.staff.delete({ where: { id } });
  return { message: "Staff deleted successfully" };
}

export async function listAttendanceRecords(user, staffId) {
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    include: { franchise: true },
  });

  if (!staff) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  if (!canManageStaff(user, staff.franchiseId, staff.franchise?.region)) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  return prisma.attendanceRecord.findMany({
    where: { staffId },
    orderBy: { date: "desc" },
    take: 60,
  });
}

export async function markAttendanceRecord(user, staffId, payload) {
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    include: { franchise: true },
  });

  if (!staff) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  if (!canManageStaff(user, staff.franchiseId, staff.franchise?.region)) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  const { date, status, checkIn, checkOut, notes } = payload;

  if (!VALID_ATTENDANCE.includes(status)) {
    const err = new Error("Invalid attendance status");
    err.status = 400;
    throw err;
  }

  const record = await prisma.attendanceRecord.upsert({
    where: {
      staffId_date: {
        staffId,
        date: new Date(date),
      },
    },
    create: {
      staffId,
      date: new Date(date),
      status,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      notes: notes || null,
    },
    update: { status, checkIn, checkOut, notes },
  });

  const records = await prisma.attendanceRecord.findMany({
    where: { staffId },
    orderBy: { date: "desc" },
    take: 30,
  });

  const presentCount = records.filter((r) =>
    ["PRESENT", "LATE", "HALF_DAY"].includes(r.status)
  ).length;
  const rate = records.length ? Math.round((presentCount / records.length) * 100) : 100;

  await prisma.staff.update({
    where: { id: staffId },
    data: { attendanceRate: rate },
  });

  return { record, attendanceRate: rate };
}

export async function listFranchiseRecords(user) {
  let where = {};

  if (user.role === "REGIONAL_MANAGER" && user.region) {
    where = { region: user.region };
  } else if (user.role === "OUTLET_MANAGER" && user.franchiseId) {
    where = { id: user.franchiseId };
  }

  return prisma.franchise.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export function validateStaffPayload(body, isUpdate = false) {
  const errors = [];
  const {
    name,
    email,
    phone,
    department,
    designation,
    salary,
    shift,
    joiningDate,
    franchiseId,
    status,
  } = body;

  if (!isUpdate) {
    if (!name?.trim()) errors.push("Name is required");
    if (!email?.trim()) errors.push("Email is required");
    else if (!/\S+@\S+\.\S+/.test(email)) errors.push("Invalid email format");
    if (!phone?.trim()) errors.push("Phone is required");
    if (!department?.trim()) errors.push("Department is required");
    if (!designation?.trim()) errors.push("Designation is required");
    if (!franchiseId) errors.push("Assigned franchise is required");
    if (!joiningDate) errors.push("Joining date is required");
  } else {
    if (email && !/\S+@\S+\.\S+/.test(email)) errors.push("Invalid email format");
  }

  if (shift && !VALID_SHIFTS.includes(shift)) errors.push("Invalid shift value");
  if (status && !VALID_STATUS.includes(status)) errors.push("Invalid status value");
  if (salary !== undefined && salary !== "" && Number.isNaN(parseFloat(salary))) {
    errors.push("Salary must be a number");
  }

  return errors;
}

export function validateAttendancePayload(body) {
  const errors = [];
  if (!body.date) errors.push("Date is required");
  if (!body.status) errors.push("Status is required");
  else if (!VALID_ATTENDANCE.includes(body.status)) errors.push("Invalid attendance status");
  return errors;
}
