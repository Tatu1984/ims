import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("ERROR: Cannot run seed in production. Set NODE_ENV=development to seed.");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.license.deleteMany();
  await prisma.software.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const adminHash = await hashPassword("admin123");
  const techHash = await hashPassword("tech123");
  const auditHash = await hashPassword("audit123");
  const mgrHash = await hashPassword("mgr123");

  const admin = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "admin@company.com",
      passwordHash: adminHash,
      role: "Admin",
      department: "IT Operations",
      status: "Active",
      initials: "JS",
      lastLogin: new Date("2026-03-14T11:42:00Z"),
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Kim",
      email: "sarah.kim@company.com",
      passwordHash: techHash,
      role: "Technician",
      department: "Help Desk",
      status: "Active",
      initials: "SK",
      lastLogin: new Date("2026-03-14T10:15:00Z"),
    },
  });

  const mike = await prisma.user.create({
    data: {
      name: "Mike Chen",
      email: "mike.chen@company.com",
      passwordHash: techHash,
      role: "Technician",
      department: "Infrastructure",
      status: "Active",
      initials: "MC",
      lastLogin: new Date("2026-03-14T09:30:00Z"),
    },
  });

  const emily = await prisma.user.create({
    data: {
      name: "Emily Davis",
      email: "emily.davis@company.com",
      passwordHash: auditHash,
      role: "Auditor",
      department: "Compliance",
      status: "Active",
      initials: "ED",
      lastLogin: new Date("2026-03-13T16:20:00Z"),
    },
  });

  const james = await prisma.user.create({
    data: {
      name: "James Liu",
      email: "james.liu@company.com",
      passwordHash: mgrHash,
      role: "Manager",
      department: "IT Operations",
      status: "Active",
      initials: "JL",
      lastLogin: new Date("2026-03-14T08:00:00Z"),
    },
  });

  await prisma.user.create({
    data: {
      name: "Rachel Torres",
      email: "rachel.torres@company.com",
      passwordHash: techHash,
      role: "Technician",
      department: "Help Desk",
      status: "Inactive",
      initials: "RT",
      lastLogin: new Date("2026-02-28T14:10:00Z"),
    },
  });

  // --- Assets ---
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        assetTag: "LPT-2025-0451",
        name: "Dell Latitude 7450",
        type: "laptop",
        serialNumber: "DL7450-XK9R2",
        assignedToId: admin.id,
        assignedToName: "James Thompson",
        status: "Active",
        department: "Engineering",
        location: "Building A, Floor 3, Desk 42",
        purchaseDate: new Date("2025-01-15"),
        purchaseCost: 1849.0,
        warrantyExpiry: new Date("2028-01-15"),
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "DSK-2024-0089",
        name: "HP EliteDesk 800 G9",
        type: "desktop",
        serialNumber: "HP800G9-M3J7K",
        assignedToName: "Priya Patel",
        status: "Active",
        department: "Finance",
        purchaseDate: new Date("2024-09-03"),
        purchaseCost: 1249.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "SRV-2024-0012",
        name: "Dell PowerEdge R760",
        type: "server",
        serialNumber: "DPR760-2NV8P",
        assignedToName: "Server Room A",
        status: "Active",
        department: "Infrastructure",
        purchaseDate: new Date("2024-06-20"),
        purchaseCost: 8500.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "LPT-2024-0523",
        name: 'MacBook Pro 16" M4 Pro',
        type: "laptop",
        serialNumber: "MBP16-C9QF4R",
        assignedToName: "Anika Singh",
        status: "Active",
        department: "Design",
        purchaseDate: new Date("2024-11-08"),
        purchaseCost: 2499.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "PRN-2023-0034",
        name: "HP LaserJet Pro M404dn",
        type: "printer",
        serialNumber: "HPLJ404-7K2X9",
        assignedToName: "Floor 2 - Shared",
        status: "Active",
        department: "Shared Services",
        purchaseDate: new Date("2023-03-12"),
        purchaseCost: 349.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "DSK-2023-0167",
        name: "Lenovo ThinkCentre M90q",
        type: "desktop",
        serialNumber: "LTC90Q-P5M2N",
        assignedToName: "Mark Williams",
        status: "Maintenance",
        department: "Sales",
        purchaseDate: new Date("2023-07-28"),
        purchaseCost: 1099.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "PRF-2025-0022",
        name: "Dell UltraSharp U2723QE",
        type: "peripheral",
        serialNumber: "DU2723-K8R3V",
        assignedToName: "James Thompson",
        status: "Active",
        department: "Engineering",
        purchaseDate: new Date("2025-01-15"),
        purchaseCost: 619.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "LPT-2022-0298",
        name: "Dell Latitude 5530",
        type: "laptop",
        serialNumber: "DL5530-W4N6T",
        assignedToName: "Unassigned",
        status: "InStorage",
        department: "IT Pool",
        purchaseDate: new Date("2022-04-05"),
        purchaseCost: 1399.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "SRV-2023-0008",
        name: "HPE ProLiant DL380 Gen10",
        type: "server",
        serialNumber: "HPE380-J2K9M",
        assignedToName: "Server Room B",
        status: "Retired",
        department: "Infrastructure",
        purchaseDate: new Date("2023-02-14"),
        purchaseCost: 6800.0,
      },
    }),
    prisma.asset.create({
      data: {
        assetTag: "DSK-2025-0002",
        name: "HP EliteOne 870 G9 AiO",
        type: "desktop",
        serialNumber: "HP870G9-R6V3Q",
        assignedToName: "Sarah Chen",
        status: "Active",
        department: "HR",
        purchaseDate: new Date("2025-02-01"),
        purchaseCost: 1549.0,
      },
    }),
  ]);

  // --- Software ---
  const softwareData = [
    { name: "Microsoft Office 365", publisher: "Microsoft", version: "16.0.17328", installCount: 245, licenseStatus: "Licensed" as const, category: "Productivity" },
    { name: "Adobe Creative Suite", publisher: "Adobe Inc.", version: "2024.1.0", installCount: 48, licenseStatus: "Licensed" as const, category: "Design" },
    { name: "Google Chrome", publisher: "Google LLC", version: "122.0.6261", installCount: 312, licenseStatus: "Licensed" as const, category: "Browser" },
    { name: "Visual Studio Code", publisher: "Microsoft", version: "1.87.2", installCount: 87, licenseStatus: "Licensed" as const, category: "Development" },
    { name: "Slack", publisher: "Salesforce", version: "4.36.140", installCount: 198, licenseStatus: "Licensed" as const, category: "Communication" },
    { name: "Zoom Workplace", publisher: "Zoom Video", version: "5.17.11", installCount: 276, licenseStatus: "Licensed" as const, category: "Communication" },
    { name: "AutoCAD 2024", publisher: "Autodesk", version: "2024.1", installCount: 15, licenseStatus: "Trial" as const, category: "Engineering" },
    { name: "WinRAR", publisher: "win.rar GmbH", version: "7.0.0", installCount: 34, licenseStatus: "Unlicensed" as const, category: "Utility" },
    { name: "Postman", publisher: "Postman Inc.", version: "10.23.5", installCount: 42, licenseStatus: "Licensed" as const, category: "Development" },
    { name: "Norton 360", publisher: "Gen Digital", version: "22.24.1.12", installCount: 189, licenseStatus: "Licensed" as const, category: "Security" },
  ];

  const softwareRecords = await Promise.all(
    softwareData.map((sw) => prisma.software.create({ data: sw }))
  );

  // --- Licenses ---
  const licenseData = [
    { softwareIdx: 0, licenseType: "Subscription" as const, totalLicenses: 300, inUse: 245, expiryDate: new Date("2026-12-31") },
    { softwareIdx: 1, licenseType: "PerSeat" as const, totalLicenses: 50, inUse: 48, expiryDate: new Date("2026-09-15") },
    { softwareIdx: 6, licenseType: "Volume" as const, totalLicenses: 20, inUse: 15, expiryDate: new Date("2027-03-01") },
    { softwareIdx: 4, licenseType: "Subscription" as const, totalLicenses: 200, inUse: 198, expiryDate: new Date("2026-06-30") },
    { softwareIdx: 5, licenseType: "Subscription" as const, totalLicenses: 300, inUse: 276, expiryDate: new Date("2026-08-15") },
    { softwareIdx: 9, licenseType: "Volume" as const, totalLicenses: 200, inUse: 189, expiryDate: new Date("2026-04-20") },
    { softwareIdx: 8, licenseType: "PerSeat" as const, totalLicenses: 30, inUse: 42, expiryDate: new Date("2026-11-01") },
  ];

  await Promise.all(
    licenseData.map((lic) =>
      prisma.license.create({
        data: {
          softwareId: softwareRecords[lic.softwareIdx].id,
          licenseType: lic.licenseType,
          totalLicenses: lic.totalLicenses,
          inUse: lic.inUse,
          expiryDate: lic.expiryDate,
        },
      })
    )
  );

  // --- Tickets ---
  await Promise.all([
    prisma.ticket.create({
      data: {
        ticketNumber: "TKT-1042",
        title: "Unable to connect to network printer on 3rd floor",
        description: "Users on the 3rd floor cannot print to the shared printer.",
        priority: "High",
        status: "Open",
        sla: "AtRisk",
        assignedToId: mike.id,
        device: "prn-floor3-01",
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: "TKT-1041",
        title: "Laptop running extremely slow after update",
        description: "Performance degradation after latest Windows update.",
        priority: "Medium",
        status: "InProgress",
        sla: "OnTrack",
        assignedToId: sarah.id,
        device: "ws-eng-042",
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: "TKT-1040",
        title: "VPN connection drops intermittently",
        description: "Remote users experiencing frequent VPN disconnections.",
        priority: "High",
        status: "Open",
        sla: "Breached",
        assignedToId: james.id,
        device: "rtr-vpn-01",
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: "TKT-1039",
        title: "Request for additional monitor setup",
        description: "HR department requesting dual monitor configuration.",
        priority: "Low",
        status: "InProgress",
        sla: "OnTrack",
        assignedToId: mike.id,
        device: "ws-hr-015",
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: "TKT-1038",
        title: "Email sync failing on Outlook desktop client",
        description: "Outlook not syncing new emails on marketing workstation.",
        priority: "Medium",
        status: "Resolved",
        sla: "OnTrack",
        assignedToId: sarah.id,
        device: "ws-mkt-008",
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: "TKT-1037",
        title: "Server room UPS battery replacement needed",
        description: "UPS unit in rack 2 reporting battery degradation alerts.",
        priority: "High",
        status: "Closed",
        sla: "OnTrack",
        assignedToId: james.id,
        device: "ups-rack-02",
      },
    }),
  ]);

  // --- Audit Logs ---
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "Create",
        resource: "Asset #A-1248",
        details: "Created new workstation asset ws-eng-050",
        ipAddress: "10.0.1.45",
        createdAt: new Date("2026-03-14T12:45:02Z"),
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: sarah.id,
        action: "Update",
        resource: "Ticket #TKT-1041",
        details: "Changed status from Open to In Progress",
        ipAddress: "10.0.1.22",
        createdAt: new Date("2026-03-14T12:30:18Z"),
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: mike.id,
        action: "Export",
        resource: "Asset Report",
        details: "Exported full asset inventory to CSV (1,247 records)",
        ipAddress: "10.0.1.30",
        createdAt: new Date("2026-03-14T12:15:44Z"),
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: james.id,
        action: "Login",
        resource: "System",
        details: "Successful login via SSO",
        ipAddress: "192.168.5.12",
        createdAt: new Date("2026-03-14T11:58:31Z"),
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: emily.id,
        action: "Delete",
        resource: "License #LIC-089",
        details: "Removed expired Adobe Creative Suite license",
        ipAddress: "10.0.1.55",
        createdAt: new Date("2026-03-14T11:42:09Z"),
      },
    }),
  ]);

  // --- Reports ---
  await Promise.all([
    prisma.report.create({
      data: {
        name: "Asset Inventory - Q1 2026",
        type: "Inventory",
        generatedById: admin.id,
        status: "Ready",
        fileSize: "2.4 MB",
        createdAt: new Date("2026-03-14T10:30:00Z"),
      },
    }),
    prisma.report.create({
      data: {
        name: "Security Audit - March 2026",
        type: "Security",
        generatedById: sarah.id,
        status: "Generating",
        createdAt: new Date("2026-03-14T09:15:00Z"),
      },
    }),
    prisma.report.create({
      data: {
        name: "Patch Compliance Report",
        type: "Compliance",
        generatedById: mike.id,
        status: "Ready",
        fileSize: "1.8 MB",
        createdAt: new Date("2026-03-13T16:45:00Z"),
      },
    }),
  ]);

  // --- Settings ---
  const settings = [
    { key: "site_name", value: "ITAM Platform", category: "general" },
    { key: "timezone", value: "America/New_York", category: "general" },
    { key: "data_retention", value: "90", category: "general" },
    { key: "currency", value: "USD", category: "general" },
    { key: "depreciation_method", value: "straight-line", category: "general" },
    { key: "auto_tag", value: "true", category: "general" },
    { key: "email_notifications", value: "true", category: "notifications" },
    { key: "license_expiry_alerts", value: "true", category: "notifications" },
    { key: "asset_assignment_alerts", value: "false", category: "notifications" },
    { key: "weekly_digest", value: "true", category: "notifications" },
    { key: "password_min_length", value: "8", category: "security" },
    { key: "session_timeout", value: "30", category: "security" },
    { key: "two_factor", value: "false", category: "security" },
  ];

  await Promise.all(
    settings.map((s) => prisma.setting.create({ data: s }))
  );

  console.log("Seed completed successfully!");
  console.log(`  Users: 6 (admin@company.com / admin123)`);
  console.log(`  Assets: ${assets.length}`);
  console.log(`  Software: ${softwareRecords.length}`);
  console.log(`  Licenses: ${licenseData.length}`);
  console.log(`  Tickets: 6`);
  console.log(`  Audit Logs: 5`);
  console.log(`  Reports: 3`);
  console.log(`  Settings: ${settings.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
