/**
 * Display mapping for compatibility test results on printed reports.
 * The stored value stays "Non-Compatible" for backward compatibility with
 * existing records and the select option value used when saving.
 */
export function formatCompatibilityResult(value: any): any {
  if (value === "Non-Compatible") {
    return "Incompatible";
  }
  return value;
}
