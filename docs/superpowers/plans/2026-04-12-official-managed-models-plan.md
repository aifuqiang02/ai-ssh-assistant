# Official Managed Models Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an official managed model group to the desktop title bar, route
official-model chat through the server using a server-held OpenAI-compatible
key, and enforce a shared AI-member monthly quota of 1000 requests across the
official model pool.

**Architecture:** Keep user-configured local providers unchanged, add a new
`official` managed-provider path with a server status API and server chat API,
persist model selection with explicit `source`, and back quota enforcement with
a monthly usage table plus reservation-and-refund semantics.

**Tech Stack:** Vue 3, TypeScript, Fastify, Prisma, PostgreSQL, node:test

---

### Task 1: Add Database Support For Official Monthly Usage

**Files:**

- Modify: `packages/database/prisma/schema-postgresql.prisma`
- Create: Prisma migration for `managed_ai_usage`
- Regenerate: `packages/database/src/generated/client/**`

- [ ] **Step 1: Write the failing schema/test expectation**

Add or update a targeted server/database test that assumes a user can have a
monthly official AI usage record keyed by `userId + featureKey + periodKey`.

- [ ] **Step 2: Run verification to confirm it fails or is incomplete**

Run the relevant Prisma validation or targeted test command for the server/db
package.

- [ ] **Step 3: Write minimal schema implementation**

Add `ManagedAiUsage` with:

- `userId`
- `featureKey`
- `periodKey`
- `usedCount`
- `limitCount`
- timestamps
- unique index on `[userId, featureKey, periodKey]`

Also add the inverse relation on `User`.

- [ ] **Step 4: Regenerate clients and verify**

Run the project’s Prisma generate flow and confirm the schema is valid.

### Task 2: Add Server Config For Official Managed Models

**Files:**

- Modify: server config files under `packages/server/src/config/**`
- Modify: any env example/documented config files if needed

- [ ] **Step 1: Add config contract tests or assertions**

Cover parsing for:

- `OFFICIAL_AI_ENABLED`
- `OFFICIAL_AI_BASE_URL`
- `OFFICIAL_AI_API_KEY`
- `OFFICIAL_AI_TIMEOUT_MS`
- `OFFICIAL_AI_MODELS`
- `OFFICIAL_AI_TIMEZONE`

- [ ] **Step 2: Run test to verify missing config handling**

Run the targeted server config test or validation command.

- [ ] **Step 3: Write minimal implementation**

Set defaults aligned with the approved spec:

- Base URL: `http://151.245.90.96:3000/v1`
- Models: `MiniMax-M2.7-highspeed,MiniMax-M2.7`
- Timezone: `Asia/Shanghai`

Do not hardcode these values directly in business services when config access is
available.

- [ ] **Step 4: Re-run config verification**

Confirm parsing and defaulting behave as expected.

### Task 3: Implement Official Usage Service And Quota Semantics

**Files:**

- Create: `packages/server/src/services/official-ai-usage.service.ts`
- Modify: `packages/server/src/services/billing.service.ts` if shared helpers
  are needed
- Test: `packages/server/src/services/official-ai-usage.service.test.ts`

- [ ] **Step 1: Write the failing test**

Cover:

- guest/no-plan state calculation
- monthly period key generation in `Asia/Shanghai`
- initial quota creation
- successful reservation on available quota
- refund on upstream failure
- concurrent last-slot behavior

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --import tsx/esm --test "packages/server/src/services/official-ai-usage.service.test.ts"`

- [ ] **Step 3: Write minimal implementation**

Implement helpers for:

- period key/reset time calculation
- reading current usage
- reserving quota atomically
- refunding a reserved usage
- building status payloads for guest/user/member cases

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --import tsx/esm --test "packages/server/src/services/official-ai-usage.service.test.ts"`

### Task 4: Add Official Status API

**Files:**

- Create: `packages/server/src/routes/official-ai.routes.ts`
- Modify: `packages/server/src/app.ts`
- Test: `packages/server/src/__tests__/app.test.ts`

- [ ] **Step 1: Write the failing API test**

