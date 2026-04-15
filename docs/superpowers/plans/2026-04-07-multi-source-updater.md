# Multi-Source Updater Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a desktop update mechanism that checks a release manifest on
startup, probes multiple download sources, pre-downloads the installer in the
background, and installs from cache when the user confirms.

**Architecture:** Generate a custom `update-manifest.json` during release
publishing, then consume it from a new Electron main-process update service. The
renderer listens to update state events, shows progress and completion prompts,
and invokes a platform-specific install action that reuses the cached artifact
instead of re-downloading.

**Tech Stack:** Electron main/preload IPC, Vue 3, TypeScript, node:test, GitHub
Actions, electron-builder release artifacts

---

### Task 1: Add Release Manifest Generation And Upload

**Files:**

- Create: `apps/desktop/scripts/generate-update-manifest.mjs`
- Modify: `.github/workflows/release.yml`

- [ ] **Step 1: Write the failing test**

Add assertions showing the manifest generator emits platform entries with
`version`, `sha512`, `size`, and multiple `sources`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "apps/desktop/scripts/generate-update-manifest.test.mjs"`
Expected: FAIL because the generator does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Generate `update-manifest.json` from built artifacts and upload it alongside
installers and updater metadata files.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test "apps/desktop/scripts/generate-update-manifest.test.mjs"`

### Task 2: Add Main-Process Update Service

**Files:**

- Create: `apps/desktop/electron/services/update-service.ts`
- Modify: `apps/desktop/electron/main/index.ts`
- Modify: `apps/desktop/electron/preload/index.ts`
- Modify: `apps/desktop/src/types/electron.d.ts`
- Test: `apps/desktop/electron/services/update-service.test.ts`

- [ ] **Step 1: Write the failing test**

Cover manifest parsing, source probing preference, stale cache reuse, and
download state transitions.

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --import tsx/esm --test "apps/desktop/electron/services/update-service.test.ts"`

- [ ] **Step 3: Write minimal implementation**

Implement update checking, fastest-source selection, cached artifact download,
state broadcasting, and install dispatch.

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --import tsx/esm --test "apps/desktop/electron/services/update-service.test.ts"`

### Task 3: Wire Renderer Update UX

**Files:**

- Create: `apps/desktop/src/services/update-client.ts`
- Modify: `apps/desktop/src/App.vue`
- Modify: `apps/desktop/src/views/SettingsView.vue`
- Test: `apps/desktop/src/App.test.ts`
- Test: `apps/desktop/src/views/SettingsView.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions for startup update initialization, settings update section,
progress text, and install action wiring.

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --test "apps/desktop/src/App.test.ts" "apps/desktop/src/views/SettingsView.test.ts"`

- [ ] **Step 3: Write minimal implementation**

Subscribe to update state events, show notification when download completes,
expose manual retry/install buttons in settings, and auto-start background
checking after app mount.

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --test "apps/desktop/src/App.test.ts" "apps/desktop/src/views/SettingsView.test.ts"`

### Task 4: Verify End-To-End Release Wiring

**Files:**

- Modify: `重构记录.md`

- [ ] **Step 1: Run targeted verification**

Run: `node --test "apps/desktop/scripts/generate-update-manifest.test.mjs"`
`node --import tsx/esm --test "apps/desktop/electron/services/update-service.test.ts"`
`node --test "apps/desktop/src/App.test.ts" "apps/desktop/src/views/SettingsView.test.ts"`

- [ ] **Step 2: Run targeted type check**

Run: `pnpm --filter @ai-ssh/desktop type-check` Expected: existing repo-wide
desktop type errors may remain, but updater-related files should not add new
type failures.

- [ ] **Step 3: Record implementation outcome**

Update `重构记录.md` with updater additions, verification output, and known
remaining risks.
