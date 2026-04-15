# OpenRouter Free Model Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `openrouter-free` auto-refresh valid high-end free models in the
renderer, cache them into `settings.aiProviders[openrouter-free].models`, and
keep the title bar responsive while removing stale invalid selections.

**Architecture:** Add a dedicated renderer-side refresh service that fetches
OpenRouter models, filters and verifies candidates, then patch-saves only the
`openrouter-free` provider back into settings. `AppTitleBar.vue` remains the
single auto-refresh trigger and continues to render synchronously from cached
settings before the refresh completes.

**Tech Stack:** Vue 3, TypeScript, Electron renderer, existing
`settingsService`, existing model fetcher utilities, Node.js built-in test
runner (`node:test`) invoked via `pnpm exec tsx --test`

---

### Task 1: Expand Settings Model Contract

**Files:**

- Modify: `apps/desktop/src/services/settings.service.ts`
- Modify: `apps/desktop/src/types/ai-providers.types.ts`
- Modify: `apps/desktop/src/utils/provider-config-merge.ts`
- Test: `apps/desktop/src/utils/provider-config-merge.test.ts`
- Test: `apps/desktop/src/services/settings.service.ts` consumers compile
  cleanly

- [ ] **Step 1: Inspect current persisted settings model contract**

Read and confirm the current mismatch between:

- `settings.service.ts` using `ModelConfig { id, name, enabled }`
- actual provider/model usage in `AppTitleBar.vue`, `SettingsView.vue`, and
  runtime services requiring richer `AIModel` fields

Expected: confirmed need to align `settings.aiProviders[].models` with
runtime-safe `AIModel`-compatible fields.

- [ ] **Step 2: Update settings types to support runtime-safe cached models**

Modify `apps/desktop/src/services/settings.service.ts` so
`AIProviderConfig.models` no longer uses the narrow `ModelConfig[]` shape.

Use a shape compatible with current runtime usage, for example by importing
`AIModel` and allowing persisted models to carry:

```ts
import type { AIModel } from '../types/ai-providers.types'

export interface AIProviderConfig {
  id: string
  name: string
  enabled: boolean
  apiKey?: string
  endpoint?: string
  config?: Record<string, any>
  models?: AIModel[]
}
```

- [ ] **Step 3: Run type-aware spot checks mentally against existing consumers**

Confirm the updated contract still fits:

- `AppTitleBar.vue`
- `SettingsView.vue`
- `TerminalView.vue`
- `ai-api.service.ts`

Expected: no consumer should depend on the old narrow `ModelConfig` contract.

- [ ] **Step 4: Fix provider merge behavior for intentionally empty model
      lists**

Update `apps/desktop/src/utils/provider-config-merge.ts` so a saved provider
with `models: []` does not get repopulated from defaults. This is required for
the spec rule where a successful refresh with zero qualified `openrouter-free`
models must persist as an empty list.

Add/update tests in `apps/desktop/src/utils/provider-config-merge.test.ts` to
cover this exact behavior.

- [ ] **Step 5: Commit**

```bash
git add apps/desktop/src/services/settings.service.ts apps/desktop/src/types/ai-providers.types.ts apps/desktop/src/utils/provider-config-merge.ts apps/desktop/src/utils/provider-config-merge.test.ts
git commit -m "refactor: align persisted AI provider model types"
```

### Task 2: Extend OpenRouter Model Parsing Helpers

**Files:**

- Modify: `apps/desktop/src/services/model-fetcher.service.ts`
- Test: `apps/desktop/src/services/model-fetcher.service.ts` helper coverage via
  new service tests later

- [ ] **Step 1: Add metadata parsing helpers for OpenRouter free filtering**

In `apps/desktop/src/services/model-fetcher.service.ts`, add small pure helpers
to parse:

- release timestamp
- parameter count from structured fields or description text
- normalized context window

Example helper signatures:

```ts
function parseOpenRouterReleaseDate(model: any): number | null
function parseOpenRouterParameterBillions(model: any): number | null
function getOpenRouterContextWindow(model: any): number
```

- [ ] **Step 2: Keep `fetchOpenRouterModels` runtime-safe**

Ensure `fetchOpenRouterModels()` still returns runtime-usable `AIModel[]`
fields:

```ts
return {
  id: model.id,
  name: model.name || model.id,
  description: model.description,
  providerId: 'openrouter',
  contextWindow,
  capabilities,
  price
}
```

Do not bake final business filtering into this generic fetcher beyond existing
provider normalization.

