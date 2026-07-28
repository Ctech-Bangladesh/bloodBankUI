import { formatScreeningResult } from "./screeningResult";

describe("formatScreeningResult (printed report wording)", () => {
  test("negative results print as Non-Reactive (Negative)", () => {
    expect(formatScreeningResult("Non-Reactive")).toBe("Non-Reactive (Negative)");
    // Older records stored plain "Negative"
    expect(formatScreeningResult("Negative")).toBe("Non-Reactive (Negative)");
  });

  test("positive results print as Reactive (Positive)", () => {
    expect(formatScreeningResult("Reactive")).toBe("Reactive (Positive)");
    // Older records stored plain "Positive"
    expect(formatScreeningResult("Positive")).toBe("Reactive (Positive)");
  });

  test("other values pass through unchanged", () => {
    expect(formatScreeningResult("Not Done")).toBe("Not Done");
    expect(formatScreeningResult("")).toBe("");
    expect(formatScreeningResult(undefined)).toBeUndefined();
    expect(formatScreeningResult(null)).toBeNull();
  });
});
