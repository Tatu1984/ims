"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  MapPin,
  User,
  Building2,
  TicketPlus,
  Pencil,
  Clock,
  Package,
  RefreshCw,
  ShieldCheck,
  ArrowUpCircle,
  Tag,
  Calendar,
  Hash,
} from "lucide-react";

type TabKey = "overview" | "hardware" | "software" | "history";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "hardware", label: "Hardware" },
  { key: "software", label: "Software" },
  { key: "history", label: "History" },
];

const asset = {
  id: "ast-001",
  assetTag: "LPT-2025-0451",
  name: "Dell Latitude 7450",
  type: "Laptop",
  typeBadgeColor: "bg-purple-100 text-purple-700",
  status: "Active",
  statusBadgeColor: "bg-green-100 text-green-700",
  serialNumber: "DL7450-XK9R2",
  manufacturer: "Dell Technologies",
  model: "Latitude 7450",
  os: "Windows 11 Pro 24H2",
  department: "Engineering",
  location: "Building A, Floor 3, Desk 42",
  assignedTo: "James Thompson",
  purchaseDate: "Jan 15, 2025",
  warrantyExpiry: "Jan 15, 2028",
  purchaseCost: "$1,849.00",
  cpu: "Intel Core Ultra 7 155H",
  ram: "32 GB DDR5-5600",
  ramCapacity: 32,
  disk: "1 TB NVMe SSD (Samsung 990 Pro)",
  diskTotal: 1000,
  diskUsed: 470,
};

const timelineEvents = [
  {
    id: 1,
    icon: ArrowUpCircle,
    iconColor: "text-blue-500",
    title: "OS updated to Windows 11 24H2",
    timestamp: "Mar 10, 2026 - 2:15 PM",
  },
  {
    id: 2,
    icon: ShieldCheck,
    iconColor: "text-green-500",
    title: "Annual audit completed - verified",
    timestamp: "Mar 8, 2026 - 9:00 AM",
  },
  {
    id: 3,
    icon: RefreshCw,
    iconColor: "text-purple-500",
    title: "RAM upgraded from 16 GB to 32 GB",
    timestamp: "Feb 22, 2026 - 11:30 AM",
  },
  {
    id: 4,
    icon: User,
    iconColor: "text-orange-500",
    title: "Reassigned from Sarah Lee to James Thompson",
    timestamp: "Feb 15, 2026 - 10:00 AM",
  },
  {
    id: 5,
    icon: Package,
    iconColor: "text-gray-500",
    title: "Asset received and inventoried",
    timestamp: "Jan 15, 2025 - 3:45 PM",
  },
];

function ProgressBar({
  value,
  max,
  label,
  unit,
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
}) {
  const pct = Math.round((value / max) * 100);
  const barColor =
    pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-green-500";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {value} / {max} {unit} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const params = useParams();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/assets"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assets
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${asset.statusBadgeColor}`}
          >
            {asset.status}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${asset.typeBadgeColor}`}
          >
            {asset.type}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{asset.assetTag} &middot; S/N: {asset.serialNumber}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            {/* General Info Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Asset Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Tag className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Asset Tag</p>
                    <p className="text-sm font-mono text-gray-900">{asset.assetTag}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Serial Number</p>
                    <p className="text-sm font-mono text-gray-900">{asset.serialNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Manufacturer / Model</p>
                    <p className="text-sm text-gray-900">{asset.manufacturer} — {asset.model}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Operating System</p>
                    <p className="text-sm text-gray-900">{asset.os}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Assigned To</p>
                    <p className="text-sm text-gray-900">{asset.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Department</p>
                    <p className="text-sm text-gray-900">{asset.department}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{asset.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Purchase Date</p>
                    <p className="text-sm text-gray-900">{asset.purchaseDate} &middot; {asset.purchaseCost}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">Warranty Expiry</p>
                    <p className="text-sm text-gray-900">{asset.warrantyExpiry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Summary Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Hardware Specifications
              </h2>
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Processor:</span>
                  <span className="text-gray-900">{asset.cpu}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MemoryStick className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Memory:</span>
                  <span className="text-gray-900">{asset.ram}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <HardDrive className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Storage:</span>
                    <span className="text-gray-900">{asset.disk}</span>
                  </div>
                  <ProgressBar
                    value={asset.diskUsed}
                    max={asset.diskTotal}
                    label="Disk Usage"
                    unit="GB"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <Pencil className="h-4 w-4 text-blue-500" />
                  Edit Asset
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <TicketPlus className="h-4 w-4 text-orange-500" />
                  Create Ticket
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <User className="h-4 w-4 text-green-500" />
                  Reassign Asset
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <Package className="h-4 w-4 text-purple-500" />
                  Retire Asset
                </button>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Lifecycle Timeline
              </h2>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex gap-3">
                    {index < timelineEvents.length - 1 && (
                      <div className="absolute left-[11px] top-7 h-full w-px bg-gray-200" />
                    )}
                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                      <event.icon className={`h-5 w-5 ${event.iconColor}`} />
                    </div>
                    <div className="min-w-0 pb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "hardware" && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Cpu className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            Detailed hardware specifications coming soon.
          </p>
        </div>
      )}

      {activeTab === "software" && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            Installed software inventory coming soon.
          </p>
        </div>
      )}

      {activeTab === "history" && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Clock className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            Full asset audit history coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