- [ ] **Step 3: Export only the helpers needed by the refresh service**

Export the parsing helpers if the dedicated refresh service will reuse them;
otherwise keep them local and duplicate nothing unnecessarily.

- [ ] **Step 4: Commit**

```bash
git add apps/desktop/src/services/model-fetcher.service.ts
git commit -m "refactor: add openrouter model metadata parsers"
```

### Task 3: Implement Dedicated OpenRouter Free Refresh Service

**Files:**

- Create: `apps/desktop/src/services/openrouter-free-model-refresh.service.ts`
- Modify: `apps/desktop/src/types/ai-providers.platforms.ts`
- Test:
  `apps/desktop/src/services/openrouter-free-model-refresh.service.test.ts`

- [ ] **Step 1: Create the refresh service skeleton**

Create `apps/desktop/src/services/openrouter-free-model-refresh.service.ts` with
a focused public API:

```ts
export async function refreshOpenRouterFreeModels(): Promise<{
  updated: boolean
  models: AIModel[]
  selectionCleared: boolean
  selectionUpdated: boolean
  selection: { provider: any; model: any } | null
}>
```

And internal helpers for:

- locating/upserting the managed provider
- TTL checks
- in-flight promise dedupe
- candidate filtering
- candidate verification
- patch-saving latest settings

- [ ] **Step 2: Verify managed-provider preset flags in platform defaults**

Update or confirm `apps/desktop/src/types/ai-providers.platforms.ts` keeps
`openrouter-free` marked as app-managed, including config semantics for:

- `managedByApp: true`
- read-only API key
- non-removable behavior
- non-disableable behavior

This step is required so later `SettingsView.vue` enforcement can rely on
provider config instead of ad hoc checks.

- [ ] **Step 3: Resolve the managed provider source safely**

Implement logic that:

- reads latest settings
- finds `openrouter-free` in `settings.aiProviders`
- if missing, clones the default preset from
  `apps/desktop/src/types/ai-providers.platforms.ts`
- backfills missing `apiKey` / `endpoint` / `config` on old incomplete entries
- preserves existing non-empty fields
- forces managed behavior expectations without silently rewriting unrelated
  provider fields

When an existing `openrouter-free` entry is incomplete, the service must prepare
the fully backfilled provider object that will also be persisted later if a
write occurs. Do not verify with one provider shape and save another.

- [ ] **Step 4: Implement TTL and in-flight dedupe**

Use:

- module-level promise for same-renderer dedupe
- `localStorage` timestamps for cross-restart TTL

Suggested keys:

```ts
const LAST_SUCCESS_KEY = 'openrouterFreeRefreshLastSuccessAt'
const LAST_FAILURE_KEY = 'openrouterFreeRefreshLastFailureAt'
```

Rules:

- standard TTL: 30 minutes when cached models are non-empty
- failure TTL: 1-5 minutes when cache is empty or first bootstrap failed

- [ ] **Step 5: Fetch and filter OpenRouter free candidates**

Call existing OpenRouter model discovery using the managed provider config, then
filter by:

- `id.endsWith(':free')`
- release date within 6 months
- parameter size `>= 200`
- `contextWindow >= 200000`

Reject any model with missing required metadata.

- [ ] **Step 6: Add stable dedupe and sorting**

Before verification or before persistence, normalize candidates by:

- dedupe on `model.id`
- sort by release date desc
- then context window desc
- then name asc

- [ ] **Step 7: Verify candidates with lightweight real calls**

Implement minimal OpenRouter chat verification with:

```ts
{
  model: candidate.id,
  messages: [{ role: 'user', content: 'ping' }],
  max_tokens: 4,
  temperature: 0
}
```

Success requires:

- HTTP 2xx
- parseable JSON
- non-empty text output in `choices[0].message.content` or equivalent

Treat timeout / 401 / 404 / 429 / empty response as failure.

Add explicit controls:

- timeout via `AbortController`
- small concurrency limit for candidate verification
- skip-refresh branch when neither saved nor default managed provider has a
  usable key

- [ ] **Step 8: Preserve per-model enabled state at write time**

Before saving, re-read latest settings again and preserve `enabled` from the
latest `openrouter-free.models` for matching `model.id` values.

New models default to:

```ts
enabled: true
```

This latest-read preservation step is required so in-flight refreshes do not
overwrite concurrent model toggle changes.

- [ ] **Step 9: Patch-save only the managed provider**

