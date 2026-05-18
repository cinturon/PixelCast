import { describe, it, expect } from "vitest";
import { isCacheExpired } from "../utils/cache";

describe("isCacheExpired", () => {
    it("should return true if the cache is expired", () => {
        const now = new Date("2026-05-18T12:00:00Z");
        const cachedAt = new Date("2026-05-18T10:59:59Z");

        expect(isCacheExpired(cachedAt, now)).toBe(true);
    });
});

describe("isCacheFresh", () => {
    it("should return false if the cache is fresh", () => {
        const now = new Date("2026-05-18T12:00:00Z");
        const cachedAt = new Date("2026-05-18T11:30:00Z");

        expect(isCacheExpired(cachedAt, now)).toBe(false);
    });
});