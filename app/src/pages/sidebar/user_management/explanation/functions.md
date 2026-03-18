# User Management Module — Full Function Reference

This document explains every function, hook, and component in the `user_management` module, including why each exists and how it works.

---

## `user.types.ts` — Type Definitions

No functions. Exports shared TypeScript interfaces and constants used across all files in the module.

---

## `hooks/useEnrollmentForm.ts`

The brain of the enrollment wizard. All API calls and state live here so `EnrollUserPage` stays a pure rendering shell.

### State

| State | Type | Purpose |
|---|---|---|
| `currentStep` | `number` | Tracks which of the 3 wizard steps is active |
| `createdUserId` | `string \| null` | Stores the ID returned from Step 1 user creation, so Step 2 can assign a role to it |
| `accountData` | `AccountFormData` | Controlled form values for Step 1 |
| `profileData` | `ProfileFormData` | Controlled form values for Steps 2 and 3 |
| `studentData` | `StudentFormData` | Extra fields shown only when role is `student` |
| `avatarUpload` | `string \| null` | Object URL of the locally selected avatar image |
| `newDocuments` | `any[]` | List of documents selected locally before save |
| `error` | `string \| null` | Current validation or API error message |

---

### `useEffect` — Edit Mode Prefill

```ts
useEffect(() => { fetchUserForEdit() }, [editingUserId])
```

**Why:** When arriving at `/users/:id/edit`, the URL contains the user's ID. This effect fires once on mount, detects a non-null `editingUserId`, and pre-populates all form fields with existing data so the user edits rather than re-enters everything.

**How:** Calls `GET /users/:id`. Maps API response fields onto `accountData`, `profileData`, and `studentData`.

---

### `useEffect` — Auto-clear Error

```ts
useEffect(() => { ... setTimeout(() => setError(null), 3000) }, [error])
```

**Why:** The error toast should disappear automatically without the user having to dismiss it. Each time `error` is set to a new message, this effect starts a 3-second timer. Cleanup function cancels the timer if a new error arrives before 3 seconds are up (prevents stale clearance).

---

### `handleNextStep()`

Handles the **Next** button click on steps 1 and 2.

#### Step 1 logic:
1. Validates all `accountData` fields (empty checks + email regex + password length).
2. If valid and not editing, calls `POST /users` with the account payload.
3. Stores the returned `newUser.id` in `createdUserId` (needed by step 2).
4. Shows a success toast and advances to step 2.
5. If editing, skips creation and goes straight to step 2 (user already exists).

**Why separate from `handleSave`:** Step 1 creates the user record immediately so we have a real ID to work with for role assignment. This avoids having to batch everything into one giant submit at the end.

#### Step 2 logic:
1. Validates that a role is selected.
2. Resolves `targetUserId` (either the editing ID or the newly created ID from step 1).
3. Calls `POST /users/:id/authorities` with the role converted to uppercase (API requirement).
4. Advances to step 3.

---

### `handleSave()`

Handles the **Complete Enrollment** / **Update User** button on step 3.

1. Validates department (required unless `super_admin`), phone, and all student fields if role is `student`.
2. Builds the payload combining profile, student, and name data.
3. Calls `PUT /users/:id` to persist the full profile.
4. On success: shows a toast and redirects to `/users`.
5. On failure: sets `error` state which triggers the animated toast.

**Why `PUT` and not `PATCH`:** The API endpoint replaces the user's profile fields, so a full `PUT` with all known values is used.

---

## `EnrollUserPage.tsx`

### `EnrollUserPage` component

The top-level page component. Renders:
1. A page header with a back arrow and contextual title (Enroll vs Edit).
2. A **step indicator** — three numbered circles connected by a line. Each circle turns primary-colored when its step is reached.
3. The active step's card, conditionally rendered with `currentStep === N`.
4. The `ErrorToast` component receiving the `error` state.

**Why a wizard layout instead of one long form:** Breaking enrollment into steps reduces cognitive load and allows the API to receive partial data in stages (user creation before role assignment).

---

### `ErrorToast` component

A private component (not exported) defined at the bottom of the file.

```
error prop changes
     ↓
setContent(error)          ← keeps content while animating out
setTimeout 10ms            ← lets DOM render the off-screen div first
setShow(true)              ← triggers CSS translate from right to 0
     ↓ (3 seconds later, from useEnrollmentForm)
error → null
     ↓
setShow(false)             ← triggers CSS translate back off-screen
setTimeout 300ms           ← waits for animation to finish
setContent(null)           ← removes from DOM entirely
```

**Why a 10ms delay on entry:** CSS transitions only animate between states. If `show` is set at the same time the element is added to the DOM, the browser treats the initial and target state as identical. The 10ms delay lets the browser paint the off-screen starting position first.

**Why dual state (`show` + `content`):** `show` controls the CSS animation class, while `content` controls whether the element exists in the DOM at all. If we removed the element immediately when `error` becomes null, there would be no element to animate out. `content` is cleared only after the exit animation completes.

