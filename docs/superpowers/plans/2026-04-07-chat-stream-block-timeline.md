# Chat Stream Block Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render assistant output in strict execution order by storing explicit
`analysis`, `inquiry`, `tool`, and `summary` blocks during streaming instead of
inferring layout afterward.

**Architecture:** Replace the current category-based assistant rendering with a
timeline model written at stream time. `text-delta` appends into the current
text block, `ask_followup_question` becomes an `inquiry` block, normal tool
calls remain `tool` blocks, and final assistant text is marked as `summary` once
the processor finishes. The Vue template should iterate a single ordered block
list instead of rendering fixed sections.

**Tech Stack:** Vue 3 SFC, TypeScript, node:test, existing chat message model in
`apps/desktop/src/services/messages/message.ts`

---

### Task 1: Extend Message Parts For Ordered Assistant Blocks

**Files:**

- Modify: `apps/desktop/src/services/messages/message.ts`
- Test: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions showing the chat view expects block-oriented helpers such as
`getOrderedBlocks(msg)` and no longer depends on fixed
`preToolText/postToolText/followUpQuestion` rendering zones.

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: FAIL because the new ordered-block helpers and timeline rendering do
not exist yet.

- [ ] **Step 3: Write minimal implementation**

Add explicit assistant block typing in `message.ts`, for example:

```ts
export type AssistantBlockKind = 'analysis' | 'inquiry' | 'summary'

export interface AssistantTextPart {
  type: 'text'
  text: string
  kind?: AssistantBlockKind
}
```

Keep compatibility narrow: only extend existing parts enough to let the
component distinguish chronological text blocks without inventing a second
storage system.

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: the structural assertions for block-oriented rendering now pass.

### Task 2: Write Stream-Time Block Semantics In The Chat Session Handler

**Files:**

- Modify: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue`
- Test: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions for stream-time helpers or branches that:

- append `text-delta` into the latest text block
- create an `inquiry` block when the tool is `ask_followup_question`
- promote the last text block to `summary` on final `done: stop`

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: FAIL because the stream handler still writes generic text and tool
parts.

- [ ] **Step 3: Write minimal implementation**

In `sendMessageWithTools(...)`:

```ts
case 'text-delta':
  appendAssistantTextBlock(currentMsg, event.delta)

case 'tool-call':
  if (event.toolName === 'ask_followup_question') {
    currentMsg.parts.push(createInquiryPart(event))
    break
  }
  currentMsg.parts.push(createToolPart(event))

case 'done':
  if (event.finish === 'stop') {
    markLastAssistantTextBlockAsSummary(currentMsg)
  }
```

Rules:

- text before any inquiry/tool remains `analysis`
- text after inquiry/tool resumes as `analysis` until the final stop
- only the trailing text block at final completion becomes `summary`
- `ask_followup_question` must never render as a normal tool card again

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: stream-handler assertions pass.

### Task 3: Replace Section-Based Rendering With Timeline Rendering

**Files:**

- Modify: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue`
- Test: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions that the assistant template renders a single ordered list of
blocks and that inquiry/summary share the same `oc-response` visual shell while
tools keep `oc-tool` rendering.

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: FAIL because the template still renders separate
analysis/tools/response sections.

- [ ] **Step 3: Write minimal implementation**

Build a display helper such as:

```ts
function getOrderedBlocks(msg: V2Message): DisplayBlock[] {
  return msg.parts.flatMap(part => mapPartToDisplayBlock(part))
}
```

Then update the template to:

- loop over `msg.blocks`
- render `analysis` blocks as markdown / compact-analysis panel
- render `inquiry` and `summary` blocks with the shared `oc-response` container
  and distinct titles
- render `tool` blocks with the existing expandable tool UI
- leave `todos` and `diffs` anchored near the specific tool block that produced
  them if feasible; if not, keep them after the related tool section without
  reordering earlier blocks

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: timeline rendering assertions pass.

### Task 4: Remove Obsolete Heuristics And Keep Copy Behavior Working

**Files:**

- Modify: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue`
- Test: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions that the old fallback split helpers (`extractPreToolText`,
`extractPostToolText`, `splitAnalysisAndSummary`, `extractFollowUpQuestion`) are
no longer the primary display path, and that copy buttons still target the
inquiry/summary text.

- [ ] **Step 2: Run test to verify it fails**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: FAIL because the old helper path is still present.

- [ ] **Step 3: Write minimal implementation**

Delete stale display helpers and wire copy actions to the ordered block payload
directly. Keep CSS changes minimal by reusing `oc-response` and
`oc-analysis-block` styles where possible.

- [ ] **Step 4: Run test to verify it passes**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: timeline-only assertions pass with no fallback zones left.

### Task 5: Final Verification

**Files:**

- Verify only: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue`
- Verify only: `apps/desktop/src/services/messages/message.ts`
- Verify only: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts`

- [ ] **Step 1: Run focused tests**

Run:
`node --test "apps/desktop/src/components/chat/AIChatOpenCodeStyle.test.ts"`
Expected: all tests pass.

- [ ] **Step 2: Read the changed sections once for ordering sanity**

Check that the event handler can produce this sequence without reordering:

```text
analysis -> inquiry -> analysis -> tool -> summary
```

- [ ] **Step 3: Optional manual follow-up**

If a reproducible local flow exists later, manually verify one real assistant
session where `ask_followup_question` appears before additional analysis and
tools.
