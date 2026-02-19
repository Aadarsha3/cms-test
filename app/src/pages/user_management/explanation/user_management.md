# User Management — What Does Each File Do?

Think of this module like a **staff office in a school**:
- There's a **front desk** where you see the list of all staff and students → `UsersPage`
- A **registration desk** where you fill out forms to add someone new → `EnrollUserPage`
- A **profile room** where you see one person's full details → `UserDetailsPage`

---

## Quick Map

```
user_management/
├── UsersPage.tsx               ← The list of all users
├── EnrollUserPage.tsx          ← The 3-step form to add/edit a user
├── UserDetailsPage.tsx         ← View one user's full profile
├── user.types.ts               ← Shared type definitions (no logic)
│
├── hooks/
│   └── useEnrollmentForm.ts    ← All logic for the enroll form
│
└── components/
    ├── enrollment/             ← One component per form step
    │   ├── StepOneAccount.tsx
    │   ├── StepTwoRoleSelection.tsx
    │   ├── StepThreeProfileDetails.tsx
    │   ├── ProfileDetailsForm.tsx
    │   ├── StudentAcademicForm.tsx
    │   └── UserDocumentUpload.tsx
    └── features/               ← Display cards on the profile page
        ├── UserProfileCard.tsx
        ├── UserPersonalInfo.tsx
        └── UserDocuments.tsx
```

---

## `user.types.ts` — Shared Definitions

This file has **no logic, no functions, no UI**. It only defines the *shape* of data used across every other file.

### Why it exists
Without this, each file would have to guess what fields a user has. With it, TypeScript can warn you if you forget a field or pass the wrong type.

### What's in it

#### `UserDetail` — the full user object from the API
Every field a user can have. The `?` means the field might not always be present (optional).
```
id              — unique ID in the database
username        — the login name (e.g. "john.doe")
primaryEmail    — email address
givenName       — first name
familyName      — last name
createdAt       — when the account was made
role            — "student", "admin", "teacher", etc.
department      — which department they belong to
status          — "active" or "inactive"
phone           — phone number
User_Id         — a separate internal identifier
avatarUrl       — link to their profile photo
subRoles        — extra roles (e.g. "sports_committee_member")
universityId    — students only
dateOfBirth     — students only
gender          — students only
currentClass    — students only (e.g. "BCS Year 2")
semester        — students only (e.g. "3")
guardianName    — students only
guardianContact — students only
guardianRelationship — students only
documents       — list of attached files
```

#### `AccountFormData` — Step 1 of the enroll form
```
firstName, lastName, userId (username), email, password
```

#### `ProfileFormData` — Steps 2 and 3 of the enroll form
```
role, subRoles, department, phone, status
```

#### `StudentFormData` — Extra student-only fields in Step 3
```
universityId, dateOfBirth, gender, currentClass, semester,
guardianName, guardianContact, guardianRelationship
```

#### `roleLabels` — display names for roles
```
"super_admin" → "Super Admin"
"admin"       → "Admin"
"student"     → "Student"
"teacher"     → "Teacher"
...
```

#### `roleColors` — Tailwind CSS classes for role badges
```
"super_admin" → red badge
"admin"       → blue badge
"student"     → grey badge
"teacher"     → amber badge
...
```

---

## `hooks/useEnrollmentForm.ts` — The Brain of the Enroll Form

This is a **custom React hook** — a function that contains all the logic (state, validation, API calls) for the enrollment wizard. The page component (`EnrollUserPage`) just calls this hook and uses what it returns.

**Why separate it?** Because the page component would become massive if it also had all the logic. Putting logic in a hook keeps the page file clean and the logic easy to test or reuse.

---

### Initial Values (the starting state of the form)

```ts
initialAccountData  = { firstName: "", lastName: "", userId: "", email: "", password: "" }
initialProfileData  = { role: "student", subRoles: [], department: "", phone: "", status: "active" }
initialStudentData  = { universityId: "", dateOfBirth: "", gender: "", currentClass: "",
                        semester: "", guardianName: "", guardianContact: "", guardianRelationship: "" }
```

