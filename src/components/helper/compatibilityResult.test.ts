import { formatCompatibilityResult } from "./compatibilityResult";

describe("formatCompatibilityResult (printed report wording)", () => {
  test("Non-Compatible prints as Incompatible", () => {
    expect(formatCompatibilityResult("Non-Compatible")).toBe("Incompatible");
  });

  test("other values pass through unchanged", () => {
    expect(formatCompatibilityResult("Compatible")).toBe("Compatible");
    expect(formatCompatibilityResult("Not Done")).toBe("Not Done");
    expect(formatCompatibilityResult("")).toBe("");
    expect(formatCompatibilityResult(undefined)).toBeUndefined();
  });
});