Write back by patching only `settings.aiProviders[openrouter-free]`:

- existing provider: replace `models` and persist any just-backfilled managed
  fields (`apiKey`, `endpoint`, `config`) that were required to make the saved
  provider complete
- missing provider: insert default managed provider with `enabled: true`

Do not replace the whole settings snapshot.

Before calling `saveSettings()`, compare the normalized refreshed model list
with the latest cached `openrouter-free.models`.

Skip persistence only when both conditions are true:

- normalized models are unchanged
- no provider-field backfill was needed

If provider backfill was needed, still persist the managed provider even when
the model list itself is unchanged.

After a successful refresh save, dispatch the shared update events already used
elsewhere in the app:

```ts
window.dispatchEvent(new CustomEvent('settings-updated'))
window.dispatchEvent(new CustomEvent('ai-provider-configs-updated'))
```

This is required so Settings and other open surfaces can rehydrate from the new
shared cache.

- [ ] **Step 10: Clear or refresh selected model payload and notify all
      consumers**

If `localStorage.selectedAIModel` points to a model no longer present after
refresh:

- remove `selectedAIModel`
- return `selectionCleared: true`

The caller must then broadcast:

```ts
window.dispatchEvent(new CustomEvent('ai-model-changed', { detail: null }))
```

so `TerminalView.vue`, `PromptOptimizerView.vue`, `ai-suggestion-manager.ts`,
and `useTerminalAutocomplete.ts` observe the cleared selection.

If the selected model ID is still valid after refresh but the backing provider
or model metadata changed, rewrite `localStorage.selectedAIModel` with the
latest full `{ provider, model }` payload so all consumers read fresh metadata
instead of stale cached objects.

When the payload is rewritten for a still-valid model, also broadcast:

```ts
window.dispatchEvent(new CustomEvent('ai-model-changed', { detail: selection }))
```

so long-lived consumers refresh in-memory state without waiting for reload.

- [ ] **Step 11: Write focused unit tests for the refresh service**

Create `apps/desktop/src/services/openrouter-free-model-refresh.service.test.ts`
covering:

- bootstrap from missing provider
- backfill incomplete provider fields
- request failure keeps old cache
- success with zero qualified models writes empty list
- latest `enabled` state preservation
- fixed sorting and dedupe
- invalid selected model clears storage
- valid selected model gets its stored full payload refreshed
- empty-cache failure uses short TTL
- no usable key available skips refresh cleanly
- verification timeout and limited concurrency behavior
- saveSettings failure during refresh leaves UI/provider cache stable
- unchanged models plus required provider backfill still persist managed fields
- valid selected model metadata rewrite emits update event
- verification request uses the exact same backfilled provider config that is
  ultimately persisted

- [ ] **Step 12: Run the targeted test file**

Run:
`pnpm exec tsx --test apps/desktop/src/services/openrouter-free-model-refresh.service.test.ts`

Expected: PASS

- [ ] **Step 13: Commit**

```bash
git add apps/desktop/src/services/openrouter-free-model-refresh.service.ts apps/desktop/src/services/openrouter-free-model-refresh.service.test.ts apps/desktop/src/types/ai-providers.platforms.ts
git commit -m "feat: refresh and validate managed openrouter free models"
```

### Task 4: Enforce Managed Provider UI Rules In Settings

**Files:**

- Modify: `apps/desktop/src/views/SettingsView.vue`
- Test: `apps/desktop/src/views/SettingsView.managed-provider.test.ts`

- [ ] **Step 1: Locate current managed-provider controls in SettingsView**

Identify the exact branches already using `provider.config?.managedByApp`,
`readOnlyApiKey`, and related flags.

- [ ] **Step 2: Hide or disable forbidden controls for `openrouter-free`**

Update `SettingsView.vue` so the managed provider cannot:

- be disabled
- be removed
- have its API key edited

Preferred implementation: reuse existing config flags rather than adding ad hoc
`provider.id === 'openrouter-free'` checks everywhere.

- [ ] **Step 3: Preserve model enable toggles unless intentionally locked**

Ensure the user can still enable/disable individual `openrouter-free` models if
that is already supported by the settings UI, while the provider itself remains
managed.

- [ ] **Step 4: Implement required stale-save protection in Settings**

Confirm `saveAIProviderConfigs()` keeps `apiKey`, `endpoint`, `config`, and
refreshed `models` for managed providers intact.