These are defined outside the hook so they're created once and never change. The hook uses them as the starting values for `useState`.

---

### State (what the hook tracks)

| State variable | Type | What it holds |
|---|---|---|
| `currentStep` | number (1–3) | Which step of the wizard you're on |
| `createdUserId` | string or null | The ID the backend gives us after creating the user in Step 1 |
| `accountData` | AccountFormData | Live values from the Step 1 inputs |
| `profileData` | ProfileFormData | Live values from the Step 2/3 inputs |
| `studentData` | StudentFormData | Live values from the student section in Step 3 |
| `avatarUpload` | string or null | A temporary local URL for the selected photo (for preview) |
| `newDocuments` | array | Documents selected locally before saving |
| `error` | string or null | The current error message (auto-clears after 3 seconds) |

---

### `editingUserId` — how edit mode is detected

```ts
const match = location.match(/\/users\/([^\/]+)\/edit/)
const editingUserId = match ? match[1] : null
```

This reads the current URL. If the URL is `/users/abc123/edit`, it extracts `"abc123"` as the ID. If the URL is `/users/enroll`, it returns `null`.

**This single value controls everything:** whether to prefill the form, whether to call POST or PUT, and what to show on buttons.

---

### `useEffect` — Auto-clear Errors

```ts
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 3000)
    return () => clearTimeout(timer)
  }
}, [error])
```

**What it does:** Every time `error` changes to a message, it sets a 3-second timer to automatically clear it.

**Why `return () => clearTimeout(timer)`:** This is a *cleanup function*. If a new error arrives before 3 seconds is up, React runs this cleanup first to cancel the old timer — so the new error gets its own fresh 3-second countdown.

---

### `useEffect` — Prefill Form for Editing

```ts
useEffect(() => {
  if (editingUserId) {
    // fetch GET /users/:id
    // then fill in accountData, profileData, studentData from response
  }
}, [editingUserId])
```

**What it does:** When the page loads in edit mode (URL has `/edit`), this fetches the existing user data and fills the form with it so you don't have to type everything from scratch.

**Specifically it maps:**
- `username` → split into `firstName` + `lastName` for `accountData`
- `primaryEmail` → `accountData.email`
- `role`, `department`, `phone`, `status` → `profileData`
- All student fields → `studentData` (only if the role is "student")
- `password` is always left blank — you only set it if you want to change it

---

### `handleNextStep()` — The Next Button Logic

This handles clicking **Next** on Step 1 and Step 2. It does different things depending on which step you're on.

#### On Step 1 (Account Setup):
```
1. Clear any existing error
2. Check that firstName is not empty        → error if missing
3. Check that lastName is not empty         → error if missing
4. Check that userId is not empty           → error if missing
5. Check that email is not empty            → error if missing
6. Check email format with regex            → error if invalid
7. Check password length (≥ 6 chars)        → error if too short
   (skip password check if editing — blank = keep current password)
8. If NOT editing AND user not yet created:
     Call POST /users with { username, primaryEmail, givenName, familyName, password }
     → Save the returned user ID in createdUserId
     → Show a success toast
9. Move to step 2
```

**Why create the user at Step 1 and not at the end?**
Because Step 2 calls `POST /users/:id/authorities` — it needs a real user ID. That ID only exists after the user is created. So we create the account first, then assign the role.

**Why check `!createdUserId`?**
If someone somehow clicks Next on Step 1 twice (or goes back and forward), we don't want to create the same user twice. Once `createdUserId` is set, we skip the POST and just advance.

#### On Step 2 (Role Selection):
```
1. Clear any existing error
2. Check that a role has been selected    → error if missing
3. Resolve targetUserId = editingUserId OR createdUserId
   → error if neither exists (shouldn't happen normally)
4. Call POST /users/:id/authorities with { authority: role.toUpperCase() }
   → e.g., "student" becomes "STUDENT" because the backend expects uppercase
5. Show a success toast
6. Move to step 3
```