---

## `UsersPage.tsx`

### `fetchUsers()`

```ts
const fetchUsers = async () => { ... }
```

Calls `GET /users` with pagination params (`page`, `size`, `sort`, `direction`). Handles two possible API response shapes:
- A plain array (simple list).
- A Spring Page object `{ content: [], totalPages: ... }`.

**Why the dual-format handling:** Backend Spring Boot `Page` responses wrap data in a `content` field. The code defensively handles both so it works regardless of whether the endpoint is paginated or not.

**Why not use React Query:** The page uses manual `useState` + `useEffect` to keep the setup explicit and understandable without adding an abstraction layer for a single fetch.

---

### `filteredUsers` (derived value)

```ts
const filteredUsers = apiUsers.filter((u) => { ... })
```

Runs client-side search across username, email, ID, first name, last name, and full name. Search is case-insensitive.

**Why client-side search instead of a search API call:** Avoids a network round-trip per keystroke on small datasets. The page already fetches a page of results, so filtering locally is fast.

---

### `handleNextPage()` / `handlePrevPage()`

Increments or decrements `page`. `handleNextPage` only enables if the current result count equals `size` (full page), implying there may be more data. `handlePrevPage` is disabled at page 0.

**Why this heuristic:** The API does not return total count metadata in the response format used, so the presence of a full page is treated as a signal that a next page exists.

---

### `useEffect` — Reset page on search

```ts
useEffect(() => { setPage(0) }, [search])
```

**Why:** When the user types a new search query, they should start from page 1, not remain on page 5 of a previous result set.

---

## `UserDetailsPage.tsx`

### `useEffect` — Fetch user

```ts
useEffect(() => { fetchUser() }, [userId, toast])
```

Fires when the page mounts or the URL `userId` changes. Calls `GET /users/:id`. Sets the `user` state on success or the `error` state on failure (which renders a fallback UI instead of the main layout).

---

### `handleDelete()`

Uses `window.confirm` for quick confirmation before calling `DELETE /users/:id`.

**Why `window.confirm` and not a modal:** Simplest approach for a destructive action. No extra component state needed. Can be replaced with a dialog component later.

**Why it checks `canEdit && !isSelf`:** Prevents an admin from accidentally deleting their own account from the UI. The button is hidden entirely in this case.

---

### `handleEdit()`

Navigates to `/users/:id/edit`. The `EnrollUserPage` and `useEnrollmentForm` detect the `:id` segment in the URL to enter edit mode.

---

## `components/enrollment/StepThreeProfileDetails.tsx`

### `getInitials(name: string)`

```ts
const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
```

**Why:** The `Avatar` component shows initials as a fallback when no photo is selected. This function extracts up to 2 initials from the user's full name.

---

### `handleImageUpload(e)`

Reads the selected file, enforces a 5 MB size limit, and creates a local object URL via `URL.createObjectURL`. The URL is stored in `avatarUpload` state, which feeds into the `AvatarImage` `src` attribute for instant preview.

**Why `URL.createObjectURL` and not `FileReader`:** Object URLs are synchronous, memory-efficient, and native — no need to encode the file as base64.

---

### `triggerFileInput()`

Calls `.click()` on a hidden `<input type="file">` via a `useRef`.

**Why a hidden input:** Gives full control over the trigger button's appearance without being constrained by the browser's default file input styling.

---

## `components/enrollment/UserDocumentUpload.tsx`

### `handleNewDocumentUpload(e)`

Reads the selected file and pushes a locally constructed document object onto the `documents` array. Does **not** make an API call.

**Why local-only:** The backend document upload endpoint is not yet available. The document list is passed to `handleSave` in the hook for future integration.

---

### `removeNewDocument(docId)`

Filters the document with the matching ID out of the `documents` array. Uses functional `setState` (`prev => prev.filter(...)`) to safely read the latest state.

---

## `components/features/UserProfileCard.tsx`

### `getInitials(name: string)`

Same logic as in `StepThreeProfileDetails` — extracts up to 2 initials for the avatar fallback. Defined locally to keep the component self-contained.

---

## `components/features/UserDocuments.tsx`

### `handleDocumentUpload(_e)`

Currently a stub that fires a toast informing the user upload is unavailable. The file input and button exist in the UI so the UI structure is ready for future enablement without a layout change.

---

## `App.tsx` — Route Configuration

The enrollment wizard is registered on two routes:

| Route | Component | Mode |
|---|---|---|
| `/users/enroll` | `EnrollUserPage` | Create mode (`editingUserId` = null) |
| `/users/:id/edit` | `EnrollUserPage` | Edit mode (`editingUserId` = URL param) |

**Why reuse `EnrollUserPage` for edit:** The form structure, validation, and API logic are nearly identical. The hook detects the URL pattern and switches between create/edit behaviour automatically, eliminating code duplication.