Add coverage for:

- guest request returns official models with `guest = true`
- authenticated non-member returns disabled-by-plan state
- authenticated AI member returns remaining quota

- [ ] **Step 2: Run test to verify it fails**

Run the targeted app test command for the new route coverage.

- [ ] **Step 3: Write minimal implementation**

Register `GET /api/v1/ai/official/status` as optional-auth behavior. Do not use
the mandatory `fastify.authenticate` pre-handler directly; instead resolve token
if present and fall back to guest payload when absent/invalid.

- [ ] **Step 4: Run test to verify it passes**

Re-run the targeted app test.

### Task 5: Add Official Chat API With OpenAI-Compatible Upstream Forwarding

**Files:**

- Create: `packages/server/src/services/official-ai-chat.service.ts`
- Modify: `packages/server/src/routes/official-ai.routes.ts`
- Test: `packages/server/src/services/official-ai-chat.service.test.ts`
- Test: `packages/server/src/__tests__/app.test.ts`

- [ ] **Step 1: Write the failing test**

Cover:

- plan-required rejection
- model-not-found rejection
- quota-exceeded rejection
- successful non-streaming forwarding to `/chat/completions`
- successful streaming forwarding shape
- upstream failure triggers quota refund

- [ ] **Step 2: Run test to verify it fails**

Run targeted server tests for the service and route.

- [ ] **Step 3: Write minimal implementation**

Implement `POST /api/v1/ai/official/chat` that:

1. authenticates user
2. validates AI membership
3. validates requested model against configured official model list
4. reserves one usage slot
5. forwards to `http://151.245.90.96:3000/v1/chat/completions` using the
   server-held key
6. returns normalized non-stream or stream responses
7. refunds quota on upstream failure

- [ ] **Step 4: Run test to verify it passes**

Re-run targeted service and route tests.

### Task 6: Add Desktop Resolver For Selected Model Source

**Files:**

- Create: `apps/desktop/src/services/selected-model-resolver.service.ts`
- Modify: `apps/desktop/src/utils/titlebar-models.ts` if needed
- Test: `apps/desktop/src/services/selected-model-resolver.service.test.ts`

- [ ] **Step 1: Write the failing test**

Cover resolution for:

- legacy `{ provider, model }`
- legacy `{ providerId, modelId }`
- new local `{ source: 'local', ... }`
- new official
  `{ source: 'official', providerId: 'official', modelId: 'MiniMax-M2.7-highspeed' }`
- invalid/missing selections

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --test "apps/desktop/src/services/selected-model-resolver.service.test.ts"`

- [ ] **Step 3: Write minimal implementation**

Expose one resolver that all desktop consumers can reuse. Ensure the return type
distinguishes `supportsDirectClientCall` and `supportsManagedServerCall`.

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --test "apps/desktop/src/services/selected-model-resolver.service.test.ts"`

### Task 7: Add Official Status Client And Title Bar Grouping

**Files:**

- Create: `apps/desktop/src/services/official-model-status.service.ts`
- Modify: `apps/desktop/src/components/layout/AppTitleBar.vue`
- Modify: `apps/desktop/src/utils/titlebar-models.ts`
- Test: `apps/desktop/src/utils/titlebar-models.test.ts`
- Test: `apps/desktop/src/components/layout/AppTitleBar.test.ts`

- [ ] **Step 1: Write the failing test**

Cover:

- official group renders before local group
- guest state disables official models with login hint
- remaining quota text displays in official group header
- official model selection persists with `source = 'official'`

- [ ] **Step 2: Run test to verify it fails**

Run the targeted desktop tests for title bar and model utilities.

- [ ] **Step 3: Write minimal implementation**

Load local models first, then merge official status models into a separate
section. Keep existing local provider behavior intact.

- [ ] **Step 4: Run test to verify it passes**

Re-run targeted desktop tests.

### Task 8: Add Official Managed Chat Path In Desktop AI API Layer

**Files:**

- Modify: `apps/desktop/src/services/ai-api.service.ts`
- Create: optional helper for official model transport if needed
- Test: `apps/desktop/src/services/ai-api.service.test.ts`