**Why `role.toUpperCase()`?** The backend uses Java enums which are always uppercase (`STUDENT`, `ADMIN`, etc.). Sending lowercase would cause a 400 error.

---

### `handleSave()` — The Final Save Button Logic

Called when clicking **Complete Enrollment** or **Update User** on Step 3.

```
1. Clear any existing error
2. Check that department is selected (unless super_admin, who has access to all)
3. Check that phone is not empty
4. If role is "student", check ALL student fields:
   - dateOfBirth, gender, currentClass, semester
   - guardianName, guardianContact, guardianRelationship
   → single error "Please fill in all student details" if anything missing
5. Build the payload:
   {
     name: firstName + " " + lastName,
     role, department, phone, status,
     ...all studentData fields (spread in, ignored by backend if not student),
     subRoles
   }
6. Resolve targetUserId = editingUserId OR createdUserId
7. If editing and password is blank, delete it from payload
   (so the existing password is not overwritten with an empty string)
8. Call PUT /users/:id with the payload
9. Show success toast
10. Redirect to /users (the user list page)
```

**Why `PUT` and not `PATCH`?**
The backend endpoint replaces the full profile, so all fields must be sent. `PATCH` would only update specific fields, but this backend doesn't support partial updates.

---

## `EnrollUserPage.tsx` — The Enroll Page

### What it renders

1. **Back arrow button** — goes to `/users`
2. **Page title** — says "Enroll New User" or "Edit User" based on `editingUserId`
3. **Step indicator** — three numbered circles at the top

```
  ①Account ——————— ②Role ——————— ③Details
```

Each circle is highlighted (primary color) once its step is reached. The line between them is a `div` with absolute positioning that spans the full width, sitting behind the circles.

4. **The active step card** — only one of the three steps is shown at a time, using `currentStep === 1 && (...)` style conditional rendering
5. **`<ErrorToast error={error} />`** — the error notification at the bottom

---

### `ErrorToast` — The Error Notification

This component lives inside `EnrollUserPage.tsx` and is **not exported** (only used here).

#### Its own state:
- `show` — controls whether the CSS animation is in the "visible" or "off-screen" position
- `content` — holds the text to display (kept separate from `error` so it stays visible during the exit animation)

#### The full animation flow:
```
1. error prop becomes "Password too short"
   → setContent("Password too short")    keeps message text in DOM
   → setTimeout 10ms: setShow(true)      slides the toast ON screen

2. 3 seconds later, auto-clear fires (from useEnrollmentForm)
   → error prop becomes null
   → setShow(false)                      slides the toast OFF screen
   → setTimeout 300ms: setContent(null)  removes element from DOM (after animation)
```

**Why the 10ms delay before `setShow(true)`?**
CSS transitions only animate between two different states. If `show` becomes `true` at the exact same moment the element appears in the DOM, the browser has no "starting state" to animate from — it just snaps to the final position. The 10ms gap gives the browser time to paint the off-screen starting position first.

**Why separate `show` and `content`?**
If we removed the element immediately when `error` becomes null, there would be no element to slide out — it would just disappear instantly. `content` keeps the message visible while `show = false` plays the exit animation. Then after 300ms (the animation duration), `content` is cleared and the element is removed.

#### Position:
- **On mobile:** stretches across the full bottom of the screen (`left-4 right-4 bottom-4`)
- **On desktop:** sits in the bottom-right corner (`md:bottom-8 md:right-8 md:left-auto md:max-w-sm`)

---

## `UsersPage.tsx` — The User List Page

### State

| State | Type | What it does |
|---|---|---|
| `apiUsers` | UserResponse[] | The raw list of users fetched from the API for the current page |
| `loading` | boolean | `true` while waiting for the API; shows a spinner |
| `error` | string or null | Set if the API call fails; shows an error message in the table |
| `search` | string | What the user has typed in the search box |
| `page` | number | Current page index (starts at 0) — sent to the API |
| `size` | number | How many users per page (10) — sent to the API |
| `sort` | string | Which field to sort by (currently "id") |
| `direction` | string | "ASC" or "DESC" (currently "DESC") |

