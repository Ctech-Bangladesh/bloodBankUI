# Blood Bank UI — Code Audit Report

Date: 2026-07-22
Scope: full frontend codebase (`src/`, build config, dependencies). Backend (OpenMRS/Bahmni REST API) is out of scope but its contract is considered.
Constraint honored: `.env.*` files and deployment configuration were **not** modified.

---

## 1. Audit Findings

### 1.1 Critical

| # | Issue | Affected files | Detail / Recommended fix |
|---|-------|----------------|--------------------------|
| C1 | **Phantom (undeclared) runtime dependencies.** `react-toastify` is imported in ~14 files and `history` is imported directly, but neither was declared in `package.json`. They only resolved through transitive dependencies (`mdbreact` → `react-toastify@5.5.0`, `react-router-dom` → `history@^4.9.0`). Any dependency update would silently break the production build. | `package.json`, all components importing `react-toastify`, `src/components/helper/history.ts` | Declare `react-toastify@5.5.0` (exact — v6+ removes `toast.configure()`) and `history@^4.10.1` as direct dependencies. **Fixed.** |
| C2 | **`node-sass@5` blocks installation on Node ≥ 16.** `node-sass` 5 only supports Node 10–15; `yarn install` fails on any modern machine/CI. The project already declares `sass` (dart-sass), which CRA's sass-loader prefers. | `package.json` | Remove `node-sass`. **Fixed.** |
| C3 | **401/403 auto-logout never fires.** Axios rejects the promise for any non-2xx status, so `handleResponse()` — which checks `[401, 403].indexOf(response.status)` inside the *fulfilled* path — can never see a 401/403. Session expiry left users on a dead UI with unhandled promise rejections. | `src/components/helper/handleResponse.ts`, both services | Move auth handling into an axios **response-error interceptor** on a shared client. **Fixed** (`src/services/http.ts`). |
| C4 | **Always-true auth condition.** `if (currentUserValue !== undefined \|\| currentUserValue !== null)` is a tautology (any value satisfies at least one side). The intent was `&&`. Repeated in 10+ components. | `AddDonorInfo`, `AddBloodStock`, `AddCompatibilityTest`, `AddReport`, `AddPhysicalSuitabilityTest`, `AddQuestionnaire`, `BloodStockList`, `DonorMedicalAssessment`, etc. | Replace with a truthiness guard. **Fixed.** |
| C5 | **`localStorage` poisoned with the string `"undefined"`.** `App.tsx` unconditionally writes cookie values to `localStorage`; when the Bahmni cookies are absent, the literal string `"undefined"` is stored, which downstream code then has to compare against string-literals `"undefined"`/`"null"`. | `src/App.tsx`, `handleResponse.ts` | Only persist when the cookie value exists; remove stale keys otherwise. **Fixed.** |
| C6 | **Always-truthy branch corrupts stock-entry flow.** `else if (event.target.value === "Outsource" \|\| "Private Blood Bank" \|\| ...)` — the string literals are always truthy, so *every* unmatched source (including clearing the field back to "Select") entered the "manual bag id" branch and kept `allowSave: true`. | `src/components/bloodStock/AddBloodStock.tsx:149` | Use `["Outsource", ...].includes(value)`. **Fixed.** |
| C7 | **Unhandled promise rejections across all data flows.** Most `.then()` chains had no `.catch`. A server/network error during save or load produced no user feedback and left forms in ambiguous states — dangerous in a blood-bank workflow. | All list components and Add* forms | Add `.catch` with user-visible toast and (for lists) the existing error-state render path. **Fixed.** |
| C8 | **Test suite broken.** `App.test.tsx` still asserted the CRA boilerplate "learn react" link (never present) and rendered `App` without the required `LangContext` provider — the only test in the repo failed. | `src/App.test.tsx` | Replaced with a real smoke test wrapping `App` in `LangState`. **Fixed.** |

### 1.2 High