`SettingsView.vue` currently keeps a local `aiProviders` working copy, so add a
required merge/reload strategy to prevent a background title-bar refresh of
`openrouter-free.models` from being overwritten by a stale settings save.
Required approach: re-read latest settings before save and patch local edits
onto the latest provider array instead of blindly saving the stale in-memory
snapshot.

Use a field-level merge rule for `openrouter-free` so stale local state cannot
overwrite freshly refreshed managed fields:

- preserve latest `models`
- preserve latest backfilled `apiKey` / `endpoint` / `config`
- preserve user edits only for fields the settings UI is actually allowed to
  change
- for per-model state, merge local `model.enabled` onto the latest refreshed
  model list by `model.id`

Also add explicit failure handling verification so any Settings save path that
ultimately calls `saveSettings()` does not clear managed provider models or
corrupt other providers.

- [ ] **Step 5: Add live-refresh rehydration while Settings is open**

When the title bar writes refreshed `openrouter-free.models` and dispatches the
existing settings/model update events, `SettingsView.vue` must rehydrate its
local `aiProviders` working copy so the refreshed model list appears without
requiring the user to close and reopen Settings.

Because `SettingsView.vue` already has autosave-style persistence, this
rehydration path must include a suppress-autosave guard so background refresh
events do not immediately trigger another save cycle.

Any Settings save path that serializes the local `aiProviders` working copy back
through `saveSettings()` must use the same guarded merge flow, not just
`saveAIProviderConfigs()`.

- [ ] **Step 6: Add automated coverage for stale-save merge behavior**

Add a focused test for the settings merge/save path. Minimum behavior to verify:

- background refreshed `openrouter-free.models` is preserved
- concurrent provider edits are not clobbered
- save failure does not clear managed provider models or other providers
- live-refresh rehydration updates the visible managed model list while Settings
  stays open
- shared refresh-save events trigger the Settings rehydration path
- autosave suppression prevents refresh rehydration from immediately re-saving
- unrelated provider changes made concurrently are preserved after refresh

- [ ] **Step 7: Manual verification of settings behavior**

Verify in settings UI:

- managed provider is visible
- no editable key input
- no delete control
- no provider disable toggle
- refreshed model list appears
- refreshed model list appears without reopening Settings
- background refreshed models are not lost after saving another setting while
  Settings is open
- settings save failure does not clear `openrouter-free.models` or other
  provider configs

- [ ] **Step 8: Commit**

```bash
git add apps/desktop/src/views/SettingsView.vue apps/desktop/src/views/SettingsView.managed-provider.test.ts
git commit -m "feat: enforce managed openrouter free provider settings"
```

### Task 5: Wire Refresh Into AppTitleBar

**Files:**

- Modify: `apps/desktop/src/components/layout/AppTitleBar.vue`
- Modify: `apps/desktop/src/views/TerminalView.vue`
- Modify: `apps/desktop/src/views/PromptOptimizerView.vue`
- Modify: `apps/desktop/src/services/autocomplete/ai-suggestion-manager.ts`
- Modify: `apps/desktop/src/composables/useTerminalAutocomplete.ts`
- Test: `apps/desktop/src/components/layout/AppTitleBar.model-refresh.test.ts`
- Test: `apps/desktop/src/components/layout/model-selection-sync.test.ts`

- [ ] **Step 1: Keep synchronous cached model loading intact**

Do not block `loadAvailableModels()` on network refresh. It should still:

- read settings
- build `availableModels`
- load current selection from cache

Adjust the provider inclusion rule so cached `openrouter-free.models` can still
render on first load even if an old saved provider is missing `apiKey`, as long
as the provider is managed and has cached models. Do not hide first-render cache
solely because an old managed entry is incomplete.

- [ ] **Step 2: Harden initial invalid-selection fallback**

Update `loadCurrentModel()` so that when `selectedAIModel` does not resolve in
current `availableModels`, it:

- clears `localStorage.selectedAIModel`
- resets `currentModel.value` to the default “未选择/Select Model” placeholder
- broadcasts a cleared model event for consistency

- [ ] **Step 3: Update same-window selection consumers to handle cleared or
      refreshed selection**

Adjust the current consumers so they do not keep stale in-memory model state
when `selectedAIModel` is removed or rewritten in the same window:

- `apps/desktop/src/views/TerminalView.vue`
- `apps/desktop/src/views/PromptOptimizerView.vue`
- `apps/desktop/src/services/autocomplete/ai-suggestion-manager.ts`
- `apps/desktop/src/composables/useTerminalAutocomplete.ts`