---

### `fetchUsers()` — API Call

```ts
GET /users?page=0&size=10&sort=id&direction=DESC
```

Handles two possible response shapes from the backend:
- **Plain array** `[user1, user2, ...]` — used directly
- **Spring Page object** `{ content: [user1, user2, ...], totalPages: 3 }` — extracts the `content` array

**Why two response formats?** Spring Boot's `Pageable` feature can return data either way depending on how the endpoint is written. This defensive check makes the frontend work with both.

**Called:** on mount, and every time `page`, `size`, `sort`, or `direction` changes.

---

### `filteredUsers` — Search Filter

```ts
const filteredUsers = apiUsers.filter(u => {
  // checks username, email, id, givenName, familyName, and full name
  // against search.toLowerCase()
})
```

**Why client-side?** Filtering locally avoids making a network request every time a key is pressed. The page already has a full page of results, so filtering locally is instant.

---

### `openUserDetails(userId)` — Row Click Handler

```ts
setLocation(`/users/${userId}`)
```

Navigates to `/users/abc123`. Wouter's `setLocation` is used instead of a `<Link>` so the entire row is clickable, not just a specific element.

---

### `handleNextPage()` / `handlePrevPage()` — Pagination

- **Next:** increments `page` — but only if `apiUsers.length === size`. A full page means there's *probably* more data on the next page.
- **Prev:** decrements `page`. Disabled when `page === 0`.

**Why "probably"?** The API doesn't return a total count in this response format. Checking if we got a full page is the best available signal. If the last page happens to have exactly 10 users, the Next button will show — but clicking it will return an empty list, which the UI handles gracefully.

---

### `useEffect` — Reset page on search

```ts
useEffect(() => { setPage(0) }, [search])
```

When the user types a new search, jump back to page 1. Without this, searching while on page 5 would show no results (page 5 of the filtered set might not exist).

---

## `UserDetailsPage.tsx` — The Profile View Page

### State
- `user` — the fetched UserDetail object, or null if not loaded yet
- `loading` — shows a full-screen spinner while fetching
- `error` — shows a fallback screen with a "Back to Users" button if fetch fails

### Derived values
```ts
const userId = params?.id           // from the URL: /users/:id
const isSelf = currentUser?.id === userId   // true if viewing own profile
const canEdit = role === "admin" || role === "super_admin"
```

---

### `useEffect` — Fetch User

```ts
useEffect(() => { fetchUser() }, [userId, toast])
```

Calls `GET /users/:id`. On success: sets `user` state. On failure: sets `error` and shows a destructive toast notification.

`toast` is listed as a dependency of `useEffect` because it's used inside the callback, and React requires all values used inside effects to be listed. In practice, `toast` never changes identity, so this effect only runs when `userId` changes.

---

### `handleDelete()`

```ts
if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
  await userApi.delete(`/users/${user.id}`)
  toast({ title: "User deleted successfully" })
  setLocation("/users")
}
```

Uses the browser's `confirm()` dialog (a simple modal) before deleting.

**Why `canEdit && !isSelf`?** An admin deleting their own account would lock them out of the system. Hiding the button when `isSelf` is true prevents this. The backend also enforces this, but hiding the button gives a better user experience.

---

### `handleEdit()`

```ts
setLocation(`/users/${user.id}/edit`)
```

Navigates to the edit route, which renders `EnrollUserPage`. The hook inside that page detects `/edit` in the URL and loads existing data into the form.

---

## `components/enrollment/`

### `StepOneAccount.tsx`

Renders the account credentials form.

**Props:**
- `data` / `setData` — the controlled `AccountFormData` state from the hook
- `editingUserId` — if non-null, the password label changes to "(Leave blank to keep current)"

