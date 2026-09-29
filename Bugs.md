# Bug Report

## 1. Complete task changes priority

**Expected:** Completing a task should only change its status to `done` and set `completedAt`.

**Actual:** `PATCH /tasks/:id/complete` also changed the task priority to `"medium"`.

**Discovered:** Integration test for completing a task.

**Fix:** Removed the line that changed the priority.

---

## 2. getByStatus() accepts partial status matches

**Expected:** `getByStatus("progress")` should not match `"in_progress"`.

**Actual:** `getByStatus("progress")` returned tasks with `"in_progress"` because it used `.includes()`.

**Discovered:** Unit test for `getByStatus()`.

**Fix:** Changed the comparison to strict equality:

` t.status === status `

---

## 3. Invalid pagination values are accepted

**Expected:** Invalid `page` or `limit` values should return `400`.

**Actual:** Values such as `?page=abc` were silently converted to the default page because of `parseInt(page) || 1`.

**Discovered:** Integration tests for pagination edge cases.

**Fix:** Changed parsing to `Number()` and added validation requiring positive integers.

---

## 4. PUT /tasks/:id allows protected fields to be changed

**Expected:** Only task fields that are intended to be editable should be updated.

**Actual:** `update()` spread the entire request body into the existing task, allowing fields such as `id` and `createdAt` to be changed.

**Discovered:** Unit test attempting to update protected fields.

**Fix:** Updated `update()` to only modify allowed fields.

---

## 5. README task status is inconsistent

**Expected:** The documented task status should match the status used by the API.

**Actual:** `README.md` documented `"in-progress"` while the API uses `"in_progress"`.

**Discovered:** While comparing the README with the implementation and assignment specification.

**Fix:** Updated the README to use `"in_progress"`.
