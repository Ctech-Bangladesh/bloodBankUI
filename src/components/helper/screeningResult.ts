/**
 * Display mapping for screening test results on printed reports.
 * Stored values are unchanged; older records may hold "Negative"/"Positive"
 * while newer ones hold "Non-Reactive"/"Reactive".
 */
export function formatScreeningResult(value: any): any {
  if (value === "Negative" || value === "Non-Reactive") {
    return "Non-Reactive (Negative)";
  }
  if (value === "Positive" || value === "Reactive") {
    return "Reactive (Positive)";
  }
  return value;
}