**Internal state:**
- `showPassword` — toggles between `type="password"` and `type="text"` on the password input
  - Controlled by a button with an Eye/EyeOff Lucide icon

All field changes use inline handlers:
```tsx
onChange={(e) => setData({ ...data, firstName: e.target.value })}
```
The spread (`...data`) is important — it copies all existing values and only overwrites the one that changed.

---

### `StepTwoRoleSelection.tsx`

Renders a single `<Select>` dropdown for picking a primary role.

**Props:**
- `profileData` / `setProfileData` — controlled state
- `isSuperAdmin` — whether the logged-in user is a super-admin

**Conditional options:**
```tsx
{isSuperAdmin && <SelectItem value="admin">Admin</SelectItem>}
{isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
```

Regular admins cannot create admin or super-admin accounts — this is UI-level privilege restriction. The backend enforces it server-side as well.

---

### `StepThreeProfileDetails.tsx`

Orchestrates the entire third step by composing four sub-components.

**Internal state:**
- `fileInputRef` — a React ref attached to a hidden `<input type="file">` for avatar upload

**Functions:**

#### `getInitials(name)`
```ts
name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
```
Takes a full name and returns up to 2 initials for the avatar fallback.

#### `triggerFileInput()`
```ts
fileInputRef.current?.click()
```
Clicks the hidden file input programmatically. This lets the button look however we style it, decoupled from the browser's default file picker appearance.

#### `handleImageUpload(e)`
```ts
const file = e.target.files?.[0]
if (file.size > 5 * 1024 * 1024) { /* show error toast */ return }
setAvatarUpload(URL.createObjectURL(file))
```
- Enforces a **5 MB size limit** before doing anything with the file
- Creates a temporary local URL for the selected image using the browser's built-in `URL.createObjectURL` — this gives an instant preview without uploading anything to a server yet
- `URL.createObjectURL` is preferred over reading the file as base64 (`FileReader.readAsDataURL`) because it's faster and doesn't encode the file into a large string

---

### `ProfileDetailsForm.tsx`

A card with dropdowns for department, phone input, and status (Active/Inactive).

**Props:**
- `data` / `setData` — controlled `ProfileFormData`
- `isAdmin` — if true, the department is locked to the admin's own department
- `userDepartment` — the admin's department (used when locked)

**Department locking:**
```ts
const displayDepartment = isAdmin ? userDepartment : data.department
// ...
<Select disabled={isAdmin} value={displayDepartment}>
```
When an `admin` (not super-admin) creates a user, they can only assign users to their own department. `super_admin` gets a full free-choice dropdown.

**Department filter:**
```ts
departments.filter(d => data.role === "super_admin" || d !== "Administration")
```
The "Administration" department is hidden from the list unless the role being enrolled is `super_admin`. Regular roles don't belong to the Administration department.

---

### `StudentAcademicForm.tsx`

A grid of fields for student-specific academic and guardian details. Only rendered in Step 3 when the selected role is `student`.

No custom functions. All field updates use inline handlers:
```tsx
onChange={(e) => setData({ ...data, universityId: e.target.value })}
```

The `classes` and `semesters` arrays at the top of the file define the dropdown options:
```ts
const classes = ["BCS Year 1", "BCS Year 2", ..., "BME Year 4"]
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]
```

---

### `UserDocumentUpload.tsx`

Handles document attachment locally during enrollment.

**Props:**
- `documents` / `setDocuments` — list of locally selected documents

**Ref:**
- `newDocumentInputRef` — a React ref for the hidden file input (same pattern as avatar upload)

#### `triggerNewDocumentInput()`
Clicks the hidden file input to open the file picker.

#### `handleNewDocumentUpload(e)`
```ts
const newDoc = {
  id: Date.now().toString(),   ← unique enough for local state
  name: file.name,
  type: file.type,
  size: (file.size / 1024 / 1024).toFixed(2) + " MB",  ← converts bytes to MB
  uploadDate: new Date().toISOString().split('T')[0],    ← "2026-02-19"
}
setDocuments(prev => [...prev, newDoc])
```