| # | Issue | Affected files | Detail / Recommended fix |
|---|-------|----------------|--------------------------|
| H1 | **No axios timeout / no shared client.** Every service built its own URL prefix; no request timeout meant hung requests block workflows indefinitely. | services | Shared `http.ts` axios instance with `timeout` and one `baseURL`. **Fixed.** |
| H2 | **15 unused dependencies bloating install & attack surface**: `mdbreact`, `i18next` + 3 i18next plugins + `react-i18next` (a *second, unused* i18n stack — the app uses its own `LangContext`), `react-modal`, `react-to-print` (printing uses `window.print()`), `jQuery.print`, `react-native-dotenv` (React-Native lib in a web app), `dotenv` (CRA injects env itself), `@mui/material` + `@mui/styled-engine-sc` (duplicate of `@material-ui` v4 actually in use), `@emotion/react`, `@emotion/styled`. | `package.json` | Removed all of the above. `styled-components` is **retained**: it is a required peer dependency of `react-data-table-component@6`. **Fixed.** |
| H3 | **Error catches that only `console.log`.** Six list components caught load errors and logged to console; the components already had an `error` render path that was never used. | `PhysicalSuitability`, `DonorRejectedList`, `ApprovedBloodList`, `CompatibilityList`, `ReportList`, `BloodStockList` | Route errors into component `error` state + toast. **Fixed.** |
| H4 | **`isLoaded` initialized `true`** — the "Loading…" indicator could never display, so an empty table flashed as "no data" while fetching. | all list components | Initialize `isLoaded: false`, set `true` in both success and failure paths. **Fixed.** |
| H5 | **Security posture (documentation — needs backend work):** user identity for audit fields (`createdBy`, `deleted .../by/{user}`) is taken from a client-readable cookie and sent in URL paths; the server must never trust it. No CSRF token handling; auth relies on the Bahmni session cookie. API base URL is a raw IP over self-signed HTTPS. | services, backend | Backend must derive the acting user from the authenticated session, not the URL. Serve UI and API from the same origin or configure proper CORS + `SameSite` cookies. *Not fixable client-side; documented only.* |
| H6 | **Full-page reloads defeat the SPA.** `createBrowserHistory({ forceRefresh: true })` plus raw `<a href>` navigation reloads the whole bundle on every navigation. | `helper/history.ts`, `Header.tsx`, list components | Left as-is deliberately (behavioral change requires product sign-off); recommend migrating to `<Link>`/router history in a follow-up. |
| H7 | **State kept in mutable class fields.** `AddDonorInfo` accumulates `questionList`, `concernArr`, `concernObj` on the instance outside `this.state`; re-mounts/edits can duplicate concern entries. | `AddDonorInfo.tsx` | Larger refactor; deferred to roadmap (risk of altering save payload semantics). Documented. |

### 1.3 Medium

| # | Issue | Affected files | Recommendation |
|---|-------|----------------|----------------|
| M1 | `parseInt` without radix (21 call sites). | many | Added radix 10 at touched call sites. **Fixed where touched.** |
| M2 | Invalid HTML: `<input type="cancel">` (not a valid type; behaves as `type="text"` with a click handler), nested `<h2>` inside `<h2>`, `defaultValue` + `value` on the same controlled input, missing/misplaced `key` props in `.map()` renders. | `AddDonorInfo`, `AddBloodStock`, others | **Fixed.** |
| M3 | `translate()` returns `undefined` for missing keys → blank labels (e.g. `translate("Not Available")` is not a key). | `context/lang.tsx` | Return the key itself as fallback. **Fixed.** |
| M4 | `Array.prototype.filter` widely used as `forEach`/`map` (building arrays via side effects inside `filter`). | list components, `AddDonorInfo` | Replaced with `map` at touched sites; style-only elsewhere. |
| M5 | TypeScript effectively disabled: `any` everywhere despite `strict: true`; no shared domain types (Donor, BloodStock, …). | all | Introduce typed models incrementally (roadmap). |
| M6 | Duplicate UI stacks loaded at runtime: Bootstrap 4 + jQuery + popper (for nav dropdowns) alongside Material-UI v4 and react-bootstrap. | `index.tsx` | Consolidation is a roadmap item — removing jQuery requires reimplementing the `data-toggle` dropdowns. |
| M7 | `formatDate` contains a timezone-specific magic number (`-21600000` = 1970-01-01 in UTC+6) and manual zero-padding tricks. | `AddDonorInfo.tsx` | Documented; safe rewrite deferred (return value `"00000000"` is part of the current API contract with the date input). |
| M8 | Outdated stack: React 17, CRA 4 (webpack 4 → fails on Node ≥ 17 without `--openssl-legacy-provider`), TS 4.0, axios 0.21 (known CVE-2021-3749 SSRF-regex advisory; upgrade to ≥ 0.21.4/1.x). | `package.json` | Major-version upgrades are roadmap items; axios pinned range `^0.21.1` already resolves to 0.21.4 in `yarn.lock` (patched). |

