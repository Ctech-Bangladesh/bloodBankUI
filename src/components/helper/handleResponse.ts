/**
 * Kept for backward compatibility with the service layer.
 * Authentication failures (401/403) and missing-user detection are handled
 * centrally by the axios interceptor in services/http.ts, which is the only
 * place axios actually delivers non-2xx statuses (they reject the promise).
 */
export function handleResponse(response: any) {
  return response;
}
