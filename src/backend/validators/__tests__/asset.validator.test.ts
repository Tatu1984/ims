import { describe, it, expect } from "vitest";
import { createAssetSchema, updateAssetSchema } from "../asset.validator";

describe("createAssetSchema", () => {
  it("validates a valid asset", () => {
    const result = createAssetSchema.safeParse({
      name: "Dell Latitude 7450",
      type: "laptop",
      serialNumber: "DL7450-XK9R2",
      department: "Engineering",
    });
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    const result = createAssetSchema.safeParse({
      type: "laptop",
      serialNumber: "SN123",
    });
    expect(result.success).toBe(false);
  });

  it("requires valid type enum", () => {
    const result = createAssetSchema.safeParse({
      name: "Test",
      type: "invalid-type",
      serialNumber: "SN123",
    });
    expect(result.success).toBe(false);
  });

  it("requires serialNumber", () => {
    const result = createAssetSchema.safeParse({
      name: "Test",
      type: "laptop",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid types", () => {
    for (const type of ["desktop", "laptop", "server", "printer", "peripheral"]) {
      const result = createAssetSchema.safeParse({
        name: "Test",
        type,
        serialNumber: "SN123",
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts optional hardware spec fields", () => {
    const result = createAssetSchema.safeParse({
      name: "Dell Latitude 7450",
      type: "laptop",
      serialNumber: "DL7450-XK9R2",
      processor: "Intel Core i7-13700H",
      ramSize: "32 GB",
      ramType: "DDR5-5600",
      storageSize: "1 TB",
      storageType: "NVMe SSD",
      gpu: "Intel Arc",
      os: "Windows 11 Pro",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid status values", () => {
    for (const status of ["Active", "InStorage", "Maintenance", "Retired"]) {
      const result = createAssetSchema.safeParse({
        name: "Test",
        type: "laptop",
        serialNumber: "SN123",
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const result = createAssetSchema.safeParse({
      name: "Test",
      type: "laptop",
      serialNumber: "SN123",
      status: "InvalidStatus",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateAssetSchema", () => {
  it("allows partial updates", () => {
    const result = updateAssetSchema.safeParse({ name: "Updated Name" });
    expect(result.success).toBe(true);
  });

  it("allows empty update", () => {
    const result = updateAssetSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("still validates types on partial update", () => {
    const result = updateAssetSchema.safeParse({ type: "invalid" });
    expect(result.success).toBe(false);
  });
});