**Important:** No API call is made. The documents are stored in local state only. When `handleSave()` in the hook runs, these documents can be included in the payload for future backend integration.

#### `removeNewDocument(docId)`
```ts
setDocuments(prev => prev.filter(d => d.id !== docId))
```
Uses the functional form of `setDocuments` (passing a function rather than a value) to ensure it always reads the latest state — important when removing multiple documents quickly.

---

## `components/features/`

These are **read-only display components** with no forms or edits. They receive a `user` object as a prop and display it.

### `UserProfileCard.tsx`

The left column of the profile page. Shows:
- Large avatar with initials fallback
- Username in large bold text
- Role badge (color from `roleColors`, label from `roleLabels`)
- A list of contact details with Lucide icons: email, phone, department, status, join date

**`getInitials(name)`**
Same as in `StepThreeProfileDetails` — takes a name and returns 1–2 initials. Defined locally so this component has zero external utility dependencies.

**Fallback values:**
```ts
const displayRole = user.role || "member"       // if role is missing
const displayDepartment = user.department || "N/A"
```

---

### `UserPersonalInfo.tsx`

Shows system ID information and, for students, their university ID. The student section is wrapped in:
```tsx
{displayRole === "student" && ( ... )}
```

So it only appears when the user being viewed is a student.

---

### `UserDocuments.tsx`

Displays the user's attached documents (from `user.documents`).

- If the list is empty: shows a dashed-border "No documents available" placeholder
- If documents exist: shows each one with a file icon, name, size, upload date, and a (disabled) Download button

**Upload button is visible but disabled** — the UI is ready for the feature; the underlying API endpoint just isn't available yet.

#### `handleDocumentUpload(_e)`
```ts
toast({ title: "Document upload is not yet available." })
```
The `_e` prefix on the parameter signals intentionally unused — suppresses TypeScript and lint warnings without removing the parameter entirely (which would break the `onChange` signature).

---

## How a User Gets Enrolled — Complete Flow

```
[User clicks "Enroll User"] on UsersPage
       ↓
EnrollUserPage loads (currentStep = 1)
useEnrollmentForm initializes with empty state

STEP 1 — Account Setup
  User types: First Name, Last Name, User ID, Email, Password
  [Clicks Next]
    → validate all fields
    → POST /users { username, primaryEmail, givenName, familyName, password }
    → backend creates account, returns { id: "abc123", ... }
    → save "abc123" in createdUserId
    → currentStep = 2

STEP 2 — Role Selection
  User selects: Student
  [Clicks Next]
    → validate role is selected
    → POST /users/abc123/authorities { authority: "STUDENT" }
    → backend assigns the role
    → currentStep = 3

STEP 3 — User Details
  User fills: Department, Phone, Class, Semester, Guardian details, Avatar, Docs
  [Clicks Complete Enrollment]
    → validate all required fields
    → PUT /users/abc123 { name, role, department, phone, ...student fields }
    → backend saves profile
    → toast: "User profile updated successfully"
    → navigate to /users
```

---

## How App.tsx Registers These Pages

```tsx
<Route path="/users">
  <ProtectedRoute component={UsersPage} permission="users_view" />
</Route>
<Route path="/users/enroll">
  <ProtectedRoute component={EnrollUserPage} permission="users_create" />
</Route>
<Route path="/users/:id/edit">
  <ProtectedRoute component={EnrollUserPage} permission="users_edit" />
</Route>
<Route path="/users/:id">
  <ProtectedRoute component={UserDetailsPage} permission="users_view" />
</Route>
```

`ProtectedRoute` checks:
1. Is the user logged in? If not → redirect to `/login`
2. Does the user have the required permission? If not → redirect to `/dashboard`

Both `/users/enroll` and `/users/:id/edit` render the same `EnrollUserPage` component. The hook reads the URL to decide whether to behave as a "create" or "edit" form — no separate page needed.