- [ ] **Step 1: Write the failing test**

Cover:

- non-stream official call maps server JSON to `ChatCompletionResponse`
- stream official call maps server SSE to `onChunk`
- local provider calls still use existing direct logic
- official call does not require a local provider `apiKey`

- [ ] **Step 2: Run test to verify it fails**

Run the targeted AI API service test.

- [ ] **Step 3: Write minimal implementation**

Add a managed-provider branch such as `callOfficialManagedModel()` and keep the
public `chatCompletion()` signature stable for callers.

- [ ] **Step 4: Run test to verify it passes**

Re-run the targeted AI API service test.

### Task 9: Wire Terminal Chat To The New Resolver

**Files:**

- Modify: `apps/desktop/src/views/TerminalView.vue`
- Modify: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue`
- Test: targeted desktop tests covering model loading and message send gating

- [ ] **Step 1: Write the failing test**

Cover:

- terminal loads official selected model without looking up local `apiKey`
- send flow succeeds when official model is selected
- error handling remains correct when no model is selected

- [ ] **Step 2: Run test to verify it fails**

Run the targeted terminal/chat tests.

- [ ] **Step 3: Write minimal implementation**

Switch terminal/chat model-loading logic to the shared resolver. Remove the
assumption that every selected model can be rehydrated from local settings.

- [ ] **Step 4: Run test to verify it passes**

Re-run the targeted terminal/chat tests.

### Task 10: Explicitly Gate Unsupported V1 Entry Points

**Files:**

- Modify: `apps/desktop/src/views/PromptOptimizerView.vue`
- Modify: `apps/desktop/src/services/autocomplete/ai-suggestion-manager.ts`
- Test: targeted tests for unsupported official-model messaging

- [ ] **Step 1: Write the failing test**

Cover that these V1 entry points detect `source = 'official'` and show/return a
clear unsupported message instead of attempting local-key resolution.

- [ ] **Step 2: Run test to verify it fails**

Run the targeted tests for prompt optimizer and autocomplete logic.

- [ ] **Step 3: Write minimal implementation**

Use the shared resolver and explicitly block official-model usage in these two
paths with stable user-facing messaging.

- [ ] **Step 4: Run test to verify it passes**

Re-run the targeted tests.

### Task 11: Expose Quota Information In Existing Member UI

**Files:**

- Modify: `apps/desktop/src/views/WelcomeView.vue`
- Modify: `apps/desktop/src/views/ProfileView.vue`
- Modify: `apps/desktop/src/services/subscription.service.ts` or a new
  official-status client if preferred
- Test: targeted UI tests if present

- [ ] **Step 1: Write the failing test**

Cover display of official model monthly limit, used count, remaining count, and
reset time when official status is available.

- [ ] **Step 2: Run test to verify it fails**

Run the targeted view tests if available.

- [ ] **Step 3: Write minimal implementation**

Show official-model quota information in an existing member-facing surface,
reusing the official status payload rather than inventing a second source.

- [ ] **Step 4: Run test to verify it passes**

Re-run the targeted view tests.

### Task 12: Run Targeted Verification And Record Outcome

**Files:**

- Modify: `重构记录.md` if this repo uses it for implementation notes

- [ ] **Step 1: Run targeted tests**

Run all newly added or modified targeted tests for:

- server quota service
- server official chat/status routes
- desktop selected-model resolver
- title bar grouping
- AI API transport adaptation
- terminal chat integration
- unsupported V1 entry-point gating

- [ ] **Step 2: Run targeted type checks**

Run relevant package type checks such as:

- `pnpm --filter @ai-ssh/server test` or equivalent targeted server verification
- `pnpm --filter @ai-ssh/desktop type-check`

If repo-wide existing failures remain, record only whether this feature added
any new failures.

- [ ] **Step 3: Record implementation outcome**

Update `重构记录.md` or the repo’s chosen implementation log with:

- what shipped
- which entry points are intentionally unsupported in V1
- test results
- any remaining operational risks around upstream availability or refund repair