At minimum:

- react to `ai-model-changed` with `detail: null` by clearing current
  provider/model state
- react to refreshed `{ provider, model }` payloads by replacing stale in-memory
  state
- do not rely only on the `storage` event for same-window updates

- [ ] **Step 4: Trigger background refresh from `onMounted()`**

After the initial `loadAvailableModels()` call, trigger:

```ts
void refreshOpenRouterFreeModels().then(async result => {
  if (result.updated) {
    await loadAvailableModels()
  }
  if (result.selectionCleared) {
    window.dispatchEvent(new CustomEvent('ai-model-changed', { detail: null }))
  } else if (result.selectionUpdated) {
    window.dispatchEvent(
      new CustomEvent('ai-model-changed', { detail: result.selection })
    )
  }
})
```

Handle errors silently except for debug logging.

After refresh resolution, always reconcile the title bar in-memory state with
the latest storage state:

- if selection was cleared, reset `currentModel.value` immediately
- if selection payload was updated, replace `currentModel.value` with the latest
  selected model
- if provider models changed, reload available models even when the selection
  did not change

- [ ] **Step 5: Add automated coverage for title-bar and selection sync
      behavior**

Add tests covering:

- cached models render before async refresh completes
- invalid startup selection is cleared immediately
- valid selection payload refresh updates listeners in the same window
- cleared selection propagates to the same-window consumers above
- other providers still render when `openrouter-free` becomes empty

- [ ] **Step 6: Avoid duplicate refreshes from dropdown open**

Keep `toggleModelDropdown()` behavior simple. Reopening the dropdown may still
call `loadAvailableModels()`, but should not force a second network refresh
because the refresh service dedupe/TTL now owns that concern.

- [ ] **Step 7: Manual verification in the component flow**

Verify:

- cached models render immediately
- refresh updates list later
- invalid selected model falls back cleanly
- valid selected model metadata refreshes across listeners
- other providers still appear

Add or extend automated coverage for title-bar-facing selection/loading logic so
these behaviors are not manual-only:

- cached models are used before async refresh completes
- invalid startup selection is cleared immediately
- other providers still render when `openrouter-free` becomes empty
- post-refresh selection clear or update immediately changes title-bar in-memory
  state
- refresh-save events drive listener updates across open surfaces

- [ ] **Step 8: Commit**

```bash
git add apps/desktop/src/components/layout/AppTitleBar.vue apps/desktop/src/components/layout/AppTitleBar.model-refresh.test.ts apps/desktop/src/components/layout/model-selection-sync.test.ts apps/desktop/src/views/TerminalView.vue apps/desktop/src/views/PromptOptimizerView.vue apps/desktop/src/services/autocomplete/ai-suggestion-manager.ts apps/desktop/src/composables/useTerminalAutocomplete.ts
git commit -m "feat: refresh openrouter free models from title bar"
```

### Task 6: Verify End-to-End Behavior

**Files:**

- Modify: none unless fixes are needed
- Test: targeted tests and app-level verification

- [ ] **Step 1: Run targeted tests for changed logic**

Run:
`pnpm exec tsx --test apps/desktop/src/services/openrouter-free-model-refresh.service.test.ts apps/desktop/src/utils/provider-config-merge.test.ts apps/desktop/src/views/SettingsView.managed-provider.test.ts apps/desktop/src/components/layout/AppTitleBar.model-refresh.test.ts apps/desktop/src/components/layout/model-selection-sync.test.ts`

Expected: PASS

- [ ] **Step 2: Run any relevant lint/typecheck command used by this repo**

Run the smallest repo-standard verification command available for desktop app
TypeScript/Vue files.

Expected: PASS without new type errors.

- [ ] **Step 3: Perform manual behavior checklist**

Verify manually:

- title bar shows cached models immediately
- async refresh updates only `openrouter-free`
- invalid model selections are cleared and all listeners react
- empty qualified result removes only `openrouter-free` models
- other custom providers remain selectable
- managed provider settings cannot be disabled/deleted/edited
- settings page reflects refreshed managed models without reopening
- saving settings after a background refresh does not restore stale
  `openrouter-free.models`
- unchanged refresh results do not trigger unnecessary `saveSettings()` writes
- selected model payload is refreshed when metadata changes but model ID stays
  valid

- [ ] **Step 4: Commit final verification or fixups if needed**

```bash
git add .
git commit -m "test: verify managed openrouter free model refresh flow"
```