### 1.4 Low

| # | Issue | Recommendation |
|---|-------|----------------|
| L1 | No CI pipeline, no lint/format hooks (per instruction, no deployment/DevOps files were added; recommended: GitHub Actions running install + tsc + tests). | Roadmap |
| L2 | README lacks environment variable documentation (`REACT_APP_API_URL`, `HTTPS`, `PORT`). | Roadmap (env files untouched by request) |
| L3 | Dead code: commented-out blocks, unused `getPatientInformation` never called, unused imports. | Clean opportunistically |
| L4 | Google Fonts imported at runtime from CDN (`custom.scss`) — breaks offline/air-gapped hospital deployments. | Self-host font (roadmap) |

---

## 2. Prioritized Improvement Plan

**Critical (do now — this PR):** C1–C8 (build integrity, auth/logout flow, data-entry logic bugs, error handling, broken test).

**High (this PR where safe):** H1 (shared client), H2 (dependency purge), H3, H4. H5–H7 documented, deferred (need backend/product involvement).

**Medium (next sprint):** M1–M4 partial fixes applied; M5 (typed models), M6 (UI-stack consolidation), M8 (React 18 + Vite or CRA 5 migration, axios 1.x).

**Low (backlog):** L1 CI pipeline, L2 docs, L3 dead-code sweep, L4 self-hosted fonts.

---

## 3. Implementation Roadmap

| Phase | Work | Effort | Depends on |
|-------|------|--------|-----------|
| 1 (this change-set) | Dependency hygiene, shared http client + real 401/403 handling, logic-bug fixes, error handling, HTML/React correctness, working smoke test | done | — |
| 2 | Typed domain models + remove `any` from services; extract duplicated list-page scaffold (search/table/modal) into a shared component; fix H7 mutable-field state | 3–5 dev-days | Phase 1 |
| 3 | Routing cleanup: drop `forceRefresh`, replace `<a>` with `<Link>`, remove jQuery/Bootstrap-JS dropdowns (use react-bootstrap `Nav`) | 2–3 dev-days | Phase 2 |
| 4 | Build modernization: Node 20 toolchain (Vite or CRA 5), React 18, axios 1.x, TS 5; add CI (install, typecheck, test, build) | 5–8 dev-days | Phase 3 |
| 5 | Backend-coordinated security hardening: server-derived audit user, CSRF, session handling (H5) | joint with backend team | Phase 4 |

---

## 4. Change Log for This Change-Set

Each fix below lists what/why/files/testing. No `.env.*` or deployment files were touched. No business logic was altered except where the existing code could not have implemented the evident intent (each such case is a Critical finding above).

### Fix 1 — Dependency integrity (C1, C2, H2)
- **What:** Added `react-toastify@5.5.0`, `history`, `@types/history`; removed `node-sass` and 15 unused packages (`styled-components` kept — peer dependency of `react-data-table-component`).
- **Why:** Undeclared imports break on any transitive change; `node-sass` cannot compile on Node ≥ 16; unused packages inflate install time, bundle risk and audit surface.
- **Files:** `package.json`, `yarn.lock`.
- **Migration:** run `yarn install` once. No code changes required — `sass` was already installed and is preferred by CRA's sass-loader.
- **Tested:** `yarn install` completes on Node 22; `tsc --noEmit` clean; test suite passes; production build compiles (`react-scripts build` — note that on Node ≥ 17 CRA 4 requires `NODE_OPTIONS=--openssl-legacy-provider` in the invoking shell; build scripts themselves were not modified).

