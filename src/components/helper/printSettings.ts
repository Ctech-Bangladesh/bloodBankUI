const PRINT_WITH_BANNER_KEY = "printWithBanner";

/**
 * Global, remembered print preference: whether printed reports/slips include
 * the hospital banner image. Defaults to true (current behavior).
 */
export function getPrintWithBanner(): boolean {
  return localStorage.getItem(PRINT_WITH_BANNER_KEY) !== "false";
}

export function setPrintWithBanner(withBanner: boolean): void {
  localStorage.setItem(PRINT_WITH_BANNER_KEY, String(withBanner));
}