### Fix 2 — Shared HTTP client with working auth handling (C3, C5, H1)
- **What:** New `src/services/http.ts` exporting a configured axios instance (base URL from `REACT_APP_API_URL`, 30 s timeout) with a response interceptor that performs the logout + toast + redirect on 401/403 **in the rejection path**, where axios actually delivers those statuses. `handleResponse` retained (API-compatible) but now checks for a genuinely missing user instead of the strings `"undefined"`/`"null"`. `App.tsx` no longer writes `undefined` into `localStorage`. Both services now use the shared instance with relative paths.
- **Why:** The previous auto-logout was unreachable code; unauthenticated users saw a frozen UI.
- **Files:** `src/services/http.ts` (new), `src/services/DonorService.tsx`, `src/services/BloodStockService.tsx`, `src/components/helper/handleResponse.ts`, `src/App.tsx`.
- **Migration:** none; endpoints and response shapes unchanged.
- **Tested:** type-check + unit smoke test; manual trace of interceptor logic.

### Fix 3 — Logic bugs (C4, C6)
- **What:** Replaced tautological `!== undefined || !== null` guards with truthy checks in 10 components; replaced the always-truthy `sourceOfBlood` chain in `AddBloodStock` with an explicit `includes()` list and restored the intended fall-through (unknown source → save disabled).
- **Why:** The former made every user (including "no user") pass the guard; the latter enabled saving stock entries with no valid source.
- **Files:** `AddBloodStock.tsx`, `AddDonorInfo.tsx`, `AddCompatibilityTest.tsx`, `AddReport.tsx`, `AddPhysicalSuitabilityTest.tsx`, `AddQuestionnaire.tsx`, `BloodStockList.tsx`, `DonorMedicalAssessment.tsx`, `AssessmentQuestionnaire.tsx`, `PhysicalSuitability.tsx`, `DonorRejectedList.tsx`, `ApprovedBloodList.tsx`, `CompatibilityList.tsx`, `ReportList.tsx` (as applicable).
- **Migration:** none.
- **Tested:** type-check; manual review of each branch against original intent.

### Fix 4 — Error handling (C7, H3, H4)
- **What:** Every service call site now has a `.catch` that surfaces a toast; list loaders additionally set the component's existing `error` state and always resolve the loading state. `isLoaded` now starts `false` so the "Loading…" path renders.
- **Why:** Silent failures in a clinical data-entry app are unacceptable; the error/loading UI existed but was unreachable.
- **Files:** all list components and Add* forms touched above.
- **Migration:** none.
- **Tested:** type-check + smoke test.

### Fix 5 — React/HTML correctness (M1, M2, M3)
- **What:** `key` on the outermost mapped element; removed nested `<h2>`; `type="cancel"` → `type="button"`; removed `defaultValue` on controlled date input; `parseInt(x, 10)` at touched sites; `translate()` falls back to the key instead of `undefined`.
- **Why:** Eliminates React key/controlled-input warnings, invalid HTML, and blank labels for missing translation keys.
- **Files:** `AddDonorInfo.tssx`, `AddBloodStock.tsx`, `context/lang.tsx`, others touched above.
- **Migration:** none.
- **Tested:** type-check + smoke test.

### Fix 6 — Working test (C8)
- **What:** `App.test.tsx` now renders `App` inside `LangState` and asserts the app header title from `i18n/en.json`.
- **Why:** The old test asserted CRA boilerplate that never existed in this app and crashed without the language provider.
- **Files:** `src/App.test.tsx`.
- **Tested:** `react-scripts test` passes.
